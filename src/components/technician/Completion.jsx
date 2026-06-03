import { CheckCircle, ArrowRight, Zap, Send, FileCheck } from 'lucide-react'
import { getWO, ADMIN } from '../../data'

export default function Completion({ woId, findings, finalConfidence, onReturn }) {
  const wo = getWO(woId)
  if (!wo) return null

  const topPrediction  = wo.predictions[0]
  const confirmed      = findings?.faultConfirmed
  const aiWasRight     = confirmed  // top prediction confirmed on-site

  return (
    <div className="flex flex-col h-full bg-hcsg-navy overflow-y-auto">
      <div className="flex flex-col items-center px-5 pt-8 pb-6 gap-5">

        {/* Hero */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full border-2 border-green-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center">
            <CheckCircle size={38} className="text-green-400" strokeWidth={1.5} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Work Order Complete
          </p>
          <h1 className="text-white text-2xl font-bold">{woId}</h1>
          <p className="text-white/45 text-sm mt-0.5">{wo.customer} · {wo.site}</p>
        </div>

        {/* ── Resolution Loop ── */}
        <div className="w-full rounded-2xl overflow-hidden border border-white/12 bg-white/4">

          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/8">
            <Zap size={12} className="text-hcsg-orange" fill="currentColor" />
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Resolution Loop</p>
          </div>

          {/* AI predicted → Tech outcome */}
          {topPrediction ? (
            <div className="grid grid-cols-2 divide-x divide-white/8">

              {/* Left: AI prediction */}
              <div className="px-4 py-3 space-y-1">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1.5">AI Predicted</p>
                <p className="text-white/80 text-xs font-medium leading-snug">{topPrediction.fault}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="h-1 w-10 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${topPrediction.confidence}%` }} />
                  </div>
                  <span className="text-white/35 text-xs">{topPrediction.confidence}%</span>
                  <span className="text-white/20 text-xs">→</span>
                  <span className={`text-xs font-bold ${confirmed ? 'text-green-400' : 'text-hcsg-amber'}`}>
                    {finalConfidence ?? (confirmed ? 99 : '—')}%
                  </span>
                </div>
              </div>

              {/* Right: Tech outcome */}
              <div className="px-4 py-3 space-y-1">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1.5">Tech Outcome</p>
                {confirmed ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={12} className="text-green-400 shrink-0" />
                      <p className="text-green-400 text-xs font-semibold">Confirmed on-site</p>
                    </div>
                    <p className="text-white/50 text-xs leading-snug mt-1">
                      {findings?.partsUsed || wo.parts}
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-hcsg-amber text-xs font-semibold">⚠ Escalated</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* No AI prediction — manually created WO */
            <div className="px-4 py-3 space-y-1">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-1.5">Tech Outcome</p>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-green-400 shrink-0" />
                <p className="text-green-400 text-xs font-semibold">
                  {confirmed ? 'Documented on-site' : 'Escalated'}
                </p>
              </div>
              {findings?.partsUsed && (
                <p className="text-white/50 text-xs leading-snug mt-1">{findings.partsUsed}</p>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/8" />

          {/* Submitted to */}
          <div className="px-4 py-3 space-y-2">
            <p className="text-white/30 text-xs uppercase tracking-widest">Submitted To</p>

            {/* Service manager */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
                {ADMIN.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/75 text-xs font-semibold">{ADMIN.name}</p>
                <p className="text-white/35 text-xs">{ADMIN.role} · {ADMIN.branch}</p>
              </div>
              <div className="flex items-center gap-1 bg-white/8 px-2 py-1 rounded-lg shrink-0">
                <div className="w-3 h-3 rounded flex items-center justify-center" style={{ background: '#6264A7' }}>
                  <Send size={6} className="text-white" />
                </div>
                <span className="text-white/40 text-xs">Teams</span>
              </div>
            </div>

            {/* OSHA record */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center shrink-0">
                <FileCheck size={13} className="text-white/40" />
              </div>
              <p className="text-white/35 text-xs leading-snug flex-1">
                Inspection record filed · OSHA 29 CFR 1910.147 · {wo.jobTime}
              </p>
            </div>
          </div>
        </div>

        {/* ROI strip */}
        <div className={`w-full rounded-2xl px-4 py-3 grid grid-cols-3 gap-2 text-center ${
          confirmed ? 'bg-green-500/8 border border-green-500/15' : 'bg-hcsg-amber/8 border border-hcsg-amber/15'
        }`}>
          <div>
            <p className={`text-sm font-bold ${confirmed ? 'text-green-400' : 'text-hcsg-amber'}`}>
              {confirmed ? '✓' : '⚠'}
            </p>
            <p className="text-white/35 text-xs mt-0.5">
              {confirmed ? 'First-visit fix' : 'Escalated'}
            </p>
          </div>
          <div>
            <p className={`text-sm font-bold ${confirmed ? 'text-green-400' : 'text-white/35'}`}>
              {confirmed ? `${finalConfidence ?? 99}%` : '—'}
            </p>
            <p className="text-white/35 text-xs mt-0.5">AI confidence</p>
          </div>
          <div>
            <p className={`text-sm font-bold ${confirmed ? 'text-green-400' : 'text-white/35'}`}>
              {confirmed ? '1 saved' : 'Pending'}
            </p>
            <p className="text-white/35 text-xs mt-0.5">Callback</p>
          </div>
        </div>

      </div>

      {/* CTA — sticky at bottom */}
      <div className="px-5 pb-6 pt-3 border-t border-white/10 mt-auto">
        <button
          onClick={onReturn}
          className="w-full flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 active:scale-[0.98] border border-white/15 text-white font-semibold text-base py-4 rounded-2xl transition-all duration-150"
        >
          Return to Work Orders
          <ArrowRight size={18} />
        </button>
      </div>

    </div>
  )
}
