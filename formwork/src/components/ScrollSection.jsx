import Section from './Section'

/**
 * A section that contains a pinned stage. The stage is the element GSAP pins;
 * ScrollTrigger adds the pin spacing so the following section waits its turn.
 */
export default function ScrollSection({ stageRef, stageClassName = '', children, ref, ...rest }) {
  return (
    <Section ref={ref} {...rest}>
      <div ref={stageRef} className={`relative h-svh w-full overflow-hidden ${stageClassName}`}>
        {children}
      </div>
    </Section>
  )
}
