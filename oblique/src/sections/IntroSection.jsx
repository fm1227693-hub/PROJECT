import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import { useMouseParallax } from '../hooks/useMouseParallax'
import { parallaxY, revealUp } from '../animations/scrollAnimations'
import Section, { SectionLabel } from '../components/Section'
import EditorialText from '../components/EditorialText'
import ImageReveal from '../components/ImageReveal'
import FloatingObject3D from '../components/FloatingObject3D'

const FACTS = [
  { value: '2019', label: 'Founded' },
  { value: '14', label: 'People, two studios' },
  { value: '61', label: 'Products shipped' },
  { value: '0', label: 'Templates used' },
]

export default function IntroSection() {
  const ref = useRef(null)
  const objectRef = useRef(null)
  const objectScrollRef = useRef(null)
  const statRef = useRef(null)
  const { env } = useSmoothScroll()

  useMouseParallax(objectRef, { strength: 14 })

  useGSAP(
    () => {
      if (env.reduced) return
      const intensity = env.touch ? 0.4 : 1
      revealUp('[data-stat]', { trigger: statRef.current, y: 40, stagger: 0.12 })
      revealUp('[data-fact]', { trigger: '[data-facts]', y: 24, stagger: 0.08, start: 'top 90%' })
      parallaxY(objectScrollRef.current, 120 * intensity)
      // The big number counts up once it is in view.
      const counter = ref.current.querySelector('[data-count]')
      if (counter) {
        const target = parseInt(counter.dataset.count, 10)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: counter, start: 'top 85%', once: true },
          onUpdate: () => {
            counter.textContent = Math.round(obj.v)
          },
        })
      }
    },
    { scope: ref, dependencies: [env.reduced, env.touch] },
  )

  return (
    <Section
      ref={ref}
      id="studio"
      theme="bone"
      label="Point of view"
      className="pb-[16vh] pt-[16vh] lg:pb-[18vh] lg:pt-[24vh]"
    >
      <div className="gutter grid-12 items-start">
        <div className="col-span-12 lg:col-span-2">
          <SectionLabel index="01" title="Point of view" />
        </div>
        <div className="col-span-12 mt-8 lg:col-span-10 lg:col-start-3 lg:mt-0">
          <EditorialText
            as="h2"
            mode="words"
            className="display-lg max-w-[12.5ch]"
            start="top 80%"
          >
            Attention is the scarcest material we work with. Everything we ship is built to earn
            it, and to keep it.
          </EditorialText>
        </div>
      </div>

      <div className="gutter grid-12 relative mt-[10vh] items-end lg:mt-[6vh]">
        {/* 3D object — deliberately breaks the column edge on desktop */}
        <div className="col-span-12 order-first lg:order-none lg:col-span-5 lg:col-start-8 lg:-mt-[22vh]">
          <div ref={objectScrollRef} className="will-transform lg:translate-x-[10%]">
            <div ref={objectRef} className="will-transform">
              <FloatingObject3D className="mx-auto w-[min(72vw,340px)] lg:mx-0 lg:ml-auto lg:w-full lg:max-w-[520px]" />
            </div>
          </div>
        </div>

        {/* Stat */}
        <div ref={statRef} className="col-span-8 mt-4 lg:col-span-3 lg:col-start-3 lg:mt-0">
          <p data-stat className="display-md tabular-nums">
            <span data-count="50">0</span>
            <span className="text-ash"> ms</span>
          </p>
          <p data-stat className="mt-4 max-w-[17rem] text-[15px] leading-[1.5] text-ash">
            The time a first impression takes. We spend months on it, so you don't have to spend
            a second thinking about it.
          </p>
        </div>

        {/* Small image */}
        <div className="col-span-5 col-start-8 mt-12 lg:col-span-2 lg:col-start-6 lg:mt-0">
          <ImageReveal
            src="/images/hero-02.webp"
            srcSet="/images/hero-02-sm.webp 640w, /images/hero-02.webp 1200w"
            sizes="(min-width: 1024px) 16vw, 40vw"
            ratio="4 / 5"
            alt="A brushed aluminium object on a travertine slab"
            parallax={50}
          />
          <p className="label mt-3 text-ash">Field · industrial design, 2025</p>
        </div>
      </div>

      {/* Facts */}
      <div data-facts className="gutter mt-[14vh]">
        <div className="hairline" />
        <ul className="grid grid-cols-2 gap-y-10 pt-8 lg:grid-cols-4">
          {FACTS.map((f) => (
            <li key={f.label} data-fact>
              <p className="text-[clamp(1.75rem,2.6vw,2.5rem)] font-medium leading-none tracking-[-0.03em] tabular-nums">
                {f.value}
              </p>
              <p className="label mt-3 text-ash">{f.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
