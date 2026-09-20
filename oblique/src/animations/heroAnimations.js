import { gsap } from '../lib/gsap'

/**
 * Entrance choreography for the hero. Everything starts from a hidden
 * state set by CSS (`data-hero-*` selectors) so there is no flash.
 *
 * @param {HTMLElement} scope  The hero <section>
 * @param {{ reduced: boolean }} options
 */
export function heroIntro(scope, { reduced = false } = {}) {
  const q = gsap.utils.selector(scope)
  const lines = q('[data-hero-line]')
  const labels = q('[data-hero-label]')
  const floats = q('[data-hero-float-intro]')
  const pill = q('[data-hero-pill]')
  const bottom = q('[data-hero-bottom]')

  if (reduced) {
    gsap.set(scope, { autoAlpha: 1 })
    gsap.set([lines, labels, floats, pill, bottom], { clearProps: 'all' })
    return gsap.timeline()
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

  tl.set(scope, { autoAlpha: 1 })
    .fromTo(
      lines,
      { yPercent: 108 },
      { yPercent: 0, duration: 1.5, stagger: 0.09 },
      0.1,
    )
    .fromTo(
      pill,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.3, ease: 'expo.inOut' },
      0.45,
    )
    .fromTo(
      labels,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06 },
      0.55,
    )
    .fromTo(
      floats,
      { autoAlpha: 0, y: 46, scale: 0.94 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1.6,
        stagger: { each: 0.08, from: 'random' },
        clearProps: 'scale',
      },
      0.6,
    )
    .fromTo(
      bottom,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 },
      1.0,
    )

  return tl
}

/**
 * Scroll-linked transformation of the hero into the next section.
 * The whole thing is one scrubbed timeline, so every element moves in
 * relation to the others — not as separate "fade out" effects.
 *
 * @param {HTMLElement} scope
 * @param {{ desktop: boolean, reduced: boolean }} options
 */
export function heroScroll(scope, { desktop = true, reduced = false } = {}) {
  if (reduced) return null
  // Scroll and entrance timelines deliberately target different elements
  // (row containers vs. items, float layers) so they never fight.
  const q = gsap.utils.selector(scope)
  const headline = q('[data-hero-headline]')[0]
  const floats = q('[data-hero-float]')
  const labels = q('[data-hero-top]')
  const bottom = q('[data-hero-bottom-row]')
  const intensity = desktop ? 1 : 0.45

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scope,
      start: 'top top',
      end: 'bottom top',
      scrub: desktop ? 0.7 : true,
    },
  })

  tl.to(headline, { yPercent: -22 * intensity, scale: desktop ? 0.94 : 0.98, transformOrigin: '0% 100%' }, 0)
    .to(labels, { autoAlpha: 0, y: -24 * intensity, duration: 0.5 }, 0)
    .to(bottom, { autoAlpha: 0, y: -30 * intensity, duration: 0.6 }, 0.05)

  floats.forEach((el) => {
    const speed = parseFloat(el.dataset.heroFloat || '1')
    const drift = parseFloat(el.dataset.heroDrift || '0')
    const spin = parseFloat(el.dataset.heroSpin || '0')
    tl.to(
      el,
      {
        y: `${-140 * speed * intensity}`,
        x: `${drift * intensity}`,
        rotation: `+=${spin * intensity}`,
      },
      0,
    )
  })

  return tl
}
