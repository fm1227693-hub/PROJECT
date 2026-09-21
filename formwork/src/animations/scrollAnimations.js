import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'

const EXPO = 'expo.out'

/* ------------------------------------------------------------------ */
/*  Section themes                                                     */
/* ------------------------------------------------------------------ */

/**
 * Every element with [data-theme] switches the <html> theme when it owns the
 * middle of the viewport. The body eases its colours in CSS, so the change reads
 * as a transition rather than a cut.
 */
export function initSectionThemes(root = document) {
  const sections = Array.from(root.querySelectorAll('[data-theme]'))
  const html = document.documentElement
  const set = (theme) => {
    if (html.dataset.theme !== theme) html.dataset.theme = theme
  }
  const triggers = sections.map((el) =>
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => set(el.dataset.theme),
      onEnterBack: () => set(el.dataset.theme),
    }),
  )
  return () => triggers.forEach((t) => t.kill())
}

/* ------------------------------------------------------------------ */
/*  Text                                                               */
/* ------------------------------------------------------------------ */

/**
 * Masked line reveal. Lines slide up out of an overflow-hidden mask when the
 * element enters the viewport. Re-splits on resize (autoSplit).
 */
export function revealLines(el, { start = 'top 85%', stagger = 0.08, duration = 1.3, delay = 0, y = 110, once = true, reduced = false } = {}) {
  if (!el) return null
  if (reduced) return null

  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: y,
        duration,
        stagger,
        delay,
        ease: EXPO,
        scrollTrigger: {
          trigger: el,
          start,
          once,
          toggleActions: 'play none none reverse',
        },
      })
    },
  })
}

/**
 * Word-by-word emphasis linked to scroll: words go from dim to full as the
 * reader moves through the statement. Reading pace becomes the animation.
 */
export function highlightWords(el, { start = 'top 78%', end = 'bottom 55%', reduced = false } = {}) {
  if (!el || reduced) return null
  return SplitText.create(el, {
    type: 'words',
    wordsClass: 'hl-word',
    autoSplit: true,
    onSplit(self) {
      return gsap.to(self.words, {
        opacity: 1,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: { trigger: el, start, end, scrub: true },
      })
    },
  })
}

/* ------------------------------------------------------------------ */
/*  Movement                                                           */
/* ------------------------------------------------------------------ */

/**
 * Scroll-linked vertical drift. `distance` is the total travel in px across the
 * element's journey through the viewport (negative = moves up faster).
 */
export function parallax(el, distance, { scale = 1, trigger = el, start = 'top bottom', end = 'bottom top' } = {}) {
  if (!el || !scale) return null
  return gsap.fromTo(
    el,
    { y: -distance * scale * 0.5 },
    {
      y: distance * scale * 0.5,
      ease: 'none',
      scrollTrigger: { trigger, start, end, scrub: true },
    },
  )
}

/** Horizontal scroll-linked drift, for typography that should breathe sideways. */
export function driftX(el, distance, { scale = 1, trigger = el, start = 'top bottom', end = 'bottom top' } = {}) {
  if (!el || !scale) return null
  return gsap.fromTo(
    el,
    { x: -distance * scale * 0.5 },
    { x: distance * scale * 0.5, ease: 'none', scrollTrigger: { trigger, start, end, scrub: true } },
  )
}

/**
 * Image reveal: the frame un-clips while the image inside settles from a
 * gentle zoom. Transform + clip-path only.
 */
export function imageReveal(frame, img, { start = 'top 82%', duration = 1.5, reduced = false } = {}) {
  if (!frame) return null
  if (reduced) return null
  const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start, once: true } })
  tl.fromTo(frame, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration, ease: EXPO }, 0)
  if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: duration + 0.4, ease: EXPO }, 0)
  return tl
}

/** Simple enter animation for small elements (used sparingly). */
export function rise(targets, { start = 'top 88%', y = 28, stagger = 0.06, duration = 1.1, trigger, reduced = false } = {}) {
  if (!targets || reduced) return null
  const list = gsap.utils.toArray(targets)
  if (!list.length) return null
  // fromTo with explicit end values: immune to CSS transitions or mid-transition computed styles.
  return gsap.fromTo(
    list,
    { y, opacity: 0 },
    { y: 0, opacity: 1, duration, stagger, ease: EXPO, clearProps: 'transform', scrollTrigger: { trigger: trigger || list[0], start, once: true } },
  )
}

/**
 * Applies `parallax()` to every `[data-parallax="<px>"]` inside `scope`
 * and `driftX()` to every `[data-drift-x="<px>"]`. Distances are scaled by
 * the device's parallax budget (0 on reduced motion, 0.4 on touch).
 */
export function applyParallax(scope, scale = 1) {
  if (!scope || !scale) return []
  const tweens = []
  scope.querySelectorAll('[data-parallax]').forEach((el) => {
    const d = parseFloat(el.dataset.parallax)
    if (d) tweens.push(parallax(el, d, { scale, trigger: el.closest('[data-parallax-trigger]') || el }))
  })
  scope.querySelectorAll('[data-drift-x]').forEach((el) => {
    const d = parseFloat(el.dataset.driftX)
    if (d) tweens.push(driftX(el, d, { scale, trigger: el.closest('[data-parallax-trigger]') || el }))
  })
  return tweens
}
