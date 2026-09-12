"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { gsap, ensurePlugins, ScrollTrigger } from "@/lib/gsap";

/**
 * Create GSAP work inside a `gsap.context()` that is automatically reverted on
 * unmount (tweens + ScrollTriggers). This is the only sanctioned way to start
 * animations in this codebase — it guarantees zero animation leaks.
 *
 * @param {(ctx: import('gsap').Context) => void} setup  animation factory
 * @param {import('react').RefObject<HTMLElement>} scopeRef  element that scopes selectors
 * @param {any[]} deps  re-run dependencies
 */
export function useGsap(setup, scopeRef, deps = []) {
  const savedSetup = useRef(setup);
  savedSetup.current = setup;

  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;
    ensurePlugins();

    const scope = scopeRef?.current ?? undefined;
    const ctx = gsap.context(() => savedSetup.current?.(ctx), scope);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}

/**
 * Convenience wrapper: run one entrance timeline as soon as the component
 * mounts. Selector strings resolve inside `scopeRef`.
 */
export function useEntrance(build, scopeRef, deps = []) {
  return useGsap(build, scopeRef, deps);
}

/** Refresh ScrollTrigger positions after fonts/images settle. */
export function useScrollRefresh(deps = []) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const id = window.setTimeout(() => {
      ensurePlugins();
      ScrollTrigger.refresh();
    }, 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
