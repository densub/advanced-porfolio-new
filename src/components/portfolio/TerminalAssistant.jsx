import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { buildSiteKnowledgeMarkdown } from '@/lib/siteKnowledge'
import { X } from 'lucide-react'

export default function TerminalAssistant({ sections, links }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => [])
  const [pending, setPending] = useState(false)
  const [statusHint, setStatusHint] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const knowledge = buildSiteKnowledgeMarkdown(sections, links)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pending, statusHint, open])

  const send = useCallback(async () => {
    const q = input.trim()
    if (!q || pending) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: q }])
    setPending(true)
    setStatusHint('')

    try {
      const { answerPortfolioQuestionSemantically } = await import('@/lib/semanticPortfolioAnswer')
      const reply = await answerPortfolioQuestionSemantically(q, knowledge, {
        onStatus: (msg) => setStatusHint(msg || ''),
      })
      setStatusHint('')
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
    } catch (e) {
      setStatusHint('')
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: `// ${e.message || 'Something went wrong'}. Try again.`,
        },
      ])
    } finally {
      setPending(false)
    }
  }, [input, pending, knowledge])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`pointer-events-auto fixed bottom-5 right-5 z-[90] flex items-center gap-2 rounded-sm border border-primary/40 bg-background/90 px-4 py-3 font-mono text-sm text-primary shadow-[0_0_20px_hsl(180_100%_50%/0.15)] backdrop-blur-md transition-all hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_28px_hsl(180_100%_50%/0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-label="Open portfolio assistant terminal"
      >
        <span className="select-none text-muted-foreground">$</span>
        <span className="text-primary tabular-nums tracking-tight">&gt;_</span>
        <span
          className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-primary/80"
          style={{ animationDuration: '1.1s' }}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="pointer-events-auto fixed bottom-5 right-5 z-[95] flex max-h-[min(520px,72vh)] w-[calc(100vw-2.5rem)] max-w-[440px] flex-col overflow-hidden rounded-sm border border-primary/35 bg-[hsl(222_47%_5%)] shadow-[0_0_40px_hsl(180_100%_50%/0.12)] md:w-[440px]"
            role="dialog"
            aria-label="Portfolio assistant"
          >
            <header className="flex items-center gap-2 border-b border-primary/20 bg-card/80 px-3 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
              <span className="text-primary/90">●</span>
              <span className="truncate text-primary/80">guest@denish-portfolio</span>
              <span className="text-muted-foreground/70">:~$</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                aria-label="Close terminal"
              >
                <X size={14} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 font-mono text-xs leading-relaxed">
              {messages.length === 0 && !pending && (
                <p className="text-muted-foreground/70">
                  Lexical match to this site only (TF–IDF in your browser). Type a question and press run (or
                  Enter).
                </p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className="mb-3 whitespace-pre-wrap break-words">
                  {msg.role === 'user' ? (
                    <div>
                      <span className="text-muted-foreground/80">{'>'} </span>
                      <span className="text-accent">{msg.text}</span>
                    </div>
                  ) : (
                    <div className="border-l-2 border-primary/30 pl-2 text-primary/95">{msg.text}</div>
                  )}
                </div>
              ))}
              {pending && (
                <div className="space-y-1 text-muted-foreground">
                  {statusHint && <p className="text-[11px] text-primary/70">{statusHint}</p>}
                  <div>
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border border-primary/30 border-t-primary" />{' '}
                    {statusHint || '…'}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-primary/20 bg-background/95 p-2">
              <div className="flex items-end gap-2 rounded-sm border border-primary/25 bg-black/40 px-2 py-1.5 focus-within:border-primary/45">
                <span className="shrink-0 pb-0.5 font-mono text-primary">$</span>
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Ask about experience, school, certs…"
                  className="max-h-24 min-h-[2rem] w-full resize-none bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  disabled={pending}
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={pending || !input.trim()}
                  className="shrink-0 rounded-sm border border-primary/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary hover:bg-primary/15 disabled:opacity-40"
                >
                  run
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
