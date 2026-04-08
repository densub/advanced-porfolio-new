import { motion } from 'framer-motion'

export default function TimelineCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-primary/40 to-transparent" />

      <div className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-primary bg-background" />

      <div className="cyber-card rounded-sm p-5 sm:p-6 hud-corner">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
          <h3 className="font-orbitron text-sm sm:text-base font-semibold text-primary hover-glitch-text inline-block">
            {item.title}
          </h3>
          <span className="font-mono text-xs text-muted-foreground tracking-wider hover-glitch-text inline-block">
            {item.period}
          </span>
        </div>
        <p className="font-rajdhani text-sm sm:text-base font-semibold text-accent neon-text-pink mb-2 hover-glitch-text">
          {item.subtitle}
        </p>
        {item.description && (
          <p className="font-rajdhani text-sm text-muted-foreground leading-relaxed hover-glitch-text">
            {item.description}
          </p>
        )}
        {item.tags && (
          <div className="flex flex-wrap gap-2 mt-3">
            {item.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 border border-primary/20 font-mono text-xs text-primary/70 hover-glitch-text inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
