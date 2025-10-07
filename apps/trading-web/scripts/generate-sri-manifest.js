const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const publicDir = path.join(__dirname, '..', 'public')
const outputPath = path.join(__dirname, '..', 'config', 'sri-manifest.json')
const includeExtensions = new Set(['.ico', '.svg', '.json', '.txt'])

function computeIntegrity(buffer) {
  return 'sha384-' + crypto.createHash('sha384').update(buffer).digest('base64')
}

function walk(dir) {
  const results = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walk(fullPath))
    } else {
      const ext = path.extname(entry.name).toLowerCase()
      if (includeExtensions.has(ext)) {
        results.push(fullPath)
      }
    }
  }

  return results
}

const files = walk(publicDir)
const manifest = {}

files.forEach((filePath) => {
  const buffer = fs.readFileSync(filePath)
  const integrity = computeIntegrity(buffer)
  const relative = '/' + path.relative(publicDir, filePath).replace(/\\\\/g, '/')
  manifest[relative] = integrity
})

fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2))
console.log(`Generated SRI manifest with ${files.length} entries at ${outputPath}`)
