import { useState } from 'react'
import { CheckCircle, ChevronRight } from 'lucide-react'
import { ADMIN } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

export default function AdminLogin({ onLogin }) {
  const [state, setState] = useState('idle')

  function handle() {
    setState('loading')
    setTimeout(() => { setState('done'); setTimeout(onLogin, 1200) }, 1000)
  }

  return (
    <div className="min-h-screen bg-hcsg-navy flex items-center justify-center relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#e65e25 1px,transparent 1px),linear-gradient(90deg,#e65e25 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      {/* Photo */}
      <div className="absolute inset-0">
        <img src="/assets/corporate-projects.webp" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(1,30,65,0.9) 0%, rgba(1,30,65,0.75) 100%)' }} />
      </div>
      {/* Orange frame accent top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-hcsg-orange" />

      <div className="relative w-full max-w-sm mx-4">
        {/* Card */}
        <div className="p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, boxShadow: 'inset 0 0 0 3px rgba(230,94,37,0.15)' }}>
          <div className="flex flex-col items-center gap-6">
            <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-9 brightness-0 invert" />

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-800 text-hcsg-orange text-base" style={BC}>›››</span>
                <p className="font-700 text-white/30 text-xs tracking-widest uppercase" style={BC}>ADMIN CONSOLE</p>
              </div>
              <p className="font-800 text-white" style={{ ...BC, fontSize: 24, letterSpacing: '-0.3px' }}>SERVICE MANAGER</p>
              <p className="text-white/35 text-xs mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>Knowledge Base · Work Orders · Analytics</p>
            </div>

            {state === 'idle' && (
              <button onClick={handle} className="w-full flex items-center justify-between px-5 py-4 text-white transition-all active:scale-[0.98]" style={{ background: '#e65e25', borderRadius: 4 }}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 21 21" fill="none"><rect x="1" y="1" width="9" height="9" fill="#F25022"/><rect x="11" y="1" width="9" height="9" fill="#7FBA00"/><rect x="1" y="11" width="9" height="9" fill="#00A4EF"/><rect x="11" y="11" width="9" height="9" fill="#FFB900"/></svg>
                  <span className="font-800 tracking-widest uppercase text-sm" style={BC}>SIGN IN WITH MICROSOFT</span>
                </div>
                <ChevronRight size={16} className="text-white/60" />
              </button>
            )}
            {state === 'loading' && (
              <div className="w-full flex items-center justify-center gap-3 py-4" style={{ background: 'rgba(230,94,37,0.1)', border: '1px solid rgba(230,94,37,0.2)', borderRadius: 4 }}>
                <div className="w-4 h-4 border-2 border-hcsg-orange border-t-transparent rounded-full animate-spin" />
                <span className="font-700 text-hcsg-orange text-sm tracking-widest uppercase" style={BC}>AUTHENTICATING…</span>
              </div>
            )}
            {state === 'done' && (
              <div className="w-full flex items-center gap-3 px-5 py-4" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 4 }}>
                <CheckCircle size={18} className="text-green-400 shrink-0" />
                <div>
                  <p className="font-800 text-white text-sm tracking-wide uppercase" style={BC}>WELCOME, {ADMIN.name.split(' ')[0].toUpperCase()}</p>
                  <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>{ADMIN.branch}</p>
                </div>
              </div>
            )}
            <p className="text-white/15 text-xs text-center" style={{ fontFamily: "'Barlow', sans-serif" }}>Secured by Microsoft Entra ID · HCSG Internal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
