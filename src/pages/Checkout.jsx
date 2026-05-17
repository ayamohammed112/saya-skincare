import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useAccount } from '../context/AccountContext'

const GIFT_WRAP_PRICE = 20

export default function Checkout() {
  const { items, total, removeItem, updateQty, clearCart } = useCart()
  const { tr, lang } = useLanguage()
  const { user, earnPoints, spendPoints, recordOrder } = useAccount()
  const navigate = useNavigate()
  const c = tr.checkout

  const [payment, setPayment] = useState('cod')
  const [discountCode, setDiscountCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountError, setDiscountError] = useState(false)
  const [discountApplied, setDiscountApplied] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [city, setCity] = useState('cairo')
  const [giftWrap, setGiftWrap] = useState(false)
  const [pointsRedeemed, setPointsRedeemed] = useState(false)
  const [pointsDiscount, setPointsDiscount] = useState(0)

  const baseShipping = city === 'cairo' ? 85 : 100
  const shipping = total > 300 ? 0 : baseShipping
  const giftWrapCost = giftWrap ? GIFT_WRAP_PRICE : 0
  const finalTotal = total - discount - pointsDiscount + shipping + giftWrapCost

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'SAYA10') {
      setDiscount(Math.round(total * 0.10))
      setDiscountApplied(true)
      setDiscountError(false)
    } else {
      setDiscountError(true)
      setDiscountApplied(false)
      setDiscount(0)
    }
  }

  const redeemPoints = () => {
    if (!user || pointsRedeemed) return
    const d = spendPoints(100)
    if (d > 0) {
      setPointsDiscount(d)
      setPointsRedeemed(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (user) {
      earnPoints(finalTotal)
      recordOrder({ id: `SY-${Date.now()}`, date: new Date().toLocaleDateString('ar-EG'), total: finalTotal })
    }
    clearCart()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-primary text-[80px] mb-6">
          <span className="material-symbols-outlined text-[80px] ms-filled">check_circle</span>
        </motion.div>
        <h1 className="font-garamond text-headline-md text-primary mb-4">{lang === 'ar' ? 'تم استلام طلبك!' : 'Order Received!'}</h1>
        <p className="font-jakarta text-body-lg text-on-surface-variant mb-8">{lang === 'ar' ? 'شكراً لطلبك. سنتواصل معك قريباً لتأكيد التوصيل.' : 'Thank you for your order. We will contact you soon to confirm delivery.'}</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="bg-primary text-on-primary px-10 py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity inline-block">
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
          <Link to="/tracking" className="border border-primary text-primary px-10 py-4 rounded-full font-jakarta text-label-md hover:bg-primary/5 transition-colors inline-block">
            {lang === 'ar' ? 'تتبع طلبك' : 'Track Order'}
          </Link>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant/30 mb-4 block">shopping_cart</span>
          <h1 className="font-garamond text-headline-md text-primary mb-4">
            {lang === 'ar' ? 'سلتك فارغة' : 'Your Cart is Empty'}
          </h1>
          <p className="font-jakarta text-body-lg text-on-surface-variant mb-8">
            {lang === 'ar' ? 'أضيفي بعض المنتجات أولاً للمتابعة' : 'Add some products first to continue'}
          </p>
          <Link to="/shop" className="bg-primary text-on-primary px-10 py-4 rounded-full font-jakarta text-label-md hover:opacity-90 transition-opacity inline-block">
            {lang === 'ar' ? 'تصفح المتجر' : 'Browse Shop'}
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-garamond text-headline-md text-primary mb-2">{c.title}</h1>
        <p className="font-jakarta text-body-md text-on-surface-variant">{c.sub}</p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          {/* Checkout form */}
          <section className="md:col-span-7 space-y-12">
            {/* Shipping */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <h2 className="font-garamond text-headline-sm text-primary mb-8 border-b border-outline-variant/20 pb-4">{c.shipping}</h2>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <div>
                    <label className="block font-jakarta text-label-md text-secondary mb-1">{c.fullName}</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md"
                      placeholder={lang === 'ar' ? 'أدخل اسمك الثلاثي' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label className="block font-jakarta text-label-md text-secondary mb-1">{c.phone}</label>
                    <input
                      required
                      type="tel"
                      dir="ltr"
                      pattern="[0-9]{10,11}"
                      className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md text-right"
                      placeholder="01x xxxx xxxx"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-jakarta text-label-md text-secondary mb-1">{c.email}</label>
                  <input
                    type="email"
                    className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md"
                    placeholder="example@mail.com"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <div>
                    <label className="block font-jakarta text-label-md text-secondary mb-1">{c.city}</label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md appearance-none"
                    >
                      <option value="cairo">{lang === 'ar' ? 'القاهرة' : 'Cairo'}</option>
                      <option value="other">{lang === 'ar' ? 'الجيزة' : 'Giza'}</option>
                      <option value="other">{lang === 'ar' ? 'الإسكندرية' : 'Alexandria'}</option>
                      <option value="other">{lang === 'ar' ? 'الأقصر' : 'Luxor'}</option>
                      <option value="other">{lang === 'ar' ? 'أسوان' : 'Aswan'}</option>
                      <option value="other">{lang === 'ar' ? 'بورسعيد' : 'Port Said'}</option>
                      <option value="other">{lang === 'ar' ? 'السويس' : 'Suez'}</option>
                      <option value="other">{lang === 'ar' ? 'المنصورة' : 'Mansoura'}</option>
                      <option value="other">{lang === 'ar' ? 'طنطا' : 'Tanta'}</option>
                      <option value="other">{lang === 'ar' ? 'محافظة أخرى' : 'Other Governorate'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-jakarta text-label-md text-secondary mb-1">{c.address}</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-transparent border-b border-outline-variant/40 py-2 focus:outline-none focus:border-primary transition-colors font-jakarta text-body-md"
                      placeholder={lang === 'ar' ? 'الشارع، المبنى، الشقة' : 'Street, Building, Apt'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Wrapping */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/10">
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div className="flex-1 text-right">
                  <span className="block font-jakarta text-body-md text-on-surface mb-1">
                    {lang === 'ar' ? 'تغليف هدايا' : 'Gift Wrapping'}
                  </span>
                  <span className="block font-jakarta text-body-sm text-on-surface-variant">
                    {lang === 'ar' ? 'تغليف أنيق برباط وبطاقة هدية — يُضاف ٢٠ ج.م' : 'Elegant wrap with ribbon & gift card — adds 20 EGP'}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-jakarta text-label-md text-secondary font-bold">+{GIFT_WRAP_PRICE} ج.م</span>
                  <div
                    onClick={() => setGiftWrap(v => !v)}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${giftWrap ? 'bg-primary' : 'bg-outline-variant/40'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${giftWrap ? 'right-1' : 'left-1'}`} />
                  </div>
                </div>
              </label>
            </div>

            {/* Payment */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <h2 className="font-garamond text-headline-sm text-primary mb-8 border-b border-outline-variant/20 pb-4">{c.payment}</h2>
              <div className="space-y-4">
                {[
                  { val: 'cod', label: c.cod, sub: c.codSub, icon: 'payments' },
                  { val: 'wallet', label: c.wallet, sub: c.walletSub, icon: 'account_balance_wallet' },
                ].map(m => (
                  <label key={m.val} className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${payment === m.val ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container-low'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={m.val}
                      checked={payment === m.val}
                      onChange={() => setPayment(m.val)}
                      className="form-radio text-primary h-5 w-5 ml-4 accent-primary"
                    />
                    <div className="flex-1">
                      <span className="block font-jakarta text-body-lg text-on-surface">{m.label}</span>
                      <span className="block font-jakarta text-body-sm text-on-surface-variant">{m.sub}</span>
                    </div>
                    <span className={`material-symbols-outlined ${payment === m.val ? 'text-primary' : 'text-secondary opacity-40'}`}>{m.icon}</span>
                  </label>
                ))}
                {payment === 'wallet' && (
                  <div className="mt-4 p-6 bg-surface-container rounded-lg border border-dashed border-outline-variant/60">
                    <p className="font-jakarta text-body-sm text-secondary mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">info</span>
                      {c.receipt}
                    </p>
                    <label className="flex flex-col items-center justify-center py-6 bg-white border border-outline-variant/30 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <span className="material-symbols-outlined text-primary text-[32px] mb-2">upload_file</span>
                      <span className="font-jakarta text-label-md text-on-surface-variant">{c.upload}</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="md:col-span-5 sticky top-28">
            <div className="bg-surface-container-highest/30 backdrop-blur-sm p-8 rounded-xl border border-outline-variant/20">
              <h2 className="font-garamond text-headline-sm text-primary mb-8 border-b border-outline-variant/30 pb-4 text-center">{c.summary}</h2>

              <div className="space-y-6 mb-8">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-20 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-outline-variant/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-garamond text-body-md text-primary leading-snug">
                        {lang === 'ar' ? item.name : (item.nameEn || item.name)}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-jakarta text-body-md font-bold">{item.price * item.qty} ج.م</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="material-symbols-outlined text-primary text-[18px] hover:opacity-60"
                          >
                            remove
                          </button>
                          <span className="font-jakarta text-body-sm px-2 min-w-[24px] text-center">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="material-symbols-outlined text-primary text-[18px] hover:opacity-60"
                          >
                            add
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="material-symbols-outlined text-error text-[18px] mr-1 hover:opacity-60"
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Points redemption */}
              {user && user.points >= 100 && !pointsRedeemed && (
                <div className="mb-4 bg-secondary-fixed/20 p-4 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-right flex-1">
                    <p className="font-jakarta text-label-md text-primary font-bold mb-0.5">
                      {lang === 'ar' ? `لديكِ ${user.points} نقطة` : `You have ${user.points} points`}
                    </p>
                    <p className="font-jakarta text-body-sm text-on-surface-variant">
                      {lang === 'ar' ? 'استردي ١٠٠ نقطة بخصم ١٠ ج.م' : 'Redeem 100 pts for 10 EGP off'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={redeemPoints}
                    className="bg-secondary text-white px-5 py-2 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all flex-shrink-0"
                  >
                    {lang === 'ar' ? 'استردي' : 'Redeem'}
                  </button>
                </div>
              )}
              {pointsRedeemed && (
                <div className="mb-4 bg-primary/8 p-3 rounded-xl flex items-center gap-2 justify-end">
                  <span className="font-jakarta text-label-md text-primary">
                    {lang === 'ar' ? `تم خصم ${pointsDiscount} ج.م من نقاطك` : `${pointsDiscount} EGP deducted from your points`}
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px] ms-filled">check_circle</span>
                </div>
              )}

              {/* Discount */}
              <div className="mb-2">
                <div className="flex gap-2 mb-1">
                  <input
                    value={discountCode}
                    onChange={e => { setDiscountCode(e.target.value); setDiscountError(false) }}
                    placeholder={c.discount}
                    disabled={discountApplied}
                    className={`flex-1 bg-white border rounded-lg px-4 py-3 font-jakarta text-body-sm focus:ring-primary focus:border-primary transition-all focus:outline-none ${discountError ? 'border-error' : discountApplied ? 'border-primary' : 'border-outline-variant/40'}`}
                  />
                  <button
                    type="button"
                    onClick={applyDiscount}
                    disabled={discountApplied}
                    className="bg-secondary text-white font-jakarta text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {c.apply}
                  </button>
                </div>
                {discountError && (
                  <p className="font-jakarta text-label-md text-error flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    {lang === 'ar' ? 'كود الخصم غير صحيح' : 'Invalid discount code'}
                  </p>
                )}
                {discountApplied && (
                  <p className="font-jakarta text-label-md text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] ms-filled">check_circle</span>
                    {lang === 'ar' ? 'تم تطبيق الخصم بنجاح!' : 'Discount applied!'}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-4 border-t border-outline-variant/30 pt-6 mb-8 mt-6">
                <div className="flex justify-between font-jakarta text-body-md">
                  <span className="text-on-surface-variant">{c.subtotal}</span>
                  <span>{total} ج.م</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-jakarta text-body-md text-error">
                    <span>{lang === 'ar' ? 'الخصم (١٠٪)' : 'Discount (10%)'}</span>
                    <span>-{discount} ج.م</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between font-jakarta text-body-md text-error">
                    <span>{lang === 'ar' ? 'خصم النقاط' : 'Points Discount'}</span>
                    <span>-{pointsDiscount} ج.م</span>
                  </div>
                )}
                {giftWrap && (
                  <div className="flex justify-between font-jakarta text-body-md text-on-surface-variant">
                    <span>{lang === 'ar' ? 'تغليف هدايا' : 'Gift Wrapping'}</span>
                    <span>+{GIFT_WRAP_PRICE} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between font-jakarta text-body-md">
                  <span className="text-on-surface-variant">{c.shippingCost}</span>
                  <span className={shipping === 0 ? 'text-primary font-semibold' : ''}>
                    {shipping === 0 ? (lang === 'ar' ? 'مجاني' : 'Free') : `${shipping} ج.م`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="font-jakarta text-[11px] text-on-surface-variant/70 text-left">
                    {lang === 'ar'
                      ? `شحن مجاني للطلبات فوق ٣٠٠ ج.م`
                      : 'Free shipping on orders over 300 EGP'}
                  </p>
                )}
                <div className="flex justify-between font-jakarta font-bold text-headline-sm text-primary pt-4 border-t border-outline-variant/30">
                  <span>{c.total}</span>
                  <span>{finalTotal} ج.م</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-primary text-white font-garamond text-headline-sm py-5 rounded-full shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-3"
              >
                {c.confirm}
                <span className="material-symbols-outlined" style={{ transform: 'rotate(180deg)' }}>arrow_back</span>
              </motion.button>
              <p className="text-center font-jakarta text-label-md text-on-surface-variant mt-4">{c.terms}</p>
            </div>
          </aside>
        </div>
      </form>
    </main>
  )
}
