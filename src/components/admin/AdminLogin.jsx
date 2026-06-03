import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { ADMIN } from '../../data'

export default function AdminLogin({ onLogin }) {
  const [state, setState] = useState('idle')

  function handleSignIn() {
    setState('success')
    setTimeout(() => onLogin(), 1400)
  }

  return (
    <div className="min-h-screen bg-hcsg-navy flex items-center justify-center relative overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://www.hoistcrane.com/wp-content/uploads/2025/05/HAC-Corporate-Projects-CTA-Image.webp"
          alt=""
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-hcsg-navy/80 via-hcsg-navy/70 to-hcsg-navy/90" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm mx-4 bg-white/5 border border-white/15 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">

        <div className="flex flex-col items-center gap-6">
          <img
            src="https://www.hoistcrane.com/wp-content/uploads/2025/09/Hoist-and-Crane-Logo.svg"
            alt="HCSG"
            className="h-10 brightness-0 invert"
          />

          <div className="text-center">
            <h1 className="text-white text-2xl font-bold">Admin Console</h1>
            <p className="text-white/40 text-sm mt-1">Service Manager · Knowledge Base · Analytics</p>
          </div>

          {state === 'idle' && (
            <button
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-hcsg-orange hover:bg-hcsg-light-orange active:scale-95 text-white font-semibold py-4 rounded-xl transition-all shadow-lg"
            >
              <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
              </svg>
              Sign in with Microsoft
            </button>
          )}

          {state === 'success' && (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold text-lg">Welcome, {ADMIN.name.split(' ')[0]}</p>
                <p className="text-white/50 text-sm">{ADMIN.branch}</p>
              </div>
            </div>
          )}

          <p className="text-white/20 text-xs text-center">
            Secured by Microsoft Entra ID · HCSG Internal Use Only
          </p>
        </div>
      </div>
    </div>
  )
}
