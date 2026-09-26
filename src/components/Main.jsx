import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Home from './Home'
import Marquee from './premium/Marquee'
import DeviceShowcase from './DeviceShowcase'
import ProcessSection from './ProcessSection'
import ManifestoSection from './ManifestoSection'
import ShowcaseSection from './ShowcaseSection'
import LevelsScroll from './LevelsScroll'
import StatsSection from './StatsSection'
import MentorSection from './MentorSection'
import StudioSection from './StudioSection'
import ResultsSection from './ResultsSection'
import CtaSection from './CtaSection'
import { prefersReducedMotion } from './premium/studioEnv'
import { useTranslation } from 'react-i18next'

gsap.registerPlugin(ScrollTrigger)

export default function Main() {
  const { t } = useTranslation()
  const MARQUEE_ITEMS = [
    t('marquee.m1', 'IELTS 7.5+'),
    t('marquee.m2', 'CDI Mock'),
    t('marquee.m3', 'AI Assessment'),
    t('marquee.m4', 'Speaking Club'),
    t('marquee.m5', 'Real-time feedback'),
  ]

  /* Lenis smooth scrolling + GSAP ticker — scoped to the landing route so the
     rest of the app (timed tests, games, admin) keeps native scrolling. */
  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis

    const refresh = () => ScrollTrigger.refresh()
    if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {})
    const timer = setTimeout(refresh, 400)

    return () => {
      clearTimeout(timer)
      gsap.ticker.remove(tick)
      lenis.destroy()
      delete window.__lenis
      ScrollTrigger.refresh()
    }
  }, [])

  return (
    <div className="st-landing">
      <Home />
      <div id="studio-marquee">
        <Marquee items={MARQUEE_ITEMS} />
      </div>
      <DeviceShowcase />
      <ProcessSection />
      <ManifestoSection />
      <ShowcaseSection />
      <LevelsScroll />
      <StatsSection />
      <MentorSection />
      <StudioSection />
      <ResultsSection />
      <CtaSection />
    </div>
  )
}
