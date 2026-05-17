import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function SkinQuizSection() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortDir, setSortDir] = useState('desc')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('skin_quiz_results')
      .select('*')
    setResults(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const sorted = [...results].sort((a, b) =>
    sortDir === 'desc' ? b.count - a.count : a.count - b.count
  )

  const total = results.reduce((s, r) => s + (r.count || 0), 0)

  const SKIN_TYPE_LABELS = {
    'جافة': { en: 'Dry', color: '#f59e0b' },
    'دهنية': { en: 'Oily', color: '#10b981' },
    'مختلطة': { en: 'Combination', color: '#8b5cf6' },
    'حساسة': { en: 'Sensitive', color: '#ef4444' },
    'عادية': { en: 'Normal', color: '#3b82f6' },
    'dry': { en: 'Dry', color: '#f59e0b' },
    'oily': { en: 'Oily', color: '#10b981' },
    'combination': { en: 'Combination', color: '#8b5cf6' },
    'sensitive': { en: 'Sensitive', color: '#ef4444' },
    'normal': { en: 'Normal', color: '#3b82f6' },
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-white text-xl font-bold">نتائج اختبار البشرة | Skin Quiz Results</h1>
        <button
          onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          className="bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-all"
        >
          ترتيب | Sort: {sortDir === 'desc' ? '▼ الأعلى أولاً' : '▲ الأقل أولاً'}
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">جارٍ التحميل...</p>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-gray-400 text-xs mb-1">إجمالي الاختبارات | Total Quizzes Taken</p>
            <p className="text-white text-3xl font-bold">{total}</p>
          </div>

          {/* Visual bars */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-semibold text-sm">توزيع أنواع البشرة | Skin Type Distribution</h2>
            {sorted.map(r => {
              const info = SKIN_TYPE_LABELS[r.skin_type] || { en: r.skin_type, color: '#6b7280' }
              const pct = total > 0 ? Math.round((r.count / total) * 100) : 0
              return (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="w-24 text-right flex-shrink-0">
                    <p className="text-gray-300 text-sm">{r.skin_type}</p>
                    <p className="text-gray-600 text-xs">{info.en}</p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: info.color + '80', border: `1px solid ${info.color}` }}
                    />
                  </div>
                  <div className="w-20 text-right flex-shrink-0">
                    <span className="text-white text-sm font-bold">{r.count}</span>
                    <span className="text-gray-500 text-xs mr-1">({pct}%)</span>
                  </div>
                </div>
              )
            })}
            {sorted.length === 0 && <p className="text-gray-600 text-sm">لا توجد بيانات بعد | No data yet</p>}
          </div>

          {/* Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-800">
                <tr className="text-gray-400 text-xs">
                  <th className="px-4 py-3 text-right">نوع البشرة | Skin Type</th>
                  <th className="px-4 py-3 text-right">بالإنجليزية | English</th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-white" onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}>
                    العدد | Count {sortDir === 'desc' ? '▼' : '▲'}
                  </th>
                  <th className="px-4 py-3 text-right">النسبة | %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {sorted.map(r => {
                  const info = SKIN_TYPE_LABELS[r.skin_type] || { en: r.skin_type, color: '#6b7280' }
                  const pct = total > 0 ? ((r.count / total) * 100).toFixed(1) : '0.0'
                  return (
                    <tr key={r.id} className="text-gray-300">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: info.color }} />
                          <span>{r.skin_type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{info.en}</td>
                      <td className="px-4 py-3 font-bold text-white">{r.count}</td>
                      <td className="px-4 py-3 text-gray-400">{pct}%</td>
                    </tr>
                  )
                })}
                {sorted.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-600">لا توجد نتائج | No results</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
