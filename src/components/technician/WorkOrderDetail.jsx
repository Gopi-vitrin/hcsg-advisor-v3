import { ArrowLeft, MapPin, Clock, Zap, ChevronRight, AlertTriangle, ClipboardList, MessageSquare } from 'lucide-react'
import { getWO } from '../../data'

const PRIORITY_STYLES = {
  High:   'bg-hcsg-dark-red text-white',
  Medium: 'bg-hcsg-amber text-hcsg-navy',
}

export default function WorkOrderDetail({ woId, onBack, onGetDiagnosis, onViewHistory, onRecordFindings, onAskQuestion }) {
  const wo = getWO(woId)
  if (!wo) return null

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
        <span className="text-white font-mono font-semibold text-base flex-1">{wo.id}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${PRIORITY_STYLES[wo.priority]}`}>
          {wo.priority.toUpperCase()}
        </span>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-hcsg-orange/20 text-hcsg-orange border border-hcsg-orange/30">
          {wo.jobType.split(' ')[0].toUpperCase()}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Customer block */}
        <div>
          <h1 className="text-white text-xl font-bold leading-tight">{wo.customer}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className="flex items-center gap-1.5 text-white/50 text-sm">
              <MapPin size={13} className="text-hcsg-orange" />
              {wo.site}
            </span>
            <span className="flex items-center gap-1.5 text-white/50 text-sm">
              <Clock size={13} className="text-hcsg-orange" />
              {wo.scheduledDate}
            </span>
          </div>
        </div>

        {/* Equipment card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Equipment</p>
          <p className="text-white font-semibold text-base leading-snug">{wo.equipment}</p>
          <p className="text-white/40 text-xs font-mono mt-1">S/N: {wo.serialNumber}</p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/8">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{wo.hoursOnUnit.toLocaleString()}</p>
              <p className="text-white/40 text-xs">Hours on unit</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-white font-semibold text-sm">Last service</p>
              <p className="text-white/50 text-xs">{wo.lastService}</p>
            </div>
          </div>
        </div>

        {/* Complaint block */}
        <div className="rounded-2xl overflow-hidden">
          <div className="bg-white/5 border border-white/10 border-l-4 border-l-hcsg-orange rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-hcsg-orange" />
              <p className="text-white/40 text-xs uppercase tracking-widest">Reported fault</p>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">"{wo.complaint}"</p>
          </div>
        </div>

        {/* Job type row */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
          <span className="text-white/40 text-xs uppercase tracking-widest">Job type</span>
          <span className="text-white text-sm font-semibold">{wo.jobType}</span>
        </div>

      </div>

      {/* Sticky CTA */}
      <div className="px-4 pb-6 pt-3 border-t border-white/10 space-y-3">

        {wo.aiReady ? (
          /* AI-supported WO — full diagnosis flow */
          <>
            <button
              onClick={onGetDiagnosis}
              className="w-full flex items-center justify-center gap-3 bg-hcsg-orange hover:bg-hcsg-light-orange active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-hcsg-orange/25"
            >
              <Zap size={20} fill="currentColor" />
              Get AI Diagnosis
            </button>

            <button
              onClick={onRecordFindings}
              className="w-full flex items-center justify-center gap-2 bg-white/8 border border-white/15 text-white/75 font-semibold text-sm py-3.5 rounded-2xl active:bg-white/15 active:scale-[0.98] transition-all duration-150"
            >
              <ClipboardList size={16} />
              Skip AI — Record Findings
            </button>
            <button
              onClick={onViewHistory}
              className="w-full flex items-center justify-center gap-1 text-white/30 text-xs py-1 active:text-white/50 transition-colors"
            >
              View Equipment History <ChevronRight size={11} />
            </button>
          </>
        ) : (
          /* Manually-created WO — direct path */
          <>
            <button
              onClick={onRecordFindings}
              className="w-full flex items-center justify-center gap-3 bg-hcsg-orange hover:bg-hcsg-light-orange active:scale-[0.98] text-white font-bold text-base py-4 rounded-2xl transition-all duration-150 shadow-lg shadow-hcsg-orange/25"
            >
              <ClipboardList size={20} />
              Record Findings
            </button>

            <button
              onClick={onAskQuestion}
              className="w-full flex items-center justify-center gap-2 text-white/45 text-sm py-2 active:text-white/70 transition-colors"
            >
              <MessageSquare size={14} />
              Ask AI Assistant
            </button>
          </>
        )}

      </div>

    </div>
  )
}
