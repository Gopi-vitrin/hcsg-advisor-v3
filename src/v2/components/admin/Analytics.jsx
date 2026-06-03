import { BookOpen, Zap, TrendingUp, Clock } from 'lucide-react'
import { ANALYTICS, KNOWLEDGE_BASE } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

export default function Analytics() {
  const max = Math.max(...ANALYTICS.topQuestions.map(q => q.count))
  const maxM = Math.max(...ANALYTICS.queriesByMonth)
  const months = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May']

  const insights = [
    { color: '#e65e25', label: 'TRENDING UP', text: 'Motor brake queries rose 34% — Shaw-Box 800 service bulletin may be required. Consider proactive inspection campaign.' },
    { color: '#16a34a', label: 'PERFORMANCE', text: 'First-visit resolution rate at 73% — up 14 points since AI copilot deployment. Callback costs reduced by est. $412k annually.' },
    { color: '#1159af', label: 'USAGE PATTERN', text: 'Top 3 query types (motor brake, wire rope, overload) account for 68% of all AI usage. Prioritise these manuals for updates.' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-800 text-hcsg-orange" style={BC}>›</span>
          <p className="font-700 text-slate-400 text-xs tracking-widest uppercase" style={BC}>KNOWLEDGE BASE USAGE</p>
        </div>
        <h1 className="font-800 text-hcsg-navy" style={{ ...BC, fontSize: 26, letterSpacing: '-0.3px' }}>AI ANALYTICS</h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: Zap,         label: 'TOTAL QUERIES',      value: ANALYTICS.totalQueries,              bg: '#e65e25' },
          { icon: Clock,       label: 'AVG RESPONSE TIME',  value: ANALYTICS.avgResponseTime,           bg: '#1159af' },
          { icon: TrendingUp,  label: 'FIRST-VISIT RATE',   value: ANALYTICS.firstVisitResolutionRate,  bg: '#16a34a' },
          { icon: TrendingUp,  label: 'EST. SAVINGS',       value: ANALYTICS.estimatedAnnualSavings,    bg: '#653a15' },
        ].map(({ icon: Icon, label, value, bg }) => (
          <div key={label} className="bg-white p-5" style={{ borderRadius: 6, border: '1px solid #E0D7CE', borderTop: `3px solid ${bg}` }}>
            <Icon size={16} style={{ color: bg, marginBottom: 8 }} />
            <p className="font-800" style={{ ...BC, fontSize: 24, color: '#011e41', letterSpacing: '-0.3px' }}>{value}</p>
            <p className="font-700 text-slate-400 text-xs tracking-widest mt-0.5" style={BC}>{label}</p>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-2 mb-6">
        <p className="font-700 text-slate-400 text-xs tracking-widest uppercase mb-2" style={BC}>AI INSIGHTS</p>
        {insights.map((ins, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ border: `1px solid rgba(0,0,0,0.06)`, borderLeft: `4px solid ${ins.color}`, borderRadius: 6, background: 'white' }}>
            <span className="font-800 text-xs tracking-widest px-2 py-0.5 mt-0.5 shrink-0" style={{ ...BC, background: ins.color, color: 'white', borderRadius: 3 }}>{ins.label}</span>
            <p className="text-slate-600 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{ins.text}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Top queries */}
        <div className="bg-white p-5" style={{ borderRadius: 6, border: '1px solid #E0D7CE', borderTop: '3px solid #e65e25' }}>
          <p className="font-800 text-hcsg-navy text-sm mb-5" style={BC}>TOP AI QUERIES THIS MONTH</p>
          <div className="space-y-3">
            {ANALYTICS.topQuestions.map((q, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-xs flex-1 pr-2" style={{ fontFamily: "'Barlow', sans-serif" }}>{q.label}</span>
                  <span className="font-700 text-slate-500 text-xs" style={BC}>{q.count}</span>
                </div>
                <div className="h-1.5 bg-slate-100" style={{ borderRadius: 2 }}>
                  <div className="h-full transition-all" style={{ width: `${(q.count / max) * 100}%`, background: i === 0 ? '#e65e25' : '#1159af60', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly volume */}
        <div className="bg-white p-5" style={{ borderRadius: 6, border: '1px solid #E0D7CE', borderTop: '3px solid #011e41' }}>
          <p className="font-800 text-hcsg-navy text-sm mb-5" style={BC}>QUERY VOLUME — LAST 9 MONTHS</p>
          <div className="flex items-end gap-1.5 h-28 mb-2">
            {ANALYTICS.queriesByMonth.map((v, i) => {
              const isLast = i === ANALYTICS.queriesByMonth.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 relative">
                  {isLast && <span className="absolute text-slate-400 text-xs" style={{ top: -18, fontSize: 9, fontFamily: "'Barlow Condensed', sans-serif" }}>PARTIAL</span>}
                  <div className="w-full flex items-end" style={{ height: 96 }}>
                    <div className="w-full" style={{ height: `${(v / maxM) * 96}px`, background: isLast ? '#e65e25' : '#011e4140', borderRadius: '2px 2px 0 0', borderTop: isLast ? '2px dashed #e65e25' : 'none' }} />
                  </div>
                  <span className="text-slate-400" style={{ ...BC, fontSize: 9 }}>{months[i]}</span>
                </div>
              )
            })}
          </div>
          <p className="text-slate-400 text-xs text-center mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>May is partial (18 days) — steady adoption across field team</p>
        </div>
      </div>

      {/* KB health */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-5" style={{ borderRadius: 6, border: '1px solid #E0D7CE' }}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={15} className="text-hcsg-blue" />
            <p className="font-800 text-hcsg-navy text-sm" style={BC}>MOST ACCESSED MANUAL</p>
          </div>
          <div className="px-4 py-3 mb-4" style={{ background: '#FFF3EC', border: '1px solid #F5C9A0', borderRadius: 4 }}>
            <p className="font-800 text-hcsg-navy" style={{ ...BC, fontSize: 18 }}>{ANALYTICS.mostAccessedManual.toUpperCase()}</p>
            <p className="text-slate-500 text-sm mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>{ANALYTICS.mostAccessedCount} queries this month</p>
          </div>
          <div className="space-y-2">
            {KNOWLEDGE_BASE.documents.map((d, i) => {
              const counts = [142, 98, 44, 61]
              return (
                <div key={i} className="flex items-center gap-3">
                  <p className="text-slate-500 text-xs flex-1 truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>{d.name.split(' Manual')[0]}</p>
                  <div className="w-20 h-1.5 bg-slate-100" style={{ borderRadius: 2 }}><div className="h-full" style={{ width: `${(counts[i] / 142) * 100}%`, background: '#1159af60', borderRadius: 2 }} /></div>
                  <span className="text-slate-400 text-xs w-6 text-right font-700" style={BC}>{counts[i]}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-hcsg-navy p-5" style={{ borderRadius: 6, borderTop: '3px solid #e65e25' }}>
          <p className="font-800 text-white text-sm mb-4 tracking-wide" style={BC}>KNOWLEDGE BASE HEALTH</p>
          <div className="space-y-3">
            {[
              { l: 'DOCUMENTS INDEXED', v: `${KNOWLEDGE_BASE.totalDocuments} ✓`, c: '#4ade80' },
              { l: 'PAGES SEARCHABLE',  v: `${KNOWLEDGE_BASE.totalPages} ✓`,   c: '#4ade80' },
              { l: 'COVERAGE GAPS',     v: `${KNOWLEDGE_BASE.coverageGaps.length} GAPS`, c: '#f5a524' },
              { l: 'LAST INDEXED',      v: KNOWLEDGE_BASE.lastUpdated,          c: 'rgba(255,255,255,0.4)' },
            ].map(r => (
              <div key={r.l} className="flex items-center justify-between">
                <span className="font-700 text-white/30 text-xs tracking-widest" style={BC}>{r.l}</span>
                <span className="font-700 text-xs" style={{ ...BC, color: r.c }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="font-700 text-white/20 text-xs tracking-wider uppercase mb-1.5" style={BC}>EQUIPMENT COVERAGE</p>
            <div className="h-1.5 bg-white/10" style={{ borderRadius: 2 }}><div className="h-full bg-hcsg-orange" style={{ width: '57%', borderRadius: 2 }} /></div>
            <p className="text-white/25 text-xs mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>4 of 7 equipment types covered</p>
          </div>
        </div>
      </div>
    </div>
  )
}
