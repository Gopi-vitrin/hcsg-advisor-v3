import { useState, useRef } from 'react'
import { Upload, FileText, Trash2, Eye, RefreshCw, CheckCircle, Loader, ChevronDown, X, Settings, Users } from 'lucide-react'
import { DOCUMENTS } from '../../data'

const PARSE_STEPS = [
  { id: 'scan', label: 'Scanning document structure', duration: 900 },
  { id: 'extract', label: 'Extracting attributes & equipment references', duration: 1200 },
  { id: 'preview', label: 'Building index preview', duration: 800 },
]

export default function ManagerSettings() {
  const [docs, setDocs] = useState(DOCUMENTS)
  const [uploadState, setUploadState] = useState('idle') // idle | uploading | parsing | review | done
  const [parseProgress, setParseProgress] = useState(0) // index into PARSE_STEPS
  const [fileName, setFileName] = useState('')
  const [extraction, setExtraction] = useState({
    type: 'Service Manual',
    title: '',
    equipment: '',
    revision: 'Rev. 1',
    pages: '',
  })
  const fileRef = useRef(null)

  function handleFile(file) {
    if (!file) return
    setFileName(file.name)
    setUploadState('uploading')
    setTimeout(() => startParsing(file.name), 600)
  }

  function startParsing(name) {
    setUploadState('parsing')
    setParseProgress(0)

    let i = 0
    const advance = () => {
      if (i >= PARSE_STEPS.length - 1) {
        setParseProgress(PARSE_STEPS.length - 1)
        setTimeout(() => {
          // Simulate extraction result from the file name
          const clean = name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
          setExtraction({
            type: 'Service Manual',
            title: clean.charAt(0).toUpperCase() + clean.slice(1),
            equipment: 'Shaw-Box Series 800 Hoist',
            revision: 'Rev. 1',
            pages: '74',
          })
          setUploadState('review')
        }, PARSE_STEPS[PARSE_STEPS.length - 1].duration)
        return
      }
      i++
      setParseProgress(i)
      setTimeout(advance, PARSE_STEPS[i].duration)
    }
    setTimeout(advance, PARSE_STEPS[0].duration)
  }

  function confirmIndex() {
    const newDoc = {
      id: `doc-${Date.now()}`,
      title: extraction.title,
      type: extraction.type,
      equipment: extraction.equipment,
      revision: extraction.revision,
      pages: parseInt(extraction.pages) || 0,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'indexed',
    }
    setDocs(prev => [newDoc, ...prev])
    setUploadState('done')
    setTimeout(() => setUploadState('idle'), 2500)
  }

  function cancelUpload() {
    setUploadState('idle')
    setFileName('')
    setParseProgress(0)
  }

  return (
    <div className="p-8 max-w-3xl min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-hcsg-navy">Settings</h1>
        <p className="text-sm text-hcsg-muted mt-1">Document library and integrations</p>
      </div>

      {/* Document Management */}
      <section className="mb-10">
        <h2 className="font-bold text-hcsg-navy text-base mb-4">Equipment Manuals</h2>

        {/* Upload area */}
        {uploadState === 'idle' && (
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
            onDragOver={e => e.preventDefault()}
            className="border-2 border-dashed border-hcsg-light-gray rounded-2xl py-10 px-6 text-center cursor-pointer hover:border-hcsg-orange/50 hover:bg-orange-50/30 transition-colors mb-5"
          >
            <Upload size={28} className="mx-auto text-hcsg-muted/50 mb-3" />
            <div className="font-semibold text-hcsg-navy text-sm mb-1">Upload a manual</div>
            <div className="text-xs text-hcsg-muted">PDF — drag and drop or click to browse</div>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}

        {/* Uploading */}
        {uploadState === 'uploading' && (
          <StatusCard icon={<Loader size={20} className="text-hcsg-blue animate-spin" />} title="Uploading..." sub={fileName} />
        )}

        {/* AI Parsing animation */}
        {uploadState === 'parsing' && (
          <div className="bg-white rounded-2xl border border-hcsg-light-gray shadow-sm px-6 py-5 mb-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-hcsg-orange flex items-center justify-center">
                <span className="text-white text-xs font-black">AI</span>
              </div>
              <div>
                <div className="font-semibold text-hcsg-navy text-sm">Parsing document</div>
                <div className="text-xs text-hcsg-muted truncate max-w-xs">{fileName}</div>
              </div>
            </div>
            <div className="space-y-3">
              {PARSE_STEPS.map((step, i) => {
                const done = i < parseProgress
                const active = i === parseProgress
                return (
                  <div key={step.id} className={`flex items-center gap-3 text-sm transition-opacity ${i > parseProgress ? 'opacity-30' : ''}`}>
                    {done ? (
                      <CheckCircle size={16} className="text-hcsg-green shrink-0" />
                    ) : active ? (
                      <Loader size={16} className="text-hcsg-orange animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-hcsg-light-gray shrink-0" />
                    )}
                    <span className={`${done ? 'text-hcsg-green' : active ? 'text-hcsg-navy font-medium' : 'text-hcsg-muted'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Extraction review */}
        {uploadState === 'review' && (
          <div className="bg-white rounded-2xl border border-hcsg-light-gray shadow-sm px-6 py-5 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-hcsg-orange flex items-center justify-center">
                  <span className="text-white text-[10px] font-black">AI</span>
                </div>
                <div>
                  <div className="font-semibold text-hcsg-navy text-sm">Review extracted details</div>
                  <div className="text-xs text-hcsg-muted">Edit anything before indexing</div>
                </div>
              </div>
              <button onClick={cancelUpload} className="text-hcsg-muted hover:text-hcsg-dark-red">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <FormField
                label="Document type"
                value={extraction.type}
                onChange={v => setExtraction(e => ({ ...e, type: v }))}
                type="select"
                options={['Service Manual', 'Maintenance Manual', 'Installation Manual', 'Parts Catalog']}
              />
              <FormField
                label="Revision"
                value={extraction.revision}
                onChange={v => setExtraction(e => ({ ...e, revision: v }))}
              />
              <FormField
                label="Title"
                value={extraction.title}
                onChange={v => setExtraction(e => ({ ...e, title: v }))}
                className="col-span-2"
              />
              <FormField
                label="Equipment"
                value={extraction.equipment}
                onChange={v => setExtraction(e => ({ ...e, equipment: v }))}
                className="col-span-2"
              />
              <FormField
                label="Page count"
                value={extraction.pages}
                onChange={v => setExtraction(e => ({ ...e, pages: v }))}
                type="number"
              />
            </div>

            <button
              onClick={confirmIndex}
              className="w-full bg-hcsg-orange text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity"
            >
              <CheckCircle size={16} />
              Confirm & Index
            </button>
          </div>
        )}

        {/* Done */}
        {uploadState === 'done' && (
          <StatusCard
            icon={<CheckCircle size={20} className="text-hcsg-green" />}
            title="Indexed successfully"
            sub={extraction.title}
            green
          />
        )}

        {/* Document library */}
        <div className="bg-white rounded-2xl border border-hcsg-light-gray shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-hcsg-light-gray bg-hcsg-surface">
            <span className="text-xs font-semibold text-hcsg-muted uppercase tracking-wide">Indexed manuals · {docs.length}</span>
          </div>
          {docs.map((doc, i) => (
            <div
              key={doc.id}
              className={`flex items-center gap-4 px-5 py-4 ${i < docs.length - 1 ? 'border-b border-hcsg-light-gray/60' : ''}`}
            >
              <FileText size={18} className="text-hcsg-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-hcsg-navy text-sm truncate">{doc.title}</div>
                <div className="text-xs text-hcsg-muted">{doc.type} · {doc.equipment} · {doc.revision} · {doc.pages}p</div>
              </div>
              <div className="text-xs text-hcsg-muted shrink-0">{doc.uploadedAt}</div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="w-7 h-7 rounded-lg hover:bg-hcsg-surface flex items-center justify-center transition-colors">
                  <Eye size={14} className="text-hcsg-muted" />
                </button>
                <button className="w-7 h-7 rounded-lg hover:bg-hcsg-surface flex items-center justify-center transition-colors">
                  <Trash2 size={14} className="text-hcsg-muted hover:text-hcsg-dark-red" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teams integration */}
      <section>
        <h2 className="font-bold text-hcsg-navy text-base mb-4">Microsoft Teams</h2>
        <div className="bg-white rounded-2xl border border-hcsg-light-gray shadow-sm px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5b5fc7] flex items-center justify-center">
                <TeamsIcon />
              </div>
              <div>
                <div className="font-semibold text-hcsg-navy text-sm">Teams integration</div>
                <div className="text-xs text-hcsg-muted mt-0.5">Reach technicians directly from the advisor · simulated</div>
              </div>
            </div>
            <span className="text-xs font-semibold text-hcsg-green bg-green-50 px-2.5 py-1 rounded-full shrink-0">Connected</span>
          </div>
          <div className="mt-4 text-xs text-hcsg-muted leading-relaxed border-t border-hcsg-light-gray pt-4">
            Branch: <strong className="text-hcsg-navy">Gulf Coast Region</strong> · Tenant: <strong className="text-hcsg-navy">hcsg.com</strong>
          </div>
        </div>
      </section>
    </div>
  )
}

function StatusCard({ icon, title, sub, green }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 mb-5 ${green ? 'bg-green-50 border-green-200' : 'bg-white border-hcsg-light-gray'}`}>
      {icon}
      <div>
        <div className={`font-semibold text-sm ${green ? 'text-hcsg-green' : 'text-hcsg-navy'}`}>{title}</div>
        <div className="text-xs text-hcsg-muted">{sub}</div>
      </div>
    </div>
  )
}

function FormField({ label, value, onChange, type, options, className }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-hcsg-muted mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-hcsg-surface border border-hcsg-light-gray rounded-xl px-3 py-2 text-sm text-hcsg-navy outline-none focus:border-hcsg-orange transition-colors"
        >
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type || 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-hcsg-surface border border-hcsg-light-gray rounded-xl px-3 py-2 text-sm text-hcsg-navy outline-none focus:border-hcsg-orange transition-colors"
        />
      )}
    </div>
  )
}

function TeamsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M13 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="white" />
      <path d="M10 9a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" fill="white" />
      <path d="M11 12H7a2.5 2.5 0 0 0-2.5 2.5V16h9v-1.5A2.5 2.5 0 0 0 11 12Z" fill="white" />
      <path d="M13 9c.5 0 1 .1 1.4.4A2.5 2.5 0 0 1 16 11.5V15h-2.5v-3A4 4 0 0 0 11 8.1c.6-.07 1.3-.1 2-.1Z" fill="white" fillOpacity="0.65" />
    </svg>
  )
}
