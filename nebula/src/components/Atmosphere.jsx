'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap } from '@/lib/animations';
import { subscribePointer } from '@/lib/pointer';
import { isFinePointer, isReducedMotion } from '@/lib/motion';

registerGsap();

/**
 * Atmosphere — one fixed stack that gives the whole page its weather.
 *
 * A base gradient field, one tone layer per act (cross-faded by `data-tone`,
 * which sections flip through ScrollTrigger), a pointer-tracked key light and
 * the edge vignette. Nothing here animates layout: the tone layers transition
 * opacity, the light rides a single quickTo on transform.
 */
export default function Atmosphere() {
  const lightRef = useRef(null);
  const horizonRef = useRef(null);

  // One warm band low in the frame that climbs and brightens as the document
  // descends: the whole page shares a single light source that moves with you,
  // which is what makes separate sections read as one continuous space.
  useEffect(() => {
    const horizon = horizonRef.current;
    if (!horizon || isReducedMotion()) return undefined;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress;
        horizon.style.transform = `translate3d(0, ${(-p * 46).toFixed(2)}%, 0)`;
        horizon.style.opacity = (0.45 + p * 0.55).toFixed(3);
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (isReducedMotion() || !isFinePointer()) return undefined;
    const light = lightRef.current;
    if (!light) return undefined;

    const xTo = gsap.quickTo(light, 'x', { duration: 1.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(light, 'y', { duration: 1.5, ease: 'power3.out' });
    let lastX = -9999;
    let lastY = -9999;

    const off = subscribePointer((p) => {
      // Skip a frame when the pointer is idle: no tweens, no work.
      if (Math.abs(p.x - lastX) < 1.5 && Math.abs(p.y - lastY) < 1.5) return;
      lastX = p.x;
      lastY = p.y;
      xTo(p.x);
      yTo(p.y);
    });

    return () => {
      off();
      xTo.tween?.kill();
      yTo.tween?.kill();
    };
  }, []);

  return (
    <>
      <div className="atmos" aria-hidden="true">
        <div className="atmos__base" />
        <div className="atmos__tone atmos__tone--hero" />
        <div className="atmos__tone atmos__tone--capabilities" />
        <div className="atmos__tone atmos__tone--work" />
        <div className="atmos__tone atmos__tone--engine" />
        <div className="atmos__tone atmos__tone--contact" />
        <div ref={horizonRef} className="atmos__horizon" aria-hidden="true" />
        <div ref={lightRef} className="atmos__light" />
      </div>
      <div className="vignette" aria-hidden="true" />
      <div className="frame" aria-hidden="true">
        <span className="frame__tick frame__tick--tl" />
        <span className="frame__tick frame__tick--tr" />
        <span className="frame__tick frame__tick--bl" />
        <span className="frame__tick frame__tick--br" />
      </div>
    </>
  );
}
