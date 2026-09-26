import { useTranslation } from 'react-i18next'
import { RevealWords } from './premium/Text'

/**
 * ManifestoSection — cinematic scroll-driven typography.
 * Words resolve from low contrast to full contrast as the section passes;
 * the emphasised words land in the accent colour.
 */
export default function ManifestoSection() {
  const { t, i18n } = useTranslation()

  const text = t(
    'manifesto.text',
    "We started from one observation: most language centres and platforms either drill grammar until it dies, or promise shortcuts that never arrive. Our approach joins a serious method to an environment people actually want to spend time in. Real conversation, honest feedback, measurable progress — every single week."
  )

  const accent = t('manifesto.accent', 'conversation, feedback, measurable, progress')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <section className="st-manifesto">
      <div className="st-shell st-manifesto-grid">
        <div>
          <span className="st-eyebrow">{t('manifesto.badge', 'Manifesto')}</span>
          <p className="st-mono" style={{ marginTop: 16, color: 'var(--text-3)' }}>
            {(i18n.language || 'uz').toUpperCase()} / {t('manifesto.code', 'Statement 01')}
          </p>
        </div>
        <RevealWords text={text} accent={accent} className="st-manifesto-text" />
      </div>
    </section>
  )
}
