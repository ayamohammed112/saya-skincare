import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../context/LanguageContext'
import { products } from '../data/products'
import { bundles as defaultBundles } from '../data/bundles'

function loadBundles() {
  try {
    const stored = localStorage.getItem('saya_custom_bundles')
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

function saveBundles(b) {
  localStorage.setItem('saya_custom_bundles', JSON.stringify(b))
}

const blank = { name: '', nameEn: '', description: '', descriptionEn: '', productIds: [], bundlePrice: '', originalTotal: '' }

export default function AdminBundles() {
  const { lang } = useLanguage()
  const [bundles, setBundles] = useState(() => loadBundles() || defaultBundles)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const [saved, setSaved] = useState(false)

  const persist = (next) => {
    setBundles(next)
    saveBundles(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const startEdit = (bundle) => {
    setEditing(bundle.id)
    setForm({ ...bundle, productIds: [...bundle.productIds] })
  }

  const startNew = () => {
    setEditing('__new__')
    setForm({ ...blank, id: `b${Date.now()}` })
  }

  const cancel = () => { setEditing(null); setForm(blank) }

  const saveForm = () => {
    if (!form.name || !form.bundlePrice || form.productIds.length < 2) return
    const entry = {
      ...form,
      bundlePrice: Number(form.bundlePrice),
      originalTotal: Number(form.originalTotal) || form.productIds.reduce((s, id) => s + (products.find(p => p.id === id)?.price || 0), 0),
      badge: `وفري ${Number(form.originalTotal || 0) - Number(form.bundlePrice)} ج.م`,
      badgeEn: `Save ${Number(form.originalTotal || 0) - Number(form.bundlePrice)} EGP`,
    }
    const next = editing === '__new__'
      ? [...bundles, entry]
      : bundles.map(b => b.id === editing ? entry : b)
    persist(next)
    cancel()
  }

  const deleteBundle = (id) => {
    if (!confirm(lang === 'ar' ? 'حذف هذه الحزمة؟' : 'Delete this bundle?')) return
    persist(bundles.filter(b => b.id !== id))
  }

  const toggleProduct = (id) => {
    setForm(f => ({
      ...f,
      productIds: f.productIds.includes(id) ? f.productIds.filter(x => x !== id) : [...f.productIds, id],
    }))
  }

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-site mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-jakarta text-label-md">
                {lang === 'ar' ? 'لوحة الإدارة' : 'Admin'}
              </span>
              {saved && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-jakarta text-label-md text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] ms-filled">check_circle</span>
                  {lang === 'ar' ? 'تم الحفظ' : 'Saved'}
                </motion.span>
              )}
            </div>
            <h1 className="font-garamond text-headline-md text-primary">
              {lang === 'ar' ? 'إدارة الباكيدجات' : 'Manage Bundles'}
            </h1>
          </div>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {lang === 'ar' ? 'حزمة جديدة' : 'New Bundle'}
          </button>
        </div>
      </motion.div>

      {/* Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-surface-container-low rounded-2xl p-8 mb-10 border border-primary/20 overflow-hidden"
        >
          <h2 className="font-garamond text-headline-sm text-primary mb-6 text-right">
            {editing === '__new__' ? (lang === 'ar' ? 'حزمة جديدة' : 'New Bundle') : (lang === 'ar' ? 'تعديل الحزمة' : 'Edit Bundle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              { key: 'name', label: 'الاسم بالعربية', placeholder: 'روتين النضارة...' },
              { key: 'nameEn', label: 'Name in English', placeholder: 'Radiance Routine...' },
              { key: 'bundlePrice', label: 'سعر الحزمة (ج.م)', placeholder: '420', type: 'number' },
              { key: 'originalTotal', label: 'السعر الأصلي (ج.م)', placeholder: '525', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block font-jakarta text-label-md text-secondary mb-1 text-right">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 font-jakarta text-body-sm focus:outline-none focus:border-primary transition-colors text-right"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-jakarta text-label-md text-secondary mb-1 text-right">الوصف بالعربية</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 font-jakarta text-body-sm focus:outline-none focus:border-primary transition-colors text-right resize-none"
              />
            </div>
            <div>
              <label className="block font-jakarta text-label-md text-secondary mb-1 text-right">Description in English</label>
              <textarea
                value={form.descriptionEn}
                onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))}
                rows={3}
                className="w-full bg-white border border-outline-variant/30 rounded-lg px-4 py-3 font-jakarta text-body-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Product picker */}
          <div className="mb-6">
            <label className="block font-jakarta text-label-md text-secondary mb-3 text-right">
              {lang === 'ar' ? `المنتجات (${form.productIds.length} مختارة)` : `Products (${form.productIds.length} selected)`}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
              {products.map(p => {
                const selected = form.productIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-right ${selected ? 'border-primary bg-primary/8' : 'border-outline-variant/30 hover:border-primary/40'}`}
                  >
                    <img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                    <p className="font-jakarta text-[11px] text-on-surface leading-snug">{p.name}</p>
                    <p className="font-jakarta text-[11px] text-secondary mt-1">{p.price} ج.م</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={cancel}
              className="border border-outline-variant/50 text-on-surface-variant px-6 py-3 rounded-full font-jakarta text-label-md hover:border-error hover:text-error transition-colors"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={saveForm}
              disabled={!form.name || !form.bundlePrice || form.productIds.length < 2}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-jakarta text-label-md hover:opacity-90 transition-all disabled:opacity-40"
            >
              {lang === 'ar' ? 'حفظ الحزمة' : 'Save Bundle'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Bundles list */}
      <div className="space-y-4">
        {bundles.map((bundle, i) => {
          const bProducts = bundle.productIds.map(id => products.find(p => p.id === id)).filter(Boolean)
          return (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 flex items-center gap-6 flex-wrap"
            >
              <div className="flex gap-2 flex-shrink-0">
                {bProducts.slice(0, 3).map(p => (
                  <div key={p.id} className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-garamond text-headline-sm text-primary mb-1">{bundle.name}</h3>
                <p className="font-jakarta text-body-sm text-on-surface-variant line-clamp-1">{bundle.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-jakarta text-label-md text-on-surface-variant/60 line-through">{bundle.originalTotal} ج.م</p>
                <p className="font-garamond text-headline-sm text-primary">{bundle.bundlePrice} ج.م</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(bundle)}
                  className="flex items-center gap-1 border border-outline-variant/40 text-on-surface-variant px-4 py-2 rounded-full font-jakarta text-label-md hover:border-primary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  {lang === 'ar' ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteBundle(bundle.id)}
                  className="flex items-center gap-1 border border-outline-variant/40 text-on-surface-variant px-4 py-2 rounded-full font-jakarta text-label-md hover:border-error hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  {lang === 'ar' ? 'حذف' : 'Delete'}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="font-jakarta text-body-sm text-on-surface-variant/60 text-center mt-8">
        {lang === 'ar'
          ? 'التعديلات تُحفظ محلياً. للنشر الكامل، تحتاج لتحديث ملف bundles.js.'
          : 'Changes are saved locally. For full deployment, update the bundles.js file.'}
      </p>
    </main>
  )
}
