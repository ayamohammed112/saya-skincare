import { createContext, useContext, useState } from 'react'

const RecentlyViewedContext = createContext(null)

export function RecentlyViewedProvider({ children }) {
  const [viewedIds, setViewedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('saya_rv')) || [] } catch { return [] }
  })

  const track = (id) => {
    setViewedIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 8)
      localStorage.setItem('saya_rv', JSON.stringify(next))
      return next
    })
  }

  return (
    <RecentlyViewedContext.Provider value={{ viewedIds, track }}>
      {children}
    </RecentlyViewedContext.Provider>
  )
}

export const useRecentlyViewed = () => useContext(RecentlyViewedContext)
