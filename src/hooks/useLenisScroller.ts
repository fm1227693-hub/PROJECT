/**
 * LUSION — useLenisScroller — Legacy wrapper now points to singleton driver
 * Prevents double Lenis instances that caused lag
 */

import { useEffect } from 'react'
import useLenisScrubDriver from './useLenisScrubDriver'

export default function useLenisScroller() {
  const driver = useLenisScrubDriver({
    lerp: 0.08,
    wheelMultiplier: 0.9,
    smoothWheel: true,
    infinite: false,
  })

  // Legacy compatibility: already emits lusion-scroll via driver
  useEffect(() => {
    // No-op, driver handles everything
  }, [])

  return {
    lenis: driver.lenis,
    scrollProgress: driver.scrollProgress,
    scrollTo: driver.scrollTo,
  }
}
