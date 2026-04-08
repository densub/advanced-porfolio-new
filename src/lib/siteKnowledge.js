/**
 * Flattens portfolio sections + social links into markdown for lexical (TF–IDF) Q&A in the browser.
 */
export function buildSiteKnowledgeMarkdown(sections, links) {
  const lines = ['# Site-only knowledge (Denish Subedi portfolio)\n']

  const hero = sections?.find((s) => s.section_key === 'hero')?.content
  if (hero) {
    lines.push('## Profile')
    lines.push(`- Name: ${hero.name || ''}`)
    lines.push(`- Tagline: ${hero.tagline || ''}`)
    lines.push(`- About: ${hero.bio || ''}`)
    lines.push('')
  }

  const eduItems = sections?.find((s) => s.section_key === 'education')?.content?.items || []
  if (eduItems.length) {
    lines.push('## Education')
    for (const e of eduItems) {
      lines.push(
        `- ${e.title} (${e.subtitle || ''}) — ${e.period || ''}. ${e.description || ''}`
      )
    }
    lines.push('')
  }

  const expItems = sections?.find((s) => s.section_key === 'experience')?.content?.items || []
  if (expItems.length) {
    lines.push('## Experience')
    for (const x of expItems) {
      const tags = x.tags?.length ? ` Tags: ${x.tags.join(', ')}.` : ''
      lines.push(
        `- ${x.title} at ${x.subtitle || 'company'} — ${x.period || ''}. ${x.description || ''}${tags}`
      )
    }
    lines.push('')
  }

  const certs = sections?.find((s) => s.section_key === 'certifications')?.content?.items || []
  if (certs.length) {
    lines.push('## Certifications')
    for (const c of certs) {
      let line = `- ${c.title} — ${c.issuer || ''}`
      if (c.inProgress) line += ' [In progress]'
      if (c.date) line += ` · ${c.date}`
      if (c.expires) line += ` · expires ${c.expires}`
      if (c.credentialId) line += ` · credential ${c.credentialId}`
      if (c.skills) line += ` · ${c.skills}`
      lines.push(line)
    }
    lines.push('')
  }

  const skillItems = sections?.find((s) => s.section_key === 'skills')?.content?.items || []
  if (skillItems.length) {
    lines.push('## Skills (grouped)')
    for (const s of skillItems) {
      const tags = s.tags?.length ? ` [${s.tags.join('; ')}]` : ''
      lines.push(`- **${s.title}** (${s.subtitle || ''}): ${s.description || ''}${tags}`)
    }
    lines.push('')
  }

  const projectItems = sections?.find((s) => s.section_key === 'projects')?.content?.items || []
  lines.push('## Projects (featured)')
  if (projectItems.length) {
    for (const p of projectItems) {
      const tags = p.tags?.length ? ` Tags: ${p.tags.join(', ')}.` : ''
      lines.push(`- **${p.title}** (${p.subtitle || ''}): ${p.description || ''}${tags}`)
    }
  }
  lines.push(
    '- Public GitHub repositories also appear in the Projects section when a GitHub profile URL is configured (social links).'
  )
  lines.push('')

  const visibleLinks = (links || []).filter((l) => l.visible !== false)
  if (visibleLinks.length) {
    lines.push('## Social / contact links')
    for (const l of visibleLinks) {
      lines.push(`- ${l.platform}: ${l.url}`)
    }
  }

  return lines.join('\n')
}

const STOP = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'what', 'who', 'where', 'when', 'how', 'why',
  'does', 'do', 'did', 'can', 'could', 'would', 'should', 'tell', 'me', 'about', 'and', 'or',
  'to', 'of', 'in', 'on', 'for', 'with', 'his', 'her', 'he', 'she', 'they', 'this', 'that',
])

function tokenize(s) {
  return (s.toLowerCase().match(/[a-z0-9#+]+/g) || []).filter((w) => !STOP.has(w) && w.length > 1)
}

/** Keyword overlap fallback when chunks are empty or too small. */
export function answerFromKnowledgeLocal(question, knowledgeMarkdown) {
  const q = question.trim()
  if (!q) return 'Enter a question after the prompt.'

  const lower = q.toLowerCase()
  if (/^(hi|hello|hey)\b/.test(lower)) {
    return "Hey — I'm a read-only assistant built from this portfolio. Ask about Denish's jobs, school, certs, skills, or links."
  }

  const chunks = knowledgeMarkdown.split(/\n(?=## )|\n\n+/).filter((c) => c.trim().length > 20)
  const qWords = new Set(tokenize(q))
  if (qWords.size === 0) {
    return "Try asking something specific — e.g. current job, degrees, AWS cert, or GitHub."
  }

  let best = { score: 0, text: '' }
  for (const chunk of chunks) {
    const cSet = new Set(tokenize(chunk))
    let score = 0
    for (const w of qWords) {
      if (cSet.has(w)) score += 3
    }
    if (score > best.score) best = { score, text: chunk.trim() }
  }

  if (best.score === 0 || !best.text) {
    return "I don't have that in the published sections of this site. Try Education, Experience, Certifications, Skills, Projects, or the listed social links."
  }

  return `From this portfolio:\n\n${best.text}`
}

