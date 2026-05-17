import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
})

const DEMO_STEPS = [0, 1, 2, 3]

export default function OrderTracking() {
  const { tr, lang } = useLanguage()
  const k = tr.tracking

  const [orderNum, setOrderNum] = useState('')
  const [currentStep, setCurrentStep] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!orderNum.trim()) return
    setCurrentStep(2)
    setSearched(true)
  }

  const stepDates = [
    lang === 'ar' ? '١ يناير ٢٠٢٥، ١١:٣٠ ص' : 'Jan 1, 2025, 11:30 AM',
    lang === 'ar' ? '١ يناير ٢٠٢٥، ٣:٠٠ م' : 'Jan 1, 2025, 3:00 PM',
    lang === 'ar' ? '٢ يناير ٢٠٢٥، ٩:٠٠ ص' : 'Jan 2, 2025, 9:00 AM',
    lang === 'ar' ? '٣ يناير ٢٠٢٥، ٢:٠٠ م' : 'Jan 3, 2025, 2:00 PM',
  ]

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
        </div>
        <h1 className="font-garamond text-display-mobile md:text-display-lg text-primary mb-4">{k.title}</h1>
        <p className="font-jakarta text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">{k.sub}</p>
      </motion.div>

      {/* Search box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-xl mx-auto mb-20"
      >
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              value={orderNum}
              onChange={e => setOrderNum(e.target.value)}
              placeholder={k.placeholder}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-full px-6 py-4 font-jakarta text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-center tracking-widest"
              dir="ltr"
            />
            {orderNum && (
              <button
                type="button"
                onClick={() => { setOrderNum(''); setSearched(false); setCurrentStep(null) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="bg-primary text-on-primary px-8 py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            {k.cta}
          </motion.button>
        </form>
        <p className="text-center font-jakarta text-label-md text-on-surface-variant mt-3 opacity-60">
          {lang === 'ar' ? 'جربي: SY-12345' : 'Try: SY-12345'}
        </p>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {searched && currentStep !== null && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto mb-20"
          >
            {/* Order card header */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="bg-primary px-8 py-5 flex justify-between items-center">
                <div className="text-on-primary">
                  <p className="font-jakarta text-label-md opacity-80">{lang === 'ar' ? 'رقم الطلب' : 'Order Number'}</p>
                  <p className="font-garamond text-headline-sm" dir="ltr">{orderNum.toUpperCase()}</p>
                </div>
                <div className="text-on-primary text-right">
                  <p className="font-jakarta text-label-md opacity-80">{lang === 'ar' ? 'الحالة' : 'Status'}</p>
                  <p className="font-garamond text-headline-sm">{k.steps[currentStep]}</p>
                </div>
              </div>

              {/* Stepper */}
              <div className="p-8 md:p-12">
                <h2 className="font-garamond text-headline-sm text-primary mb-10 text-center">{k.exampleTitle}</h2>
                <div className="relative">
                  {/* Connector line */}
                  <div className="absolute top-7 right-7 left-7 h-0.5 bg-outline-variant/30" />
                  <div
                    className="absolute top-7 h-0.5 bg-primary transition-all duration-700"
                    style={{
                      right: lang === 'ar' ? '28px' : 'auto',
                      left: lang === 'ar' ? 'auto' : '28px',
                      width: `${(currentStep / (DEMO_STEPS.length - 1)) * (100 - 14) + 7}%`,
                    }}
                  />

                  {/* Steps */}
                  <div className="relative grid grid-cols-4 gap-2">
                    {DEMO_STEPS.map((s, i) => {
                      const done = i <= currentStep
                      const active = i === currentStep
                      return (
                        <div key={i} className="flex flex-col items-center gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                            className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all duration-500 ${
                              done
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-high text-on-surface-variant'
                            } ${active ? 'ring-4 ring-primary/20 scale-110' : ''}`}
                          >
                            <span className={`material-symbols-outlined text-[22px] ${done ? 'ms-filled' : ''}`}>
                              {k.stepIcons[i]}
                            </span>
                          </motion.div>
                          <div className="text-center">
                            <p className={`font-jakarta text-label-md ${done ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                              {k.steps[i]}
                            </p>
                            {done && (
                              <p className="font-jakarta text-[10px] text-on-surface-variant mt-0.5 leading-tight">
                                {stepDates[i]}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Courier info */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-container p-5 rounded-xl flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl ms-filled">local_shipping</span>
                    <div className="text-right">
                      <p className="font-jakarta text-label-md text-on-surface-variant">{lang === 'ar' ? 'شركة الشحن' : 'Courier'}</p>
                      <p className="font-garamond text-body-lg text-primary">Aramex Express</p>
                    </div>
                  </div>
                  <div className="bg-surface-container p-5 rounded-xl flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl ms-filled">calendar_today</span>
                    <div className="text-right">
                      <p className="font-jakarta text-label-md text-on-surface-variant">{lang === 'ar' ? 'موعد التسليم المتوقع' : 'Expected Delivery'}</p>
                      <p className="font-garamond text-body-lg text-primary">
                        {lang === 'ar' ? '٣ يناير ٢٠٢٥' : 'Jan 3, 2025'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items ordered */}
                <div className="mt-8 border-t border-outline-variant/20 pt-8">
                  <h3 className="font-garamond text-body-lg text-primary mb-4">
                    {lang === 'ar' ? 'محتويات الطلب' : 'Order Contents'}
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: lang === 'ar' ? 'سيروم الجمال بزيت الورد' : 'Rose Hip Beauty Serum', qty: 1, price: '219 ج.م' },
                      { name: lang === 'ar' ? 'كريم الترطيب الليلي' : 'Night Nourishing Cream', qty: 2, price: '178 ج.م' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center font-jakarta text-body-sm text-on-surface-variant">
                        <span>{item.price} × {item.qty}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works */}
      {!searched && (
        <motion.div {...fadeUp(0.2)} className="max-w-3xl mx-auto mb-20">
          <h2 className="font-garamond text-headline-md text-primary text-center mb-12">
            {lang === 'ar' ? 'كيف يعمل التتبع؟' : 'How Does Tracking Work?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: 'receipt_long',
                title: lang === 'ar' ? 'أدخلي رقم الطلب' : 'Enter Order Number',
                body: lang === 'ar' ? 'ستجدين رقم طلبك في بريدك الإلكتروني أو رسالة التأكيد.' : 'Find your order number in your email or confirmation message.',
              },
              {
                icon: 'search',
                title: lang === 'ar' ? 'اضغطي تتبع' : 'Click Track',
                body: lang === 'ar' ? 'سيتحقق نظامنا من حالة طلبك فورًا.' : 'Our system will instantly check your order status.',
              },
              {
                icon: 'home_pin',
                title: lang === 'ar' ? 'تابعي رحلة الشحن' : 'Follow Your Shipment',
                body: lang === 'ar' ? 'شاهدي مسار منتجاتك حتى تصل إلى باب منزلك.' : 'Watch your products journey all the way to your doorstep.',
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-2xl ms-filled">{step.icon}</span>
                </div>
                <h3 className="font-garamond text-headline-sm text-primary mb-2">{step.title}</h3>
                <p className="font-jakarta text-body-sm text-on-surface-variant leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Help section */}
      <motion.div {...fadeUp()} className="max-w-2xl mx-auto">
        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-8 text-center">
          <span className="material-symbols-outlined text-secondary text-3xl ms-filled mb-4 block">support_agent</span>
          <p className="font-garamond text-headline-sm text-primary mb-2">{k.helpText}</p>
          <a
            href="https://wa.me/201102903151"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity mt-4"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            {k.helpCta}
          </a>
        </div>
      </motion.div>
    </main>
  )
}
