"use client";

/**
 * PRISMA motion system.
 *
 * A thin, dependency-light wrapper around GSAP. Every helper:
 *   • animates only `transform` / `opacity` / `clip-path` (compositor friendly)
 *   • honours `prefers-reduced-motion` by jumping to the end state
 *   • returns the tween/timeline/context so the caller can `.kill()` it
 *
 * Always create animations through `useGsap()` (see lib/hooks/useGsap.js) so
 * ScrollTriggers and tweens are reverted on unmount — no leaks.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsReady = false;

export function ensurePlugins() {
  if (!pluginsReady && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out", duration: 0.6 });
    ScrollTrigger.config({ ignoreMobileResize: true });
    pluginsReady = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Resolve the end state instantly instead of animating. */
function settle(targets, vars) {
  return gsap.set(targets, {
    clearProps: "transform,opacity,filter,clipPath",
    ...vars,
    opacity: vars?.opacity ?? 1,
  });
}

/* ------------------------------------------------------------------ *
 * Core entrance helpers
 * ------------------------------------------------------------------ */

/** Soft upward fade — the workhorse of the whole product. */
export function fadeUp(targets, opts = {}) {
  const { y = 18, duration = 0.6, delay = 0, ease = "power3.out", ...rest } = opts;
  if (!targets || prefersReducedMotion()) return settle(targets);
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, ease, ...rest },
  );
}

export function fadeIn(targets, opts = {}) {
  const { duration = 0.45, delay = 0, ease = "power2.out", ...rest } = opts;
  if (!targets || prefersReducedMotion()) return settle(targets);
  return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, duration, delay, ease, ...rest });
}

/** Staggered card / list reveal. */
export function staggerReveal(targets, opts = {}) {
  const {
    y = 20,
    duration = 0.55,
    stagger = 0.07,
    delay = 0,
    ease = "power3.out",
    ...rest
  } = opts;
  if (!targets || prefersReducedMotion()) return settle(targets);
  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, delay, ease, ...rest },
  );
}

export function scaleReveal(targets, opts = {}) {
  const { scale = 0.96, y = 12, duration = 0.6, delay = 0, ease = "power3.out", ...rest } = opts;
  if (!targets || prefersReducedMotion()) return settle(targets);
  return gsap.fromTo(
    targets,
    { opacity: 0, scale, y },
    { opacity: 1, scale: 1, y: 0, duration, delay, ease, ...rest },
  );
}

/**
 * Line-by-line headline reveal. Pass a container whose direct children are the
 * lines (each wrapped in an `overflow-hidden` element by the caller or by
 * <SplitLines/>). Uses clip-path + transform only.
 */
export function textReveal(lines, opts = {}) {
  const { y = "105%", duration = 0.85, stagger = 0.09, ease = "power4.out", delay = 0 } = opts;
  if (!lines || prefersReducedMotion()) return settle(lines);
  return gsap.fromTo(
    lines,
    { yPercent: 105, opacity: 0.001 },
    { yPercent: 0, opacity: 1, duration, stagger, ease, delay },
  );
}

/** Horizontal clip wipe — used for section rules and the prism accent line. */
export function wipeReveal(targets, opts = {}) {
  const { duration = 0.9, ease = "power3.inOut", from = "left", delay = 0 } = opts;
  if (!targets || prefersReducedMotion()) return settle(targets);
  const start =
    from === "left" ? "inset(0 100% 0 0)" : from === "right" ? "inset(0 0 0 100%)" : "inset(0 0 100% 0)";
  return gsap.fromTo(
    targets,
    { clipPath: start },
    { clipPath: "inset(0 0% 0 0%)", duration, ease, delay },
  );
}

/* ------------------------------------------------------------------ *
 * Data helpers
 * ------------------------------------------------------------------ */

/** Animate a bar/meter fill from 0 to `value` (0–100). Uses scaleX/width. */
export function progressReveal(targets, value = 0, opts = {}) {
  const { duration = 0.9, ease = "power3.out", delay = 0, useWidth = true } = opts;
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  if (!targets || prefersReducedMotion()) {
    return gsap.set(targets, useWidth ? { width: `${v}%` } : { scaleX: v / 100 });
  }
  return gsap.fromTo(
    targets,
    useWidth ? { width: "0%" } : { scaleX: 0, transformOrigin: "left center" },
    useWidth
      ? { width: `${v}%`, duration, ease, delay }
      : { scaleX: v / 100, duration, ease, delay },
  );
}

/** Animate an SVG circle's stroke-dashoffset to represent `value` percent. */
export function radialReveal(target, value = 0, circumference = 0, opts = {}) {
  const { duration = 1.1, ease = "power3.out", delay = 0 } = opts;
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const offset = circumference * (1 - v / 100);
  if (!target || prefersReducedMotion()) {
    return gsap.set(target, { strokeDashoffset: offset });
  }
  return gsap.fromTo(
    target,
    { strokeDashoffset: circumference },
    { strokeDashoffset: offset, duration, ease, delay },
  );
}

/**
 * Smooth integer count-up written straight to textContent (no React re-render).
 * Returns the tween; `opts.format` shapes the output.
 */
export function countUp(target, to = 0, opts = {}) {
  const {
    duration = 1.1,
    ease = "power2.out",
    delay = 0,
    decimals = 0,
    prefix = "",
    suffix = "",
    from = 0,
  } = opts;

  const write = (el, value) => {
    if (!el) return;
    el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
  };

  const nodes = target?.length !== undefined && typeof target !== "string" ? Array.from(target) : [target];
  const els = nodes.filter(Boolean);
  if (!els.length) return null;

  if (prefersReducedMotion()) {
    els.forEach((el) => write(el.nodeType ? el : el, Number(to)));
    return null;
  }

  const proxy = { v: Number(from) || 0 };
  // Paint the start value immediately so there is no flash of the final number.
  els.forEach((el) => write(el, proxy.v));

  return gsap.to(proxy, {
    v: Number(to) || 0,
    duration,
    ease,
    delay,
    onUpdate: () => els.forEach((el) => write(el, proxy.v)),
    onComplete: () => els.forEach((el) => write(el, Number(to) || 0)),
  });
}

/* ------------------------------------------------------------------ *
 * Scroll helpers
 * ------------------------------------------------------------------ */

/** Reveal once when the element scrolls into view. */
export function scrollReveal(targets, opts = {}) {
  const {
    trigger,
    start = "top 85%",
    end,
    once = true,
    y = 22,
    duration = 0.65,
    stagger = 0.06,
    delay = 0,
    ease = "power3.out",
    scale,
    scrub = false,
    onEnter,
    ...rest
  } = opts;

  if (!targets) return null;

  if (prefersReducedMotion()) {
    settle(targets);
    onEnter?.();
    return null;
  }

  ensurePlugins();

  const vars = { opacity: 0, y, duration, ease, delay, ...rest };
  if (scale !== undefined) vars.scale = scale;

  if (scrub) {
    return gsap.fromTo(targets, vars, {
      opacity: 1,
      y: 0,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: trigger || (targets.length ? targets[0] : targets),
        start,
        end: end || "bottom 40%",
        scrub: typeof scrub === "number" ? scrub : 0.6,
      },
    });
  }

  return gsap.fromTo(targets, vars, {
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: stagger || 0,
    scrollTrigger: {
      trigger: trigger || (targets.length ? targets[0] : targets),
      start,
      once,
      onEnter: () => onEnter?.(),
    },
  });
}

/** Subtle parallax — transform only, capped so it never feels gimmicky. */
export function parallax(target, opts = {}) {
  const { distance = 40, trigger, start = "top bottom", end = "bottom top", scrub = 0.8 } = opts;
  if (!target || prefersReducedMotion()) return null;
  ensurePlugins();
  return gsap.fromTo(
    target,
    { y: -distance / 2 },
    {
      y: distance / 2,
      ease: "none",
      scrollTrigger: { trigger: trigger || target, start, end, scrub },
    },
  );
}

/* ------------------------------------------------------------------ *
 * Micro-interactions (hover elevation, tap feedback)
 * ------------------------------------------------------------------ */

export function hoverLift(targets, opts = {}) {
  const { y = -3, scale = 1.008, duration = 0.35 } = opts;
  if (!targets || prefersReducedMotion()) return null;
  const nodes = typeof targets === "string" ? gsap.utils.toArray(targets) : gsap.utils.toArray(targets);
  const cleanups = nodes.map((el) => {
    const enter = () => gsap.to(el, { y, scale, duration, ease: "power2.out", overwrite: "auto" });
    const leave = () => gsap.to(el, { y: 0, scale: 1, duration, ease: "power2.out", overwrite: "auto" });
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
    };
  });
  return () => cleanups.forEach((fn) => fn());
}

/** Kill every ScrollTrigger inside a scope — used by useGsap cleanup. */
export function killTriggersIn(scope) {
  if (typeof window === "undefined") return;
  ensurePlugins();
  ScrollTrigger.getAll()
    .filter((st) => !scope || (st.trigger && scope.contains(st.trigger)))
    .forEach((st) => st.kill());
}
