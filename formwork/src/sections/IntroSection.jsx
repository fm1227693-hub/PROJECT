import { useRef } from 'react'
import Section from '../components/Section'
import Label from '../components/Label'
import EditorialText from '../components/EditorialText'
import ImageReveal from '../components/ImageReveal'
import { ArrowRight } from '../components/icons'
import { useGsap } from '../hooks/useGsap'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useScroll } from '../context/scroll'
import { applyParallax, rise } from '../animations/scrollAnimations'
import { intro } from '../data/content'

function NoteCard({ className = '' }) {
  return (
    <div className={`rounded-2xl bg-ink p-5 text-paper shadow-[0_40px_80px_-40px_rgba(15,15,16,0.5)] ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="!text-paper/50">{intro.note.index}</Label>
        <Label className="!text-paper/50">Studio wall</Label>
      </div>
      <p className="serif-italic mt-7 text-[1.35rem] leading-[1.15]">{intro.note.text}</p>
    </div>
  )
}

function BudgetPanel({ className = '' }) {
  return (
    <div className={`rounded-2xl border hairline bg-white/70 p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label>{intro.budget.label}</Label>
        <Label>{intro.budget.total}</Label>
      </div>
      <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-cobalt" style={{ width: `${intro.budget.pct}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[0.72rem] tabular-nums text-muted">
        <span>Used {intro.budget.used}</span>
        <span>60 fps</span>
      </div>
    </div>
  )
}

export default function IntroSection() {
  const ref = useRef(null)
  const { caps, scrollTo } = useScroll()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  // When the hero is pinned, this section slides up over its fading stage instead of waiting for it.
  const overlapHero = caps.pin && isDesktop

  useGsap(() => {
    applyParallax(ref.current, caps.parallax)
    rise(ref.current.querySelectorAll('[data-rise]'), { reduced: caps.reduced, stagger: 0.12 })
  }, ref, [caps.parallax, caps.reduced])

  const go = (e) => {
    e.preventDefault()
    scrollTo(intro.link.href)
  }

  return (
    <Section
      ref={ref}
      id="approach"
      theme="bone"
      className={`z-10 pt-[14vh] pb-[18vh] lg:pt-[12vh] lg:pb-[26vh] ${overlapHero ? 'lg:-mt-[38vh]' : ''}`}
      aria-labelledby="approach-title"
    >
      <div className="container-x grid-12 relative">
        {/* background ring — a slow, distant layer */}
        <div
          aria-hidden="true"
          data-parallax="40"
          className="pointer-events-none absolute top-[-8vh] left-[26%] hidden h-[38vw] w-[38vw] rounded-full border hairline lg:block"
        />

        <div className="col-span-12 mb-10 flex items-center gap-4 lg:col-span-2 lg:mb-0 lg:block">
          <Label>{intro.index}</Label>
          <span className="h-px w-8 bg-line lg:hidden" />
          <Label className="lg:mt-2 lg:block">{intro.label}</Label>
        </div>

        <div className="relative z-10 col-span-12 lg:col-span-7 lg:col-start-3">
          <EditorialText
            as="h2"
            id="approach-title"
            mode="words"
            className="statement max-w-[24ch] text-[clamp(1.75rem,7.4vw,2.6rem)] lg:max-w-none lg:text-[clamp(2.4rem,3.7vw,4.2rem)]"
          >
            {intro.statement}
          </EditorialText>

          {/* mobile collage: image + note overlap */}
          <div className="relative mt-14 lg:hidden" aria-hidden="true">
            <ImageReveal
              src={intro.image.src}
              alt=""
              width={intro.image.w}
              height={intro.image.h}
              className="ml-auto aspect-[4/3] w-[88%] rounded-xl"
              sizes="(max-width: 1024px) 88vw, 26vw"
              drift={40}
            />
            <div data-parallax="-30" className="absolute -bottom-10 left-0 w-[66%] max-w-[260px]">
              <NoteCard />
            </div>
          </div>

          <div className="mt-24 flex items-center gap-8 lg:mt-20">
            <a href={intro.link.href} onClick={go} className="group inline-flex items-center gap-3 text-[0.95rem] font-medium">
              <span className="link-line">{intro.link.label}</span>
              <ArrowRight className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* desktop floating layer */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          <div data-parallax="-90" className="absolute top-[-14vh] right-[var(--margin)] w-[22vw] will-change-transform">
            <ImageReveal
              src={intro.image.src}
              alt=""
              width={intro.image.w}
              height={intro.image.h}
              className="aspect-[4/3] w-full rounded-xl"
              sizes="26vw"
            />
          </div>
          <div data-parallax="60" className="absolute bottom-[-8vh] left-[58%] w-[17rem] will-change-transform">
            <div data-rise>
              <NoteCard />
            </div>
          </div>
          <div data-parallax="110" className="absolute right-[var(--margin)] bottom-[22vh] w-[13.5rem] will-change-transform">
            <div data-rise>
              <BudgetPanel />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
