import React, { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Home from './home'
import MobileShowcase from './MobileShowcase'
import LevelsScroll from './LevelsScroll'
import Sec3 from './Sec3'
import Sec2 from './Sec2'
import Sec4 from './Sec4'
import Sec5 from './Sec5'

// GSAP ScrollTrigger ro'yxatdan o'tkazish
gsap.registerPlugin(ScrollTrigger);

export default function Main() {
  useEffect(() => {
    // Lenis smooth scroll and GSAP ScrollTrigger ticker removed to prevent site freezing
  }, []);

  return (
    <div className="">
      <Home />
      <MobileShowcase />
      {/* 🎓 Kurslar darajalari: pinned horizontal scroll effekti 🎓 */}
      <LevelsScroll />
      <Sec3 />
      <Sec2 />
      <Sec4 />
      <Sec5/>
    </div>
  )
}