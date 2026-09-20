import { useEffect } from 'react'
import { ScrollTrigger, useGSAP } from './lib/gsap'
import { SmoothScrollProvider, SmoothContent } from './context/SmoothScrollContext'
import { useSmoothScroll } from './context/smoothScroll'
import { createThemeTriggers } from './animations/scrollAnimations'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import HeroSection from './sections/HeroSection'
import IntroSection from './sections/IntroSection'
import ShowcaseSection from './sections/ShowcaseSection'
import TypographySection from './sections/TypographySection'
import VisualSection from './sections/VisualSection'
import InteractiveSection from './sections/InteractiveSection'
import FinalCTA from './sections/FinalCTA'
import FooterSection from './sections/FooterSection'

/**
 * The page itself. Mounted only once fonts and the smoother are ready,
 * so this effect runs after every section has registered its triggers.
 */
function Page() {
  const { ready, scrollTo } = useSmoothScroll()

  useGSAP(
    () => {
      createThemeTriggers()
      ScrollTrigger.refresh()
    },
    { dependencies: [ready] },
  )

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  // Every in-page anchor scrolls smoothly through the smoother.
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]')
      if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const hash = link.getAttribute('href')
      if (!hash || hash === '#') return
      e.preventDefault()
      const target = document.querySelector(hash)
      if (target) scrollTo(target, 0)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scrollTo])

  return (
    <>
      <main id="main">
        <HeroSection />
        <IntroSection />
        <ShowcaseSection />
        <TypographySection />
        <VisualSection />
        <InteractiveSection />
        <FinalCTA />
      </main>
      <FooterSection />
    </>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <SmoothContent>
        <Page />
      </SmoothContent>
      <CustomCursor />
    </SmoothScrollProvider>
  )
}
