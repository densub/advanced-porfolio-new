/**
 * Local persistence stand-in for Base44 entities. Swap with real Base44 SDK in production.
 * Keys match PortfolioSection and SocialLink shapes from the schema.
 */

const LS_SECTIONS = 'base44_portfolio_sections'
const LS_LINKS = 'base44_social_links'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function sortBy(items, field) {
  if (!field) return [...items]
  return [...items].sort((a, b) => (a[field] ?? 0) - (b[field] ?? 0))
}

function makeEntity(storageKey) {
  return {
    async list(sortField) {
      await Promise.resolve()
      const items = readJson(storageKey, [])
      return sortBy(items, sortField)
    },
    async get(id) {
      const items = readJson(storageKey, [])
      return items.find((x) => x.id === id) ?? null
    },
    async create(data) {
      const items = readJson(storageKey, [])
      const id = crypto.randomUUID()
      const row = { ...data, id }
      items.push(row)
      writeJson(storageKey, items)
      return row
    },
    async update(id, data) {
      const items = readJson(storageKey, [])
      const idx = items.findIndex((x) => x.id === id)
      if (idx === -1) throw new Error('Not found')
      items[idx] = { ...items[idx], ...data, id }
      writeJson(storageKey, items)
      return items[idx]
    },
    async delete(id) {
      const items = readJson(storageKey, [])
      const next = items.filter((x) => x.id !== id)
      writeJson(storageKey, next)
    },
    async upsertMany(rows) {
      writeJson(storageKey, rows)
      return rows
    },
  }
}

export const base44 = {
  entities: {
    PortfolioSection: makeEntity(LS_SECTIONS),
    SocialLink: makeEntity(LS_LINKS),
  },
}
