import { LayoutDashboard, FileText, Briefcase, BarChart2, Users, Settings } from 'lucide-react'
import { ADMIN } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }
const NAV = [
  { key: 'dashboard',  label: 'DASHBOARD',   icon: LayoutDashboard },
  { key: 'knowledge',  label: 'KNOWLEDGE',   icon: FileText        },
  { key: 'workorders', label: 'WORK ORDERS', icon: Briefcase       },
  { key: 'analytics',  label: 'ANALYTICS',   icon: BarChart2       },
  { key: 'team',       label: 'TEAM',        icon: Users           },
  { key: 'settings',   label: 'SETTINGS',    icon: Settings        },
]

export default function AdminLayout({ active, onNavigate, children }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#f0f2f5' }}>

      {/* Sidebar */}
      <div className="w-52 shrink-0 flex flex-col" style={{ background: '#011e41' }}>
        {/* Orange top stripe — website motif */}
        <div className="h-1 w-full" style={{ background: '#e65e25' }} />

        {/* Logo */}
        <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-7 brightness-0 invert" />
          <div className="flex items-center gap-1.5 mt-2">
            <span className="font-800 text-hcsg-orange text-xs" style={BC}>›</span>
            <p className="font-700 text-white/30 text-xs tracking-widest uppercase" style={BC}>ADMIN CONSOLE</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 transition-all"
              style={{
                borderRadius: 4,
                background: active === key ? '#e65e25' : 'transparent',
                borderLeft: active === key ? 'none' : '3px solid transparent',
              }}
            >
              <Icon size={15} color={active === key ? 'white' : 'rgba(255,255,255,0.35)'} />
              <span className="font-700 tracking-widest text-xs" style={{ ...BC, color: active === key ? 'white' : 'rgba(255,255,255,0.35)' }}>
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-hcsg-orange font-800 text-white text-xs shrink-0" style={{ ...BC, borderRadius: 4 }}>
              {ADMIN.avatar}
            </div>
            <div className="min-w-0">
              <p className="font-700 text-white text-xs truncate" style={BC}>{ADMIN.name.toUpperCase()}</p>
              <p className="text-white/30 text-xs truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>{ADMIN.branch}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
