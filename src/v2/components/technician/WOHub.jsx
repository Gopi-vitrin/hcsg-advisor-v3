import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, Circle, AlertTriangle, ShieldAlert, Package, BookOpen, ChevronDown, ChevronUp, Zap, TrendingUp, Camera, FileText, ClipboardList, XCircle } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }
const clamp = v => Math.min(99, Math.max(1, v))

// ── Tab Strip ────────────────────────────────────────────────────
function TabStrip({ active, onChange, resolveProgress, qasDone }) {
  const tabs = [
    { key: 'overview', label: 'OVERVIEW' },
    { key: 'diagnose', label: 'DIAGNOSE' },
    { key: 'resolve',  label: 'RESOLVE'  },
    { key: 'close',    label: 'CLOSE'    },
  ]
  return (
    <div className="flex shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="flex-1 py-3 flex flex-col items-center gap-1 transition-colors"
          style={{ background: active === t.key ? 'rgba(230,94,37,0.08)' : 'transparent' }}
        >
          <span
            className="font-700 tracking-widest text-xs"
            style={{ ...BC, color: active === t.key ? '#e65e25' : 'rgba(255,255,255,0.3)' }}
          >
            {t.label}
          </span>
          <div
            className="h-0.5 w-8 rounded-full transition-all duration-300"
            style={{ background: active === t.key ? '#e65e25' : 'transparent' }}
          />
        </button>
      ))}
    </div>
  )
}

// ── Overview Tab ─────────────────────────────────────────────────
function OverviewTab({ wo }) {
  const [histExpanded, setHistExpanded] = useState(false)
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Customer block */}
      <div>
        <p className="font-800 text-white leading-tight" style={{ ...BC, fontSize: 22, letterSpacing: '-0.3px' }}>
          {wo.customer.toUpperCase()}
        </p>
        <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {wo.site} · {wo.jobType}
        </p>
      </div>

      {/* Equipment card — orange frame border (website motif) */}
      <div className="p-4" style={{ border: '1px solid rgba(230,94,37,0.35)', borderLeft: '4px solid #e65e25', borderRadius: 6, background: 'rgba(230,94,37,0.05)' }}>
        <p className="font-700 text-white/30 text-xs tracking-widest uppercase mb-1" style={BC}>EQUIPMENT</p>
        <p className="font-700 text-white text-sm leading-snug" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.equipment}</p>
        <p className="text-white/35 text-xs font-mono mt-1">S/N: {wo.serialNumber}</p>
        <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <p className="font-800 text-white text-lg" style={BC}>{wo.hoursOnUnit.toLocaleString()}</p>
            <p className="text-white/35 text-xs" style={BC}>HOURS ON UNIT</p>
          </div>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <p className="text-white/70 text-sm font-semibold" style={{ fontFamily: "'Barlow', sans-serif" }}>Last service</p>
            <p className="text-white/35 text-xs">{wo.lastService}</p>
          </div>
        </div>
      </div>

      {/* Reported fault */}
      <div className="p-4" style={{ border: '1px solid rgba(245,165,36,0.25)', borderLeft: '4px solid #f5a524', borderRadius: 6, background: 'rgba(245,165,36,0.05)' }}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={13} className="text-hcsg-amber" />
          <p className="font-700 text-hcsg-amber text-xs tracking-widest uppercase" style={BC}>REPORTED FAULT</p>
        </div>
        <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>"{wo.complaint}"</p>
      </div>

      {/* AI context — new in V2 */}
      {wo.aiContext && (
        <div className="p-3 flex items-start gap-2.5" style={{ border: '1px solid rgba(17,89,175,0.25)', borderRadius: 6, background: 'rgba(17,89,175,0.08)' }}>
          <Zap size={13} className="text-hcsg-blue mt-0.5 shrink-0" fill="currentColor" />
          <p className="text-hcsg-blue text-xs leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.aiContext}</p>
        </div>
      )}

      {/* Service history timeline */}
      <div>
        <button
          onClick={() => setHistExpanded(v => !v)}
          className="w-full flex items-center justify-between mb-2"
        >
          <div className="flex items-center gap-2">
            <span className="font-800 text-hcsg-orange text-sm" style={BC}>›</span>
            <span className="font-700 text-white/50 text-xs tracking-widest uppercase" style={BC}>
              SERVICE HISTORY · {wo.equipmentHistory.length} EVENTS
            </span>
          </div>
          {histExpanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
        </button>

        {histExpanded && (
          <div className="relative pl-4 space-y-3" style={{ borderLeft: '2px solid rgba(230,94,37,0.2)' }}>
            {wo.equipmentHistory.map((e, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full" style={{ border: '2px solid #e65e25', background: '#011e41' }} />
                <div className="p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-700 text-xs tracking-wider" style={{ ...BC, color: e.type === 'Corrective Repair' ? '#f5a524' : '#60a5fa' }}>{e.type.toUpperCase()}</span>
                    <span className="text-white/30 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{e.date} · {e.hours} hrs</span>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>{e.findings}</p>
                  {e.partsUsed !== 'None' && <p className="text-white/30 text-xs mt-1">Parts: {e.partsUsed}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Diagnose Tab ─────────────────────────────────────────────────
const PROCESSING_STEPS = (wo) => [
  { id: 1, label: 'Analysing work order…',                        dur: 700  },
  { id: 2, label: 'Searching 4 equipment manuals…',               dur: 1100 },
  { id: 3, label: `Scanning ${wo.hoursOnUnit} hrs service history…`, dur: 700 },
  { id: 4, label: 'Cross-referencing fault patterns…',            dur: 700  },
  { id: 5, label: 'Generating ranked predictions…',               dur: 500  },
]
const TOTAL_DUR = 3700

function DiagnoseTab({ wo, confidences, setConfidences, qaDone, setQaDone }) {
  const [aiPhase,      setAiPhase]      = useState('processing') // processing | predictions
  const [activeStep,   setActiveStep]   = useState(0)
  const [doneSteps,    setDoneSteps]    = useState([])
  const [progress,     setProgress]     = useState(0)
  const [answers,      setAnswers]      = useState([])
  const [currentQ,     setCurrentQ]     = useState(0)
  const [prevConf,     setPrevConf]     = useState(null)
  const [citOpen,      setCitOpen]      = useState({})
  const [warnOpen,     setWarnOpen]     = useState({ 0: true })

  const STEPS = PROCESSING_STEPS(wo)

  useEffect(() => {
    let elapsed = 0
    STEPS.forEach((s, i) => {
      const t1 = setTimeout(() => setActiveStep(i), elapsed)
      elapsed += s.dur
      const t2 = setTimeout(() => {
        setDoneSteps(p => [...p, s.id])
        setProgress(Math.round(((i + 1) / STEPS.length) * 100))
      }, elapsed)
    })
    const done = setTimeout(() => setAiPhase('predictions'), TOTAL_DUR + 400)
    return () => clearTimeout(done)
  }, [])

  function handleAnswer(option) {
    if (answers[currentQ] !== undefined) return
    const q = wo.adaptiveQuestions[currentQ]
    const shifts = q.confidenceShift[option]
    const next = confidences.map((c, i) => clamp(c + shifts[i]))
    setPrevConf(confidences)
    setConfidences(next)
    setAnswers(p => { const u = [...p]; u[currentQ] = option; return u })
    if (currentQ < wo.adaptiveQuestions.length - 1) {
      setTimeout(() => setCurrentQ(q => q + 1), 800)
    } else {
      setTimeout(() => setQaDone(true), 800)
    }
  }

  const confColor = c => c >= 75 ? '#4ade80' : c >= 50 ? '#f5a524' : 'rgba(255,255,255,0.3)'
  const delta = prevConf ? confidences[0] - prevConf[0] : 0

  if (aiPhase === 'processing') {
    return (
      <div className="px-4 py-6 flex flex-col items-center gap-6">
        {/* Animated scanner */}
        <div className="relative flex items-center justify-center w-20 h-20" style={{ border: '2px solid rgba(230,94,37,0.3)', borderRadius: 6 }}>
          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 6 }}>
            <div className="absolute w-full h-0.5 bg-hcsg-orange/50" style={{ animation: 'scanLine 1.5s ease-in-out infinite', top: '50%' }} />
          </div>
          <Zap size={24} className="text-hcsg-orange" fill="currentColor" />
        </div>

        <div className="text-center">
          <p className="font-800 text-white tracking-widest uppercase" style={{ ...BC, fontSize: 18 }}>AI ANALYSING</p>
          <p className="text-white/30 text-xs mt-1" style={BC}>{wo.id} · SCANNING KNOWLEDGE BASE</p>
        </div>

        <div className="w-full space-y-3">
          {STEPS.map((s, i) => {
            const done = doneSteps.includes(s.id)
            const active = activeStep === i && !done
            return (
              <div key={s.id} className="flex items-center gap-3" style={{ opacity: i > activeStep && !done ? 0.2 : 1 }}>
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  {done ? <CheckCircle size={16} className="text-green-400" />
                    : active ? <div className="w-3.5 h-3.5 border-2 border-hcsg-orange border-t-transparent rounded-full animate-spin" />
                    : <div className="w-3 h-3" style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 2 }} />}
                </div>
                <span className="text-xs" style={{ ...BC, fontWeight: active ? 700 : 400, color: done ? 'rgba(255,255,255,0.4)' : active ? 'white' : 'rgba(255,255,255,0.25)' }}>
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="w-full">
          <div className="flex justify-between mb-1.5">
            <span className="text-white/30 text-xs" style={BC}>SCANNING</span>
            <span className="text-xs font-700" style={{ ...BC, color: '#e65e25' }}>{progress}%</span>
          </div>
          <div className="h-1" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: '#e65e25', borderRadius: 2 }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Live confidence card */}
      <div className="p-4" style={{ border: '1px solid rgba(74,222,128,0.2)', borderRadius: 6, background: 'rgba(74,222,128,0.04)' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-700 text-white/30 text-xs tracking-widest" style={BC}>TOP PREDICTION — LIVE CONFIDENCE</span>
          <div className="flex items-center gap-1.5">
            <span className="font-800 text-lg" style={{ ...BC, color: confColor(confidences[0]) }}>{confidences[0]}%</span>
            {delta !== 0 && (
              <span className="text-xs font-700" style={{ ...BC, color: delta > 0 ? '#4ade80' : '#f87171' }}>
                {delta > 0 ? `+${delta}` : delta}
              </span>
            )}
          </div>
        </div>
        <p className="text-white/70 text-sm font-semibold mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {wo.predictions[0].fault}
        </p>
        <div className="h-2" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
          <div className="h-full transition-all duration-700" style={{ width: `${confidences[0]}%`, background: confColor(confidences[0]), borderRadius: 2 }} />
        </div>
        {/* Secondary */}
        <div className="mt-2.5 space-y-1.5">
          {wo.predictions.slice(1).map((p, i) => (
            <div key={p.rank} className="flex items-center gap-2">
              <p className="text-white/25 text-xs flex-1 truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>{p.fault.split('—')[0].trim()}</p>
              <div className="w-14 h-1.5" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 1 }}>
                <div className="h-full transition-all duration-700" style={{ width: `${confidences[i + 1]}%`, background: confColor(confidences[i + 1]), borderRadius: 1 }} />
              </div>
              <span className="text-xs w-7 text-right font-700" style={{ ...BC, color: confColor(confidences[i + 1]) }}>{confidences[i + 1]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction cards */}
      {wo.predictions.map((p, idx) => {
        const isTop = idx === 0
        const citKey = `c${idx}`, warnKey = `w${idx}`
        return (
          <div key={p.rank} style={{ border: isTop ? '1px solid rgba(230,94,37,0.35)' : '1px solid rgba(255,255,255,0.08)', borderLeft: isTop ? '4px solid #e65e25' : '4px solid transparent', borderRadius: 6, background: isTop ? 'rgba(230,94,37,0.05)' : 'rgba(255,255,255,0.03)' }}>
            <div className="p-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 flex items-center justify-center font-800 text-xs text-white" style={{ ...BC, background: isTop ? '#e65e25' : 'rgba(255,255,255,0.1)', borderRadius: 3 }}>{p.rank}</div>
                  <span className="font-700 text-xs tracking-wider px-2 py-0.5" style={{ ...BC, borderRadius: 3, background: p.severity === 'HIGH' ? 'rgba(184,33,5,0.2)' : p.severity === 'MEDIUM' ? 'rgba(245,165,36,0.15)' : 'rgba(255,255,255,0.05)', color: p.severity === 'HIGH' ? '#f87171' : p.severity === 'MEDIUM' ? '#f5a524' : 'rgba(255,255,255,0.3)', border: `1px solid ${p.severity === 'HIGH' ? 'rgba(184,33,5,0.3)' : p.severity === 'MEDIUM' ? 'rgba(245,165,36,0.2)' : 'rgba(255,255,255,0.08)'}` }}>{p.severity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-800 text-sm" style={{ ...BC, color: confColor(confidences[idx]) }}>{confidences[idx]}%</span>
                  <div className="w-16 h-1.5" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 1 }}>
                    <div className="h-full" style={{ width: `${confidences[idx]}%`, background: confColor(confidences[idx]), borderRadius: 1 }} />
                  </div>
                </div>
              </div>
              <p className="font-semibold text-sm" style={{ fontFamily: "'Barlow', sans-serif", color: isTop ? 'white' : 'rgba(255,255,255,0.75)' }}>{p.fault}</p>
              {p.part && (
                <div className="flex items-start gap-2 mt-2">
                  <Package size={12} className="text-hcsg-orange mt-0.5 shrink-0" />
                  <p className="text-white/45 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{p.part}</p>
                </div>
              )}
            </div>
            {/* Citation */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button onClick={() => setCitOpen(o => ({ ...o, [citKey]: !o[citKey] }))} className="w-full flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <BookOpen size={12} className="text-hcsg-blue" />
                  <span className="text-xs font-600 truncate max-w-52" style={{ ...BC, color: '#1159af' }}>{p.source.split(',')[0]}</span>
                </div>
                {citOpen[citKey] ? <ChevronUp size={13} className="text-white/20 shrink-0" /> : <ChevronDown size={13} className="text-white/20 shrink-0" />}
              </button>
              {citOpen[citKey] && (
                <div className="px-4 pb-3">
                  <p className="text-white/35 text-xs italic leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif", borderLeft: '2px solid rgba(17,89,175,0.3)', paddingLeft: 8 }}>{p.citation}</p>
                  <p className="text-white/20 text-xs mt-1">{p.source}</p>
                </div>
              )}
            </div>
            {/* Safety */}
            {p.safetyWarning && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => setWarnOpen(o => ({ ...o, [warnKey]: !o[warnKey] }))} className="w-full flex items-center justify-between px-4 py-2.5" style={{ background: warnOpen[warnKey] ? 'rgba(184,33,5,0.12)' : 'transparent' }}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={12} className="text-red-400" />
                    <span className="text-xs font-700" style={{ ...BC, color: '#f87171' }}>SAFETY WARNING</span>
                  </div>
                  {warnOpen[warnKey] ? <ChevronUp size={13} className="text-red-400/40 shrink-0" /> : <ChevronDown size={13} className="text-white/20 shrink-0" />}
                </button>
                {warnOpen[warnKey] && <div className="px-4 pb-3" style={{ background: 'rgba(184,33,5,0.08)' }}><p className="text-red-300 text-xs leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>{p.safetyWarning}</p></div>}
              </div>
            )}
          </div>
        )
      })}

      {/* Adaptive Q&A */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-800 text-hcsg-orange text-sm" style={BC}>›</span>
          <span className="font-700 text-white/40 text-xs tracking-widest uppercase" style={BC}>NARROW THE DIAGNOSIS</span>
        </div>

        {wo.adaptiveQuestions.map((q, qi) => {
          if (qi > currentQ) return null
          const answered = answers[qi] !== undefined
          return (
            <div key={qi} className="mb-3 space-y-2">
              <div className="p-4" style={{ border: answered ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(230,94,37,0.25)', borderRadius: 6, background: answered ? 'rgba(255,255,255,0.02)' : 'rgba(230,94,37,0.04)' }}>
                <div className="flex items-start gap-2 mb-3">
                  <TrendingUp size={13} className="text-hcsg-orange mt-0.5 shrink-0" />
                  <p className="text-sm font-semibold" style={{ fontFamily: "'Barlow', sans-serif", color: answered ? 'rgba(255,255,255,0.4)' : 'white' }}>{q.question}</p>
                </div>
                <div className="space-y-2">
                  {q.options.map(opt => {
                    const sel = answers[qi] === opt
                    return (
                      <button key={opt} onClick={() => handleAnswer(opt)} disabled={answered}
                        className="w-full text-left px-3 py-2.5 text-sm transition-all duration-200"
                        style={{ borderRadius: 4, background: sel ? '#e65e25' : answered ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)', color: sel ? 'white' : answered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.75)', border: sel ? 'none' : '1px solid rgba(255,255,255,0.08)', fontFamily: "'Barlow', sans-serif" }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opt}</span>
                          {sel && <CheckCircle size={14} className="text-white/70 shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
              {answered && (
                <div className="flex items-start gap-2 px-3 py-2.5" style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 4 }}>
                  <CheckCircle size={12} className="text-green-400 mt-0.5 shrink-0" />
                  <p className="text-white/50 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{q.impact[answers[qi]]}</p>
                </div>
              )}
            </div>
          )
        })}

        {qaDone && (
          <div className="p-4 text-center" style={{ border: '1px solid rgba(74,222,128,0.2)', borderRadius: 6, background: 'rgba(74,222,128,0.06)' }}>
            <CheckCircle size={22} className="text-green-400 mx-auto mb-2" />
            <p className="font-800 text-white text-sm tracking-wide uppercase" style={BC}>DIAGNOSIS REFINED</p>
            <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {wo.predictions[0].fault.split('—')[0].trim()} — {confidences[0]}% confidence
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Resolve Tab ──────────────────────────────────────────────────
function ResolveTab({ wo }) {
  const [done, setDone] = useState(new Set())
  const total = wo.resolutionSteps.length
  const pct   = Math.round((done.size / total) * 100)
  const allDone = done.size === total

  return (
    <div className="px-4 py-4 space-y-3">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-700 text-white/30 text-xs tracking-widest uppercase" style={BC}>RESOLUTION STEPS</span>
        <span className="font-800 text-xs" style={{ ...BC, color: allDone ? '#4ade80' : '#e65e25' }}>{done.size}/{total}</span>
      </div>
      <div className="h-1 mb-1" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, background: allDone ? '#4ade80' : '#e65e25', borderRadius: 2 }} />
      </div>

      {/* Source ref */}
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: 'rgba(17,89,175,0.08)', border: '1px solid rgba(17,89,175,0.2)', borderRadius: 4 }}>
        <BookOpen size={12} className="text-hcsg-blue shrink-0" />
        <p className="text-hcsg-blue text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.sourceRef}</p>
      </div>

      {/* Steps */}
      {wo.resolutionSteps.map(s => {
        const isComplete = done.has(s.step)
        const isLoto = s.isLoto
        const isSafety = s.isSafety && !s.isLoto
        return (
          <button
            key={s.step}
            onClick={() => setDone(p => { const n = new Set(p); n.has(s.step) ? n.delete(s.step) : n.add(s.step); return n })}
            className="w-full text-left transition-all active:scale-[0.98]"
            style={{
              borderRadius: 6,
              borderLeft: isLoto ? '4px solid #b82105' : isSafety ? '4px solid #e65e25' : '4px solid rgba(255,255,255,0.06)',
              border: isLoto ? '1px solid rgba(184,33,5,0.4)' : isSafety ? '1px solid rgba(230,94,37,0.2)' : '1px solid rgba(255,255,255,0.06)',
              background: isLoto ? (isComplete ? 'rgba(184,33,5,0.08)' : 'rgba(184,33,5,0.15)') : isSafety ? 'rgba(230,94,37,0.04)' : 'rgba(255,255,255,0.02)',
            }}
          >
            <div className="p-3.5 flex items-start gap-3">
              <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                <span className="font-800 text-xs font-mono" style={{ ...BC, color: isComplete ? '#4ade80' : isLoto ? '#f87171' : 'rgba(255,255,255,0.2)' }}>
                  {String(s.step).padStart(2, '0')}
                </span>
                {isComplete ? <CheckCircle size={18} className="text-green-400" /> : <Circle size={18} style={{ color: isLoto ? 'rgba(248,113,113,0.4)' : 'rgba(255,255,255,0.15)' }} />}
              </div>
              <div className="flex-1">
                {isLoto && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <ShieldAlert size={12} className="text-red-400" />
                    <span className="font-700 text-red-400 text-xs tracking-wider" style={BC}>LOCKOUT / TAGOUT REQUIRED</span>
                  </div>
                )}
                {isSafety && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle size={12} className="text-hcsg-orange" />
                    <span className="font-700 text-hcsg-orange text-xs tracking-wider" style={BC}>SAFETY STEP</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif", color: isComplete ? 'rgba(255,255,255,0.3)' : isLoto ? 'white' : 'rgba(255,255,255,0.75)', textDecoration: isComplete ? 'line-through' : 'none', textDecorationColor: 'rgba(255,255,255,0.2)' }}>
                  {s.text.replace(/^STEP \d+ — /, '')}
                </p>
              </div>
            </div>
          </button>
        )
      })}

      {/* Parts */}
      <div className="flex items-start gap-3 p-3.5" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, background: 'rgba(255,255,255,0.02)' }}>
        <Package size={15} className="text-hcsg-orange mt-0.5 shrink-0" />
        <div>
          <p className="font-700 text-white/30 text-xs tracking-widest uppercase mb-0.5" style={BC}>PARTS NEEDED</p>
          <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.parts}</p>
        </div>
      </div>

      {allDone && (
        <div className="flex items-center gap-3 p-3.5" style={{ border: '1px solid rgba(74,222,128,0.2)', borderRadius: 6, background: 'rgba(74,222,128,0.05)' }}>
          <CheckCircle size={16} className="text-green-400 shrink-0" />
          <p className="font-700 text-green-300 text-sm tracking-wide uppercase" style={BC}>ALL STEPS COMPLETE</p>
        </div>
      )}
    </div>
  )
}

// ── Close Tab ────────────────────────────────────────────────────
function CloseTab({ wo, onComplete }) {
  const [confirmed, setConfirmed] = useState(true)
  const [notes,     setNotes]     = useState(wo.defaultNote ?? '')
  const [done,      setDone]      = useState(false)

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 gap-6 pb-8">
        <div className="relative">
          <div className="absolute w-28 h-28 rounded-full" style={{ border: '2px solid rgba(74,222,128,0.2)', animation: 'ping 2s ease-in-out infinite', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ border: '2px solid rgba(74,222,128,0.4)', background: 'rgba(74,222,128,0.1)' }}>
            <CheckCircle size={42} className="text-green-400" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center">
          <p className="font-700 text-green-400 text-xs tracking-widest uppercase mb-1" style={BC}>WORK ORDER COMPLETE</p>
          <p className="font-800 text-white" style={{ ...BC, fontSize: 28, letterSpacing: '-0.5px' }}>{wo.id}</p>
          <p className="text-white/40 text-sm mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{wo.customer} · {wo.site}</p>
        </div>
        <div className="w-full space-y-2">
          {[
            { label: 'FAULT CONFIRMED', value: confirmed ? '✓ YES' : '✗ ESCALATED', color: confirmed ? '#4ade80' : '#f87171' },
            { label: 'PARTS USED', value: wo.parts.split('—')[0].trim(), color: 'rgba(255,255,255,0.6)' },
            { label: 'JOB TIME', value: wo.jobTime ?? '~45 min', color: 'rgba(255,255,255,0.6)' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between px-4 py-2.5" style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4 }}>
              <span className="font-700 text-xs tracking-widest text-white/30" style={BC}>{r.label}</span>
              <span className="font-700 text-sm" style={{ ...BC, color: r.color }}>{r.value}</span>
            </div>
          ))}
          <div className="px-4 py-3" style={{ border: '1px solid rgba(74,222,128,0.15)', borderRadius: 4, background: 'rgba(74,222,128,0.05)' }}>
            <div className="flex justify-between text-xs mb-1.5"><span className="text-white/30 font-700" style={BC}>FIRST-VISIT RESOLUTION</span><span className="text-green-400 font-700" style={BC}>✓ CONFIRMED</span></div>
            <div className="flex justify-between text-xs"><span className="text-white/30 font-700" style={BC}>RETURN TRIP AVOIDED</span><span className="text-green-400 font-700" style={BC}>1 CALLBACK SAVED</span></div>
          </div>
        </div>
        <button onClick={() => onComplete()} className="w-full py-3.5 font-800 text-white tracking-widest uppercase text-sm" style={{ ...BC, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 4 }}>
          ← RETURN TO WORK ORDERS
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Fault confirmed */}
      <div>
        <p className="font-700 text-white/30 text-xs tracking-widest uppercase mb-2" style={BC}>FAULT CONFIRMED?</p>
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map(v => (
            <button key={String(v)} onClick={() => setConfirmed(v)}
              className="flex items-center justify-center gap-2 py-3.5 text-sm font-700 transition-all"
              style={{ ...BC, borderRadius: 4, background: confirmed === v ? (v ? 'rgba(74,222,128,0.12)' : 'rgba(184,33,5,0.12)') : 'rgba(255,255,255,0.04)', border: `1px solid ${confirmed === v ? (v ? 'rgba(74,222,128,0.3)' : 'rgba(184,33,5,0.3)') : 'rgba(255,255,255,0.08)'}`, color: confirmed === v ? (v ? '#4ade80' : '#f87171') : 'rgba(255,255,255,0.3)' }}
            >
              {v ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {v ? 'YES — CONFIRMED' : 'NO — ESCALATE'}
            </button>
          ))}
        </div>
      </div>

      {/* Photo placeholder */}
      <div>
        <p className="font-700 text-white/30 text-xs tracking-widest uppercase mb-2" style={BC}>PHOTOS</p>
        <button className="w-full flex items-center justify-center gap-2 py-4" style={{ border: '1px dashed rgba(230,94,37,0.25)', borderRadius: 4, background: 'rgba(230,94,37,0.03)' }}>
          <Camera size={18} className="text-hcsg-orange/50" />
          <span className="font-700 text-white/25 text-xs tracking-widest uppercase" style={BC}>TAP TO ADD PHOTO</span>
        </button>
      </div>

      {/* Notes */}
      <div>
        <p className="font-700 text-white/30 text-xs tracking-widest uppercase mb-2" style={BC}>FIELD NOTES</p>
        <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4 }}>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full bg-transparent text-white text-sm leading-relaxed outline-none resize-none p-3 placeholder:text-white/20"
            style={{ fontFamily: "'Barlow', sans-serif" }}
            placeholder="Describe findings, measurements, observations..."
          />
        </div>
      </div>

      {/* OSHA */}
      <div className="flex items-start gap-2 p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 4 }}>
        <FileText size={12} className="text-white/20 mt-0.5 shrink-0" />
        <p className="text-white/20 text-xs leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>OSHA requires a written, dated, and signed inspection report. This record will be submitted automatically on completion.</p>
      </div>

      {/* Complete */}
      <button
        onClick={() => setDone(true)}
        className="w-full flex items-center justify-between py-4 px-5 text-white transition-all active:scale-[0.98]"
        style={{ ...BC, background: '#e65e25', borderRadius: 4 }}
      >
        <div className="flex items-center gap-3">
          <ClipboardList size={18} />
          <span className="font-800 tracking-widest uppercase text-sm">COMPLETE WORK ORDER</span>
        </div>
        <span className="font-800 text-lg">›</span>
      </button>
    </div>
  )
}

// ── Main WO Hub ──────────────────────────────────────────────────
export default function WOHub({ woId, onBack, onComplete }) {
  const wo = WORK_ORDERS[woId]
  const [activeTab,   setActiveTab]   = useState('overview')
  const [confidences, setConfidences] = useState(wo?.predictions.map(p => p.confidence) ?? [87, 71, 38])
  const [qaDone,      setQaDone]      = useState(false)

  if (!wo) return null

  const isHigh = wo.priority === 'High'

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center shrink-0" style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4 }}>
          <ArrowLeft size={16} className="text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-700 text-white/40 text-xs font-mono" style={BC}>{wo.id}</span>
            <span className="font-700 text-xs px-2 py-0.5" style={{ ...BC, borderRadius: 3, background: isHigh ? '#b82105' : '#f5a524', color: isHigh ? 'white' : '#011e41' }}>{wo.priority.toUpperCase()}</span>
          </div>
          <p className="font-800 text-white truncate" style={{ ...BC, fontSize: 16, letterSpacing: '-0.2px' }}>{wo.customer.toUpperCase()}</p>
        </div>
        {wo.aiReady && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 shrink-0" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 3 }}>
            <Zap size={11} className="text-green-400" fill="currentColor" />
            <span className="font-700 text-green-400 text-xs tracking-wider" style={BC}>AI</span>
          </div>
        )}
      </div>

      <TabStrip active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto v2-scroll">
        {activeTab === 'overview' && <OverviewTab wo={wo} />}
        {activeTab === 'diagnose' && (
          <DiagnoseTab
            wo={wo}
            confidences={confidences}
            setConfidences={setConfidences}
            qaDone={qaDone}
            setQaDone={setQaDone}
          />
        )}
        {activeTab === 'resolve'  && <ResolveTab wo={wo} />}
        {activeTab === 'close'    && <CloseTab wo={wo} onComplete={() => { onComplete?.(); onBack(); }} />}
      </div>

      {/* Advance hint when diagnose is done */}
      {activeTab === 'diagnose' && qaDone && (
        <div className="px-4 pb-4 pt-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setActiveTab('resolve')} className="w-full flex items-center justify-center gap-2 py-3.5 text-white" style={{ ...BC, background: '#e65e25', borderRadius: 4 }}>
            <span className="font-800 tracking-widest uppercase text-sm">››› VIEW RESOLUTION GUIDE</span>
          </button>
        </div>
      )}
    </div>
  )
}
