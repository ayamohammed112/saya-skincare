import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function CustomersSection() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingPoints, setEditingPoints] = useState(null) // customer id
  const [pointsDelta, setPointsDelta] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    setCustomers(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const adjustPoints = async (customer) => {
    const delta = parseInt(pointsDelta)
    if (isNaN(delta)) return
    setSaving(true)
    const newPoints = Math.max(0, (customer.points || 0) + delta)
    await supabase.from('customers').update({ points: newPoints }).eq('id', customer.id)
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, points: newPoints } : c))
    setEditingPoints(null)
    setPointsDelta('')
    setSaving(false)
  }

  const filtered = customers.filter(c =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-white text-xl font-bold">العملاء | Customers</h1>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو الهاتف... | Search..."
          className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm outline-none w-56"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr className="text-gray-400 text-xs">
                  <th className="px-4 py-3 text-right">الاسم | Name</th>
                  <th className="px-4 py-3 text-right">الهاتف | Phone</th>
                  <th className="px-4 py-3 text-right">البريد | Email</th>
                  <th className="px-4 py-3 text-right">النقاط | Points</th>
                  <th className="px-4 py-3 text-right">التاريخ | Joined</th>
                  <th className="px-4 py-3 text-right">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map(c => (
                  <tr key={c.id} className="text-gray-300">
                    <td className="px-4 py-3 font-medium">{c.name || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.email || '—'}</td>
                    <td className="px-4 py-3">
                      {editingPoints === c.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={pointsDelta}
                            onChange={e => setPointsDelta(e.target.value)}
                            placeholder="±50"
                            className="w-16 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-xs text-white outline-none text-center"
                          />
                          <button
                            onClick={() => adjustPoints(c)}
                            disabled={saving}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-2 py-1 rounded-lg text-xs transition-all disabled:opacity-40"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => { setEditingPoints(null); setPointsDelta('') }}
                            className="text-gray-500 hover:text-white px-1 py-1 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 font-bold">{c.points || 0}</span>
                          <span className="text-gray-600 text-xs">نقطة</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{c.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      {editingPoints !== c.id && (
                        <button
                          onClick={() => { setEditingPoints(c.id); setPointsDelta('') }}
                          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-lg transition-all"
                        >
                          تعديل النقاط | Edit Points
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600 text-sm">لا يوجد عملاء | No customers</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-gray-600 text-xs text-center">
        {filtered.length} عميل من {customers.length} | {filtered.length} of {customers.length} customers
      </div>
    </div>
  )
}
