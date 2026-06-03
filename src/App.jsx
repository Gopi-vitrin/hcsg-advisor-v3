import { useState, useEffect } from 'react'

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
import { Briefcase, Search as SearchIcon, MessageSquare, User, Smartphone, Monitor } from 'lucide-react'
import { TECHNICIAN, ADMIN } from './data'

// ── Role-switch curtain overlay ────────────────────────────────────────────
function SwitchOverlay({ targetRole }) {
  const [ty, setTy] = useState('100%')
  const toAdmin = targetRole === 'admin'

  useEffect(() => {
    const t1 = setTimeout(() => setTy('0%'), 16)
    const t2 = setTimeout(() => setTy('-100%'), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-7 select-none"
      style={{
        background: toAdmin ? '#f8fafc' : '#011e41',
        transform: `translateY(${ty})`,
        transition: ty === '-100%'
          ? 'transform 420ms cubic-bezier(0.4, 0, 1, 1)'
          : 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Logo */}
      <img
        src="/assets/hcsg-logo.svg"
        alt="HCSG"
        className={`h-8 ${toAdmin ? '' : 'brightness-0 invert opacity-30'}`}
      />

      {/* Label */}
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${toAdmin ? 'text-slate-400' : 'text-white/30'}`}>
        {toAdmin ? 'Switching to Admin Console' : 'Switching to Field View'}
      </p>

      {/* Persona card */}
      <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${
        toAdmin
          ? 'bg-white border border-slate-200 shadow-sm'
          : 'bg-white/8 border border-white/12'
      }`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg`}
          style={{ background: '#e65e25' }}>
          {toAdmin ? ADMIN.avatar : TECHNICIAN.avatar}
        </div>
        <div>
          <p className={`font-bold text-base ${toAdmin ? 'text-slate-800' : 'text-white'}`}>
            {toAdmin ? ADMIN.name : TECHNICIAN.name}
          </p>
          <p className={`text-sm mt-0.5 ${toAdmin ? 'text-slate-500' : 'text-white/50'}`}>
            {toAdmin ? ADMIN.role : TECHNICIAN.role}
          </p>
          <p className={`text-xs mt-0.5 ${toAdmin ? 'text-slate-400' : 'text-white/30'}`}>
            {toAdmin ? `${ADMIN.branch} · 32 branches` : `${TECHNICIAN.branch} · Fast Track`}
          </p>
        </div>
      </div>

      {/* Mode icon */}
      <div className={`flex items-center gap-2 ${toAdmin ? 'text-slate-400' : 'text-white/25'}`}>
        {toAdmin
          ? <><Monitor size={14} /><span className="text-xs">Web dashboard</span></>
          : <><Smartphone size={14} /><span className="text-xs">Mobile field app</span></>
        }
      </div>
    </div>
  )
}

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
  const [switchingTo,     setSwitchingTo]     = useState(null) // 'admin' | 'technician'

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
    if (newRole === role || switchingTo) return
    setSwitchingTo(newRole)
    // Switch the actual role mid-animation (while overlay is covering the screen)
    setTimeout(() => setRole(newRole), 700)
    // Clear overlay after exit animation completes
    setTimeout(() => setSwitchingTo(null), 1560)
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

      {/* Dramatic switch overlay */}
      {switchingTo && <SwitchOverlay targetRole={switchingTo} />}
    </div>
  )
}
