import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = 'Aya321'
const AUTH_KEY = 'saya_admin_auth'
const CATEGORIES = ['العناية بالبشرة', 'العطور', 'منتجات الشعر']
const PINK = '#E8006F'

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

// NOTE: Requires 'product-images' bucket in Supabase Storage (public, no RLS on uploads from admin)
async function uploadToSupabase(file) {
  const blob = await compressImage(file)
  const filename = `${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('product-images').upload(filename, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
  return data.publicUrl
}

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState(false)
  const location = useLocation()
  const isBundles = location.pathname === '/admin/bundles'

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
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', direction: 'rtl' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111', margin: '0 0 0.25rem' }}>Saya Admin</h1>
            <p style={{ color: '#888', fontSize: '0.875rem', margin: 0 }}>لوحة التحكم</p>
          </div>
          <div style={{ background: '#F8F8F8', borderRadius: 16, padding: '2rem', border: '1px solid #eee' }}>
            <label style={{ display: 'block', color: '#555', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              كلمة المرور
            </label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              autoFocus
              style={{ ...inputStyle, border: `1.5px solid ${pwError ? '#ef4444' : '#e5e7eb'}` }}
            />
            {pwError && (
              <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.375rem 0 0' }}>
                كلمة المرور غير صحيحة
              </p>
            )}
            <button onClick={handleLogin} style={{ ...primaryBtnStyle(false), marginTop: '1rem' }}>
              دخول
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Top Nav */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0.875rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🌿</span>
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111' }}>Saya Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <a
            href="/admin"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.4rem 0.875rem',
              borderRadius: 8,
              textDecoration: 'none',
              background: !isBundles ? PINK : 'transparent',
              color: !isBundles ? '#fff' : '#666',
              transition: 'all 0.2s',
            }}
          >
            المنتجات
          </a>
          <a
            href="/admin/bundles"
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.4rem 0.875rem',
              borderRadius: 8,
              textDecoration: 'none',
              background: isBundles ? PINK : 'transparent',
              color: isBundles ? '#fff' : '#666',
              transition: 'all 0.2s',
            }}
          >
            الباكيدجات
          </a>
          <button
            onClick={handleLogout}
            style={{ fontSize: '0.75rem', color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem 0.5rem' }}
          >
            خروج
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
        {isBundles ? <BundlesAdmin /> : <ProductsAdmin />}
      </div>
    </div>
  )
}

// ─── PRODUCTS ADMIN ───────────────────────────────────────────

function ProductsAdmin() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

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
    if (!name.trim() || !price) { setMsg({ type: 'error', text: 'اسم المنتج والسعر مطلوبان' }); return }
    setMsg(null)
    setSaving(true)
    let image_url = ''
    if (imageFile) {
      try { image_url = await uploadToSupabase(imageFile) }
      catch (err) {
        console.error('[Upload error - products]', err)
        setMsg({ type: 'error', text: 'فشل رفع الصورة: ' + err.message })
        setSaving(false)
        return
      }
    }
    const { error } = await supabase.from('products').insert({
      name: name.trim(),
      price: Number(price),
      category,
      image_url,
    })
    if (error) { setMsg({ type: 'error', text: 'فشل الحفظ: ' + error.message }); setSaving(false); return }
    setMsg({ type: 'success', text: 'تمت إضافة المنتج بنجاح ✓' })
    setName(''); setPrice(''); setCategory(CATEGORIES[0]); setImageFile(null)
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

  const grouped = CATEGORIES.map(cat => ({ cat, items: products.filter(p => p.category === cat) }))
  const uncategorized = products.filter(p => !CATEGORIES.includes(p.category))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FormCard title="إضافة منتج جديد">
        <Field label="اسم المنتج *">
          <TextInput value={name} onChange={setName} placeholder="مثال: سيروم فيتامين سي" />
        </Field>
        <Field label="السعر (ج.م) *">
          <NumberInput value={price} onChange={setPrice} />
        </Field>
        <Field label="الفئة">
          <SelectInput value={category} onChange={setCategory} options={CATEGORIES} />
        </Field>
        <Field label="صورة المنتج">
          <ImagePicker preview={imagePreview} onChange={handleImageChange} />
        </Field>
        {msg && <StatusMsg msg={msg} />}
        <button onClick={addProduct} disabled={saving || !name.trim() || !price} style={primaryBtnStyle(saving || !name.trim() || !price)}>
          {saving ? 'جارٍ الإضافة...' : '+ إضافة المنتج'}
        </button>
      </FormCard>

      <section>
        <SectionTitle count={!loading ? products.length : null}>المنتجات الحالية</SectionTitle>
        {loading ? (
          <p style={emptyStyle}>جارٍ التحميل...</p>
        ) : products.length === 0 ? (
          <p style={emptyStyle}>لا توجد منتجات بعد</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {grouped.map(({ cat, items }) => items.length === 0 ? null : (
              <div key={cat}>
                <p style={catLabel}>{cat} ({items.length})</p>
                <div style={listStack}>
                  {items.map(p => (
                    <ItemCard key={p.id} image={p.image_url} title={p.name || p.name_ar} sub={p.category} price={p.price} onDelete={() => deleteProduct(p.id)} />
                  ))}
                </div>
              </div>
            ))}
            {uncategorized.length > 0 && (
              <div>
                <p style={{ ...catLabel, color: '#999' }}>أخرى ({uncategorized.length})</p>
                <div style={listStack}>
                  {uncategorized.map(p => (
                    <ItemCard key={p.id} image={p.image_url} title={p.name || p.name_ar} sub="—" price={p.price} onDelete={() => deleteProduct(p.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

// ─── BUNDLES ADMIN ────────────────────────────────────────────

function BundlesAdmin() {
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState(null)

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
    if (!name.trim() || !price) { setMsg({ type: 'error', text: 'الاسم والسعر مطلوبان' }); return }
    setMsg(null)
    setSaving(true)
    let image_url = ''
    if (imageFile) {
      try { image_url = await uploadToSupabase(imageFile) }
      catch (err) {
        console.error('[Upload error - bundles]', err)
        setMsg({ type: 'error', text: 'فشل رفع الصورة: ' + err.message })
        setSaving(false)
        return
      }
    }
    const { error } = await supabase.from('bundles').insert({
      name_ar: name.trim(),
      price: Number(price),
      description_ar: description.trim(),
      image_url,
    })
    if (error) { setMsg({ type: 'error', text: 'فشل الحفظ: ' + error.message }); setSaving(false); return }
    setMsg({ type: 'success', text: 'تمت إضافة الباكيدج بنجاح ✓' })
    setName(''); setPrice(''); setDescription(''); setImageFile(null)
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <FormCard title="إضافة باكيدج جديد">
        <Field label="اسم الباكيدج *">
          <TextInput value={name} onChange={setName} placeholder="مثال: روتين النضارة الكامل" />
        </Field>
        <Field label="السعر (ج.م) *">
          <NumberInput value={price} onChange={setPrice} />
        </Field>
        <Field label="الوصف">
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="اوصفي محتويات الباكيدج..."
            rows={3}
            style={{ ...inputStyle, resize: 'none' }}
          />
        </Field>
        <Field label="صورة الباكيدج">
          <ImagePicker preview={imagePreview} onChange={handleImageChange} />
        </Field>
        {msg && <StatusMsg msg={msg} />}
        <button onClick={addBundle} disabled={saving || !name.trim() || !price} style={primaryBtnStyle(saving || !name.trim() || !price)}>
          {saving ? 'جارٍ الإضافة...' : '+ إضافة الباكيدج'}
        </button>
      </FormCard>

      <section>
        <SectionTitle count={!loading ? bundles.length : null}>الباكيدجات الحالية</SectionTitle>
        {loading ? (
          <p style={emptyStyle}>جارٍ التحميل...</p>
        ) : bundles.length === 0 ? (
          <p style={emptyStyle}>لا توجد باكيدجات بعد</p>
        ) : (
          <div style={listStack}>
            {bundles.map(b => (
              <ItemCard key={b.id} image={b.image_url} title={b.name_ar} sub={b.description_ar} price={b.price} onDelete={() => deleteBundle(b.id)} emoji="🎁" />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// ─── SHARED COMPONENTS ────────────────────────────────────────

function FormCard({ title, children }) {
  return (
    <section style={{ background: '#F8F8F8', borderRadius: 16, padding: '1.25rem', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111', margin: 0 }}>{title}</h2>
      {children}
    </section>
  )
}

function SectionTitle({ children, count }) {
  return (
    <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111', marginBottom: '0.875rem' }}>
      {children}
      {count != null && <span style={{ color: '#bbb', fontWeight: 400, fontSize: '0.8rem', marginRight: '0.375rem' }}>({count})</span>}
    </h2>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#555', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.375rem' }}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
  )
}

function NumberInput({ value, onChange }) {
  return (
    <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder="0" min="0" style={inputStyle} />
  )
}

function SelectInput({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={inputStyle}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function ImagePicker({ preview, onChange }) {
  return (
    <label style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      width: '100%', height: 120, border: '2px dashed #e0e0e0', borderRadius: 10,
      cursor: 'pointer', background: '#fff', overflow: 'hidden', position: 'relative',
    }}>
      {preview
        ? <img src={preview} alt="معاينة" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', color: '#bbb' }}>
            <span style={{ fontSize: '1.75rem' }}>📷</span>
            <span style={{ fontSize: '0.75rem' }}>اضغطي لاختيار صورة</span>
          </div>
        )
      }
      <input type="file" accept="image/*" onChange={onChange} style={{ display: 'none' }} />
    </label>
  )
}

function StatusMsg({ msg }) {
  return (
    <p style={{
      padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.8rem', margin: '0.25rem 0 0',
      background: msg.type === 'success' ? '#f0fdf4' : '#fff1f2',
      color: msg.type === 'success' ? '#16a34a' : '#dc2626',
      border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
    }}>
      {msg.text}
    </p>
  )
}

function ItemCard({ image, title, sub, price, onDelete, emoji = '🧴' }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12,
      display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
    }}>
      <div style={{
        width: 60, height: 60, flexShrink: 0, borderRadius: 10, overflow: 'hidden',
        background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
      }}>
        {image ? <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</p>
        {sub && <p style={{ fontSize: '0.75rem', color: '#aaa', margin: '0.125rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</p>}
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: PINK, margin: '0.125rem 0 0' }}>{price} ج.م</p>
      </div>
      <button
        onClick={onDelete}
        style={{
          flexShrink: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, background: '#fff0f0', border: '1px solid #fecaca',
          color: '#dc2626', fontSize: '1rem', cursor: 'pointer',
        }}
        title="حذف"
      >
        🗑
      </button>
    </div>
  )
}

// ─── STYLE CONSTANTS ──────────────────────────────────────────

const inputStyle = {
  width: '100%', background: '#fff', border: '1.5px solid #e5e7eb',
  borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.875rem',
  color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const emptyStyle = {
  textAlign: 'center', color: '#ccc', fontSize: '0.875rem', padding: '2.5rem 0', margin: 0,
}

const catLabel = {
  fontSize: '0.75rem', fontWeight: 700, color: PINK, margin: '0 0 0.5rem',
}

const listStack = {
  display: 'flex', flexDirection: 'column', gap: '0.5rem',
}

function primaryBtnStyle(disabled) {
  return {
    width: '100%', background: disabled ? '#f0f0f0' : PINK,
    color: disabled ? '#bbb' : '#fff', border: 'none', borderRadius: 10,
    padding: '0.875rem', fontSize: '0.875rem', fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
  }
}
