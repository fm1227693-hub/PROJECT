import { useRef } from 'react'
import Section from '../components/Section'
import Label from '../components/Label'
import EditorialText from '../components/EditorialText'
import MagneticButton from '../components/MagneticButton'
import { ArrowUpRight } from '../components/icons'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { useScroll } from '../context/scroll'
import { cta, brand } from '../data/content'

/**
 * The climax: the page turns cobalt, the type is the largest on the site,
 * and there is exactly one thing to do.
 */
export default function FinalCTA() {
  const ref = useRef(null)
  const titleRef = useRef(null)
  const { caps } = useScroll()

  useGsap(() => {
    if (caps.reduced || !caps.parallax) return
    gsap.fromTo(
      titleRef.current,
      { scale: 1.06, transformOrigin: '0% 100%' },
      { scale: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top 20%', scrub: true } },
    )
  }, ref, [caps.reduced, caps.parallax])

  return (
    <Section ref={ref} id="contact" theme="cobalt" className="flex min-h-svh flex-col justify-between py-[10vh] lg:py-[8vh]" aria-labelledby="contact-title">
      <div className="container-x flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Label>06</Label>
          <span className="h-px w-8 bg-line" />
          <Label as="h2" id="contact-title">
            {cta.label}
          </Label>
        </div>
        <a href={`mailto:${brand.email}`} className="label link-line hidden text-muted md:inline-block">
          {brand.email}
        </a>
      </div>

      <div className="container-x py-[8vh]">
        <div ref={titleRef} className="will-change-transform">
          <EditorialText as="p" className="display text-[clamp(3.2rem,18.5vw,6.4rem)] lg:text-[clamp(5.5rem,12.5vw,15rem)]" start="top 80%">
            {cta.lines[0]}
            <br />
            <span className="serif-italic lg:ml-[12vw]">{cta.lines[1]}</span>
          </EditorialText>
        </div>

        <div className="mt-12 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-center lg:gap-10">
          <MagneticButton href={`mailto:${brand.email}`} icon={<ArrowUpRight />} className="w-fit" strength={0.4}>
            {cta.button}
          </MagneticButton>
          <p className="max-w-[30ch] text-[0.95rem] leading-[1.5] text-muted">Tell us what you are making. We read every message ourselves.</p>
        </div>
      </div>

      <div className="container-x flex flex-wrap gap-x-10 gap-y-2 border-t hairline pt-6">
        {cta.meta.map((m) => (
          <Label key={m}>{m}</Label>
        ))}
      </div>
    </Section>
  )
}
