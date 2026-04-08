import { useState, useEffect, createElement } from 'react'

export default function GlitchText({ text, className = '', as: Comp = 'span' }) {
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`01'

  useEffect(() => {
    if (!text) return
    let iteration = 0
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, idx) => {
            if (idx < iteration) return char
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
      if (iteration >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
      iteration += 1 / 2
    }, 30)
    return () => clearInterval(interval)
  }, [text])

  return createElement(Comp, {
    className: `${className} ${!done ? 'opacity-90' : ''}`,
    children: display || text,
  })
}
