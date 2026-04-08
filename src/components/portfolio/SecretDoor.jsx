import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function SecretDoor({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4"
          role="dialog"
          aria-modal
          aria-labelledby="secret-title"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="cyber-card max-w-md w-full p-8 hud-corner relative border-primary/30"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <p className="font-mono text-xs text-primary mb-2">{'//'} HIDDEN SECTOR</p>
            <h2 id="secret-title" className="font-orbitron text-lg text-foreground mb-4">
              You found the easter egg
            </h2>
            <p className="font-rajdhani text-muted-foreground text-sm leading-relaxed">
              This panel is reserved for future classified content. For now, enjoy the glow.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 font-mono text-xs uppercase tracking-widest border border-primary/40 px-4 py-2 text-primary hover:bg-primary/10 transition-colors"
            >
              Close channel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
