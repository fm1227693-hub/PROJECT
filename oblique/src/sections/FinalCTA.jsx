import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import { magnetic } from '../animations/hoverAnimations'
import { studio } from '../data/content'
import Section, { SectionLabel } from '../components/Section'
import { ArrowUpRight } from '../components/icons'

function RotatingBadge({ badgeRef }) {
  return (
    <svg
      ref={badgeRef}
      viewBox="0 0 120 120"
      className="h-[104px] w-[104px] will-transform lg:h-[128px] lg:w-[128px]"
      aria-hidden="true"
    >
      <defs>
        <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
      </defs>
      <text className="fill-current font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
        <textPath href="#badge-circle" startOffset="0">
          Open for new work · Q1 2027 ·
        </textPath>
      </text>
      <circle cx="60" cy="60" r="4" className="fill-current" />
    </svg>
  )
}

export default function FinalCTA() {
  const ref = useRef(null)
  const badgeRef = useRef(null)
  const buttonRef = useRef(null)
  const buttonInnerRef = useRef(null)
  const { env } = useSmoothScroll()

  useEffect(() => {
    if (!env.pointerFX) return undefined
    return magnetic(buttonRef.current, buttonInnerRef.current, { strength: 0.42, innerStrength: 0.16 })
  }, [env.pointerFX])

  useGSAP(
    () => {
      if (env.reduced) return
      const q = gsap.utils.selector(ref)

      gsap.from(q('[data-cta-line]'), {
        yPercent: 110,
        duration: 1.5,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 60%', once: true },
      })
      gsap.from(q('[data-cta-button]'), {
        scale: 0.6,
        autoAlpha: 0,
        duration: 1.4,
        ease: 'expo.out',
        clearProps: 'scale',
        scrollTrigger: { trigger: ref.current, start: 'top 45%', once: true },
      })
      gsap.from(q('[data-cta-meta]'), {
        autoAlpha: 0,
        y: 16,
        duration: 1,
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 35%', once: true },
      })
      gsap.to(badgeRef.current, {
        rotation: 240,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: ref, dependencies: [env.reduced] },
  )

  return (
    <Section
      ref={ref}
      id="contact"
      theme="signal"
      label="Start a project"
      data-theme-start="top 25%"
      className="flex min-h-[100svh] flex-col justify-between overflow-hidden bg-signal pb-8 pt-[110px] text-ink md:pb-10 lg:pt-[128px]"
    >
      <div className="gutter flex items-start justify-between">
        <SectionLabel index="06" title="Start" muted="text-ink/70" strong="text-ink" />
        <div className="hidden text-ink sm:block">
          <RotatingBadge badgeRef={badgeRef} />
        </div>
      </div>

      <div className="gutter relative py-[8vh]">
        <h2 className="display-xl text-[15vw] sm:text-[13.5vw] lg:text-[10.6vw] xl:text-[10vw] 2xl:text-[9.4vw]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-cta-line className="block">
              Let's make
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em] md:pl-[9vw]">
            <span data-cta-line className="block">
              something
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em] md:pl-[3vw]">
            <span data-cta-line className="block">
              worth a
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <span data-cta-line className="block">
              second look.
            </span>
          </span>
        </h2>

        {/* The one action */}
        <div
          data-cta-button
          className="mt-10 will-transform lg:absolute lg:right-[8vw] lg:top-1/2 lg:mt-0 lg:-translate-y-1/2"
        >
          <a
            ref={buttonRef}
            href={`mailto:${studio.email}`}
            className="group flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-[15px] font-medium text-paper transition-[background-color,color,scale] duration-700 [transition-timing-function:var(--ease-out-expo)] hover:bg-paper hover:text-ink md:h-[13vw] md:w-[13vw] md:max-h-[220px] md:max-w-[220px] md:min-h-[176px] md:min-w-[176px] md:flex-col md:gap-2 md:px-0 md:hover:scale-105 will-transform"
          >
            <span ref={buttonInnerRef} className="flex items-center gap-2 will-transform md:flex-col md:gap-1">
              <span>Start a project</span>
              <ArrowUpRight
                size={18}
                className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </a>
        </div>
      </div>

      <div className="gutter flex flex-col gap-3 border-t border-ink/15 pt-6 sm:flex-row sm:items-baseline sm:justify-between">
        <a
          data-cta-meta
          href={`mailto:${studio.email}`}
          className="link-underline text-[17px] font-medium tracking-[-0.01em] md:text-[19px]"
        >
          {studio.email}
        </a>
        <p data-cta-meta className="label text-ink/70">
          Replies within two working days
        </p>
        <p data-cta-meta className="label hidden text-ink/70 md:block">
          Lisbon · Berlin · Everywhere in between
        </p>
      </div>
    </Section>
  )
}
