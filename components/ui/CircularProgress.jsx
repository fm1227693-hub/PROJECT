"use client";

import { useId } from "react";
import { cn, clamp } from "@/lib/utils";
import { TONE_CLASSES } from "@/lib/data/brand";
import { useInViewOnce, useReducedMotion } from "@/lib/hooks/useMotion";

/**
 * Radial score. Animates its arc exactly once, when it scrolls into view,
 * using stroke-dashoffset on a small SVG — no continuous loops, no canvas.
 */
export default function CircularProgress({
  value = 0,
  size = 132,
  stroke = 10,
  tone,
  gradient = false,
  label,
  sublabel,
  suffix = "%",
  trackClass = "text-surface-3",
  className,
  delay = 0,
  caption,
  showValue = true,
}) {
  const gid = useId();
  const [ref, inView] = useInViewOnce({ threshold: 0.35 });
  const reduced = useReducedMotion();

  const v = clamp(Number(value) || 0, 0, 100);
  const resolvedTone = tone ?? (v >= 80 ? "strong" : v >= 60 ? "developing" : "risk");
  const colour = TONE_CLASSES[resolvedTone]?.stroke ?? "#2b4fe0";

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (inView || reduced ? v / 100 : 0));

  return (
    <figure className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }} ref={ref}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
          {gradient ? (
            <defs>
              <linearGradient id={`${gid}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2b4fe0" />
                <stop offset="100%" stopColor="#7a5cd6" />
              </linearGradient>
            </defs>
          ) : null}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className={cn("stroke-current", trackClass)}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            stroke={gradient ? `url(#${gid}-grad)` : colour}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: reduced ? "none" : `stroke-dashoffset 1100ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
            }}
          />
        </svg>

        {showValue ? (
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center leading-none">
              <span className="tnum block font-display text-ink" style={{ fontSize: Math.max(18, size * 0.26) }}>
                {Math.round(v)}
                <span className="text-[0.55em] font-sans text-muted">{suffix}</span>
              </span>
              {sublabel ? (
                <span className="mt-1 block text-[11px] uppercase tracking-[0.1em] text-faint">{sublabel}</span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {label ? <figcaption className="text-center text-[13px] font-medium text-ink">{label}</figcaption> : null}
      {caption ? <p className="max-w-[22ch] text-center text-xs leading-relaxed text-muted">{caption}</p> : null}
    </figure>
  );
}

/** Inline ring + label, for tables and dense cards. */
export function RingScore({ value, size = 40, stroke = 4, tone, className, label }) {
  const [ref, inView] = useInViewOnce({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const v = clamp(Number(value) || 0, 0, 100);
  const resolvedTone = tone ?? (v >= 80 ? "strong" : v >= 60 ? "developing" : "risk");
  const colour = TONE_CLASSES[resolvedTone]?.stroke ?? "#2b4fe0";
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - (inView || reduced ? v / 100 : 0));

  return (
    <span className={cn("relative inline-grid shrink-0 place-items-center", className)} style={{ width: size, height: size }} ref={ref}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="stroke-surface-3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={colour}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: reduced ? "none" : "stroke-dashoffset 800ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <span className="tnum absolute text-[11px] font-semibold text-ink">
        {Math.round(v)}
        {label ? <span className="sr-only">{label}</span> : null}
      </span>
    </span>
  );
}
