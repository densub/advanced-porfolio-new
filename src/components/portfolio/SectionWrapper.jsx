import { motion } from 'framer-motion'

export default function SectionWrapper({ id: sectionKey, title, index, children }) {
  return (
    <section
      id={`section-${sectionKey}`}
      className="relative scroll-mt-24 py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="mb-10 flex items-center gap-4"
        >
          <span className="font-mono text-xs text-muted-foreground hover-glitch-text inline-block">
            {'//'} {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="font-orbitron text-xl sm:text-2xl font-bold tracking-[0.2em] text-primary neon-text hover-glitch-text inline-block">
            {title}
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent" />
        </motion.div>
        {children}
      </div>
    </section>
  )
}
