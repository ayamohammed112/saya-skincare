import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AccountContext = createContext(null)

function loadAccount(phone) {
  try { return JSON.parse(localStorage.getItem(`saya_acct_${phone}`)) } catch { return null }
}

function saveAccount(account) {
  localStorage.setItem(`saya_acct_${account.phone}`, JSON.stringify(account))
}

export function AccountProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const phone = localStorage.getItem('saya_session')
      return phone ? loadAccount(phone) : null
    } catch { return null }
  })

  // On session restore, sync points from Supabase (handles multi-device use)
  useEffect(() => {
    const phone = localStorage.getItem('saya_session')
    if (!phone) return
    supabase.from('customers').select('points, name, email').eq('phone', phone).single()
      .then(({ data }) => {
        if (!data) return
        const local = loadAccount(phone)
        if (!local) return
        const updated = { ...local, points: data.points }
        saveAccount(updated)
        setUser(updated)
      })
      .catch(() => {})
  }, [])

  const login = (phone, name, email = '') => {
    const existing = loadAccount(phone)
    const account = existing
      ? { ...existing, name: name || existing.name, email: email || existing.email }
      : { phone, name, email, points: 0, orders: [] }
    saveAccount(account)
    localStorage.setItem('saya_session', phone)
    setUser(account)

    // Sync to Supabase (fire-and-forget — localStorage drives UI)
    supabase.from('customers').upsert(
      { phone, name: account.name, email: account.email || null, points: account.points || 0 },
      { onConflict: 'phone' }
    ).catch(() => {})

    return account
  }

  const logout = () => {
    localStorage.removeItem('saya_session')
    setUser(null)
  }

  const earnPoints = (orderTotal) => {
    if (!user) return 0
    const earned = Math.floor(orderTotal / 100) * 10
    const updated = { ...user, points: (user.points || 0) + earned }
    saveAccount(updated)
    setUser(updated)

    supabase.from('customers').update({ points: updated.points }).eq('phone', user.phone).catch(() => {})

    return earned
  }

  const spendPoints = (pointsToSpend) => {
    if (!user || (user.points || 0) < pointsToSpend) return 0
    const discount = Math.floor(pointsToSpend / 100) * 10
    const updated = { ...user, points: (user.points || 0) - pointsToSpend }
    saveAccount(updated)
    setUser(updated)

    supabase.from('customers').update({ points: updated.points }).eq('phone', user.phone).catch(() => {})

    return discount
  }

  const recordOrder = (order) => {
    if (!user) return
    const updated = { ...user, orders: [order, ...(user.orders || [])] }
    saveAccount(updated)
    setUser(updated)
  }

  return (
    <AccountContext.Provider value={{ user, login, logout, earnPoints, spendPoints, recordOrder }}>
      {children}
    </AccountContext.Provider>
  )
}

export const useAccount = () => useContext(AccountContext)
