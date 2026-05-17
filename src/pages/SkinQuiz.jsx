import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { products } from '../data/products'

const questions = [
  {
    id: 1,
    ar: 'ما نوع بشرتك؟',
    en: 'What is your skin type?',
    options: [
      { ar: 'جافة', en: 'Dry', scores: [2, 5, 8] },
      { ar: 'دهنية', en: 'Oily', scores: [4, 6] },
      { ar: 'مختلطة', en: 'Combination', scores: [1, 4, 6] },
      { ar: 'حساسة', en: 'Sensitive', scores: [2, 4, 6] },
      { ar: 'عادية', en: 'Normal', scores: [1, 8, 11] },
    ],
  },
  {
    id: 2,
    ar: 'ما أكبر مشكلة تواجهينها؟',
    en: 'What is your main skin concern?',
    options: [
      { ar: 'الجفاف والتقشر', en: 'Dryness & flaking', scores: [2, 5, 8] },
      { ar: 'التجاعيد والشيخوخة', en: 'Wrinkles & aging', scores: [1, 5, 8, 11] },
      { ar: 'حب الشباب والمسام', en: 'Acne & pores', scores: [4, 6] },
      { ar: 'الإشراقة والبهتان', en: 'Dullness & radiance', scores: [1, 5, 11] },
      { ar: 'البقع والتصبغات', en: 'Dark spots', scores: [5, 11, 1] },
    ],
  },
  {
    id: 3,
    ar: 'ما روتينك الحالي للعناية بالبشرة؟',
    en: 'What is your current skincare routine?',
    options: [
      { ar: 'مبتدئة — خطوة أو خطوتان فقط', en: 'Beginner — 1-2 steps', scores: [4, 6] },
      { ar: 'متوسطة — غسول وسيروم ومرطب', en: 'Intermediate — cleanser, serum, moisturizer', scores: [1, 2, 8] },
      { ar: 'متقدمة — روتين كامل صباحي ومسائي', en: 'Advanced — full AM & PM routine', scores: [5, 11, 1] },
    ],
  },
  {
    id: 4,
    ar: 'ما هي بيئتك المعيشية؟',
    en: 'What best describes your environment?',
    options: [
      { ar: 'مدينة مزدحمة وملوثة', en: 'Busy, polluted city', scores: [1, 11, 6] },
      { ar: 'منطقة هادئة بعيدة عن التلوث', en: 'Calm area, low pollution', scores: [2, 4, 8] },
      { ar: 'أقضي وقتاً طويلاً تحت الشمس', en: 'Long hours under the sun', scores: [4, 1] },
      { ar: 'أجواء مكيفة معظم اليوم', en: 'Air-conditioned most of the day', scores: [2, 8] },
    ],
  },
  {
    id: 5,
    ar: 'ما هدفك الأساسي من روتين العناية؟',
    en: 'What is your main skincare goal?',
    options: [
      { ar: 'الترطيب العميق وتغذية البشرة', en: 'Deep hydration & nourishment', scores: [2, 5, 8] },
      { ar: 'مكافحة الشيخوخة والتجاعيد', en: 'Anti-aging & wrinkles', scores: [1, 5, 8, 11] },
      { ar: 'علاج حب الشباب وتنظيف المسام', en: 'Treat acne & cleanse pores', scores: [4, 6] },
      { ar: 'الإشراقة والنضارة الفورية', en: 'Instant glow & radiance', scores: [1, 5, 11] },
      { ar: 'تنظيف عميق وتوازن البشرة', en: 'Deep cleansing & balance', scores: [6, 4, 1] },
    ],
  },
]

function getRecommendations(answers) {
  const scores = {}
  answers.forEach(optionIndex => {
    if (optionIndex == null) return
  })
  answers.forEach((optionIndex, qIdx) => {
    if (optionIndex == null) return
    const option = questions[qIdx].options[optionIndex]
    option.scores.forEach((pid, rank) => {
      scores[pid] = (scores[pid] || 0) + (3 - rank > 0 ? 3 - rank : 1)
    })
  })
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const topIds = sorted.slice(0, 4).map(([id]) => Number(id))
  return topIds.map(id => products.find(p => p.id === id)).filter(Boolean)
}

export default function SkinQuiz() {
  const { addItem } = useCart()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [done, setDone] = useState(false)

  const question = questions[step]
  const progress = ((step) / questions.length) * 100

  const select = (idx) => {
    const next = [...answers]
    next[step] = idx
    setAnswers(next)
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1)
      } else {
        setDone(true)
      }
    }, 300)
  }

  const recommendations = done ? getRecommendations(answers) : []

  if (done) {
    return (
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-12">
            <span className="material-symbols-outlined text-primary text-[52px] mb-3 block ms-filled">favorite</span>
            <h1 className="font-garamond text-headline-md text-primary mb-3">
              {lang === 'ar' ? 'منتجاتك المثالية' : 'Your Perfect Products'}
            </h1>
            <p className="font-jakarta text-body-md text-on-surface-variant">
              {lang === 'ar'
                ? 'بناءً على إجاباتك، اخترنا لك هذه المنتجات الأنسب لبشرتك'
                : 'Based on your answers, we handpicked these products for your skin'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-12">
            {recommendations.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col gap-3 group cursor-pointer"
                onClick={() => navigate(`/shop/${p.id}`)}
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {i === 0 && (
                    <div className="absolute top-3 right-3 bg-primary text-on-primary px-3 py-1 rounded-full font-jakarta text-[10px]">
                      {lang === 'ar' ? 'الأفضل لك' : 'Best match'}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <h4 className="font-garamond text-body-lg text-primary leading-snug group-hover:underline">
                    {lang === 'ar' ? p.name : (p.nameEn || p.name)}
                  </h4>
                  <p className="font-jakarta text-body-sm text-secondary font-bold mt-1">{p.price} ج.م</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); addItem({ ...p, qty: 1 }) }}
                  className="bg-primary text-on-primary py-2 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all"
                >
                  {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => { setStep(0); setAnswers(Array(questions.length).fill(null)); setDone(false) }}
              className="border border-primary text-primary px-8 py-3 rounded-full font-jakarta text-label-md hover:bg-primary/5 transition-colors"
            >
              {lang === 'ar' ? 'أعيدي الاختبار' : 'Retake Quiz'}
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all"
            >
              {lang === 'ar' ? 'تصفح كل المنتجات' : 'Browse All Products'}
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-primary/10 text-primary font-jakarta text-label-md px-4 py-1 rounded-full mb-4">
            {lang === 'ar' ? 'اختبار نوع البشرة' : 'Skin Type Quiz'}
          </span>
          <h1 className="font-garamond text-headline-md text-primary mb-2">
            {lang === 'ar' ? 'اكتشفي منتجاتك المثالية' : 'Discover Your Perfect Products'}
          </h1>
          <p className="font-jakarta text-body-sm text-on-surface-variant">
            {lang === 'ar' ? `سؤال ${step + 1} من ${questions.length}` : `Question ${step + 1} of ${questions.length}`}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-outline-variant/20 rounded-full mb-10 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: lang === 'ar' ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: lang === 'ar' ? -40 : 40 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="font-garamond text-headline-sm text-primary mb-8 text-center">
              {lang === 'ar' ? question.ar : question.en}
            </h2>

            <div className="space-y-3">
              {question.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => select(idx)}
                  className={`w-full text-right p-5 rounded-xl border-2 transition-all font-jakarta text-body-md flex items-center justify-between gap-4 ${
                    answers[step] === idx
                      ? 'border-primary bg-primary/8 text-primary'
                      : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${answers[step] === idx ? 'border-primary bg-primary' : 'border-outline-variant/50'}`}>
                    {answers[step] === idx && <span className="material-symbols-outlined text-on-primary text-[14px] ms-filled">check</span>}
                  </span>
                  <span className="flex-1">{lang === 'ar' ? opt.ar : opt.en}</span>
                </motion.button>
              ))}
            </div>

            <div className="flex justify-between mt-10">
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-jakarta text-label-md"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                  {lang === 'ar' ? 'السابق' : 'Previous'}
                </button>
              ) : <span />}
              {answers[step] != null && (
                <button
                  onClick={() => step < questions.length - 1 ? setStep(step + 1) : setDone(true)}
                  className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all"
                >
                  {step < questions.length - 1 ? (lang === 'ar' ? 'التالي' : 'Next') : (lang === 'ar' ? 'عرض النتائج' : 'See Results')}
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}
