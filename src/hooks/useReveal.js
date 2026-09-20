import { useEffect } from 'react'

/**
 * useReveal — shared IntersectionObserver scroll-reveal system.
 *
 * Elements opt in via:
 *   data-reveal            → fade + rise (default)
 *   data-reveal="left"     → slide in from left
 *   data-reveal="right"    → slide in from right
 *   data-reveal="zoom"     → scale in
 *   .mask-reveal           → clip-path curtain reveal (image frames)
 *
 * Optional stagger: data-reveal-delay="120" (ms)
 * Legacy [data-aos] elements are picked up too (AOS was previously
 * neutralised — this gives those 90+ usages a subtle, unified reveal).
 *
 * Respects prefers-reduced-motion (content shown immediately).
 * A single observer instance is shared across the whole app.
 */

let observer = null
let mutationObserver = null
const REVEAL_SELECTOR =
  '[data-reveal]:not(.is-revealed), [data-aos]:not(.is-revealed), .mask-reveal:not(.is-revealed)'

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.05, rootMargin: '0px 0px -4% 0px' }
  )
  return observer
}

function applyDelay(el) {
  if (el.style.getPropertyValue('--reveal-delay')) return
  let delay = 0
  if (el.dataset.revealDelay) delay = parseInt(el.dataset.revealDelay, 10) || 0
  else if (el.dataset.aosDelay) delay = parseInt(el.dataset.aosDelay, 10) || 0
  if (delay) el.style.setProperty('--reveal-delay', `${Math.min(delay, 450)}ms`)
}

/**
 * Keyin mount bo'ladigan [data-aos] kontenti (test savollari, o'yinlar,
 * admin panellar) uchun — DOM qo'shilganda avtomatik kuzatadi.
 */
function startMutationObserver() {
  if (mutationObserver || typeof MutationObserver === 'undefined') return
  mutationObserver = new MutationObserver((mutations) => {
    let pending = false
    for (const m of mutations) {
      if (m.type !== 'childList') continue
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue
        if (
          (node.matches && node.matches(REVEAL_SELECTOR)) ||
          (node.querySelector && node.querySelector(REVEAL_SELECTOR))
        ) {
          pending = true
          break
        }
      }
      if (pending) break
    }
    if (pending) requestAnimationFrame(() => observeReveals())
  })
  mutationObserver.observe(document.body, { childList: true, subtree: true })
}

export function observeReveals(root = document) {
  if (typeof window === 'undefined') return
  const els = root.querySelectorAll(REVEAL_SELECTOR)
  if (!els.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-revealed'))
    return
  }

  els.forEach((el) => {
    applyDelay(el)
    getObserver().observe(el)
  })

  startMutationObserver()
}

export default function useReveal(deps = []) {
  useEffect(() => {
    observeReveals()
    // Safety net for late-mounted subtrees
    const t = setTimeout(() => observeReveals(), 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
