import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaGraduationCap, FaUserCheck, FaCommentDots, FaStar } from 'react-icons/fa'
import gsap from 'gsap'
import { isCoarsePointer, prefersReducedMotion } from './premium/studioEnv'

/**
 * DeviceShowcase — the platform rendered as a physical object.
 * Layered depth: chassis shadow, screen content, travelling reflection sheen,
 * pointer-driven perspective (touch-drag on mobile).
 */
export default function DeviceShowcase() {
  const { t } = useTranslation()
  const [currentTime, setCurrentTime] = useState('')
  const stageRef = useRef(null)
  const plateRef = useRef(null)

  useEffect(() => {
    const updateUzbekTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', hour12: false })
      )
    }
    updateUzbekTime()
    const timer = setInterval(updateUzbekTime, 1000)
    return () => clearInterval(timer)
  }, [])

  /* depth interaction — replaces hover-only behaviour on touch */
  useEffect(() => {
    const stage = stageRef.current
    const plate = plateRef.current
    if (!stage || !plate || prefersReducedMotion()) return undefined

    const rotX = gsap.quickTo(plate, 'rotationX', { duration: 0.9, ease: 'power3' })
    const rotY = gsap.quickTo(plate, 'rotationY', { duration: 0.9, ease: 'power3' })
    const lift = gsap.quickTo(plate, 'y', { duration: 0.9, ease: 'power3' })

    const apply = (cx, cy) => {
      const r = plate.getBoundingClientRect()
      const nx = (cx - r.left) / r.width - 0.5
      const ny = (cy - r.top) / r.height - 0.5
      rotY(nx * 13)
      rotX(-ny * 11)
      lift(-10 - Math.abs(nx) * 6)
    }

    const onMove = (e) => apply(e.clientX, e.clientY)
    const onTouch = (e) => {
      if (!e.touches?.[0]) return
      apply(e.touches[0].clientX, e.touches[0].clientY)
    }
    const reset = () => {
      rotX(0)
      rotY(0)
      lift(0)
    }

    if (isCoarsePointer()) stage.addEventListener('touchmove', onTouch, { passive: true })
    else stage.addEventListener('mousemove', onMove)
    stage.addEventListener('mouseleave', reset)
    stage.addEventListener('touchend', reset)

    return () => {
      if (isCoarsePointer()) stage.removeEventListener('touchmove', onTouch)
      else stage.removeEventListener('mousemove', onMove)
      stage.removeEventListener('mouseleave', reset)
      stage.removeEventListener('touchend', reset)
    }
  }, [])

  const scrollToResults = () => {
    const el = document.getElementById('results-section')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 40
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const badges = [
    { icon: <FaGraduationCap />, label: t('mobileShowcase.badge1', '6+ Yil') },
    { icon: <FaUserCheck />, label: t('mobileShowcase.badge2', '200+ Student') },
    { icon: <FaCommentDots />, label: t('mobileShowcase.badge3', 'Speaking') },
  ]

  const students = [
    { name: 'Javohir Munirov', meta: 'Listening 9.0 • Reading 7.5', score: '7.5', img: 'https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg' },
    { name: 'Jahongir Zayniddinov', meta: 'Listening 8.5 • General 7.0', score: '7.0', img: 'https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg' },
  ]

  return (
    <section className="st-device">
      <div className="st-shell st-device-grid">
        <div className="st-device-copy">
          <span className="st-eyebrow">{t('mobileShowcase.badge', 'Platform')}</span>
          <h2 className="st-h2" style={{ margin: '20px 0 24px' }}>
            {t('mobileShowcase.n26Title', 'IELTS tayyorgarlik mutlaqo yangi bosqichda')}
          </h2>
          <p className="st-lead">{t('mobileShowcase.n26Subtitle', "Shaxsiy platforma orqali Insholarni sun'iy intellektda baholang, real CDI testlarini topshiring va natijalaringizni bir joyda kuzatib boring.")}</p>

          <div style={{ marginTop: 32 }}>
            <Link to="/level-test" className="st-btn st-btn-fill st-btn-sweep" data-cursor="Start">
              {t('mobileShowcase.n26Btn', 'Bepul daraja testini topshirish')}
              <span className="st-btn-arrow" aria-hidden="true">
                <FaArrowRight style={{ width: '55%', height: '55%' }} />
              </span>
            </Link>
          </div>

          <div className="st-device-badges">
            {badges.map((b) => (
              <div className="st-device-badge" key={b.label}>
                <span className="ic">{b.icon}</span>
                <b>{b.label}</b>
              </div>
            ))}
          </div>
        </div>

        <div className="st-device-stage" ref={stageRef}>
          <div className="st-device-plate" ref={plateRef}>
            <div className="st-device-shadow" aria-hidden="true" />

            {/* chassis */}
            <div className="st-phone">
              <span className="st-phone-speaker" aria-hidden="true" />
              <span className="st-phone-btn st-phone-btn-a" aria-hidden="true" />
              <span className="st-phone-btn st-phone-btn-b" aria-hidden="true" />
              <span className="st-phone-btn st-phone-btn-c" aria-hidden="true" />
              <span className="st-phone-btn st-phone-btn-d" aria-hidden="true" />

              <div className="st-phone-screen">
                <span className="st-phone-island" aria-hidden="true">
                  <span className="st-phone-sensor" />
                  <span className="st-phone-lens" />
                </span>

                {/* status bar */}
                <div className="st-phone-status">
                  <span>{currentTime || '00:00'}</span>
                  <span className="st-phone-icons" aria-hidden="true">
                    <svg viewBox="0 0 17 12" fill="currentColor" width="15" height="11">
                      <rect x="0" y="7.5" width="3" height="4.5" rx="0.8" />
                      <rect x="4.5" y="5" width="3" height="7" rx="0.8" />
                      <rect x="9" y="2.5" width="3" height="9.5" rx="0.8" />
                      <rect x="13.5" y="0" width="3" height="12" rx="0.8" />
                    </svg>
                    <svg viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="15" height="11">
                      <path d="M1.5 3C5 0.8 11 0.8 14.5 3" />
                      <path d="M4.5 6C7 4.5 9 4.5 11.5 6" />
                      <path d="M7.5 9C8.4 8.4 9.6 8.4 10.5 9" />
                    </svg>
                    <span className="st-phone-battery" aria-hidden="true" />
                  </span>
                </div>

                {/* upper card */}
                <div className="st-phone-card st-phone-card-top">
                  <div className="st-phone-hero">
                    <span className="st-phone-kicker">CDI Mock Engine</span>
                    <strong>Optimum IELTS Hub</strong>
                    <span className="st-phone-band">TARGET 8.5</span>
                  </div>
                  <div className="st-phone-bars">
                    {[
                      { label: 'Mock library', v: 96, tone: 'a' },
                      { label: 'CDI simulation', v: 98, tone: 'b' },
                      { label: 'Analytics', v: 94, tone: 'c' },
                    ].map((row) => (
                      <div className="st-phone-bar" key={row.label}>
                        <span>{row.label}</span>
                        <span className="st-phone-track">
                          <i style={{ width: `${row.v}%` }} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* lower card */}
                <div className="st-phone-card st-phone-card-bottom">
                  <div className="st-phone-card-head">
                    <strong>{t('mobileShowcase.studentsTitle', "O'quvchilar Natijalari")}</strong>
                    <button type="button" onClick={scrollToResults}>
                      {t('mobileShowcase.seeAllBtn', 'Barchasi')}
                    </button>
                  </div>
                  <div className="st-phone-students">
                    {students.map((s) => (
                      <div className="st-phone-student" key={s.name}>
                        <img src={s.img} alt={s.name} loading="lazy" />
                        <span className="st-phone-student-meta">
                          <b>{s.name}</b>
                          <small>{s.meta}</small>
                        </span>
                        <span className="st-phone-score">
                          <FaStar /> {s.score}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="st-phone-home" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="st-device-sheen" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
