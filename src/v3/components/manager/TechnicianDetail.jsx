import { ArrowLeft, MessageSquare, BookOpen, Star } from 'lucide-react'

export default function TechnicianDetail({ tech, onBack }) {
  const session = tech.sessionRef

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-8 py-5 border-b border-hcsg-light-gray bg-white">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-9 h-9 rounded-full border border-hcsg-light-gray flex items-center justify-center hover:bg-hcsg-surface transition-colors">
            <ArrowLeft size={17} className="text-hcsg-muted" />
          </button>
          <div className="w-11 h-11 rounded-full bg-hcsg-navy text-white font-bold text-base flex items-center justify-center shrink-0">
            {tech.avatar}
          </div>
          <div>
            <div className="font-bold text-hcsg-navy text-base">{tech.name}</div>
            <div className="text-sm text-hcsg-muted">
              {session?.equipment?.model || tech.equipment} · {tech.role}
            </div>
          </div>
        </div>

        {/* Teams button */}
        <a
          href="#"
          onClick={e => e.preventDefault()}
          className="flex items-center gap-2 bg-[#5b5fc7] hover:bg-[#4b4fb7] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <TeamsIcon />
          Message in Teams
        </a>
      </div>

      {/* Conversation */}
      {session ? (
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          <div className="text-xs text-hcsg-muted text-center mb-2">
            Session started {session.startedAt} · {session.messages.length} messages
            <span className="ml-2 text-hcsg-muted/50">· read-only</span>
          </div>

          {session.messages.map(msg => (
            <ConvMessage key={msg.id} msg={msg} tech={tech} />
          ))}

          {session.status === 'active' && (
            <div className="flex items-center gap-2 justify-start mt-2">
              <div className="w-7 h-7 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-[10px] font-black">AI</div>
              <div className="bg-hcsg-surface rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  {[0, 150, 300].map(d => (
                    <div key={d} className="w-1.5 h-1.5 bg-hcsg-muted rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
              <span className="text-xs text-hcsg-muted italic">AI advisor is composing a response...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-hcsg-muted">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm">No active session for this technician</div>
          </div>
        </div>
      )}
    </div>
  )
}

function ConvMessage({ msg, tech }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-hcsg-orange flex items-center justify-center text-white text-[10px] font-black shrink-0 mb-1">AI</div>
      )}
      <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${isUser ? 'bg-hcsg-navy text-white rounded-tr-sm' : 'bg-white border border-hcsg-light-gray text-hcsg-navy rounded-tl-sm shadow-sm'}`}>
        <div className="text-sm leading-relaxed">{parseBold(msg.text)}</div>

        {/* Manual refs */}
        {msg.refs && msg.refs.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {msg.refs.map((ref, i) => (
              <span key={i} className="flex items-center gap-1 bg-blue-50 text-hcsg-blue text-xs px-2.5 py-1 rounded-full border border-blue-200 font-medium">
                <BookOpen size={10} />
                {ref.label}
              </span>
            ))}
          </div>
        )}

        {/* Work-order citation */}
        {msg.workOrderCitation && (
          <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={11} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-700">Past resolution</span>
              <span className="text-[10px] text-amber-400">· simulated</span>
            </div>
            <div className="text-xs font-semibold text-amber-800">{msg.workOrderCitation.text}</div>
            <div className="text-xs text-amber-700 mt-0.5">{msg.workOrderCitation.resolution}</div>
            <div className="text-[10px] text-amber-500 mt-1">{msg.workOrderCitation.techName} · {msg.workOrderCitation.date}</div>
          </div>
        )}

        <div className={`text-[10px] mt-1.5 ${isUser ? 'text-white/40' : 'text-hcsg-muted/50'}`}>{msg.time}</div>
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-hcsg-sienna/20 text-hcsg-sienna font-bold text-xs flex items-center justify-center shrink-0 mb-1">
          {tech.avatar}
        </div>
      )}
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

function TeamsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect width="16" height="16" rx="3" fill="white" fillOpacity="0.2" />
      <path d="M10.5 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8.5 8a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM9 9.5H6a2 2 0 0 0-2 2V13h7v-1.5a2 2 0 0 0-2-2Z" fill="white" />
      <path d="M10.5 7c.4 0 .8.1 1.1.3A2 2 0 0 1 13 9v3h-2V9.5A3.5 3.5 0 0 0 9 6.04c.5-.36 1-.54 1.5-.04Z" fill="white" fillOpacity="0.7" />
    </svg>
  )
}
