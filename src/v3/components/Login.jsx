import { useState } from 'react'

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false)

  function handleSignIn(role) {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin(role)
    }, 1100)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="relative bg-hcsg-page rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col" style={{ minHeight: '86vh' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-hcsg-navy rounded-b-2xl z-10" />

        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #653a15 0, #653a15 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
        />

        <div className="relative flex flex-col items-center px-8 pt-14 pb-10 flex-1">
          {/* Logo */}
          <div className="mt-6 mb-1 flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-hcsg-light-gray">
              <span className="text-xs font-black text-hcsg-orange leading-none">HCSG</span>
            </div>
            <div>
              <div className="font-black text-hcsg-navy text-lg tracking-tight leading-tight">HOIST & CRANE</div>
              <div className="text-[10px] text-hcsg-muted tracking-[0.2em] font-medium">SERVICE GROUP</div>
            </div>
          </div>
          <div className="text-[10px] text-hcsg-muted tracking-[0.25em] mb-14">HCSG ADVISOR</div>

          {/* Hero */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h1 className="text-[1.7rem] font-black text-hcsg-navy leading-tight mb-2">Diagnose faster.</h1>
            <h1 className="text-[1.7rem] font-black text-hcsg-orange leading-tight mb-5">Fix right the first time.</h1>
            <p className="text-sm text-hcsg-muted leading-relaxed max-w-[260px]">
              AI-powered field diagnostics, sourced directly from your equipment manuals.
            </p>
          </div>

          {/* Sign in */}
          <div className="w-full space-y-3 mt-10">
            <button
              onClick={() => handleSignIn('tech')}
              disabled={loading}
              className="w-full bg-hcsg-orange text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-base transition-opacity active:opacity-80 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MsIcon />
                  Sign in with Microsoft
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-hcsg-muted/70">
              Secured by Microsoft Entra ID · HCSG Internal Use Only
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="1" width="8.5" height="8.5" fill="#f25022" />
      <rect x="10.5" y="1" width="8.5" height="8.5" fill="#7fba00" />
      <rect x="1" y="10.5" width="8.5" height="8.5" fill="#00a4ef" />
      <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#ffb900" />
    </svg>
  )
}
