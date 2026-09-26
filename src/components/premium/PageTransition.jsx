import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { prefersReducedMotion } from './studioEnv'

const ROUTE_LABELS = [
  { match: /^\/about/, label: 'About', index: '01' },
  { match: /^\/stats/, label: 'Stats', index: '02' },
  { match: /^\/mentor-stats/, label: 'Mentors', index: '03' },
  { match: /^\/level-test/, label: 'Level test', index: '04' },
  { match: /^\/pricing/, label: 'Pricing', index: '05' },
  { match: /^\/games/, label: 'Games', index: '06' },
  { match: /^\/reading-tests/, label: 'Reading', index: '07' },
  { match: /^\/listening-tests/, label: 'Listening', index: '08' },
  { match: /^\/ielts-writing/, label: 'Writing', index: '09' },
  { match: /^\/faq/, label: 'FAQ', index: '10' },
  { match: /^\/form/, label: 'Enroll', index: '11' },
  { match: /^\/privacy-policy/, label: 'Privacy', index: '12' },
  { match: /^\/terms-of-use/, label: 'Terms', index: '13' },
  { match: /^\/principle/, label: 'Principle', index: '14' },
  { match: /^\/$/, label: 'Home', index: '00' },
]

function labelFor(pathname) {
  const hit = ROUTE_LABELS.find((r) => r.match.test(pathname))
  return hit || { label: 'Optimum', index: '—' }
}

/**
 * PageTransition — a cinematic curtain that compresses the outgoing view,
 * reveals a route label, then lifts to admit the new page.
 */
export default function PageTransition() {
  const location = useLocation()
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const accentRef = useRef(null)
  const labelRef = useRef(null)
  const firstRef = useRef(true)

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
      return undefined
    }

    const root = rootRef.current
    const panel = panelRef.current
    const accent = accentRef.current
    const label = labelRef.current
    if (!root || !panel || !accent || !label) return undefined

    if (prefersReducedMotion()) return undefined

    const { label: text, index } = labelFor(location.pathname)
    label.innerHTML = `${text}<small>${index}</small>`

    gsap.set([panel, accent], { transformOrigin: 'bottom', scaleY: 0 })
    gsap.set(root, { pointerEvents: 'auto' })

    const tl = gsap.timeline({
      onComplete: () => gsap.set(root, { pointerEvents: 'none' }),
    })

    tl.to(accent, { scaleY: 1, duration: 0.42, ease: 'expo.in' }, 0)
      .to(panel, { scaleY: 1, duration: 0.5, ease: 'expo.in' }, 0.08)
      .fromTo(label, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0.34)
      .to(label, { opacity: 0, y: -22, duration: 0.3, ease: 'power3.in' }, 0.78)
      .set([panel, accent], { transformOrigin: 'top' })
      .to(panel, { scaleY: 0, duration: 0.62, ease: 'expo.out' }, 0.86)
      .to(accent, { scaleY: 0, duration: 0.62, ease: 'expo.out' }, 0.94)

    return () => tl.kill()
  }, [location.pathname])

  return (
    <div className="st-curtain" ref={rootRef} aria-hidden="true">
      <div className="st-curtain-panel is-accent" ref={accentRef} />
      <div className="st-curtain-panel" ref={panelRef} />
      <div className="st-curtain-label" ref={labelRef} />
    </div>
  )
}
