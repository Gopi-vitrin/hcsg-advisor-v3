import { useState, useRef } from 'react'
import { CheckCircle, X, Send, MapPin, Clock, Smartphone } from 'lucide-react'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }
const BRANCHES = ['New Orleans, LA','Baton Rouge, LA','Houston, TX','Freeport, TX','Sulphur, LA','Beaumont, TX','Lake Charles, LA','Dallas, TX']
const ROLES = ['Field Technician','Senior Field Tech','Field Tech — Fast Track','Lead Technician']
const ROSTER = [
  { name:'Jake Thibodaux',   role:'Field Tech — Fast Track', branch:'New Orleans, LA', avatar:'JT', status:'active',   lastActive:'Now',       queries:12, wo:3 },
  { name:'Raymond Fontenot', role:'Senior Field Tech',       branch:'New Orleans, LA', avatar:'RF', status:'active',   lastActive:'2h ago',    queries:8,  wo:2 },
  { name:'Daryl Broussard',  role:'Field Technician',        branch:'Baton Rouge, LA', avatar:'DB', status:'active',   lastActive:'4h ago',    queries:5,  wo:1 },
  { name:'Marcus Guidry',    role:'Senior Field Tech',       branch:'Houston, TX',     avatar:'MG', status:'active',   lastActive:'Yesterday', queries:19, wo:1 },
  { name:'Terrence Williams',role:'Field Technician',        branch:'Freeport, TX',    avatar:'TW', status:'inactive', lastActive:'3 days ago',queries:0,  wo:0 },
]

function InviteModal({ onClose, onInvited }) {
  const [form, setForm] = useState({ name:'', email:'', branch:'', role:'Field Technician' })
  const [stage, setStage] = useState('form')
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const valid = form.name.trim() && form.email.includes('@') && form.branch

  function send() {
    setStage('sending')
    setTimeout(() => {
      setStage('done')
      setTimeout(() => onInvited({ name: form.name, role: form.role, branch: form.branch, avatar: form.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(), status:'inactive', lastActive:'Invited', queries:0, wo:0 }), 700)
    }, 1400)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md overflow-hidden" style={{ borderRadius: 6, borderTop: '3px solid #e65e25' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #FAF8F5' }}>
          <div className="flex items-center gap-3">
            <Smartphone size={15} className="text-hcsg-orange" />
            <div>
              <p className="font-800 text-slate-800 text-sm" style={BC}>INVITE TECHNICIAN</p>
              <p className="text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>Teams message + one-tap setup link</p>
            </div>
          </div>
          {stage === 'form' && <button onClick={onClose}><X size={16} className="text-slate-400" /></button>}
        </div>
        <div className="px-6 py-5 space-y-4">
          {stage === 'form' && (
            <>
              {[{l:'FULL NAME',k:'name',t:'text',p:'e.g. Michael Tran'},{l:'WORK EMAIL',k:'email',t:'email',p:'mtran@hoistcrane.com'}].map(f => (
                <div key={f.k}>
                  <p className="font-700 text-slate-400 text-xs tracking-widest uppercase mb-1.5" style={BC}>{f.l}</p>
                  <input type={f.t} value={form[f.k]} onChange={e => set(f.k, e.target.value)} placeholder={f.p} className="w-full px-3 py-2.5 text-slate-700 text-sm" style={{ border: '1px solid #E0D7CE', borderRadius: 4, fontFamily: "'Barlow', sans-serif" }} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-700 text-slate-400 text-xs tracking-widest uppercase mb-1.5" style={BC}>BRANCH</p>
                  <select value={form.branch} onChange={e => set('branch', e.target.value)} className="w-full px-3 py-2.5 text-slate-700 text-sm bg-white" style={{ border: '1px solid #E0D7CE', borderRadius: 4 }}>
                    <option value="">Select…</option>
                    {BRANCHES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <p className="font-700 text-slate-400 text-xs tracking-widest uppercase mb-1.5" style={BC}>ROLE</p>
                  <select value={form.role} onChange={e => set('role', e.target.value)} className="w-full px-3 py-2.5 text-slate-700 text-sm bg-white" style={{ border: '1px solid #E0D7CE', borderRadius: 4 }}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3" style={{ background: '#FFF3EC', border: '1px solid #F5C9A0', borderRadius: 4 }}>
                <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#6264A7', borderRadius: 3 }}>
                  <svg width="10" height="10" viewBox="0 0 18 18" fill="none"><path d="M11.5 5.5C11.5 6.88 10.38 8 9 8C7.62 8 6.5 6.88 6.5 5.5C6.5 4.12 7.62 3 9 3C10.38 3 11.5 4.12 11.5 5.5Z" fill="white"/><path d="M4 9V13C4 13.55 4.45 14 5 14H11C11.55 14 12 13.55 12 13V9C12 8.45 11.55 8 11 8H5C4.45 8 4 8.45 4 9Z" fill="white"/></svg>
                </div>
                <p className="text-blue-700 text-xs leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>Invitation sent via Microsoft Teams with one-tap Copilot setup link.</p>
              </div>
            </>
          )}
          {stage === 'sending' && (
            <div className="py-4 flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-hcsg-orange border-t-transparent rounded-full animate-spin shrink-0" />
              <div><p className="text-slate-700 text-sm font-semibold">Sending Teams invitation…</p><p className="text-slate-400 text-xs">{form.email}</p></div>
            </div>
          )}
          {stage === 'done' && (
            <div className="py-4 flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 shrink-0" style={{ borderRadius: 4 }}><CheckCircle size={18} className="text-green-600" /></div>
              <div><p className="text-slate-700 text-sm font-semibold">Invitation sent to {form.name.split(' ')[0]}</p><p className="text-slate-400 text-xs">They'll appear in the roster once activated</p></div>
            </div>
          )}
        </div>
        {stage === 'form' && (
          <div className="px-6 py-4 flex justify-end gap-2" style={{ borderTop: '1px solid #FAF8F5' }}>
            <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm">Cancel</button>
            <button onClick={send} disabled={!valid} className="flex items-center gap-2 px-5 py-2 text-sm font-700 text-white" style={{ ...BC, background: valid ? '#e65e25' : '#E0D7CE', color: valid ? 'white' : '#9A8B7A', borderRadius: 4 }}>
              <Send size={13} />SEND INVITATION
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Team() {
  const [showInvite, setShowInvite] = useState(false)
  const [extras, setExtras] = useState([])
  const [banner, setBanner] = useState(null)

  function onInvited(t) { setShowInvite(false); setExtras(p => [...p, t]); setBanner(t.name.split(' ')[0]); setTimeout(() => setBanner(null), 4000) }

  const all = [...ROSTER, ...extras]

  return (
    <div className="p-8 max-w-5xl">
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvited={onInvited} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-800 text-hcsg-orange" style={BC}>›</span>
            <p className="font-700 text-slate-400 text-xs tracking-widest uppercase" style={BC}>GULF COAST REGION</p>
          </div>
          <h1 className="font-800 text-hcsg-navy" style={{ ...BC, fontSize: 26, letterSpacing: '-0.3px' }}>TEAM</h1>
          <p className="text-slate-400 text-sm mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>{all.length} technicians · {all.filter(t=>t.status==='active').length} active today</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-700 text-white" style={{ ...BC, background: '#e65e25', borderRadius: 4 }}>
          <Smartphone size={14} />INVITE TECHNICIAN
        </button>
      </div>

      {banner && (
        <div className="flex items-center gap-3 px-5 py-3 mb-5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4 }}>
          <CheckCircle size={14} className="text-green-600 shrink-0" />
          <p className="text-green-700 text-sm font-semibold" style={{ fontFamily: "'Barlow', sans-serif" }}>Invitation sent to {banner}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { l:'TOTAL TECHNICIANS',  v: all.length },
          { l:'USING AI THIS MONTH',v: all.filter(t=>t.queries>0).length },
          { l:'AVG QUERIES / TECH', v: Math.round(all.reduce((s,t)=>s+t.queries,0)/all.length)||0 },
        ].map(s => (
          <div key={s.l} className="bg-white px-4 py-3" style={{ borderRadius: 6, border: '1px solid #E0D7CE', borderTop: '3px solid #011e41' }}>
            <p className="font-800 text-hcsg-navy text-2xl" style={BC}>{s.v}</p>
            <p className="font-700 text-slate-400 text-xs tracking-widest mt-0.5" style={BC}>{s.l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white overflow-hidden" style={{ borderRadius: 6, border: '1px solid #E0D7CE', borderTop: '3px solid #e65e25' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #FAF8F5' }}>
          <p className="font-800 text-slate-700 text-sm" style={BC}>TECHNICIAN ROSTER</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#FAF8F5' }}>
          {all.map((t, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 flex items-center justify-center bg-hcsg-navy font-800 text-white text-xs shrink-0" style={{ ...BC, borderRadius: 4 }}>{t.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-700 text-slate-700 text-sm" style={BC}>{t.name.toUpperCase()}</p>
                <p className="text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{t.role}</p>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs w-36 shrink-0" style={{ fontFamily: "'Barlow', sans-serif" }}><MapPin size={10} />{t.branch}</div>
              <div className="flex items-center gap-1 text-slate-400 text-xs w-24 shrink-0" style={{ fontFamily: "'Barlow', sans-serif" }}><Clock size={10} />{t.lastActive}</div>
              <div className="text-center w-20 shrink-0">
                <p className="font-800 text-slate-700 text-sm" style={BC}>{t.queries}</p>
                <p className="text-slate-400 text-xs" style={BC}>AI QUERIES</p>
              </div>
              <div className="text-center w-16 shrink-0">
                <p className="font-800 text-slate-700 text-sm" style={BC}>{t.wo}</p>
                <p className="text-slate-400 text-xs" style={BC}>OPEN WOS</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-700 px-2.5 py-1 shrink-0" style={{ ...BC, borderRadius: 3, background: t.status === 'active' ? '#f0fdf4' : '#FAF8F5', color: t.status === 'active' ? '#16a34a' : '#9A8B7A', border: `1px solid ${t.status === 'active' ? '#bbf7d0' : '#E0D7CE'}` }}>
                <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'active' ? 'bg-green-400' : 'bg-slate-300'}`} />
                {t.status === 'active' ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3" style={{ borderTop: '1px solid #FAF8F5', background: '#FAF8F5' }}>
          <p className="text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>Gulf Coast Region · 375 technicians total across 32 branches</p>
        </div>
      </div>
    </div>
  )
}
