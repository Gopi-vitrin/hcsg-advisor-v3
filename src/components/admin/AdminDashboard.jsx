import { AlertTriangle, Zap, FileText, Briefcase, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { KNOWLEDGE_BASE, ANALYTICS, WORK_ORDERS, ADMIN } from '../../data'

function StatCard({ label, value, sub, color = 'text-hcsg-navy', icon: Icon, iconColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-slate-500 text-sm font-medium mt-0.5">{label}</p>
      {sub && <p className="text-slate-400 text-xs mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard({ onNavigate }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const wos = Object.values(WORK_ORDERS)

  return (
    <div className="p-8 max-w-6xl">

      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-hcsg-navy text-2xl font-bold">Good morning, {ADMIN.name.split(' ')[0]}</h1>
        <p className="text-slate-400 text-sm mt-1">{today} · Gulf Coast Region · 32 branches</p>
      </div>

      {/* Coverage gap alert */}
      <div className="flex items-center gap-3 bg-hcsg-dark-red/8 border border-hcsg-dark-red/20 rounded-2xl px-5 py-3.5 mb-6">
        <AlertTriangle size={16} className="text-red-500 shrink-0" />
        <p className="text-red-700 text-sm font-medium flex-1">
          Coverage gap: <span className="font-bold">Industrial Elevators</span> — No manuals indexed. Technicians have no AI support for elevator faults.
        </p>
        <button onClick={() => onNavigate('documents')} className="flex items-center gap-1 text-red-600 text-xs font-semibold shrink-0 hover:text-red-800">
          Fix now <ArrowRight size={12} />
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <StatCard label="Manuals Indexed"    value={KNOWLEDGE_BASE.totalDocuments} sub={`${KNOWLEDGE_BASE.totalPages} pages`} icon={FileText}   iconColor="bg-hcsg-blue" />
        <StatCard label="AI Queries — Month" value={ANALYTICS.totalQueries}        sub="Avg 3.2s response"                    icon={Zap}         iconColor="bg-hcsg-orange" />
        <StatCard label="Active Work Orders" value={wos.length}                    sub="2 emergency repairs today"            icon={Briefcase}   iconColor="bg-hcsg-dark-red" />
        <StatCard label="Branch Coverage"    value="32 / 32"                       sub="Gulf Coast + National"                icon={Users}       iconColor="bg-green-600" />
      </div>

      {/* ROI row */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'First-Visit Resolution Rate', value: ANALYTICS.firstVisitResolutionRate, delta: '+14% vs pre-AI', color: 'text-green-600' },
          { label: 'Callback Reduction',          value: ANALYTICS.callbackReduction,        delta: 'Last 90 days',   color: 'text-green-600' },
          { label: 'Est. Annual Savings',         value: ANALYTICS.estimatedAnnualSavings,   delta: 'Labor + return trips avoided', color: 'text-hcsg-orange' },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-slate-600 text-sm font-medium mt-0.5">{m.label}</p>
            <p className="text-slate-400 text-xs mt-1">{m.delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* Active work orders */}
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-hcsg-navy font-bold text-base">Active Work Orders</h2>
            <button onClick={() => onNavigate('workorders')} className="text-hcsg-blue text-xs font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {wos.map(wo => (
              <div key={wo.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${wo.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                  {wo.priority.toUpperCase()}
                </span>
                <span className="text-slate-800 text-sm font-medium flex-1">{wo.customer}</span>
                <span className="text-slate-400 text-xs">{wo.site}</span>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${wo.status === 'In Progress' ? 'bg-hcsg-orange/10 text-hcsg-orange' : 'bg-slate-100 text-slate-500'}`}>
                  <Zap size={10} fill="currentColor" />
                  AI Ready
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* NetSuite callout */}
        <div className="bg-hcsg-navy rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-hcsg-orange" />
              <p className="text-white text-sm font-semibold">Open Architecture</p>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">
              Designed to complement or replace legacy FSM systems. Open API — no vendor lock-in. Works alongside NetSuite or as a standalone field service layer.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white/30 text-xs">Integrates with</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-white/50 text-xs bg-white/8 px-2 py-1 rounded-lg">SharePoint</span>
              <span className="text-white/50 text-xs bg-white/8 px-2 py-1 rounded-lg">Teams</span>
              <span className="text-white/50 text-xs bg-white/8 px-2 py-1 rounded-lg">NetSuite</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
