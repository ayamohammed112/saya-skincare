import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = 'Aya321'
const AUTH_KEY = 'saya_admin_auth'
const CATEGORIES = ['العناية بالبشرة', 'العطور', 'منتجات الشعر']
const CLOUD_NAME = 'dtkbxoqph'
const CLOUD_PRESET = 'aceit_unsigned'

async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const maxW = 800
      const scale = img.width > maxW ? maxW / img.width : 1
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      URL.revokeObjectURL(url)
      canvas.toBlob(resolve, 'image/jpeg', 0.75)
    }
    img.src = url
  })
}

async function uploadToCloudinary(file) {
  const blob = await compressImage(file)
  const fd = new FormData()
  fd.append('file', blob, 'product.jpg')
  fd.append('upload_preset', CLOUD_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  const json = await res.json()
  if (!json.secure_url) throw new Error('Upload failed')
  return json.secure_url
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setAuthed(true)
    } else {
      setPwError(true)
      setTimeout(() => setPwError(false), 1500)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuthed(false)
    setPw('')
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌿</div>
            <h1 className="text-2xl font-bold text-white mb-1">Saya Admin</h1>
            <p className="text-gray-400 text-sm">لوحة تحكم | Control Panel</p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <label className="block text-gray-400 text-xs font-semibold mb-2 tracking-widest uppercase">
              Password / كلمة المرور
            </label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm ${pwError ? 'border-red-500' : 'border-gray-700 focus:border-emerald-500'}`}
              placeholder="••••••••"
              autoFocus
            />
            {pwError && <p className="text-red-400 text-xs mt-2">كلمة المرور غير صحيحة | Incorrect password</p>}
            <button
              onClick={handleLogin}
              className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              دخول | Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <ProductsAdmin onLogout={handleLogout} />
}

function ProductsAdmin({ onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('id, name, name_ar, price, category, image_url')
      .order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(URL.createObjectURL(file))
  }

  const addProduct = async () => {
    if (!name.trim() || !price) { setError('اسم المنتج والسعر مطلوبان'); return }
    setError('')
    setSaving(true)
    let image_url = ''
    if (imageFile) {
      try {
        image_url = await uploadToCloudinary(imageFile)
      } catch {
        setError('فشل رفع الصورة، حاولي مرة أخرى')
        setSaving(false)
        return
      }
    }
    await supabase.from('products').insert({
      name: name.trim(),
      price: Number(price),
      category,
      image_url,
      in_stock: true,
    })
    setName('')
    setPrice('')
    setCategory(CATEGORIES[0])
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setSaving(false)
    load()
  }

  const deleteProduct = async (id) => {
    if (!confirm('تأكيد حذف المنتج؟')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: products.filter(p => p.category === cat),
  }))
  const uncategorized = products.filter(p => !CATEGORIES.includes(p.category))

  return (
    <div dir="rtl" className="min-h-screen bg-gray-950 text-gray-100 pb-12">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="text-white font-bold text-sm">Saya Admin</span>
        </div>
        <button
          onClick={onLogout}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-900/20"
        >
          خروج
        </button>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Add product form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-bold text-base">إضافة منتج جديد</h2>

          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1.5">اسم المنتج *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: سيروم فيتامين سي"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1.5">السعر (ج.م) *</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all placeholder-gray-600"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1.5">الفئة</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1.5">صورة المنتج</label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-emerald-600 transition-colors bg-gray-800 relative overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="معاينة" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <span className="text-3xl">📷</span>
                  <span className="text-xs">اضغطي لاختيار صورة</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {imageFile && (
              <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1">
                <span>✓</span> <span className="truncate">{imageFile.name}</span>
              </p>
            )}
          </div>

          {error && <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">{error}</p>}

          <button
            onClick={addProduct}
            disabled={saving || !name.trim() || !price}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm"
          >
            {saving ? 'جارٍ الإضافة...' : '+ إضافة المنتج'}
          </button>
        </div>

        {/* Products list */}
        <div>
          <h2 className="text-white font-bold text-base mb-4">
            المنتجات الحالية
            {!loading && <span className="text-gray-500 font-normal text-xs mr-2">({products.length})</span>}
          </h2>

          {loading ? (
            <p className="text-gray-500 text-sm text-center py-10">جارٍ التحميل...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-10">لا توجد منتجات بعد</p>
          ) : (
            <div className="space-y-6">
              {grouped.map(({ cat, items }) =>
                items.length === 0 ? null : (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-emerald-400 text-xs font-bold">{cat}</span>
                      <span className="text-gray-700 text-xs">({items.length})</span>
                    </div>
                    <div className="space-y-2">
                      {items.map(p => (
                        <ProductCard key={p.id} product={p} onDelete={deleteProduct} />
                      ))}
                    </div>
                  </div>
                )
              )}
              {uncategorized.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gray-400 text-xs font-bold">أخرى</span>
                    <span className="text-gray-700 text-xs">({uncategorized.length})</span>
                  </div>
                  <div className="space-y-2">
                    {uncategorized.map(p => (
                      <ProductCard key={p.id} product={p} onDelete={deleteProduct} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product: p, onDelete }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-3 p-3">
      <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
        {p.image_url
          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-xl">🧴</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium leading-snug truncate">{p.name || p.name_ar}</p>
        <p className="text-gray-500 text-xs mt-0.5">{p.category || '—'}</p>
        <p className="text-emerald-400 text-sm font-bold mt-0.5">{p.price} ج.م</p>
      </div>
      <button
        onClick={() => onDelete(p.id)}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-all text-base"
        title="حذف"
      >
        🗑
      </button>
    </div>
  )
}
