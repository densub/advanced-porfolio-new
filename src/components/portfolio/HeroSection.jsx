import { motion } from 'framer-motion'
import GlitchText from './GlitchText'

function linkKey(link, i) {
  return link.id ?? `${link.platform}-${link.url}-${i}`
}

export default function HeroSection({ content, socialLinks }) {
  const name = content?.name || 'DENISH SUBEDI'
  const tagline = content?.tagline || 'Software Engineer // New York, NY'
  const bio =
    content?.bio ||
    'Senior Software Engineer at Fearless. Cloud, data, AI, and secure, scalable systems.'

  return (
    <section
      id="section-hero"
      className="relative scroll-mt-24 min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(hsl(180 100% 50% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(180 100% 50% / 0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'bottom',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase hover-glitch-text inline-block">
            System Online // Status: Available
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h1 className="font-orbitron text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 inline-block hover-glitch-text">
            <GlitchText text={name} className="neon-text text-primary" />
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <p className="font-mono text-sm sm:text-base md:text-lg text-accent neon-text-pink tracking-wider mb-6 hover-glitch-text">
            {tagline}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
          <p className="font-rajdhani text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 hover-glitch-text">
            {bio}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          {socialLinks
            ?.filter((l) => l.visible !== false)
            .map((link, i) => (
              <a
                key={linkKey(link, i)}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-5 py-2.5 border border-primary/30 font-mono text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10 hover-glitch-text inline-block">{link.platform}</span>
                <span className="absolute inset-0 bg-primary/5 group-hover:bg-primary transition-all duration-300" />
              </a>
            ))}
        </motion.div>
      </div>
    </section>
  )
}
