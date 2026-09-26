import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { isCoarsePointer } from './premium/studioEnv'

/**
 * ProcessSection — the enrolment path as an editorial numbered index.
 * Each row is a real touch target with a directional hover response.
 */
export default function ProcessSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const steps = [
    {
      n: '01',
      title: t('steps.step1Title', "Ro'yxatdan o'ting"),
      desc: t('steps.step1Desc', 'Sayt orqali ro\u2019yxatdan o\u2019tib, o\u2019quv jarayonini boshlang'),
      to: '/register',
      cursor: 'Register',
    },
    {
      n: '02',
      title: t('steps.step2Title', 'Darajangizni aniqlang'),
      desc: t('steps.step2Desc', "40 ta savoldan iborat test orqali ingliz tili darajangizni bilib oling"),
      to: '/level-test',
      cursor: 'Test',
    },
    {
      n: '03',
      title: t('steps.step3Title', 'Kursni tanlang'),
      desc: t('steps.step3Desc', 'Darajangizga mos tarifni ko\u2019rib chiqing va bog\u2019laning'),
      to: '/pricing',
      cursor: 'Pricing',
    },
  ]

  return (
    <section className="st-process">
      <div className="st-shell">
        <div className="st-process-head">
          <span className="st-eyebrow">{t('steps.badge', 'Qanday ishlaydi')}</span>
          <h2 className="st-h2" style={{ margin: '18px 0 16px' }}>
            {t('steps.title', '3 oddiy qadamda boshlang')}
          </h2>
          <p className="st-lead">{t('steps.description', 'Kursimizga yozilish uchun quyidagi qadamlarni bajaring')}</p>
        </div>

        <div className="st-process-list">
          {steps.map((s) => (
            <button
              type="button"
              className="st-step"
              key={s.n}
              onClick={() => navigate(s.to)}
              data-cursor={s.cursor}
              aria-label={s.title}
            >
              <span className="st-step-idx">{s.n}</span>
              <span className="st-step-title">{s.title}</span>
              <span className="st-step-desc">{s.desc}</span>
              <span className="st-step-go" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <p className="st-mono" style={{ marginTop: 28, color: 'var(--text-3)' }}>
          {isCoarsePointer() ? t('steps.tapHint', 'Bosib davom eting') : t('steps.hoverHint', 'Hover to explore')}
        </p>
      </div>
    </section>
  )
}
