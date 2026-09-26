import { useTranslation } from 'react-i18next'
import ResultsSlider from './ResultsSlider'

/**
 * ResultsSection — a premium editorial frame around the existing results
 * carousel. The carousel's behaviour and data are untouched.
 */
export default function ResultsSection() {
  const { t } = useTranslation()

  return (
    <section className="st-results">
      <div className="st-shell">
        <div className="st-sec-head">
          <div>
            <span className="st-eyebrow">{t('resultsSlider.badge', 'Natijalar')}</span>
            <h2 className="st-h2" style={{ marginTop: 18 }}>
              {t('resultsSlider.heading', 'Results our learners earned')}
            </h2>
          </div>
          <span className="st-mono" style={{ color: 'var(--text-3)' }}>
            {t('resultsSlider.note', 'Verified certificates')}
          </span>
        </div>
      </div>
      <div className="st-results-shell">
        <ResultsSlider />
      </div>
    </section>
  )
}
