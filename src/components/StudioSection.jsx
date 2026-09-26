import { useTranslation } from 'react-i18next'
import { FaBullseye, FaChalkboardTeacher, FaMapMarkerAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

/**
 * StudioSection — the studio story, told as an editorial two-column spread
 * with a depth-shifting photograph instead of a decorative card.
 */
export default function StudioSection() {
  const { t } = useTranslation()

  const blocks = [
    { icon: <FaBullseye />, title: t('about.goalTitle', 'Bizning maqsadimiz'), desc: t('about.goalDesc', 'Har bir o‘quvchiga sifatli ta’lim berish va uning kelajakdagi muvaffakiyati uchun poydevor yaratish.') },
    { icon: <FaChalkboardTeacher />, title: t('about.teacherTitle', 'Malakali o’qituvchilar'), desc: t('about.teacherDesc', 'Xalqaro sertifikatlarga va ko‘p yillik tajribaga ega professional o’qituvchilar jamoasi.') },
  ]

  return (
    <section className="st-studio">
      <div className="st-shell">
        <div className="st-manifesto-grid">
          <div>
            <span className="st-eyebrow">{t('about.badge', 'Biz haqimizda')}</span>
            <p className="st-mono" style={{ marginTop: 16, color: 'var(--text-3)' }}>
              {t('about.locationBadge', 'Buxoro, O‘zbekiston')}
            </p>
          </div>

          <div>
            <h2 className="st-h2">
              {t('about.titlePart1', 'Ingliz tilini zamonaviy va ')}
              <em className="st-italic" style={{ color: 'var(--accent)' }}>
                {t('about.titleHighlight', 'oson usullarda')}
              </em>
              {t('about.titleEnd', " o'rgatamiz.")}
            </h2>
            <p className="st-lead" style={{ marginTop: 26 }}>
              {t('about.description', "Optimum School of English jamoasi til o'rganish jarayonini zerikarli yodlashdan xalos qilib, real muloqotga asoslangan qiziqarli muhitni taklif etadi.")}
            </p>

            <div className="st-studio-blocks">
              {blocks.map((b) => (
                <div className="st-studio-block" key={b.title}>
                  <span className="st-studio-block-ic">{b.icon}</span>
                  <div>
                    <h3>{b.title}</h3>
                    <p>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/about" className="st-btn st-btn-line st-btn-sweep" data-cursor="About" style={{ marginTop: 30 }}>
              {t('about.more', 'Batafsil')}
            </Link>
          </div>
        </div>

        <figure className="st-studio-figure">
          <img
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop"
            alt={t('about.imageAlt', 'Optimum study environment')}
            loading="lazy"
          />
          <figcaption>
            <span className="st-mono">{t('about.badge', 'Biz haqimizda')}</span>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Maps"
            >
              <FaMapMarkerAlt /> {t('footer.address', 'Buxoro sh., Namozgoh ko‘chasi')}
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
