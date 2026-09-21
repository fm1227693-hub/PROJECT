import { gsap } from '../lib/gsap'

/**
 * Entrance: headline lines rise out of their masks, then metadata and the
 * floating objects settle in. One timeline, one ease family.
 */
export function heroEntrance(scope, { reduced = false } = {}) {
  const q = gsap.utils.selector(scope)
  const lines = q('[data-hero-line]')
  const fades = q('[data-hero-fade]')
  const floats = q('[data-float-inner]')

  if (reduced) {
    gsap.set([...lines, ...fades, ...floats], { clearProps: 'all' })
    return null
  }

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from(lines, { yPercent: 108, duration: 1.6, stagger: 0.1 }, 0.15)
    .from(fades, { opacity: 0, y: 16, duration: 1.1, stagger: 0.06 }, 0.55)
    .from(floats, { opacity: 0, scale: 0.94, y: 28, duration: 1.5, stagger: 0.08 }, 0.6)
  return tl
}

/**
 * Scroll transformation.
 *
 * Desktop (pinned): while the stage is held, the headline shrinks toward the top-left
 * and its lines shear apart horizontally; the floating objects each leave along their
 * own vector; the depth ring expands; a bone-coloured veil rises so the hero's colour
 * becomes the next section's colour before the pin releases. One scrubbed timeline —
 * everything moves together, so it reads as a single continuous transformation.
 *
 * Touch / small screens (not pinned): the same vocabulary at a fraction of the range.
 */
export function heroScroll(scope, stage, { pin = true, parallax = 1, onProgress, onTheme } = {}) {
  const q = gsap.utils.selector(scope)
  const lines = q('[data-hero-line]')
  const headline = q('[data-hero-headline]')
  const image = q('[data-float="image"]')
  const token = q('[data-float="token"]')
  const orb = q('[data-float="orb"]')
  const badge = q('[data-float="badge"]')
  const status = q('[data-float="status"]')
  const support = q('[data-hero-support]')
  const cta = q('[data-hero-cta]')
  const top = q('[data-hero-top]')
  const depth = q('[data-hero-depth]')

  if (!pin) {
    const p = parallax
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => onProgress?.(s.progress) },
    })
    if (lines[0]) tl.to(lines[0], { xPercent: -5 * p }, 0)
    if (lines[1]) tl.to(lines[1], { xPercent: 6 * p }, 0)
    if (lines[2]) tl.to(lines[2], { xPercent: -4 * p }, 0)
    if (image.length) tl.to(image, { y: -90 * p }, 0)
    if (token.length) tl.to(token, { y: 50 * p }, 0)
    if (badge.length) tl.to(badge, { rotation: 90 * p }, 0)
    if (depth.length) tl.to(depth, { scale: 1.25, opacity: 0 }, 0)
    return tl
  }

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scope,
      start: 'top top',
      end: '+=105%',
      pin: stage,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (s) => {
        onProgress?.(s.progress)
        // hand the page colour to the next section while the stage is still held
        onTheme?.(s.progress > 0.55 ? 'bone' : 'paper')
      },
    },
  })

  // Headline: lines shear apart, the block shrinks and drifts up, then fades late.
  if (lines[0]) tl.to(lines[0], { xPercent: -5, duration: 1 }, 0)
  if (lines[1]) tl.to(lines[1], { xPercent: 9, duration: 1 }, 0)
  if (lines[2]) tl.to(lines[2], { xPercent: -3, duration: 1 }, 0)
  tl.to(headline, { scale: 0.74, y: '-12vh', transformOrigin: '0% 0%', duration: 1 }, 0)
  tl.to(headline, { opacity: 0, duration: 0.22, ease: 'power1.in' }, 0.78)

  // Supporting copy & CTA leave first, metadata shortly after.
  tl.to([...support, ...cta], { y: -70, opacity: 0, duration: 0.4 }, 0)
  tl.to(top, { y: -30, opacity: 0, duration: 0.4 }, 0.15)

  // Floating objects — each on its own vector, image travels the furthest.
  if (image.length) tl.to(image, { x: '22vw', y: '-30vh', rotation: 7, scale: 1.14, duration: 1 }, 0)
  if (token.length) tl.to(token, { x: '-12vw', y: '20vh', rotation: -5, duration: 1 }, 0)
  if (orb.length) tl.to(orb, { x: '-16vw', y: '-8vh', scale: 1.18, duration: 1 }, 0)
  if (badge.length) tl.to(badge, { y: '18vh', rotation: 140, duration: 1 }, 0)
  if (status.length) tl.to(status, { x: '10vw', y: '-12vh', opacity: 0, duration: 0.7 }, 0)
  tl.to([...image, ...token, ...orb, ...badge], { opacity: 0, duration: 0.2 }, 0.72)

  // Background depth: the ring grows and dissolves.
  if (depth.length) tl.to(depth, { scale: 1.7, opacity: 0, duration: 1 }, 0)

  return tl
}
