import { useRef } from 'react'
import Section from '../components/Section'
import Label from '../components/Label'
import EditorialText from '../components/EditorialText'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useGsap } from '../hooks/useGsap'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useScroll } from '../context/scroll'
import { rise } from '../animations/scrollAnimations'
import { capabilities } from '../data/content'

const TONES = {
  white: { className: 'bg-white text-ink border hairline', vars: {} },
  bone: { className: 'bg-bone text-ink', vars: {} },
  ink: {
    className: 'bg-ink text-paper',
    vars: { '--bg': '#0f0f10', '--fg': '#f4f3ef', '--muted': 'rgba(244,243,239,0.55)', '--line': 'rgba(244,243,239,0.18)' },
  },
  cobalt: {
    className: 'bg-cobalt text-paper',
    vars: { '--bg': '#1d2cf3', '--fg': '#f4f3ef', '--muted': 'rgba(244,243,239,0.68)', '--line': 'rgba(244,243,239,0.26)' },
  },
}

/* Decorative visuals — one per capability, all vector, all hover-reactive via CSS. */
function Visual({ kind }) {
  const common = 'h-full w-full'
  if (kind === 'rings') {
    return (
      <svg viewBox="0 0 320 320" className={common} aria-hidden="true">
        {[132, 100, 68, 36].map((r, i) => (
          <circle key={r} className="ring" cx="160" cy="160" r={r} fill="none" stroke="currentColor" strokeOpacity={0.25 + i * 0.2} />
        ))}
        <circle cx="160" cy="160" r="5" fill="var(--color-cobalt)" />
        <line x1="160" y1="28" x2="160" y2="44" stroke="currentColor" />
        <line x1="160" y1="276" x2="160" y2="292" stroke="currentColor" />
      </svg>
    )
  }
  if (kind === 'grid') {
    const dots = []
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < 6; x++) {
        const dx = ((x + y) % 3) - 1
        const dy = ((x * 2 + y) % 3) - 1
        dots.push(
          <circle
            key={`${x}-${y}`}
            className="dot"
            cx={50 + x * 44}
            cy={50 + y * 44}
            r={x === 2 && y === 2 ? 7 : 3.5}
            fill={x === 2 && y === 2 ? 'var(--color-cobalt)' : 'currentColor'}
            fillOpacity={x === 2 && y === 2 ? 1 : 0.55}
            style={{ '--dx': `${dx * 6}px`, '--dy': `${dy * 6}px` }}
          />,
        )
      }
    return (
      <svg viewBox="0 0 320 320" className={common} aria-hidden="true">
        {dots}
      </svg>
    )
  }
  if (kind === 'sheets') {
    return (
      <svg viewBox="0 0 320 320" className={common} aria-hidden="true">
        <rect className="sheet" x="40" y="70" width="200" height="150" rx="14" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <rect className="sheet" x="60" y="90" width="200" height="150" rx="14" fill="var(--bg)" stroke="currentColor" strokeOpacity="0.7" />
        <rect className="sheet" x="80" y="110" width="200" height="150" rx="14" fill="var(--bg)" stroke="currentColor" />
        <circle cx="258" cy="130" r="5" fill="var(--color-cobalt)" />
        <line x1="100" y1="150" x2="200" y2="150" stroke="currentColor" strokeOpacity="0.6" />
        <line x1="100" y1="170" x2="170" y2="170" stroke="currentColor" strokeOpacity="0.35" />
      </svg>
    )
  }
  if (kind === 'bars') {
    const widths = [220, 150, 190, 90, 240, 120, 170]
    return (
      <svg viewBox="0 0 320 320" className={common} aria-hidden="true">
        {widths.map((w, i) => (
          <rect key={i} className="bar" x="40" y={62 + i * 30} width={w} height="10" rx="5" fill="currentColor" fillOpacity={i === 4 ? 1 : 0.45} />
        ))}
        <rect x="40" y="62" width="4" height="190" fill="var(--color-white)" fillOpacity="0.5" />
      </svg>
    )
  }
  // path
  return (
    <svg viewBox="0 0 320 320" className={common} aria-hidden="true">
      <g transform="translate(60 80)">
        <path d="M 0 80 C 60 0, 140 160, 200 80" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        <path d="M 0 80 C 60 0, 140 160, 200 80" fill="none" stroke="currentColor" strokeDasharray="2 6" strokeOpacity="0.5" transform="translate(0 60)" />
        <circle className="path-dot" r="7" fill="var(--color-cobalt)" />
        <circle cx="0" cy="80" r="3" fill="currentColor" />
        <circle cx="200" cy="80" r="3" fill="currentColor" />
      </g>
    </svg>
  )
}

/**
 * Capabilities as a stack of cards.
 * Desktop: each card pins beneath the previous one; as the next arrives, the card
 * behind recedes (scale + veil). Touch / narrow: a plain vertical stack with reveals —
 * the same cards, no pinning.
 */
export default function InteractiveSection() {
  const ref = useRef(null)
  const listRef = useRef(null)
  const { caps } = useScroll()
  const isDesktop = useMediaQuery('(min-width: 64rem)')
  const stack = caps.pin && isDesktop

  useGsap(() => {
    const cards = gsap.utils.toArray(listRef.current.querySelectorAll('[data-card]'))
    if (!stack) {
      rise(cards, { reduced: caps.reduced, y: 40, stagger: 0, start: 'top 90%' })
      return
    }
    const topOffset = (i) => `${window.innerHeight * 0.11 + i * 18}px`
    cards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: () => `top ${topOffset(i)}`,
        endTrigger: listRef.current,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })
      if (i < cards.length - 1) {
        const veil = card.querySelector('[data-veil]')
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: () => `top ${topOffset(i + 1)}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
          .to(card, { scale: 0.94, transformOrigin: 'top center', duration: 1 }, 0)
          .to(veil, { opacity: 0.45, duration: 1 }, 0)
      }
    })
  }, ref, [stack, caps.reduced])

  return (
    <Section ref={ref} id="capabilities" theme="paper" className="pt-[14vh] pb-[12vh] lg:pt-[18vh] lg:pb-[16vh]" aria-labelledby="capabilities-title">
      <div className="container-x">
        <header className="grid-12 items-end gap-y-8">
          <div className="col-span-12 flex items-center gap-4 lg:col-span-4">
            <Label>{capabilities.index}</Label>
            <span className="h-px w-8 bg-line" />
            <Label as="h2" id="capabilities-title">
              {capabilities.label}
            </Label>
          </div>
          <EditorialText as="p" className="statement col-span-12 text-[clamp(1.6rem,6.4vw,2.3rem)] lg:col-span-7 lg:col-start-6 lg:text-[clamp(2rem,3.1vw,3.3rem)]">
            {capabilities.heading}
          </EditorialText>
        </header>

        <ol ref={listRef} className="mt-14 flex flex-col gap-6 lg:mt-24 lg:gap-[8vh]">
          {capabilities.items.map((it) => {
            const tone = TONES[it.tone]
            return (
              <li key={it.n} data-card className="cap-card relative will-change-transform">
                <article className={`grid-12 relative min-h-[58vh] gap-y-10 rounded-2xl p-6 lg:min-h-[66vh] lg:p-10 xl:p-12 ${tone.className}`} style={tone.vars}>
                  <div className="col-span-12 flex flex-col justify-between lg:col-span-6">
                    <div className="flex items-center justify-between">
                      <Label>{it.n}</Label>
                      <Label>Capability</Label>
                    </div>
                    <div className="mt-16 lg:mt-0">
                      <h3 className="display text-[clamp(2rem,8.4vw,3rem)] lg:text-[clamp(2.6rem,4.3vw,4.9rem)]">{it.title}</h3>
                      <p className="mt-6 max-w-[42ch] text-[0.95rem] leading-[1.55] text-muted lg:text-[1.05rem]">{it.body}</p>
                      <ul className="mt-8 flex flex-wrap gap-2">
                        {it.tags.map((t) => (
                          <li key={t} className="rounded-full border hairline px-3 py-1.5 text-[0.78rem] font-medium">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="cap-visual col-span-12 flex items-center justify-center lg:col-span-5 lg:col-start-8">
                    <div className="w-[min(60vw,260px)] lg:w-[min(24vw,340px)]">
                      <Visual kind={it.visual} />
                    </div>
                  </div>
                </article>
                <div data-veil aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-paper opacity-0" />
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
