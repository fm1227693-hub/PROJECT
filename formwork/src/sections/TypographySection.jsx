import { Fragment, useRef } from 'react'
import Section from '../components/Section'
import ScrollSection from '../components/ScrollSection'
import Label from '../components/Label'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useScroll } from '../context/scroll'
import { applyParallax, rise } from '../animations/scrollAnimations'
import { principles } from '../data/content'

function Chip({ src, className = '' }) {
  return (
    <span className={`inline-block shrink-0 overflow-hidden rounded-[0.9vw] ${className}`} aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" width={400} height={300} className="h-full w-full object-cover" />
    </span>
  )
}

/**
 * Principles as one enormous line of type.
 * Desktop: the stage is pinned and the line travels horizontally with scroll —
 * scroll distance equals the line's length, so the reader drives the sentence.
 * Touch / narrow: the same words stacked, each drifting a few pixels sideways.
 */
export default function TypographySection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const hintRef = useRef(null)
  const { caps } = useScroll()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const pinned = caps.pin && isDesktop

  useGsap(() => {
    if (caps.reduced) return
    if (!pinned) {
      applyParallax(sectionRef.current, caps.parallax)
      rise(sectionRef.current.querySelectorAll('[data-line]'), { reduced: caps.reduced, y: 30, stagger: 0.1, start: 'top 92%' })
      return
    }
    const track = trackRef.current
    const distance = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.06
    // the line travels ~1.4x faster than the scroll, so the section stays long enough to read but never drags
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${Math.round(distance() / 1.4)}`,
        pin: stageRef.current,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    tl.to(track, { x: () => -distance(), duration: 1 }, 0)
    tl.fromTo(barRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
    tl.to(hintRef.current, { opacity: 0, duration: 0.08 }, 0)
  }, sectionRef, [pinned, caps.reduced, caps.parallax])

  const header = (
    <div className="container-x flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Label>{principles.index}</Label>
        <span className="h-px w-8 bg-line" />
        <Label as="h2" id="principles-title">
          {principles.label}
        </Label>
      </div>
      <Label ref={hintRef} className="hidden lg:block">
        Scroll to read →
      </Label>
    </div>
  )

  if (!pinned) {
    return (
      <Section ref={sectionRef} id="principles" theme="dark" className="py-[16vh] lg:py-[20vh]" aria-labelledby="principles-title">
        {header}
        <div className="container-x mt-14 flex flex-col gap-4 overflow-x-clip">
          {principles.items.map((it, i) => (
            <Fragment key={it.text}>
              <p
                data-line
                data-drift-x={i % 2 ? 36 : -36}
                className={`display text-[clamp(2.4rem,12.5vw,7rem)] will-change-transform ${it.style === 'serif' ? 'serif-italic text-[clamp(2.6rem,13.5vw,7.6rem)]' : ''} ${i % 2 ? 'self-end text-right' : ''}`}
              >
                {it.text}
              </p>
              {principles.chips[i] && i < 2 && (
                <div className={`flex ${i % 2 ? '' : 'justify-end'}`} data-line>
                  <Chip src={principles.chips[i]} className="h-16 w-24 !rounded-lg xs:h-20 xs:w-32" />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </Section>
    )
  }

  return (
    <ScrollSection ref={sectionRef} stageRef={stageRef} id="principles" theme="dark" stageClassName="flex flex-col justify-between py-10" aria-labelledby="principles-title">
      {header}

      <div ref={trackRef} className="flex items-center gap-[5vw] pl-[var(--margin)] whitespace-nowrap will-change-transform">
        {principles.items.map((it, i) => (
          <Fragment key={it.text}>
            <span className={`display ${it.style === 'serif' ? 'serif-italic text-[10.2vw]' : 'text-[9.5vw]'}`}>{it.text}</span>
            {principles.chips[i] && <Chip src={principles.chips[i]} className="h-[7.5vw] w-[11vw]" />}
          </Fragment>
        ))}
        <span className="w-[8vw] shrink-0" aria-hidden="true" />
      </div>

      <div className="container-x flex items-center justify-between">
        <div className="h-px w-[28vw] bg-line">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-fg will-change-transform" />
        </div>
        <Label>Four principles, one line</Label>
      </div>
    </ScrollSection>
  )
}
