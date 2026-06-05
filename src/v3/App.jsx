import { useState } from 'react'
import Login from './components/Login'
import TechHome from './components/technician/Home'
import EquipmentConfirm from './components/technician/EquipmentConfirm'
import AdvisorChat from './components/technician/AdvisorChat'
import MyWork from './components/technician/MyWork'
import TechSettings from './components/technician/TechSettings'
import ManagerLayout from './components/manager/Layout'

export default function App() {
  const [role, setRole] = useState('login') // 'login' | 'tech' | 'manager'
  const [techScreen, setTechScreen] = useState('home')
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [identifyMethod, setIdentifyMethod] = useState(null)

  function handleLogin(r) {
    setRole(r)
    setTechScreen('home')
  }

  function handleIdentify(equipment, method) {
    setSelectedEquipment(equipment)
    setIdentifyMethod(method)
    setTechScreen('confirm')
  }

  function handleConfirm() {
    setTechScreen('chat')
  }

  function handleBackToHome() {
    setSelectedEquipment(null)
    setIdentifyMethod(null)
    setTechScreen('home')
  }

  if (role === 'login') {
    return (
      <div className="min-h-screen bg-hcsg-navy flex items-center justify-center p-4">
        <Login onLogin={handleLogin} />
      </div>
    )
  }

  if (role === 'manager') {
    return <ManagerLayout onSwitchToTech={() => { setRole('tech'); setTechScreen('home') }} />
  }

  // Technician — mobile phone frame
  return (
    <div className="min-h-screen bg-hcsg-navy flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        {techScreen === 'home' && (
          <TechHome
            onIdentify={handleIdentify}
            onMyWork={() => setTechScreen('mywork')}
            onSettings={() => setTechScreen('settings')}
          />
        )}
        {techScreen === 'confirm' && (
          <EquipmentConfirm
            equipment={selectedEquipment}
            method={identifyMethod}
            onConfirm={handleConfirm}
            onBack={handleBackToHome}
          />
        )}
        {techScreen === 'chat' && (
          <AdvisorChat
            equipment={selectedEquipment}
            onBack={handleBackToHome}
          />
        )}
        {techScreen === 'mywork' && (
          <MyWork onBack={() => setTechScreen('home')} />
        )}
        {techScreen === 'settings' && (
          <TechSettings
            onBack={() => setTechScreen('home')}
            onSignOut={() => setRole('login')}
          />
        )}
      </div>

      {/* Role switcher */}
      <button
        onClick={() => setRole('manager')}
        className="fixed bottom-5 right-5 flex items-center gap-2 bg-hcsg-navy/90 border border-white/15 text-white text-sm px-4 py-2.5 rounded-full shadow-xl hover:bg-white/10 transition-colors z-50"
      >
        <span className="w-7 h-7 rounded-full bg-hcsg-blue flex items-center justify-center text-xs font-bold">SA</span>
        <span className="text-sm">Manager View</span>
      </button>
    </div>
  )
}
