import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './studioEnv'

gsap.registerPlugin(ScrollTrigger)

/**
 * SplitText — explicit editorial line breaks wrapped in overflow masks.
 * Animate with useSplitReveal (mark the element with `data-split`).
 */
export function SplitText({ lines = [], className = '', lineClass = '', tag: Tag = 'h1', ...rest }) {
  return (
    <Tag className={className} data-split {...rest}>
      {lines.map((line, i) => (
        <span className={`st-line ${line.em ? 'st-line-em' : ''} ${lineClass}`} key={i}>
          <span>{line.text}</span>
        </span>
      ))}
    </Tag>
  )
}

/**
 * RevealWords — cinematic scroll-driven typography.
 * Words sharpen from low contrast to full contrast as the section passes;
 * `accent` words land in the accent colour.
 */
export function RevealWords({ text = '', accent = [], className = '', tag: Tag = 'p' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const words = [...el.querySelectorAll('.w')]
    if (!words.length) return

    if (prefersReducedMotion()) {
      words.forEach((w) => w.classList.add('on'))
      return
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 72%',
      end: 'bottom 42%',
      scrub: true,
      onUpdate: (self) => {
        const active = Math.floor(self.progress * words.length)
        words.forEach((w, i) => w.classList.toggle('on', i <= active))
      },
    })

    return () => trigger.kill()
  }, [])

  const parts = String(text).split(/\s+/).filter(Boolean)

  return (
    <Tag className={className} ref={ref}>
      {parts.map((word, i) => {
        const clean = word.replace(/[^\p{L}\p{N}']/gu, '').toLowerCase()
        const isAccent = accent.some((a) => a.toLowerCase() === clean)
        return (
          <span key={i} className={`w ${isAccent ? 'hl' : ''}`}>
            {word}{' '}
          </span>
        )
      })}
    </Tag>
  )
}
