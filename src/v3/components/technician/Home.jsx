import { useState, useEffect } from 'react'
import { Search, QrCode, Camera, ChevronDown, ChevronUp, Clock, CheckCircle, Settings } from 'lucide-react'
import { EQUIPMENT_CATALOG, PAST_SESSIONS, LOGGED_IN_TECH } from '../../data'

export default function TechHome({ onIdentify, onMyWork, onSettings }) {
  const [textQuery, setTextQuery] = useState('')
  const [matches, setMatches] = useState([])
  const [qrState, setQrState] = useState(null) // null | 'scanning' | 'found'
  const [ocrState, setOcrState] = useState(null) // null | 'capturing' | 'reading' | 'found'
  const [sessionsOpen, setSessionsOpen] = useState(false)

  useEffect(() => {
    if (textQuery.length < 2) { setMatches([]); return }
    const q = textQuery.toLowerCase()
    setMatches(
      EQUIPMENT_CATALOG.filter(e =>
        e.model.toLowerCase().includes(q) ||
        e.serial.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
      )
    )
  }, [textQuery])

  function handleQr() {
    if (qrState) return
    setQrState('scanning')
    setTimeout(() => setQrState('found'), 2000)
    setTimeout(() => {
      onIdentify(EQUIPMENT_CATALOG[0], 'qr')
      setQrState(null)
    }, 2800)
  }

  function handleOcr() {
    if (ocrState) return
    setOcrState('capturing')
    setTimeout(() => setOcrState('reading'), 1400)
    setTimeout(() => setOcrState('found'), 2900)
    setTimeout(() => {
      onIdentify(EQUIPMENT_CATALOG[0], 'photo')
      setOcrState(null)
    }, 3600)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="bg-hcsg-page rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col" style={{ minHeight: '86vh' }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-hcsg-navy rounded-b-2xl z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div>
          <div className="text-[10px] text-hcsg-muted tracking-[0.2em] mb-0.5">HCSG ADVISOR</div>
          <div className="font-bold text-hcsg-navy text-base">{greeting}, {LOGGED_IN_TECH.name.split(' ')[0]}</div>
        </div>
        <button
          onClick={onSettings}
          className="w-9 h-9 rounded-full bg-hcsg-orange text-white text-sm font-bold flex items-center justify-center shadow-sm"
        >
          {LOGGED_IN_TECH.avatar}
        </button>
      </div>

      {/* Prompt */}
      <div className="px-6 mb-5">
        <h2 className="text-xl font-black text-hcsg-navy mb-1">Identify equipment</h2>
        <p className="text-sm text-hcsg-muted">Choose how to look up the unit on site</p>
      </div>

      {/* Option 1 — Text / serial */}
      <div className="px-6 mb-3">
        <div className="bg-white rounded-2xl px-4 pt-4 pb-3 shadow-sm border border-hcsg-light-gray">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Search size={17} className="text-hcsg-orange" />
            </div>
            <div>
              <div className="font-semibold text-hcsg-navy text-sm">Type model or serial</div>
              <div className="text-xs text-hcsg-muted">Search the equipment catalog</div>
            </div>
          </div>
          <input
            type="text"
            value={textQuery}
            onChange={e => setTextQuery(e.target.value)}
            placeholder="e.g. Shaw-Box B800 or SB800-2T-4471"
            className="w-full bg-hcsg-surface border border-hcsg-light-gray rounded-xl px-3 py-2.5 text-sm text-hcsg-navy placeholder-hcsg-muted/50 outline-none focus:border-hcsg-orange transition-colors"
          />
          {matches.length > 0 && (
            <div className="mt-2 space-y-0.5">
              {matches.map(eq => (
                <button
                  key={eq.id}
                  onClick={() => onIdentify(eq, 'text')}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100"
                >
                  <div className="font-semibold text-sm text-hcsg-navy">{eq.model}</div>
                  <div className="text-xs text-hcsg-muted">{eq.serial} · {eq.type}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Option 2 — QR scan */}
      <div className="px-6 mb-3">
        <button
          onClick={handleQr}
          disabled={!!qrState}
          className="w-full bg-white rounded-2xl px-4 py-4 shadow-sm border border-hcsg-light-gray flex items-center gap-3 active:bg-hcsg-surface transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <QrCode size={17} className="text-hcsg-blue" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-hcsg-navy text-sm">Scan QR code</div>
            <div className="text-xs text-hcsg-muted">
              {qrState === 'scanning' ? 'Scanning equipment tag...' : qrState === 'found' ? 'Equipment found!' : 'Point camera at the equipment tag'}
            </div>
          </div>
          {qrState === 'scanning' && (
            <div className="w-5 h-5 border-2 border-hcsg-blue/30 border-t-hcsg-blue rounded-full animate-spin shrink-0" />
          )}
          {qrState === 'found' && (
            <CheckCircle size={18} className="text-hcsg-green shrink-0" />
          )}
        </button>
      </div>

      {/* Option 3 — Photo OCR */}
      <div className="px-6 mb-5">
        <button
          onClick={handleOcr}
          disabled={!!ocrState}
          className="w-full bg-white rounded-2xl px-4 py-4 shadow-sm border border-hcsg-light-gray flex items-center gap-3 active:bg-hcsg-surface transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <Camera size={17} className="text-hcsg-green" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-hcsg-navy text-sm">Capture equipment tag</div>
            <div className="text-xs text-hcsg-muted">
              {ocrState === 'capturing' ? 'Capturing...' : ocrState === 'reading' ? 'AI reading nameplate...' : ocrState === 'found' ? 'Model identified!' : 'AI reads the nameplate for you'}
            </div>
          </div>
          {ocrState && ocrState !== 'found' && (
            <div className="w-5 h-5 border-2 border-hcsg-green/30 border-t-hcsg-green rounded-full animate-spin shrink-0" />
          )}
          {ocrState === 'found' && (
            <CheckCircle size={18} className="text-hcsg-green shrink-0" />
          )}
        </button>
      </div>

      {/* Recent sessions — below the fold, collapsible */}
      <div className="border-t border-hcsg-light-gray mx-6" />
      <div className="px-6">
        <button
          onClick={() => setSessionsOpen(o => !o)}
          className="w-full flex items-center justify-between py-4 text-sm text-hcsg-muted"
        >
          <span className="flex items-center gap-2 font-medium">
            <Clock size={14} />
            Recent sessions
          </span>
          {sessionsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>

        {sessionsOpen && (
          <div className="pb-5 space-y-0">
            {PAST_SESSIONS.map((s, i) => (
              <div
                key={s.id}
                className={`flex items-start justify-between py-3 ${i < PAST_SESSIONS.length - 1 ? 'border-b border-hcsg-light-gray/60' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-hcsg-navy truncate">{s.equipment}</div>
                  <div className="text-xs text-hcsg-muted mt-0.5 truncate">{s.query}</div>
                </div>
                <div className="text-right ml-4 shrink-0">
                  <div className="text-xs text-hcsg-muted">{s.date}</div>
                  <div className="text-xs text-hcsg-green font-medium mt-0.5">{s.status}</div>
                </div>
              </div>
            ))}
            <button onClick={onMyWork} className="text-xs text-hcsg-orange font-semibold pt-2 block">
              View all in My Work →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
