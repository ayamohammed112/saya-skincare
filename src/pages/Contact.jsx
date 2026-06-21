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
          <img src={heroImages.aboutHero} alt="تواصل" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/30 backdrop-brightness-75" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[
            {
              icon: 'chat',
              title: c.whatsapp,
              detail: '+20 110 290 3151',
              href: 'https://wa.me/201102903151',
              cta: lang === 'ar' ? 'ابدأ المحادثة' : 'Start Chat',
              color: 'bg-green-50 border-green-200',
              iconColor: 'text-green-600',
            },
            {
              icon: 'location_on',
              title: c.location,
              detail: c.address,
              href: '#map',
              cta: c.directions,
              color: 'bg-secondary/5 border-secondary/20',
              iconColor: 'text-secondary',
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className={`p-8 rounded-2xl border ${card.color} text-center flex flex-col items-center gap-4`}
            >
              <div className={`w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center ${card.iconColor}`}>
                <span className="material-symbols-outlined text-2xl">{card.icon}</span>
              </div>
              <h3 className="font-garamond text-headline-sm text-primary">{card.title}</h3>
              <p className="font-jakarta text-body-sm text-on-surface-variant leading-relaxed">{card.detail}</p>
              <a
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity"
              >
                {card.cta}
              </a>
            </motion.div>
          ))}
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
                  { icon: 'photo_camera', label: 'Instagram', href: '#' },
                  { icon: 'play_circle', label: 'TikTok', href: '#' },
                  { icon: 'facebook', label: 'Facebook', href: '#' },
                  { icon: 'alternate_email', label: 'Snapchat', href: '#' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    aria-label={s.label}
                    className="w-12 h-12 rounded-full border border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
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
                  { day: lang === 'ar' ? 'الأحد – الخميس' : 'Sun – Thu', hours: '9:00 – 17:00' },
                  { day: lang === 'ar' ? 'الجمعة' : 'Friday', hours: lang === 'ar' ? 'مغلق' : 'Closed' },
                  { day: lang === 'ar' ? 'السبت' : 'Saturday', hours: '10:00 – 14:00' },
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

      {/* Map placeholder */}
      <section id="map" className="bg-surface-container py-16">
        <div className="max-w-site mx-auto px-margin-mobile md:px-margin-desktop">
          <motion.div {...fadeUp()} className="text-center mb-10">
            <h2 className="font-garamond text-headline-md text-primary mb-2">{c.location}</h2>
            <p className="font-jakarta text-body-md text-on-surface-variant">{c.address}</p>
          </motion.div>
          <motion.div
            {...fadeUp(0.1)}
            className="relative h-80 rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10 bg-surface-container-high"
          >
            <img src={heroImages.map} alt="map" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                <span className="material-symbols-outlined ms-filled text-primary text-2xl">location_on</span>
                <div className="text-right">
                  <img src="/saya-logo.jpeg" alt="SAYA" className="h-8 w-auto object-contain" style={{ mixBlendMode: 'multiply' }} />
                  <p className="font-jakarta text-label-md text-on-surface-variant">{lang === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt'}</p>
                </div>
              </div>
            </div>
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
