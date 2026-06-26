import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { heroImages } from '../data/products'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
})

export default function Contact() {
  const { tr, lang } = useLanguage()
  const c = tr.contact
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="pt-20 pb-24">
      {/* Hero */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
            src="https://res.cloudinary.com/degdyksdi/video/upload/v1782389654/302132_medium_fyf1mw.mp4"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(255, 235, 242, 0.6)', zIndex: 1 }} />
        </div>
        <motion.div
          className="relative z-10 text-center max-w-2xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="font-garamond text-display-mobile md:text-display-lg text-surface-container-lowest mb-4">{c.title}</h1>
          <p className="font-jakarta text-body-lg text-surface-container-lowest opacity-90 leading-relaxed">{c.sub}</p>
        </motion.div>
      </section>

      {/* Contact cards */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
        <div className="flex justify-center mb-20">
          <motion.div
            {...fadeUp(0)}
            className="p-8 rounded-2xl border bg-green-50 border-green-200 text-center flex flex-col items-center gap-4 w-full max-w-sm"
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-green-600">
              <span className="material-symbols-outlined text-2xl">chat</span>
            </div>
            <h3 className="font-garamond text-headline-sm text-primary">{c.whatsapp}</h3>
            <p className="font-jakarta text-body-sm text-on-surface-variant leading-relaxed" dir="ltr">+20 110 290 3151</p>
            <a
              href="https://wa.me/201102903151"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity"
            >
              {lang === 'ar' ? 'ابدأ المحادثة' : 'Start Chat'}
            </a>
          </motion.div>
        </div>

        {/* Form + Social */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Form */}
          <motion.div {...fadeUp(0.1)} className="lg:col-span-3">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 p-10">
              <h2 className="font-garamond text-headline-md text-primary mb-8">{c.formTitle}</h2>
              {sent ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <span className="material-symbols-outlined ms-filled text-[64px] text-primary mb-4 block">check_circle</span>
                  <h3 className="font-garamond text-headline-sm text-primary mb-2">
                    {lang === 'ar' ? 'تم إرسال رسالتك!' : 'Message Sent!'}
                  </h3>
                  <p className="font-jakarta text-body-md text-on-surface-variant">
                    {lang === 'ar' ? 'سنتواصل معك خلال 24 ساعة.' : "We'll get back to you within 24 hours."}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-jakarta text-label-md text-secondary mb-1">{c.fullName}</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md"
                        placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                      />
                    </div>
                    <div>
                      <label className="block font-jakarta text-label-md text-secondary mb-1">{c.email}</label>
                      <input
                        required
                        type="email"
                        className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md"
                        placeholder="example@mail.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-jakarta text-label-md text-secondary mb-1">{c.subject}</label>
                    <select className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md appearance-none">
                      {c.subjectOptions.map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-jakarta text-label-md text-secondary mb-1">{c.message}</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md resize-none"
                      placeholder={lang === 'ar' ? 'اكتبي رسالتك هنا...' : 'Write your message here...'}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    {c.send}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Social + Info */}
          <motion.div {...fadeUp(0.2)} className="lg:col-span-2 space-y-10">
            {/* Social */}
            <div>
              <h3 className="font-garamond text-headline-sm text-primary mb-6">{c.social}</h3>
              <div className="flex gap-4 flex-row-reverse">
                {[
                  {
                    label: 'Instagram',
                    href: 'https://www.instagram.com/saya_for_natural_skincare',
                    d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                  },
                  {
                    label: 'Facebook',
                    href: 'https://www.facebook.com/gmalekm3aya',
                    d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
                  },
                  {
                    label: 'TikTok',
                    href: 'https://www.tiktok.com/@saya.for.natural',
                    d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-12 h-12 rounded-full border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d={s.d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Working hours */}
            <div className="bg-surface-container p-6 rounded-xl">
              <h3 className="font-garamond text-headline-sm text-primary mb-4">
                {lang === 'ar' ? 'ساعات العمل' : 'Working Hours'}
              </h3>
              <div className="space-y-3">
                {[
                  { day: lang === 'ar' ? 'الأحد – الخميس' : 'Sun – Thu', hours: '9:00 AM – 2:00 AM' },
                  { day: lang === 'ar' ? 'الجمعة' : 'Friday', hours: '12PM – 12AM' },
                  { day: lang === 'ar' ? 'السبت' : 'Saturday', hours: '9:00 AM – 2:00 AM' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between font-jakarta text-body-sm text-on-surface-variant">
                    <span>{row.hours}</span>
                    <span>{row.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/201102903151"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-green-50 border border-green-200 rounded-xl hover:shadow-md transition-shadow group"
            >
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-[20px]">chat</span>
              </div>
              <div className="text-right">
                <p className="font-garamond text-body-lg text-on-surface font-semibold">
                  {lang === 'ar' ? 'تحدثي معنا على واتساب' : 'Chat With Us on WhatsApp'}
                </p>
                <p className="font-jakarta text-label-md text-on-surface-variant">
                  {lang === 'ar' ? 'رد فوري' : 'Instant reply'}
                </p>
              </div>
              <span className="material-symbols-outlined text-green-500 mr-auto">arrow_left</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
        <motion.div
          {...fadeUp()}
          className="bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10">
            <h2 className="font-garamond text-display-mobile md:text-headline-md text-on-primary mb-4">{c.newsletterTitle}</h2>
            <p className="font-jakarta text-body-lg text-on-primary/80 mb-10 max-w-xl mx-auto">{c.newsletterSub}</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={lang === 'ar' ? 'بريدك الإلكتروني' : 'Your email'}
                className="flex-1 px-6 py-3 rounded-full font-jakarta text-body-md bg-white/10 text-on-primary placeholder-on-primary/60 border border-on-primary/30 focus:outline-none focus:border-on-primary"
              />
              <button
                type="submit"
                className="bg-white text-primary px-8 py-3 rounded-full font-jakarta text-label-md hover:bg-background transition-colors shadow-lg"
              >
                {c.newsletterCta}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    </main>
  )
}
