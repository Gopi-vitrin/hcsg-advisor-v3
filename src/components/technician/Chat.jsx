import { useState, useRef, useEffect } from 'react'
import { Send, Zap, BookOpen } from 'lucide-react'
import { TECHNICIAN, WORK_ORDERS } from '../../data'

const CANNED = {
  'brake':        { text: 'Motor brake issues on wire rope hoists are typically caused by worn friction discs or an air gap exceeding 0.200". For Shaw-Box 800 series, the factory air gap setting is 0.100". Check Section 7-2 of the Shaw-Box 800 Series Manual for the full adjustment procedure.', source: 'Shaw-Box 800 Series Manual, Section 7-2, p.23' },
  'loto':         { text: 'Lockout/Tagout is required before any brake or electrical work. Lock the main power switch in the open (OFF) position and tag per OSHA 29 CFR 1910.147. Never remove the brake cover without confirming LOTO is in place.', source: 'OSHA 29 CFR 1910.147' },
  'drift':        { text: 'Hook drift after stopping usually points to one of two causes: (1) Motor brake — air gap has exceeded 0.200", causing the brake to release too slowly. (2) Load brake — friction washers are worn or glazed. If drift occurs with no load, the motor brake is the primary suspect.', source: 'Shaw-Box 800 Series Manual, Section 6-7, p.20' },
  'contactor':    { text: 'If the hoist lowers but will not raise, check the contactor assembly first. Verify armatures are free to move — binding is common. Also check for burned-out coils. If the coil is burned, replace the full contactor assembly (Part No. 800-656).', source: 'Yale Y80 Series Manual, Section 6-4, p.19' },
  'fuse':         { text: 'If the hoist has no response on any control and makes no sounds, the control voltage transformer fuse is the most common cause. Check the fuse first, then inspect the transformer coil for signs of overheating before re-energising.', source: 'World Series Double Girder Manual, Section 6-1, p.22' },
  'wire rope':    { text: 'Wire rope should be inspected for: broken wires (more than 2 in any 6-diameter length), kinking, crushing, bird-caging, corrosion, and reduction in diameter. Replace immediately if any of these conditions are found.', source: 'ASME B30.2 — Overhead and Gantry Cranes' },
  'overload':     { text: 'If the overload clutch is slipping, first confirm the load does not exceed the rated capacity shown on the nameplate. Reduce loading to rated capacity before any further diagnostic steps. Never attempt to adjust the overload clutch setting to compensate for overloading.', source: 'Shaw-Box 800 Series Manual, Section 6-7, p.20' },
}

function getBotReply(input) {
  const q = input.toLowerCase()
  for (const [keyword, reply] of Object.entries(CANNED)) {
    if (q.includes(keyword)) return reply
  }
  return {
    text: "I don't have a specific match for that query in the indexed manuals. Try asking about: motor brake, load drift, contactor, wire rope, LOTO, or overload clutch. For complex issues, escalate to your service manager.",
    source: null,
  }
}

const SUGGESTIONS = ['Hook drift after stopping', 'LOTO procedure', 'Wire rope inspection', 'Contactor replacement']

export default function Chat({ onSelectWO, contextWoId }) {
  const contextLine = contextWoId
    ? ` I can see you're working on ${contextWoId}. Ask me anything specific to that job, or any general equipment question.`
    : ' Ask me anything about your equipment — I\'ll search the indexed manuals and pull the relevant section.'

  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `Hi ${TECHNICIAN.name.split(' ')[0]}.${contextLine}`,
      source: null,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function sendMessage(text) {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setTyping(true)

    setTimeout(() => {
      const reply = getBotReply(userMsg)
      setTyping(false)
      setMessages(prev => [...prev, { role: 'bot', ...reply }])
    }, 900)
  }

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          {/* Microsoft Teams icon */}
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
            <div className={`max-w-[78%] space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-hcsg-orange text-white rounded-br-sm'
                  : 'bg-white/8 border border-white/10 text-white/85 rounded-bl-sm'
              }`}>
                {msg.text}
              </div>
              {msg.source && (
                <div className="flex items-center gap-1.5 px-1">
                  <BookOpen size={11} className="text-hcsg-blue" />
                  <span className="text-hcsg-blue text-xs">{msg.source}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-hcsg-orange/20 border border-hcsg-orange/30 flex items-center justify-center shrink-0">
              <Zap size={12} className="text-hcsg-orange" fill="currentColor" />
            </div>
            <div className="bg-white/8 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1">
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

      {/* Suggestion chips — only on first load */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {SUGGESTIONS.map(s => (
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
            disabled={!input.trim()}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              input.trim() ? 'bg-hcsg-orange text-white' : 'bg-white/8 text-white/25'
            }`}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
