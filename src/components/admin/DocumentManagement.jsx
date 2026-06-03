import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, X, FolderOpen, Loader, Plus } from 'lucide-react'
import { KNOWLEDGE_BASE } from '../../data'

const SOURCE_STYLES = {
  SharePoint:      'bg-blue-50 text-blue-600 border-blue-100',
  'Corporate Drive': 'bg-purple-50 text-purple-600 border-purple-100',
}

const PRIORITY_STYLES = {
  High:   'bg-red-50 text-red-600 border-red-100',
  Medium: 'bg-amber-50 text-amber-600 border-amber-100',
}

// Simulated SharePoint files — each maps to a full table row on import
const SHAREPOINT_FILES = [
  { name: 'Elevator Hydraulic Systems Manual — Thyssen.pdf',    size: '8.2 MB',  type: 'Manual',    equipment: 'Industrial Elevators', pages: 68, source: 'SharePoint' },
  { name: 'HCSG Dock Equipment Service Bulletin Q1-2026.pdf',   size: '1.4 MB',  type: 'Bulletin',  equipment: 'Dock & Door Systems',  pages: 12, source: 'SharePoint' },
  { name: 'Overhead Crane Inspection Checklist ASME B30.2.pdf', size: '2.8 MB',  type: 'Checklist', equipment: 'Bridge Crane',         pages: 24, source: 'SharePoint' },
]

function SharePointModal({ onClose, onImport }) {
  const [selected, setSelected] = useState([])
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState([])

  function toggle(name) {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  function handleImport() {
    setImporting(true)
    let done = []
    SHAREPOINT_FILES.filter(f => selected.includes(f.name)).forEach((f, i) => {
      setTimeout(() => {
        done = [...done, f.name]
        setImported([...done])
        if (done.length === selected.length) {
          setTimeout(() => {
          setImporting(false)
          onImport(SHAREPOINT_FILES.filter(f => selected.includes(f.name)))
        }, 600)
        }
      }, 800 + i * 600)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0078D4' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-6h2v6zm0-8h-2V6.5h2V8.5z"/>
              </svg>
            </div>
            <div>
              <p className="text-slate-800 font-semibold text-sm">Import from SharePoint</p>
              <p className="text-slate-400 text-xs">HCSG Corporate Library · Technical Documents</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* File list */}
        <div className="px-6 py-4 space-y-2 max-h-72 overflow-y-auto">
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Available documents</p>
          {SHAREPOINT_FILES.map(file => {
            const isSelected = selected.includes(file.name)
            const isImported = imported.includes(file.name)
            return (
              <button
                key={file.name}
                onClick={() => !importing && toggle(file.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  isImported ? 'border-green-200 bg-green-50' :
                  isSelected ? 'border-hcsg-blue/30 bg-blue-50' :
                  'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isImported ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {isImported
                    ? <CheckCircle size={16} className="text-green-600" />
                    : <FileText size={16} className="text-red-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm font-medium truncate">{file.name}</p>
                  <p className="text-slate-400 text-xs">{file.type} · {file.size}</p>
                </div>
                {isImported
                  ? <span className="text-green-600 text-xs font-semibold shrink-0">Indexed</span>
                  : importing && isSelected
                  ? <Loader size={14} className="text-hcsg-blue animate-spin shrink-0" />
                  : isSelected
                  ? <CheckCircle size={16} className="text-hcsg-blue shrink-0" />
                  : null
                }
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-slate-400 text-xs">{selected.length} file{selected.length !== 1 ? 's' : ''} selected</p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-slate-500 text-sm hover:text-slate-700">Cancel</button>
            <button
              onClick={handleImport}
              disabled={selected.length === 0 || importing}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                selected.length > 0 && !importing
                  ? 'bg-hcsg-orange text-white hover:bg-hcsg-light-orange'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {importing ? 'Indexing...' : 'Import & Index'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const TODAY = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function DocumentManagement() {
  const [showModal,     setShowModal]     = useState(false)
  const [importedDocs,  setImportedDocs]  = useState([])
  const [successBanner, setSuccessBanner] = useState(false)

  function handleImport(files) {
    setShowModal(false)
    setImportedDocs(prev => [
      ...prev,
      ...files.map(f => ({
        name:      f.name.replace('.pdf', ''),
        type:      f.type,
        equipment: f.equipment,
        pages:     f.pages,
        status:    'Indexed',
        uploaded:  TODAY,
        source:    f.source,
      }))
    ])
    setSuccessBanner(true)
    setTimeout(() => setSuccessBanner(false), 4000)
  }

  const allDocs   = [...KNOWLEDGE_BASE.documents, ...importedDocs]
  const totalDocs = allDocs.length

  return (
    <div className="p-8 max-w-5xl">

      {showModal && <SharePointModal onClose={() => setShowModal(false)} onImport={handleImport} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-hcsg-navy text-2xl font-bold">Document Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            {totalDocs} manuals indexed · {KNOWLEDGE_BASE.totalPages} pages · Last updated {KNOWLEDGE_BASE.lastUpdated}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" fill="#0078D4"/>
              <rect x="6" y="17" width="12" height="4" rx="1" fill="#005A9E"/>
              <path d="M9 8h6M9 11h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add from SharePoint
          </button>
          <button className="flex items-center gap-2 bg-hcsg-orange text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-hcsg-light-orange shadow-sm transition-colors">
            <Upload size={15} />
            Upload Manual
          </button>
        </div>
      </div>

      {/* Success banner */}
      {successBanner && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3 mb-5 animate-fade-in">
          <CheckCircle size={16} className="text-green-600 shrink-0" />
          <p className="text-green-700 text-sm font-medium">{importedDocs.length} document{importedDocs.length !== 1 ? 's' : ''} imported from SharePoint and indexed successfully.</p>
        </div>
      )}

      {/* Document table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-hcsg-navy font-semibold text-sm">Indexed Documents</h2>
          <span className="text-slate-400 text-xs">{totalDocs} total</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-50">
              {['Document', 'Type', 'Equipment', 'Pages', 'Source', 'Status', 'Uploaded'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-slate-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">

            {allDocs.map((doc, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <FileText size={14} className="text-hcsg-blue shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-500 text-sm">{doc.type}</td>
                <td className="px-4 py-3.5 text-slate-500 text-sm">{doc.equipment}</td>
                <td className="px-4 py-3.5 text-slate-500 text-sm">{doc.pages}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${SOURCE_STYLES[doc.source] ?? 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                    {doc.source}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold whitespace-nowrap">
                    <CheckCircle size={12} />
                    {doc.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-slate-400 text-sm">{doc.uploaded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Coverage gaps */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <AlertTriangle size={15} className="text-hcsg-amber" />
          <h2 className="text-hcsg-navy font-semibold text-sm">Coverage Gaps</h2>
          <span className="ml-auto text-slate-400 text-xs">{KNOWLEDGE_BASE.coverageGaps.length} gaps identified</span>
        </div>
        <div className="divide-y divide-slate-50">
          {KNOWLEDGE_BASE.coverageGaps.map((gap, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <FolderOpen size={16} className="text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="text-slate-700 text-sm font-medium">{gap.equipment}</p>
                <p className="text-slate-400 text-xs mt-0.5">{gap.status}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PRIORITY_STYLES[gap.priority]}`}>
                {gap.priority}
              </span>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-hcsg-blue text-xs font-semibold hover:text-hcsg-navy transition-colors"
              >
                <Plus size={13} /> Add docs
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
