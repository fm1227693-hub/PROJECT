import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import Logo from './Logo'
import MagneticButton from './MagneticButton'
import Clock from './Clock'
import { ArrowUpRight } from './icons'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Practice', href: '#practice' },
  { label: 'Process', href: '#process' },
  { label: 'Studio', href: '#studio' },
]

export default function Navbar() {
  const { ready, env, scrollTo, pause } = useSmoothScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const headerRef = useRef(null)

  // Scroll state: compact after a few px, hidden while scrolling down.
  useEffect(() => {
    if (!ready) return undefined
    let lastScrolled = false
    let lastHidden = false
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        const nextScrolled = y > 24
        const nextHidden = self.direction === 1 && y > 480 && !open
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled
          setScrolled(nextScrolled)
        }
        if (nextHidden !== lastHidden) {
          lastHidden = nextHidden
          setHidden(nextHidden)
        }
      },
    })
    return () => st.kill()
  }, [ready, open])

  // Lock the page while the mobile menu is open.
  useEffect(() => {
    pause(open)
    return () => pause(false)
  }, [open, pause])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useGSAP(
    () => {
      if (!open || env.reduced) return
      const q = gsap.utils.selector(menuRef)
      gsap.fromTo(
        q('[data-menu-item]'),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.07, ease: 'expo.out', delay: 0.1 },
      )
      gsap.fromTo(
        q('[data-menu-meta]'),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out', delay: 0.4 },
      )
    },
    { scope: menuRef, dependencies: [open] },
  )

  const go = useCallback(
    (e, href) => {
      e.preventDefault()
      setOpen(false)
      // Let the menu close before the page moves.
      requestAnimationFrame(() => scrollTo(href, 0))
    },
    [scrollTo],
  )

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-[70] rounded-full bg-ink px-4 py-2 text-sm text-paper"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className={[
          'fixed inset-x-0 top-0 z-50 text-[var(--c-fg)] transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)]',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
        ].join(' ')}
      >
        <div
          className={[
            'gutter flex items-center justify-between transition-[height,background-color,border-color,backdrop-filter] duration-700 [transition-timing-function:var(--ease-out-expo)] border-b',
            scrolled && !open
              ? 'h-14 border-current/10 bg-[color-mix(in_srgb,var(--c-bg)_78%,transparent)] backdrop-blur-md'
              : 'h-[72px] border-transparent bg-transparent md:h-20',
          ].join(' ')}
        >
          <a
            href="#top"
            onClick={(e) => go(e, '#top')}
            className="relative z-10 rounded-sm"
            aria-label="Oblique — back to top"
          >
            <Logo compact={scrolled} />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="link-underline text-[13.5px] font-medium tracking-[-0.01em]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <MagneticButton href="#contact" size="sm" onClick={(e) => go(e, '#contact')}>
                Start a project
              </MagneticButton>
            </div>
            <button
              type="button"
              className="relative z-10 flex h-10 items-center gap-2 rounded-full px-3 text-[13.5px] font-medium lg:hidden"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="swap-text">
                <span>{open ? 'Close' : 'Menu'}</span>
                <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
              </span>
              <span className="relative block h-3 w-4" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${open ? 'translate-y-[5.5px] rotate-45' : ''}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={[
          'fixed inset-0 z-40 flex flex-col bg-[var(--c-bg)] text-[var(--c-fg)] transition-[opacity,visibility] duration-500 [transition-timing-function:var(--ease-out-expo)] lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0',
        ].join(' ')}
      >
        <div className="gutter flex flex-1 flex-col justify-end pb-10 pt-28">
          <nav aria-label="Menu" className="flex flex-col gap-1">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => go(e, l.href)}
                className="group flex items-baseline justify-between overflow-hidden border-b border-current/10 py-3"
              >
                <span data-menu-item className="display-md block">
                  {l.label}
                </span>
                <span data-menu-item className="label block text-ash">
                  0{i + 1}
                </span>
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => go(e, '#contact')}
              className="group flex items-baseline justify-between overflow-hidden py-3"
            >
              <span data-menu-item className="display-md block text-signal">
                Start a project
              </span>
              <span data-menu-item className="block">
                <ArrowUpRight size={22} />
              </span>
            </a>
          </nav>

          <div className="mt-12 grid grid-cols-2 gap-6">
            <div data-menu-meta className="label flex flex-col gap-2 text-ash">
              <Clock city="Lisbon" timeZone="Europe/Lisbon" />
              <Clock city="Berlin" timeZone="Europe/Berlin" />
            </div>
            <div data-menu-meta className="label flex flex-col gap-2 text-ash">
              <a href="mailto:hello@oblique.studio" className="text-[var(--c-fg)]">
                hello@oblique.studio
              </a>
              <span>Instagram · Are.na · LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
