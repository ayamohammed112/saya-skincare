import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { tr, lang } = useLanguage()
  const navigate = useNavigate()
  const p = tr.product

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImg, setMainImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single()
      if (data) {
        setProduct(data)
        const sizes = data.sizes || []
        if (sizes.length > 0) setSelectedSize(sizes[0])
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto flex justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mt-24" />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto text-center">
        <p className="font-jakarta text-body-lg text-on-surface-variant mt-24">
          {lang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
        </p>
        <Link to="/shop" className="text-primary underline font-jakarta text-body-md mt-4 inline-block">
          {lang === 'ar' ? 'العودة للمتجر' : 'Back to shop'}
        </Link>
      </main>
    )
  }

  const sizes = product.sizes || []
  const basePrice = sizes.length > 0 ? Math.min(...sizes.map(s => s.price)) : product.price
  const displayPrice = selectedSize ? selectedSize.price : basePrice
  const gallery = product.image_url
    ? [product.image_url, product.image_url, product.image_url, product.image_url]
    : []
  const displayName = product.name || ''

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      nameEn: product.name,
      price: displayPrice,
      image: product.image_url,
      qty,
      ...(selectedSize ? { size: `${selectedSize.ml}ml` } : {}),
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
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
            {gallery[mainImg] && (
              <img src={gallery[mainImg]} alt={displayName} className="w-full h-full object-cover" />
            )}
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
          <h1 className="font-garamond text-display-lg text-primary mb-2 leading-tight">{displayName}</h1>

          <div className="font-garamond text-headline-md text-primary mb-8">{displayPrice} ج.م</div>

          {product.description && (
            <p className="font-jakarta text-body-lg text-on-surface-variant mb-10 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-8">
              <p className="font-jakarta text-label-md text-on-surface-variant uppercase tracking-wider mb-3">
                {lang === 'ar' ? 'الحجم' : 'Size'}
              </p>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 rounded-xl border-2 font-jakarta text-body-sm transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-on-primary shadow-md'
                        : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size.ml}ml
                  </button>
                ))}
              </div>
            </div>
          )}

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
          <div className="font-jakarta text-body-lg text-on-surface-variant leading-relaxed max-w-xl">
            {product.description || (lang === 'ar' ? 'لا يوجد وصف متاح.' : 'No description available.')}
          </div>
        )}
        {activeTab === 1 && (
          <div className="font-jakarta text-body-md text-on-surface-variant leading-loose max-w-xl">
            {lang === 'ar' ? 'يرجى مراجعة العبوة لمعرفة طريقة الاستخدام.' : 'Please refer to packaging for usage instructions.'}
          </div>
        )}
        {activeTab === 2 && (
          <div className="font-jakarta text-body-md text-on-surface-variant leading-loose max-w-xl">
            {lang === 'ar' ? 'يرجى مراجعة العبوة لمعرفة المكونات الكاملة.' : 'Please refer to packaging for full ingredient list.'}
          </div>
        )}
        {activeTab === 3 && (
          <div className="font-jakarta text-body-md text-on-surface-variant leading-loose max-w-xl">
            {lang === 'ar'
              ? 'شحن مجاني على الطلبات فوق ٣٠٠ ج.م. التوصيل خلال ٣-٥ أيام عمل. إمكانية الإرجاع خلال ١٤ يوم من تاريخ الاستلام.'
              : 'Free shipping on orders over 300 EGP. Delivery within 3-5 business days. Returns accepted within 14 days of receipt.'}
          </div>
        )}
      </section>
    </main>
  )
}
