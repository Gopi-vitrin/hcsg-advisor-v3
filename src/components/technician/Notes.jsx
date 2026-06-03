import { useState } from 'react'
import { ArrowLeft, CheckCircle, XCircle, ClipboardList, Package, FileText, AlertTriangle, Send } from 'lucide-react'
import { WORK_ORDERS, ADMIN } from '../../data'

export default function Notes({ woId, onBack, onComplete }) {
  const wo = WORK_ORDERS[woId]

  const [faultConfirmed,   setFaultConfirmed]   = useState(true)
  const [partsUsed,        setPartsUsed]        = useState(wo?.parts ?? '')
  const [notes,            setNotes]            = useState(wo?.defaultNote ?? '')
  const [showEscalateModal, setShowEscalateModal] = useState(false)
  if (!wo) return null

  function handleComplete() {
    onComplete({ faultConfirmed, partsUsed, notes })
  }

  function handleEscalateClick() {
    setFaultConfirmed(false)
    setShowEscalateModal(true)
  }

  return (
    <div className="relative flex flex-col h-full bg-hcsg-navy">

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
              onClick={handleEscalateClick}
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

      {/* Escalation modal */}
      {showEscalateModal && (
        <div className="absolute inset-0 bg-hcsg-navy/90 backdrop-blur-sm flex flex-col items-center justify-center px-6 z-50 animate-fade-in">
          <div className="w-full bg-hcsg-navy border border-white/15 rounded-3xl overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="bg-hcsg-dark-red/20 border-b border-hcsg-dark-red/30 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-hcsg-dark-red/30 border border-hcsg-dark-red/40 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Escalation Sent</p>
                <p className="text-red-400/70 text-xs">Unable to confirm fault on-site</p>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">

              {/* Sent to */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {ADMIN.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{ADMIN.name}</p>
                  <p className="text-white/40 text-xs">{ADMIN.role} · {ADMIN.branch}</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 bg-green-500/15 border border-green-500/25 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-medium">Notified</span>
                </div>
              </div>

              {/* Teams notification */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 bg-white/3 border border-white/8 rounded-xl">
                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#6264A7' }}>
                  <Send size={10} className="text-white" />
                </div>
                <p className="text-white/50 text-xs leading-relaxed">
                  Escalation details sent via Microsoft Teams. {ADMIN.name} has been notified with WO details and AI predictions.
                </p>
              </div>

              {/* WO summary */}
              <div className="px-4 py-3 bg-white/3 border border-white/8 rounded-xl space-y-1">
                <p className="text-white/25 text-xs uppercase tracking-widest">Work Order</p>
                <p className="text-white/70 text-xs font-mono">{woId} · {wo.customer}</p>
                <p className="text-white/40 text-xs">{wo.equipment.split('—')[0].trim()}</p>
              </div>

            </div>

            {/* CTA */}
            <div className="px-5 pb-5">
              <button
                onClick={() => { setShowEscalateModal(false); handleComplete() }}
                className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/15 active:scale-[0.98] text-white font-semibold text-sm py-3.5 rounded-2xl transition-all duration-150"
              >
                Done — Return to Work Orders
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
