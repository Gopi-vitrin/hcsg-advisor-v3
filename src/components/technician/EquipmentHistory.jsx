import { ArrowLeft, Clock, Wrench, CheckCircle, AlertTriangle, Package } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

const TYPE_STYLES = {
  'Routine PM':       { color: 'text-hcsg-blue',   bg: 'bg-hcsg-blue/15 border-hcsg-blue/25',   icon: CheckCircle },
  'Corrective Repair':{ color: 'text-hcsg-amber',  bg: 'bg-hcsg-amber/15 border-hcsg-amber/25', icon: Wrench },
  'Annual Inspection':{ color: 'text-green-400',   bg: 'bg-green-500/15 border-green-500/25',   icon: CheckCircle },
}

export default function EquipmentHistory({ woId, onBack }) {
  const wo = WORK_ORDERS[woId]
  const history = wo.equipmentHistory ?? []

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
          <p className="text-white font-semibold text-sm">Equipment History</p>
          <p className="text-white/40 text-xs truncate">{wo.equipment.split('—')[0].trim()}</p>
        </div>
        <span className="text-white/30 text-xs bg-white/8 px-2.5 py-1 rounded-full">
          S/N {wo.serialNumber}
        </span>
      </div>

      {/* Equipment stat strip */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-white/8 bg-white/3">
        <div className="text-center">
          <p className="text-white font-bold text-base">{wo.hoursOnUnit.toLocaleString()}</p>
          <p className="text-white/35 text-xs">Total hours</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-white font-bold text-base">{history.length}</p>
          <p className="text-white/35 text-xs">Service events</p>
        </div>
        <div className="w-px h-8 bg-white/10" />
        <div className="text-center">
          <p className="text-white font-bold text-base">{wo.lastService.split('—')[0].trim()}</p>
          <p className="text-white/35 text-xs">Last service</p>
        </div>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Service history — most recent first</p>

        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-12 gap-2">
            <Clock size={28} className="text-white/15" />
            <p className="text-white/30 text-sm">No service history recorded</p>
          </div>
        )}

        {history.map((entry, i) => {
          const style = TYPE_STYLES[entry.type] ?? TYPE_STYLES['Routine PM']
          const Icon = style.icon
          return (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-card-in"
              style={{ animationDelay: `${i * 80}ms` }}>

              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.color}`}>
                    <Icon size={11} />
                    {entry.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-white/40 text-xs">{entry.date}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs font-mono">{entry.hours} hrs</span>
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-3 space-y-2">
                <p className="text-white/30 text-xs">Tech: <span className="text-white/60">{entry.tech}</span></p>
                <p className="text-white/70 text-sm leading-relaxed">{entry.findings}</p>
                {entry.partsUsed && entry.partsUsed !== 'None' && (
                  <div className="flex items-start gap-2 pt-1">
                    <Package size={12} className="text-hcsg-orange mt-0.5 shrink-0" />
                    <p className="text-white/40 text-xs">{entry.partsUsed}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Note about current WO */}
        <div className="flex items-start gap-2.5 px-4 py-3 bg-hcsg-orange/8 border border-hcsg-orange/20 rounded-xl mt-2">
          <AlertTriangle size={13} className="text-hcsg-orange mt-0.5 shrink-0" />
          <p className="text-white/50 text-xs leading-relaxed">
            Current fault ({wo.id}): {wo.complaint}
          </p>
        </div>
      </div>
    </div>
  )
}
