import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const BLANK = {
  name: '', name_en: '', price: '', original_price: '', category: '',
  in_stock: true, featured: false, stock_quantity: '', low_stock_threshold: 3,
  image_url: '',
}

export default function ProductsSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null) // null = closed, 'new' = new, id = edit
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [sizesInput, setSizesInput] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const loadSizesForProduct = async (productId) => {
    const { data } = await supabase.from('product_sizes').select('label').eq('product_id', productId).order('sort_order')
    setSizesInput((data || []).map(s => s.label).join(', '))
  }

  const saveSizesFor = async (productId) => {
    await supabase.from('product_sizes').delete().eq('product_id', productId)
    const labels = sizesInput.split(',').map(s => s.trim()).filter(Boolean)
    if (labels.length > 0) {
      await supabase.from('product_sizes').insert(
        labels.map((label, i) => ({ product_id: productId, label, sort_order: i }))
      )
    }
  }

  const openNew = () => { setForm(BLANK); setEditing('new'); setImageFile(null); setSizesInput('') }
  const openEdit = (p) => { setForm({ ...BLANK, ...p }); setEditing(p.id); setImageFile(null); loadSizesForProduct(p.id) }
  const cancel = () => { setEditing(null); setForm(BLANK); setImageFile(null); setSizesInput('') }

  const uploadImage = async () => {
    if (!imageFile) return form.image_url || null
    setUploading(true)
    const ext = imageFile.name.split('.').pop()
    const path = `products/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, imageFile, { upsert: true })
    if (error) { setUploading(false); return form.image_url || null }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setUploading(false)
    return data.publicUrl
  }

  const save = async () => {
    if (!form.name || !form.price) return
    setSaving(true)
    const imageUrl = await uploadImage()
    const payload = {
      name: form.name,
      name_en: form.name_en,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      category: form.category,
      in_stock: form.in_stock,
      featured: form.featured,
      stock_quantity: form.stock_quantity !== '' ? Number(form.stock_quantity) : null,
      image_url: imageUrl,
    }
    if (editing === 'new') {
      const { data: newProd } = await supabase.from('products').insert(payload).select('id').single()
      if (newProd) {
        if (form.low_stock_threshold) {
          await supabase.from('inventory_alerts').upsert({ product_id: newProd.id, low_stock_threshold: Number(form.low_stock_threshold) }, { onConflict: 'product_id' })
        }
        await saveSizesFor(newProd.id)
      }
    } else {
      await supabase.from('products').update(payload).eq('id', editing)
      if (form.low_stock_threshold) {
        await supabase.from('inventory_alerts').upsert({ product_id: editing, low_stock_threshold: Number(form.low_stock_threshold) }, { onConflict: 'product_id' })
      }
      await saveSizesFor(editing)
    }
    setSaving(false)
    cancel()
    load()
  }

  const deleteProduct = async (id) => {
    if (!confirm('حذف هذا المنتج؟ | Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = products.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.name_en?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-white text-xl font-bold">المنتجات | Products</h1>
        <div className="flex gap-2 flex-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث... | Search..."
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm outline-none w-40"
          />
          <button
            onClick={openNew}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            + منتج جديد | New Product
          </button>
        </div>
      </div>

      {/* Form */}
      {editing !== null && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold">{editing === 'new' ? 'منتج جديد | New Product' : 'تعديل المنتج | Edit Product'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="الاسم بالعربية | Arabic Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <Field label="الاسم بالإنجليزية | English Name" value={form.name_en} onChange={v => setForm(f => ({ ...f, name_en: v }))} />
            <Field label="السعر ج.م | Price EGP" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} type="number" required />
            <Field label="السعر الأصلي | Original Price" value={form.original_price} onChange={v => setForm(f => ({ ...f, original_price: v }))} type="number" />
            <Field label="الفئة | Category" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
            <Field label="الكمية | Stock Qty" value={form.stock_quantity} onChange={v => setForm(f => ({ ...f, stock_quantity: v }))} type="number" />
            <Field label="حد التنبيه | Alert Threshold" value={form.low_stock_threshold} onChange={v => setForm(f => ({ ...f, low_stock_threshold: v }))} type="number" />
          </div>

          {/* Toggles */}
          <div className="flex gap-6 flex-wrap">
            <Toggle label="متوفر | In Stock" checked={form.in_stock} onChange={v => setForm(f => ({ ...f, in_stock: v }))} />
            <Toggle label="مميز | Featured" checked={form.featured} onChange={v => setForm(f => ({ ...f, featured: v }))} />
          </div>

          {/* Sizes */}
          <div className="col-span-2">
            <label className="text-gray-400 text-xs font-semibold block mb-1">الأحجام | Sizes (e.g. 50ml, 100ml, 200ml)</label>
            <input
              value={sizesInput}
              onChange={e => setSizesInput(e.target.value)}
              placeholder="50ml, 100ml, 200ml"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-all"
            />
            <p className="text-gray-600 text-xs mt-1">ادخلي الأحجام مفصولة بفاصلة | Enter sizes comma-separated</p>
          </div>

          {/* Image upload */}
          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-2">صورة المنتج | Product Image</label>
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
              disabled={saving || uploading || !form.name || !form.price}
              className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {saving || uploading ? 'جارٍ الحفظ...' : 'حفظ | Save'}
            </button>
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-4">
              <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-2xl">🧴</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                <p className="text-gray-500 text-xs truncate">{p.name_en}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-emerald-400 text-sm font-bold">{p.price} ج.م</span>
                  {p.original_price && <span className="text-gray-600 text-xs line-through">{p.original_price} ج.م</span>}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.in_stock ? 'bg-emerald-900/40 text-emerald-400' : 'bg-red-900/40 text-red-400'}`}>
                    {p.in_stock ? 'متوفر' : 'نفذ'}
                  </span>
                  {p.stock_quantity !== null && (
                    <span className={`text-xs ${p.stock_quantity <= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                      qty: {p.stock_quantity}
                    </span>
                  )}
                  {p.featured && <span className="text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded-full">مميز</span>}
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => openEdit(p)} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-lg transition-all">تعديل | Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 px-2 py-1 rounded-lg transition-all">حذف | Delete</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-gray-600 text-sm col-span-3">لا توجد منتجات | No products</p>}
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="text-gray-400 text-xs font-semibold block mb-1">{label}{required && ' *'}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 transition-all"
      />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full relative transition-all ${checked ? 'bg-emerald-600' : 'bg-gray-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${checked ? 'right-1' : 'left-1'}`} />
      </div>
      <span className="text-gray-300 text-sm">{label}</span>
    </label>
  )
}
