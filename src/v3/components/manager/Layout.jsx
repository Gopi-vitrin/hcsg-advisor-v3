import { useState } from 'react'
import { LayoutDashboard, Users, Settings, Smartphone } from 'lucide-react'
import Dashboard from './Dashboard'
import TechnicianList from './TechnicianList'
import TechnicianDetail from './TechnicianDetail'
import ManagerSettings from './ManagerSettings'
import { MANAGER } from '../../data'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'technicians', label: 'Technicians', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function ManagerLayout({ onSwitchToTech }) {
  const [screen, setScreen] = useState('dashboard')
  const [selectedTech, setSelectedTech] = useState(null)

  function goToDetail(tech) {
    setSelectedTech(tech)
    setScreen('detail')
  }

  function backToList() {
    setSelectedTech(null)
    setScreen('technicians')
  }

  return (
    <div className="flex h-screen bg-[#f1f4f8] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-hcsg-navy flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-hcsg-orange rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-black">HCSG</span>
            </div>
            <div>
              <div className="text-white font-black text-sm leading-tight">HCSG Advisor</div>
              <div className="text-white/40 text-[10px] tracking-wider">MANAGER VIEW</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon
            const active = screen === item.id || (screen === 'detail' && item.id === 'technicians')
            return (
              <button
                key={item.id}
                onClick={() => { setScreen(item.id); setSelectedTech(null) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-hcsg-orange text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Manager profile + tech switch */}
        <div className="px-3 pb-5 space-y-2">
          <button
            onClick={onSwitchToTech}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-colors text-xs font-medium"
          >
            <Smartphone size={14} />
            Technician View
          </button>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-hcsg-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
              {MANAGER.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-semibold truncate">{MANAGER.name}</div>
              <div className="text-white/40 text-[10px] truncate">{MANAGER.branch}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {screen === 'dashboard' && <Dashboard onViewTech={goToDetail} />}
        {screen === 'technicians' && <TechnicianList onSelect={goToDetail} />}
        {screen === 'detail' && selectedTech && (
          <TechnicianDetail tech={selectedTech} onBack={backToList} />
        )}
        {screen === 'settings' && <ManagerSettings />}
      </main>
    </div>
  )
}
