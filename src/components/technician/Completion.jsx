import { CheckCircle, MapPin, Package, Clock, ArrowRight } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

export default function Completion({ woId, findings, onReturn }) {
  const wo = WORK_ORDERS[woId]

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Green success hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">

        {/* Animated ring + checkmark */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-green-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="w-24 h-24 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center">
            <CheckCircle size={44} className="text-green-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-1">
            Work Order Complete
          </p>
          <h1 className="text-white text-3xl font-bold">{woId}</h1>
          <p className="text-white/50 text-sm mt-1">{wo.customer} · {wo.site}</p>
        </div>

        {/* Summary card */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-4 py-3 border-b border-white/8 flex items-center gap-2">
            <MapPin size={14} className="text-hcsg-orange" />
            <p className="text-white/60 text-sm">{wo.equipment.split('—')[0].trim()}</p>
          </div>

          <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
            <span className="text-white/40 text-xs uppercase tracking-widest">Fault confirmed</span>
            <span className={`text-sm font-semibold ${findings?.faultConfirmed ? 'text-green-400' : 'text-red-400'}`}>
              {findings?.faultConfirmed ? '✓ Yes' : '✗ Escalated'}
            </span>
          </div>

          <div className="px-4 py-3 border-b border-white/8 flex items-start gap-2">
            <Package size={14} className="text-hcsg-orange mt-0.5 shrink-0" />
            <p className="text-white/60 text-sm leading-snug">
              {findings?.partsUsed || wo.parts}
            </p>
          </div>

          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-white/30" />
              <span className="text-white/40 text-xs uppercase tracking-widest">Job time</span>
            </div>
            <span className="text-white/60 text-sm font-semibold">~45 min</span>
          </div>

        </div>

        {/* ROI callout */}
        <div className="w-full bg-green-500/8 border border-green-500/15 rounded-2xl px-4 py-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">First-visit resolution</span>
            <span className="text-green-400 font-semibold">✓ Confirmed</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">AI confidence at close</span>
            <span className="text-green-400 font-semibold">{findings?.faultConfirmed ? '99%' : '—'}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40">Estimated return trip avoided</span>
            <span className="text-green-400 font-semibold">1 callback saved</span>
          </div>
        </div>

        {/* OSHA note */}
        <p className="text-white/25 text-xs text-center leading-relaxed px-4">
          Inspection record submitted. Report signed and dated per OSHA 29 CFR 1910.147.
        </p>

      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10">
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
