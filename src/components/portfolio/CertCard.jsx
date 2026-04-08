import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

function linkClass() {
  return 'text-primary hover:text-accent underline-offset-2 hover:underline transition-colors'
}

export default function CertCard({ cert, index }) {
  const TitleTag = cert.url ? 'a' : 'span'
  const titleProps = cert.url
    ? {
        href: cert.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        className: `font-orbitron text-xs sm:text-sm font-semibold text-foreground inline-block leading-snug hover-glitch-text ${linkClass()}`,
      }
    : {
        className:
          'font-orbitron text-xs sm:text-sm font-semibold text-foreground inline-block leading-snug hover-glitch-text',
      }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.06, 0.6) }}
      className="cyber-card rounded-sm p-5 flex items-start gap-4 hud-corner"
    >
      <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-secondary/30 bg-secondary/5 rounded-sm">
        <Award size={18} className="text-secondary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
          <TitleTag {...titleProps}>{cert.title}</TitleTag>
          {cert.inProgress && (
            <span className="shrink-0 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider rounded-sm border border-amber-500/45 text-amber-400/95 bg-amber-500/10">
              In progress
            </span>
          )}
        </div>

        <div className="mt-0.5 space-y-1">
          {cert.issuerUrl ? (
            <a
              href={cert.issuerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`font-rajdhani text-sm text-secondary neon-text-purple block hover-glitch-text ${linkClass()}`}
            >
              {cert.issuer}
            </a>
          ) : (
            <p className="font-rajdhani text-sm text-secondary neon-text-purple block hover-glitch-text">
              {cert.issuer}
            </p>
          )}

          {cert.date && (
            <span className="font-mono text-xs text-muted-foreground block hover-glitch-text">{cert.date}</span>
          )}

          {cert.expires && (
            <span className="font-mono text-xs text-muted-foreground/90 block hover-glitch-text">
              Expires {cert.expires}
            </span>
          )}
        </div>

        {cert.credentialId && (
          <p className="font-mono text-[11px] text-muted-foreground/80 mt-1.5 break-all hover-glitch-text">
            Credential ID: <span className="text-muted-foreground">{cert.credentialId}</span>
          </p>
        )}

        {cert.skills && (
          <p className="font-rajdhani text-xs text-accent/90 mt-2 leading-relaxed hover-glitch-text">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1.5">
              Skills
            </span>
            {cert.skills}
          </p>
        )}

        {cert.secondaryUrl && (
          <a
            href={cert.secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 mt-3 font-mono text-[11px] uppercase tracking-wider ${linkClass()}`}
          >
            {cert.secondaryLabel || 'Additional link'}
          </a>
        )}
      </div>
    </motion.div>
  )
}
