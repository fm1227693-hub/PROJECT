"use client";

import { useEffect, useState } from "react";
import { cn, clamp } from "@/lib/utils";
import { TONE_CLASSES } from "@/lib/data/brand";
import { useInViewOnce, useReducedMotion } from "@/lib/hooks/useMotion";

/**
 * Meter that fills once, on first view. Uses `transform: scaleX()` — compositor
 * only, no layout thrash, no continuous animation.
 */
export default function ProgressBar({
  value = 0,
  tone,
  size = "md",
  showValue = false,
  label,
  marker,
  className,
  delay = 0,
  striped = false,
}) {
  const [ref, inView] = useInViewOnce({ threshold: 0.25 });
  const reduced = useReducedMotion();
  const v = clamp(Number(value) || 0, 0, 100);
  const resolvedTone = tone ?? (v >= 80 ? "strong" : v >= 60 ? "developing" : "risk");
  const toneClasses = TONE_CLASSES[resolvedTone] ?? TONE_CLASSES.neutral;

  const heights = { xs: "h-1", sm: "h-1.5", md: "h-2", lg: "h-3" };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label ? <span className="truncate text-[13px] text-ink-soft">{label}</span> : <span />}
          {showValue ? (
            <span className={cn("tnum text-[13px] font-semibold", toneClasses.text)}>{Math.round(v)}%</span>
          ) : null}
        </div>
      )}
      <div
        ref={ref}
        className={cn("relative w-full overflow-hidden rounded-full bg-surface-3 ring-1 ring-inset ring-line/70", heights[size] ?? heights.md)}
        role="progressbar"
        aria-valuenow={Math.round(v)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-full origin-left rounded-full",
            toneClasses.bar,
            striped && "bg-[linear-gradient(115deg,rgba(255,255,255,.28)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.28)_50%,rgba(255,255,255,.28)_75%,transparent_75%)] bg-[length:10px_10px]",
          )}
          style={{
            transform: `scaleX(${inView || reduced ? v / 100 : 0})`,
            transition: reduced
              ? "none"
              : `transform 900ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
          }}
        />
        {marker !== undefined ? (
          <div
            className="absolute inset-y-0 w-px bg-ink/25"
            style={{ left: `${clamp(marker, 0, 100)}%` }}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  );
}

/** Slim inline meter for dense tables. */
export function MiniBar({ value, tone, className }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.2 });
  const reduced = useReducedMotion();
  const v = clamp(Number(value) || 0, 0, 100);
  const resolvedTone = tone ?? (v >= 80 ? "strong" : v >= 60 ? "developing" : "risk");
  return (
    <span
      ref={ref}
      className={cn("relative block h-1.5 w-16 overflow-hidden rounded-full bg-surface-3", className)}
      aria-hidden="true"
    >
      <span
        className={cn("absolute inset-y-0 left-0 w-full origin-left rounded-full", TONE_CLASSES[resolvedTone].bar)}
        style={{
          transform: `scaleX(${inView || reduced ? v / 100 : 0})`,
          transition: reduced ? "none" : "transform 700ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </span>
  );
}

/** Discrete segment meter (weekly study goal, unit completion). */
export function SegmentMeter({ completed = 0, total = 1, tone = "brand", className }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.2 });
  const reduced = useReducedMotion();
  const segments = Math.max(1, Math.min(14, total));
  const done = Math.round((clamp(completed, 0, total) / total) * segments);
  const bar = TONE_CLASSES[tone] ?? TONE_CLASSES.brand;

  return (
    <div ref={ref} className={cn("flex items-center gap-[3px]", className)} aria-hidden="true">
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={cn("h-2.5 flex-1 rounded-[2px]", i < done ? bar.bar : "bg-surface-3")}
          style={{
            opacity: inView || reduced ? 1 : 0.15,
            transform: inView || reduced ? "scaleY(1)" : "scaleY(0.5)",
            transition: reduced ? "none" : `opacity 400ms ease ${i * 35}ms, transform 400ms ease ${i * 35}ms`,
          }}
        />
      ))}
    </div>
  );
}

/** Text-only animated figure — no chart, no DOM growth. */
export function AnimatedNumber({ value, className, suffix = "", prefix = "", decimals = 0, duration = 900 }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.4 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduced) {
      setDisplay(value);
      return undefined;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, reduced, duration]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
