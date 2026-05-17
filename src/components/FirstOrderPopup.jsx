import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'

export default function FirstOrderPopup() {
  const { lang } = useLanguage()
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem('saya_popup_seen')
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('saya_popup_seen', '1')
    setVisible(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText('SAYA10').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-background rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl pointer-events-none" />

            <button
              onClick={dismiss}
              className="absolute top-4 left-4 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>

            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary text-[52px] mb-3 block ms-filled">redeem</span>

              <h2 className="font-garamond text-headline-md text-primary mb-3 leading-snug">
                {lang === 'ar'
                  ? 'احصلي على ١٠٪ خصم على أول طلب'
                  : 'Get 10% Off Your First Order'}
              </h2>

              <p className="font-jakarta text-body-sm text-on-surface-variant mb-6 leading-relaxed">
                {lang === 'ar'
                  ? 'استخدمي كود الخصم أدناه عند إتمام طلبك الأول واستمتعي بمنتجات سايا الطبيعية بسعر مميز.'
                  : 'Use the discount code below at checkout and enjoy Saya natural products at a special price.'}
              </p>

              <div className="bg-primary/8 border border-primary/20 rounded-2xl px-6 py-4 mb-6 flex items-center justify-between gap-4">
                <span className="font-garamond text-headline-md text-primary tracking-widest">SAYA10</span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 font-jakarta text-label-md text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
                  {copied
                    ? (lang === 'ar' ? 'تم النسخ' : 'Copied!')
                    : (lang === 'ar' ? 'نسخ' : 'Copy')}
                </button>
              </div>

              <button
                onClick={dismiss}
                className="w-full bg-primary text-on-primary py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all"
              >
                {lang === 'ar' ? 'تسوقي الآن' : 'Shop Now'}
              </button>

              <button
                onClick={dismiss}
                className="mt-3 font-jakarta text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {lang === 'ar' ? 'لا شكراً' : 'No thanks'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
