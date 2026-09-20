import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { horizontalScroll } from '../animations/scrollAnimations'
import { projects } from '../data/content'
import Section, { SectionLabel } from '../components/Section'
import ImageReveal from '../components/ImageReveal'
import EditorialText from '../components/EditorialText'
import { ArrowRight } from '../components/icons'

const ratioToNumber = (ratio) => {
  const [w, h] = ratio.split('/').map((n) => parseFloat(n))
  return w / h
}

/* ------------------------------------------------------------------ */
/* Desktop: pinned horizontal gallery                                  */
/* ------------------------------------------------------------------ */
function DesktopShowcase() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const counterRef = useRef(null)
  const progressRef = useRef(null)
  const { env, getSmoother } = useSmoothScroll()

  useGSAP(
    () => {
      if (env.reduced) return
      const total = projects.length
      let current = -1

      const tween = horizontalScroll(sectionRef.current, trackRef.current, {
        scrub: 0.9,
        onUpdate: (self) => {
          const idx = Math.min(total - 1, Math.floor(self.progress * total))
          if (idx !== current) {
            current = idx
            if (counterRef.current) {
              counterRef.current.textContent = String(idx + 1).padStart(2, '0')
            }
          }
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${self.progress})`
          }
        },
      })

      // Keyboard users: focusing a panel that is translated off-screen
      // scrolls the page to the point where that panel is in view.
      const st = tween.scrollTrigger
      const onFocus = (e) => {
        const panel = e.target.closest('[data-panel], [data-panel-end]')
        if (!panel) return
        const distance = Math.max(1, trackRef.current.scrollWidth - window.innerWidth)
        const x = panel.offsetLeft - window.innerWidth * 0.12
        const progress = gsap.utils.clamp(0, 1, x / distance)
        const target = st.start + progress * (st.end - st.start)
        const smoother = getSmoother()
        if (smoother) smoother.scrollTo(target, true)
        else window.scrollTo({ top: target, behavior: 'smooth' })
      }
      trackRef.current.addEventListener('focusin', onFocus)
      const track = trackRef.current

      // Inner image drift while the track travels (containerAnimation).
      gsap.utils.toArray('[data-panel]').forEach((panel) => {
        const img = panel.querySelector('[data-panel-img]')
        gsap.fromTo(
          img,
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })

      return () => track.removeEventListener('focusin', onFocus)
    },
    { scope: sectionRef, dependencies: [env.reduced] },
  )

  return (
    <div ref={sectionRef} className="relative h-[100vh] overflow-hidden">
      {/* Header stays while the track moves */}
      <div className="gutter absolute inset-x-0 top-0 z-10 flex items-baseline justify-between pt-[100px]">
        <SectionLabel index="02" title="Selected work" />
        <p className="label text-ash">Five projects, 2024 — 2026</p>
        <p className="label flex items-center gap-4">
          <span ref={counterRef} className="tabular-nums">
            01
          </span>
          <span className="relative block h-px w-24 bg-current/15">
            <span
              ref={progressRef}
              className="absolute inset-0 origin-left bg-current"
              style={{ transform: 'scaleX(0)' }}
            />
          </span>
          <span className="tabular-nums text-ash">0{projects.length}</span>
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex h-full items-center gap-[6vw] pl-[var(--spacing-gutter)] pr-[10vw] pt-[6vh] will-transform"
      >
        {projects.map((p) => {
          const width = p.height * ratioToNumber(p.ratio)
          return (
            <a
              key={p.id}
              href={`#${p.id}`}
              data-panel
              data-cursor="view"
              className="group relative block shrink-0"
              style={{ width: `${width}vh`, marginTop: `${p.offset}vh` }}
              aria-label={`${p.title} — ${p.summary}`}
            >
              <span className="label absolute -top-8 left-0 text-ash">{p.index}</span>
              <div
                className="relative overflow-hidden rounded-[4px] bg-stone"
                style={{ height: `${p.height}vh` }}
              >
                <img
                  data-panel-img
                  src={p.image}
                  srcSet={`${p.imageSm} 640w, ${p.image} 1200w`}
                  sizes="40vw"
                  alt={p.alt}
                  loading="eager"
                  decoding="async"
                  className="absolute left-[-6%] top-0 h-full w-[112%] max-w-none object-cover transition-transform duration-[1.2s] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <h3 className="display-sm">{p.title}</h3>
                <p className="label text-ash">
                  {p.category} · {p.year}
                </p>
              </div>
              <p className="mt-1.5 max-w-[28rem] text-[15px] text-ash">{p.summary}</p>
            </a>
          )
        })}

        <a
          href="#contact"
          data-panel-end
          className="group ml-[2vw] flex h-[15vw] w-[15vw] max-h-[240px] max-w-[240px] shrink-0 items-center justify-center rounded-full border border-current/20 text-center transition-[background-color,color,border-color] duration-700 [transition-timing-function:var(--ease-out-expo)] hover:border-transparent hover:bg-[var(--c-fg)] hover:text-[var(--c-bg)]"
          data-cursor="open"
        >
          <span className="flex flex-col items-center gap-3 text-[15px] font-medium">
            All work
            <ArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </a>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile / tablet: vertical, offset rhythm                            */
/* ------------------------------------------------------------------ */
const MOBILE_WIDTHS = ['w-full', 'ml-auto w-[82%]', 'w-[88%]', 'w-full', 'ml-auto w-[86%]']

function MobileShowcase() {
  return (
    <div className="gutter pb-[6vh] pt-[16vh]">
      <SectionLabel index="02" title="Selected work" meta="Five projects, 2024 — 2026" />
      <EditorialText as="h2" className="display-lg mt-8 max-w-[14ch]">
        Work that holds up on the second visit.
      </EditorialText>

      <ol className="mt-[10vh] flex flex-col gap-[10vh]">
        {projects.map((p, i) => (
          <li key={p.id} className={MOBILE_WIDTHS[i % MOBILE_WIDTHS.length]}>
            <a href={`#${p.id}`} className="group block" aria-label={`${p.title} — ${p.summary}`}>
              <ImageReveal
                src={p.imageSm}
                srcSet={`${p.imageSm} 640w, ${p.image} 1200w`}
                sizes="90vw"
                ratio={p.ratio}
                alt={p.alt}
                parallax={44}
              />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="display-sm">
                  <span className="label mr-3 align-middle text-ash">{p.index}</span>
                  {p.title}
                </h3>
                <p className="label text-ash">{p.year}</p>
              </div>
              <p className="mt-1.5 text-[15px] text-ash">{p.summary}</p>
              <p className="label mt-2 text-ash">{p.category}</p>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function ShowcaseSection() {
  const isDesktop = useIsDesktop()
  const { env } = useSmoothScroll()
  // The pinned gallery needs scroll-driven motion; reduced-motion users
  // get the vertical composition instead of an unreachable track.
  const horizontal = isDesktop && !env.reduced
  return (
    <Section id="work" theme="light" label="Selected work">
      {horizontal ? <DesktopShowcase /> : <MobileShowcase />}
    </Section>
  )
}
