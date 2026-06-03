import { Smartphone, Monitor } from 'lucide-react'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

export default function RoleSwitcher({ role, onSwitch }) {
  const isAdmin = role === 'admin'
  return (
    <button
      onClick={() => onSwitch(isAdmin ? 'technician' : 'admin')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ background: isAdmin ? '#e65e25' : '#011e41', border: `2px solid ${isAdmin ? '#f7630c' : '#1a3a5c'}`, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
    >
      {isAdmin ? (
        <><Smartphone size={14} className="text-white" /><div className="text-left"><p className="font-800 text-white leading-tight" style={{ ...BC, fontSize: 11 }}>JAKE THIBODAUX</p><p className="font-700 text-white/50 leading-tight" style={{ ...BC, fontSize: 9 }}>FIELD TECHNICIAN</p></div></>
      ) : (
        <><Monitor size={14} className="text-white" /><div className="text-left"><p className="font-800 text-white leading-tight" style={{ ...BC, fontSize: 11 }}>SANDRA ARCENEAUX</p><p className="font-700 text-white/50 leading-tight" style={{ ...BC, fontSize: 9 }}>ADMIN CONSOLE</p></div></>
      )}
    </button>
  )
}
