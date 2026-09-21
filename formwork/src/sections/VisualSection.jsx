import { useRef } from 'react'
import Section from '../components/Section'
import ScrollSection from '../components/ScrollSection'
import Label from '../components/Label'
import EditorialText from '../components/EditorialText'
import ImageReveal from '../components/ImageReveal'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useScroll } from '../context/scroll'
import { visual } from '../data/content'

/**
 * Immersive image.
 * Desktop: a small framed image is pinned in the centre and grows — by transform
 * only — until it fills the viewport, while the image inside settles from a zoom
 * (scale + counter-scale, no width/height animation). The caption arrives once
 * the frame has taken over.
 * Touch / narrow: full-bleed image with a reveal and gentle drift, caption below.
 */
export default function VisualSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const frameRef = useRef(null)
  const imgRef = useRef(null)
  const captionRef = useRef(null)
  const shadeRef = useRef(null)
  const metaRef = useRef(null)
  const { caps } = useScroll()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const pinned = caps.pin && isDesktop

  useGsap(() => {
    if (!pinned || caps.reduced) return
    const frame = frameRef.current
    const cover = () => Math.max(window.innerWidth / frame.offsetWidth, window.innerHeight / frame.offsetHeight) * 1.02

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=170%',
        pin: stageRef.current,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    tl.fromTo(frame, { scale: 1 }, { scale: cover, duration: 0.6, ease: 'power1.inOut' }, 0)
    tl.fromTo(imgRef.current, { scale: 1.35 }, { scale: 1, duration: 0.6, ease: 'power1.inOut' }, 0)
    tl.to(metaRef.current, { opacity: 0, duration: 0.15 }, 0.15)
    tl.fromTo(shadeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.45)
    tl.fromTo(captionRef.current.children, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, 0.58)
  }, sectionRef, [pinned, caps.reduced])

  if (!pinned) {
    return (
      <Section ref={sectionRef} id="craft" theme="dark" className="pt-[6vh] pb-[16vh]" aria-labelledby="craft-title">
        <div className="container-x flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label>{visual.index}</Label>
            <span className="h-px w-8 bg-line" />
            <Label as="h2" id="craft-title">
              {visual.label}
            </Label>
          </div>
          <Label>Amsterdam, 2026</Label>
        </div>
        <ImageReveal
          src={visual.image.src}
          alt={visual.image.alt}
          width={visual.image.w}
          height={visual.image.h}
          className="mt-8 aspect-[4/5] w-full xs:aspect-[4/3] md:aspect-[16/9]"
          sizes="100vw"
          drift={caps.touch ? 40 : 80}
        />
        <div className="container-x mt-12">
          <EditorialText as="h3" className="display text-[clamp(2.4rem,11.5vw,6rem)]">
            {visual.headline}
          </EditorialText>
          <p className="mt-6 max-w-[38ch] text-[0.95rem] leading-[1.55] text-muted">{visual.body}</p>
        </div>
      </Section>
    )
  }

  return (
    <ScrollSection ref={sectionRef} stageRef={stageRef} id="craft" theme="dark" stageClassName="flex items-center justify-center" aria-labelledby="craft-title">
      <div ref={frameRef} className="relative aspect-[4/3] w-[34vw] overflow-hidden rounded-xl will-change-transform">
        <img
          ref={imgRef}
          src={visual.image.src}
          alt={visual.image.alt}
          width={visual.image.w}
          height={visual.image.h}
          loading="lazy"
          decoding="async"
          sizes="100vw"
          className="h-full w-full object-cover will-change-transform"
        />
        <div ref={shadeRef} className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-0" aria-hidden="true" />
      </div>

      <div className="container-x pointer-events-none absolute inset-0 flex flex-col justify-between py-10">
        <div ref={metaRef} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Label>{visual.index}</Label>
            <span className="h-px w-8 bg-line" />
            <Label as="h2" id="craft-title">
              {visual.label}
            </Label>
          </div>
          <Label>Amsterdam, 2026</Label>
        </div>
        <div ref={captionRef} className="grid-12 items-end text-paper">
          <h3 className="display col-span-7 text-[clamp(2.6rem,6.2vw,7.5rem)] opacity-0">
            {visual.headline}
          </h3>
          <p className="col-span-4 col-start-9 max-w-[36ch] text-[1rem] leading-[1.55] text-paper/75 opacity-0">{visual.body}</p>
        </div>
      </div>
    </ScrollSection>
  )
}
