import { Smartphone, Monitor } from 'lucide-react'

export default function RoleSwitcher({ role, onSwitch, disabled = false }) {
  const isAdmin = role === 'admin'

  return (
    <button
      onClick={disabled ? undefined : () => onSwitch(isAdmin ? 'technician' : 'admin')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: isAdmin ? '#e65e25' : '#011e41',
        border: `2px solid ${isAdmin ? '#f7630c' : '#1a3a5c'}`,
        opacity: disabled ? 0.25 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      {isAdmin ? (
        <>
          <Smartphone size={15} className="text-white" />
          <div className="text-left">
            <p className="text-white text-xs font-semibold leading-tight">Jake Thibodaux</p>
            <p className="text-white/60 text-xs leading-tight">Field Technician</p>
          </div>
        </>
      ) : (
        <>
          <Monitor size={15} className="text-white" />
          <div className="text-left">
            <p className="text-white text-xs font-semibold leading-tight">Sandra Arceneaux</p>
            <p className="text-white/60 text-xs leading-tight">Admin Console</p>
          </div>
        </>
      )}
    </button>
  )
}
