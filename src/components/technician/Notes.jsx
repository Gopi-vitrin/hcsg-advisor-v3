import { useState } from 'react'
import { ArrowLeft, CheckCircle, XCircle, ClipboardList, Package, FileText } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

export default function Notes({ woId, onBack, onComplete }) {
  const wo = WORK_ORDERS[woId]

  const [faultConfirmed, setFaultConfirmed] = useState(true)
  const [partsUsed,      setPartsUsed]      = useState(wo.parts)
  const [notes,          setNotes]          = useState('')

  function handleComplete() {
    onComplete({ faultConfirmed, partsUsed, notes })
  }

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
          <p className="text-white font-semibold text-sm">Record Findings</p>
          <p className="text-white/40 text-xs">{woId} · {wo.customer}</p>
        </div>
        <ClipboardList size={18} className="text-white/30" />
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">

        {/* Fault confirmed toggle */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Fault Confirmed?</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFaultConfirmed(true)}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                faultConfirmed
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                  : 'bg-white/5 border border-white/10 text-white/40 active:bg-white/10'
              }`}
            >
              <CheckCircle size={16} />
              Yes — Confirmed
            </button>
            <button
              onClick={() => setFaultConfirmed(false)}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                !faultConfirmed
                  ? 'bg-hcsg-dark-red/20 border border-hcsg-dark-red/40 text-red-400'
                  : 'bg-white/5 border border-white/10 text-white/40 active:bg-white/10'
              }`}
            >
              <XCircle size={16} />
              No — Escalate
            </button>
          </div>
        </div>

        {/* Parts used */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Parts Used</p>
          <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Package size={15} className="text-hcsg-orange mt-0.5 shrink-0" />
            <input
              type="text"
              value={partsUsed}
              onChange={e => setPartsUsed(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
              placeholder="Enter part number or description"
            />
          </div>
        </div>

        {/* Equipment info — read only reference */}
        <div className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 space-y-1">
          <p className="text-white/25 text-xs uppercase tracking-widest">Equipment</p>
          <p className="text-white/60 text-xs">{wo.equipment}</p>
          <p className="text-white/35 text-xs font-mono">S/N {wo.serialNumber}</p>
        </div>

        {/* Notes textarea */}
        <div>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Field Notes</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Describe findings, measurements, observations..."
              className="w-full bg-transparent text-white text-sm leading-relaxed outline-none resize-none placeholder:text-white/25"
            />
          </div>
          <p className="text-white/20 text-xs mt-1.5 text-right">
            {notes.length > 0 ? `${notes.length} chars` : 'Optional'}
          </p>
        </div>

        {/* OSHA reminder */}
        <div className="flex items-start gap-2.5 px-4 py-3 bg-white/3 border border-white/8 rounded-xl">
          <FileText size={13} className="text-white/25 mt-0.5 shrink-0" />
          <p className="text-white/25 text-xs leading-relaxed">
            OSHA requires a written, dated, and signed inspection report. This record will be submitted automatically.
          </p>
        </div>

      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10">
        <button
          onClick={handleComplete}
          className="w-full flex items-center justify-center gap-2 bg-hcsg-orange hover:bg-hcsg-light-orange active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-hcsg-orange/25"
        >
          <CheckCircle size={18} />
          Complete Work Order
        </button>
      </div>

    </div>
  )
}
