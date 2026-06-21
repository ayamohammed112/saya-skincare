import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useAccount } from '../context/AccountContext'

export default function Navbar() {
  const { count } = useCart()
  const { tr, lang, toggle } = useLanguage()
  const { user } = useAccount()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const links = [
    { to: '/', label: tr.nav.home },
    { to: '/shop', label: tr.nav.shop },
    { to: '/bundles', label: lang === 'ar' ? 'الحزم' : 'Bundles' },
    { to: '/quiz', label: lang === 'ar' ? 'اختبار البشرة' : 'Skin Quiz' },
    { to: '/about', label: tr.nav.about },
    { to: '/contact', label: tr.nav.contact },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    }
    setSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
        <div className="flex flex-row-reverse justify-between items-center h-20 px-margin-mobile md:px-margin-desktop w-full max-w-site mx-auto">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0">
            <img src="/saya-logo.jpeg" alt="SAYA" className="h-16 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
          </NavLink>

          {/* Desktop Nav */}
          <div className={`hidden md:flex ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'} items-center gap-8`}>
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-body-md font-jakarta transition-colors duration-300 ${isActive
                    ? 'text-primary border-b border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-row-reverse items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="text-label-md font-jakarta text-primary border border-primary rounded-full px-3 py-1 hover:bg-primary hover:text-on-primary transition-colors"
            >
              {lang === 'ar' ? 'EN' : 'عر'}
            </button>

            <button
              onClick={() => { setSearchOpen(o => !o); setMobileOpen(false) }}
              className="hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-primary">
                {searchOpen ? 'close' : 'search'}
              </span>
            </button>

            <button
              onClick={() => navigate(user ? '/account' : '/login')}
              className="relative hover:opacity-80 transition-opacity"
              title={user ? (lang === 'ar' ? 'حسابي' : 'My Account') : (lang === 'ar' ? 'تسجيل الدخول' : 'Sign In')}
            >
              <span className="material-symbols-outlined text-primary">
                {user ? 'account_circle' : 'person'}
              </span>
              {user && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary rounded-full border border-background" />
              )}
            </button>

            <button
              onClick={() => navigate('/checkout')}
              className="relative hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden hover:opacity-80 transition-opacity"
              onClick={() => { setMobileOpen(o => !o); setSearchOpen(false) }}
            >
              <span className="material-symbols-outlined text-primary">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden bg-background border-t border-outline-variant/20"
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3 px-margin-mobile md:px-margin-desktop max-w-site mx-auto py-4"
              >
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'ابحثي عن منتج...' : 'Search for a product...'}
                  className="flex-1 bg-transparent focus:outline-none font-jakarta text-body-md text-on-surface placeholder:text-on-surface-variant/60"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-t border-outline-variant/20 overflow-hidden"
            >
              <div className="flex flex-col gap-0 px-margin-mobile py-4">
                {links.map(l => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `py-3 text-body-md font-jakarta border-b border-outline-variant/10 ${isActive ? 'text-primary font-bold' : 'text-on-surface-variant'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-outline-variant/10 h-16 flex items-center justify-around z-50">
        {[
          { to: '/', icon: 'home', label: tr.nav.home },
          { to: '/shop', icon: 'shopping_bag', label: tr.nav.shop },
          { to: '/checkout', icon: 'shopping_cart', label: lang === 'ar' ? 'السلة' : 'Cart' },
          { to: user ? '/account' : '/login', icon: user ? 'account_circle' : 'person', label: lang === 'ar' ? 'حسابي' : 'Account' },
        ].map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-[10px] font-jakarta">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
