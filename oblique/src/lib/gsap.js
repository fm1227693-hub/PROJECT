import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

// Register once for the whole app. Every module imports gsap from here.
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 1 })

ScrollTrigger.config({
  // Mobile browsers resize the viewport when the address bar collapses;
  // refreshing every time causes visible jumps, so we ignore it.
  ignoreMobileResize: true,
})

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, useGSAP }
