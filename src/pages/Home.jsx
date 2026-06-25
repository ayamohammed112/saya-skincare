import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useRecentlyViewed } from '../context/RecentlyViewedContext'
import { products, heroImages } from '../data/products'

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } }
const stagger = { show: { transition: { staggerChildren: 0.15 } } }

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5 text-secondary">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={`material-symbols-outlined text-[16px] ${i < rating ? 'ms-filled' : ''}`}>star</span>
      ))}
    </div>
  )
}

function ProductCard({ product, onAdd }) {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const displayName = lang === 'ar' ? product.name : (product.nameEn || product.name)

  return (
    <div className="min-w-[280px] md:min-w-[300px] group snap-start flex-shrink-0 cursor-pointer" onClick={() => navigate(`/shop/${product.id}`)}>
      <div
        className="relative aspect-[4/5] bg-white rounded-lg overflow-hidden mb-4 shadow-sm transition-shadow duration-300 group-hover:shadow-lg cursor-pointer"
        onClick={() => navigate(`/shop/${product.id}`)}
      >
        <img
          src={product.image}
          alt={displayName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={e => { e.stopPropagation(); onAdd(product) }}
          className="absolute bottom-4 left-4 right-4 bg-primary text-on-primary py-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 text-body-sm font-jakarta"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
        </button>
        {product.badge && (
          <span className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} ${product.badgeColor || 'bg-secondary-container text-on-secondary-container'} px-3 py-1 rounded-full text-label-md font-jakarta`}>
            {lang === 'ar' ? product.badge : (product.badgeEn || product.badge)}
          </span>
        )}
      </div>
      <h4
        className="font-garamond text-[18px] text-primary mb-1 cursor-pointer hover:underline"
        onClick={() => navigate(`/shop/${product.id}`)}
      >
        {displayName}
      </h4>
      <StarRating rating={product.rating} />
      <p className="font-jakarta text-body-md text-primary font-bold mt-1">{product.price} ج.م</p>
    </div>
  )
}

export default function Home() {
  const { addItem } = useCart()
  const { tr, lang } = useLanguage()
  const { viewedIds } = useRecentlyViewed()
  const navigate = useNavigate()
  const bestsellers = products.slice(0, 4)
  const scrollRef = useRef(null)
  const [newsletterDone, setNewsletterDone] = useState(false)
  const recentProducts = viewedIds.map(id => products.find(p => p.id === id)).filter(Boolean).slice(0, 4)

  const scrollCarousel = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'prev' ? 320 : -320, behavior: 'smooth' })
  }

  return (
    <main className="pt-20 pb-20 md:pb-0">
      <style>{`
        @media (max-width: 768px) {
          .hero-video {
            object-position: 90% center;
          }
        }
      `}</style>
      {/* Hero */}
      <section className="relative h-[870px] w-full overflow-hidden flex items-center">
        {/* position-fix-v3 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
          src="https://res.cloudinary.com/degdyksdi/video/upload/v1782389654/302132_medium_fyf1mw.mp4"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '100% center',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255, 235, 242, 0.55)', zIndex: 1 }} />
        <div className="relative z-[2] px-margin-mobile md:px-margin-desktop w-full max-w-site mx-auto">
          <motion.div
            className="max-w-2xl text-right"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.span variants={fadeUp} className="inline-block text-label-md font-jakarta text-secondary uppercase tracking-widest mb-4 bg-secondary-fixed/30 px-3 py-1 rounded-full">
              {tr.hero.badge}
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-garamond text-display-mobile md:text-display-lg text-primary mb-6 leading-tight whitespace-pre-line">
              {tr.hero.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="font-jakarta text-body-lg text-on-surface-variant mb-8 leading-relaxed max-w-md">
              {tr.hero.sub}
            </motion.p>
            <motion.div variants={fadeUp} className="flex gap-4">
              <motion.button
                onClick={() => navigate('/shop')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-on-primary px-8 py-4 rounded-full font-jakarta text-body-md hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
              >
                {tr.hero.cta}
                <span className="material-symbols-outlined">arrow_back</span>
              </motion.button>
              <button
                onClick={() => navigate('/shop')}
                className="border border-secondary text-secondary px-8 py-4 rounded-full font-jakarta text-body-md hover:bg-secondary/5 transition-colors"
              >
                {tr.hero.ctaSecondary}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop w-full max-w-site mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-garamond text-headline-md text-primary mb-4">{tr.categories.title}</h2>
          <div className="h-1 w-20 bg-secondary-container mx-auto rounded-full" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
          {[
            { img: heroImages.skincare, ...tr.categories.skincare },
            { img: heroImages.perfumes, ...tr.categories.perfumes, overlay: 'from-secondary/80' },
            { img: heroImages.haircare, ...tr.categories.haircare, overlay: 'from-tertiary/80' },
            {
              img: heroImages.about,
              name: lang === 'ar' ? 'ريفيوهات عملاءنا الكرام' : "Our Delighted Customers' Reviews",
              sub: lang === 'ar' ? 'تجارب حقيقية من عملاءنا السعداء' : 'Real experiences from our happy customers',
              overlay: 'from-primary/80',
            },
          ].map((cat, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-xl h-[400px] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onClick={() => navigate('/shop')}
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.overlay || 'from-primary/80'} via-transparent to-transparent flex flex-col justify-end p-8 text-right`}>
                <h3 className="font-garamond text-headline-sm text-white mb-2">{cat.name}</h3>
                <p className="text-on-primary-container text-body-sm mb-4">{cat.sub}</p>
                <span className="text-white text-label-md font-jakarta flex items-center gap-2 group-hover:gap-4 transition-all">
                  {tr.categories.explore} <span className="material-symbols-outlined">arrow_back</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 bg-surface-container-low">
        <div className="px-margin-mobile md:px-margin-desktop w-full max-w-site mx-auto">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="font-garamond text-headline-md text-primary">{tr.bestsellers.title}</h2>
              <p className="text-on-surface-variant font-jakarta text-body-sm mt-1">{tr.bestsellers.sub}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('next')}
                className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="next"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                onClick={() => scrollCarousel('prev')}
                className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="prev"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            </div>
          </motion.div>
          <div ref={scrollRef} className="flex gap-gutter overflow-x-auto no-scrollbar pb-8 snap-x">
            {bestsellers.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addItem} />
            ))}
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-32 px-margin-mobile md:px-margin-desktop w-full max-w-site mx-auto overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-tertiary-fixed-dim/20 rounded-full blur-3xl z-0" />
            <img src={heroImages.about} alt="عن سايا" className="relative z-10 w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl" />
          </motion.div>
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="font-jakarta text-label-md text-secondary uppercase tracking-[3px] mb-4 block">{tr.about.label}</span>
            <h2 className="font-garamond text-headline-md text-primary mb-8 leading-relaxed italic">{tr.about.quote}</h2>
            <p className="font-jakarta text-body-lg text-on-surface-variant mb-10 leading-loose">{tr.about.body}</p>
            <ul className="space-y-4 mb-12">
              {tr.about.checks.map((c, i) => (
                <li key={i} className="flex items-center gap-3 justify-end text-on-surface">
                  <span>{c}</span>
                  <span className="material-symbols-outlined text-primary ms-filled">check_circle</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/about')}
              className="text-primary font-jakarta text-label-md border-b-2 border-primary/20 pb-1 hover:border-primary transition-all"
            >
              {tr.about.readMore}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="py-24 px-margin-mobile md:px-margin-desktop w-full max-w-site mx-auto">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-garamond text-headline-md text-primary">
              {lang === 'ar' ? 'شاهدتِ مؤخراً' : 'Recently Viewed'}
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {recentProducts.map((p, i) => (
              <motion.div
                key={p.id}
                className="flex flex-col gap-3 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/shop/${p.id}`)}
              >
                <div className="relative aspect-[4/5] bg-white rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button
                    onClick={e => { e.stopPropagation(); addItem({ ...p, qty: 1 }) }}
                    className="absolute bottom-4 left-4 right-4 bg-primary text-on-primary py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-jakarta text-label-md"
                  >
                    {lang === 'ar' ? 'أضف للسلة' : 'Add to Cart'}
                  </button>
                </div>
                <h4 className="font-garamond text-[18px] text-primary group-hover:underline cursor-pointer">
                  {lang === 'ar' ? p.name : (p.nameEn || p.name)}
                </h4>
                <p className="font-jakarta text-body-md text-primary font-bold">{p.price} ج.م</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop w-full max-w-site mx-auto">
        <motion.div
          className="bg-primary rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-garamond text-headline-md text-on-primary mb-6">{tr.newsletter.title}</h2>
            <p className="font-jakarta text-body-md text-on-primary-container mb-10">{tr.newsletter.body}</p>
            {newsletterDone ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <span className="material-symbols-outlined ms-filled text-[48px] text-white">check_circle</span>
                <p className="font-garamond text-headline-sm text-on-primary">
                  {lang === 'ar' ? 'شكراً! تم تسجيلك بنجاح.' : 'Thank you! You\'re subscribed.'}
                </p>
              </motion.div>
            ) : (
              <form
                className="flex flex-col md:flex-row gap-4 items-center"
                onSubmit={e => { e.preventDefault(); setNewsletterDone(true) }}
              >
                <input
                  required
                  type="email"
                  placeholder={tr.newsletter.placeholder}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-full px-8 py-4 focus:outline-none focus:ring-2 focus:ring-secondary font-jakarta text-body-md"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full md:w-auto bg-white text-primary px-10 py-4 rounded-full font-jakarta text-label-md hover:bg-secondary-fixed transition-colors whitespace-nowrap"
                >
                  {tr.newsletter.cta}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  )
}
