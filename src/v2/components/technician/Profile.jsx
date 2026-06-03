import { MapPin, Award, LogOut, Settings, Bell, Shield, Clock } from 'lucide-react'
import { TECHNICIAN, KNOWLEDGE_BASE } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

export default function Profile({ onSignOut }) {
  return (
    <div className="flex flex-col h-full bg-hcsg-bg overflow-y-auto v2-scroll">

      {/* Hero */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex items-center justify-center bg-hcsg-orange font-800 text-white text-xl shrink-0" style={{ ...BC, borderRadius: 4 }}>
            {TECHNICIAN.avatar}
          </div>
          <div>
            <p className="font-800 text-white" style={{ ...BC, fontSize: 20, letterSpacing: '-0.3px' }}>{TECHNICIAN.name.toUpperCase()}</p>
            <p className="text-hcsg-orange text-sm font-700 mt-0.5" style={BC}>{TECHNICIAN.role.toUpperCase()}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-white/30" />
              <p className="text-white/35 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{TECHNICIAN.branch}</p>
            </div>
          </div>
        </div>

        {/* Shift bar */}
        <div className="flex items-center justify-between mt-4 px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4 }}>
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-white/30" />
            <span className="text-white/40 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>07:00 – 15:30 · Gulf Coast Region</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" />
            <span className="font-700 text-hcsg-green/70 text-xs tracking-wider" style={BC}>ON SHIFT</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-4 grid grid-cols-3 gap-2">
        {[{ v: '3', l: 'WOS TODAY' }, { v: '1', l: 'COMPLETED' }, { v: '12', l: 'AI QUERIES' }].map(s => (
          <div key={s.l} className="text-center py-3" style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4 }}>
            <p className="font-800 text-white text-xl" style={BC}>{s.v}</p>
            <p className="font-700 text-white/25 text-xs mt-0.5" style={BC}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-800 text-hcsg-orange text-sm" style={BC}>›</span>
          <p className="font-700 text-white/30 text-xs tracking-widest uppercase" style={BC}>CERTIFICATIONS</p>
        </div>
        <div className="space-y-1.5">
          {TECHNICIAN.certifications.map(cert => (
            <div key={cert} className="flex items-center gap-2.5 px-3 py-2.5" style={{ border: '1px solid rgba(19,97,46,0.12)', borderRadius: 4, background: 'rgba(19,97,46,0.06)' }}>
              <Award size={13} className="text-hcsg-green shrink-0" />
              <p className="text-white/65 text-xs font-semibold" style={{ fontFamily: "'Barlow', sans-serif" }}>{cert}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge base */}
      <div className="px-4 pb-4">
        <div className="px-3 py-3" style={{ border: '1px solid rgba(230,94,37,0.2)', borderRadius: 4, background: 'rgba(230,94,37,0.05)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-700 text-hcsg-navy text-xs tracking-widest uppercase" style={BC}>KNOWLEDGE BASE</span>
          </div>
          <p className="text-white/45 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{KNOWLEDGE_BASE.totalDocuments} manuals indexed · {KNOWLEDGE_BASE.totalPages} pages · Last updated {KNOWLEDGE_BASE.lastUpdated}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 pb-4 space-y-1">
        {[
          { icon: Bell,    label: 'NOTIFICATIONS',   value: 'ON' },
          { icon: Shield,  label: 'LOTO REMINDERS',  value: 'ON' },
          { icon: Settings, label: 'BRANCH',         value: TECHNICIAN.branch.toUpperCase() },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 px-3 py-3" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
            <Icon size={14} className="text-white/30 shrink-0" />
            <span className="flex-1 font-700 text-white/50 text-xs tracking-wider" style={BC}>{label}</span>
            <span className="font-700 text-white/30 text-xs" style={BC}>{value}</span>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <div className="px-4 pb-8">
        <button onClick={onSignOut} className="w-full flex items-center justify-center gap-2 py-3.5" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4 }}>
          <LogOut size={14} className="text-white/30" />
          <span className="font-700 text-white/30 text-xs tracking-widest uppercase" style={BC}>SIGN OUT</span>
        </button>
      </div>
    </div>
  )
}
