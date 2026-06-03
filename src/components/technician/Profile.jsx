import { MapPin, Briefcase, ChevronRight, LogOut, Bell, Shield, BookOpen } from 'lucide-react'
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

export default function Profile({ onSignOut }) {
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
          { label: 'WOs Today', value: '3' },
          { label: 'Completed', value: '1' },
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
