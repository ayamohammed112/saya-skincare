import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { bundles, getBundleProducts } from '../data/bundles'

export default function Bundles() {
  const { addItem } = useCart()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  const addBundleToCart = (bundle) => {
    const bundleProducts = getBundleProducts(bundle)
    const pricePerProduct = Math.floor(bundle.bundlePrice / bundleProducts.length)
    bundleProducts.forEach((p, i) => {
      addItem({
        ...p,
        qty: 1,
        price: i === 0 ? bundle.bundlePrice - pricePerProduct * (bundleProducts.length - 1) : pricePerProduct,
        name: `${lang === 'ar' ? bundle.name : bundle.nameEn} — ${p.name}`,
      })
    })
  }

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

      {/* Bundles */}
      <div className="space-y-12">
        {bundles.map((bundle, i) => {
          const bundleProducts = getBundleProducts(bundle)
          const savePct = Math.round((1 - bundle.bundlePrice / bundle.originalTotal) * 100)

          return (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Products preview */}
                <div className="p-8 bg-surface-container-low/50">
                  <div className="flex gap-4 flex-wrap">
                    {bundleProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex-1 min-w-[120px] max-w-[180px] group cursor-pointer"
                        onClick={() => navigate(`/shop/${p.id}`)}
                      >
                        <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-sm mb-3">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h4 className="font-garamond text-body-md text-primary leading-snug text-right group-hover:underline">
                          {lang === 'ar' ? p.name : (p.nameEn || p.name)}
                        </h4>
                        <p className="font-jakarta text-label-md text-on-surface-variant/60 text-right line-through">{p.price} ج.م</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bundle info */}
                <div className="p-8 flex flex-col justify-between text-right">
                  <div>
                    <div className="flex items-center justify-end gap-3 mb-4 flex-wrap">
                      <span className="bg-error text-on-error px-3 py-1 rounded-full font-jakarta text-label-md">
                        {lang === 'ar' ? `وفري ${savePct}٪` : `Save ${savePct}%`}
                      </span>
                    </div>

                    <h2 className="font-garamond text-headline-sm text-primary mb-3">
                      {lang === 'ar' ? bundle.name : bundle.nameEn}
                    </h2>

                    <p className="font-jakarta text-body-md text-on-surface-variant mb-6 leading-relaxed">
                      {lang === 'ar' ? bundle.description : bundle.descriptionEn}
                    </p>

                    <div className="flex items-end gap-4 justify-end mb-6">
                      <div className="text-right">
                        <p className="font-jakarta text-label-md text-on-surface-variant/60 line-through">
                          {bundle.originalTotal} ج.م
                        </p>
                        <p className="font-garamond text-headline-sm text-primary">
                          {bundle.bundlePrice} ج.م
                        </p>
                      </div>
                      <div className="bg-primary/10 px-4 py-2 rounded-xl text-right">
                        <p className="font-jakarta text-label-md text-primary font-bold">
                          {lang === 'ar'
                            ? `وفري ${bundle.originalTotal - bundle.bundlePrice} ج.م`
                            : `Save ${bundle.originalTotal - bundle.bundlePrice} EGP`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => addBundleToCart(bundle)}
                      className="w-full bg-primary text-on-primary py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                      {lang === 'ar' ? 'أضف الحزمة للسلة' : 'Add Bundle to Cart'}
                    </motion.button>
                    <div className="flex gap-3">
                      {bundleProducts.map(p => (
                        <button
                          key={p.id}
                          onClick={() => navigate(`/shop/${p.id}`)}
                          className="flex-1 border border-outline-variant/40 text-on-surface-variant py-2 rounded-full font-jakarta text-[11px] hover:border-primary hover:text-primary transition-colors"
                        >
                          {lang === 'ar' ? p.name.split(' ').slice(0, 2).join(' ') : (p.nameEn || p.name).split(' ').slice(0, 2).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </main>
  )
}
