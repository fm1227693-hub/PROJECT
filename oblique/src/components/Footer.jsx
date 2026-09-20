import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import { studio } from '../data/content'
import Logo from './Logo'
import Clock from './Clock'
import { ArrowUpRight } from './icons'

const INDEX = [
  { label: 'Work', href: '#work' },
  { label: 'Practice', href: '#practice' },
  { label: 'Process', href: '#process' },
  { label: 'Studio', href: '#studio' },
  { label: 'Journal', href: '#journal' },
]

export default function Footer() {
  const ref = useRef(null)
  const wordmarkRef = useRef(null)
  const { env, scrollTo } = useSmoothScroll()

  useGSAP(
    () => {
      if (env.reduced) return
      gsap.fromTo(
        wordmarkRef.current,
        { yPercent: 30 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      )
    },
    { scope: ref, dependencies: [env.reduced] },
  )

  const go = (e, href) => {
    e.preventDefault()
    scrollTo(href, 0)
  }

  return (
    <footer
      ref={ref}
      id="colophon"
      data-theme="dark"
      data-theme-start="top 80%"
      className="relative overflow-hidden bg-ink pb-6 pt-[14vh] text-paper"
    >
      <div className="gutter grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-[22rem] text-[15px] leading-[1.55] text-mist">
            An independent design and engineering studio, working from Lisbon and Berlin with
            clients everywhere else.
          </p>
        </div>

        <nav aria-label="Footer" className="col-span-6 lg:col-span-2 lg:col-start-6">
          <p className="label mb-5 text-ash">Index</p>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            {INDEX.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={(e) => go(e, l.href)} className="link-underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 lg:col-span-2">
          <p className="label mb-5 text-ash">Elsewhere</p>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            {studio.social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline inline-flex items-center gap-1.5"
                >
                  {s.label}
                  <ArrowUpRight size={12} className="opacity-50" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 lg:col-span-3 lg:col-start-10">
          <p className="label mb-5 text-ash">Contact</p>
          <a
            href={`mailto:${studio.email}`}
            className="link-underline text-[17px] font-medium tracking-[-0.01em]"
          >
            {studio.email}
          </a>
          <div className="label mt-6 flex flex-col gap-2 text-ash">
            {studio.cities.map((c) => (
              <span key={c.city} className="flex justify-between gap-6 sm:justify-start">
                <Clock city={c.city} timeZone={c.timeZone} />
                <span className="hidden normal-case tracking-normal text-mist sm:inline">{c.address}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Editorial sign-off: the wordmark at page scale */}
      <div className="gutter mt-[10vh] overflow-hidden lg:mt-[14vh]" aria-hidden="true">
        <p
          ref={wordmarkRef}
          className="select-none text-[22vw] font-medium leading-[0.9] tracking-[-0.05em] will-transform"
        >
          Oblique<span className="text-signal">.</span>
        </p>
      </div>

      <div className="gutter label mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-paper/15 pt-5 text-ash">
        <span>© 2026 Oblique Studio</span>
        <span className="hidden md:inline">38.71° N, 9.14° W</span>
        <span className="hidden sm:inline">Made with patience</span>
        <a href="#top" onClick={(e) => go(e, '#top')} className="link-underline text-paper">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
