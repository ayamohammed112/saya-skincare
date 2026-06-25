import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Dashboard from './admin/Dashboard'
import OrdersSection from './admin/OrdersSection'
import ProductsSection from './admin/ProductsSection'
import BundlesSection from './admin/BundlesSection'
import CustomersSection from './admin/CustomersSection'
import DiscountCodesSection from './admin/DiscountCodesSection'
import AnalyticsSection from './admin/AnalyticsSection'
import SkinQuizSection from './admin/SkinQuizSection'

const ADMIN_PASSWORD = 'Aya321'
const AUTH_KEY = 'saya_admin_auth'

const NAV = [
  { id: 'dashboard', label: 'لوحة التحكم', labelEn: 'Dashboard', icon: '⊞' },
  { id: 'orders', label: 'الطلبات', labelEn: 'Orders', icon: '📦' },
  { id: 'products', label: 'المنتجات', labelEn: 'Products', icon: '🧴' },
  { id: 'bundles', label: 'باكيدجات', labelEn: 'Bundles', icon: '🎁' },
  { id: 'customers', label: 'العملاء', labelEn: 'Customers', icon: '👥' },
  { id: 'discounts', label: 'كودات الخصم', labelEn: 'Discounts', icon: '🏷️' },
  { id: 'analytics', label: 'التحليلات', labelEn: 'Analytics', icon: '📊' },
  { id: 'quiz', label: 'نتائج الاختبار', labelEn: 'Skin Quiz', icon: '✨' },
]

function playCashRegister() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [1200, 900, 1500]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.12
      gain.gain.setValueAtTime(0.25, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
      osc.start(t)
      osc.stop(t + 0.2)
    })
  } catch (_) {}
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

function sendBrowserNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' })
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newOrderNotif, setNewOrderNotif] = useState(null)
  const notifTimer = useRef(null)

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setAuthed(true)
      requestNotificationPermission()
      registerServiceWorker()
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 1500)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthed(false)
    setPw('')
  }

  const handleNewOrder = useCallback((payload) => {
    playCashRegister()
    const order = payload.new
    const msg = `طلب جديد من ${order.customer_name || 'عميل'} — ${order.total || ''} ج.م`
    setNewOrderNotif(msg)
    sendBrowserNotification('🛍️ طلب جديد | New Order', msg)
    clearTimeout(notifTimer.current)
    notifTimer.current = setTimeout(() => setNewOrderNotif(null), 6000)
  }, [])

  useEffect(() => {
    if (!authed) return
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, handleNewOrder)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
      clearTimeout(notifTimer.current)
    }
  }, [authed, handleNewOrder])

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌿</div>
            <h1 className="text-2xl font-bold text-white mb-1">Saya Admin</h1>
            <p className="text-gray-400 text-sm">لوحة تحكم | Control Panel</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <label className="block text-gray-400 text-xs font-semibold mb-2 tracking-widest uppercase">
              Password / كلمة المرور
            </label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm ${pwError ? 'border-red-500' : 'border-gray-700 focus:border-emerald-500'}`}
              placeholder="••••••••"
              autoFocus
            />
            {pwError && <p className="text-red-400 text-xs mt-2">كلمة المرور غير صحيحة | Incorrect password</p>}
            <button
              onClick={handleLogin}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              دخول | Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const SectionMap = {
    dashboard: Dashboard,
    orders: OrdersSection,
    products: ProductsSection,
    bundles: BundlesSection,
    customers: CustomersSection,
    discounts: DiscountCodesSection,
    analytics: AnalyticsSection,
    quiz: SkinQuizSection,
  }
  const ActiveSection = SectionMap[activeSection]

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-64 bg-gray-900 border-l border-gray-800 z-30 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:translate-x-0 lg:flex`}>
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <p className="text-white font-bold text-sm">Saya Admin</p>
              <p className="text-gray-500 text-xs">لوحة الإدارة</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setActiveSection(n.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm transition-all text-right ${activeSection === n.id ? 'bg-emerald-600/20 text-emerald-400 font-semibold' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}`}
            >
              <span className="text-base">{n.icon}</span>
              <span className="flex-1">{n.label}</span>
              <span className="text-[10px] text-gray-600">{n.labelEn}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-all text-sm"
          >
            <span>🚪</span>
            <span>تسجيل الخروج | Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            ☰
          </button>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-sm">
              {NAV.find(n => n.id === activeSection)?.label} / {NAV.find(n => n.id === activeSection)?.labelEn}
            </h2>
          </div>
          <div className="text-xs text-gray-500">{new Date().toLocaleDateString('ar-EG')}</div>
        </header>

        {/* New order notification */}
        {newOrderNotif && (
          <div className="mx-4 mt-4 bg-emerald-900/50 border border-emerald-500/50 rounded-xl px-4 py-3 text-emerald-300 text-sm flex items-center gap-3 animate-pulse">
            <span className="text-xl">🛍️</span>
            <div>
              <p className="font-semibold">طلب جديد! | New Order!</p>
              <p className="text-xs text-emerald-400">{newOrderNotif}</p>
            </div>
            <button onClick={() => setNewOrderNotif(null)} className="mr-auto text-emerald-500 hover:text-white">✕</button>
          </div>
        )}

        {/* Section content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <ActiveSection />
        </main>
      </div>
    </div>
  )
}
