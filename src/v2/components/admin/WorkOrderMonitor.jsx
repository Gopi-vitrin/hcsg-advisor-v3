import { useState } from 'react'
import { ChevronDown, ChevronUp, Zap, MapPin, Clock } from 'lucide-react'
import { WORK_ORDERS, TECHNICIAN } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

export default function WorkOrderMonitor() {
  const [expanded, setExpanded] = useState('WO-2847')
  const wos = Object.values(WORK_ORDERS)

  const confColor = c => c >= 75 ? '#16a34a' : c >= 50 ? '#d97706' : '#94a3b8'

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-800 text-hcsg-orange" style={BC}>›</span>
          <p className="font-700 text-slate-400 text-xs tracking-widest uppercase" style={BC}>LIVE MONITORING</p>
        </div>
        <h1 className="font-800 text-hcsg-navy" style={{ ...BC, fontSize: 26, letterSpacing: '-0.3px' }}>WORK ORDERS</h1>
      </div>

      {/* Multi-tech summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[{l:'TECHS ACTIVE',v:'14',c:'#011e41'},{l:'AI QUERIES TODAY',v:'31',c:'#e65e25'},{l:'COVERAGE GAPS',v:'3',c:'#d97706'},{l:'ESCALATIONS',v:'1',c:'#dc2626'}].map(s => (
          <div key={s.l} className="bg-white px-4 py-3" style={{ borderRadius: 6, borderTop: `3px solid ${s.c}`, border: '1px solid #e2e8f0', borderTopWidth: 3, borderTopColor: s.c }}>
            <p className="font-800" style={{ ...BC, fontSize: 24, color: s.c }}>{s.v}</p>
            <p className="font-700 text-xs tracking-widest text-slate-400 mt-0.5" style={BC}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Tech strip */}
      <div className="bg-white flex items-center gap-4 px-5 py-4 mb-5" style={{ borderRadius: 6, border: '1px solid #e2e8f0' }}>
        <div className="w-10 h-10 flex items-center justify-center bg-hcsg-orange font-800 text-white text-sm shrink-0" style={{ ...BC, borderRadius: 4 }}>{TECHNICIAN.avatar}</div>
        <div>
          <p className="font-700 text-slate-700 text-sm" style={BC}>{TECHNICIAN.name.toUpperCase()}</p>
          <p className="text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{TECHNICIAN.role} · {TECHNICIAN.branch}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-700 text-green-600 text-xs tracking-widest uppercase" style={BC}>ACTIVE — WO-2847 IN PROGRESS</span>
        </div>
      </div>

      {/* WO table */}
      <div className="bg-white overflow-hidden" style={{ borderRadius: 6, border: '1px solid #e2e8f0', borderTop: '3px solid #e65e25' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f0f2f5' }}>
          <p className="font-800 text-slate-700 text-sm" style={BC}>ALL WORK ORDERS — TODAY</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#f8fafc' }}>
          {wos.map(wo => (
            <div key={wo.id}>
              <button onClick={() => setExpanded(e => e === wo.id ? null : wo.id)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left">
                <span className="text-xs font-700 px-2 py-0.5 shrink-0" style={{ ...BC, borderRadius: 3, background: wo.priority === 'High' ? '#fef2f2' : '#fffbeb', color: wo.priority === 'High' ? '#dc2626' : '#d97706' }}>{wo.priority.toUpperCase()}</span>
                <span className="font-700 text-slate-400 text-xs font-mono w-16 shrink-0" style={BC}>{wo.id}</span>
                <span className="text-slate-700 text-sm font-semibold flex-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.customer}</span>
                <span className="flex items-center gap-1 text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}><MapPin size={10} />{wo.site}</span>
                <span className="flex items-center gap-1 text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}><Clock size={10} />{wo.scheduledDate}</span>
                <span className="text-xs font-700 px-2 py-0.5 shrink-0" style={{ ...BC, borderRadius: 3, background: wo.status === 'In Progress' ? 'rgba(230,94,37,0.1)' : '#f8fafc', color: wo.status === 'In Progress' ? '#e65e25' : '#94a3b8', border: `1px solid ${wo.status === 'In Progress' ? 'rgba(230,94,37,0.2)' : '#e2e8f0'}` }}>{wo.status.toUpperCase()}</span>
                <span className="flex items-center gap-1 text-xs font-700 px-2 py-0.5" style={{ ...BC, borderRadius: 3, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}><Zap size={9} fill="currentColor" />AI</span>
                {expanded === wo.id ? <ChevronUp size={14} className="text-slate-300 shrink-0" /> : <ChevronDown size={14} className="text-slate-300 shrink-0" />}
              </button>
              {expanded === wo.id && (
                <div className="px-5 pb-5 bg-slate-50" style={{ borderTop: '1px solid #f0f2f5' }}>
                  <p className="font-700 text-slate-400 text-xs tracking-widest uppercase py-3" style={BC}>AI PREDICTIONS SURFACED</p>
                  <div className="space-y-2">
                    {wo.predictions.map(p => (
                      <div key={p.rank} className="bg-white flex items-center gap-4 px-4 py-3" style={{ borderRadius: 4, border: '1px solid #f0f2f5' }}>
                        <div className="w-6 h-6 flex items-center justify-center text-xs font-800 shrink-0" style={{ ...BC, borderRadius: 3, background: p.rank === 1 ? '#e65e25' : '#f8fafc', color: p.rank === 1 ? 'white' : '#94a3b8' }}>{p.rank}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 text-sm font-semibold truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>{p.fault}</p>
                          <p className="text-slate-400 text-xs mt-0.5 truncate">{p.source.split(',')[0]}</p>
                        </div>
                        <span className="text-xs font-700 px-2 py-0.5 shrink-0" style={{ ...BC, borderRadius: 3, background: p.severity === 'HIGH' ? '#fef2f2' : p.severity === 'MEDIUM' ? '#fffbeb' : '#f8fafc', color: p.severity === 'HIGH' ? '#dc2626' : p.severity === 'MEDIUM' ? '#d97706' : '#94a3b8', border: `1px solid ${p.severity === 'HIGH' ? '#fecaca' : p.severity === 'MEDIUM' ? '#fde68a' : '#e2e8f0'}` }}>{p.severity}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-16 h-1.5 bg-slate-100" style={{ borderRadius: 2 }}><div className="h-full" style={{ width: `${p.confidence}%`, background: confColor(p.confidence), borderRadius: 2 }} /></div>
                          <span className="font-800 text-sm w-8 text-right" style={{ ...BC, color: confColor(p.confidence) }}>{p.confidence}%</span>
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
