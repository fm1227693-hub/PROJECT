import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Section from '../components/Section'
import Label from '../components/Label'
import ImageReveal from '../components/ImageReveal'
import { ArrowUpRight } from '../components/icons'
import { gsap } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useScroll } from '../context/scroll'
import { follower } from '../animations/hoverAnimations'
import { rise } from '../animations/scrollAnimations'
import { projects } from '../data/content'

/**
 * Selected work.
 * Desktop: an index of oversized titles; a preview image trails the pointer while a
 * row is hovered and un-clips when the hovered project changes. The list dims
 * everything except the active row.
 * Touch / narrow: an editorial stack of image cards with alternating widths.
 */
export default function ShowcaseSection() {
  const ref = useRef(null)
  const previewRef = useRef(null)
  const imgRefs = useRef([])
  const fol = useRef(null)
  const active = useRef(-1)
  const { caps } = useScroll()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const hoverPreview = isDesktop && caps.fine && !caps.reduced

  useGsap(() => {
    rise(ref.current.querySelectorAll('[data-row]'), { reduced: caps.reduced, y: 40, stagger: 0.08, start: 'top 90%' })
  }, ref, [caps.reduced, isDesktop])

  useEffect(() => {
    if (!hoverPreview || !previewRef.current) return
    const el = previewRef.current
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.9 })
    fol.current = follower(el)
    return () => {
      fol.current?.destroy()
      fol.current = null
    }
  }, [hoverPreview])

  const show = useCallback(
    (i, e) => {
      if (!fol.current) return
      const prev = active.current
      active.current = i
      const img = imgRefs.current[i]
      if (img && prev !== i) {
        imgRefs.current.forEach((im, k) => im && (im.style.zIndex = k === i ? 2 : 1))
        gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)', scale: 1.12 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 0.8, ease: 'expo.out', overwrite: true })
      }
      if (prev === -1) fol.current.jump(e.clientX, e.clientY)
      fol.current.show()
    },
    [],
  )

  const move = useCallback((e) => fol.current?.move(e.clientX, e.clientY), [])
  const hide = useCallback(() => {
    active.current = -1
    fol.current?.hide()
  }, [])

  return (
    <Section ref={ref} id="work" theme="bone" className="pt-[8vh] pb-[18vh] lg:pt-[10vh] lg:pb-[26vh]" aria-labelledby="work-title">
      <div className="container-x">
        <header className="flex items-end justify-between border-b hairline pb-5">
          <div className="flex items-center gap-4">
            <Label>02</Label>
            <span className="h-px w-8 bg-line" />
            <Label as="h2" id="work-title">
              Selected work
            </Label>
          </div>
          <Label>(05) 2024 — 2026</Label>
        </header>

        {isDesktop ? (
          <ul className="work-list" onPointerLeave={hoverPreview ? hide : undefined}>
            {projects.map((p, i) => (
              <li key={p.id} data-row className="work-row border-b hairline">
                <a
                  href={`#${p.id}`}
                  onClick={(e) => e.preventDefault()}
                  data-cursor={hoverPreview ? 'View' : undefined}
                  onPointerEnter={hoverPreview ? (e) => show(i, e) : undefined}
                  onPointerMove={hoverPreview ? move : undefined}
                  className="work-link grid-12 items-center py-7 xl:py-8"
                  aria-label={`${p.title} — ${p.category}, ${p.year}`}
                >
                  <span className="label col-span-1 text-muted">0{i + 1}</span>
                  <h3 className="display work-title col-span-6 text-[clamp(2.6rem,5.6vw,6.4rem)] will-change-transform">{p.title}</h3>
                  <span className="col-span-3 text-[0.9rem] leading-snug text-muted">
                    {p.category}
                    <span className="mt-1 block text-[0.78rem] opacity-70">{p.scope}</span>
                  </span>
                  <span className="label col-span-1 text-muted">{p.year}</span>
                  <span className="work-arrow col-span-1 justify-self-end will-change-transform">
                    <ArrowUpRight size={26} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-10 flex flex-col gap-14">
            {projects.map((p, i) => (
              <li key={p.id} data-row className={i % 2 ? 'w-[86%] self-end' : 'w-full'}>
                <a href={`#${p.id}`} onClick={(e) => e.preventDefault()} className="group block" aria-label={`${p.title} — ${p.category}, ${p.year}`}>
                  <ImageReveal
                    src={p.image.src}
                    alt={p.image.alt}
                    width={p.image.w}
                    height={p.image.h}
                    className="aspect-[4/3] rounded-xl"
                    sizes="(max-width: 1024px) 90vw, 400px"
                    drift={24}
                  />
                  <div className="mt-4 flex items-start justify-between gap-4 border-b hairline pb-5">
                    <div>
                      <div className="flex items-baseline gap-3">
                        <span className="label text-muted">0{i + 1}</span>
                        <h3 className="text-[1.75rem] font-medium tracking-[-0.03em]">{p.title}</h3>
                      </div>
                      <p className="mt-1 text-[0.9rem] text-muted">{p.category}</p>
                    </div>
                    <Label className="pt-1">{p.year}</Label>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {hoverPreview &&
        createPortal(
          <div
            ref={previewRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[800] aspect-[4/3] w-[24vw] max-w-[420px] min-w-[260px] overflow-hidden rounded-xl will-change-transform"
          >
            {projects.map((p, i) => (
              <img
                key={p.id}
                ref={(el) => (imgRefs.current[i] = el)}
                src={p.image.src}
                alt=""
                width={p.image.w}
                height={p.image.h}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover will-change-transform"
                style={{ clipPath: i === 0 ? 'inset(0)' : 'inset(100% 0 0 0)' }}
              />
            ))}
          </div>,
          document.body,
        )}
    </Section>
  )
}
