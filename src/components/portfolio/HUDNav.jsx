import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinkClass =
  'px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary hover-glitch-text transition-all duration-300 relative group cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50'

export default function HUDNav({ sections, onSecretClick }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogoClick = (e) => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    if (newCount >= 5) {
      e.preventDefault()
      onSecretClick()
      setClickCount(0)
      return
    }
    setTimeout(() => setClickCount(0), 3000)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`pointer-events-auto fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-primary/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a
            href="#section-hero"
            onClick={handleLogoClick}
            className="font-orbitron text-sm sm:text-base font-bold tracking-widest text-primary neon-text hover-glitch-text inline-block cursor-pointer select-none rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            {'<'} PORTFOLIO {'/>'}
          </a>

          <div className="hidden md:flex items-center gap-1">
            {sections
              .filter((s) => s.visible !== false)
              .map((section) => (
                <a
                  key={section.section_key}
                  href={`#section-${section.section_key}`}
                  className={navLinkClass}
                >
                  <span className="relative z-10">{section.title}</span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-primary p-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-20 px-6"
          >
            <div className="flex flex-col gap-2">
              {sections
                .filter((s) => s.visible !== false)
                .map((section) => (
                  <a
                    key={section.section_key}
                    href={`#section-${section.section_key}`}
                    onClick={closeMobile}
                    className="py-3 font-mono text-sm uppercase tracking-wider text-muted-foreground hover:text-primary hover-glitch-text text-left border-b border-border/30 transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <span className="text-primary mr-2">{'>'}</span>
                    {section.title}
                  </a>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
