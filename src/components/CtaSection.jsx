import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton, { ArrowIcon } from './premium/MagneticButton'
import { SplitText } from './premium/Text'
import useSplitReveal from './premium/useSplitReveal'
import { prefersReducedMotion } from './premium/studioEnv'

gsap.registerPlugin(ScrollTrigger)

/**
 * CtaSection — the closing scene: huge type over a dark field with a single
 * slowly breathing light source and one magnetic call to action.
 */
export default function CtaSection() {
  const { t } = useTranslation()
  const rootRef = useRef(null)
  const glowRef = useRef(null)
  useSplitReveal(rootRef)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow || prefersReducedMotion()) return undefined

    const trigger = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        gsap.set(glow, { y: -self.progress * 180, scale: 1 + self.progress * 0.12 })
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section className="st-cta" ref={rootRef}>
      <span className="st-cta-glow" ref={glowRef} aria-hidden="true" />
      <span className="st-cta-rule" aria-hidden="true" />

      <div className="st-shell">
        <span className="st-eyebrow" style={{ color: 'rgba(242,239,233,0.55)' }}>
          {t('cta.badge', 'Next step')}
        </span>

        <SplitText
          tag="h2"
          className="st-cta-title"
          lineClass=""
          lines={[
            { text: t('cta.line1', 'Have an idea?') },
            { text: t('cta.line2', "Let's make it real."), em: true },
          ]}
          style={{ marginTop: 24 }}
        />

        <div className="st-cta-row">
          <p>
            {t(
              'cta.body',
              "We partner with students, schools and teams who want to push what's possible. Tell us your target band and we will build the path to it."
            )}
          </p>
          <MagneticButton to="/form" className="st-cta-btn" cursor="Start">
            {t('cta.button', 'Start a project')}
            <ArrowIcon />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
