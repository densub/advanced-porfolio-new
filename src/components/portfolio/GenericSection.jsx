import { motion } from 'framer-motion'

export default function GenericSection({ content }) {
  if (!content?.items || content.items.length === 0) {
    return (
      <div className="cyber-card rounded-sm p-6">
        <p className="font-rajdhani text-muted-foreground hover-glitch-text">{content?.text || 'Content coming soon...'}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {content.items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="cyber-card rounded-sm p-5 hud-corner"
        >
          <h3 className="font-orbitron text-sm font-semibold text-primary mb-2 hover-glitch-text inline-block">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-accent underline-offset-2 hover:underline"
              >
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h3>
          {item.subtitle && (
            <p className="font-rajdhani text-sm text-accent neon-text-pink mb-1 hover-glitch-text">{item.subtitle}</p>
          )}
          {item.description && (
            <p className="font-rajdhani text-sm text-muted-foreground hover-glitch-text">{item.description}</p>
          )}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {item.tags.map((tag, j) => (
                <span
                  key={j}
                  className="px-2 py-0.5 border border-primary/25 bg-primary/5 font-mono text-[10px] sm:text-xs text-primary/85 uppercase tracking-wide hover-glitch-text inline-block"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
