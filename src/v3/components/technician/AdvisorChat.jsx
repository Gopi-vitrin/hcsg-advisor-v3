import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Mic, MicOff, Send, BookOpen, Star, ChevronRight } from 'lucide-react'
import { AI_RESPONSES, SUGGESTED_PROMPTS } from '../../data'

export default function AdvisorChat({ equipment, onBack }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [listeningVoice, setListeningVoice] = useState(false)
  const [openRefKey, setOpenRefKey] = useState(null)
  const [showChips, setShowChips] = useState(true)
  const scrollRef = useRef(null)
  const responseIdx = useRef(0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  function send(text) {
    const t = text.trim()
    if (!t || isTyping) return
    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: t,
      time: fmtTime(),
      isVoice: listeningVoice,
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowChips(false)
    setIsTyping(true)

    const delay = 1000 + Math.random() * 700
    setTimeout(() => {
      setIsTyping(false)
      const ai = AI_RESPONSES[responseIdx.current % AI_RESPONSES.length]
      responseIdx.current++
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'ai',
        text: ai.text,
        time: fmtTime(),
        refs: ai.refs || [],
        workOrderCitation: ai.workOrderCitation || null,
      }])
    }, delay)
  }

  function toggleVoice() {
    if (listeningVoice) {
      setListeningVoice(false)
      if (input.trim()) send(input)
    } else {
      setListeningVoice(true)
      // Simulate voice capture after 2.5s
      setTimeout(() => {
        setInput("It won't lift past halfway. The hoist makes a humming sound and just stops.")
        setListeningVoice(false)
      }, 2500)
    }
  }

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col" style={{ height: '88vh' }}>
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-hcsg-navy rounded-b-2xl z-10 pointer-events-none" />

      {/* Header */}
      <div className="shrink-0 pt-10 px-4 pb-3 bg-hcsg-surface border-b border-hcsg-light-gray">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-full bg-white border border-hcsg-light-gray flex items-center justify-center shrink-0 shadow-sm">
            <ArrowLeft size={15} className="text-hcsg-muted" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-hcsg-navy truncate">{equipment?.model}</div>
            <div className="text-xs text-hcsg-muted truncate">{equipment?.serial} · {equipment?.type}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-hcsg-orange flex items-center justify-center shrink-0">
            <BookOpen size={14} className="text-white" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🔧</div>
            <div className="font-bold text-hcsg-navy text-sm mb-1">What's the issue?</div>
            <div className="text-xs text-hcsg-muted">Describe the fault or ask a question.<br />I'll search the manual and past jobs.</div>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            openRefKey={openRefKey}
            setOpenRefKey={setOpenRefKey}
          />
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Suggested chips */}
      {showChips && (
        <div className="shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => send(p)}
              className="shrink-0 bg-hcsg-surface text-hcsg-muted text-xs px-3 py-1.5 rounded-full border border-hcsg-light-gray whitespace-nowrap hover:border-hcsg-orange hover:text-hcsg-orange transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 px-4 pb-7 pt-2 border-t border-hcsg-light-gray">
        <div className="flex items-end gap-2">
          <button
            onClick={toggleVoice}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${listeningVoice ? 'bg-hcsg-dark-red text-white animate-pulse' : 'bg-hcsg-surface border border-hcsg-light-gray text-hcsg-muted'}`}
          >
            {listeningVoice ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
          <div className="flex-1 bg-hcsg-surface border border-hcsg-light-gray rounded-2xl px-4 py-2.5 flex items-end gap-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) } }}
              placeholder={listeningVoice ? 'Listening...' : 'Ask about this equipment...'}
              rows={1}
              className="flex-1 bg-transparent text-sm text-hcsg-navy placeholder-hcsg-muted/60 outline-none resize-none leading-5"
              style={{ maxHeight: '80px' }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              className="w-8 h-8 rounded-full bg-hcsg-orange flex items-center justify-center shrink-0 disabled:opacity-30 transition-opacity"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
        {listeningVoice && (
          <div className="flex items-center gap-2 mt-2 px-1">
            <div className="flex gap-0.5 items-end h-4">
              {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
                <div key={i} className="w-0.5 bg-hcsg-dark-red rounded-full animate-pulse" style={{ height: `${h * 2}px`, animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
            <span className="text-xs text-hcsg-dark-red font-medium">Listening — tap mic to finish</span>
          </div>
        )}
      </div>
    </div>
  )
}

function MessageBubble({ msg, openRefKey, setOpenRefKey }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-hcsg-orange flex items-center justify-center shrink-0 mb-1">
          <span className="text-white text-[10px] font-black">AI</span>
        </div>
      )}
      <div className={`max-w-[84%] ${isUser ? 'bg-hcsg-navy text-white rounded-[1.2rem] rounded-tr-sm' : 'bg-hcsg-surface text-hcsg-navy rounded-[1.2rem] rounded-tl-sm'} px-4 py-3`}>
        {msg.isVoice && isUser && (
          <div className="flex items-center gap-1 mb-1 opacity-60">
            <Mic size={10} />
            <span className="text-[10px]">Voice</span>
          </div>
        )}
        <div className="text-sm leading-relaxed">{parseBold(msg.text)}</div>

        {/* Manual references */}
        {msg.refs && msg.refs.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {msg.refs.map((ref, i) => {
              const key = `${msg.id}-${i}`
              const isOpen = openRefKey === key
              return (
                <div key={i} className="w-full">
                  <button
                    onClick={() => setOpenRefKey(isOpen ? null : key)}
                    className="flex items-center gap-1.5 bg-white text-hcsg-blue text-xs px-2.5 py-1 rounded-full border border-blue-200 font-medium hover:bg-blue-50 transition-colors"
                  >
                    <BookOpen size={10} />
                    {ref.label}
                    <ChevronRight size={10} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="mt-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs text-hcsg-blue">
                      📖 <strong>{ref.label}</strong> — opening page {ref.page}
                      <span className="text-hcsg-muted ml-1">(simulated)</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Work-order learning citation */}
        {msg.workOrderCitation && (
          <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={11} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-700">Past resolution</span>
              <span className="text-[10px] text-amber-400 ml-0.5">· simulated</span>
            </div>
            <div className="text-xs font-semibold text-amber-800">{msg.workOrderCitation.text}</div>
            <div className="text-xs text-amber-700 mt-0.5 leading-relaxed">{msg.workOrderCitation.resolution}</div>
            <div className="text-[10px] text-amber-500 mt-1">{msg.workOrderCitation.techName} · {msg.workOrderCitation.date}</div>
          </div>
        )}

        <div className={`text-[10px] mt-1.5 ${isUser ? 'text-white/40' : 'text-hcsg-muted/50'}`}>{msg.time}</div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-6 h-6 rounded-full bg-hcsg-orange flex items-center justify-center shrink-0">
        <span className="text-white text-[10px] font-black">AI</span>
      </div>
      <div className="bg-hcsg-surface rounded-[1.2rem] rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 150, 300].map(delay => (
            <div
              key={delay}
              className="w-1.5 h-1.5 bg-hcsg-muted rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function parseBold(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

function fmtTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
