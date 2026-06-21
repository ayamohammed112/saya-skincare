import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import FirstOrderPopup from './components/FirstOrderPopup'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Contact from './pages/Contact'
import OrderTracking from './pages/OrderTracking'
import Login from './pages/Login'
import Account from './pages/Account'
import SkinQuiz from './pages/SkinQuiz'
import Bundles from './pages/Bundles'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import AdminBundles from './pages/AdminBundles'
import AdminPanel from './pages/AdminPanel'
import { useCart } from './context/CartContext'
import { useLanguage } from './context/LanguageContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function CartToast() {
  const { toast } = useCart()
  const { lang } = useLanguage()

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 md:bottom-10 right-4 md:right-8 z-[100] bg-primary text-on-primary px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-xs"
        >
          <span className="material-symbols-outlined text-[22px] ms-filled flex-shrink-0">check_circle</span>
          <div>
            <p className="font-jakarta text-label-md font-bold">
              {lang === 'ar' ? 'أُضيف إلى السلة' : 'Added to cart'}
            </p>
            <p className="font-jakarta text-[11px] opacity-80 mt-0.5 line-clamp-1">
              {lang === 'ar' ? toast.name : (toast.nameEn || toast.name)}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Routes location={location} key={location.pathname}>
        <Route path="/admin/bundles" element={<AdminBundles />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
          <Route path="/shop/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/tracking" element={<PageTransition><OrderTracking /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><SkinQuiz /></PageTransition>} />
          <Route path="/bundles" element={<PageTransition><Bundles /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <WhatsAppButton />
      <CartToast />
      <FirstOrderPopup />
    </div>
  )
}
