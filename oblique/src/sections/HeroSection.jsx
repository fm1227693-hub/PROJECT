import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import { heroIntro, heroScroll } from '../animations/heroAnimations'
import Section from '../components/Section'
import FloatingVisual from '../components/FloatingVisual'
import MagneticButton from '../components/MagneticButton'
import Clock from '../components/Clock'
import { ArrowDown } from '../components/icons'

/* ------------------------------------------------------------------ */
/* Small pieces that only the hero uses                                */
/* ------------------------------------------------------------------ */

function ImageCard({ src, srcSet, alt, ratio, caption, className = '', eager = false }) {
  return (
    <figure className={className}>
      <div
        className="overflow-hidden rounded-[4px] bg-stone shadow-[0_24px_60px_-30px_rgba(15,14,12,0.35)]"
        style={{ aspectRatio: ratio }}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes="(min-width: 1024px) 14vw, 46vw"
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>
      {caption && <figcaption className="label mt-3 text-ash">{caption}</figcaption>}
    </figure>
  )
}

function BuildCard() {
  return (
    <div className="w-full rounded-[10px] border border-ink/10 bg-paper/90 p-4 shadow-[0_30px_70px_-34px_rgba(15,14,12,0.4)] backdrop-blur-[2px]">
      <div className="label flex items-center justify-between text-ash">
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          Live
        </span>
        <span>Build 4.12</span>
      </div>
      <p className="mt-3 text-[13px] font-medium tracking-[-0.01em]">Meridian — Checkout v2</p>
      <div className="mt-3 h-[2px] w-full bg-ink/10">
        <div data-hero-bar className="h-[2px] w-[78%] origin-left bg-ink" />
      </div>
      <div className="label mt-2 flex justify-between gap-3 whitespace-nowrap text-ash">
        <span>78% shipped</span>
        <span>16:40</span>
      </div>
    </div>
  )
}

function Disc({ className = '' }) {
  return <div className={`rounded-full bg-signal ${className}`} aria-hidden="true" />
}

/* ------------------------------------------------------------------ */

export default function HeroSection() {
  const ref = useRef(null)
  const { env } = useSmoothScroll()

  useGSAP(
    () => {
      heroIntro(ref.current, { reduced: env.reduced })
      gsap.fromTo(
        '[data-hero-bar]',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.8, ease: 'expo.inOut', delay: 1.2 },
      )
      const mm = gsap.matchMedia()
      mm.add(
        { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' },
        (ctx) => {
          heroScroll(ref.current, { desktop: ctx.conditions.desktop, reduced: env.reduced })
        },
      )
    },
    { scope: ref, dependencies: [env.reduced] },
  )

  return (
    <Section
      ref={ref}
      id="top"
      theme="light"
      label="Introduction"
      className="hero flex min-h-[100svh] flex-col overflow-hidden pt-[92px] md:pt-[112px]"
      style={{ visibility: 'hidden' }}
    >
      {/* Top metadata */}
      <div data-hero-top className="gutter flex items-start justify-between will-transform">
        <p data-hero-label className="label flex max-w-[15rem] items-center gap-3 text-ash sm:max-w-none">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
          Independent design &amp; engineering studio
        </p>
        <p data-hero-label className="label hidden gap-6 text-ash md:flex">
          <Clock city="Lisbon" timeZone="Europe/Lisbon" />
          <Clock city="Berlin" timeZone="Europe/Berlin" />
        </p>
      </div>

      {/* Headline */}
      <div className="gutter relative z-10 mt-[5vh] md:mt-[4vh]">
        <h1
          data-hero-headline
          className="display-xl will-transform text-[15vw] sm:text-[13.5vw] lg:text-[length:var(--text-display-xl)]"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line className="block">
              Made to be
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em] md:pl-[14vw]">
            <span data-hero-line className="block">
              looked at
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] md:pl-[4vw]">
            <span data-hero-line className="flex items-center gap-[0.16em]">
              <span
                data-hero-pill
                className="inline-block h-[0.66em] w-[1.45em] shrink-0 overflow-hidden rounded-full bg-stone will-transform"
              >
                <img
                  src="/images/hero-02.webp"
                  srcSet="/images/hero-02-sm.webp 640w, /images/hero-02.webp 1200w"
                  sizes="20vw"
                  alt=""
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="block">twice.</span>
            </span>
          </span>
        </h1>
      </div>

      {/* Mobile / tablet collage — a deliberate composition, not shrunk desktop */}
      <div className="relative mx-auto mt-10 h-[250px] w-full max-w-[560px] sm:h-[300px] lg:hidden" aria-hidden="true">
        <FloatingVisual className="left-[6%] top-0 w-[44%]" depth={0} rotate={-3} speed={0.35} spin={-2}>
          <ImageCard
            src="/images/hero-01-sm.webp"
            srcSet="/images/hero-01-sm.webp 640w, /images/hero-01.webp 928w"
            alt=""
            ratio="4 / 5"
            eager
          />
        </FloatingVisual>
        <FloatingVisual className="right-[6%] top-[12%] w-[36%]" depth={0} rotate={4} speed={0.6} spin={3}>
          <ImageCard
            src="/images/hero-03-sm.webp"
            srcSet="/images/hero-03-sm.webp 640w, /images/hero-03.webp 1024w"
            alt=""
            ratio="1 / 1"
            eager
          />
        </FloatingVisual>
        <FloatingVisual className="bottom-0 left-[28%] w-[62%] max-w-[260px]" depth={0} rotate={1.5} speed={0.8}>
          <BuildCard />
        </FloatingVisual>
        <FloatingVisual className="right-[10%] bottom-[10%]" depth={0} speed={1}>
          <Disc className="h-8 w-8" />
        </FloatingVisual>
      </div>

      {/* Bottom row */}
      <div data-hero-bottom-row className="gutter grid-12 mt-auto items-end pb-8 pt-10 will-transform md:pb-9">
        <p
          data-hero-bottom
          className="col-span-12 max-w-[22rem] text-[15px] leading-[1.5] text-ash md:col-span-6 md:text-base lg:col-span-4"
        >
          We're an independent studio in Lisbon and Berlin. We design and build products,
          identities and interfaces that reward a closer look.
        </p>

        <div
          data-hero-bottom
          className="label col-span-3 col-start-7 hidden items-center gap-3 text-ash lg:flex"
        >
          <span className="relative block h-10 w-px overflow-hidden bg-ink/10">
            <span className="hero-scroll-dash absolute left-0 top-0 h-3 w-px bg-ink" />
          </span>
          Scroll
        </div>

        <div
          data-hero-bottom
          className="col-span-12 mt-8 flex flex-wrap gap-3 md:col-span-6 md:col-start-7 md:mt-0 md:justify-end lg:col-span-4 lg:col-start-9"
        >
          <MagneticButton href="#work" variant="outline" className="grow md:grow-0">
            Selected work
            <ArrowDown size={14} className="transition-transform duration-500 group-hover:translate-y-0.5" />
          </MagneticButton>
          <MagneticButton href="#contact" className="grow md:grow-0">
            Start a project
          </MagneticButton>
        </div>
      </div>

      {/* Desktop floating composition */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <FloatingVisual
          className="right-[7%] top-[21%] w-[12.5vw] max-w-[210px]"
          depth={0.6}
          rotate={-4}
          speed={0.9}
          drift={48}
          spin={-5}
        >
          <ImageCard
            src="/images/hero-01.webp"
            srcSet="/images/hero-01-sm.webp 640w, /images/hero-01.webp 928w"
            alt=""
            ratio="4 / 5"
            caption="01 — Objects"
            eager
          />
        </FloatingVisual>

        <FloatingVisual
          className="left-[64%] top-[56%] w-[8.6vw] max-w-[150px]"
          depth={1.15}
          rotate={5}
          speed={1.35}
          drift={-34}
          spin={7}
        >
          <ImageCard
            src="/images/hero-03.webp"
            srcSet="/images/hero-03-sm.webp 640w, /images/hero-03.webp 1024w"
            alt=""
            ratio="1 / 1"
            caption="02 — Print"
            eager
          />
        </FloatingVisual>

        <FloatingVisual
          className="right-[11%] top-[63%] w-[15vw] max-w-[236px]"
          depth={0.85}
          rotate={2}
          speed={1.1}
          drift={70}
          spin={2}
        >
          <BuildCard />
        </FloatingVisual>

        <FloatingVisual className="left-[69%] top-[26.5%]" depth={1.5} speed={1.7} drift={-30}>
          <Disc className="h-[3.2vw] w-[3.2vw] max-h-[52px] max-w-[52px]" />
        </FloatingVisual>
      </div>
    </Section>
  )
}
