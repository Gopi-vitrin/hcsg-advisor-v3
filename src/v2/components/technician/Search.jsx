import { useState } from 'react'
import { Search as SearchIcon, X, MapPin, Zap, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { WORK_ORDERS, KNOWLEDGE_BASE } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }
const ALL_WOS = Object.values(WORK_ORDERS)

const KB_ITEMS = [
  { keywords: ['brake','air gap','drift','motor'], title: 'Motor Brake Adjustment', source: 'Shaw-Box 800 Series Manual', section: 'Section 7-2, p.23', snippet: '"When gap reaches .200" it will need to be readjusted to .100". Friction disc should be replaced when wear area is 3/32" thick or less."' },
  { keywords: ['wire rope','rope','broken wire','corrosion'], title: 'Wire Rope Inspection Criteria', source: 'Shaw-Box 800 Series Manual', section: 'Section 4-1, p.8', snippet: 'Replace wire rope if broken wires exceed 2 in any 6-rope-diameter length, or if kinking, crushing, or corrosion is present.' },
  { keywords: ['contactor','coil','raise','up button'], title: 'Contactor Inspection & Replacement', source: 'Yale Y80 Series Manual', section: 'Section 6-4, p.19', snippet: '"Verify that the contactor armatures are free to move. If binding occurs, replace contactor."' },
  { keywords: ['loto','lockout','tagout','osha'], title: 'Lockout / Tagout Procedure', source: 'OSHA 29 CFR 1910.147', section: 'Control of Hazardous Energy', snippet: 'Lock the main power switch in the open (OFF) position and tag per OSHA 29 CFR 1910.147.' },
  { keywords: ['fuse','transformer','no power','ppd','phase'], title: 'Control Power Loss Diagnosis', source: 'World Series Double Girder Manual', section: 'Section 6-1, p.22', snippet: '"Check transformer fuse. If blown, check for shorts. Check transformer coil for signs of overheating."' },
  { keywords: ['overload','clutch','slipping','capacity'], title: 'Overload Clutch & Rated Capacity', source: 'Shaw-Box 800 Series Manual', section: 'Section 6-7, p.20', snippet: '"Excessive load — Reduce loading to rated load as shown on nameplate."' },
]

function woMatch(wo, q) {
  const s = q.toLowerCase()
  return wo.id.toLowerCase().includes(s) || wo.customer.toLowerCase().includes(s) || wo.site.toLowerCase().includes(s) || wo.equipment.toLowerCase().includes(s) || wo.complaint.toLowerCase().includes(s)
}
function kbMatch(e, q) {
  const s = q.toLowerCase()
  return e.keywords.some(k => s.includes(k) || k.includes(s)) || e.title.toLowerCase().includes(s)
}

function KBCard({ e }) {
  const [open, setOpen] = useState(false)
  return (
    <button onClick={() => setOpen(v => !v)} className="w-full text-left p-4 transition-colors" style={{ border: '1px solid rgba(17,89,175,0.2)', borderLeft: '4px solid #1159af', borderRadius: 6, background: 'rgba(17,89,175,0.05)' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 flex-1">
          <BookOpen size={13} className="text-hcsg-blue mt-0.5 shrink-0" />
          <div>
            <p className="font-700 text-white/85 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{e.title}</p>
            <p className="text-xs mt-0.5" style={{ fontFamily: "'Barlow', sans-serif", color: 'rgba(17,89,175,0.8)' }}>{e.source} · {e.section}</p>
          </div>
        </div>
        {open ? <ChevronUp size={13} className="text-white/20 shrink-0 mt-1" /> : <ChevronDown size={13} className="text-white/20 shrink-0 mt-1" />}
      </div>
      {open && <p className="text-white/40 text-xs leading-relaxed italic mt-3 pl-5" style={{ fontFamily: "'Barlow', sans-serif", borderLeft: '2px solid rgba(17,89,175,0.3)', paddingLeft: 10 }}>{e.snippet}</p>}
    </button>
  )
}

function WOCard({ wo, onTap }) {
  return (
    <button onClick={() => onTap(wo.id)} className="w-full text-left p-4 transition-colors active:opacity-70" style={{ border: '1px solid rgba(255,255,255,0.08)', borderLeft: '4px solid rgba(230,94,37,0.4)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-700 text-white/35 text-xs" style={BC}>{wo.id}</span>
        <div className="flex items-center gap-1.5">
          {wo.aiReady && <Zap size={10} className="text-green-400" fill="currentColor" />}
          <span className="font-700 text-xs px-1.5 py-0.5" style={{ ...BC, borderRadius: 3, background: wo.priority === 'High' ? '#b82105' : '#f5a524', color: wo.priority === 'High' ? 'white' : '#011e41' }}>{wo.priority.toUpperCase()}</span>
        </div>
      </div>
      <p className="font-800 text-white text-base" style={{ ...BC, letterSpacing: '-0.2px' }}>{wo.customer.toUpperCase()}</p>
      <div className="flex items-center gap-1 mt-1">
        <MapPin size={10} className="text-white/25" />
        <p className="text-white/35 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.site} · {wo.equipment.split('—')[0].trim()}</p>
      </div>
    </button>
  )
}

export default function Search({ onSelectWO }) {
  const [q, setQ] = useState('')
  const woRes = q.length > 1 ? ALL_WOS.filter(w => woMatch(w, q)) : []
  const kbRes = q.length > 1 ? KB_ITEMS.filter(e => kbMatch(e, q)) : []
  const hasAny = woRes.length > 0 || kbRes.length > 0

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-800 text-hcsg-orange" style={BC}>›</span>
          <p className="font-800 text-white tracking-wide uppercase" style={{ ...BC, fontSize: 20, letterSpacing: '-0.3px' }}>SEARCH</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
          <SearchIcon size={15} className="text-white/30 shrink-0" />
          <input autoFocus type="text" value={q} onChange={e => setQ(e.target.value)} placeholder="Equipment, fault, procedure, WO number…" className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25" style={{ fontFamily: "'Barlow', sans-serif" }} />
          {q.length > 0 && <button onClick={() => setQ('')}><X size={14} className="text-white/25" /></button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 v2-scroll">
        {q.length === 0 && (
          <div className="space-y-2">
            <p className="font-700 text-white/20 text-xs tracking-widest uppercase" style={BC}>RECENT WORK ORDERS</p>
            {ALL_WOS.map(wo => <WOCard key={wo.id} wo={wo} onTap={onSelectWO} />)}
          </div>
        )}
        {q.length > 1 && !hasAny && (
          <div className="flex flex-col items-center justify-center pt-16 gap-2">
            <SearchIcon size={28} className="text-white/10" />
            <p className="text-white/25 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>No results for "{q}"</p>
          </div>
        )}
        {woRes.length > 0 && (
          <div className="space-y-2">
            <p className="font-700 text-white/20 text-xs tracking-widest uppercase" style={BC}>WORK ORDERS · {woRes.length}</p>
            {woRes.map(wo => <WOCard key={wo.id} wo={wo} onTap={onSelectWO} />)}
          </div>
        )}
        {kbRes.length > 0 && (
          <div className="space-y-2">
            <p className="font-700 text-white/20 text-xs tracking-widest uppercase" style={BC}>KNOWLEDGE BASE · {kbRes.length}</p>
            {kbRes.map((e, i) => <KBCard key={i} e={e} />)}
          </div>
        )}
      </div>
    </div>
  )
}
