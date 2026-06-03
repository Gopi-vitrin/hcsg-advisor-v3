import { useState, useEffect } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, AlertTriangle, BookOpen, Package, Zap } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

const SEVERITY_STYLES = {
  HIGH:   'bg-hcsg-dark-red/20 text-red-400 border border-hcsg-dark-red/30',
  MEDIUM: 'bg-hcsg-amber/20 text-hcsg-amber border border-hcsg-amber/30',
  LOW:    'bg-white/8 text-white/40 border border-white/10',
}

const CONFIDENCE_COLOR = (score) => {
  if (score >= 75) return { bar: 'bg-green-500', text: 'text-green-400' }
  if (score >= 50) return { bar: 'bg-hcsg-amber', text: 'text-hcsg-amber' }
  return              { bar: 'bg-white/30',        text: 'text-white/40' }
}

function PredictionCard({ prediction, rank, isTop, animDelay }) {
  const [citationOpen, setCitationOpen] = useState(isTop)
  const [warningOpen,  setWarningOpen]  = useState(isTop)
  // Confidence bar animates from 0 → actual value after mount
  const [barWidth, setBarWidth] = useState(0)
  const colors = CONFIDENCE_COLOR(prediction.confidence)

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(prediction.confidence), animDelay + 120)
    return () => clearTimeout(t)
  }, [prediction.confidence, animDelay])

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all animate-card-in ${
        isTop ? 'border-hcsg-orange/30 bg-hcsg-orange/5' : 'border-white/8 bg-white/4'
      }`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Card header */}
      <div className="p-4 pb-3">

        {/* Row 1 — rank + severity + confidence */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              isTop ? 'bg-hcsg-orange text-white' : 'bg-white/10 text-white/50'
            }`}>
              {rank}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${SEVERITY_STYLES[prediction.severity]}`}>
              {prediction.severity}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${colors.text}`}>
              {prediction.confidence}%
            </span>
            {/* Confidence bar — animates from 0 on mount */}
            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fault name */}
        <p className={`font-semibold text-sm leading-snug ${isTop ? 'text-white' : 'text-white/80'}`}>
          {prediction.fault}
        </p>

        {/* Part recommendation */}
        {prediction.part && (
          <div className="flex items-start gap-2 mt-2">
            <Package size={13} className="text-hcsg-orange mt-0.5 shrink-0" />
            <p className="text-white/50 text-xs leading-snug">{prediction.part}</p>
          </div>
        )}
      </div>

      {/* Source citation — collapsible */}
      <div className="border-t border-white/8">
        <button
          onClick={() => setCitationOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-left active:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={13} className="text-hcsg-blue" />
            <span className="text-hcsg-blue text-xs font-medium truncate max-w-[220px]">
              {prediction.source.split(',')[0]}
            </span>
          </div>
          {citationOpen
            ? <ChevronUp size={14} className="text-white/30 shrink-0" />
            : <ChevronDown size={14} className="text-white/30 shrink-0" />
          }
        </button>

        {citationOpen && (
          <div className="px-4 pb-3 animate-fade-in">
            <p className="text-white/40 text-xs leading-relaxed italic border-l-2 border-hcsg-blue/40 pl-3">
              {prediction.citation}
            </p>
            <p className="text-white/25 text-xs mt-1.5">{prediction.source}</p>
          </div>
        )}
      </div>

      {/* Safety warning — collapsible */}
      {prediction.safetyWarning && (
        <div className="border-t border-white/8">
          <button
            onClick={() => setWarningOpen(v => !v)}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
              warningOpen ? 'bg-hcsg-dark-red/15' : 'active:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={13} className="text-red-400 shrink-0" />
              <span className="text-red-400 text-xs font-semibold">Safety Warning</span>
            </div>
            {warningOpen
              ? <ChevronUp size={14} className="text-red-400/50 shrink-0" />
              : <ChevronDown size={14} className="text-white/30 shrink-0" />
            }
          </button>

          {warningOpen && (
            <div className="px-4 pb-3 bg-hcsg-dark-red/10 animate-fade-in">
              <p className="text-red-300 text-xs leading-relaxed">
                {prediction.safetyWarning}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function PredictionsPanel({ woId, onBack, onStartTroubleshooting, onAskQuestion }) {
  const wo = WORK_ORDERS[woId]
  const topConfidence = wo.predictions[0].confidence

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 active:bg-white/15 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">AI Diagnosis</p>
          <p className="text-white/40 text-xs">{woId} · {wo.equipment.split('—')[0].trim()}</p>
        </div>
        {/* Badge pulses once on entry */}
        <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/25 px-2.5 py-1 rounded-full animate-badge-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="text-green-400 text-xs font-semibold">{topConfidence}% match</span>
        </div>
      </div>

      {/* Scrollable predictions */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-1">
          Ranked predictions · 3 found
        </p>
        {/* Cards stagger in: 0ms, 120ms, 240ms */}
        {wo.predictions.map((prediction, index) => (
          <PredictionCard
            key={prediction.rank}
            prediction={prediction}
            rank={prediction.rank}
            isTop={index === 0}
            animDelay={index * 120}
          />
        ))}
      </div>

      {/* Sticky CTAs */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10 space-y-3">
        <button
          onClick={onStartTroubleshooting}
          className="w-full flex items-center justify-center gap-2 bg-hcsg-orange hover:bg-hcsg-light-orange active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-hcsg-orange/25"
        >
          <Zap size={18} fill="currentColor" />
          Start Troubleshooting
        </button>
        <button
          onClick={onAskQuestion}
          className="w-full text-hcsg-blue text-sm font-medium py-2 active:opacity-70 transition-opacity"
        >
          Ask a Question
        </button>
      </div>

    </div>
  )
}
