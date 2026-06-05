import { ArrowLeft, QrCode, Camera, Search, CheckCircle, Wrench } from 'lucide-react'

const METHOD_LABELS = {
  text: { icon: Search, label: 'Found by model / serial search', color: 'text-hcsg-orange bg-orange-50' },
  qr: { icon: QrCode, label: 'Identified via QR code scan', color: 'text-hcsg-blue bg-blue-50' },
  photo: { icon: Camera, label: 'Identified via nameplate photo', color: 'text-hcsg-green bg-green-50' },
}

const CATEGORY_COLORS = {
  hoist: 'bg-orange-100 text-hcsg-orange',
  crane: 'bg-blue-100 text-hcsg-blue',
  elevator: 'bg-purple-100 text-purple-700',
  default: 'bg-gray-100 text-gray-600',
}

export default function EquipmentConfirm({ equipment, method, onConfirm, onBack }) {
  if (!equipment) return null

  const methodMeta = METHOD_LABELS[method] || METHOD_LABELS.text
  const MethodIcon = methodMeta.icon
  const categoryColor = CATEGORY_COLORS[equipment.category] || CATEGORY_COLORS.default

  return (
    <div className="bg-hcsg-page rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col" style={{ minHeight: '86vh' }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-hcsg-navy rounded-b-2xl z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-12 pb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-hcsg-light-gray flex items-center justify-center shadow-sm"
        >
          <ArrowLeft size={16} className="text-hcsg-muted" />
        </button>
        <div>
          <div className="text-[10px] text-hcsg-muted tracking-[0.2em]">EQUIPMENT FOUND</div>
          <div className="font-bold text-hcsg-navy text-base">Confirm before proceeding</div>
        </div>
      </div>

      {/* Equipment card */}
      <div className="px-6 mb-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-hcsg-light-gray">
          {/* Visual header */}
          <div className="bg-hcsg-navy/5 border-b border-hcsg-light-gray px-5 py-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-hcsg-navy flex items-center justify-center shadow">
              <Wrench size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-hcsg-navy text-base leading-tight">{equipment.model}</div>
              <div className="text-xs text-hcsg-muted mt-0.5">{equipment.type}</div>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
              {equipment.category}
            </span>
          </div>

          {/* Details */}
          <div className="px-5 py-4 space-y-3">
            <DetailRow label="Serial number" value={equipment.serial} mono />
            <DetailRow label="Capacity" value={equipment.capacity} />
            <DetailRow label="Customer" value={equipment.customer} />
            <DetailRow label="Site" value={equipment.site} />
            <DetailRow label="Manual" value={equipment.manualRef} small />
          </div>
        </div>
      </div>

      {/* Identify method badge */}
      <div className="px-6 mb-6">
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${methodMeta.color}`}>
          <MethodIcon size={14} />
          <span className="text-xs font-medium">{methodMeta.label}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 mt-auto pb-8 space-y-3">
        <p className="text-xs text-center text-hcsg-muted mb-4">
          Is this the right unit? Confirm to open the AI Advisor for this equipment.
        </p>
        <button
          onClick={onConfirm}
          className="w-full bg-hcsg-orange text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-base active:opacity-80 transition-opacity shadow-md"
        >
          <CheckCircle size={18} />
          Yes, open AI Advisor
        </button>
        <button
          onClick={onBack}
          className="w-full bg-transparent text-hcsg-muted font-medium py-3 rounded-2xl text-sm active:bg-hcsg-surface transition-colors"
        >
          Not right — try again
        </button>
      </div>
    </div>
  )
}

function DetailRow({ label, value, mono, small }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-hcsg-muted shrink-0 pt-0.5">{label}</span>
      <span className={`text-right ${small ? 'text-xs' : 'text-sm'} font-medium text-hcsg-navy ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  )
}
