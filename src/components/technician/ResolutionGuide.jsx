import { useState } from 'react'
import { ArrowLeft, CheckCircle, Circle, AlertTriangle, ShieldAlert, Package, BookOpen, ClipboardList } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

function StepCard({ step, completed, onToggle }) {
  const isLoto     = step.isLoto
  const isSafety   = step.isSafety && !step.isLoto

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-2xl overflow-hidden border transition-all duration-200 active:scale-[0.98] ${
        isLoto
          ? completed
            ? 'border-red-800/40 bg-hcsg-dark-red/10'
            : 'border-hcsg-dark-red/50 bg-hcsg-dark-red/20'
          : isSafety
          ? completed
            ? 'border-white/8 bg-white/3'
            : 'border-hcsg-orange/30 bg-hcsg-orange/5'
          : completed
          ? 'border-white/8 bg-white/3'
          : 'border-white/10 bg-white/5'
      }`}
    >
      <div className={`flex items-start gap-3 p-4 ${
        isSafety && !isLoto ? 'border-l-4 border-l-hcsg-orange' : ''
      } ${
        isLoto ? 'border-l-4 border-l-hcsg-dark-red' : ''
      }`}>

        {/* Step number + check */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
          <span className={`text-xs font-mono font-bold ${
            completed ? 'text-green-400' : isLoto ? 'text-red-400' : 'text-white/30'
          }`}>
            {String(step.step).padStart(2, '0')}
          </span>
          {completed
            ? <CheckCircle size={20} className="text-green-400" />
            : <Circle size={20} className={isLoto ? 'text-red-400/50' : 'text-white/20'} />
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* LOTO label */}
          {isLoto && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldAlert size={13} className="text-red-400 shrink-0" />
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                Lockout / Tagout Required
              </span>
            </div>
          )}

          {/* Safety label */}
          {isSafety && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={13} className="text-hcsg-orange shrink-0" />
              <span className="text-hcsg-orange text-xs font-semibold uppercase tracking-wider">
                Safety Step
              </span>
            </div>
          )}

          {/* Step text */}
          <p className={`text-sm leading-relaxed ${
            completed
              ? 'text-white/35 line-through decoration-white/20'
              : isLoto
              ? 'text-white font-semibold'
              : 'text-white/80'
          }`}>
            {/* Strip the "STEP N —" prefix since we show the number separately */}
            {step.text.replace(/^STEP \d+ — /, '')}
          </p>
        </div>
      </div>
    </button>
  )
}

export default function ResolutionGuide({ woId, onBack, onComplete }) {
  const wo = WORK_ORDERS[woId]
  const steps = wo.resolutionSteps
  const [completed, setCompleted] = useState(new Set())

  function toggleStep(stepNum) {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(stepNum) ? next.delete(stepNum) : next.add(stepNum)
      return next
    })
  }

  const completedCount = completed.size
  const totalSteps     = steps.length
  const progressPct    = Math.round((completedCount / totalSteps) * 100)
  const allDone        = completedCount === totalSteps

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Header */}
      <div className="px-4 pt-4 pb-0 border-b border-white/10">
        <div className="flex items-center gap-3 pb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 active:bg-white/15 transition-colors shrink-0"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm">Resolution Guide</p>
            <p className="text-white/40 text-xs truncate">{wo.faultLabel} · {woId}</p>
          </div>
          {/* Step counter */}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
            allDone
              ? 'bg-green-500/20 text-green-400 border border-green-500/25'
              : 'bg-white/8 text-white/50'
          }`}>
            {completedCount}/{totalSteps}
          </span>
        </div>

        {/* Progress bar — sits flush on the border */}
        <div className="h-1 bg-white/8 -mx-4">
          <div
            className={`h-full transition-all duration-500 ease-out ${allDone ? 'bg-green-500' : 'bg-hcsg-orange'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Scrollable steps */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">

        {/* Source reference */}
        <div className="flex items-center gap-2 px-3 py-2 bg-hcsg-blue/10 border border-hcsg-blue/20 rounded-xl mb-1">
          <BookOpen size={13} className="text-hcsg-blue shrink-0" />
          <p className="text-hcsg-blue text-xs">{wo.sourceRef}</p>
        </div>

        {steps.map((step) => (
          <StepCard
            key={step.step}
            step={step}
            completed={completed.has(step.step)}
            onToggle={() => toggleStep(step.step)}
          />
        ))}

        {/* Parts needed */}
        <div className="flex items-start gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl mt-1">
          <Package size={16} className="text-hcsg-orange mt-0.5 shrink-0" />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Parts needed</p>
            <p className="text-white text-sm font-medium">{wo.parts}</p>
          </div>
        </div>

        {/* All-done message */}
        {allDone && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl animate-fade-in">
            <CheckCircle size={18} className="text-green-400 shrink-0" />
            <p className="text-green-300 text-sm font-medium">All steps complete — ready to document</p>
          </div>
        )}

      </div>

      {/* Sticky CTA */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10">
        <button
          onClick={onComplete}
          className={`w-full flex items-center justify-center gap-2 font-bold text-base py-4 rounded-2xl transition-all duration-300 ${
            allDone
              ? 'bg-hcsg-orange hover:bg-hcsg-light-orange text-white shadow-lg shadow-hcsg-orange/25 active:scale-[0.98]'
              : 'bg-white/8 text-white/50 border border-white/10'
          }`}
        >
          <ClipboardList size={18} />
          Record Findings
        </button>
        {!allDone && (
          <p className="text-white/25 text-xs text-center mt-2">
            {totalSteps - completedCount} step{totalSteps - completedCount !== 1 ? 's' : ''} remaining
          </p>
        )}
      </div>

    </div>
  )
}
