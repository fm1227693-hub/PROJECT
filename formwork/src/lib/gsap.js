import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'

// Register once, import everywhere from here.
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

gsap.defaults({ ease: 'power3.out', duration: 1 })

ScrollTrigger.config({
  // Mobile browsers fire resize when the URL bar collapses; ignore it to avoid jumps.
  ignoreMobileResize: true,
})

export { gsap, ScrollTrigger, ScrollSmoother, SplitText }

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Handy for inspecting triggers in the console during development.
  window.__gsap = gsap
  window.__ScrollTrigger = ScrollTrigger
}
