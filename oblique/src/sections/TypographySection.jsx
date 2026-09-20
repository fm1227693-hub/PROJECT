import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import Section, { SectionLabel } from '../components/Section'
import EditorialText from '../components/EditorialText'

const ROW_A = ['Identity', 'Interface', 'Motion', 'Systems', 'Strategy']
const ROW_B = ['Lisbon', 'Berlin', 'Remote-first', 'Since 2019', 'Independent']

function Row({ words, outline = false, rowRef }) {
  const copies = [0, 1, 2]
  return (
    <div
      ref={rowRef}
      className={`flex whitespace-nowrap will-transform text-[15vw] font-medium leading-[0.95] tracking-[-0.045em] lg:text-[12.5vw] ${outline ? 'text-outline' : ''}`}
      aria-hidden="true"
    >
      {copies.map((c) => (
        <span key={c} className="flex shrink-0 items-baseline">
          {words.map((w) => (
            <span key={w} className="flex items-baseline">
              <span>{w}</span>
              <span className={`mx-[0.22em] inline-block h-[0.12em] w-[0.12em] rounded-full ${outline ? 'bg-signal' : 'bg-signal'}`} />
            </span>
          ))}
        </span>
      ))}
    </div>
  )
}

/**
 * Large scrolling typography. Both rows move only when the user scrolls
 * (no idle loop), and lean slightly with scroll velocity.
 */
export default function TypographySection() {
  const ref = useRef(null)
  const rowA = useRef(null)
  const rowB = useRef(null)
  const { env } = useSmoothScroll()

  useGSAP(
    () => {
      if (env.reduced) return
      const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: env.touch ? true : 0.8 }
      const travel = env.touch ? 14 : 22

      gsap.fromTo(rowA.current, { xPercent: 0 }, { xPercent: -travel, ease: 'none', scrollTrigger: st })
      gsap.fromTo(rowB.current, { xPercent: -travel }, { xPercent: 0, ease: 'none', scrollTrigger: st })

      if (env.touch) return

      // Velocity lean — restrained, and always eased back to zero.
      const rows = [rowA.current, rowB.current]
      const skewTo = gsap.quickTo(rows, 'skewX', { duration: 0.7, ease: 'power3.out' })
      let reset
      ScrollTrigger.create({
        ...st,
        scrub: false,
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-5, 5, self.getVelocity() / 400)
          skewTo(v)
          reset?.kill()
          reset = gsap.delayedCall(0.12, () => skewTo(0))
        },
      })
    },
    { scope: ref, dependencies: [env.reduced, env.touch] },
  )

  return (
    <Section
      ref={ref}
      id="range"
      theme="dark"
      label="Range of disciplines"
      className="overflow-hidden pb-[18vh] pt-[18vh] lg:pb-[22vh] lg:pt-[24vh]"
    >
      <div className="gutter mb-[8vh] lg:mb-[10vh]">
        <SectionLabel index="03" title="Range" meta="Disciplines practised under one roof" />
      </div>

      <p className="sr-only">
        Identity, interface, motion, systems and strategy. Lisbon, Berlin, remote-first,
        independent since 2019.
      </p>

      <div className="flex flex-col gap-[0.6vw]">
        <Row words={ROW_A} rowRef={rowA} />
        <Row words={ROW_B} rowRef={rowB} outline />
      </div>

      <div className="gutter grid-12 mt-[12vh] lg:mt-[16vh]">
        <EditorialText
          as="p"
          className="lede col-span-12 md:col-span-8 lg:col-span-5 lg:col-start-3"
        >
          Products don't respect the boundaries between disciplines, so neither do we. The same
          small team that names the thing also draws it, animates it and ships it.
        </EditorialText>
        <EditorialText
          as="p"
          className="col-span-12 mt-8 text-[15px] leading-[1.55] text-mist md:col-span-4 md:mt-0 lg:col-span-3 lg:col-start-9"
          delay={0.15}
        >
          Fourteen people. No account managers, no hand-offs, no decks that outlive the work. You
          talk to the people who make it.
        </EditorialText>
      </div>
    </Section>
  )
}
