import { useRef } from 'react'
import ScrollSection from '../components/ScrollSection'
import FloatingVisual from '../components/FloatingVisual'
import MagneticButton from '../components/MagneticButton'
import Label from '../components/Label'
import ObjectCanvas from '../components/three/ObjectCanvas'
import { ArrowDown } from '../components/icons'
import { useGsap } from '../hooks/useGsap'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useMouseParallax } from '../hooks/useMouseParallax'
import { useScroll } from '../context/scroll'
import { heroEntrance, heroScroll } from '../animations/heroAnimations'
import { hero, brand } from '../data/content'

function TokenCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border hairline bg-white/80 p-4 shadow-[0_30px_60px_-40px_rgba(15,15,16,0.35)] ${className}`}>
      <div className="flex items-center justify-between">
        <Label>Motion token</Label>
        <Label>02</Label>
      </div>
      <div className="mt-3 text-[0.95rem] font-medium tracking-[-0.01em]">{hero.token.title}</div>
      <div className="mt-0.5 text-[0.72rem] tabular-nums text-muted">{hero.token.value}</div>
      <svg viewBox="0 0 160 64" className="mt-3 w-full overflow-visible" aria-hidden="true">
        <line x1="0" y1="64" x2="160" y2="64" stroke="var(--line)" />
        <line x1="0" y1="0" x2="160" y2="0" stroke="var(--line)" strokeDasharray="2 3" />
        <path d="M0 64 C 25.6 0, 48 0, 160 0" fill="none" stroke="var(--fg)" strokeWidth="1.25" />
        <circle cx="160" cy="0" r="3" fill="var(--color-cobalt)" />
      </svg>
      <div className="mt-2 text-[0.72rem] leading-snug text-muted">{hero.token.note}</div>
    </div>
  )
}

function StatusPill({ className = '' }) {
  return (
    <div className={`pill pill-ghost h-9 gap-2.5 bg-bg/70 px-3.5 text-[0.8rem] ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
      {brand.availability}
    </div>
  )
}

function RotatingBadge({ className = '' }) {
  return (
    <svg viewBox="0 0 120 120" className={`h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <path id="badge-circle" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="var(--line)" />
      <text fill="var(--fg)" fontSize="9.5" fontWeight="500" letterSpacing="1.8" style={{ textTransform: 'uppercase' }}>
        <textPath href="#badge-circle">Design · Engineering · Motion ·</textPath>
      </text>
      <circle cx="60" cy="60" r="3" fill="var(--color-cobalt)" />
    </svg>
  )
}

export default function HeroSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const orbRef = useRef(null)
  const { caps } = useScroll()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const pinned = caps.pin && isDesktop

  useGsap(() => {
    heroEntrance(sectionRef.current, { reduced: caps.reduced })
    if (caps.reduced) return
    heroScroll(sectionRef.current, stageRef.current, {
      pin: pinned,
      parallax: caps.parallax,
      onProgress: (p) => {
        orbRef.current?.setProgress(p)
        // The object is invisible for the tail of the pin — stop drawing it.
        orbRef.current?.setActive(p < 0.94)
      },
      onTheme: (t) => {
        if (document.documentElement.dataset.theme !== t) document.documentElement.dataset.theme = t
      },
    })
  }, sectionRef, [pinned, caps.reduced, caps.parallax])

  useMouseParallax(sectionRef, { enabled: caps.cursor && isDesktop, range: 70 })

  const lineClass = 'block pb-[0.12em] -mb-[0.12em] overflow-hidden'

  return (
    <ScrollSection
      ref={sectionRef}
      stageRef={stageRef}
      id="top"
      theme="paper"
      aria-labelledby="hero-title"
      stageClassName={pinned ? '' : '!h-auto min-h-svh'}
    >
      {/* depth ring — the background gains distance as it expands on scroll */}
      <div
        data-hero-depth
        aria-hidden="true"
        className="pointer-events-none absolute top-[10vh] right-[-22vh] hidden h-[78vh] w-[78vh] rounded-full border hairline will-change-transform lg:block"
      />

      <div className="container-x relative flex min-h-svh flex-col justify-between pt-[calc(var(--nav-h)+1.25rem)] pb-7 lg:h-svh lg:pb-8">
        {/* top row */}
        <div data-hero-top className="flex items-start justify-between gap-6">
          <Label data-hero-fade as="p" className="max-w-[24ch] leading-[1.5] md:max-w-none">
            {hero.eyebrow}
          </Label>
          <ul data-hero-fade className="hidden gap-8 md:flex">
            {hero.meta.map((m) => (
              <li key={m} className="whitespace-nowrap">
                <Label>{m}</Label>
              </li>
            ))}
          </ul>
        </div>

        {/* headline */}
        <div data-hero-headline className="relative z-10 mt-10 will-change-transform lg:mt-0">
          <h1 id="hero-title" className="display text-[clamp(3.2rem,18.5vw,6.4rem)] lg:text-[clamp(5.2rem,min(13.4vw,21vh),15.5rem)]">
            <span className={lineClass}>
              <span data-hero-line className="block">
                {hero.lines[0]}
              </span>
            </span>
            <span className={`${lineClass} ml-[8vw] lg:ml-[14vw]`}>
              <span data-hero-line className="block">
                {hero.lines[1]}
              </span>
            </span>
            <span className={`${lineClass} lg:ml-[5vw]`}>
              <span data-hero-line className="serif-italic block pr-[0.1em] text-[1.04em]">
                {hero.lines[2]}
              </span>
            </span>
          </h1>
        </div>

        {/* mobile composition: floating objects become an in-flow collage */}
        {!isDesktop && (
          <div className="relative mt-10 mb-10" aria-hidden="true">
            <FloatingVisual name="image" depth={0} absolute={false} className="ml-auto w-[54%] max-w-[280px] rotate-[2deg] md:max-w-[380px]">
              <img src={hero.image.src} alt="" width={hero.image.w} height={hero.image.h} className="aspect-[4/5] w-full rounded-xl object-cover" fetchPriority="high" />
            </FloatingVisual>
            <FloatingVisual name="orb" depth={0} className="right-[44%] top-[-2rem] w-[7.5rem] xs:w-[8.5rem] md:w-[11rem]">
              <ObjectCanvas ref={orbRef} className="aspect-square w-full" />
            </FloatingVisual>
            <FloatingVisual name="token" depth={0} className="bottom-[-1.5rem] left-0 w-[62%] max-w-[240px] rotate-[-2deg] md:max-w-[280px]">
              <TokenCard />
            </FloatingVisual>
          </div>
        )}

        {/* bottom row */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div data-hero-support className="will-change-transform">
            <p data-hero-fade className="max-w-[30ch] text-[0.95rem] leading-[1.55] text-muted lg:text-[1.05rem]">
              {hero.support}
            </p>
          </div>
          <div data-hero-cta className="will-change-transform">
            <div data-hero-fade className="flex items-center gap-5 lg:gap-8">
              {!isDesktop && <StatusPill />}
              <MagneticButton href="#work" variant="ghost" icon={<ArrowDown />}>
                {hero.cta.label}
              </MagneticButton>
              <div className="hidden items-center gap-3 lg:flex" aria-hidden="true">
                <Label>Scroll</Label>
                <span className="block h-12 w-px overflow-hidden bg-line">
                  <span className="scroll-cue-line block h-full w-full bg-fg" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* desktop floating layer */}
      {isDesktop && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <FloatingVisual name="image" depth={0.045} className="top-[15vh] right-[5vw] w-[clamp(150px,14vw,240px)]" innerClassName="rotate-[-3deg]">
            <img
              src={hero.image.src}
              alt=""
              width={hero.image.w}
              height={hero.image.h}
              className="aspect-[4/5] w-full rounded-xl object-cover shadow-[0_40px_80px_-40px_rgba(15,15,16,0.4)]"
              fetchPriority="high"
            />
          </FloatingVisual>

          <FloatingVisual name="status" depth={0.025} className="top-[27vh] left-[54vw]">
            <StatusPill />
          </FloatingVisual>

          <FloatingVisual name="orb" depth={0.06} className="top-[48vh] right-[3vw] w-[clamp(170px,15vw,260px)]">
            <ObjectCanvas ref={orbRef} className="aspect-square w-full" />
          </FloatingVisual>

          <FloatingVisual name="token" depth={0.035} className="right-[18vw] bottom-[11vh] w-[15rem]" innerClassName="rotate-[2deg]">
            <TokenCard />
          </FloatingVisual>

          <FloatingVisual name="badge" depth={0.02} className="bottom-[6vh] left-[34vw] h-[6.5rem] w-[6.5rem]">
            <RotatingBadge />
          </FloatingVisual>
        </div>
      )}
    </ScrollSection>
  )
}
