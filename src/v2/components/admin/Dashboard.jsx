import { AlertTriangle, ArrowRight, Zap, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import { KNOWLEDGE_BASE, ANALYTICS, WORK_ORDERS, ADMIN } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

function Stat({ label, value, sub, color = '#011e41', iconBg = '#e65e25' }) {
  return (
    <div className="bg-white p-5" style={{ borderRadius: 6, borderTop: `3px solid ${iconBg}` }}>
      <p className="font-800" style={{ ...BC, fontSize: 28, color, letterSpacing: '-0.5px' }}>{value}</p>
      <p className="font-700 text-slate-600 text-sm mt-0.5" style={BC}>{label.toUpperCase()}</p>
      {sub && <p className="text-slate-400 text-xs mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{sub}</p>}
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'GOOD MORNING' : h < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING'
}

export default function Dashboard({ onNavigate }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()
  const wos = Object.values(WORK_ORDERS)

  const actions = [
    { color: '#b82105', bg: 'rgba(184,33,5,0.06)', border: 'rgba(184,33,5,0.2)', icon: AlertTriangle, iconColor: '#f87171', label: 'COVERAGE GAP', desc: 'Industrial Elevators — no manuals indexed. Technicians have no AI support for elevator faults.', cta: 'ADD DOCUMENTS', screen: 'knowledge' },
    { color: '#f5a524', bg: 'rgba(245,165,36,0.06)', border: 'rgba(245,165,36,0.2)', icon: Zap,           iconColor: '#f5a524', label: 'AI INSIGHT',    desc: 'Motor brake queries up 34% this month — Shaw-Box 800 service bulletin may be needed.', cta: 'VIEW ANALYTICS', screen: 'analytics' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-800 text-hcsg-orange text-lg" style={BC}>›››</span>
          <p className="font-700 text-slate-400 text-xs tracking-widest" style={BC}>{today}</p>
        </div>
        <h1 className="font-800 text-hcsg-navy" style={{ ...BC, fontSize: 28, letterSpacing: '-0.5px' }}>
          {greeting()}, {ADMIN.name.split(' ')[0].toUpperCase()}
        </h1>
        <p className="text-slate-400 text-sm mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>Gulf Coast Region · 32 branches · 375 technicians</p>
      </div>

      {/* Action items */}
      <div className="mb-6">
        <p className="font-700 text-slate-500 text-xs tracking-widest uppercase mb-3" style={BC}>ACTION REQUIRED · {actions.length}</p>
        <div className="space-y-2">
          {actions.map((a, i) => {
            const Icon = a.icon
            return (
              <div key={i} className="flex items-center gap-4 p-4" style={{ background: a.bg, border: `1px solid ${a.border}`, borderLeft: `4px solid ${a.color}`, borderRadius: 6 }}>
                <Icon size={16} style={{ color: a.iconColor, shrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="font-700 text-xs tracking-widest mb-0.5" style={{ ...BC, color: a.color }}>{a.label}</p>
                  <p className="text-slate-600 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{a.desc}</p>
                </div>
                <button onClick={() => onNavigate(a.screen)} className="flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-700 tracking-wider shrink-0" style={{ ...BC, background: a.color, borderRadius: 3 }}>
                  {a.cta} <ArrowRight size={12} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Stat label="MANUALS INDEXED"    value={KNOWLEDGE_BASE.totalDocuments} sub={`${KNOWLEDGE_BASE.totalPages} pages`} iconBg="#1159af" />
        <Stat label="AI QUERIES — MONTH" value={ANALYTICS.totalQueries}        sub="This month · avg 3.2s"                iconBg="#e65e25" />
        <Stat label="ACTIVE WORK ORDERS" value={wos.length}                    sub="2 emergency today"                   iconBg="#b82105" />
        <Stat label="BRANCH COVERAGE"    value="32 / 32"                       sub="Gulf Coast + National"               iconBg="#16a34a" />
      </div>

      {/* ROI */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'FIRST-VISIT RESOLUTION', value: ANALYTICS.firstVisitResolutionRate, sub: '+14% vs pre-AI', color: '#16a34a' },
          { label: 'CALLBACK REDUCTION',     value: ANALYTICS.callbackReduction,         sub: 'Last 90 days',  color: '#16a34a' },
          { label: 'EST. ANNUAL SAVINGS',    value: ANALYTICS.estimatedAnnualSavings,    sub: 'Labor + return trips', color: '#e65e25' },
        ].map(m => (
          <div key={m.label} className="bg-white p-5" style={{ borderRadius: 6, borderTop: `3px solid ${m.color}` }}>
            <p className="font-800" style={{ ...BC, fontSize: 26, color: m.color, letterSpacing: '-0.3px' }}>{m.value}</p>
            <p className="font-700 text-slate-600 text-sm mt-0.5" style={BC}>{m.label}</p>
            <p className="text-slate-400 text-xs mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{m.sub}</p>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-xs mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>
        * Based on {ANALYTICS.totalQueries} AI-assisted work orders · avg $22 callback cost · 375 technicians across 32 branches
      </p>

      <div className="grid grid-cols-3 gap-6">
        {/* Active WOs */}
        <div className="col-span-2 bg-white p-5" style={{ borderRadius: 6 }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-800 text-hcsg-navy text-sm tracking-wide" style={BC}>ACTIVE WORK ORDERS</p>
            <button onClick={() => onNavigate('workorders')} className="flex items-center gap-1 text-xs font-700" style={{ ...BC, color: '#1159af' }}>VIEW ALL <ArrowRight size={11} /></button>
          </div>
          <div className="space-y-2">
            {wos.map(wo => (
              <div key={wo.id} className="flex items-center gap-3 px-3 py-2.5" style={{ borderRadius: 4, border: '1px solid #FAF8F5' }}>
                <span className="text-xs font-700 px-1.5 py-0.5" style={{ ...BC, borderRadius: 3, background: wo.priority === 'High' ? '#b82105' : '#f5a524', color: wo.priority === 'High' ? 'white' : '#011e41' }}>{wo.priority.toUpperCase()}</span>
                <span className="text-slate-700 text-sm font-semibold flex-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.customer}</span>
                <span className="text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.site}</span>
                <span className="flex items-center gap-1 text-xs font-700 px-2 py-0.5" style={{ ...BC, borderRadius: 3, background: 'rgba(74,222,128,0.1)', color: '#16a34a', border: '1px solid rgba(74,222,128,0.2)' }}><Zap size={9} fill="currentColor" />AI READY</span>
              </div>
            ))}
          </div>
        </div>

        {/* NetSuite card */}
        <div className="bg-hcsg-navy p-5 flex flex-col justify-between" style={{ borderRadius: 6, borderTop: '3px solid #e65e25' }}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-hcsg-orange" />
              <p className="font-800 text-white text-xs tracking-widest uppercase" style={BC}>OPEN ARCHITECTURE</p>
            </div>
            <p className="text-white/50 text-xs leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Designed to complement or replace legacy FSM systems. Open API — no vendor lock-in. Works alongside NetSuite or as a standalone field service layer.
            </p>
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="font-700 text-white/20 text-xs tracking-wider uppercase mb-2" style={BC}>INTEGRATES WITH</p>
            <div className="flex gap-1.5 flex-wrap">
              {['SHAREPOINT', 'TEAMS', 'NETSUITE'].map(t => (
                <span key={t} className="text-white/40 text-xs font-700 px-2 py-1" style={{ ...BC, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
