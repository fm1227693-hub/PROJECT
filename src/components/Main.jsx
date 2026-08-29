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
    const lenis = new Lenis({
      lerp: 0.06, // Super smooth interpolation for that premium heavy float
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // Lenis ni GSAP ScrollTrigger bilan ulash:
    // Lenis scroll eventida ScrollTrigger.update() chaqiriladi
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP ticker orqali Lenis ni yangilash (rAF zanjirida)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove();
    };
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