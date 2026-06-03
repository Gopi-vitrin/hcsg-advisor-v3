import { useState, useRef, useEffect } from 'react'
import { Send, Zap, BookOpen, ArrowLeft } from 'lucide-react'
import { TECHNICIAN, WORK_ORDERS } from '../../data'

// ── Per-WO scripted responses ──────────────────────────────────────────────
const WO_SCRIPTS = {
  'WO-2847': {
    text: `Based on SB800-2T-4471 — the January PM showed a 0.120” air gap. Within spec then. After 487 hours of operation, you're well into the wear range where load drift starts.

Factory setting is 0.100”. Once the gap reaches 0.200”, the brake can no longer hold load reliably — that's your hook drop on button release.

1. LOCKOUT/TAGOUT — mandatory before the brake cover comes off.
2. Measure the gap. At or past 0.200”, adjust to 0.100” with the adjusting screw (turn CW, retighten jam nut).
3. Check the friction disc. Worn to 3/32” or less — replace with Part No. 800-5005 before adjusting.`,
    source: 'Shaw-Box 800 Series Manual',
    section: 'Section 7-2 (Motor Brake Adjustment), p.23',
    quote: `”When gap reaches .200” it will need to be readjusted to .100”. Friction disc should be replaced when wear area is 3/32” thick or less.”`,
    wow: true,
  },
  'WO-2851': {
    text: `Looking at Y80-3T-8821 — the March PM noted oxidation on the UP contactor contacts. They were cleaned at that service, but 68 hours of operation is enough for oxidation to re-establish and prevent the contactor from seating.

The symptom — hook lowers but won't raise — is classic UP contactor failure. DOWN uses a separate contactor circuit, which is why that direction still works.

1. LOCKOUT/TAGOUT before opening the electrical compartment.
2. Check the contactor armature — press it manually. If it moves freely, the coil is likely burned. If it binds, clean and re-test.
3. Press the UP button and listen. No click means coil burned. A click with no movement means motor winding or power path.

Replace with Part No. 800-656 if the coil is burned.`,
    source: 'Yale Y80 Series Manual',
    section: 'Section 6-4 (Hook Will Lower But Not Raise), p.19',
    quote: `”Verify that the contactor armatures are free to move. If binding occurs, replace contactor. Check for burned out contactor coils.”`,
    wow: true,
  },
  'WO-2853': {
    text: `For WS3D-10T-2204 — a transformer failure was documented here in January 2024. That's the most relevant history. Complete loss of control with no sounds means nothing is reaching the contactors — control voltage is absent.

The prior repair added surge protection after an overvoltage event. Transformer fuses can fail independently of surge protection.

1. LOCKOUT/TAGOUT. Check for burn marks before opening any panel.
2. Locate the transformer fuse (Part No. 800-673). If blown, inspect the full control circuit for shorts before replacing — don't just swap the fuse.
3. Check the Phase Protection Device LED. Amber steady means phase sequence is reversed. LED off entirely means no control voltage reaching the PPD.`,
    source: 'World Series Double Girder Manual',
    section: 'Section 6-1 (Hoist Will Not Operate), p.22',
    quote: `”Check transformer fuse. If blown, check for grounding and/or shorts in push button station. Check transformer coil for signs of overheating.”`,
    wow: true,
  },
  'WO-2856': {
    text: `Looking at JLM-2T-0441 — the January PM confirmed limit switches were functional, but 78 hours is enough for a worn cam to shift. Good call by the safety officer pulling it from service.

Two quick checks before disassembly:
1. With LOTO in place, manually press the limit switch lever. If the circuit breaks, the switch is fine — the cam is the problem.
2. Visually inspect the cam actuator. Look for rotation at the contact point or visible wear.

If the cam has shifted: replace with Part No. JLM-409. Alignment must place the lever actuation approximately 2 inches before the upper mechanical stop — any closer and you risk two-blocking before the switch trips.`,
    source: 'Coffing JLM Series Manual',
    section: 'Section 6-3 (Limit Switch Adjustment), p.17',
    quote: `”If the upper limit switch does not trip, inspect the cam actuator for wear or misalignment. A worn or shifted cam will not contact the switch lever at the correct point in travel.”`,
    wow: true,
  },
}

// Keywords that trigger the per-WO scripted response
const WO_TRIGGERS = {
  'WO-2847': ['brake', 'drift', 'hook', 'air gap', 'motor brake'],
  'WO-2851': ['contactor', 'raise', 'up button', 'won\'t raise', 'lower'],
  'WO-2853': ['power', 'dead', 'fuse', 'transformer', 'won\'t operate', 'no response', 'control'],
  'WO-2856': ['limit', 'switch', 'cam', 'two-block', 'bypass', 'stop', 'travel'],
}

const CANNED = {
  'brake':     { text: 'Motor brake issues on wire rope hoists are typically caused by worn friction discs or an air gap exceeding 0.200”. For Shaw-Box 800 series, the factory air gap setting is 0.100”. Check Section 7-2 for the full adjustment procedure.', source: 'Shaw-Box 800 Series Manual, Section 7-2, p.23' },
  'loto':      { text: 'Lockout/Tagout is required before any brake or electrical work. Lock the main power switch in the open (OFF) position and tag per OSHA 29 CFR 1910.147. Never remove the brake cover without confirming LOTO is in place.', source: 'OSHA 29 CFR 1910.147' },
  'drift':     { text: 'Hook drift after stopping usually points to one of two causes: (1) Motor brake — air gap has exceeded 0.200”. (2) Load brake — friction washers worn or glazed. If drift occurs with no load, the motor brake is the primary suspect.', source: 'Shaw-Box 800 Series Manual, Section 6-7, p.20' },
  'contactor': { text: 'If the hoist lowers but will not raise, check the contactor assembly first. Verify armatures are free to move — binding is common. If the coil is burned, replace the full contactor assembly (Part No. 800-656).', source: 'Yale Y80 Series Manual, Section 6-4, p.19' },
  'fuse':      { text: 'If the hoist has no response on any control and makes no sounds, the control voltage transformer fuse is the most common cause. Check the fuse first, then inspect the transformer coil for signs of overheating before re-energising.', source: 'World Series Double Girder Manual, Section 6-1, p.22' },
  'wire rope': { text: 'Wire rope should be inspected for: broken wires (more than 2 in any 6-diameter length), kinking, crushing, bird-caging, corrosion, and diameter reduction. Replace immediately if any of these conditions are found.', source: 'ASME B30.2 — Overhead and Gantry Cranes' },
  'overload':  { text: 'If the overload clutch is slipping, first confirm the load does not exceed the rated capacity on the nameplate. Never adjust the overload clutch setting to compensate for overloading.', source: 'Shaw-Box 800 Series Manual, Section 6-7, p.20' },
  'limit switch': { text: 'If the upper limit switch does not stop the hoist, inspect the cam actuator for wear or misalignment. A worn or shifted cam will not contact the switch lever at the correct point in travel. Replace cam and verify switch breaks circuit before returning to service.', source: 'Coffing JLM Series Manual, Section 6-3, p.17' },
  'chain':     { text: 'Measure chain elongation with a chain wear gauge. Replace if link pitch exceeds 3% over nominal length. Also inspect for kinking, corrosion, and damaged pockets. Lubricate with NLGI Grade 2 lubricant at each PM interval.', source: 'Yale Y45 Series Manual, Section 4-3, p.14' },
}

function getBotReply(input, contextWoId) {
  const q = input.toLowerCase()

  // Per-WO scripted response if query matches the WO's fault domain
  if (contextWoId && WO_TRIGGERS[contextWoId]) {
    const matched = WO_TRIGGERS[contextWoId].some(kw => q.includes(kw))
    if (matched && WO_SCRIPTS[contextWoId]) return WO_SCRIPTS[contextWoId]
  }

  // General canned responses
  for (const [keyword, reply] of Object.entries(CANNED)) {
    if (q.includes(keyword)) return reply
  }

  // WO context guard — redirect to the AI diagnosis flow
  if (contextWoId) {
    return {
      text: `I can help with general equipment questions. For fault-specific analysis on ${contextWoId}, tap Get AI Diagnosis on the work order — I'll scan the service history and rank likely faults with manual citations.\n\nOr ask me about: brake adjustment, LOTO procedure, wire rope inspection, contactor replacement, or limit switches.`,
      source: null,
    }
  }

  return {
    text: `I don't have a specific match for that query. Try asking about: motor brake, load drift, contactor, wire rope, LOTO, or overload clutch.`,
    source: null,
  }
}

// ── Streaming message component ────────────────────────────────────────────
function StreamingMessage({ text, source, section, quote, onDone }) {
  const words    = useRef(text.split(/( |\n)/).filter(Boolean))
  const [count,  setCount]  = useState(0)
  const [done,   setDone]   = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    let i = 0
    function tick() {
      i++
      setCount(i)
      if (i >= words.current.length) {
        setDone(true)
        onDone?.()
        return
      }
      const token = words.current[i - 1]
      const delay = /[.!?:]$/.test(token.trim()) ? 160
                  : token === '\n'               ? 80
                  : 36
      timerRef.current = setTimeout(tick, delay)
    }
    timerRef.current = setTimeout(tick, 36)
    return () => clearTimeout(timerRef.current)
  }, [])

  const displayed = words.current.slice(0, count).join('')

  return (
    <div className="space-y-2.5">
      {/* Bubble */}
      <div className="px-4 py-3 rounded-2xl bg-white/8 border border-white/10 text-white/85 text-sm leading-relaxed rounded-bl-sm whitespace-pre-line">
        {displayed}
        {!done && (
          <span
            className="inline-block w-0.5 bg-white/70 ml-0.5 align-middle"
            style={{ height: '1em', animation: 'pulse 0.65s ease-in-out infinite' }}
          />
        )}
      </div>

      {/* Citation card — fades in after streaming completes */}
      {done && source && (
        <div className="rounded-xl overflow-hidden border border-hcsg-blue/25 bg-hcsg-blue/6 animate-fade-in">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-hcsg-blue/15">
            <BookOpen size={12} className="text-hcsg-blue shrink-0" />
            <span className="text-hcsg-blue text-xs font-semibold">{source}</span>
            {section && (
              <span className="text-hcsg-blue/50 text-xs ml-auto shrink-0">{section}</span>
            )}
          </div>
          {quote && (
            <p className="px-3 py-2 text-white/35 text-xs leading-relaxed italic">{quote}</p>
          )}
        </div>
      )}
    </div>
  )
}

const WO_SUGGESTIONS = {
  'WO-2847': ['Hook drift after stopping', 'Air gap measurement', 'LOTO procedure', 'Friction disc replacement'],
  'WO-2851': ['Contactor won\'t raise', 'Contactor coil test', 'LOTO procedure', 'Push button wiring'],
  'WO-2853': ['Control power loss', 'Transformer fuse check', 'PPD LED diagnosis', 'LOTO procedure'],
  'WO-2856': ['Limit switch bypass', 'Cam actuator check', 'LOTO procedure', 'Two-blocking risk'],
  'WO-2854': ['Chain elongation check', 'Brake air gap PM', 'Hook latch inspection', 'LOTO procedure'],
  'WO-2855': ['Wire rope inspection', 'Annual inspection steps', 'Hook throat measurement', 'LOTO procedure'],
}
const DEFAULT_SUGGESTIONS = ['Hook drift after stopping', 'LOTO procedure', 'Wire rope inspection', 'Contactor replacement']

export default function Chat({ contextWoId, onBack }) {
  const suggestions = (contextWoId && WO_SUGGESTIONS[contextWoId]) || DEFAULT_SUGGESTIONS
  const contextLine = contextWoId
    ? ` I can see you're working on ${contextWoId}. Ask me anything specific to that job, or any general equipment question.`
    : " Ask me anything about your equipment — I'll search the indexed manuals and pull the relevant section."

  const [messages,  setMessages]  = useState([{ role: 'bot', text: `Hi ${TECHNICIAN.name.split(' ')[0]}.${contextLine}`, source: null }])
  const [input,     setInput]     = useState('')
  const [streaming, setStreaming] = useState(false) // true while a wow response is streaming
  const [thinking,  setThinking]  = useState(false) // dot animation before reply
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg || thinking || streaming) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setThinking(true)

    const reply  = getBotReply(userMsg, contextWoId)
    const delay  = reply.wow ? 1400 : 900

    setTimeout(() => {
      setThinking(false)
      if (reply.wow) {
        setStreaming(true)
        setMessages(prev => [...prev, { role: 'bot', streaming: true, ...reply }])
      } else {
        setMessages(prev => [...prev, { role: 'bot', ...reply }])
      }
    }, delay)
  }

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/8 active:bg-white/15 transition-colors mr-1 shrink-0"
          >
            <ArrowLeft size={18} className="text-white" />
          </button>
        )}
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#6264A7' }}>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M11.5 5.5C11.5 6.88 10.38 8 9 8C7.62 8 6.5 6.88 6.5 5.5C6.5 4.12 7.62 3 9 3C10.38 3 11.5 4.12 11.5 5.5Z" fill="white"/>
              <path d="M14 7H13C12.45 7 12 7.45 12 8V12C12 12.55 12.45 13 13 13H14C14.55 13 15 12.55 15 12V8C15 7.45 14.55 7 14 7Z" fill="white" opacity="0.7"/>
              <path d="M4 9V13C4 13.55 4.45 14 5 14H11C11.55 14 12 13.55 12 13V9C12 8.45 11.55 8 11 8H5C4.45 8 4 8.45 4 9Z" fill="white"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">AI Assistant</p>
            <p className="text-white/40 text-xs">Also available in Microsoft Teams</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-green-500/15 border border-green-500/20 px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-medium">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-hcsg-orange/20 border border-hcsg-orange/30 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <Zap size={12} className="text-hcsg-orange" fill="currentColor" />
              </div>
            )}
            <div className={`max-w-[82%] space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              {msg.streaming ? (
                <StreamingMessage
                  text={msg.text}
                  source={msg.source}
                  section={msg.section}
                  quote={msg.quote}
                  onDone={() => setStreaming(false)}
                />
              ) : (
                <>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-hcsg-orange text-white rounded-br-sm'
                      : 'bg-white/8 border border-white/10 text-white/85 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.source && !msg.section && (
                    <div className="flex items-center gap-1.5 px-1">
                      <BookOpen size={11} className="text-hcsg-blue" />
                      <span className="text-hcsg-blue text-xs">{msg.source}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {/* Thinking dots */}
        {thinking && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-hcsg-orange/20 border border-hcsg-orange/30 flex items-center justify-center shrink-0">
              <Zap size={12} className="text-hcsg-orange" fill="currentColor" />
            </div>
            <div className="bg-white/8 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-white/40"
                  style={{ animation: 'pulse 1s ease-in-out infinite', animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="shrink-0 text-xs text-white/60 bg-white/8 border border-white/10 px-3 py-1.5 rounded-full active:bg-white/15 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about equipment, faults, procedures..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || thinking || streaming}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !thinking && !streaming ? 'bg-hcsg-orange text-white' : 'bg-white/8 text-white/25'
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
