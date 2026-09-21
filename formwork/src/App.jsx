import { useLayoutEffect, useRef } from 'react'
import SmoothScrollProvider from './context/SmoothScrollProvider'
import { useScroll } from './context/scroll'
import { ScrollTrigger } from './lib/gsap'
import { initSectionThemes } from './animations/scrollAnimations'

import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'

import HeroSection from './sections/HeroSection'
import IntroSection from './sections/IntroSection'
import ShowcaseSection from './sections/ShowcaseSection'
import TypographySection from './sections/TypographySection'
import VisualSection from './sections/VisualSection'
import InteractiveSection from './sections/InteractiveSection'
import StudioSection from './sections/StudioSection'
import FinalCTA from './sections/FinalCTA'
import FooterSection from './sections/FooterSection'

function Page() {
  const ref = useRef(null)
  const { caps } = useScroll()

  // Runs after every section has registered its own triggers (children first).
  useLayoutEffect(() => {
    const cleanup = initSectionThemes(ref.current)
    if (caps.reduced) document.documentElement.classList.add('reduced-motion')
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      cleanup()
      cancelAnimationFrame(raf)
      window.removeEventListener('load', onLoad)
    }
  }, [caps.reduced])

  return (
    <main id="main" ref={ref}>
      <HeroSection />
      <IntroSection />
      <ShowcaseSection />
      <TypographySection />
      <VisualSection />
      <InteractiveSection />
      <StudioSection />
      <FinalCTA />
      <FooterSection />
    </main>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider
      fixed={
        <>
          <Navbar />
          <CustomCursor />
        </>
      }
    >
      <Page />
    </SmoothScrollProvider>
  )
}
