import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const BLANK = { code: '', type: 'percentage', value: '', expiry_date: '', active: true }

export default function DiscountCodesSection() {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(BLANK)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setCodes(data || [])

    // Seed SAYA10 if not exists
    if (data && !data.find(c => c.code === 'SAYA10')) {
      await supabase.from('discount_codes').insert({ code: 'SAYA10', type: 'percentage', value: 10, active: true })
      load()
      return
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.code || !form.value) return
    setSaving(true)
    await supabase.from('discount_codes').insert({
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value: Number(form.value),
      expiry_date: form.expiry_date || null,
      active: form.active,
    })
    setSaving(false)
    setForm(BLANK)
    setShowForm(false)
    load()
  }

  const toggleActive = async (id, active) => {
    await supabase.from('discount_codes').update({ active }).eq('id', id)
    setCodes(prev => prev.map(c => c.id === id ? { ...c, active } : c))
  }

  const deleteCode = async (id) => {
    if (!confirm('حذف كود الخصم؟ | Delete discount code?')) return
    await supabase.from('discount_codes').delete().eq('id', id)
    setCodes(prev => prev.filter(c => c.id !== id))
  }

  const isExpired = (expiry) => expiry && new Date(expiry) < new Date()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-xl font-bold">كودات الخصم | Discount Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          + كود جديد | New Code
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-semibold">إنشاء كود خصم | Create Discount Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs font-semibold block mb-1">الكود | Code *</label>
              <input
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="SAVE20"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500 font-mono uppercase"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-semibold block mb-1">النوع | Type *</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none"
              >
                <option value="percentage">نسبة مئوية | Percentage %</option>
                <option value="fixed">مبلغ ثابت | Fixed Amount ج.م</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-semibold block mb-1">
                القيمة | Value * {form.type === 'percentage' ? '(%)' : '(ج.م)'}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                placeholder={form.type === 'percentage' ? '10' : '50'}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-semibold block mb-1">تاريخ الانتهاء | Expiry (اتركه فارغاً = لا ينتهي)</label>
              <input
                type="date"
                value={form.expiry_date}
                onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={() => setForm(f => ({ ...f, active: !f.active }))}
              className={`w-10 h-6 rounded-full relative cursor-pointer transition-all ${form.active ? 'bg-emerald-600' : 'bg-gray-700'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${form.active ? 'right-1' : 'left-1'}`} />
            </div>
            <span className="text-gray-300 text-sm">فعال | Active</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowForm(false); setForm(BLANK) }} className="px-4 py-2 border border-gray-700 text-gray-400 hover:text-white rounded-lg text-sm transition-all">إلغاء | Cancel</button>
            <button
              onClick={save}
              disabled={saving || !form.code || !form.value}
              className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {saving ? 'جارٍ الحفظ...' : 'حفظ | Save'}
            </button>
          </div>
        </div>
      )}

      {/* Codes list */}
      {loading ? (
        <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr className="text-gray-400 text-xs">
                  <th className="px-4 py-3 text-right">الكود | Code</th>
                  <th className="px-4 py-3 text-right">النوع | Type</th>
                  <th className="px-4 py-3 text-right">القيمة | Value</th>
                  <th className="px-4 py-3 text-right">الانتهاء | Expiry</th>
                  <th className="px-4 py-3 text-right">الحالة | Status</th>
                  <th className="px-4 py-3 text-right">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {codes.map(c => {
                  const expired = isExpired(c.expiry_date)
                  return (
                    <tr key={c.id} className="text-gray-300">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-white bg-gray-700 px-2 py-1 rounded-lg text-sm">{c.code}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {c.type === 'percentage' ? 'نسبة مئوية | Percentage' : 'مبلغ ثابت | Fixed'}
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">
                        {c.type === 'percentage' ? `${c.value}%` : `${c.value} ج.م`}
                      </td>
                      <td className="px-4 py-3">
                        {c.expiry_date ? (
                          <span className={expired ? 'text-red-400' : 'text-gray-400'}>
                            {expired ? '⚠️ ' : ''}{c.expiry_date}
                          </span>
                        ) : (
                          <span className="text-gray-600">لا ينتهي | No expiry</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(c.id, !c.active)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${c.active && !expired ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gray-800 text-gray-500'}`}
                        >
                          {c.active && !expired ? 'فعال | Active' : 'غير فعال | Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {c.code !== 'SAYA10' && (
                          <button
                            onClick={() => deleteCode(c.id)}
                            className="text-xs bg-red-900/30 hover:bg-red-900/60 text-red-400 px-3 py-1 rounded-lg transition-all"
                          >
                            حذف | Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {codes.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600 text-sm">لا توجد كودات | No codes</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
