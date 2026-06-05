import { useState } from 'react'
import { ArrowLeft, Bell, LogOut, User, Phone, Mail, ChevronRight } from 'lucide-react'
import { LOGGED_IN_TECH } from '../../data'

export default function TechSettings({ onBack, onSignOut }) {
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="bg-hcsg-page rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col" style={{ minHeight: '86vh' }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-hcsg-navy rounded-b-2xl z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-12 pb-5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-hcsg-light-gray flex items-center justify-center shadow-sm shrink-0"
        >
          <ArrowLeft size={16} className="text-hcsg-muted" />
        </button>
        <div>
          <div className="text-[10px] text-hcsg-muted tracking-[0.2em]">ACCOUNT</div>
          <div className="font-black text-hcsg-navy text-lg">Settings</div>
        </div>
      </div>

      {/* Profile card */}
      <div className="px-6 mb-5">
        <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-hcsg-light-gray flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-hcsg-orange text-white font-black text-lg flex items-center justify-center shrink-0">
            {LOGGED_IN_TECH.avatar}
          </div>
          <div>
            <div className="font-bold text-hcsg-navy">{LOGGED_IN_TECH.name}</div>
            <div className="text-xs text-hcsg-muted">{LOGGED_IN_TECH.role}</div>
            <div className="text-xs text-hcsg-muted">{LOGGED_IN_TECH.branch}</div>
          </div>
        </div>
      </div>

      {/* Settings rows */}
      <div className="px-6 space-y-2 flex-1">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-hcsg-light-gray">
          <SettingRow icon={<Phone size={15} className="text-hcsg-muted" />} label="Phone" value={LOGGED_IN_TECH.phone} />
          <div className="h-px bg-hcsg-light-gray mx-4" />
          <SettingRow icon={<Mail size={15} className="text-hcsg-muted" />} label="Email" value={LOGGED_IN_TECH.email} />
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-hcsg-light-gray">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <Bell size={15} className="text-hcsg-muted" />
              <span className="text-sm font-medium text-hcsg-navy">Notifications</span>
            </div>
            <button
              onClick={() => setNotifications(n => !n)}
              className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${notifications ? 'bg-hcsg-orange' : 'bg-hcsg-light-gray'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="px-6 pb-8 mt-4">
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 bg-white border border-hcsg-dark-red/30 text-hcsg-dark-red font-semibold py-3.5 rounded-2xl text-sm active:bg-red-50 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  )
}

function SettingRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      {icon}
      <div className="flex-1">
        <div className="text-xs text-hcsg-muted">{label}</div>
        <div className="text-sm font-medium text-hcsg-navy">{value}</div>
      </div>
    </div>
  )
}
