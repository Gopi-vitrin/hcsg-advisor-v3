import { MessageSquare, TrendingUp, Activity, CheckCircle, Clock } from 'lucide-react'
import { LIVE_QUERIES, TOP_QUERIES, TECHNICIANS } from '../../data'

const STATUS_STYLES = {
  active: { label: 'Active', dot: 'bg-hcsg-orange', text: 'text-hcsg-orange' },
  idle: { label: 'Idle', dot: 'bg-hcsg-amber', text: 'text-hcsg-amber' },
  resolved: { label: 'Resolved', dot: 'bg-hcsg-green', text: 'text-hcsg-green' },
}

export default function Dashboard({ onViewTech }) {
  return (
    <div className="p-8 h-full flex flex-col">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hcsg-navy">Dashboard</h1>
        <p className="text-sm text-hcsg-muted mt-1">Live field activity — Gulf Coast Region</p>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6 flex-1">
        {/* Live queries */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-hcsg-orange" />
            <h2 className="font-bold text-hcsg-navy text-base">Live today</h2>
            <span className="text-xs text-hcsg-muted ml-1">· {LIVE_QUERIES.length} sessions</span>
          </div>

          <div className="space-y-3">
            {LIVE_QUERIES.map(q => {
              const style = STATUS_STYLES[q.status] || STATUS_STYLES.idle
              const tech = TECHNICIANS.find(t => t.id === q.techId)
              return (
                <div
                  key={q.id}
                  onClick={() => tech && onViewTech(tech)}
                  className={`bg-white rounded-2xl px-5 py-4 shadow-sm border border-hcsg-light-gray ${tech ? 'cursor-pointer hover:border-hcsg-orange/40 hover:shadow-md' : ''} transition-all`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-hcsg-navy flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {q.techAvatar}
                      </div>
                      <div>
                        <div className="font-semibold text-hcsg-navy text-sm">{q.techName}</div>
                        <div className="text-xs text-hcsg-muted">{q.equipment}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`flex items-center gap-1.5 justify-end text-xs font-semibold ${style.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${q.status === 'active' ? 'animate-pulse' : ''}`} />
                        {style.label}
                      </div>
                      <div className="text-xs text-hcsg-muted mt-0.5">{q.time}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-hcsg-muted leading-snug pl-13">
                    <span className="italic">"{q.query}"</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 pl-0">
                    <MessageSquare size={11} className="text-hcsg-muted/60" />
                    <span className="text-xs text-hcsg-muted/60">{q.turns} messages</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Top queries */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-hcsg-orange" />
            <h2 className="font-bold text-hcsg-navy text-base">Top queries</h2>
            <span className="text-xs text-hcsg-muted ml-1">· this week</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-hcsg-light-gray overflow-hidden">
            {TOP_QUERIES.map((q, i) => (
              <div
                key={q.rank}
                className={`flex items-start gap-3 px-4 py-3.5 ${i < TOP_QUERIES.length - 1 ? 'border-b border-hcsg-light-gray/60' : ''}`}
              >
                <span className="text-sm font-black text-hcsg-muted/40 w-4 shrink-0 mt-0.5">{q.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-hcsg-navy leading-snug">{q.query}</div>
                  <div className="text-xs text-hcsg-muted mt-0.5">{q.equipment}</div>
                </div>
                <span className="text-sm font-bold text-hcsg-muted shrink-0 mt-0.5">{q.count}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
