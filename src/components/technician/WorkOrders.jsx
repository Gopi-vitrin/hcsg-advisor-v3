import { MapPin, Clock, ChevronRight, Search, MessageSquare, User, Briefcase, Plus, Calendar } from 'lucide-react'
import { TECHNICIAN, WORK_ORDERS } from '../../data'

const STATUS_STYLES = {
  'In Progress': 'bg-hcsg-orange/20 text-hcsg-orange border border-hcsg-orange/30',
  'Scheduled':   'bg-white/10 text-white/60 border border-white/10',
}

const PRIORITY_STYLES = {
  'High':   'bg-hcsg-dark-red text-white',
  'Medium': 'bg-hcsg-amber text-hcsg-navy',
}

function WorkOrderCard({ wo, onTap, isHero }) {
  return (
    <button
      onClick={() => onTap(wo.id)}
      className={`w-full text-left rounded-2xl p-4 transition-all duration-150 active:scale-[0.98] ${
        isHero
          ? 'bg-white/10 border border-hcsg-orange/40 shadow-lg shadow-hcsg-orange/10'
          : 'bg-white/5 border border-white/8'
      }`}
    >
      {/* Row 1 — WO number + date/time + priority */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-white/40 text-xs font-mono">{wo.id}</span>
          {isHero && (
            <span className="text-hcsg-orange text-xs font-semibold">● NOW</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-white/40 text-xs">
            <Clock size={10} />
            {wo.scheduledDate}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[wo.priority]}`}>
            {wo.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Row 2 — Customer */}
      <p className={`font-bold text-base leading-tight ${isHero ? 'text-white' : 'text-white/80'}`}>
        {wo.customer}
      </p>

      {/* Row 3 — Site only */}
      <div className="flex items-center gap-1 mt-1 mb-2">
        <MapPin size={11} className="text-white/40" />
        <span className="text-white/40 text-xs">{wo.site}</span>
      </div>

      {/* Row 4 — Equipment */}
      <p className="text-white/50 text-xs mb-2 leading-snug">{wo.equipment}</p>

      {/* Row 5 — Complaint + status */}
      <div className="flex items-end justify-between gap-2">
        <p className="text-white/35 text-xs leading-snug line-clamp-1 flex-1">
          {wo.complaint}
        </p>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[wo.status]}`}>
            {wo.status}
          </span>
          <ChevronRight size={14} className="text-white/25" />
        </div>
      </div>
    </button>
  )
}

export default function WorkOrders({ onSelectWO, onNavigate, onNewWO, localWOs = [], activeTab = 'jobs' }) {
  const dispatched = TECHNICIAN.workOrders.map(id => WORK_ORDERS[id]).filter(Boolean)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <img
          src="/assets/hcsg-logo.svg"
          alt="HCSG"
          className="h-6 brightness-0 invert"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={onNewWO}
            className="flex items-center gap-1.5 bg-hcsg-orange/15 border border-hcsg-orange/30 text-hcsg-orange text-xs font-semibold px-3 py-1.5 rounded-full active:bg-hcsg-orange/25 transition-colors"
          >
            <Plus size={13} />
            New WO
          </button>
          <div className="w-8 h-8 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-xs font-bold">
            {TECHNICIAN.avatar}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-white text-xl font-bold">Your Work Orders</h1>
        <p className="text-white/40 text-sm mt-0.5">{today}</p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {dispatched.map((wo) => (
          <WorkOrderCard
            key={wo.id}
            wo={wo}
            onTap={onSelectWO}
            isHero={wo.id === 'WO-2847'}
          />
        ))}

        {/* Locally created WOs */}
        {localWOs.length > 0 && (
          <>
            <p className="text-white/25 text-xs uppercase tracking-widest pt-2 px-1">Added by you</p>
            {localWOs.map((wo) => (
              <WorkOrderCard key={wo.id} wo={wo} onTap={onSelectWO} isHero={false} />
            ))}
          </>
        )}
      </div>

      {/* Bottom nav */}
      <div className="border-t border-white/10 bg-hcsg-navy px-2 pb-5 pt-2">
        <div className="flex items-center justify-around">
          <NavItem icon={<Briefcase size={20} />} label="Jobs"    active={activeTab === 'jobs'}    onClick={() => onNavigate?.('jobs')} />
          <NavItem icon={<Search size={20} />}    label="Search"  active={activeTab === 'search'}  onClick={() => onNavigate?.('search')} />
          <NavItem icon={<MessageSquare size={20} />} label="Chat" active={activeTab === 'chat'}  onClick={() => onNavigate?.('chat')} />
          <NavItem icon={<User size={20} />}      label="Profile" active={activeTab === 'profile'} onClick={() => onNavigate?.('profile')} />
        </div>
      </div>

    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${active ? 'text-hcsg-orange' : 'text-white/30 active:text-white/60'}`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
