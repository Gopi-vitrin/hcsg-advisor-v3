import { Zap, BookOpen, Clock, TrendingUp } from 'lucide-react'
import { ANALYTICS, KNOWLEDGE_BASE } from '../../data'

export default function AIAnalytics() {
  const maxCount = Math.max(...ANALYTICS.topQuestions.map(q => q.count))
  const maxMonth = Math.max(...ANALYTICS.queriesByMonth)

  return (
    <div className="p-8 max-w-5xl">

      <div className="mb-6">
        <h1 className="text-hcsg-navy text-2xl font-bold">AI Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Knowledge base usage · Query patterns · Response performance</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total AI Queries',     value: ANALYTICS.totalQueries,            icon: Zap,       color: 'bg-hcsg-orange' },
          { label: 'Avg Response Time',    value: ANALYTICS.avgResponseTime,          icon: Clock,     color: 'bg-hcsg-blue' },
          { label: 'First-Visit Resolution', value: ANALYTICS.firstVisitResolutionRate, icon: TrendingUp, color: 'bg-green-600' },
          { label: 'Est. Annual Savings',  value: ANALYTICS.estimatedAnnualSavings,  icon: TrendingUp, color: 'bg-hcsg-brown' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <Icon size={16} className="text-white" />
              </div>
              <p className="text-hcsg-navy text-2xl font-bold">{s.value}</p>
              <p className="text-slate-500 text-sm mt-0.5">{s.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Top queries bar chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-hcsg-navy font-semibold text-sm mb-5">Top AI Queries This Month</h2>
          <div className="space-y-3">
            {ANALYTICS.topQuestions.map((q, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-xs truncate flex-1 pr-2">{q.label}</span>
                  <span className="text-slate-500 text-xs font-semibold shrink-0">{q.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-hcsg-orange' : 'bg-hcsg-blue/60'}`}
                    style={{ width: `${(q.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly query volume */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-hcsg-navy font-semibold text-sm mb-5">Query Volume — Last 9 Months</h2>
          <div className="flex items-end gap-2 h-32">
            {ANALYTICS.queriesByMonth.map((val, i) => {
              const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
              const isLast = i === ANALYTICS.queriesByMonth.length - 1
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: 96 }}>
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${isLast ? 'bg-hcsg-orange' : 'bg-hcsg-blue/30'}`}
                      style={{ height: `${(val / maxMonth) * 96}px` }}
                    />
                  </div>
                  <span className="text-slate-400 text-xs">{months[i]}</span>
                </div>
              )
            })}
          </div>
          <p className="text-slate-400 text-xs mt-3 text-center">Monthly AI queries — steady adoption across field team</p>
        </div>
      </div>

      {/* Most accessed manual + coverage */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={15} className="text-hcsg-blue" />
            <h2 className="text-hcsg-navy font-semibold text-sm">Most Accessed Manual</h2>
          </div>
          <div className="bg-hcsg-blue/5 border border-hcsg-blue/10 rounded-xl p-4">
            <p className="text-hcsg-navy font-bold text-base">{ANALYTICS.mostAccessedManual}</p>
            <p className="text-slate-500 text-sm mt-1">{ANALYTICS.mostAccessedCount} queries this month</p>
          </div>
          <div className="mt-4 space-y-2">
            {KNOWLEDGE_BASE.documents.map((doc, i) => {
              const queries = [142, 98, 44, 61][i] ?? 0
              return (
                <div key={i} className="flex items-center gap-3">
                  <p className="text-slate-500 text-xs flex-1 truncate">{doc.name.split(' Manual')[0]}</p>
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-hcsg-blue/40 rounded-full" style={{ width: `${(queries / 142) * 100}%` }} />
                  </div>
                  <span className="text-slate-400 text-xs w-6 text-right">{queries}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-hcsg-navy rounded-2xl p-5 shadow-sm">
          <h2 className="text-white font-semibold text-sm mb-4">Knowledge Base Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">Documents indexed</span>
              <span className="text-green-400 text-xs font-semibold">{KNOWLEDGE_BASE.totalDocuments} ✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">Pages searchable</span>
              <span className="text-green-400 text-xs font-semibold">{KNOWLEDGE_BASE.totalPages} ✓</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">Coverage gaps</span>
              <span className="text-hcsg-amber text-xs font-semibold">{KNOWLEDGE_BASE.coverageGaps.length} gaps</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">Last indexed</span>
              <span className="text-white/60 text-xs">{KNOWLEDGE_BASE.lastUpdated}</span>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-white/30 text-xs mb-2">Equipment coverage</p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-hcsg-orange rounded-full" style={{ width: '57%' }} />
            </div>
            <p className="text-white/30 text-xs mt-1.5">4 of 7 equipment types covered</p>
          </div>
        </div>
      </div>
    </div>
  )
}
