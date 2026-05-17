import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccount } from '../context/AccountContext'
import { useLanguage } from '../context/LanguageContext'

export default function Login() {
  const { login, user } = useAccount()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  if (user) {
    navigate('/account')
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!phone.match(/^[0-9]{10,11}$/)) {
      setError(lang === 'ar' ? 'رقم الهاتف غير صحيح' : 'Invalid phone number')
      return
    }
    login(phone, name, email)
    navigate('/account')
  }

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-12">
          <span className="material-symbols-outlined text-primary text-[48px] mb-4 block">account_circle</span>
          <h1 className="font-garamond text-headline-md text-primary mb-2">
            {lang === 'ar' ? 'حسابي في سايا' : 'My Saya Account'}
          </h1>
          <p className="font-jakarta text-body-md text-on-surface-variant">
            {lang === 'ar'
              ? 'سجلي دخولك لتتبعي نقاطك وطلباتك'
              : 'Sign in to track your points and orders'}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-jakarta text-label-md text-secondary mb-1">
                {lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
              </label>
              <input
                required
                type="tel"
                dir="ltr"
                value={phone}
                onChange={e => { setPhone(e.target.value); setError('') }}
                placeholder="01x xxxx xxxx"
                className={`w-full bg-transparent border-b py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md text-right ${error ? 'border-error' : 'border-outline-variant/40'}`}
              />
              {error && (
                <p className="font-jakarta text-label-md text-error mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {error}
                </p>
              )}
            </div>

            <div>
              <label className="block font-jakarta text-label-md text-secondary mb-1">
                {lang === 'ar' ? 'الاسم *' : 'Name *'}
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={lang === 'ar' ? 'اسمك' : 'Your name'}
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md"
              />
            </div>

            <div>
              <label className="block font-jakarta text-label-md text-secondary mb-1">
                {lang === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-primary text-on-primary py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all mt-4"
            >
              {lang === 'ar' ? 'دخول / تسجيل' : 'Sign In / Register'}
            </motion.button>
          </form>

          <p className="font-jakarta text-body-sm text-on-surface-variant text-center mt-6 leading-relaxed">
            {lang === 'ar'
              ? 'رقم هاتفك يُستخدم كمعرّف حسابك. إذا كنتِ عميلة جديدة سيتم إنشاء حساب تلقائياً.'
              : 'Your phone number is your account ID. New customers get an account created automatically.'}
          </p>
        </div>

        {/* Points info */}
        <div className="mt-8 bg-secondary-fixed/20 p-6 rounded-xl text-center">
          <span className="material-symbols-outlined text-secondary text-[32px] mb-2 block ms-filled">stars</span>
          <h3 className="font-garamond text-headline-sm text-primary mb-2">
            {lang === 'ar' ? 'نظام النقاط' : 'Points System'}
          </h3>
          <p className="font-jakarta text-body-sm text-on-surface-variant">
            {lang === 'ar'
              ? 'اكسبي ١٠ نقاط لكل ١٠٠ ج.م تنفقينها. كل ١٠٠ نقطة = خصم ١٠ ج.م على طلباتك القادمة.'
              : 'Earn 10 points for every 100 EGP spent. Every 100 points = 10 EGP discount on future orders.'}
          </p>
        </div>
      </motion.div>
    </main>
  )
}
