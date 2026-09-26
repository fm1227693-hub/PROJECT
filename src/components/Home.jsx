import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroScene from './premium/HeroScene'
import MagneticButton, { ArrowIcon } from './premium/MagneticButton'
import { SplitText } from './premium/Text'
import useSplitReveal from './premium/useSplitReveal'
import { isCoarsePointer, prefersReducedMotion } from './premium/studioEnv'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  useSplitReveal(rootRef, { immediate: true, delay: 0.12, stagger: 0.1 })

  /* hero exit choreography: content drifts and dissolves as the page moves on */
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return undefined

    const inner = root.querySelector('.st-hero-inner')
    if (!inner) return undefined

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(inner, { y: -p * 90, opacity: 1 - p * 1.15 })
      },
    })

    return () => trigger.kill()
  }, [])

  const scrollNext = () => {
    const next = document.getElementById('studio-marquee')
    if (next) {
      const top = next.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <section className="st-hero" ref={rootRef}>
      <HeroScene />
      <div className="st-hero-veil" aria-hidden="true" />

      <div className="st-shell st-hero-inner">
        <div className="st-hero-top">
          <span className="st-eyebrow">{t('home.badge', 'Optimum School of English')}</span>
          <span className="st-mono st-hero-status">
            <span className="dot" />
            {t('home.heroStatus', 'Enrolment open — 2026')}
          </span>
        </div>

        <div className="st-hero-main">
        <SplitText
          tag="h1"
          className="st-hero-title"
          lines={[
            { text: t('home.titlePrefix', "Ingliz tilini noldan") },
            { text: t('home.titleHighlight', "mukammallikkacha o'rganing"), em: true },
          ]}
        />

        <div className="st-hero-foot">
          <p className="st-hero-lead" data-hero-fade>
            {t('home.description', "Professional o'qituvchilar, jonli suhbat klublari va xalqaro standartlarga asoslangan intensiv kurslarimizga hoziroq qo'shiling.")}
          </p>
          <div className="st-hero-actions" data-hero-fade>
            <MagneticButton to="/form" cursor="Enroll">
              {t('home.enrollBtn', 'Bepul darsga yozilish')}
              <ArrowIcon />
            </MagneticButton>
            <MagneticButton to="/about" variant="line" cursor="About">
              {t('home.moreInfoBtn', "Batafsil ma'lumot")}
            </MagneticButton>
          </div>
        </div>

        <div className="st-hero-meta" data-hero-fade>
          <div className="st-mono st-hero-meta-tags">
            <span>IELTS 7.5+</span>
            <span>CDI Mock</span>
            <span>AI Assessment</span>
            <span>Speaking clubs</span>
          </div>
          <button type="button" className="st-mono st-scroll-cue" onClick={scrollNext}>
            <span className="rail" aria-hidden="true" />
            {isCoarsePointer() ? t('home.swipe', 'Swipe') : t('home.scroll', 'Scroll')}
          </button>
        </div>
        </div>
      </div>
    </section>
  )
}
