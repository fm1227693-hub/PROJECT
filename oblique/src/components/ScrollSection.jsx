import { forwardRef, useRef, useImperativeHandle } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import Section from './Section'

/**
 * A section that pins its stage while the user scrolls through
 * `length` viewport heights, exposing a scrubbed timeline via `build`.
 *
 *   <ScrollSection length={2} build={(tl, els) => { tl.to(...) }}>
 *     {(stageRef) => <div ref={stageRef}>…</div>}
 *   </ScrollSection>
 *
 * On reduced-motion the section simply renders unpinned.
 */
const ScrollSection = forwardRef(function ScrollSection(
  { length = 2, build, enabled = true, scrub = 0.8, children, className = '', ...sectionProps },
  ref,
) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const { env } = useSmoothScroll()
  const active = enabled && !env.reduced

  useImperativeHandle(ref, () => sectionRef.current)

  useGSAP(
    () => {
      if (!active || !build) return
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * length}`,
          pin: stageRef.current,
          pinSpacing: true,
          scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      build(tl, { section: sectionRef.current, stage: stageRef.current })
    },
    { scope: sectionRef, dependencies: [active, length, scrub] },
  )

  return (
    <Section ref={sectionRef} className={className} {...sectionProps}>
      {typeof children === 'function' ? children(stageRef, active) : children}
    </Section>
  )
})

export default ScrollSection
