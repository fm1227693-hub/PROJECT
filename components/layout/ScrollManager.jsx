"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Keeps scroll position and ScrollTrigger measurements correct across client
 * navigations — and re-measures once after fonts and lazy charts have settled.
 *
 * Reads the hash/search from `window.location` directly so this component never
 * forces a Suspense boundary on every statically generated page.
 */
export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const { hash } = window.location;
    if (hash && hash.length > 1) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
        return undefined;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
