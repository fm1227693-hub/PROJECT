/* =====================================================================
   CORE / VENDOR
   Single place where the classic-script globals (GSAP, ScrollTrigger,
   Lenis) are picked up, so every module imports them the same way and we
   can fail loudly + degrade gracefully if a CDN is blocked.
   ===================================================================== */
export const gsap = window.gsap || null;
export const ScrollTrigger = window.ScrollTrigger || null;
export const LenisCtor = window.Lenis || null;

export const VENDOR_OK = !!(gsap && ScrollTrigger && LenisCtor);

if (VENDOR_OK) {
  gsap.registerPlugin(ScrollTrigger);
  /* one shared ticker for everything: Lenis, ScrollTrigger, DOM animation
     and the WebGL loop all run from this single rAF. */
  gsap.ticker.lagSmoothing(0);
}

export function requireVendor() {
  if (!VENDOR_OK) throw new Error('motion-stack-missing');
  return { gsap, ScrollTrigger, LenisCtor };
}
