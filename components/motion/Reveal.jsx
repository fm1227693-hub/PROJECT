"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion, scrollReveal, wipeReveal } from "@/lib/gsap";
import { useGsap } from "@/lib/hooks/useGsap";

/**
 * <Reveal> — the single scroll-entrance primitive.
 *
 * Wraps GSAP ScrollTrigger inside a gsap.context (auto-reverted on unmount) and
 * carries a safety net: if anything prevents the trigger from firing, the
 * content is forced visible after 1.6s. No section can ever stay invisible.
 */
export default function Reveal({
  as: Tag = "div",
  children,
  className,
  variant = "up",
  delay = 0,
  stagger = 0.08,
  y = 20,
  duration = 0.62,
  start = "top 88%",
  selector,
  style,
  ...props
}) {
  const ref = useRef(null);

  useGsap(() => {
    const root = ref.current;
    if (!root) return;

    if (variant === "wipe") {
      wipeReveal(root, { duration: duration + 0.2, delay });
      return;
    }

    const targets = variant === "stagger" ? (selector ? root.querySelectorAll(selector) : root.children) : root;
    if (!targets || !targets.length) return;

    scrollReveal(targets, {
      trigger: root,
      start,
      delay,
      y,
      duration,
      stagger: variant === "stagger" ? stagger : 0,
      scale: variant === "scale" ? 0.97 : undefined,
      once: true,
    });
  }, ref, []);

  /* Safety net — guarantees content is never left hidden. */
  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return undefined;
    const id = window.setTimeout(() => {
      const root = ref.current;
      if (!root) return;
      const nodes = variant === "stagger" ? Array.from(root.children) : [root];
      nodes.forEach((node) => {
        if (!node || node.nodeType !== 1) return;
        if (parseFloat(window.getComputedStyle(node).opacity) < 0.9) {
          gsap.set(node, { clearProps: "opacity,transform" });
        }
      });
    }, 1600);
    return () => window.clearTimeout(id);
  }, [variant]);

  return (
    <Tag ref={ref} className={cn(className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

/**
 * <SplitLines> — headline reveal. Each child is a line, clipped by an
 * overflow-hidden wrapper and translated up on entrance (transform only).
 */
export function SplitLines({ lines = [], className, lineClassName, as: Tag = "h1", delay = 0.1, stagger = 0.09 }) {
  const ref = useRef(null);

  useGsap(() => {
    const nodes = ref.current?.querySelectorAll("[data-line]");
    if (!nodes?.length) return;
    if (prefersReducedMotion()) {
      gsap.set(nodes, { yPercent: 0, opacity: 1 });
      return;
    }
    gsap.fromTo(
      nodes,
      { yPercent: 108, opacity: 0.001 },
      { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out", stagger, delay },
    );
  }, ref, []);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return undefined;
    const id = window.setTimeout(() => {
      const nodes = ref.current?.querySelectorAll("[data-line]");
      nodes?.forEach((node) => gsap.set(node, { clearProps: "transform,opacity" }));
    }, 2200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden pb-[0.08em]">
          <span data-line className={cn("block will-change-transform", lineClassName)}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Staggered entrance for a grid of cards, on mount (no scroll dependency). */
export function StaggerIn({ children, className, as: Tag = "div", stagger = 0.06, y = 16, delay = 0 }) {
  const ref = useRef(null);

  useGsap(() => {
    const nodes = ref.current?.children;
    if (!nodes?.length) return;
    if (prefersReducedMotion()) {
      gsap.set(nodes, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      nodes,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger, delay },
    );
  }, ref, []);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return undefined;
    const id = window.setTimeout(() => {
      Array.from(ref.current?.children ?? []).forEach((node) => gsap.set(node, { clearProps: "opacity,transform" }));
    }, 1600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
