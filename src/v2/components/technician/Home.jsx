import { Zap, MapPin, Clock, ChevronRight, Bell, Search, User, Home as HomeIcon } from 'lucide-react'
import { TECHNICIAN, WORK_ORDERS } from '../../data'

// Section header with triple chevron motif
function SectionHeader({ label, color = 'text-hcsg-orange', count }) {
  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <div className="flex items-center gap-2">
        <span className="font-display font-800 text-hcsg-orange text-base leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-1px' }}>›››</span>
        <span className="font-display font-700 tracking-widest uppercase text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: color === 'text-hcsg-orange' ? '#e65e25' : '#f5a524' }}>
          {label}
        </span>
      </div>
      <span className="text-white/30 text-xs font-display" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        {count} JOB{count !== 1 ? 'S' : ''}
      </span>
    </div>
  )
}

function WOCard({ wo, onTap, isUrgent }) {
  const isHigh = wo.priority === 'High'

  return (
    <button
      onClick={() => onTap(wo.id)}
      className={`w-full text-left transition-all duration-150 active:scale-[0.98] ${
        isUrgent
          ? 'border border-hcsg-orange/50 bg-gradient-to-br from-hcsg-orange/10 to-hcsg-navy'
          : 'border border-white/10 bg-white/4'
      }`}
      style={{ borderRadius: 6, borderLeft: isUrgent ? '4px solid #e65e25' : '4px solid transparent' }}
    >
      <div className="px-4 py-3.5">

        {/* Row 1 — WO + badges */}
        <div className="flex items-center justify-between mb-2">
          <span className="font-display font-700 text-white/40 text-xs tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {wo.id}
          </span>
          <div className="flex items-center gap-1.5">
            {wo.aiReady && (
              <span
                className="flex items-center gap-1 px-2 py-0.5 text-xs font-display font-700 tracking-wider"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#13612e22', border: '1px solid #13612e44', color: '#13612e', borderRadius: 3 }}
              >
                <Zap size={9} fill="currentColor" />
                AI READY
              </span>
            )}
            <span
              className="px-2 py-0.5 text-xs font-display font-800 tracking-widest"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: isHigh ? '#b82105' : '#f5a524',
                color: isHigh ? 'white' : '#011e41',
                borderRadius: 3,
              }}
            >
              {wo.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Row 2 — Customer */}
        <p
          className="font-display font-800 text-white leading-tight mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, letterSpacing: '-0.3px' }}
        >
          {wo.customer.toUpperCase()}
        </p>

        {/* Row 3 — Site + time */}
        <div className="flex items-center gap-4 mb-2.5">
          <span className="flex items-center gap-1 text-white/45 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>
            <MapPin size={11} className="text-hcsg-orange" />
            {wo.site}
          </span>
          <span className="flex items-center gap-1 text-white/45 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>
            <Clock size={11} className="text-hcsg-orange" />
            {wo.scheduledDate}
          </span>
        </div>

        {/* Row 4 — Equipment + status */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-white/35 text-xs truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {wo.equipment.split('—')[0].trim()}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span
              className="text-xs font-display font-700 tracking-wider px-2 py-0.5"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                color: wo.status === 'In Progress' ? '#e65e25' : '#ffffff60',
                border: `1px solid ${wo.status === 'In Progress' ? '#e65e2540' : '#ffffff15'}`,
                borderRadius: 3,
              }}
            >
              {wo.status.toUpperCase()}
            </span>
            <ChevronRight size={13} className="text-white/20" />
          </div>
        </div>
      </div>
    </button>
  )
}

function BottomNav({ active, onNavigate }) {
  const items = [
    { key: 'home',   label: 'HOME',   icon: HomeIcon },
    { key: 'active', label: 'ACTIVE', icon: Zap      },
    { key: 'search', label: 'SEARCH', icon: Search   },
    { key: 'me',     label: 'ME',     icon: User     },
  ]
  return (
    <div className="v2-bottom-nav border-t border-white/10 bg-hcsg-navy px-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-around">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onNavigate(key)}
            className="v2-touch flex flex-col items-center gap-1 px-4 transition-colors flex-1"
          >
            <Icon size={18} color={active === key ? '#e65e25' : 'rgba(255,255,255,0.25)'} />
            <span
              className="font-display font-700 tracking-widest"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 9,
                letterSpacing: '0.12em',
                color: active === key ? '#e65e25' : 'rgba(255,255,255,0.25)',
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home({ onSelectWO, onNavigate, activeTab = 'home' }) {
  const allOrders = TECHNICIAN.workOrders.map(id => WORK_ORDERS[id]).filter(Boolean)
  const emergency = allOrders.filter(w => w.urgency === 'emergency')
  const scheduled = allOrders.filter(w => w.urgency === 'scheduled')
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()

  return (
    <div className="flex flex-col h-full bg-hcsg-bg">

      {/* Header */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-3">
          <img src="/assets/hcsg-logo.svg" alt="HCSG" className="h-6 brightness-0 invert" />
        </div>
        <div className="flex items-center gap-2.5">
          <span
            className="font-display font-600 text-white/30 text-xs tracking-widest uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {today}
          </span>
          <button className="w-8 h-8 flex items-center justify-center" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <Bell size={14} className="text-white/40" />
          </button>
          <div
            className="w-8 h-8 flex items-center justify-center bg-hcsg-orange"
            style={{ borderRadius: 4 }}
          >
            <span className="font-display font-800 text-white text-xs" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              {TECHNICIAN.avatar}
            </span>
          </div>
        </div>
      </div>

      {/* Page title */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-baseline gap-2">
          <h1
            className="font-display font-800 text-white leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, letterSpacing: '-0.5px' }}
          >
            WORK ORDERS
          </h1>
          <span
            className="font-display font-700 text-hcsg-orange text-base"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            · {allOrders.length} ASSIGNED
          </span>
        </div>
        <p className="text-white/30 text-xs mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {TECHNICIAN.name} · {TECHNICIAN.branch}
        </p>
      </div>

      {/* Scrollable work order groups */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-5 v2-scroll">

        {/* Emergency group */}
        {emergency.length > 0 && (
          <div>
            <SectionHeader label="TODAY — EMERGENCY" count={emergency.length} />
            <div className="space-y-2">
              {emergency.map(wo => (
                <WOCard key={wo.id} wo={wo} onTap={onSelectWO} isUrgent />
              ))}
            </div>
          </div>
        )}

        {/* Scheduled group */}
        {scheduled.length > 0 && (
          <div>
            <SectionHeader label="UPCOMING — SCHEDULED" color="text-hcsg-amber" count={scheduled.length} />
            <div className="space-y-2">
              {scheduled.map(wo => (
                <WOCard key={wo.id} wo={wo} onTap={onSelectWO} isUrgent={false} />
              ))}
            </div>
          </div>
        )}

        {/* Shift info bar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}
        >
          <div>
            <p className="font-display font-700 text-white/30 text-xs tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              SHIFT
            </p>
            <p className="text-white/50 text-xs mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
              07:00 – 15:30 · Gulf Coast Region
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" />
            <span className="font-display font-700 text-hcsg-green/70 text-xs tracking-widest uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              ON SHIFT
            </span>
          </div>
        </div>
      </div>

      <BottomNav active={activeTab} onNavigate={onNavigate} />
    </div>
  )
}
