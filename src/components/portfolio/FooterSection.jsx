import { motion } from 'framer-motion'

function linkKey(link, i) {
  return link.id ?? `${link.platform}-${link.url}-${i}`
}

export default function FooterSection({ socialLinks }) {
  return (
    <footer className="relative py-16 px-4 border-t border-primary/10">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="flex justify-center gap-6 flex-wrap">
            {socialLinks
              ?.filter((l) => l.visible !== false)
              .map((link, i) => (
                <a
                  key={linkKey(link, i)}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary hover-glitch-text inline-block transition-colors"
                >
                  {link.platform}
                </a>
              ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
