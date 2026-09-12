"use client";

import { useRef } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { HERO } from "@/lib/data/content";
import { useApp } from "@/lib/store/AppProvider";
import { useGsap } from "@/lib/hooks/useGsap";
import { countUp, fadeUp, gsap, parallax, prefersReducedMotion, staggerReveal } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import CircularProgress from "@/components/ui/CircularProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Play, TrendingUp } from "lucide-react";

/* ------------------------------------------------------------------ *
 * The floating diagnostic dashboard in the hero
 * ------------------------------------------------------------------ */

function ReportVisual({ onReady }) {
  const rows = [
    { label: "Linear Equations", score: 90, tone: "strong", tag: "Strong area" },
    { label: "Quadratic Equations", score: 41, tone: "risk", tag: "Weak area" },
    { label: "Inequalities", score: 55, tone: "risk", tag: "Weak area" },
  ];

  return (
    <div ref={onReady} className="relative">
      {/* main report card */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-md bg-ink font-mono text-[10px] font-semibold text-canvas">AY</span>
            <div>
              <p className="text-[12.5px] font-semibold leading-none text-ink">Amina Yusupova</p>
              <p className="mt-1 text-[11px] leading-none text-muted">Grade 10 · Diagnostic report</p>
            </div>
          </div>
          <Badge tone="neutral" size="xs">6 Sep 2026</Badge>
        </div>

        <div className="grid grid-cols-2 gap-px bg-line">
          <div className="bg-surface px-4 py-5">
            <CircularProgress value={68} size={104} stroke={8} tone="brand" label="Mathematics" delay={500} />
          </div>
          <div className="bg-surface px-4 py-5">
            <CircularProgress value={74} size={104} stroke={8} tone="accent" label="English" delay={620} />
          </div>
        </div>

        <div className="border-t border-line px-5 py-4">
          <p className="eyebrow mb-3">Diagnosis</p>
          <p className="text-[13.5px] leading-relaxed text-ink">
            You are strong in linear equations but need more practice with{" "}
            <span className="font-semibold text-risk">quadratic equations</span> and{" "}
            <span className="font-semibold text-risk">inequalities</span>.
          </p>

          <ul className="mt-4 space-y-2.5">
            {rows.map((row, index) => (
              <li key={row.label}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="flex items-center gap-2 text-[12.5px] text-ink-soft">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        row.tone === "strong" ? "bg-strong" : "bg-risk",
                      )}
                      aria-hidden="true"
                    />
                    {row.label}
                  </span>
                  <span
                    className={cn(
                      "tnum text-[12.5px] font-semibold",
                      row.tone === "strong" ? "text-strong" : "text-risk",
                    )}
                  >
                    {row.score}%
                  </span>
                </div>
                <ProgressBar value={row.score} tone={row.tone} size="sm" delay={700 + index * 120} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-2 px-5 py-3">
          <p className="text-[11.5px] text-muted">
            Closing both gaps is worth <span className="tnum font-semibold text-ink">≈ 7 points</span>
          </p>
          <Link
            href="/sample-report"
            className="group inline-flex items-center gap-1 text-[12.5px] font-medium text-brand"
          >
            Full report
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* floating next-step card */}
      <div className="absolute -bottom-8 -left-4 w-[16.5rem] rounded-lg border border-line bg-surface p-4 shadow-lg sm:-left-10">
        <p className="eyebrow">Next step</p>
        <p className="mt-2 text-[13.5px] font-semibold leading-snug text-ink">
          Quadratic Equations — Fundamentals
        </p>
        <p className="mt-1 text-[11.5px] text-muted">Week 1 · 14 min · Learning path</p>
        <Link
          href="/student/learning-path"
          className="mt-3 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-ink text-[12.5px] font-medium text-canvas transition-transform duration-200 hover:-translate-y-px"
        >
          <Play className="size-3" aria-hidden="true" />
          Continue learning
        </Link>
      </div>

      {/* floating trend chip */}
      <div className="absolute -right-2 -top-5 flex items-center gap-2 rounded-full border border-strong/25 bg-strong-soft px-3 py-1.5 shadow-sm sm:-right-6">
        <TrendingUp className="size-3.5 text-strong" aria-hidden="true" />
        <span className="tnum text-[12px] font-semibold text-strong">+16 pts since March</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Hero
 * ------------------------------------------------------------------ */

export default function Hero() {
  const { cms } = useApp();
  const hero = {
    eyebrow: cms?.hero?.eyebrow || HERO.eyebrow,
    titleLines: [cms?.hero?.titleLine1 || HERO.titleLines[0], cms?.hero?.titleLine2 || HERO.titleLines[1]],
    body: cms?.hero?.body || HERO.body,
    primaryCta: { label: cms?.hero?.primaryLabel || HERO.primaryCta.label, href: cms?.hero?.primaryHref || HERO.primaryCta.href },
    secondaryCta: { label: cms?.hero?.secondaryLabel || HERO.secondaryCta.label, href: cms?.hero?.secondaryHref || HERO.secondaryCta.href },
    meta: HERO.meta,
  };

  const root = useRef(null);
  const visual = useRef(null);

  useGsap(() => {
    const reduced = prefersReducedMotion();
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.add(fadeUp(root.current.querySelectorAll("[data-hero='eyebrow']"), { y: 12, duration: 0.5 }));
    tl.add(
      gsap.fromTo(
        root.current.querySelectorAll("[data-hero='line']"),
        { yPercent: reduced ? 0 : 108, opacity: reduced ? 1 : 0.001 },
        { yPercent: 0, opacity: 1, duration: reduced ? 0 : 0.9, ease: "power4.out", stagger: reduced ? 0 : 0.09 },
      ),
      "-=0.25",
    );
    tl.add(fadeUp(root.current.querySelector("[data-hero='body']"), { y: 16, duration: 0.55 }), "-=0.55");
    tl.add(staggerReveal(root.current.querySelectorAll("[data-hero='cta']"), { y: 14, duration: 0.45, stagger: 0.08 }), "-=0.4");
    tl.add(staggerReveal(root.current.querySelectorAll("[data-hero='stat']"), { y: 12, duration: 0.4, stagger: 0.06 }), "-=0.3");
    tl.add(fadeUp(visual.current, { y: 26, duration: 0.85, ease: "power3.out" }), "-=0.75");

    root.current.querySelectorAll("[data-count]").forEach((el) => {
      countUp(el, Number(el.dataset.count), { duration: 1.1, delay: 0.35, suffix: el.dataset.suffix ?? "" });
    });

    if (!reduced) parallax(visual.current, { distance: 26, trigger: root.current, start: "top top", end: "bottom top", scrub: 0.7 });
  }, root, []);

  return (
    <section ref={root} className="relative overflow-hidden border-b border-line bg-canvas">
      <div className="prism-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-paper pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" aria-hidden="true" />

      <div className="container-page relative">
        <div className="grid items-center gap-14 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:py-24 xl:gap-20">
          {/* ---- copy ---- */}
          <div className="max-w-xl">
            <p data-hero="eyebrow" className="eyebrow flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
                <span className="size-1.5 rounded-full bg-strong" aria-hidden="true" />
                {hero.eyebrow}
              </span>
            </p>

            <h1 className="mt-6 font-display text-[clamp(2.35rem,6vw,3.9rem)] font-medium leading-[1.04] tracking-[-0.032em] text-ink">
              {hero.titleLines.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <span data-hero="line" className="block will-change-transform">
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <p data-hero="body" className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink-soft md:text-[17px]">
              {hero.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <span data-hero="cta">
                <Button href={hero.primaryCta.href} size="lg" iconRight={ArrowRight}>
                  {hero.primaryCta.label}
                </Button>
              </span>
              <span data-hero="cta">
                <Button href={hero.secondaryCta.href} size="lg" variant="secondary">
                  {hero.secondaryCta.label}
                </Button>
              </span>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {hero.meta.map((item) => (
                <div key={item.label} data-hero="stat" className="bg-surface/80 px-4 py-3">
                  <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{item.label}</dt>
                  <dd className="tnum mt-1 font-display text-[20px] leading-none text-ink">
                    <span data-count={item.value} data-suffix={item.suffix}>
                      {item.value}
                      {item.suffix}
                    </span>
                  </dd>
                  {item.hint ? <dd className="mt-1 text-[10.5px] text-faint">{item.hint}</dd> : null}
                </div>
              ))}
            </dl>
          </div>

          {/* ---- visual ---- */}
          <div className="relative lg:pl-6">
            <ReportVisual onReady={(node) => { visual.current = node; }} />
          </div>
        </div>
      </div>
    </section>
  );
}
