import { useCallback, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useIsDesktop, useMediaQuery } from '../hooks/useMediaQuery'
import { process } from '../data/content'
import ScrollSection from '../components/ScrollSection'
import Section, { SectionLabel } from '../components/Section'
import ImageReveal from '../components/ImageReveal'
import EditorialText from '../components/EditorialText'

const IMAGE = {
  src: '/images/studio.webp',
  srcSet: '/images/studio-sm.webp 640w, /images/studio.webp 1376w',
  alt: 'The Lisbon studio: a long oak table under tall arched windows in soft morning light',
}

function Steps({ className = '', itemAttr = {} }) {
  return (
    <ol className={`flex flex-col ${className}`}>
      {process.map((step) => (
        <li key={step.index} {...itemAttr} className="border-t border-current/20 py-5 first:border-t-0 lg:py-6">
          <div className="flex items-baseline gap-4">
            <span className="label text-mist">{step.index}</span>
            <h3 className="display-sm">{step.title}</h3>
          </div>
          <p className="mt-3 max-w-[30rem] text-[15px] leading-[1.55] text-mist lg:pl-9">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop: pinned, the image window expands to full bleed             */
/* ------------------------------------------------------------------ */
function DesktopVisual() {
  const frameRef = useRef(null)
  const imgRef = useRef(null)
  const shadeRef = useRef(null)
  const titleRef = useRef(null)
  const stepsRef = useRef(null)
  const metaRef = useRef(null)

  const build = useCallback((tl) => {
    const START = 0.3
    gsap.set(frameRef.current, { scale: START, transformOrigin: '50% 50%' })
    gsap.set(imgRef.current, { scale: 0.62 / START, transformOrigin: '50% 50%' })

    const lines = titleRef.current.querySelectorAll('[data-line]')
    const titleLabel = titleRef.current.querySelector('[data-title-label]')
    const items = stepsRef.current.querySelectorAll('[data-step]')

    tl.to(frameRef.current, { scale: 1, duration: 0.5, ease: 'power1.inOut' }, 0)
      .to(imgRef.current, { scale: 1, duration: 0.5, ease: 'power1.inOut' }, 0)
      .to(metaRef.current, { autoAlpha: 0, y: -20, duration: 0.15 }, 0.12)
      .to(shadeRef.current, { opacity: 0.5, duration: 0.2 }, 0.38)
      .fromTo(titleLabel, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.4)
      .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 0.2, stagger: 0.05, ease: 'power2.out' }, 0.42)
      .fromTo(items, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.08, ease: 'power2.out' }, 0.55)
      .to(imgRef.current, { scale: 1.06, duration: 0.5, ease: 'none' }, 0.5)
      .to({}, { duration: 0.1 })
  }, [])

  return (
    <ScrollSection id="process" theme="dark" label="Process" length={2.6} build={build} scrub={0.6}>
      {(stageRef, active) => (
        <div ref={stageRef} className="relative h-[100vh] w-full overflow-hidden">
          <div
            ref={frameRef}
            className="absolute inset-0 overflow-hidden rounded-[28px] bg-soot will-transform"
          >
            <img
              ref={imgRef}
              src={IMAGE.src}
              srcSet={IMAGE.srcSet}
              sizes="100vw"
              alt={IMAGE.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover will-transform"
            />
            <div ref={shadeRef} className={`absolute inset-0 bg-ink ${active ? 'opacity-0' : 'opacity-50'}`} />
          </div>

          <div
            ref={metaRef}
            className={`gutter absolute inset-x-0 top-0 flex items-baseline justify-between pt-[100px] ${active ? '' : 'invisible'}`}
          >
            <SectionLabel index="04" title="Process" />
            <p className="label text-ash">Lisbon studio · 09:12</p>
          </div>

          <div ref={titleRef} className="absolute bottom-[10vh] left-[var(--spacing-gutter)] w-[min(46vw,720px)] text-paper">
            <p data-title-label className="label mb-6 text-mist">04 — Process</p>
            <h2 className="display-lg">
              <span className="block overflow-hidden pb-[0.05em]">
                <span data-line className="block">We work</span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-line className="block">in the open.</span>
              </span>
            </h2>
          </div>

          <div ref={stepsRef} className="absolute bottom-[10vh] right-[var(--spacing-gutter)] w-[min(32vw,420px)] text-paper">
            <Steps itemAttr={{ 'data-step': true }} />
          </div>
        </div>
      )}
    </ScrollSection>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile / tablet: stacked, image with gentle parallax                */
/* ------------------------------------------------------------------ */
function MobileVisual() {
  const wide = useMediaQuery('(min-width: 640px)')
  return (
    <Section id="process" theme="dark" label="Process" className="pb-[14vh] pt-[14vh]">
      <div className="gutter">
        <SectionLabel index="04" title="Process" meta="Lisbon studio · 09:12" />
        <EditorialText as="h2" className="display-lg mt-8">
          We work in the open.
        </EditorialText>
      </div>
      <div className="mt-12 pl-[var(--spacing-gutter)]">
        <ImageReveal
          src={IMAGE.src}
          srcSet={IMAGE.srcSet}
          sizes="100vw"
          ratio={wide ? '3 / 2' : '4 / 5'}
          alt={IMAGE.alt}
          parallax={60}
          radius="rounded-l-[6px]"
        />
      </div>
      <div className="gutter mt-12 text-paper">
        <Steps />
      </div>
    </Section>
  )
}

export default function VisualSection() {
  const isDesktop = useIsDesktop()
  return isDesktop ? <DesktopVisual /> : <MobileVisual />
}
