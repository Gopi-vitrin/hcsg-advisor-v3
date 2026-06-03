import { useEffect, useState } from 'react'
import { CheckCircle, FileText, Loader } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Analysing work order...',                   duration: 800,  icon: '📋' },
  { id: 2, label: 'Searching 4 equipment manuals...',          duration: 1200, icon: '📚' },
  { id: 3, label: 'Scanning 487 hours of service history...',  duration: 800,  icon: '🔍' },
  { id: 4, label: 'Cross-referencing similar fault patterns...', duration: 800, icon: '🔗' },
  { id: 5, label: 'Generating ranked predictions...',          duration: 600,  icon: '⚡' },
]

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0) // 4200ms

export default function AIProcessing({ woId, onComplete }) {
  const [activeStep, setActiveStep]       = useState(0) // index of currently-running step
  const [completedSteps, setCompletedSteps] = useState([])
  const [progress, setProgress]           = useState(0)
  const [done, setDone]                   = useState(false)

  useEffect(() => {
    let elapsed = 0

    STEPS.forEach((step, index) => {
      // Step becomes active
      const startTimer = setTimeout(() => {
        setActiveStep(index)
      }, elapsed)

      elapsed += step.duration

      // Step completes
      const endTimer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, step.id])
        setProgress(Math.round(((index + 1) / STEPS.length) * 100))
      }, elapsed)

      return () => {
        clearTimeout(startTimer)
        clearTimeout(endTimer)
      }
    })

    // All done — brief pause then advance
    const doneTimer = setTimeout(() => {
      setDone(true)
      setTimeout(() => onComplete(), 700)
    }, TOTAL_DURATION + 400)

    return () => clearTimeout(doneTimer)
  }, [])

  return (
    <div className="flex flex-col h-full bg-hcsg-navy relative overflow-hidden">

      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial glow — pulses while processing */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-96 h-96 rounded-full ${done ? 'opacity-10' : 'animate-glow-pulse'}`}
          style={{ background: 'radial-gradient(circle, #e65e25 0%, transparent 70%)' }}
        />
      </div>

      {/* HCSG logo watermark — top center */}
      <div className="relative flex justify-center pt-10 pb-2">
        <img
          src="https://www.hoistcrane.com/wp-content/uploads/2025/09/Hoist-and-Crane-Logo.svg"
          alt="HCSG"
          className="h-7 brightness-0 invert opacity-30"
        />
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-8 gap-8">

        {/* Spinner / done icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-hcsg-orange/30 bg-hcsg-orange/10">
          {done ? (
            <CheckCircle size={36} className="text-green-400 animate-fade-in" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Spinning ring */}
              <svg className="animate-spin w-10 h-10" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="white" strokeOpacity="0.1" strokeWidth="3" />
                <path
                  d="M20 4 A16 16 0 0 1 36 20"
                  stroke="#e65e25"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <FileText size={16} className="absolute text-hcsg-orange" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="text-white font-bold text-xl">
            {done ? 'Analysis Complete' : 'AI Analysing Fault'}
          </h2>
          <p className="text-white/40 text-sm mt-1">
            {done ? '3 predictions generated' : `${woId ?? 'WO'} · Scanning knowledge base`}
          </p>
        </div>

        {/* Step list */}
        <div className="w-full space-y-3">
          {STEPS.map((step, index) => {
            const isComplete = completedSteps.includes(step.id)
            const isActive   = activeStep === index && !isComplete

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  index > activeStep && !isComplete ? 'opacity-20' : 'opacity-100'
                }`}
              >
                {/* Status icon */}
                <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                  {isComplete ? (
                    <CheckCircle size={18} className="text-green-400" />
                  ) : isActive ? (
                    <Loader size={16} className="text-hcsg-orange animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/20" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm ${isComplete ? 'text-white/60' : isActive ? 'text-white font-medium' : 'text-white/30'}`}>
                  {step.label}
                </span>

                {/* Pulsing dots for active step 2 (document search) */}
                {isActive && step.id === 2 && (
                  <div className="flex gap-1 ml-auto">
                    {[0, 1, 2, 3].map(i => (
                      <FileText
                        key={i}
                        size={12}
                        className="text-hcsg-orange"
                        style={{ animationDelay: `${i * 150}ms`, animation: 'pulse 0.8s ease-in-out infinite' }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative px-8 pb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/30 text-xs">Scanning knowledge base</span>
          <span className="text-hcsg-orange text-xs font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-hcsg-orange rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Footer items animate in as steps complete */}
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {completedSteps.includes(2) && (
            <span className="text-white/30 text-xs animate-slide-in">4 manuals</span>
          )}
          {completedSteps.includes(3) && (
            <>
              <span className="text-white/15 text-xs">·</span>
              <span className="text-white/30 text-xs animate-slide-in">487 hrs service history</span>
            </>
          )}
          {completedSteps.includes(4) && (
            <>
              <span className="text-white/15 text-xs">·</span>
              <span className="text-white/30 text-xs animate-slide-in">fault pattern library</span>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
