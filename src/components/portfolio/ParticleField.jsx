import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 160
/** Pixels — particles within this radius of the cursor are pushed away */
const SCATTER_RADIUS_PX = 175
/** Max repulsion when cursor is on top of a particle */
const SCATTER_STRENGTH = 0.014

export default function ParticleField() {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, inView: false })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random() * 0.85 + 0.15,
      vx: (Math.random() - 0.5) * 0.00045,
      vy: (Math.random() - 0.5) * 0.00045,
    }))

    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }

    const onMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        inView: true,
      }
    }

    const onLeave = () => {
      mouseRef.current.inView = false
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    const tick = () => {
      const { x: mx, y: my, inView } = mouseRef.current

      ctx.fillStyle = 'hsl(222 47% 6% / 0.35)'
      ctx.fillRect(0, 0, w, h)

      for (const p of particles) {
        const px = p.x * w
        const py = p.y * h

        if (inView && w > 0 && h > 0) {
          const dx = px - mx
          const dy = py - my
          const dist = Math.hypot(dx, dy) + 0.001
          if (dist < SCATTER_RADIUS_PX) {
            const t = 1 - dist / SCATTER_RADIUS_PX
            const push = t * t * SCATTER_STRENGTH
            p.vx += (dx / dist) * push / w
            p.vy += (dy / dist) * push / h
          }
        }

        p.vx += (Math.random() - 0.5) * 0.00012
        p.vy += (Math.random() - 0.5) * 0.00012
        p.vx *= 0.991
        p.vy *= 0.991

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
        p.x = Math.min(1, Math.max(0, p.x))
        p.y = Math.min(1, Math.max(0, p.y))

        const drawX = p.x * w
        const drawY = p.y * h
        const a = p.z * 0.55
        ctx.beginPath()
        ctx.arc(drawX, drawY, 1.1 * p.z + 0.35, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(180 100% 52% / ${a})`
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.72]"
      aria-hidden
    />
  )
}
