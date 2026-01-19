import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const TARGET_DIRS = [
  path.join(ROOT, 'Images', 'projects'),
]

const NAME_PATTERN = /^[A-Za-z0-9._-]+$/

function isAscii(value) {
  return /^[\x00-\x7F]+$/.test(value)
}

function collectIssues(dir, issues) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectIssues(fullPath, issues)
      continue
    }

    const name = entry.name
    if (!isAscii(name) || !NAME_PATTERN.test(name)) {
      issues.push(path.relative(ROOT, fullPath))
    }
  }
}

const issues = []
for (const target of TARGET_DIRS) {
  if (!fs.existsSync(target)) {
    continue
  }
  collectIssues(target, issues)
}

if (issues.length > 0) {
  console.error('Asset filename check failed. Use ASCII letters/numbers with "-", "_", and "." only.')
  console.error('Invalid files:')
  issues.forEach((file) => console.error(`- ${file}`))
  process.exit(1)
}
