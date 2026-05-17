import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from '../context/AccountContext'
import { useLanguage } from '../context/LanguageContext'

export default function Account() {
  const { user, logout } = useAccount()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  if (!user) {
    return (
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-4 block">account_circle</span>
          <h1 className="font-garamond text-headline-md text-primary mb-4">
            {lang === 'ar' ? 'سجلي دخولك أولاً' : 'Please Sign In'}
          </h1>
          <p className="font-jakarta text-body-md text-on-surface-variant mb-8">
            {lang === 'ar' ? 'قومي بتسجيل الدخول لعرض حسابك ونقاطك' : 'Sign in to view your account and points'}
          </p>
          <Link
            to="/login"
            className="bg-primary text-on-primary px-10 py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity inline-block"
          >
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </motion.div>
      </main>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const pointsForDiscount = 100
  const canRedeem = user.points >= pointsForDiscount

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-garamond text-headline-md text-primary mb-1">
              {lang === 'ar' ? `مرحباً، ${user.name}` : `Welcome, ${user.name}`}
            </h1>
            <p className="font-jakarta text-body-sm text-on-surface-variant">{user.phone}</p>
            {user.email && <p className="font-jakarta text-body-sm text-on-surface-variant">{user.email}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-outline-variant/50 text-on-surface-variant px-5 py-2 rounded-full font-jakarta text-label-md hover:border-error hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-12">
        {/* Points card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-primary rounded-2xl p-8 text-right relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-end gap-3 mb-4">
              <span className="font-jakarta text-label-md text-on-primary/70">
                {lang === 'ar' ? 'نقاط سايا المتراكمة' : 'Saya Points Balance'}
              </span>
              <span className="material-symbols-outlined text-on-primary ms-filled">stars</span>
            </div>
            <div className="font-garamond text-[64px] text-on-primary leading-none mb-4">
              {user.points || 0}
            </div>
            <p className="font-jakarta text-body-sm text-on-primary/70 mb-6">
              {lang === 'ar'
                ? 'كل ١٠٠ نقطة = خصم ١٠ ج.م على طلبك القادم'
                : 'Every 100 points = 10 EGP off your next order'}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-4 py-2 rounded-full font-jakarta text-label-md ${canRedeem ? 'bg-white text-primary' : 'bg-white/20 text-on-primary/60'}`}>
                {canRedeem
                  ? (lang === 'ar' ? 'يمكنك الاسترداد الآن!' : 'Ready to redeem!')
                  : (lang === 'ar'
                      ? `تحتاجين ${pointsForDiscount - (user.points || 0)} نقطة أخرى`
                      : `Need ${pointsForDiscount - (user.points || 0)} more points`)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* How to earn */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary-fixed/20 rounded-2xl p-6 text-right"
        >
          <h3 className="font-garamond text-headline-sm text-primary mb-4">
            {lang === 'ar' ? 'كيف تكسبين نقاطاً؟' : 'How to Earn Points?'}
          </h3>
          <ul className="space-y-4">
            {[
              { icon: 'shopping_cart', text: lang === 'ar' ? '١٠ نقاط لكل ١٠٠ ج.م' : '10 pts per 100 EGP spent' },
              { icon: 'redeem', text: lang === 'ar' ? '١٠٠ نقطة = خصم ١٠ ج.م' : '100 pts = 10 EGP off' },
              { icon: 'stars', text: lang === 'ar' ? 'النقاط لا تنتهي' : 'Points never expire' },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 justify-end">
                <span className="font-jakarta text-body-sm text-on-surface-variant">{item.text}</span>
                <span className="material-symbols-outlined text-secondary text-[20px] ms-filled flex-shrink-0">{item.icon}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Order History */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-garamond text-headline-sm text-primary mb-6 text-right">
          {lang === 'ar' ? 'طلباتي السابقة' : 'My Orders'}
        </h2>

        {(!user.orders || user.orders.length === 0) ? (
          <div className="bg-surface-container-low rounded-2xl p-12 text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-4 block">receipt_long</span>
            <p className="font-jakarta text-body-md text-on-surface-variant mb-6">
              {lang === 'ar' ? 'لا توجد طلبات سابقة حتى الآن' : 'No orders yet'}
            </p>
            <Link
              to="/shop"
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity inline-block"
            >
              {lang === 'ar' ? 'تسوقي الآن' : 'Start Shopping'}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.orders.map((order, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 flex items-center justify-between flex-wrap gap-4">
                <div className="text-right">
                  <p className="font-jakarta text-label-md text-on-surface-variant mb-1">
                    {lang === 'ar' ? 'رقم الطلب' : 'Order'} #{order.id || `SY-${1000 + i}`}
                  </p>
                  <p className="font-jakarta text-body-sm text-on-surface-variant/70">
                    {order.date || new Date().toLocaleDateString('ar-EG')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-garamond text-headline-sm text-primary">{order.total || '--'} ج.م</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-jakarta text-label-md">
                    {lang === 'ar' ? 'تم التأكيد' : 'Confirmed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </main>
  )
}
