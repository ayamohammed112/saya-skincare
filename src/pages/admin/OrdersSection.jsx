import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'rejected']
const STATUS_LABEL = {
  pending: 'معلق | Pending',
  confirmed: 'مؤكد | Confirmed',
  shipped: 'تم الشحن | Shipped',
  delivered: 'مُسلَّم | Delivered',
  rejected: 'مرفوض | Rejected',
}
const STATUS_COLOR = {
  pending: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  confirmed: 'bg-blue-900/40 text-blue-300 border-blue-700',
  shipped: 'bg-purple-900/40 text-purple-300 border-purple-700',
  delivered: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
  rejected: 'bg-red-900/40 text-red-300 border-red-700',
}

function exportCSV(orders) {
  const headers = ['الاسم', 'الهاتف', 'العنوان', 'المحافظة', 'المنتجات', 'الإجمالي', 'الحالة', 'التاريخ']
  const rows = orders.map(o => [
    o.customer_name || '',
    o.customer_phone || '',
    o.customer_address || '',
    o.governorate || '',
    Array.isArray(o.items) ? o.items.map(i => `${i.name} x${i.qty}`).join('; ') : '',
    o.total || '',
    o.status || '',
    o.created_at?.slice(0, 10) || '',
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `saya_orders_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
}

export default function OrdersSection() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([])
  const [savingNote, setSavingNote] = useState(false)
  const [screenshotModal, setScreenshotModal] = useState(null)

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [])

  const loadNotes = async (orderId) => {
    const { data } = await supabase
      .from('order_notes')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
    setNotes(data || [])
  }

  const openOrder = (order) => {
    setSelected(order)
    setNote('')
    loadNotes(order.id)
  }

  const changeStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }))
  }

  const addNote = async () => {
    if (!note.trim() || !selected) return
    setSavingNote(true)
    await supabase.from('order_notes').insert({ order_id: selected.id, note: note.trim() })
    setNote('')
    await loadNotes(selected.id)
    setSavingNote(false)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-white text-xl font-bold">الطلبات | Orders</h1>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="all">كل الطلبات | All</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <button
            onClick={() => exportCSV(filtered)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            📥 تصدير CSV | Export
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr className="text-gray-400 text-xs">
                  <th className="px-4 py-3 text-right">العميل | Customer</th>
                  <th className="px-4 py-3 text-right">الهاتف | Phone</th>
                  <th className="px-4 py-3 text-right">الإجمالي | Total</th>
                  <th className="px-4 py-3 text-right">الحالة | Status</th>
                  <th className="px-4 py-3 text-right">التاريخ | Date</th>
                  <th className="px-4 py-3 text-right">إجراء | Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map(o => (
                  <tr key={o.id} className="text-gray-300 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{o.customer_name}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{o.customer_phone}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">{o.total} ج.م</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${STATUS_COLOR[o.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {STATUS_LABEL[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{o.created_at?.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openOrder(o)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                      >
                        عرض | View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600 text-sm">لا توجد طلبات | No orders</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl mt-8 mb-8">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="text-white font-bold">تفاصيل الطلب | Order Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            <div className="p-5 space-y-5">
              {/* Customer info */}
              <div className="bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">بيانات العميل | Customer Info</h4>
                <p><span className="text-gray-500">الاسم:</span> <span className="text-white">{selected.customer_name}</span></p>
                <p><span className="text-gray-500">الهاتف:</span> <span className="text-white font-mono">{selected.customer_phone}</span></p>
                <p><span className="text-gray-500">البريد:</span> <span className="text-white">{selected.customer_email || '—'}</span></p>
                <p><span className="text-gray-500">العنوان:</span> <span className="text-white">{selected.customer_address}</span></p>
                <p><span className="text-gray-500">المحافظة:</span> <span className="text-white">{selected.governorate}</span></p>
                <p><span className="text-gray-500">الدفع:</span> <span className="text-white">{selected.payment_method}</span></p>
              </div>

              {/* Items */}
              <div className="bg-gray-800 rounded-xl p-4 text-sm">
                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">المنتجات | Items</h4>
                {Array.isArray(selected.items) ? (
                  <div className="space-y-2">
                    {selected.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-gray-300">
                        <span>{item.name} <span className="text-gray-500">×{item.qty}</span></span>
                        <span className="text-emerald-400">{item.price * item.qty} ج.م</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-white">
                      <span>الإجمالي | Total</span>
                      <span className="text-emerald-400">{selected.total} ج.م</span>
                    </div>
                  </div>
                ) : <p className="text-gray-500">—</p>}
              </div>

              {/* Payment screenshot */}
              {selected.payment_screenshot_url && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">إيصال الدفع | Payment Receipt</h4>
                  <img
                    src={selected.payment_screenshot_url}
                    alt="Payment"
                    className="max-h-48 rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-gray-700"
                    onClick={() => setScreenshotModal(selected.payment_screenshot_url)}
                  />
                  <p className="text-gray-500 text-xs mt-1">اضغط للتكبير | Click to enlarge</p>
                </div>
              )}

              {/* Confirm / Reject */}
              <div className="flex gap-3">
                <button
                  onClick={() => changeStatus(selected.id, 'confirmed')}
                  disabled={selected.status === 'confirmed' || selected.status === 'delivered'}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  ✅ تأكيد الطلب | Confirm Order
                </button>
                <button
                  onClick={() => changeStatus(selected.id, 'rejected')}
                  disabled={selected.status === 'rejected'}
                  className="flex-1 bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  ❌ رفض الطلب | Reject Order
                </button>
              </div>

              {/* Status change */}
              <div>
                <label className="text-gray-400 text-xs font-semibold block mb-2">تغيير الحالة | Change Status</label>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => changeStatus(selected.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selected.status === s ? STATUS_COLOR[s] : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
                    >
                      {STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin notes */}
              <div className="bg-gray-800 rounded-xl p-4">
                <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">ملاحظات الإدارة | Admin Notes</h4>
                <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                  {notes.map(n => (
                    <div key={n.id} className="bg-gray-700/50 rounded-lg px-3 py-2 text-sm">
                      <p className="text-gray-200">{n.note}</p>
                      <p className="text-gray-600 text-xs mt-1">{n.created_at?.slice(0, 16)}</p>
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-gray-600 text-sm">لا توجد ملاحظات | No notes</p>}
                </div>
                <div className="flex gap-2">
                  <input
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addNote()}
                    placeholder="أضف ملاحظة... | Add note..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={addNote}
                    disabled={savingNote || !note.trim()}
                    className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot full-screen modal */}
      {screenshotModal && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setScreenshotModal(null)}>
          <img src={screenshotModal} alt="Payment" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </div>
  )
}
