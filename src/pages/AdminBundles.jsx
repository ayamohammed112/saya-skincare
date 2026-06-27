import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
  fd.append('file', blob, 'bundle.jpg')
  fd.append('upload_preset', CLOUD_PRESET)
  fd.append('cloud_name', CLOUD_NAME)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  })
  const json = await res.json()
  console.log('[Cloudinary response]', json)
  if (!json.secure_url) throw new Error(json.error?.message || JSON.stringify(json))
  return json.secure_url
}

export default function AdminBundles() {
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('bundles')
      .select('id, name_ar, price, description_ar, image_url')
      .order('created_at', { ascending: false })
    setBundles(data || [])
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

  const addBundle = async () => {
    if (!name.trim() || !price) { setError('الاسم والسعر مطلوبان'); return }
    setError('')
    setSaving(true)
    let image_url = ''
    if (imageFile) {
      try {
        image_url = await uploadToCloudinary(imageFile)
      } catch (err) {
        console.error('[Upload error - AdminBundles]', err)
        setError('فشل رفع الصورة: ' + err.message)
        setSaving(false)
        return
      }
    }
    const { error: insertError } = await supabase.from('bundles').insert({
      name_ar: name.trim(),
      price: Number(price),
      description_ar: description.trim(),
      image_url,
    })
    if (insertError) {
      setError('فشل الحفظ: ' + insertError.message)
      setSaving(false)
      return
    }
    setName('')
    setPrice('')
    setDescription('')
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setSaving(false)
    load()
  }

  const deleteBundle = async (id) => {
    if (!confirm('تأكيد حذف الباكيدج؟')) return
    await supabase.from('bundles').delete().eq('id', id)
    setBundles(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-950 text-gray-100 pb-12">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <span className="text-white font-bold text-sm">Saya Admin — الباكيدجات</span>
        </div>
        <a
          href="/admin"
          className="text-xs text-gray-500 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-900/20"
        >
          ← المنتجات
        </a>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Add bundle form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-white font-bold text-base">إضافة باكيدج جديد</h2>

          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1.5">اسم الباكيدج *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: روتين النضارة الكامل"
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
            <label className="text-gray-400 text-xs font-semibold block mb-1.5">الوصف</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="اوصفي محتويات الباكيدج..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-all placeholder-gray-600 resize-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold block mb-1.5">صورة الباكيدج</label>
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

          {error && (
            <p className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={addBundle}
            disabled={saving || !name.trim() || !price}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm"
          >
            {saving ? 'جارٍ الإضافة...' : '+ إضافة الباكيدج'}
          </button>
        </div>

        {/* Bundles list */}
        <div>
          <h2 className="text-white font-bold text-base mb-4">
            الباكيدجات الحالية
            {!loading && <span className="text-gray-500 font-normal text-xs mr-2">({bundles.length})</span>}
          </h2>

          {loading ? (
            <p className="text-gray-500 text-sm text-center py-10">جارٍ التحميل...</p>
          ) : bundles.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-10">لا توجد باكيدجات بعد</p>
          ) : (
            <div className="space-y-3">
              {bundles.map(b => (
                <div key={b.id} className="bg-gray-900 border border-gray-800 rounded-xl flex items-center gap-3 p-3">
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                    {b.image_url
                      ? <img src={b.image_url} alt={b.name_ar} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">🎁</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug truncate">{b.name_ar}</p>
                    {b.description_ar && (
                      <p className="text-gray-500 text-xs mt-0.5 truncate">{b.description_ar}</p>
                    )}
                    <p className="text-emerald-400 text-sm font-bold mt-0.5">{b.price} ج.م</p>
                  </div>
                  <button
                    onClick={() => deleteBundle(b.id)}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-red-900/30 hover:bg-red-900/60 text-red-400 hover:text-red-300 transition-all text-base"
                    title="حذف"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
