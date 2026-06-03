import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, X, Loader, Plus, FolderOpen } from 'lucide-react'
import { KNOWLEDGE_BASE } from '../../data'

const BC = { fontFamily: "'Barlow Condensed', sans-serif" }

const SP_FILES = [
  { name: 'Elevator Hydraulic Systems Manual — Thyssen.pdf', type: 'Manual', equipment: 'Industrial Elevators', pages: 68, size: '8.2 MB' },
  { name: 'HCSG Dock Equipment Service Bulletin Q1-2026.pdf', type: 'Bulletin', equipment: 'Dock & Door Systems', pages: 12, size: '1.4 MB' },
  { name: 'Overhead Crane Inspection Checklist ASME B30.2.pdf', type: 'Checklist', equipment: 'Bridge Crane', pages: 24, size: '2.8 MB' },
]

const EQUIP_TYPES = ['Wire Rope Hoist','Chain Hoist','Bridge Crane','Overhead Crane','Industrial Elevators','Dock & Door Systems','Other']
const DOC_TYPES   = ['Manual','Service Bulletin','Inspection Checklist','Parts Catalogue']
const TODAY = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function SPModal({ onClose, onImport }) {
  const [sel, setSel] = useState([])
  const [done, setDone] = useState([])
  const [importing, setImporting] = useState(false)
  const toggle = n => setSel(p => p.includes(n) ? p.filter(x => x !== n) : [...p, n])

  function go() {
    setImporting(true)
    let d = []
    SP_FILES.filter(f => sel.includes(f.name)).forEach((f, i) => {
      setTimeout(() => {
        d = [...d, f.name]; setDone([...d])
        if (d.length === sel.length) setTimeout(() => onImport(SP_FILES.filter(f => sel.includes(f.name))), 600)
      }, 800 + i * 700)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg overflow-hidden" style={{ borderRadius: 6 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #f0f2f5' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: '#0078D4', borderRadius: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-6h2v6zm0-8h-2V6.5h2V8.5z"/></svg>
            </div>
            <div>
              <p className="font-800 text-slate-800 text-sm" style={BC}>IMPORT FROM SHAREPOINT</p>
              <p className="text-slate-400 text-xs" style={{ fontFamily: "'Barlow', sans-serif" }}>HCSG Corporate Library · Technical Documents</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
        </div>
        <div className="px-6 py-4 space-y-2 max-h-64 overflow-y-auto">
          {SP_FILES.map(f => {
            const isSel = sel.includes(f.name), isDone = done.includes(f.name)
            return (
              <button key={f.name} onClick={() => !importing && toggle(f.name)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                style={{ borderRadius: 4, border: isDone ? '1px solid rgba(74,222,128,0.3)' : isSel ? '1px solid rgba(230,94,37,0.3)' : '1px solid #f0f2f5', background: isDone ? 'rgba(74,222,128,0.04)' : isSel ? 'rgba(230,94,37,0.04)' : 'white' }}>
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ borderRadius: 4, background: isDone ? '#dcfce7' : '#fee2e2' }}>
                  {isDone ? <CheckCircle size={14} className="text-green-600" /> : <FileText size={14} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm font-semibold truncate" style={{ fontFamily: "'Barlow', sans-serif" }}>{f.name}</p>
                  <p className="text-slate-400 text-xs">{f.type} · {f.size}</p>
                </div>
                {isDone ? <span className="text-green-600 text-xs font-700 shrink-0" style={BC}>INDEXED</span>
                  : importing && isSel ? <Loader size={13} className="text-hcsg-orange animate-spin shrink-0" />
                  : isSel ? <CheckCircle size={14} className="text-hcsg-orange shrink-0" /> : null}
              </button>
            )
          })}
        </div>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid #f0f2f5' }}>
          <p className="text-slate-400 text-xs">{sel.length} selected</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm">Cancel</button>
            <button onClick={go} disabled={!sel.length || importing} className="px-5 py-2 text-sm font-700 text-white" style={{ ...BC, background: sel.length && !importing ? '#e65e25' : '#e2e8f0', color: sel.length && !importing ? 'white' : '#94a3b8', borderRadius: 4 }}>
              {importing ? 'INDEXING…' : 'IMPORT & INDEX'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UploadModal({ onClose, onDone }) {
  const ref = useRef()
  const [file, setFile] = useState(null)
  const [equip, setEquip] = useState('')
  const [type, setType] = useState('Manual')
  const [stage, setStage] = useState('form')
  const [prog, setProg] = useState(0)

  function run() {
    setStage('upload'); let p = 0
    const t = setInterval(() => { p += Math.random() * 18 + 8; if (p >= 100) { p = 100; clearInterval(t); setProg(100); setTimeout(() => { setStage('index'); setTimeout(() => { setStage('done'); setTimeout(() => onDone({ name: file.name.replace(/\.pdf$/i,''), type, equipment: equip, pages: Math.floor(Math.random()*40)+20, status:'Indexed', uploaded: TODAY, source:'Upload' }), 700) }, 1200) }, 300) } else setProg(Math.round(p)); }, 100)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md overflow-hidden" style={{ borderRadius: 6 }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #f0f2f5', borderTop: '3px solid #e65e25' }}>
          <div className="flex items-center gap-3">
            <Upload size={16} className="text-hcsg-orange" />
            <p className="font-800 text-slate-800 text-sm" style={BC}>UPLOAD MANUAL</p>
          </div>
          {stage === 'form' && <button onClick={onClose}><X size={16} className="text-slate-400" /></button>}
        </div>
        <div className="px-6 py-5 space-y-4">
          {stage === 'form' && (
            <>
              <div onClick={() => ref.current?.click()} className="flex flex-col items-center justify-center py-6 cursor-pointer" style={{ border: `2px dashed ${file ? 'rgba(74,222,128,0.4)' : 'rgba(230,94,37,0.25)'}`, borderRadius: 4, background: file ? 'rgba(74,222,128,0.03)' : 'rgba(230,94,37,0.02)' }}>
                <input ref={ref} type="file" accept=".pdf" className="hidden" onChange={e => setFile(e.target.files?.[0])} />
                {file ? <><CheckCircle size={24} className="text-green-500 mb-2" /><p className="text-slate-700 text-sm font-semibold truncate max-w-xs">{file.name}</p><p className="text-slate-400 text-xs">{(file.size/1048576).toFixed(1)} MB · Click to change</p></> : <><Upload size={24} className="text-hcsg-orange/40 mb-2" /><p className="text-slate-500 text-sm">Drop PDF or <span style={{ color: '#e65e25' }}>browse files</span></p></>}
              </div>
              <div>
                <p className="font-700 text-slate-500 text-xs tracking-widest uppercase mb-1.5" style={BC}>EQUIPMENT TYPE</p>
                <select value={equip} onChange={e => setEquip(e.target.value)} className="w-full px-3 py-2.5 text-slate-700 text-sm bg-white" style={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                  <option value="">Select…</option>
                  {EQUIP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-2 flex-wrap">
                {DOC_TYPES.map(t => <button key={t} onClick={() => setType(t)} className="text-xs font-700 px-3 py-1.5" style={{ ...BC, borderRadius: 3, background: type === t ? '#011e41' : 'white', color: type === t ? 'white' : '#64748b', border: '1px solid #e2e8f0' }}>{t.toUpperCase()}</button>)}
              </div>
            </>
          )}
          {stage === 'upload' && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-3">
                <FileText size={16} className="text-hcsg-orange shrink-0" />
                <div className="flex-1"><p className="text-slate-700 text-sm font-semibold truncate">{file?.name}</p><p className="text-slate-400 text-xs">Uploading…</p></div>
                <span className="font-800 text-sm" style={{ ...BC, color: '#e65e25' }}>{prog}%</span>
              </div>
              <div className="h-1.5" style={{ background: '#f0f2f5', borderRadius: 2 }}><div className="h-full transition-all" style={{ width: `${prog}%`, background: '#e65e25', borderRadius: 2 }} /></div>
            </div>
          )}
          {stage === 'index' && (
            <div className="py-4 flex items-center gap-3">
              <Loader size={18} className="text-hcsg-blue animate-spin shrink-0" />
              <div><p className="text-slate-700 text-sm font-semibold">Indexing document…</p><p className="text-slate-400 text-xs">Building search index</p></div>
            </div>
          )}
          {stage === 'done' && (
            <div className="py-4 flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center" style={{ background: '#dcfce7', borderRadius: 4 }}><CheckCircle size={18} className="text-green-600" /></div>
              <div><p className="text-slate-700 text-sm font-semibold">Indexed successfully</p><p className="text-slate-400 text-xs">{file?.name} ready for AI queries</p></div>
            </div>
          )}
        </div>
        {stage === 'form' && (
          <div className="px-6 py-4 flex justify-end gap-2" style={{ borderTop: '1px solid #f0f2f5' }}>
            <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm">Cancel</button>
            <button onClick={run} disabled={!file || !equip} className="px-5 py-2 text-sm font-700 text-white" style={{ ...BC, background: file && equip ? '#e65e25' : '#e2e8f0', color: file && equip ? 'white' : '#94a3b8', borderRadius: 4 }}>
              UPLOAD & INDEX
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function KnowledgeBase() {
  const [showSP, setShowSP] = useState(false)
  const [showUp, setShowUp] = useState(false)
  const [extras, setExtras] = useState([])
  const [banner, setBanner] = useState(null)

  function handleImport(files) {
    setShowSP(false)
    setExtras(p => [...p, ...files.map(f => ({ name: f.name.replace('.pdf',''), type: f.type, equipment: f.equipment, pages: f.pages, status: 'Indexed', uploaded: TODAY, source: 'SharePoint' }))])
    setBanner('sharepoint'); setTimeout(() => setBanner(null), 4000)
  }
  function handleUpload(doc) {
    setShowUp(false); setExtras(p => [...p, doc])
    setBanner('upload'); setTimeout(() => setBanner(null), 4000)
  }

  const allDocs = [...KNOWLEDGE_BASE.documents, ...extras]

  return (
    <div className="p-8 max-w-5xl">
      {showSP && <SPModal onClose={() => setShowSP(false)} onImport={handleImport} />}
      {showUp && <UploadModal onClose={() => setShowUp(false)} onDone={handleUpload} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-800 text-hcsg-orange" style={BC}>›</span>
            <p className="font-700 text-slate-400 text-xs tracking-widest uppercase" style={BC}>DOCUMENT MANAGEMENT</p>
          </div>
          <h1 className="font-800 text-hcsg-navy" style={{ ...BC, fontSize: 26, letterSpacing: '-0.3px' }}>KNOWLEDGE BASE</h1>
          <p className="text-slate-400 text-sm mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>{allDocs.length} documents · {KNOWLEDGE_BASE.totalPages} pages · Last updated {KNOWLEDGE_BASE.lastUpdated}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSP(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm bg-white font-700" style={{ ...BC, border: '1px solid #e2e8f0', borderRadius: 4, color: '#334155' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" fill="#0078D4"/><path d="M9 8h6M9 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
            ADD FROM SHAREPOINT
          </button>
          <button onClick={() => setShowUp(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-white font-700" style={{ ...BC, background: '#e65e25', borderRadius: 4 }}>
            <Upload size={14} />UPLOAD MANUAL
          </button>
        </div>
      </div>

      {banner && (
        <div className="flex items-center gap-3 px-5 py-3 mb-5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 4 }}>
          <CheckCircle size={15} className="text-green-600 shrink-0" />
          <p className="text-green-700 text-sm font-semibold" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {banner === 'upload' ? 'Manual uploaded and indexed.' : `${extras.filter(e => e.source === 'SharePoint').length} documents imported from SharePoint.`}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white mb-6 overflow-hidden" style={{ borderRadius: 6, border: '1px solid #e2e8f0', borderTop: '3px solid #e65e25' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f0f2f5' }}>
          <p className="font-800 text-slate-700 text-sm" style={BC}>INDEXED DOCUMENTS</p>
          <span className="font-700 text-slate-400 text-xs" style={BC}>{allDocs.length} TOTAL</span>
        </div>
        <table className="w-full">
          <thead><tr style={{ background: '#f8fafc' }}>{['DOCUMENT','TYPE','EQUIPMENT','PAGES','SOURCE','STATUS','UPLOADED'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-700 tracking-widest text-slate-400" style={BC}>{h}</th>)}</tr></thead>
          <tbody className="divide-y" style={{ borderColor: '#f8fafc' }}>
            {allDocs.map((d, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText size={13} className="text-hcsg-blue shrink-0" />
                    <span className="text-slate-700 text-sm font-semibold" style={{ fontFamily: "'Barlow', sans-serif" }}>{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-500 text-sm">{d.type}</td>
                <td className="px-4 py-3.5 text-slate-500 text-sm">{d.equipment}</td>
                <td className="px-4 py-3.5 text-slate-500 text-sm">{d.pages}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs font-700 px-2 py-0.5 whitespace-nowrap" style={{ ...BC, borderRadius: 3, background: d.source === 'SharePoint' ? '#eff6ff' : '#f5f3ff', color: d.source === 'SharePoint' ? '#3b82f6' : '#7c3aed', border: `1px solid ${d.source === 'SharePoint' ? '#bfdbfe' : '#ddd6fe'}` }}>{d.source.toUpperCase()}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-green-600 text-xs font-700 whitespace-nowrap" style={BC}><CheckCircle size={11} />{d.status.toUpperCase()}</span>
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{d.uploaded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coverage gaps */}
      <div className="bg-white overflow-hidden" style={{ borderRadius: 6, border: '1px solid #e2e8f0', borderTop: '3px solid #f5a524' }}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid #f0f2f5' }}>
          <AlertTriangle size={14} className="text-hcsg-amber" />
          <p className="font-800 text-slate-700 text-sm" style={BC}>COVERAGE GAPS · {KNOWLEDGE_BASE.coverageGaps.length} IDENTIFIED</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#f8fafc' }}>
          {KNOWLEDGE_BASE.coverageGaps.map((g, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 flex items-center justify-center bg-slate-100 shrink-0" style={{ borderRadius: 4 }}>
                <FolderOpen size={15} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-slate-700 text-sm font-semibold" style={{ fontFamily: "'Barlow', sans-serif" }}>{g.equipment}</p>
                <p className="text-slate-400 text-xs mt-0.5">{g.status}</p>
              </div>
              <span className="text-xs font-700 px-2.5 py-1" style={{ ...BC, borderRadius: 3, background: g.priority === 'High' ? '#fef2f2' : '#fffbeb', color: g.priority === 'High' ? '#dc2626' : '#d97706', border: `1px solid ${g.priority === 'High' ? '#fecaca' : '#fde68a'}` }}>{g.priority.toUpperCase()}</span>
              <button onClick={() => setShowSP(true)} className="flex items-center gap-1 text-xs font-700" style={{ ...BC, color: '#1159af' }}><Plus size={12} /> ADD DOCS</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
