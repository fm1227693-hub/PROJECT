import { useLayoutEffect, useMemo, useState } from 'react'
import { ScrollTrigger, ScrollSmoother } from '../lib/gsap'
import { getCapabilities } from '../lib/device'
import { ScrollContext } from './scroll'

/**
 * Owns the ScrollSmoother instance and acts as a readiness gate:
 * the page is mounted only after fonts are loaded and (on desktop) the smoother exists,
 * so every ScrollTrigger and SplitText below is created against final metrics.
 *
 * `fixed` children are rendered outside the smoothed content (navbar, cursor, overlays).
 */
export default function SmoothScrollProvider({ fixed, children }) {
  const [ready, setReady] = useState(null)

  useLayoutEffect(() => {
    let cancelled = false
    let smoother = null
    const caps = getCapabilities()

    const boot = () => {
      if (cancelled) return
      if (caps.smooth) {
        smoother = ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1.15,
          effects: false,
          smoothTouch: false,
          normalizeScroll: false,
          ignoreMobileResize: true,
        })
      }
      setReady({ caps, smoother })
    }

    // Nothing below is mounted yet, so `document.fonts.ready` alone would resolve
    // before the faces are even requested. Ask for the two families explicitly,
    // then wait — every measurement (pins, horizontal tracks, splits) depends on it.
    const fonts = document.fonts
    const fontsReady = fonts
      ? Promise.all([
          fonts.load('500 1rem "Instrument Sans Variable"'),
          fonts.load('italic 400 1rem "Instrument Serif"'),
        ]).then(() => fonts.ready)
      : Promise.resolve()
    // Cap the wait so a slow font never blocks the page.
    Promise.race([fontsReady, new Promise((r) => setTimeout(r, 2200))]).then(boot)

    // Safety net: any face that arrives later (e.g. the timeout won) re-measures everything.
    const onFontsDone = () => ScrollTrigger.refresh()
    fonts?.addEventListener('loadingdone', onFontsDone)

    return () => {
      cancelled = true
      fonts?.removeEventListener('loadingdone', onFontsDone)
      smoother?.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const value = useMemo(() => {
    if (!ready) return null
    const { caps, smoother } = ready
    return {
      caps,
      smoother,
      /** Scroll to an element or selector, honouring the smoother when present. */
      scrollTo(target, offset = 0) {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (!el) return
        if (smoother) {
          smoother.scrollTo(el, !caps.reduced, `top ${offset}px`)
        } else {
          const y = el.getBoundingClientRect().top + window.scrollY - offset
          window.scrollTo({ top: y, behavior: caps.reduced ? 'auto' : 'smooth' })
        }
      },
      refresh() {
        ScrollTrigger.refresh()
      },
    }
  }, [ready])

  return (
    <ScrollContext.Provider value={value}>
      {value && fixed}
      <div id="smooth-wrapper">
        <div id="smooth-content">{value && children}</div>
      </div>
    </ScrollContext.Provider>
  )
}
