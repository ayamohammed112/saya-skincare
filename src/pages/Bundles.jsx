import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

export default function Bundles() {
  const { addItem } = useCart()
  const { lang } = useLanguage()
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('bundles')
      .select('id, name_ar, price, description_ar, image_url')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBundles(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <span className="inline-block bg-secondary/10 text-secondary font-jakarta text-label-md px-4 py-1 rounded-full mb-4">
          {lang === 'ar' ? 'عروض حصرية' : 'Exclusive Deals'}
        </span>
        <h1 className="font-garamond text-headline-md text-primary mb-4">
          {lang === 'ar' ? 'حزم العناية المميزة' : 'Skincare Bundles'}
        </h1>
        <p className="font-jakarta text-body-lg text-on-surface-variant max-w-lg mx-auto">
          {lang === 'ar'
            ? 'وفري أكثر مع حزمنا المنتقاة بعناية — مجموعات متكاملة لروتين عناية مثالي بسعر مخفض.'
            : 'Save more with our curated bundles — complete care routines at a discounted price.'}
        </p>
      </motion.div>

      {loading ? (
        <p className="text-center font-jakarta text-on-surface-variant py-20">
          {lang === 'ar' ? 'جارٍ التحميل...' : 'Loading...'}
        </p>
      ) : bundles.length === 0 ? (
        <p className="text-center font-jakarta text-on-surface-variant py-20">لا توجد باكيدجات حالياً</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle, i) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-surface-container-low overflow-hidden">
                {bundle.image_url
                  ? <img src={bundle.image_url} alt={bundle.name_ar} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-5xl">🎁</div>
                }
              </div>
              <div className="p-6 flex flex-col flex-1 text-right">
                <h2 className="font-garamond text-headline-sm text-primary mb-2">{bundle.name_ar}</h2>
                {bundle.description_ar && (
                  <p className="font-jakarta text-body-md text-on-surface-variant mb-4 leading-relaxed flex-1">
                    {bundle.description_ar}
                  </p>
                )}
                <div className="mt-auto">
                  <p className="font-garamond text-headline-sm text-primary mb-4">{bundle.price} ج.م</p>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => addItem({
                      id: bundle.id,
                      name: bundle.name_ar,
                      price: bundle.price,
                      image: bundle.image_url,
                      qty: 1,
                    })}
                    className="w-full bg-primary text-on-primary py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                    {lang === 'ar' ? 'أضف الحزمة للسلة' : 'Add Bundle to Cart'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  )
}
