'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setScroll } from '@/lib/scroll';
import { isReducedMotion } from '@/lib/motion';
import { whenBooted } from '@/lib/boot';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — owns the single Lenis instance.
 *
 * Scroll physics here are deliberately weighted rather than floaty: one lerp
 * value on desktop, a tighter one on touch, and no inertia multiplier that
 * would make the reader fight the page. Lenis is driven by GSAP's ticker (one
 * RAF for the whole site) and ScrollTrigger reads the position on the same
 * frame, so scrubbed tweens never lag a beat behind.
 *
 * The position is published to a module-level bus, so per-frame consumers
 * (WebGL depth) never touch React state.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = isReducedMotion();

    const sync = () =>
      setScroll(window.scrollY || root.scrollTop || 0, root.scrollHeight - window.innerHeight);
    sync();

    // Reduced motion: no smoothing at all, but the bus still gets fed.
    if (reduced) {
      const onScroll = () => sync();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }

    const coarse = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    let lenis;
    try {
      lenis = new Lenis({
        lerp: coarse ? 0.14 : 0.085,
        wheelMultiplier: 1,
        touchMultiplier: 1.15,
        smoothWheel: true,
        infinite: false,
      });
    } catch {
      // If Lenis fails to init the page still scrolls natively.
      return undefined;
    }

    window.nebulaLenis = lenis;

    // The preloader owns the first frames; do not let it scroll behind us.
    if (root.classList.contains('is-locked')) lenis.stop();
    const cancelBoot = whenBooted(() => {
      if (!document.documentElement.classList.contains('is-locked')) lenis.start();
    });

    // One RAF for the whole site: Lenis advances, then ScrollTrigger reads the
    // position. Updating on the ticker (instead of only on Lenis' scroll event)
    // means a jump that never animates — an anchor link, a focus move, a
    // resize — still settles every scrubbed tween on the next frame.
    const raf = (time) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onScroll = (instance) => {
      setScroll(instance.scroll, root.scrollHeight - window.innerHeight, instance.velocity);
    };
    lenis.on('scroll', onScroll);

    const onResize = () => sync();
    window.addEventListener('resize', onResize);

    // Late layout (images, webfonts) changes document height — refresh once the
    // page has settled and again after fonts load.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      cancelBoot();
      gsap.ticker.remove(raf);
      lenis.off('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      lenis.destroy();
      delete window.nebulaLenis;
    };
  }, []);

  return null;
}
