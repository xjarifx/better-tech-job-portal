import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')

function loadJsonFiles(dir) {
  const fullPath = join(DATA_DIR, dir)
  if (!existsSync(fullPath)) return []

  const entries = []
  const files = readdirSync(fullPath).filter((f) => f.endsWith('.json'))

  for (const file of files) {
    const content = readFileSync(join(fullPath, file), 'utf-8')
    const parsed = JSON.parse(content)
    for (const entry of parsed) {
      entries.push({ ...entry, _source: dir })
    }
  }

  return entries
}

function main() {
  const seen = new Set()
  const duplicates = []
  const missingFields = []

  const raw = [
    ...loadJsonFiles('companies'),
    ...loadJsonFiles('portals'),
  ]

  const result = []

  for (const entry of raw) {
    if (!entry.name || !entry.domain) {
      missingFields.push(entry.name || '(unnamed)')
      continue
    }

    const key = entry.name.toLowerCase()
    if (seen.has(key)) {
      duplicates.push(entry.name)
      continue
    }
    seen.add(key)

    result.push({
      name: entry.name,
      domain: entry.domain,
      portal: entry._source === 'portals',
    })
  }

  result.sort((a, b) => a.name.localeCompare(b.name))

  writeFileSync(
    join(DATA_DIR, 'index.json'),
    JSON.stringify(result, null, 2),
    'utf-8',
  )

  console.log(`Wrote ${result.length} entries to data/index.json`)

  if (duplicates.length > 0) {
    console.warn(`Skipped ${duplicates.length} duplicates: ${duplicates.slice(0, 10).join(', ')}${duplicates.length > 10 ? `... (+${duplicates.length - 10})` : ''}`)
  }
  if (missingFields.length > 0) {
    console.warn(`${missingFields.length} entries missing name or domain`)
  }
}

main()
