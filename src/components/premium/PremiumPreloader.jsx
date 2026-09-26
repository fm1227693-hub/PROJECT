import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { emitReady, prefersReducedMotion } from './studioEnv'

const STAGES = ['preloader.s1', 'preloader.s2', 'preloader.s3', 'preloader.s4']

/**
 * PremiumPreloader — a numeric counter with technical status text.
 * Progress is driven by the real load signal (document + webfonts) and never
 * deliberately delayed: it exits as soon as the page is genuinely ready.
 */
export default function PremiumPreloader({ onDone }) {
  const rootRef = useRef(null)
  const countRef = useRef(null)
  const barRef = useRef(null)
  const wordsRef = useRef(null)
  const [stage, setStage] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reduced = prefersReducedMotion()
    document.body.classList.add('st-preloading')
    document.documentElement.style.overflow = 'hidden'

    let loaded = false
    const markLoaded = () => {
      loaded = true
    }
    if (document.readyState === 'complete') markLoaded()
    else window.addEventListener('load', markLoaded, { once: true })
    if (document.fonts?.ready) document.fonts.ready.then(markLoaded).catch(() => {})
    const safety = setTimeout(markLoaded, 2600)

    const start = performance.now()
    const MIN_MS = reduced ? 200 : 620
    let progress = 0
    let finished = false
    let raf = 0

    const paint = (v) => {
      const shown = Math.round(v)
      if (countRef.current) countRef.current.textContent = String(shown).padStart(2, '0')
      if (barRef.current) barRef.current.style.width = `${v}%`
    }

    const step = () => {
      const elapsed = performance.now() - start
      // ease toward 92% while assets load, then complete
      const ceiling = loaded ? 100 : 92
      progress += (ceiling - progress) * (loaded ? 0.14 : 0.055)
      if (loaded && elapsed > MIN_MS) progress = Math.min(100, progress + 3.4)
      paint(progress)

      const nextStage = Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length))
      setStage(nextStage)

      if (progress >= 99.5 && elapsed > MIN_MS) {
        finish()
        return
      }
      raf = requestAnimationFrame(step)
    }

    const finish = () => {
      if (finished) return
      finished = true
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      paint(100)

      const done = () => {
        window.__studioReady = true
        document.body.classList.remove('st-preloading')
        document.documentElement.style.overflow = ''
        emitReady()
        onDone?.()
      }

      if (reduced) {
        done()
        return
      }

      gsap
        .timeline({ onComplete: done })
        .to(root.querySelectorAll('[data-pl-fade]'), {
          y: -26,
          opacity: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power3.in',
        })
        .to(root, { yPercent: -101, duration: 1.05, ease: 'expo.inOut' }, '-=0.1')
    }

    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      window.removeEventListener('load', markLoaded)
      document.body.classList.remove('st-preloading')
      document.documentElement.style.overflow = ''
    }
  }, [onDone])

  return (
    <div className="st-preloader" ref={rootRef} role="status" aria-live="polite">
      <div className="st-preloader-top" data-pl-fade>
        <span className="st-mono">Optimum — School of English</span>
        <span className="st-mono">Real-time learning platform</span>
      </div>

      <div className="st-pre-status" data-pl-fade>
        <div className="st-pre-status-inner" ref={wordsRef}>
          {STAGES.map((k, i) => (
            <span key={k} style={{ opacity: i === stage ? 1 : 0.25, transition: 'opacity 0.4s' }}>
              {t(k, 'Loading')}
            </span>
          ))}
        </div>
      </div>

      <div className="st-preloader-bottom" data-pl-fade>
        <span className="st-mono">Buxoro · Uzbekistan</span>
        <div className="st-pre-count">
          <span ref={countRef}>00</span>
        </div>
      </div>

      <div className="st-pre-bar">
        <i ref={barRef} />
      </div>
    </div>
  )
}
