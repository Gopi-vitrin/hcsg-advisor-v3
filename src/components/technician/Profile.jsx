import { MapPin, Briefcase, ChevronRight, LogOut, Bell, Shield, BookOpen, CheckCircle, Package, AlertTriangle } from 'lucide-react'
import { TECHNICIAN, KNOWLEDGE_BASE } from '../../data'

function SettingRow({ icon, label, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/5 transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="flex-1 text-left text-white/80 text-sm">{label}</span>
      {value && <span className="text-white/30 text-xs">{value}</span>}
      <ChevronRight size={15} className="text-white/20 shrink-0" />
    </button>
  )
}

export default function Profile({ onSignOut, completedWOs = [] }) {
  return (
    <div className="flex flex-col h-full bg-hcsg-navy overflow-y-auto">

      {/* Avatar hero */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4">
        <div className="w-20 h-20 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-hcsg-orange/30">
          {TECHNICIAN.avatar}
        </div>
        <h1 className="text-white text-xl font-bold">{TECHNICIAN.name}</h1>
        <p className="text-hcsg-orange text-sm mt-0.5">{TECHNICIAN.role}</p>
        <div className="flex items-center gap-1.5 mt-2">
          <MapPin size={13} className="text-white/30" />
          <p className="text-white/40 text-sm">{TECHNICIAN.branch}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="mx-4 grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'WOs Today',  value: String(TECHNICIAN.workOrders.length) },
          { label: 'Completed',  value: String(completedWOs.length) },
          { label: 'AI Queries', value: '12' },
        ].map(s => (
          <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl py-3 text-center">
            <p className="text-white font-bold text-lg">{s.value}</p>
            <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Knowledge base */}
      <div className="mx-4 mb-4 bg-hcsg-blue/10 border border-hcsg-blue/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={14} className="text-hcsg-blue" />
          <p className="text-hcsg-blue text-sm font-semibold">Knowledge Base</p>
        </div>
        <p className="text-white/60 text-xs leading-relaxed">
          {KNOWLEDGE_BASE.totalDocuments} manuals indexed · Last updated {KNOWLEDGE_BASE.lastUpdated}
        </p>
      </div>

      {/* Settings list */}
      <div className="mx-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/8 mb-4">
        <SettingRow icon={<Bell size={15} className="text-white/50" />}    label="Notifications"    value="On" />
        <SettingRow icon={<Shield size={15} className="text-white/50" />}  label="LOTO Reminders"  value="On" />
        <SettingRow icon={<Briefcase size={15} className="text-white/50" />} label="Branch"         value={TECHNICIAN.branch} />
      </div>

      {/* Completed work orders */}
      {completedWOs.length > 0 && (
        <div className="mx-4 mb-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2.5 px-1">
            Completed Today
          </p>
          <div className="space-y-2">
            {completedWOs.map((wo, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-white font-semibold text-sm">{wo.customer}</p>
                    <p className="text-white/40 text-xs mt-0.5">{wo.id} · {wo.site}</p>
                  </div>
                  <div className={`flex items-center gap-1 shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
                    wo.faultConfirmed
                      ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                      : 'bg-hcsg-amber/15 text-hcsg-amber border border-hcsg-amber/25'
                  }`}>
                    {wo.faultConfirmed
                      ? <><CheckCircle size={10} /> Fixed</>
                      : <><AlertTriangle size={10} /> Escalated</>
                    }
                  </div>
                </div>
                <p className="text-white/40 text-xs mb-1">{wo.equipment}</p>
                {wo.partsUsed && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Package size={11} className="text-hcsg-orange shrink-0" />
                    <p className="text-white/35 text-xs leading-snug">{wo.partsUsed}</p>
                  </div>
                )}
                <p className="text-white/20 text-xs mt-2">{wo.completedAt}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {completedWOs.length === 0 && (
        <div className="mx-4 mb-4 bg-white/3 border border-white/8 rounded-2xl px-4 py-5 text-center">
          <p className="text-white/25 text-xs uppercase tracking-widest mb-1">Completed Today</p>
          <p className="text-white/20 text-xs">No completed work orders yet</p>
        </div>
      )}

      {/* Sign out */}
      <div className="mx-4 mb-8">
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-sm active:bg-white/10 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

    </div>
  )
}
