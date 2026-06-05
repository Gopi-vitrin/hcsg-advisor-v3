import { Users, ChevronRight } from 'lucide-react'
import { TECHNICIANS } from '../../data'

const RECENCY_STYLES = {
  now: { badge: 'bg-hcsg-orange/15 text-hcsg-orange', dot: 'bg-hcsg-orange animate-pulse' },
  '2h': { badge: 'bg-amber-100 text-amber-700', dot: 'bg-hcsg-amber' },
  '1h': { badge: 'bg-green-100 text-hcsg-green', dot: 'bg-hcsg-green' },
  '1d': { badge: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' },
  '2d': { badge: 'bg-gray-100 text-gray-400', dot: 'bg-gray-300' },
  '5d': { badge: 'bg-gray-50 text-gray-400', dot: 'bg-gray-200' },
}

export default function TechnicianList({ onSelect }) {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-hcsg-navy">Technicians</h1>
        <p className="text-sm text-hcsg-muted mt-1">Gulf Coast Region · {TECHNICIANS.length} technicians</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-hcsg-light-gray overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_2fr_3fr_1fr_32px] gap-4 px-5 py-3 border-b border-hcsg-light-gray bg-hcsg-surface">
          <span className="text-xs font-semibold text-hcsg-muted uppercase tracking-wide">Technician</span>
          <span className="text-xs font-semibold text-hcsg-muted uppercase tracking-wide">Equipment</span>
          <span className="text-xs font-semibold text-hcsg-muted uppercase tracking-wide">Last query</span>
          <span className="text-xs font-semibold text-hcsg-muted uppercase tracking-wide">Activity</span>
          <span />
        </div>

        {/* Rows */}
        {TECHNICIANS.map((tech, i) => {
          const style = RECENCY_STYLES[tech.recency] || RECENCY_STYLES['5d']
          return (
            <button
              key={tech.id}
              onClick={() => onSelect(tech)}
              className={`w-full grid grid-cols-[2fr_2fr_3fr_1fr_32px] gap-4 px-5 py-3.5 text-left hover:bg-hcsg-surface/60 transition-colors ${i < TECHNICIANS.length - 1 ? 'border-b border-hcsg-light-gray/60' : ''}`}
            >
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-hcsg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {tech.avatar}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-hcsg-navy text-sm truncate">{tech.name}</div>
                  <div className="text-xs text-hcsg-muted truncate">{tech.role}</div>
                </div>
              </div>

              {/* Equipment */}
              <div className="flex items-center min-w-0">
                <div className="text-sm text-hcsg-navy truncate">{tech.equipmentShort}</div>
              </div>

              {/* Last query */}
              <div className="flex items-center min-w-0">
                <span className="text-sm text-hcsg-muted italic truncate">"{tech.lastQuery}"</span>
              </div>

              {/* Recency badge */}
              <div className="flex items-center">
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${style.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                  {tech.recencyLabel}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-end">
                <ChevronRight size={15} className="text-hcsg-muted/40" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
