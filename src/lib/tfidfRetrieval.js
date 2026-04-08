/**
 * TF–IDF + cosine similarity over text chunks (pure JS; no network, no ML).
 */

const STOP = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'can', 'need', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'this', 'that', 'these', 'those', 'am', 'and', 'but', 'if', 'or',
  'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against',
  'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
  'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'also', 'now', 'tell', 'me', 'give', 'get', 'like', 'want', 'know', 'think', 'see',
  'come', 'go', 'make', 'take', 'way', 'even', 'any', 'his', 'her', 'their', 'our',
])

const QUERY_EXPANSIONS = {
  job: ['work', 'experience', 'role', 'engineer', 'employment', 'career'],
  work: ['job', 'experience', 'role', 'engineer', 'employment'],
  career: ['work', 'job', 'experience'],
  school: ['education', 'degree', 'university', 'college', 'study'],
  education: ['school', 'degree', 'university', 'study'],
  degree: ['education', 'school', 'university'],
  cert: ['certification', 'certificate', 'aws', 'credential'],
  certification: ['cert', 'certificate', 'credential'],
  github: ['git', 'repository', 'repo', 'code', 'projects'],
  linkedin: ['profile', 'social'],
}

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z0-9#+]+/g) || []).filter((w) => !STOP.has(w) && w.length > 1)
}

function expandQueryTokens(tokens) {
  const out = new Set(tokens)
  for (const t of tokens) {
    const extra = QUERY_EXPANSIONS[t]
    if (extra) for (const e of extra) out.add(e)
  }
  return [...out]
}

function l2Normalize(vec, keys) {
  let sum = 0
  for (const k of keys) {
    const v = vec.get(k) || 0
    sum += v * v
  }
  const inv = sum > 0 ? 1 / Math.sqrt(sum) : 1
  const m = new Map()
  for (const k of keys) {
    m.set(k, (vec.get(k) || 0) * inv)
  }
  return m
}

/**
 * @param {string} query
 * @param {string[]} chunks
 * @returns {{ text: string, score: number }[]}
 */
export function rankChunksByTfidf(query, chunks) {
  if (chunks.length === 0) return []

  const qTokens = expandQueryTokens(tokenize(query))
  const docTokens = chunks.map((c) => tokenize(c))

  const N = chunks.length
  const df = new Map()
  for (let i = 0; i < N; i++) {
    const seen = new Set(docTokens[i])
    for (const t of seen) {
      df.set(t, (df.get(t) || 0) + 1)
    }
  }

  const idf = new Map()
  for (const [t, dfi] of df) {
    idf.set(t, Math.log((N + 1) / (dfi + 1)) + 1)
  }

  const vocab = new Set([...qTokens, ...idf.keys()])

  function tfidfVec(tokens) {
    const counts = new Map()
    for (const t of tokens) {
      counts.set(t, (counts.get(t) || 0) + 1)
    }
    const vals = [...counts.values()]
    const max = vals.length ? Math.max(...vals) : 1
    const vec = new Map()
    for (const t of vocab) {
      const tf = (counts.get(t) || 0) / max
      const idfVal = idf.get(t) || 0
      vec.set(t, tf * idfVal)
    }
    return l2Normalize(vec, vocab)
  }

  const qVec = tfidfVec(qTokens)
  const scored = chunks.map((text, i) => {
    const dVec = tfidfVec(docTokens[i])
    let s = 0
    for (const t of vocab) {
      s += (qVec.get(t) || 0) * (dVec.get(t) || 0)
    }
    return { text, score: s }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored
}
