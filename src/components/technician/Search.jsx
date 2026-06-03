import { useState } from 'react'
import { Search as SearchIcon, X, MapPin, ChevronRight, Zap } from 'lucide-react'
import { WORK_ORDERS } from '../../data'

const ALL_WOS = Object.values(WORK_ORDERS)

function match(wo, query) {
  const q = query.toLowerCase()
  return (
    wo.id.toLowerCase().includes(q) ||
    wo.customer.toLowerCase().includes(q) ||
    wo.site.toLowerCase().includes(q) ||
    wo.equipment.toLowerCase().includes(q) ||
    wo.complaint.toLowerCase().includes(q)
  )
}

const PRIORITY_STYLES = {
  High:   'bg-hcsg-dark-red text-white',
  Medium: 'bg-hcsg-amber text-hcsg-navy',
}

export default function Search({ onSelectWO }) {
  const [query, setQuery] = useState('')
  const results = query.length > 0 ? ALL_WOS.filter(wo => match(wo, query)) : []

  return (
    <div className="flex flex-col h-full bg-hcsg-navy">

      {/* Search bar */}
      <div className="px-4 pt-5 pb-3">
        <p className="text-white font-semibold text-lg mb-3">Search</p>
        <div className="flex items-center gap-2 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
          <SearchIcon size={16} className="text-white/30 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Customer, equipment, WO number..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')}>
              <X size={15} className="text-white/30" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {query.length === 0 && (
          <div className="space-y-3 mt-2">
            <p className="text-white/30 text-xs uppercase tracking-widest">Recent work orders</p>
            {ALL_WOS.map(wo => (
              <ResultCard key={wo.id} wo={wo} onTap={onSelectWO} />
            ))}
          </div>
        )}

        {query.length > 0 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 gap-2">
            <SearchIcon size={32} className="text-white/15" />
            <p className="text-white/30 text-sm">No results for "{query}"</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3 mt-2">
            <p className="text-white/30 text-xs uppercase tracking-widest">{results.length} result{results.length !== 1 ? 's' : ''}</p>
            {results.map(wo => (
              <ResultCard key={wo.id} wo={wo} onTap={onSelectWO} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ResultCard({ wo, onTap }) {
  const PRIORITY_STYLES = {
    High:   'bg-hcsg-dark-red text-white',
    Medium: 'bg-hcsg-amber text-hcsg-navy',
  }
  return (
    <button
      onClick={() => onTap(wo.id)}
      className="w-full text-left bg-white/5 border border-white/10 rounded-2xl p-4 active:bg-white/10 transition-colors"
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-white/40 text-xs font-mono">{wo.id}</span>
        <div className="flex items-center gap-1.5">
          {wo.aiReady && <Zap size={11} className="text-green-400" fill="currentColor" />}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[wo.priority]}`}>
            {wo.priority.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="text-white font-semibold text-sm">{wo.customer}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <MapPin size={11} className="text-white/30" />
        <p className="text-white/40 text-xs">{wo.site}</p>
      </div>
      <p className="text-white/30 text-xs mt-1.5 line-clamp-1">{wo.equipment}</p>
    </button>
  )
}
