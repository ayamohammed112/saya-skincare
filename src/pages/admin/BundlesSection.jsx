import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const BLANK = { name: '', name_en: '', description: '', description_en: '', price: '', original_price: '', product_ids: [], image_url: '' }

export default function BundlesSection() {
  const [bundles, setBundles] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    setLoading(true)
    const [bundlesRes, productsRes] = await Promise.all([
      supabase.from('bundles').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('id,name,name_en,price,image_url'),
    ])
    setBundles(bundlesRes.data || [])
    setProducts(productsRes.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(BLANK); setEditing('new'); setImageFile(null) }
  const openEdit = (b) => { setForm({ ...BLANK, ...b, product_ids: Array.isArray(b.product_ids) ? b.product_ids : [] }); setEditing(b.id); setImageFile(null) }
  const cancel = () => { setEditing(null); setForm(BLANK); setImageFile(null) }

  const toggleProduct = (id) => {
    setForm(f => ({
      ...f,
      product_ids: f.product_ids.includes(id) ? f.product_ids.filter(x => x !== id) : [...f.product_ids, id],
    }))
  }

  const uploadImage = async () => {
    if (!imageFile) return form.image_url || null
    setUploading(true)
    const ext = imageFile.name.split('.').pop()
    const path = `bundles/${Date.now()}.${ext}`
    await supabase.storage.from('product-images').upload(path, imageFile, { upsert: true })
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setUploading(false)
    return data.publicUrl
  }

  const save = async () => {
    if (!form.name || !form.price || form.product_ids.length < 2) return
    setSaving(true)
    const imageUrl = await uploadImage()
    const payload = {
      name: form.name,
      name_en: form.name_en,
      description: form.description,
      description_en: form.description_en,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      product_ids: form.product_ids,
      image_url: imageUrl,
    }
    if (editing === 'new') {
      await supabase.from('bundles').insert(payload)
    } else {
      await supabase.from('bundles').update(payload).eq('id', editing)
    }
    setSaving(false)
    cancel()
    load()
  }

  const deleteBundle = async (id) => {
    if (!confirm('حذف هذه الحزمة؟ | Delete this bundle?')) return
    await supabase.from('bundles').delete().eq('id', id)
    setBundles(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">الحزم | Bundles</h1>
        <button onClick={openNew} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
          + حزمة جديدة | New Bundle
        </button>
      </div>

      {/* Form */}
      {editing !== null && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold">{editing === 'new' ? 'حزمة جديدة | New Bundle' : 'تعديل الحزمة | Edit Bundle'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'الاسم بالعربية | Arabic Name', required: true },
              { key: 'name_en', label: 'الاسم بالإنجليزية | English Name' },
              { key: 'price', label: 'سعر الحزمة ج.م | Bundle Price', type: 'number', required: true },
              { key: 'original_price', label: 'السعر الأصلي | Original Price', type: 'number' },
              { key: 'description', label: 'الوصف بالعربية | Arabic Desc' },
              { key: 'description_en', label: 'الوصف بالإنجليزية | English Desc' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-gray-400 text-xs font-semibold block mb-1">{f.label}{f.required && ' *'}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key] ?? ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            ))}
          </div>

          {/* Product picker */}
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-2">
              المنتجات | Products ({form.product_ids.length} مختارة — min 2)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
              {products.map(p => {
                const sel = form.product_ids.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    className={`p-2 rounded-xl border-2 text-right transition-all ${sel ? 'border-emerald-500 bg-emerald-900/30' : 'border-gray-700 hover:border-gray-500 bg-gray-800'}`}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-700 mb-1">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🧴</div>}
                    </div>
                    <p className="text-xs text-gray-300 leading-tight line-clamp-2">{p.name}</p>
                    <p className="text-xs text-emerald-400 mt-0.5">{p.price} ج.م</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-2">صورة الحزمة | Bundle Image</label>
            {form.image_url && !imageFile && (
              <img src={form.image_url} alt="current" className="h-20 w-20 object-cover rounded-lg mb-2 border border-gray-700" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0] || null)}
              className="text-sm text-gray-400 file:bg-gray-700 file:text-gray-300 file:border-0 file:rounded-lg file:px-3 file:py-1.5 file:text-xs file:mr-2 file:cursor-pointer"
            />
            {imageFile && <p className="text-emerald-400 text-xs mt-1">✓ {imageFile.name}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={cancel} className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white rounded-lg text-sm transition-all">إلغاء | Cancel</button>
            <button
              onClick={save}
              disabled={saving || uploading || !form.name || !form.price || form.product_ids.length < 2}
              className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {saving || uploading ? 'جارٍ الحفظ...' : 'حفظ | Save'}
            </button>
          </div>
        </div>
      )}

      {/* Bundles list */}
      {loading ? (
        <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
      ) : (
        <div className="space-y-3">
          {bundles.map(b => {
            const bProducts = Array.isArray(b.product_ids)
              ? b.product_ids.map(id => products.find(p => p.id === id)).filter(Boolean)
              : []
            return (
              <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-wrap gap-4 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                  {b.image_url ? <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎁</div>}
                </div>
                <div className="flex gap-1">
                  {bProducts.slice(0, 3).map(p => (
                    <div key={p.id} className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🧴</div>}
                    </div>
                  ))}
                  {bProducts.length > 3 && <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-500">+{bProducts.length - 3}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{b.name}</p>
                  <p className="text-gray-500 text-xs">{b.name_en}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{b.product_ids?.length || 0} منتجات | products</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {b.original_price && <p className="text-gray-600 text-xs line-through">{b.original_price} ج.م</p>}
                  <p className="text-emerald-400 font-bold">{b.price} ج.م</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(b)} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg transition-all">تعديل | Edit</button>
                  <button onClick={() => deleteBundle(b.id)} className="text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 px-3 py-1.5 rounded-lg transition-all">حذف | Delete</button>
                </div>
              </div>
            )
          })}
          {bundles.length === 0 && <p className="text-gray-600 text-sm">لا توجد حزم | No bundles</p>}
        </div>
      )}
    </div>
  )
}
