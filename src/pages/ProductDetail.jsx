import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import { products, relatedProducts } from '../data/products'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { tr, lang } = useLanguage()
  const { viewedIds, track } = useRecentlyViewed()
  const navigate = useNavigate()
  const p = tr.product

  const product = products.find(x => x.id === +id) || products[0]

  useEffect(() => { track(product.id) }, [product.id])
  const gallery = product.gallery || [product.image, product.image, product.image, product.image]
  const displayName = lang === 'ar' ? product.name : (product.nameEn || product.name)

  const [mainImg, setMainImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState(0)

  const handleAddToCart = () => {
    addItem({ ...product, qty })
  }

  const handleBuyNow = () => {
    addItem({ ...product, qty })
    navigate('/checkout')
  }

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      {/* Breadcrumb */}
      <nav className="flex flex-row-reverse items-center gap-2 mb-12 text-on-surface-variant font-jakarta text-label-md">
        <Link to="/" className="hover:text-primary transition-colors">{tr.nav.home}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        <Link to="/shop" className="hover:text-primary transition-colors">{tr.nav.shop}</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
        <span className="text-primary">{displayName}</span>
      </nav>

      {/* Product layout */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <motion.div
            className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm bg-surface-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img src={gallery[mainImg]} alt={displayName} className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImg(i)}
                className={`aspect-square rounded-lg overflow-hidden border transition-opacity ${mainImg === i ? 'border-primary opacity-100' : 'border-outline-variant/30 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`detail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-start">
          {/* Badges */}
          <div className="flex gap-2 mb-6">
            {product.badges?.map((b, i) => (
              <span key={i} className={`px-3 py-1 ${b.color} rounded-full font-jakarta text-label-md`}>{b.label}</span>
            ))}
          </div>

          <h1 className="font-garamond text-display-lg text-primary mb-2 leading-tight">{displayName}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 text-secondary">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`material-symbols-outlined ${i < product.rating ? 'ms-filled' : ''}`}>star</span>
              ))}
            </div>
            <span className="font-jakarta text-body-sm text-on-surface-variant">({product.reviews} {p.rating})</span>
          </div>

          <div className="font-garamond text-headline-md text-primary mb-8">{product.price} ج.م</div>

          <p className="font-jakarta text-body-lg text-on-surface-variant mb-10 leading-relaxed">{product.description}</p>

          {/* Qty + Actions */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <span className="font-jakarta text-label-md text-on-surface-variant">{p.qty}</span>
              <div className="flex items-center border border-outline-variant rounded-full px-4 py-2 bg-surface-container-low">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="material-symbols-outlined text-primary hover:opacity-60">remove</button>
                <span className="px-6 font-jakarta text-body-md">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="material-symbols-outlined text-primary hover:opacity-60">add</button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-on-primary py-4 rounded-full font-jakarta text-label-md shadow-lg hover:opacity-90 transition-all"
              >
                {p.addCart}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyNow}
                className="flex-1 border border-secondary text-secondary py-4 rounded-full font-jakarta text-label-md hover:bg-secondary-fixed transition-colors"
              >
                {p.buyNow}
              </motion.button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-8 border-t border-outline-variant/20 grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">eco</span>
              <span className="font-jakarta text-body-sm text-on-surface-variant">{p.natural}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">verified</span>
              <span className="font-jakarta text-body-sm text-on-surface-variant">{p.tested}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mb-24">
        <div className="border-b border-outline-variant/30 flex gap-12 mb-12 overflow-x-auto no-scrollbar">
          {p.tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`pb-4 font-jakarta text-body-md whitespace-nowrap transition-colors ${activeTab === i ? 'text-primary font-bold border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="font-garamond text-headline-sm text-primary mb-6">{lang === 'ar' ? 'لماذا ستعشقينه؟' : 'Why You\'ll Love It'}</h3>
              <p className="font-jakarta text-body-lg text-on-surface-variant leading-relaxed mb-6">{product.description}</p>
              <ul className="space-y-4">
                {product.benefits?.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary ms-filled mt-1">check_circle</span>
                    <span className="font-jakarta text-body-md text-on-surface-variant">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-high p-8 rounded-xl border border-outline-variant/10">
              <h3 className="font-garamond text-headline-sm text-primary mb-6">{p.tabs[1]}</h3>
              <div className="space-y-6">
                {product.usage?.map((u, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold flex-shrink-0 font-jakarta text-body-sm">{i + 1}</div>
                    <p className="font-jakarta text-body-md text-on-surface-variant">{u}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 1 && (
          <div className="bg-surface-container-high p-8 rounded-xl">
            <div className="space-y-6 max-w-lg">
              {product.usage?.map((u, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold flex-shrink-0 font-jakarta text-body-sm">{i + 1}</div>
                  <p className="font-jakarta text-body-md text-on-surface-variant">{u}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 2 && (
          <div className="font-jakarta text-body-md text-on-surface-variant leading-loose max-w-xl">
            <p>Rosa canina seed oil, Tocopherol (Vitamin E), Retinol (Vitamin A), Ascorbic acid (Vitamin C), Jojoba esters, Squalane, Bisabolol.</p>
          </div>
        )}
        {activeTab === 3 && (
          <div className="font-jakarta text-body-md text-on-surface-variant leading-loose max-w-xl">
            <p>{lang === 'ar' ? 'شحن مجاني على الطلبات فوق ٣٠٠ ج.م. التوصيل خلال ٣-٥ أيام عمل. إمكانية الإرجاع خلال ١٤ يوم من تاريخ الاستلام.' : 'Free shipping on orders over 300 EGP. Delivery within 3-5 business days. Returns accepted within 14 days of receipt.'}</p>
          </div>
        )}
      </section>

      {/* Related */}
      <section className="mb-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-garamond text-headline-md text-primary">{p.related}</h2>
          <Link to="/shop" className="font-jakarta text-secondary text-label-md hover:underline">{lang === 'ar' ? 'مشاهدة الكل' : 'See All'}</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {relatedProducts.map(rp => (
            <div
              key={rp.id}
              className="flex flex-col gap-4 group cursor-pointer"
              onClick={() => navigate(`/shop/${rp.id}`)}
            >
              <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container relative">
                <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <button
                  onClick={e => { e.stopPropagation(); addItem({ ...rp, description: '' }) }}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-primary py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-jakarta text-label-md"
                >
                  {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                </button>
              </div>
              <div>
                <h4 className="font-garamond text-headline-sm text-on-surface group-hover:text-primary transition-colors">{rp.name}</h4>
                <p className="text-secondary font-jakarta text-label-md mt-1">{rp.price} ج.م</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {(() => {
        const recentProducts = viewedIds
          .filter(rid => rid !== product.id)
          .map(rid => products.find(x => x.id === rid))
          .filter(Boolean)
          .slice(0, 4)
        if (recentProducts.length === 0) return null
        return (
          <section>
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-garamond text-headline-md text-primary">
                {lang === 'ar' ? 'شاهدتِ مؤخراً' : 'Recently Viewed'}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {recentProducts.map(rp => (
                <div key={rp.id} className="flex flex-col gap-3 group cursor-pointer" onClick={() => navigate(`/shop/${rp.id}`)}>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container relative">
                    <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <button
                      onClick={e => { e.stopPropagation(); addItem({ ...rp, qty: 1 }) }}
                      className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-primary py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-jakarta text-label-md"
                    >
                      {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                    </button>
                  </div>
                  <div>
                    <h4 className="font-garamond text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                      {lang === 'ar' ? rp.name : (rp.nameEn || rp.name)}
                    </h4>
                    <p className="text-secondary font-jakarta text-label-md mt-1">{rp.price} ج.م</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })()}
    </main>
  )
}
