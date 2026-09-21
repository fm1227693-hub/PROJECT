import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useScroll } from '../context/scroll'
import { brand, nav, socials } from '../data/content'
import Logo from './Logo'
import MagneticButton from './MagneticButton'
import { ArrowUpRight } from './icons'

// The open menu is always ink, whatever section theme is active underneath.
const MENU_VARS = { '--bg': '#0f0f10', '--fg': '#f4f3ef', '--muted': 'rgba(244,243,239,0.5)', '--line': 'rgba(244,243,239,0.16)' }

/**
 * Minimal navbar. Transparent at the top of the page; after a short scroll the inner
 * shell picks up a translucent background, a hairline and a slightly tighter height.
 * Colours follow the section theme through CSS variables, so it adapts to dark
 * sections without any JS. Below lg it collapses to Logo + Menu.
 */
export default function Navbar() {
  const { scrollTo, smoother, caps } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const firstLinkRef = useRef(null)
  const toggleRef = useRef(null)

  // Scrolled state via ScrollTrigger so it stays in sync with the smoother.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 48,
      end: 'max',
      onToggle: (self) => setScrolled(self.isActive),
    })
    return () => st.kill()
  }, [])

  const go = useCallback(
    (e, href) => {
      if (!href.startsWith('#')) return
      e.preventDefault()
      setOpen(false)
      // wait a frame so the menu can release scroll lock before we scroll
      requestAnimationFrame(() => scrollTo(href, 0))
      history.replaceState(null, '', href)
    },
    [scrollTo],
  )

  // Mobile menu: scroll lock, escape to close, focus management, staggered reveal.
  useEffect(() => {
    const html = document.documentElement
    if (open) {
      html.style.overflow = 'hidden'
      smoother?.paused(true)
      const onKey = (e) => e.key === 'Escape' && setOpen(false)
      window.addEventListener('keydown', onKey)
      const toggle = toggleRef.current
      const links = menuRef.current?.querySelectorAll('[data-menu-item]') ?? []
      const tl = gsap.timeline()
      if (!caps.reduced) {
        tl.fromTo(menuRef.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.out' })
        tl.from(links, { yPercent: 110, duration: 1, stagger: 0.06, ease: 'expo.out' }, 0.15)
      }
      firstLinkRef.current?.focus({ preventScroll: true })
      return () => {
        window.removeEventListener('keydown', onKey)
        tl.kill()
        html.style.overflow = ''
        smoother?.paused(false)
        toggle?.focus({ preventScroll: true })
      }
    }
  }, [open, smoother, caps.reduced])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[1100] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-[900] text-fg" data-scrolled={scrolled} style={open ? MENU_VARS : undefined}>
        <div
          className={`nav-shell mx-auto flex items-center justify-between border border-transparent px-[var(--margin)] ${
            scrolled ? 'mt-3 w-[calc(100%-1.5rem)] rounded-full py-2.5 lg:w-[calc(100%-3rem)] lg:px-6' : 'py-5 lg:py-6'
          }`}
          data-scrolled={scrolled}
        >
          <a href="#top" onClick={(e) => go(e, '#top')} aria-label={`${brand.name} — back to top`} className="relative z-10">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={(e) => go(e, item.href)} className="link-line text-[0.9rem] font-medium tracking-[-0.01em]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <MagneticButton href="#contact" onClick={(e) => go(e, '#contact')} className="hidden !h-10 !px-4 !text-[0.875rem] lg:inline-flex" icon={<ArrowUpRight size={14} />}>
              Start a project
            </MagneticButton>
            <button
              ref={toggleRef}
              type="button"
              className="flip-parent relative z-10 text-[0.9rem] font-medium lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="flip-text">
                <span>{open ? 'Close' : 'Menu'}</span>
                <span aria-hidden="true">{open ? 'Close' : 'Menu'}</span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[850] flex flex-col bg-ink px-[var(--margin)] pt-28 pb-10 text-paper"
          style={MENU_VARS}
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-2">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <a
                    ref={i === 0 ? firstLinkRef : undefined}
                    data-menu-item
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    className="menu-link flex items-baseline gap-4 py-1"
                  >
                    <span className="label w-8 text-muted">0{i + 1}</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto grid grid-cols-2 gap-6 border-t hairline pt-6">
            <div className="overflow-hidden">
              <div data-menu-item>
                <span className="label block text-muted">Contact</span>
                <a href={`mailto:${brand.email}`} className="mt-2 block text-[0.95rem]">
                  {brand.email}
                </a>
              </div>
            </div>
            <div className="overflow-hidden">
              <div data-menu-item>
                <span className="label block text-muted">Social</span>
                <ul className="mt-2 flex flex-col gap-1 text-[0.95rem]">
                  {socials.slice(0, 3).map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
