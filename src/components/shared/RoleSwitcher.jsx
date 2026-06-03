import { Smartphone, Monitor } from 'lucide-react'

export default function RoleSwitcher({ role, onSwitch }) {
  const isAdmin = role === 'admin'

  return (
    <button
      onClick={() => onSwitch(isAdmin ? 'technician' : 'admin')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: isAdmin ? '#e65e25' : '#011e41',
        border: `2px solid ${isAdmin ? '#f7630c' : '#1a3a5c'}`,
      }}
    >
      {isAdmin
        ? <><Smartphone size={15} className="text-white" /><span className="text-white text-xs font-semibold">Technician View</span></>
        : <><Monitor size={15} className="text-white" /><span className="text-white text-xs font-semibold">Admin View</span></>
      }
    </button>
  )
}
