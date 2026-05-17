import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function StatCard({ label, labelEn, value, color, icon }) {
  return (
    <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4`}>
      <div className={`text-3xl p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs mb-1">{label} / {labelEn}</p>
        <p className="text-white text-2xl font-bold">{value ?? '—'}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ todayOrders: 0, revenue: 0, pending: 0, customers: 0 })
  const [products, setProducts] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0]

      const [ordersRes, customersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('id,status,total,created_at'),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id,name,stock_quantity,in_stock'),
      ])

      const orders = ordersRes.data || []
      const todayOrders = orders.filter(o => o.created_at?.startsWith(today))
      const revenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0)
      const pending = orders.filter(o => o.status === 'pending').length

      setStats({
        todayOrders: todayOrders.length,
        revenue,
        pending,
        customers: customersRes.count || 0,
      })

      const prods = productsRes.data || []
      setProducts(prods)

      const alertItems = prods.filter(p => !p.in_stock || (p.stock_quantity !== null && p.stock_quantity <= 3))
      setAlerts(alertItems)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-gray-500 text-sm">جارٍ التحميل... Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-white text-xl font-bold">لوحة التحكم | Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="طلبات اليوم" labelEn="Today's Orders" value={stats.todayOrders} icon="📦" color="bg-blue-900/40" />
        <StatCard label="إيرادات اليوم" labelEn="Today's Revenue" value={`${stats.revenue.toFixed(0)} ج.م`} icon="💰" color="bg-emerald-900/40" />
        <StatCard label="طلبات معلقة" labelEn="Pending" value={stats.pending} icon="⏳" color="bg-yellow-900/40" />
        <StatCard label="العملاء" labelEn="Customers" value={stats.customers} icon="👥" color="bg-purple-900/40" />
      </div>

      {/* Inventory Alerts */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 text-sm">
          تنبيهات المخزون | Inventory Alerts
          {alerts.length > 0 && (
            <span className="mr-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{alerts.length}</span>
          )}
        </h2>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm">✅ كل المخزون في حالة جيدة | All stock is fine</p>
        ) : (
          <div className="space-y-2">
            {alerts.map(p => {
              const outOfStock = !p.in_stock || p.stock_quantity === 0
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm ${outOfStock ? 'bg-red-950/40 border-red-800 text-red-300' : 'bg-yellow-950/40 border-yellow-800 text-yellow-300'}`}
                >
                  <span>{p.name}</span>
                  <span className="font-semibold">
                    {outOfStock
                      ? '🔴 نفذ من المخزون | Out of stock'
                      : `🟡 متبقي ${p.stock_quantity} فقط | Only ${p.stock_quantity} left`}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent orders quick list */}
      <RecentOrders />
    </div>
  )
}

function RecentOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    supabase
      .from('orders')
      .select('id,customer_name,total,status,created_at')
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setOrders(data || []))
  }, [])

  const statusColor = {
    pending: 'text-yellow-400 bg-yellow-900/30',
    confirmed: 'text-blue-400 bg-blue-900/30',
    shipped: 'text-purple-400 bg-purple-900/30',
    delivered: 'text-emerald-400 bg-emerald-900/30',
    rejected: 'text-red-400 bg-red-900/30',
  }
  const statusLabel = {
    pending: 'معلق',
    confirmed: 'مؤكد',
    shipped: 'تم الشحن',
    delivered: 'مُسلَّم',
    rejected: 'مرفوض',
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h2 className="text-white font-semibold mb-4 text-sm">أحدث الطلبات | Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs border-b border-gray-800">
              <th className="pb-2 text-right">العميل</th>
              <th className="pb-2 text-right">الإجمالي</th>
              <th className="pb-2 text-right">الحالة</th>
              <th className="pb-2 text-right">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.map(o => (
              <tr key={o.id} className="text-gray-300">
                <td className="py-2">{o.customer_name || '—'}</td>
                <td className="py-2">{o.total} ج.م</td>
                <td className="py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[o.status] || 'text-gray-400 bg-gray-800'}`}>
                    {statusLabel[o.status] || o.status}
                  </span>
                </td>
                <td className="py-2 text-gray-500 text-xs">{o.created_at?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
