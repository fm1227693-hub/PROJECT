"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useGsap } from "@/lib/hooks/useGsap";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { CheckCircle2 } from "lucide-react";

/**
 * Scroll storytelling for the four-step method.
 *
 * A sticky rail on the left tracks the active step; each step's detail fades up
 * as it enters. One ScrollTrigger per step, all reverted on unmount.
 */
export default function StoryJourney({ steps = [] }) {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useGsap(() => {
    if (prefersReducedMotion()) return;
    const sections = gsap.utils.toArray("[data-step]", root.current);

    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(index),
      });

      gsap.fromTo(
        section.querySelectorAll("[data-reveal]"),
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );
    });

    // Progress rail fills as the reader moves through the journey.
    gsap.to("[data-rail-fill]", {
      scaleY: 1,
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom 70%", scrub: 0.6 },
    });
  }, root, [steps.length]);

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-16">
      {/* ---- sticky rail ---- */}
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <p className="eyebrow mb-5">The method</p>
          <div className="relative pl-5">
            <span className="absolute left-[5px] top-2 bottom-2 w-px bg-line" aria-hidden="true" />
            <span
              data-rail-fill
              className="absolute left-[5px] top-2 bottom-2 w-px origin-top bg-brand"
              style={{ transform: "scaleY(0)" }}
              aria-hidden="true"
            />
            <ol className="space-y-6">
              {steps.map((step, index) => (
                <li key={step.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-5 top-1.5 size-[11px] rounded-full border-2 transition-colors duration-300",
                      index <= active ? "border-brand bg-brand" : "border-line-2 bg-surface",
                    )}
                    aria-hidden="true"
                  />
                  <a href={`#step-${step.id}`} className="group block">
                    <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">{step.n}</span>
                    <span
                      className={cn(
                        "mt-1 block font-display text-[19px] leading-none tracking-[-0.02em] transition-colors duration-300",
                        index === active ? "text-ink" : "text-faint group-hover:text-ink-soft",
                      )}
                    >
                      {step.title}
                    </span>
                    <span className="mt-1.5 block text-[11.5px] text-faint">{step.time}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </aside>

      {/* ---- steps ---- */}
      <div className="space-y-6">
        {steps.map((step, index) => (
          <article
            key={step.id}
            id={`step-${step.id}`}
            data-step
            className={cn(
              "scroll-mt-28 overflow-hidden rounded-xl border bg-surface transition-[border-color,box-shadow] duration-300",
              index === active ? "border-line-2 shadow-md" : "border-line shadow-hairline",
            )}
          >
            <div className="flex items-start gap-4 border-b border-line px-6 py-5 sm:px-8">
              <span
                className={cn(
                  "tnum grid size-11 shrink-0 place-items-center rounded-lg border font-mono text-[13px] font-semibold transition-colors duration-300",
                  index <= active ? "border-brand-line bg-brand-soft text-brand" : "border-line bg-surface-2 text-faint",
                )}
                aria-hidden="true"
              >
                {step.n}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 data-reveal className="font-display text-[clamp(1.4rem,2.6vw,1.95rem)] leading-none tracking-[-0.025em] text-ink">
                    {step.title}
                  </h2>
                  <span data-reveal className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-faint">
                    {step.time}
                  </span>
                </div>
                <p data-reveal className="mt-2.5 text-[14.5px] leading-relaxed text-ink-soft">
                  {step.summary}
                </p>
              </div>
            </div>

            <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p data-reveal className="text-[14.5px] leading-relaxed text-ink-soft">{step.detail}</p>
                <ul data-reveal className="mt-5 space-y-2">
                  {step.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2.5 text-[13.5px] text-ink">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-strong" aria-hidden="true" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>

              <div data-reveal className="rounded-lg border border-line bg-canvas p-4">
                <p className="eyebrow mb-3">What you see</p>
                <ul className="space-y-2.5">
                  {(step.preview ?? []).map((row) => (
                    <li key={row.label} className="flex items-baseline justify-between gap-3 border-b border-line pb-2 last:border-b-0 last:pb-0">
                      <span className="truncate text-[12.5px] text-muted">{row.label}</span>
                      <span className={cn("tnum shrink-0 text-[13px] font-semibold", row.tone === "risk" ? "text-risk" : row.tone === "strong" ? "text-strong" : "text-ink")}>
                        {row.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
