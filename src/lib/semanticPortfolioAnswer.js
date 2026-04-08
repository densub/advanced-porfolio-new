/**
 * Site-grounded Q&A: TF–IDF retrieval over portfolio text (pure browser JS; no API, no ML).
 */
import { rankChunksByTfidf } from '@/lib/tfidfRetrieval'
import { answerFromKnowledgeLocal } from '@/lib/siteKnowledge'

export function chunkKnowledge(markdown) {
  const lines = markdown.split('\n')
  const chunks = []
  let buf = []

  const flush = () => {
    const t = buf.join('\n').trim()
    if (t.length >= 32) chunks.push(t)
    buf = []
  }

  for (const line of lines) {
    if (line.startsWith('## ') && buf.length) {
      flush()
      buf.push(line)
    } else {
      buf.push(line)
    }
  }
  flush()

  if (chunks.length === 0 && markdown.trim().length >= 32) {
    return [markdown.trim()]
  }
  return chunks
}

function passageToProse(block) {
  return block
    .replace(/^##\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^-\s+/gm, '• ')
    .trim()
}

function isShortAcknowledgment(q) {
  const t = q.trim().toLowerCase()
  return /^(ok|okay|k|thanks?|thank you|ty|thx|cool|nice|got it|yep|yeah|sure|alright|fine|👍|🙏)\.?$/i.test(
    t
  )
}

function isGreeting(q) {
  return /^(hi|hello|hey|good (morning|afternoon|evening))\b/i.test(q.trim())
}

function synthesizeAnswer(ranked) {
  if (ranked.length === 0) {
    return "I only use text from this page. Try asking about work history, education, certifications, skills, or social links."
  }

  const best = ranked[0].score
  if (best < 0.028) {
    return "I couldn't match that to anything specific on this site. Try words like *Fearless*, *AWS*, *degree*, *GitHub*, or *certifications*—or browse the sections."
  }

  const top = ranked.filter((r, i) => i === 0 || r.score >= best - 0.06).slice(0, 3)
  const strong = best >= 0.12
  const intro = strong
    ? "Here's what lines up best with your question on this portfolio:"
    : "The closest information published here:"

  const bodies = top.map((r) => passageToProse(r.text))
  const joined =
    bodies.length === 1
      ? bodies[0]
      : bodies.map((b, i) => (i === 0 ? b : `Additionally: ${b}`)).join('\n\n')

  return `${intro}\n\n${joined}`
}

/**
 * @param {string} question
 * @param {string} knowledgeMarkdown
 * @param {{ onStatus?: (msg: string) => void }} [opts]
 */
export async function answerPortfolioQuestionSemantically(question, knowledgeMarkdown, opts = {}) {
  const q = question.trim()
  if (!q) return 'Type a question and press run (or Enter).'

  if (isGreeting(q)) {
    return "Hey. I only answer from what's on this site—no outside knowledge. Try: current employer, degrees, certifications, skills, or GitHub."
  }

  if (isShortAcknowledgment(q)) {
    return 'Sounds good. Ask anything about work, school, certs, projects, or links—or use the nav to explore.'
  }

  const { onStatus } = opts
  onStatus?.('Matching question to site content…')

  const chunks = chunkKnowledge(knowledgeMarkdown)
  if (chunks.length === 0) {
    return answerFromKnowledgeLocal(q, knowledgeMarkdown)
  }

  const ranked = rankChunksByTfidf(q, chunks)
  return synthesizeAnswer(ranked)
}
