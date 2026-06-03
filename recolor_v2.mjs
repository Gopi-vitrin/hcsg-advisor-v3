// Node.js script — reads and writes UTF-8 correctly
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const replacements = [
  // Page backgrounds: cool blue-gray → warm off-white (HCSG website tone)
  ['#f0f2f5', '#FAF8F5'],
  ['#f8fafc', '#FAF8F5'],
  // Borders: cold slate → warm brown-gray
  ['#e2e8f0', '#E0D7CE'],
  // SharePoint badge: generic blue → HCSG orange family
  ['#eff6ff', '#FFF3EC'],
  ['#bfdbfe', '#F5C9A0'],
  ['#3b82f6', '#B55C35'],
  // Corporate Drive badge: purple → HCSG brown (brand color)
  ['#f5f3ff', '#F5EDE6'],
  ['#ddd6fe', '#E0D0C5'],
  ['#7c3aed', '#653a15'],
  // Standardise reds/ambers to HCSG brand
  ['#dc2626', '#b82105'],
  ['#fecaca', 'rgba(184,33,5,0.15)'],
  ['#fef2f2', 'rgba(184,33,5,0.06)'],
  ['#d97706', '#c47d1a'],
  ['#fde68a', 'rgba(245,165,36,0.25)'],
  ['#fffbeb', 'rgba(245,165,36,0.06)'],
  // Muted text: cold slate → warm brown-gray
  ['#94a3b8', '#9A8B7A'],
  ['#64748b', '#6B5A4A'],
  ['#334155', '#2D2018'],
]

function processDir(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) { processDir(full); continue }
    if (!name.endsWith('.jsx') && !name.endsWith('.css')) continue
    let content = readFileSync(full, 'utf8')
    const before = content
    for (const [from, to] of replacements) {
      content = content.split(from).join(to)  // global replace without regex
    }
    if (content !== before) {
      writeFileSync(full, content, 'utf8')
      console.log('Updated:', name)
    }
  }
}

processDir('src/v2/components/admin')
console.log('Done')
