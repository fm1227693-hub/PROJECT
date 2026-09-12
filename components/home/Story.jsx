import Link from "next/link";
import {
  CheckCircle2,
  Compass,
  Radar,
  ScanLine,
  TrendingUp,
  XCircle,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { BENEFITS, HOW_IT_WORKS, STORY, TRUST } from "@/lib/data/content";
import { CONTRAST_PROFILE, SAMPLE_TOPIC_SCORES } from "@/lib/data/sampleResult";
import { getTopic } from "@/lib/data/topics";
import Reveal from "@/components/motion/Reveal";
import { Section, SectionHeading } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SpectrumRow } from "@/components/domain/Primitives";
import { StepNumber } from "@/components/domain/Primitives";

const STEP_ICONS = {
  "scan-line": ScanLine,
  radar: Radar,
  route: Compass,
  "trending-up": TrendingUp,
};

/* ------------------------------------------------------------------ *
 * Trust strip
 * ------------------------------------------------------------------ */

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-surface" aria-labelledby="trust-heading">
      <div className="container-page py-12 md:py-14">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">{TRUST.eyebrow}</p>
            <h2 id="trust-heading" className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.025em] text-ink">
              {TRUST.title}
            </h2>
          </div>
        </Reveal>

        <Reveal variant="stagger" stagger={0.07} className="mt-9 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.commitments.map((item) => (
            <div key={item.title} className="bg-surface p-5">
              <span className="flex size-8 items-center justify-center rounded-md border border-strong/25 bg-strong-soft text-strong">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-3.5 text-[14.5px] font-semibold tracking-[-0.01em] text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Problem → Solution
 * ------------------------------------------------------------------ */

function ContrastVisual() {
  const aTopics = ["linear_equations", "quadratic_equations", "ratios"];
  const bTopics = ["quadratic_equations", "ratios", "functions"];

  return (
    <div className="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <p className="eyebrow">Two learners · one score</p>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="tnum font-display text-[44px] leading-none tracking-[-0.03em] text-ink">68%</span>
        <span className="text-[13px] leading-snug text-muted">
          Mathematics
          <br />
          both learners
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-line bg-surface-2 p-3.5">
          <p className="text-[12px] font-semibold text-ink">Learner A</p>
          <ul className="mt-2.5 space-y-1.5">
            {aTopics.map((id) => (
              <li key={id}>
                <SpectrumRow name={getTopic(id).name} score={SAMPLE_TOPIC_SCORES[id]} size="sm" showBand={false} />
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-snug text-muted">
            Needs quadratics and inequalities.
          </p>
        </div>

        <div className="rounded-md border border-line bg-surface-2 p-3.5">
          <p className="text-[12px] font-semibold text-ink">Learner B</p>
          <ul className="mt-2.5 space-y-1.5">
            {bTopics.map((id) => (
              <li key={id}>
                <SpectrumRow name={getTopic(id).name} score={CONTRAST_PROFILE.topics[id]} size="sm" showBand={false} />
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-snug text-muted">
            Needs ratios and linear equations.
          </p>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">{CONTRAST_PROFILE.note}</p>
    </div>
  );
}

export function ProblemSection() {
  return (
    <Section tone="canvas" aria-labelledby="problem-heading">
      <div className="container-page">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">{STORY.problem.eyebrow}</p>
            <h2 id="problem-heading" className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.1] tracking-[-0.028em] text-ink">
              {STORY.problem.title}
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-soft">{STORY.problem.body}</p>

            <ul className="mt-7 space-y-2.5">
              {STORY.problem.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-soft">
                  <XCircle className="mt-0.5 size-4 shrink-0 text-risk/70" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="scale" delay={0.08}>
            <ContrastVisual />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function SolutionSection() {
  return (
    <Section tone="surface" aria-labelledby="solution-heading">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal variant="scale" className="order-2 lg:order-1">
            <div className="rounded-lg border border-line bg-canvas p-5 shadow-sm">
              <p className="eyebrow">One result, decomposed</p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4 rounded-md border border-line bg-surface px-4 py-3">
                  <span className="tnum font-display text-[30px] leading-none text-ink">68%</span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-ink">Mathematics · overall</p>
                    <p className="text-[11.5px] text-muted">Derived from 12 weighted topic scores</p>
                  </div>
                </div>

                <div className="flex justify-center" aria-hidden="true">
                  <span className="h-5 w-px bg-line-2" />
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    { label: "Number & Operations", value: 77, tone: "developing" },
                    { label: "Algebra", value: 62, tone: "developing" },
                    { label: "Geometry", value: 81, tone: "strong" },
                  ].map((domain) => (
                    <div key={domain.label} className="rounded-md border border-line bg-surface p-3">
                      <p className="text-[11px] leading-snug text-muted">{domain.label}</p>
                      <p className={cn("tnum mt-1.5 font-display text-[22px] leading-none", domain.tone === "strong" ? "text-strong" : "text-developing")}>
                        {domain.value}%
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center" aria-hidden="true">
                  <span className="h-5 w-px bg-line-2" />
                </div>

                <ul className="space-y-1 rounded-md border border-line bg-surface p-3">
                  {[
                    { name: "Linear Equations", score: 90 },
                    { name: "Functions", score: 71 },
                    { name: "Inequalities", score: 55 },
                    { name: "Quadratic Equations", score: 41 },
                  ].map((row, i) => (
                    <li key={row.name}>
                      <SpectrumRow name={row.name} score={row.score} size="sm" showBand delay={i * 80} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <p className="eyebrow">{STORY.solution.eyebrow}</p>
            <h2 id="solution-heading" className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.1] tracking-[-0.028em] text-ink">
              {STORY.solution.title}
            </h2>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-soft">{STORY.solution.body}</p>
            <ul className="mt-7 space-y-2.5">
              {STORY.solution.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2.5 text-[14px] leading-relaxed text-ink-soft">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-strong" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/how-it-works" variant="secondary" iconRight={ArrowRight}>
                See the full method
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * How it works (compact, homepage version)
 * ------------------------------------------------------------------ */

export function HowItWorksHome() {
  return (
    <Section tone="canvas" aria-labelledby="hiw-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={HOW_IT_WORKS.eyebrow}
            title={HOW_IT_WORKS.title}
            body={HOW_IT_WORKS.body}
            action={
              <Button href="/how-it-works" variant="secondary" iconRight={ArrowRight}>
                How it works
              </Button>
            }
          />
        </Reveal>

        <Reveal variant="stagger" stagger={0.08} className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {HOW_IT_WORKS.steps.map((step) => {
            const Icon = STEP_ICONS[step.icon] ?? ScanLine;
            return (
              <article key={step.id} className="group relative rounded-lg border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <StepNumber n={step.n} size="md" />
                  <Icon className="size-[18px] text-line-3 transition-colors duration-250 group-hover:text-brand" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-[20px] leading-none tracking-[-0.02em] text-ink">{step.title}</h3>
                <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">{step.time}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-soft">{step.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-3.5">
                  {step.outcomes.slice(0, 3).map((outcome) => (
                    <li key={outcome} className="rounded-[4px] bg-surface-2 px-1.5 py-0.5 text-[10.5px] text-muted">
                      {outcome}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Benefits
 * ------------------------------------------------------------------ */

const BENEFIT_ICONS = {
  "scan-line": ScanLine,
  radar: Radar,
  compass: Compass,
  "trending-up": TrendingUp,
};

export function BenefitsHome() {
  return (
    <Section tone="surface" aria-labelledby="benefits-heading">
      <div className="container-narrow">
        <Reveal>
          <SectionHeading eyebrow={BENEFITS.eyebrow} title={BENEFITS.title} body={BENEFITS.body} align="center" />
        </Reveal>

        <Reveal variant="stagger" stagger={0.07} className="mt-12 grid gap-5 sm:grid-cols-2">
          {BENEFITS.items.map((item) => {
            const Icon = BENEFIT_ICONS[item.icon] ?? ScanLine;
            return (
              <article key={item.id} className="rounded-lg border border-line bg-canvas p-6 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md">
                <span className="grid size-10 place-items-center rounded-lg border border-brand-line bg-brand-soft text-brand">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-[20px] leading-snug tracking-[-0.02em] text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{item.body}</p>
                <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-[12.5px] text-muted">
                      <span className="size-1 rounded-full bg-brand/50" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Final call to action
 * ------------------------------------------------------------------ */

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-canvas" aria-labelledby="cta-heading">
      <div className="prism-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="dot-paper pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" aria-hidden="true" />

      <div className="container-narrow relative py-20 text-center md:py-28">
        <Reveal>
          <p className="eyebrow mx-auto flex w-fit items-center gap-2">
            <span className="inline-block h-px w-6 bg-brand/40" aria-hidden="true" />
            The next step
          </p>
          <h2 id="cta-heading" className="mt-4 font-display text-[clamp(2rem,4.6vw,3.2rem)] leading-[1.06] tracking-[-0.03em] text-ink">
            {STORY.cta.title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-ink-soft">{STORY.cta.body}</p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={STORY.cta.primary.href} size="lg" iconRight={ArrowRight}>
              {STORY.cta.primary.label}
            </Button>
            <Button href={STORY.cta.secondary.href} size="lg" variant="secondary">
              {STORY.cta.secondary.label}
            </Button>
          </div>

          <p className="mt-6 text-[12.5px] text-muted">
            Free plan · no card required ·{" "}
            <Link href="/pricing" className="text-ink-soft underline-offset-4 hover:text-brand hover:underline">
              compare plans
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
