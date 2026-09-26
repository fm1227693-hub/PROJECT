import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { isCoarsePointer } from './premium/studioEnv'

const FALLBACK =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="100%" height="100%" fill="%2315181D"/></svg>'

const PROJECTS = [
  {
    n: '01',
    titleKey: 'showcase.p1.title',
    subKey: 'showcase.p1.sub',
    tag: 'Course',
    year: '2026',
    to: '/pricing',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
  },
  {
    n: '02',
    titleKey: 'showcase.p2.title',
    subKey: 'showcase.p2.sub',
    tag: 'Reading',
    year: '2026',
    to: '/reading-tests',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=900&auto=format&fit=crop',
  },
  {
    n: '03',
    titleKey: 'showcase.p3.title',
    subKey: 'showcase.p3.sub',
    tag: 'Writing',
    year: '2026',
    to: '/ielts-writing',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop',
  },
  {
    n: '04',
    titleKey: 'showcase.p4.title',
    subKey: 'showcase.p4.sub',
    tag: 'Listening',
    year: '2025',
    to: '/listening-tests',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=900&auto=format&fit=crop',
  },
  {
    n: '05',
    titleKey: 'showcase.p5.title',
    subKey: 'showcase.p5.sub',
    tag: 'Speaking',
    year: '2025',
    to: '/games',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=900&auto=format&fit=crop',
  },
]

/**
 * ShowcaseSection — an interactive index of the platform.
 * Desktop: a cursor-following depth preview that swaps per row.
 * Mobile: a momentum swipe gallery with snap points.
 */
export default function ShowcaseSection() {
  const { t } = useTranslation()
  const listRef = useRef(null)
  const railRef = useRef(null)
  const previewRef = useRef(null)
  const [active, setActive] = useState(0)
  const coarse = isCoarsePointer()

  useEffect(() => {
    if (coarse) return undefined
    const preview = previewRef.current
    const list = listRef.current
    if (!preview || !list) return undefined

    gsap.set(preview, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 })
    const px = gsap.quickTo(preview, 'x', { duration: 0.72, ease: 'power3' })
    const py = gsap.quickTo(preview, 'y', { duration: 0.72, ease: 'power3' })
    const tiltX = gsap.quickTo(preview, 'rotationY', { duration: 0.9, ease: 'power3' })
    const tiltY = gsap.quickTo(preview, 'rotationX', { duration: 0.9, ease: 'power3' })

    const onMove = (e) => {
      px(e.clientX + 48)
      py(e.clientY)
      tiltX(((e.clientX / window.innerWidth) - 0.5) * 9)
      tiltY((0.5 - e.clientY / window.innerHeight) * 7)
    }
    const onEnter = () => gsap.to(preview, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' })
    const onLeave = () => {
      gsap.to(preview, { opacity: 0, scale: 0.92, duration: 0.45, ease: 'power3.out' })
      tiltX(0)
      tiltY(0)
    }

    list.addEventListener('mousemove', onMove)
    list.addEventListener('mouseenter', onEnter)
    list.addEventListener('mouseleave', onLeave)

    return () => {
      list.removeEventListener('mousemove', onMove)
      list.removeEventListener('mouseenter', onEnter)
      list.removeEventListener('mouseleave', onLeave)
    }
  }, [coarse])

  return (
    <section className="st-index" id="platform">
      <div className="st-shell">
        <div className="st-sec-head">
          <div>
            <span className="st-eyebrow">{t('showcase.badge', 'Platform')}</span>
            <h2 className="st-h2" style={{ marginTop: 18 }}>
              {t('showcase.title', 'Everything in one system')}
            </h2>
          </div>
          <Link to="/pricing" className="st-btn st-btn-line st-btn-sweep" data-cursor="Pricing">
            {t('showcase.all', 'View pricing')}
          </Link>
        </div>
      </div>

      {/* desktop index */}
      <div className="st-shell">
        <div className="st-index-list" ref={listRef}>
          {PROJECTS.map((p, i) => (
            <Link
              to={p.to}
              className={`st-index-row ${active === i ? 'is-active' : ''}`}
              key={p.n}
              data-cursor="Open"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="st-index-num">{p.n}</span>
              <span className="st-index-title">{t(p.titleKey)}</span>
              <span className="st-index-sub">{t(p.subKey)}</span>
              <span className="st-index-tag">
                {p.tag} · {p.year}
              </span>
              <span className="st-index-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* mobile swipe gallery */}
      <div className="st-index-rail" ref={railRef}>
        {PROJECTS.map((p) => (
          <Link to={p.to} className="st-rail-card" key={p.n} data-cursor="Open">
            <div className="st-rail-media">
              <img
                src={p.img}
                alt={t(p.titleKey)}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK
                }}
              />
              <span className="st-rail-tag">{p.tag}</span>
            </div>
            <div className="st-rail-body">
              <div>
                <b>{t(p.titleKey)}</b>
                <small>{t(p.subKey)}</small>
              </div>
              <span className="st-rail-meta">{p.year}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* cursor preview */}
      <div className="st-index-preview" ref={previewRef} aria-hidden="true">
        {PROJECTS.map((p, i) => (
          <div className={`pv ${active === i ? 'on' : ''}`} key={p.n}>
            <img
              src={p.img}
              alt=""
              onError={(e) => {
                e.currentTarget.src = FALLBACK
              }}
            />
            <span className="pv-cap">
              <b>{t(p.titleKey)}</b>
              <span>
                {p.n} / {String(PROJECTS.length).padStart(2, '0')}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
