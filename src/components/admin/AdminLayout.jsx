import { LayoutDashboard, FileText, Briefcase, BarChart2 } from 'lucide-react'
import { ADMIN } from '../../data'

const NAV_ITEMS = [
  { key: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { key: 'documents',  label: 'Documents',   icon: FileText },
  { key: 'workorders', label: 'Work Orders', icon: Briefcase },
  { key: 'analytics',  label: 'Analytics',   icon: BarChart2 },
]

export default function AdminLayout({ active, onNavigate, children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <div className="w-56 bg-hcsg-navy flex flex-col shrink-0 shadow-xl">

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <img
            src="https://www.hoistcrane.com/wp-content/uploads/2025/09/Hoist-and-Crane-Logo.svg"
            alt="HCSG"
            className="h-7 brightness-0 invert"
          />
          <p className="text-white/30 text-xs mt-2 tracking-widest uppercase">Admin Console</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active === key
                  ? 'bg-hcsg-orange text-white shadow-md'
                  : 'text-white/50 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
              {ADMIN.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{ADMIN.name}</p>
              <p className="text-white/40 text-xs truncate">{ADMIN.branch}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

    </div>
  )
}
