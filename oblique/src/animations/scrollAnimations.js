import { gsap, ScrollTrigger, SplitText } from '../lib/gsap'

/**
 * Shared scroll-driven building blocks. Every helper returns something
 * that can be reverted by a gsap.context, so components stay clean.
 */

const defaultTrigger = (trigger, extra = {}) => ({
  trigger,
  start: 'top 85%',
  once: true,
  ...extra,
})

/**
 * Split an element into masked lines and slide them up as they enter.
 */
export function revealLines(el, { delay = 0, stagger = 0.08, duration = 1.3, trigger, ...st } = {}) {
  if (!el) return null
  return SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        duration,
        stagger,
        delay,
        ease: 'expo.out',
        scrollTrigger: defaultTrigger(trigger || el, st),
      })
    },
  })
}

/**
 * Word-by-word "reading" effect: words brighten as the user scrolls.
 */
export function scrubWords(el, { start = 'top 78%', end = 'bottom 50%', from = 0.14 } = {}) {
  if (!el) return null
  return SplitText.create(el, {
    type: 'words',
    wordsClass: 'split-word',
    autoSplit: true,
    onSplit(self) {
      return gsap.fromTo(
        self.words,
        { opacity: from },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
        },
      )
    },
  })
}

/**
 * Simple fade-up for groups of elements.
 */
export function revealUp(targets, { y = 32, stagger = 0.1, duration = 1.2, trigger, delay = 0, ...st } = {}) {
  const list = gsap.utils.toArray(targets)
  if (!list.length) return null
  return gsap.from(list, {
    y,
    autoAlpha: 0,
    duration,
    stagger,
    delay,
    ease: 'expo.out',
    clearProps: 'transform',
    scrollTrigger: defaultTrigger(trigger || list[0], st),
  })
}

/**
 * Vertical parallax that works with and without ScrollSmoother.
 * `amount` is the total travel in px across the element's visible range.
 */
export function parallaxY(el, amount = 80, { trigger, start = 'top bottom', end = 'bottom top' } = {}) {
  if (!el) return null
  return gsap.fromTo(
    el,
    { y: -amount / 2 },
    {
      y: amount / 2,
      ease: 'none',
      scrollTrigger: { trigger: trigger || el, start, end, scrub: true },
    },
  )
}

/**
 * Image reveal: the image is un-cropped from the bottom while it settles
 * from a slight zoom. Two layers so only transforms / clip-path animate.
 */
export function revealImage(wrapper, img, { trigger, delay = 0, duration = 1.5 } = {}) {
  if (!wrapper) return null
  const tl = gsap.timeline({
    defaults: { ease: 'expo.out', duration },
    scrollTrigger: defaultTrigger(trigger || wrapper, { start: 'top 88%' }),
  })
  tl.fromTo(wrapper, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', delay })
  if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: duration + 0.3 }, '<')
  return tl
}

/**
 * Colour theme per section. Sections carry `data-theme` and the html
 * element receives the active one; CSS handles the smooth transition.
 */
export function createThemeTriggers(root = document) {
  const sections = gsap.utils.toArray('[data-theme]', root)
  const html = document.documentElement
  const triggers = sections.map((section) =>
    ScrollTrigger.create({
      trigger: section,
      // Sections that paint their own background can switch later
      // (data-theme-start) so neighbouring content is never swallowed.
      start: section.dataset.themeStart || 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) html.dataset.theme = section.dataset.theme
      },
    }),
  )
  return triggers
}

/**
 * Horizontal scroll for the showcase. Returns the main tween so panels can
 * use it as `containerAnimation`.
 */
export function horizontalScroll(section, track, { scrub = 0.9, onUpdate } = {}) {
  const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
  return gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate,
    },
  })
}
