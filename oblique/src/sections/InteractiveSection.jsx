import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'
import { cursorFollower, tilt } from '../animations/hoverAnimations'
import { revealUp } from '../animations/scrollAnimations'
import { practice, notes } from '../data/content'
import Section, { SectionLabel } from '../components/Section'
import EditorialText from '../components/EditorialText'
import { ArrowUpRight } from '../components/icons'

const TONES = {
  paper: 'bg-paper text-ink border border-ink/10',
  ink: 'bg-ink text-paper border border-paper/10',
  signal: 'bg-signal text-ink border border-ink/15',
}

const CARD_POSE = [
  'lg:left-0 lg:top-8 lg:-rotate-6',
  'lg:left-[31%] lg:top-0 lg:rotate-3',
  'lg:left-[60%] lg:top-12 lg:-rotate-2',
]

function NoteCard({ note, pose, cardRef }) {
  return (
    <a
      ref={cardRef}
      href="#journal"
      data-note
      data-cursor="open"
      className={[
        'group flex h-[340px] w-[min(74vw,260px)] shrink-0 snap-start flex-col justify-between rounded-[12px] p-6 will-transform',
        'lg:absolute lg:h-[360px] lg:w-[270px] lg:transition-[translate,rotate,box-shadow] lg:duration-700 lg:[transition-timing-function:var(--ease-out-expo)]',
        'lg:hover:z-10 lg:hover:-translate-y-3 lg:hover:rotate-0 lg:hover:shadow-[0_40px_80px_-40px_rgba(15,14,12,0.45)]',
        TONES[note.tone],
        pose,
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="label rounded-full border border-current/25 px-2.5 py-1">{note.tag}</span>
        <ArrowUpRight className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div>
        <h3 className="display-sm">{note.title}</h3>
        <p className="label mt-4 opacity-60">{note.meta}</p>
      </div>
    </a>
  )
}

export default function InteractiveSection() {
  const ref = useRef(null)
  const listRef = useRef(null)
  const previewRef = useRef(null)
  const cardsRef = useRef([])
  const { env } = useSmoothScroll()

  // Cursor-following preview for the practice rows (pointer devices only)
  useEffect(() => {
    if (!env.pointerFX) return undefined
    const list = listRef.current
    const preview = previewRef.current
    const images = preview.querySelectorAll('[data-preview]')
    const follower = cursorFollower(preview, list, { lag: 0.75, offsetX: 48, offsetY: -60 })
    let active = -1

    const setActive = (idx) => {
      if (idx === active) return
      active = idx
      images.forEach((img, i) => {
        img.style.opacity = i === idx ? '1' : '0'
      })
    }

    const onMove = (e) => follower.move(e)
    const onOver = (e) => {
      const row = e.target.closest('[data-row]')
      if (!row) return
      setActive(Number(row.dataset.row))
      follower.show()
    }
    const onLeave = () => {
      follower.hide()
    }

    list.addEventListener('pointermove', onMove, { passive: true })
    list.addEventListener('pointerover', onOver, { passive: true })
    list.addEventListener('pointerleave', onLeave)
    return () => {
      list.removeEventListener('pointermove', onMove)
      list.removeEventListener('pointerover', onOver)
      list.removeEventListener('pointerleave', onLeave)
      follower.destroy()
    }
  }, [env.pointerFX])

  // Subtle tilt on the note cards (desktop only)
  useEffect(() => {
    if (!env.pointerFX || !window.matchMedia('(min-width: 1024px)').matches) return undefined
    const cleanups = cardsRef.current.filter(Boolean).map((el) => tilt(el, { max: 4, scale: 1.02 }))
    return () => cleanups.forEach((fn) => fn())
  }, [env.pointerFX])

  useGSAP(
    () => {
      if (env.reduced) return
      revealUp('[data-row]', { trigger: listRef.current, y: 30, stagger: 0.08, start: 'top 85%' })
      gsap.from('[data-note]', {
        y: 60,
        autoAlpha: 0,
        rotation: (i) => [-10, 6, -5][i] ?? 0,
        duration: 1.4,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-notes]', start: 'top 82%', once: true },
      })
    },
    { scope: ref, dependencies: [env.reduced] },
  )

  return (
    <Section
      ref={ref}
      id="practice"
      theme="light"
      label="Practice"
      className="pb-[14vh] pt-[18vh] lg:pb-[18vh] lg:pt-[22vh]"
    >
      <div className="gutter grid-12 items-end">
        <div className="col-span-12 lg:col-span-3">
          <SectionLabel index="05" title="Practice" />
        </div>
        <EditorialText
          as="h2"
          className="display-lg col-span-12 mt-8 max-w-[12ch] lg:col-span-9 lg:col-start-4 lg:mt-0"
        >
          Five disciplines, one table.
        </EditorialText>
      </div>

      {/* Rows */}
      <div ref={listRef} className="gutter relative mt-[8vh] lg:mt-[10vh]">
        <ul className="border-t border-current/15">
          {practice.map((item, i) => (
            <li key={item.title}>
              <a
                href="#contact"
                data-row={i}
                data-cursor="open"
                className="group grid grid-cols-12 items-baseline gap-x-4 border-b border-current/15 py-6 lg:py-7"
              >
                <span className="label col-span-2 text-ash lg:col-span-1">{item.index}</span>
                <h3 className="display-md col-span-9 transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] lg:col-span-5 lg:group-hover:translate-x-3">
                  {item.title}
                </h3>
                <span className="col-span-1 justify-self-end">
                  <ArrowUpRight
                    size={20}
                    className="transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:rotate-45"
                  />
                </span>
                <p className="col-span-10 col-start-3 mt-3 max-w-[26rem] text-[15px] leading-[1.5] text-ash lg:col-span-4 lg:col-start-8 lg:mt-0">
                  {item.text}
                </p>
              </a>
            </li>
          ))}
        </ul>

        {/* Floating preview — follows the pointer between rows */}
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[300px] w-[240px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[6px] bg-stone opacity-0 shadow-[0_40px_80px_-40px_rgba(15,14,12,0.5)] will-transform lg:block"
        >
          {practice.map((item) => (
            <img
              key={item.title}
              data-preview
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500"
            />
          ))}
        </div>
      </div>

      {/* Field notes */}
      <div data-notes className="mt-[16vh] lg:mt-[20vh]">
        <div className="gutter grid-12 items-start">
          <div className="col-span-12 lg:col-span-4">
            <SectionLabel title="Field notes" />
            <p className="lede mt-6 max-w-[20ch]">
              Things we learned, written down while they were still true.
            </p>
            <a
              href="#journal"
              className="link-underline mt-8 inline-flex items-center gap-2 text-[14px] font-medium"
            >
              Read the journal <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Desktop: fanned stack · Mobile: horizontal scroll-snap */}
          <div className="col-span-12 mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <div className="-mx-[var(--spacing-gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--spacing-gutter)] pb-4 [scrollbar-width:none] lg:relative lg:mx-0 lg:block lg:h-[420px] lg:overflow-visible lg:px-0 lg:pb-0">
              {notes.map((note, i) => (
                <NoteCard
                  key={note.title}
                  note={note}
                  pose={CARD_POSE[i]}
                  cardRef={(el) => {
                    cardsRef.current[i] = el
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
