import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './premium/studioEnv'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 6, suffix: '+', key: 'years', labelKey: 'stats.years' },
  { value: 200, suffix: '+', key: 'students', labelKey: 'stats.students' },
  { value: 100, suffix: '+', key: 'mocks', labelKey: 'stats.mocks' },
  { value: 8.5, suffix: '', key: 'band', labelKey: 'stats.band', decimals: 1 },
]

/**
 * StatsSection — editorial data rows. Numbers count up on entry; hovering a
 * cell reveals a restrained technical response (accent bloom + hairline grid).
 */
export default function StatsSection() {
  const { t } = useTranslation()
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const cells = [...root.querySelectorAll('[data-count]')]
    const reduced = prefersReducedMotion()

    const triggers = cells.map((el) => {
      const target = parseFloat(el.dataset.count)
      const decimals = parseInt(el.dataset.decimals || '0', 10)

      if (reduced) {
        el.textContent = target.toFixed(decimals)
        return null
      }

      return ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target,
            duration: 2.1,
            ease: 'expo.out',
            onUpdate: () => {
              el.textContent = obj.v.toFixed(decimals)
            },
          })
        },
      })
    }).filter(Boolean)

    return () => triggers.forEach((tr) => tr.kill())
  }, [])

  return (
    <section className="st-stats" ref={rootRef}>
      <div className="st-shell">
        <div className="st-sec-head">
          <div>
            <span className="st-eyebrow">{t('stats.badge', 'By the numbers')}</span>
            <h2 className="st-h2" style={{ marginTop: 18 }}>
              {t('stats.title', 'Measured, not promised')}
            </h2>
          </div>
          <span className="st-mono" style={{ color: 'var(--text-3)' }}>
            {t('stats.updated', 'Updated 2026')}
          </span>
        </div>

        <div className="st-stats-grid">
          {STATS.map((s, i) => (
            <div className="st-stat" key={s.key}>
              <span className="st-stat-fx" aria-hidden="true">
                <span className="st-stat-grid" />
              </span>
              <span className="st-stat-k">{String(i + 1).padStart(2, '0')} / Metric</span>
              <div className="st-stat-n">
                <span data-count={s.value} data-decimals={s.decimals || 0}>
                  0
                </span>
                {s.suffix ? <sup>{s.suffix}</sup> : null}
              </div>
              <p className="st-stat-l">{t(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
