import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, MapPin, Clock, User } from 'lucide-react'
import { WORK_ORDERS, TECHNICIAN } from '../../data'

const STATUS_STYLES = {
  'In Progress': 'bg-hcsg-orange/10 text-hcsg-orange border-hcsg-orange/20',
  Scheduled:     'bg-slate-100 text-slate-500 border-slate-200',
}
const PRIORITY_STYLES = {
  High:   'bg-red-100 text-red-600',
  Medium: 'bg-amber-100 text-amber-700',
}
const SEVERITY_STYLES = {
  HIGH:   'bg-red-50 text-red-600 border-red-100',
  MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100',
  LOW:    'bg-slate-50 text-slate-400 border-slate-200',
}

export default function WorkOrderMonitoring() {
  const [expanded, setExpanded] = useState('WO-2847')
  const wos = Object.values(WORK_ORDERS)

  return (
    <div className="p-8 max-w-5xl">

      <div className="mb-6">
        <h1 className="text-hcsg-navy text-2xl font-bold">Work Order Monitoring</h1>
        <p className="text-slate-400 text-sm mt-1">Live AI status across all active work orders · Gulf Coast Region</p>
      </div>

      {/* Tech status strip */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-hcsg-orange flex items-center justify-center text-white font-bold text-sm shrink-0">
          {TECHNICIAN.avatar}
        </div>
        <div>
          <p className="text-slate-700 text-sm font-semibold">{TECHNICIAN.name}</p>
          <p className="text-slate-400 text-xs">{TECHNICIAN.role} · {TECHNICIAN.branch}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-600 text-xs font-semibold">Active — WO-2847 In Progress</span>
        </div>
      </div>

      {/* WO table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-hcsg-navy font-semibold text-sm">All Work Orders — Today</h2>
        </div>

        <div className="divide-y divide-slate-50">
          {wos.map(wo => (
            <div key={wo.id}>
              {/* Row */}
              <button
                onClick={() => setExpanded(e => e === wo.id ? null : wo.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
              >
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[wo.priority]}`}>
                  {wo.priority.toUpperCase()}
                </span>
                <span className="font-mono text-slate-500 text-sm w-20 shrink-0">{wo.id}</span>
                <span className="text-slate-700 text-sm font-semibold flex-1">{wo.customer}</span>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin size={11} />{wo.site}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs">
                  <Clock size={11} />{wo.scheduledDate}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[wo.status]}`}>
                  {wo.status}
                </span>
                <span className="flex items-center gap-1 text-green-600 text-xs font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  <Zap size={10} fill="currentColor" /> AI Ready
                </span>
                <span className="text-slate-300">
                  {expanded === wo.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
              </button>

              {/* Expanded predictions */}
              {expanded === wo.id && (
                <div className="px-5 pb-5 bg-slate-50 border-t border-slate-100">
                  <p className="text-slate-400 text-xs uppercase tracking-widest py-3">AI Predictions surfaced</p>
                  <div className="space-y-2">
                    {wo.predictions.map(p => (
                      <div key={p.rank} className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-4">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${p.rank === 1 ? 'bg-hcsg-orange text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {p.rank}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 text-sm font-medium truncate">{p.fault}</p>
                          <p className="text-slate-400 text-xs mt-0.5 truncate">{p.source.split(',')[0]}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${SEVERITY_STYLES[p.severity]}`}>
                          {p.severity}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${p.confidence >= 75 ? 'bg-green-500' : p.confidence >= 50 ? 'bg-hcsg-amber' : 'bg-slate-300'}`}
                              style={{ width: `${p.confidence}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold w-8 ${p.confidence >= 75 ? 'text-green-600' : p.confidence >= 50 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {p.confidence}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
