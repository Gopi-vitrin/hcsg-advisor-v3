import { useState } from 'react'

// Technician
import Login   from './components/technician/Login'
import Home    from './components/technician/Home'
import WOHub   from './components/technician/WOHub'
import Search  from './components/technician/Search'
import Profile from './components/technician/Profile'

// Admin
import AdminLogin        from './components/admin/AdminLogin'
import AdminLayout       from './components/admin/AdminLayout'
import Dashboard         from './components/admin/Dashboard'
import KnowledgeBase     from './components/admin/KnowledgeBase'
import WorkOrderMonitor  from './components/admin/WorkOrderMonitor'
import Analytics         from './components/admin/Analytics'
import Team              from './components/admin/Team'
import Settings          from './components/admin/Settings'

// Shared
import RoleSwitcher from './components/shared/RoleSwitcher'

// Icons for bottom nav
import { Home as HomeIcon, Zap, Search as SearchIcon, User } from 'lucide-react'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'home',   label: 'HOME',   Icon: HomeIcon   },
    { key: 'active', label: 'ACTIVE', Icon: Zap        },
    { key: 'search', label: 'SEARCH', Icon: SearchIcon },
    { key: 'me',     label: 'ME',     Icon: User       },
  ]
  return (
    <div className="border-t border-white/8 bg-hcsg-navy px-2 pb-5 pt-2 shrink-0">
      <div className="flex items-center justify-around">
        {items.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => onNavigate(key)} className="flex flex-col items-center gap-1 px-4 py-1 transition-colors">
            <Icon size={18} color={active === key ? '#e65e25' : 'rgba(255,255,255,0.2)'} />
            <span className="font-700" style={{ ...BC, fontSize: 9, letterSpacing: '0.12em', color: active === key ? '#e65e25' : 'rgba(255,255,255,0.2)' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-8 overflow-y-auto">
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#e65e25 1px,transparent 1px),linear-gradient(90deg,#e65e25 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="relative bg-hcsg-navy overflow-hidden shadow-2xl" style={{ width: 390, minHeight: 844, borderRadius: 32 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-950 rounded-b-2xl z-50" />
        <div className="flex flex-col" style={{ paddingTop: 24, height: 844 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

const TAB_TO_SCREEN = { home: 'home', search: 'search', me: 'profile' }

export default function App() {
  const [role,       setRole]       = useState('technician')
  const [techScreen, setTechScreen] = useState('login')
  const [adminScreen,setAdminScreen]= useState('admin-login')
  const [selectedWO, setSelectedWO] = useState(null)
  const [activeTab,  setActiveTab]  = useState('home')

  function goTech(s) { setTechScreen(s) }

  function handleNavTab(tab) {
    setActiveTab(tab)
    if (tab === 'active' && selectedWO) { goTech('wo-hub'); return }
    if (TAB_TO_SCREEN[tab]) goTech(TAB_TO_SCREEN[tab])
  }

  function handleSelectWO(woId) {
    setSelectedWO(woId)
    setActiveTab('active')
    goTech('wo-hub')
  }

  function handleRoleSwitch(r) {
    setRole(r)
    if (r === 'admin' && adminScreen === 'admin-login') setAdminScreen('admin-login')
  }

  const showBottomNav = ['home','wo-hub','search','profile'].includes(techScreen)

  return (
    <div>
      {role === 'technician' && (
        <PhoneFrame>
          {techScreen === 'login' && (
            <Login onLogin={() => goTech('home')} />
          )}
          {techScreen === 'home' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <Home onSelectWO={handleSelectWO} onNavigate={handleNavTab} activeTab={activeTab} />
              </div>
            </div>
          )}
          {techScreen === 'wo-hub' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <WOHub woId={selectedWO} onBack={() => { goTech('home'); setActiveTab('home') }} onComplete={() => { goTech('home'); setActiveTab('home') }} />
              </div>
              <BottomNav active="active" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'search' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden"><Search onSelectWO={handleSelectWO} /></div>
              <BottomNav active="search" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'profile' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto"><Profile onSignOut={() => { setTechScreen('login'); setActiveTab('home') }} /></div>
              <BottomNav active="me" onNavigate={handleNavTab} />
            </div>
          )}
        </PhoneFrame>
      )}

      {role === 'admin' && (
        <>
          {adminScreen === 'admin-login' && (
            <AdminLogin onLogin={() => setAdminScreen('dashboard')} />
          )}
          {adminScreen !== 'admin-login' && (
            <AdminLayout active={adminScreen} onNavigate={setAdminScreen}>
              {adminScreen === 'dashboard'  && <Dashboard  onNavigate={setAdminScreen} />}
              {adminScreen === 'knowledge'  && <KnowledgeBase />}
              {adminScreen === 'workorders' && <WorkOrderMonitor />}
              {adminScreen === 'analytics'  && <Analytics />}
              {adminScreen === 'team'       && <Team />}
              {adminScreen === 'settings'   && <Settings />}
            </AdminLayout>
          )}
        </>
      )}

      <RoleSwitcher role={role} onSwitch={handleRoleSwitch} />
    </div>
  )
}
