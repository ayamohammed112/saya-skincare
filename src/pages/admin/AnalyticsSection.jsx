import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

function BarChart({ data, maxVal, color = '#10b981', labelKey = 'label', valueKey = 'value', unit = '' }) {
  if (!data.length) return <p className="text-gray-600 text-sm">لا توجد بيانات | No data</p>
  const max = maxVal || Math.max(...data.map(d => d[valueKey])) || 1
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <div className="w-28 text-gray-400 text-xs text-right truncate flex-shrink-0">{d[labelKey]}</div>
          <div className="flex-1 bg-gray-800 rounded-full h-5 relative overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(2, (d[valueKey] / max) * 100)}%`, backgroundColor: color }}
            />
          </div>
          <div className="w-16 text-right text-gray-300 text-xs font-mono flex-shrink-0">{d[valueKey]}{unit}</div>
        </div>
      ))}
    </div>
  )
}

function LineChart({ points, color = '#10b981' }) {
  if (points.length < 2) return <p className="text-gray-600 text-sm">بيانات غير كافية | Insufficient data</p>
  const W = 600, H = 160, PAD = 20
  const vals = points.map(p => p.value)
  const maxV = Math.max(...vals) || 1
  const minV = 0
  const toX = i => PAD + (i / (points.length - 1)) * (W - PAD * 2)
  const toY = v => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2)
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p.value)}`).join(' ')
  const areaD = `${pathD} L ${toX(points.length - 1)} ${H - PAD} L ${toX(0)} ${H - PAD} Z`
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={toX(i)} cy={toY(p.value)} r="3" fill={color} />
            <text x={toX(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#6b7280">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default function AnalyticsSection() {
  const [period, setPeriod] = useState('week')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('orders')
        .select('id,total,items,governorate,created_at,status')
        .order('created_at', { ascending: true })
      setOrders(data || [])
      setTotalRevenue((data || []).filter(o => o.status !== 'rejected').reduce((s, o) => s + (o.total || 0), 0))
      setLoading(false)
    }
    load()
  }, [])

  const now = new Date()

  const filterByPeriod = (orders, p) => {
    const ms = p === 'day' ? 86400000 : p === 'week' ? 7 * 86400000 : 30 * 86400000
    const cutoff = new Date(now - ms)
    return orders.filter(o => new Date(o.created_at) >= cutoff && o.status !== 'rejected')
  }

  const revenuePoints = () => {
    const filtered = filterByPeriod(orders, period)
    const map = {}
    filtered.forEach(o => {
      const d = o.created_at?.slice(0, 10)
      if (d) map[d] = (map[d] || 0) + (o.total || 0)
    })
    const sorted = Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
    return sorted.map(([date, value]) => ({
      label: period === 'day' ? date.slice(8) : date.slice(5),
      value: Math.round(value),
    }))
  }

  const topProducts = () => {
    const qtyMap = {}
    const nameMap = {}
    orders.filter(o => o.status !== 'rejected').forEach(o => {
      if (Array.isArray(o.items)) {
        o.items.forEach(item => {
          qtyMap[item.id] = (qtyMap[item.id] || 0) + (item.qty || 1)
          nameMap[item.id] = item.name || item.nameEn || item.id
        })
      }
    })
    return Object.entries(qtyMap)
      .map(([id, qty]) => ({ label: nameMap[id], value: qty }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  const topGovernorates = () => {
    const map = {}
    orders.filter(o => o.status !== 'rejected').forEach(o => {
      if (o.governorate) map[o.governorate] = (map[o.governorate] || 0) + 1
    })
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }

  const periodRevenue = filterByPeriod(orders, period).reduce((s, o) => s + (o.total || 0), 0)

  if (loading) return <p className="text-gray-500 text-sm">جارٍ التحميل...</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-white text-xl font-bold">التحليلات | Analytics</h1>
        <div className="flex bg-gray-800 border border-gray-700 rounded-xl p-1 gap-1">
          {[
            { v: 'day', ar: 'اليوم', en: 'Day' },
            { v: 'week', ar: 'أسبوع', en: 'Week' },
            { v: 'month', ar: 'شهر', en: 'Month' },
          ].map(p => (
            <button
              key={p.v}
              onClick={() => setPeriod(p.v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p.v ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {p.ar} | {p.en}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-xs mb-1">إجمالي الإيرادات | Total Revenue</p>
          <p className="text-white text-2xl font-bold">{totalRevenue.toFixed(0)} ج.م</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-xs mb-1">إيرادات {period === 'day' ? 'اليوم' : period === 'week' ? 'الأسبوع' : 'الشهر'}</p>
          <p className="text-emerald-400 text-2xl font-bold">{periodRevenue.toFixed(0)} ج.م</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-500 text-xs mb-1">عدد الطلبات المقبولة | Accepted Orders</p>
          <p className="text-white text-2xl font-bold">{orders.filter(o => o.status !== 'rejected').length}</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4 text-sm">
          مخطط الإيرادات | Revenue Chart — {period === 'day' ? 'اليوم' : period === 'week' ? 'آخر أسبوع' : 'آخر شهر'}
        </h2>
        <LineChart points={revenuePoints()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 text-sm">أكثر 5 منتجات مبيعاً | Top 5 Products</h2>
          <BarChart data={topProducts()} color="#10b981" unit=" قطعة" />
        </div>

        {/* Top governorates */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4 text-sm">أعلى المحافظات | Top Governorates</h2>
          <BarChart data={topGovernorates()} color="#8b5cf6" unit=" طلب" />
        </div>
      </div>
    </div>
  )
}
