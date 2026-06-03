import { Shield, Users, Link, Bell, Database } from 'lucide-react'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

const INTEGRATIONS = [
  { name: 'Microsoft SharePoint', desc: 'Document library sync — manuals, SOPs, bulletins', status: 'CONNECTED', color: '#0078D4' },
  { name: 'Microsoft Teams',      desc: 'Technician notifications and AI chat integration',  status: 'CONNECTED', color: '#6264A7' },
  { name: 'NetSuite FSM',         desc: 'Work order sync and field service management',       status: 'CONFIGURE', color: '#2F4858' },
]
const ROLES = [
  { role: 'Field Technician',  access: 'Work orders, AI diagnosis, knowledge base (read)' },
  { role: 'Senior Field Tech', access: 'All technician + service history editing' },
  { role: 'Service Manager',   access: 'Full admin console access' },
  { role: 'Knowledge Admin',   access: 'Document upload, index management' },
]

function Section({ label, icon: Icon, children }) {
  return (
    <div className="bg-white mb-5" style={{ borderRadius: 6, border: '1px solid #e2e8f0', borderTop: '3px solid #e65e25' }}>
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid #f0f2f5' }}>
        <Icon size={14} className="text-hcsg-orange" />
        <p className="font-800 text-hcsg-navy text-sm" style={BC}>{label}</p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

export default function Settings() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-800 text-hcsg-orange" style={BC}>›</span>
          <p className="font-700 text-slate-400 text-xs tracking-widest uppercase" style={BC}>ADMINISTRATION</p>
        </div>
        <h1 className="font-800 text-hcsg-navy" style={{ ...BC, fontSize: 26, letterSpacing: '-0.3px' }}>SETTINGS</h1>
      </div>

      <Section label="INTEGRATIONS" icon={Link}>
        <div className="space-y-3">
          {INTEGRATIONS.map(int => (
            <div key={int.name} className="flex items-center gap-4 px-4 py-3" style={{ border: '1px solid #f0f2f5', borderRadius: 4 }}>
              <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: int.color, borderRadius: 4 }}>
                <Link size={14} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-slate-700 font-semibold text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{int.name}</p>
                <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>{int.desc}</p>
              </div>
              <span className="text-xs font-700 px-2.5 py-1" style={{ ...BC, borderRadius: 3, background: int.status === 'CONNECTED' ? '#f0fdf4' : '#fffbeb', color: int.status === 'CONNECTED' ? '#16a34a' : '#d97706', border: `1px solid ${int.status === 'CONNECTED' ? '#bbf7d0' : '#fde68a'}` }}>
                {int.status}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section label="ROLES & PERMISSIONS" icon={Shield}>
        <div className="space-y-2">
          {ROLES.map(r => (
            <div key={r.role} className="flex items-center gap-4 px-4 py-3" style={{ border: '1px solid #f0f2f5', borderRadius: 4 }}>
              <p className="font-700 text-hcsg-navy text-sm w-40 shrink-0" style={BC}>{r.role.toUpperCase()}</p>
              <p className="text-slate-500 text-xs flex-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{r.access}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="NOTIFICATIONS" icon={Bell}>
        <div className="space-y-3">
          {[
            { l: 'Coverage gap alerts', v: 'ON' },
            { l: 'New technician joins', v: 'ON' },
            { l: 'Weekly AI usage summary', v: 'ON' },
            { l: 'Document indexing complete', v: 'ON' },
          ].map(n => (
            <div key={n.l} className="flex items-center justify-between px-4 py-3" style={{ border: '1px solid #f0f2f5', borderRadius: 4 }}>
              <p className="text-slate-600 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{n.l}</p>
              <div className="w-9 h-5 flex items-center justify-end px-1 cursor-pointer" style={{ background: '#e65e25', borderRadius: 12 }}>
                <div className="w-3.5 h-3.5 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section label="DATA & COMPLIANCE" icon={Database}>
        <div className="space-y-3">
          {[
            { l: 'OSHA documentation auto-submit', v: 'ENABLED' },
            { l: 'Data retention period', v: '7 YEARS' },
            { l: 'AI query logging', v: 'ENABLED' },
          ].map(r => (
            <div key={r.l} className="flex items-center justify-between px-4 py-3" style={{ border: '1px solid #f0f2f5', borderRadius: 4 }}>
              <p className="text-slate-600 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{r.l}</p>
              <span className="font-700 text-xs text-hcsg-navy" style={BC}>{r.v}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
