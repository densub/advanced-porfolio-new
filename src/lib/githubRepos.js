/**
 * GitHub public API helpers (browser; unauthenticated rate limit applies).
 * Responses are cached in localStorage to cut API usage and speed repeat visits.
 */

/** Max concurrent README fetches when refreshing from the network */
const README_CONCURRENCY = 4
/** Target length for card blurbs */
const README_EXCERPT_MAX = 320

/** Bump if cache payload shape changes */
const CACHE_VERSION = 1
const CACHE_KEY_PREFIX = 'portfolio:github-repos:v'

/** How long a cached payload is treated as fresh (no network) */
export const GITHUB_REPOS_CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

function cacheKey(username) {
  return `${CACHE_KEY_PREFIX}${CACHE_VERSION}:${username}`
}

/**
 * @returns {{ repos: unknown[], savedAt: number } | null}
 */
export function readGithubReposCache(username) {
  if (typeof window === 'undefined' || !username) return null
  try {
    const raw = localStorage.getItem(cacheKey(username))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const repos = parsed?.repos
    const savedAt = parsed?.savedAt
    if (!Array.isArray(repos) || typeof savedAt !== 'number') return null
    return { repos, savedAt }
  } catch {
    return null
  }
}

function writeGithubReposCache(username, repos) {
  if (typeof window === 'undefined' || !username) return
  try {
    localStorage.setItem(
      cacheKey(username),
      JSON.stringify({ savedAt: Date.now(), repos })
    )
  } catch {
    /* quota or private mode */
  }
}

/** Clear stored repos for a user (e.g. force refresh). */
export function clearGithubReposCache(username) {
  if (typeof window === 'undefined' || !username) return
  try {
    localStorage.removeItem(cacheKey(username))
  } catch {
    /* ignore */
  }
}

function isCacheFresh(savedAt) {
  return Date.now() - savedAt < GITHUB_REPOS_CACHE_TTL_MS
}

/** For React Query initialData (fresh localStorage only). */
export function getGithubReposQueryInitialState(username) {
  if (!username) return null
  const entry = readGithubReposCache(username)
  if (!entry || !isCacheFresh(entry.savedAt)) return null
  return { initialData: entry.repos, initialDataUpdatedAt: entry.savedAt }
}

export async function fetchGitHubRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=50&type=public`
  )
  if (!res.ok) throw new Error('Failed to fetch repos')
  const repos = await res.json()
  return repos
    .filter((r) => !r.fork)
    .sort((a, b) => b.stargazers_count + b.forks_count - (a.stargazers_count + a.forks_count))
}

/**
 * Reduce README markdown to a short plain-text preview for cards.
 */
export function readmeToExcerpt(markdown, maxLen = README_EXCERPT_MAX) {
  if (!markdown || typeof markdown !== 'string') return ''
  let t = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+.*/gm, ' ')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\n{2,}/g, '\n')

  const paragraphs = t
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const first = paragraphs[0] || t.trim()
  const oneLine = first.replace(/\s+/g, ' ').trim()
  if (!oneLine) return ''
  return oneLine.length > maxLen ? `${oneLine.slice(0, maxLen - 1).trim()}…` : oneLine
}

async function fetchReadmeRaw(owner, repoName) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
    headers: { Accept: 'application/vnd.github.raw' },
  })
  if (!res.ok) return null
  return res.text()
}

async function fetchReposWithReadmesFromNetwork(username) {
  const repos = await fetchGitHubRepos(username)
  const enriched = []
  for (let i = 0; i < repos.length; i += README_CONCURRENCY) {
    const chunk = repos.slice(i, i + README_CONCURRENCY)
    const excerpts = await Promise.all(
      chunk.map(async (repo) => {
        try {
          const raw = await fetchReadmeRaw(username, repo.name)
          if (!raw?.trim()) return null
          return readmeToExcerpt(raw)
        } catch {
          return null
        }
      })
    )
    chunk.forEach((repo, j) => {
      enriched.push({ ...repo, readmeExcerpt: excerpts[j] })
    })
  }
  return enriched
}

/**
 * Returns cached enriched repos when fresh; otherwise fetches, updates cache, returns.
 * @param {{ forceRefresh?: boolean }} [options]
 */
export async function fetchGitHubReposWithReadmes(username, options = {}) {
  if (!username) return []

  if (!options.forceRefresh) {
    const entry = readGithubReposCache(username)
    if (entry && isCacheFresh(entry.savedAt)) {
      return entry.repos
    }
  }

  const enriched = await fetchReposWithReadmesFromNetwork(username)
  writeGithubReposCache(username, enriched)
  return enriched
}

export function extractGitHubUsername(url) {
  if (!url) return null
  const match = url.match(/github\.com\/([^/?]+)/)
  return match ? match[1] : null
}
