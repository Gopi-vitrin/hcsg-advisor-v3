import { ArrowLeft, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { PAST_SESSIONS, LOGGED_IN_TECH } from '../../data'

const STATUS_STYLES = {
  resolved: { label: 'Resolved', icon: CheckCircle, color: 'text-hcsg-green' },
  active: { label: 'Active', icon: Clock, color: 'text-hcsg-orange' },
}

export default function MyWork({ onBack }) {
  return (
    <div className="bg-hcsg-page rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col" style={{ minHeight: '86vh' }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-hcsg-navy rounded-b-2xl z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-12 pb-5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-hcsg-light-gray flex items-center justify-center shadow-sm shrink-0"
        >
          <ArrowLeft size={16} className="text-hcsg-muted" />
        </button>
        <div>
          <div className="text-[10px] text-hcsg-muted tracking-[0.2em]">TECHNICIAN</div>
          <div className="font-black text-hcsg-navy text-lg">My Work</div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 px-6 space-y-3 pb-8">
        {PAST_SESSIONS.map(s => {
          const status = STATUS_STYLES[s.status] || STATUS_STYLES.resolved
          const StatusIcon = status.icon
          return (
            <div key={s.id} className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-hcsg-light-gray">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-hcsg-navy text-sm">{s.equipment}</div>
                  <div className="text-xs text-hcsg-muted mt-0.5 leading-snug">{s.query}</div>
                </div>
                <span className="text-xs text-hcsg-muted shrink-0 mt-0.5">{s.date}</span>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-hcsg-light-gray/60">
                <div className={`flex items-center gap-1 text-xs font-medium ${status.color}`}>
                  <StatusIcon size={12} />
                  {status.label}
                </div>
                <div className="flex items-center gap-1 text-xs text-hcsg-muted">
                  <MessageSquare size={11} />
                  {s.turns} messages
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
