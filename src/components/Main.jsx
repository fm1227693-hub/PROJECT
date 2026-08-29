import React, { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Home from './home'
import MobileShowcase from './MobileShowcase'
import Sec3 from './Sec3'
import Sec2 from './Sec2'
import Sec4 from './Sec4'
import Sec5 from './Sec5'

export default function Main() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.06, // Super smooth interpolation for that premium heavy float
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <Home />
      <MobileShowcase />
      <Sec3 />
      <Sec2 />
      <Sec4 />
      <Sec5/>
    </div>
  )
}