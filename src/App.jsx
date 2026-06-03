import { useState } from 'react'

// Technician screens
import Login            from './components/technician/Login'
import WorkOrders       from './components/technician/WorkOrders'
import WorkOrderDetail  from './components/technician/WorkOrderDetail'
import AIProcessing     from './components/technician/AIProcessing'
import PredictionsPanel from './components/technician/PredictionsPanel'
import AdaptiveQA       from './components/technician/AdaptiveQA'
import ResolutionGuide  from './components/technician/ResolutionGuide'
import Notes            from './components/technician/Notes'
import Completion       from './components/technician/Completion'
import Search           from './components/technician/Search'
import Chat             from './components/technician/Chat'
import Profile          from './components/technician/Profile'
import EquipmentHistory from './components/technician/EquipmentHistory'

// Admin screens
import AdminLogin           from './components/admin/AdminLogin'
import AdminLayout          from './components/admin/AdminLayout'
import AdminDashboard       from './components/admin/AdminDashboard'
import DocumentManagement   from './components/admin/DocumentManagement'
import WorkOrderMonitoring  from './components/admin/WorkOrderMonitoring'
import AIAnalytics          from './components/admin/AIAnalytics'
import AdminTeam            from './components/admin/AdminTeam'

// Shared
import RoleSwitcher from './components/shared/RoleSwitcher'

// Nav helpers
import { Briefcase, Search as SearchIcon, MessageSquare, User } from 'lucide-react'

function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'jobs',    label: 'Jobs',    icon: <Briefcase size={20} /> },
    { key: 'search',  label: 'Search',  icon: <SearchIcon size={20} /> },
    { key: 'chat',    label: 'Chat',    icon: <MessageSquare size={20} /> },
    { key: 'profile', label: 'Profile', icon: <User size={20} /> },
  ]
  return (
    <div className="border-t border-white/10 bg-hcsg-navy px-2 pb-5 pt-2 shrink-0">
      <div className="flex items-center justify-around">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
              active === item.key ? 'text-hcsg-orange' : 'text-white/30 active:text-white/60'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function PhoneFrame({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8 overflow-y-auto">
      <div
        className="relative bg-hcsg-navy overflow-hidden shadow-2xl"
        style={{ width: 390, minHeight: 844, borderRadius: 44 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-50" />
        <div className="flex flex-col" style={{ paddingTop: 28, height: 844 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

const NAV_MAP = { jobs: 'work-orders', search: 'search', chat: 'chat', profile: 'profile' }
const TAB_MAP = { 'work-orders': 'jobs', search: 'search', chat: 'chat', profile: 'profile' }

export default function App() {
  const [role,            setRole]            = useState('technician')
  const [techScreen,      setTechScreen]      = useState('login')
  const [adminScreen,     setAdminScreen]     = useState('admin-login')
  const [selectedWO,      setSelectedWO]      = useState(null)
  const [findings,        setFindings]        = useState(null)
  const [chatContext,     setChatContext]     = useState(null)
  const [finalConfidence, setFinalConfidence] = useState(null)

  // --- Technician navigation ---
  const goTech = (s) => setTechScreen(s)

  function handleSelectWO(woId)  { setSelectedWO(woId); goTech('wo-detail') }

  // Clear stale context when navigating to Chat via bottom nav
  function handleNavTab(tab) {
    if (tab === 'chat') setChatContext(null)
    goTech(NAV_MAP[tab])
  }

  function handleAskQuestion() {
    setChatContext(selectedWO)
    goTech('chat')
  }

  function handleRoleSwitch(newRole) {
    setRole(newRole)
    // Skip login screens on switch if already visited
    if (newRole === 'admin' && adminScreen === 'admin-login') setAdminScreen('admin-login')
  }

  // --- Render ---
  return (
    <div>
      {/* TECHNICIAN VIEW */}
      {role === 'technician' && (
        <PhoneFrame>
          {techScreen === 'login' && (
            <Login onLogin={() => goTech('work-orders')} />
          )}
          {techScreen === 'work-orders' && (
            <WorkOrders onSelectWO={handleSelectWO} onNavigate={handleNavTab} activeTab="jobs" />
          )}
          {techScreen === 'search' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden"><Search onSelectWO={handleSelectWO} /></div>
              <BottomNav active="search" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-hidden">
                <Chat
                  contextWoId={chatContext}
                  onBack={chatContext ? () => goTech('predictions') : null}
                />
              </div>
              <BottomNav active="chat" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'profile' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto"><Profile onSignOut={() => goTech('login')} /></div>
              <BottomNav active="profile" onNavigate={handleNavTab} />
            </div>
          )}
          {techScreen === 'wo-detail' && (
            <WorkOrderDetail
              woId={selectedWO}
              onBack={() => goTech('work-orders')}
              onGetDiagnosis={() => goTech('ai-processing')}
              onViewHistory={() => goTech('equipment-history')}
            />
          )}
          {techScreen === 'equipment-history' && (
            <EquipmentHistory
              woId={selectedWO}
              onBack={() => goTech('wo-detail')}
              onGetDiagnosis={() => goTech('ai-processing')}
            />
          )}
          {techScreen === 'ai-processing' && (
            <AIProcessing woId={selectedWO} onComplete={() => goTech('predictions')} />
          )}
          {techScreen === 'predictions' && (
            <PredictionsPanel
              woId={selectedWO}
              onBack={() => goTech('wo-detail')}
              onStartTroubleshooting={() => goTech('adaptive-qa')}
              onAskQuestion={handleAskQuestion}
            />
          )}
          {techScreen === 'adaptive-qa' && (
            <AdaptiveQA
              woId={selectedWO}
              onBack={() => goTech('predictions')}
              onComplete={(conf) => { setFinalConfidence(conf); goTech('resolution') }}
            />
          )}
          {techScreen === 'resolution' && (
            <ResolutionGuide
              woId={selectedWO}
              onBack={() => goTech('adaptive-qa')}
              onComplete={() => goTech('notes')}
            />
          )}
          {techScreen === 'notes' && (
            <Notes
              woId={selectedWO}
              onBack={() => goTech('resolution')}
              onComplete={(data) => { setFindings(data); goTech('complete') }}
            />
          )}
          {techScreen === 'complete' && (
            <Completion
              woId={selectedWO}
              findings={findings}
              finalConfidence={finalConfidence}
              onReturn={() => goTech('work-orders')}
            />
          )}
        </PhoneFrame>
      )}

      {/* ADMIN VIEW */}
      {role === 'admin' && (
        <>
          {adminScreen === 'admin-login' && (
            <AdminLogin onLogin={() => setAdminScreen('dashboard')} />
          )}
          {adminScreen !== 'admin-login' && (
            <AdminLayout active={adminScreen} onNavigate={setAdminScreen}>
              {adminScreen === 'dashboard'  && <AdminDashboard onNavigate={setAdminScreen} />}
              {adminScreen === 'documents'  && <DocumentManagement />}
              {adminScreen === 'workorders' && <WorkOrderMonitoring />}
              {adminScreen === 'analytics'  && <AIAnalytics />}
              {adminScreen === 'team'       && <AdminTeam />}
            </AdminLayout>
          )}
        </>
      )}

      {/* Role switcher — always visible */}
      <RoleSwitcher role={role} onSwitch={handleRoleSwitch} />
    </div>
  )
}
