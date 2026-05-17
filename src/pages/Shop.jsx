import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { products } from '../data/products'

const ITEMS_PER_PAGE = 9

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5 text-secondary-fixed-dim">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`material-symbols-outlined text-[16px] ${i < rating ? 'ms-filled' : ''}`}>star</span>
      ))}
    </div>
  )
}

const CAT_KEYS = ['all', 'skincare', 'perfumes', 'haircare']

export default function Shop() {
  const { addItem } = useCart()
  const { tr, lang } = useLanguage()
  const navigate = useNavigate()
  const s = tr.shop

  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const [selectedCat, setSelectedCat] = useState('all')
  const [priceMax, setPriceMax] = useState(500)
  const [sortBy, setSortBy] = useState(0)
  const [page, setPage] = useState(1)

  // Reset page when any filter changes
  useEffect(() => { setPage(1) }, [selectedCat, priceMax, sortBy, searchQuery])

  let filtered = products.filter(p => {
    const catMatch = selectedCat === 'all' || p.category === selectedCat
    const priceMatch = p.price <= priceMax
    const q = searchQuery.toLowerCase()
    const searchMatch = !q || p.name.toLowerCase().includes(q) || (p.nameEn && p.nameEn.toLowerCase().includes(q))
    return catMatch && priceMatch && searchMatch
  })

  if (sortBy === 1) filtered = [...filtered].sort((a, b) => a.price - b.price)
  else if (sortBy === 2) filtered = [...filtered].sort((a, b) => b.price - a.price)
  else if (sortBy === 3) filtered = [...filtered].sort((a, b) => b.reviews - a.reviews)

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const resetFilters = () => {
    setSelectedCat('all')
    setPriceMax(500)
    setSortBy(0)
    setPage(1)
  }

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-garamond text-display-mobile md:text-display-lg text-primary mb-4">{s.title}</h1>
        <p className="font-jakarta text-body-lg text-on-surface-variant max-w-2xl mx-auto">{s.sub}</p>
        {searchQuery && (
          <p className="font-jakarta text-body-sm text-secondary mt-4">
            {lang === 'ar' ? `نتائج البحث عن: "${searchQuery}"` : `Search results for: "${searchQuery}"`}
            {' '}({filtered.length})
          </p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-10">
          {/* Categories */}
          <div>
            <h3 className="font-garamond text-headline-sm text-primary mb-6">{s.filters}</h3>
            <div className="flex flex-col gap-4">
              {CAT_KEYS.map((key, i) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCat === key}
                    onChange={() => setSelectedCat(key)}
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
                  />
                  <span className={`font-jakarta text-body-md transition-colors ${selectedCat === key ? 'text-primary font-semibold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                    {s.categories[i]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-garamond text-headline-sm text-primary mb-6">{s.priceRange}</h3>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceMax}
              onChange={e => setPriceMax(+e.target.value)}
              className="w-full h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between font-jakarta text-label-md text-on-surface-variant mt-2">
              <span>0 ج.م</span>
              <span>{priceMax} ج.م</span>
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-garamond text-headline-sm text-primary mb-6">{s.sortBy}</h3>
            <select
              value={sortBy}
              onChange={e => setSortBy(+e.target.value)}
              className="w-full bg-surface-container border-none rounded-lg font-jakarta text-body-sm px-4 py-3 text-on-surface-variant focus:ring-2 focus:ring-primary"
            >
              {s.sortOptions.map((opt, i) => (
                <option key={i} value={i}>{opt}</option>
              ))}
            </select>
          </div>
        </aside>

        {/* Grid */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {paginated.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 col-span-3"
              >
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-4 block">search_off</span>
                <h3 className="font-garamond text-headline-sm text-on-surface-variant mb-3">
                  {lang === 'ar' ? 'لا توجد منتجات مطابقة' : 'No products found'}
                </h3>
                <p className="font-jakarta text-body-md text-on-surface-variant/70 mb-6">
                  {lang === 'ar' ? 'جربي تعديل الفلاتر أو البحث بكلمة أخرى' : 'Try adjusting your filters or search with a different term'}
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-primary text-on-primary px-8 py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity"
                >
                  {lang === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter"
              >
                {paginated.map((p, i) => (
                  <motion.div
                    key={p.id}
                    className="group relative bg-white rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <div
                      className="aspect-[4/5] w-full overflow-hidden bg-surface-container-low relative cursor-pointer"
                      onClick={() => navigate(`/shop/${p.id}`)}
                    >
                      <img
                        src={p.image}
                        alt={lang === 'ar' ? p.name : (p.nameEn || p.name)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {p.badge && (
                        <span className={`absolute top-4 right-4 ${p.badgeColor || 'bg-secondary text-white'} px-3 py-1 rounded-full font-jakarta text-label-md`}>
                          {lang === 'ar' ? p.badge : (p.badgeEn || p.badge)}
                        </span>
                      )}
                    </div>
                    <div className="p-6 text-right">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-jakarta text-label-md text-secondary uppercase tracking-widest">{p.categoryLabel}</span>
                        <StarRating rating={p.rating} />
                      </div>
                      <h3
                        className="font-garamond text-headline-sm text-primary mb-2 cursor-pointer hover:underline"
                        onClick={() => navigate(`/shop/${p.id}`)}
                      >
                        {lang === 'ar' ? p.name : (p.nameEn || p.name)}
                      </h3>
                      <div className="flex flex-row-reverse items-center gap-3 mb-6">
                        <span className="font-jakarta text-body-md text-primary font-bold">{p.price} ج.م</span>
                        {p.originalPrice && (
                          <span className="font-jakarta text-body-sm text-on-surface-variant line-through">{p.originalPrice} ج.م</span>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addItem(p)}
                        className="w-full bg-primary text-white py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                        {s.addToCart}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-jakarta text-label-md transition-colors ${n === page ? 'bg-primary text-white' : 'border border-outline-variant text-on-surface-variant hover:bg-primary hover:text-white'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-primary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
