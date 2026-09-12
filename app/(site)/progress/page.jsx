import { ArrowRight, CalendarRange, LineChart, Repeat, Ruler, TrendingUp } from "lucide-react";

import { SAMPLE_TIMELINE } from "@/lib/data/sampleResult";
import { buildResult } from "@/lib/engine/scoring";
import { compareSnapshots } from "@/lib/engine/diagnose";
import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import ProgressPreview from "@/components/home/ProgressPreview";
import { CurveSketch } from "@/components/decor/Backgrounds";

export const metadata = {
  title: "Progress Tracking",
  description:
    "How Prisma measures improvement: identical skill definitions on every attempt, attempt timelines, before/after comparisons and per-topic movement.",
  alternates: { canonical: "/progress" },
};

const first = SAMPLE_TIMELINE[0];
const latest = SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1];
const firstResult = buildResult(first.topics);
const latestResult = buildResult(latest.topics);
const movements = compareSnapshots(first.topics, latest.topics);
const gains = [...movements].sort((a, b) => b.delta - a.delta).slice(0, 4);

const PRINCIPLES = [
  { icon: Ruler, title: "The ruler never changes", body: "Every attempt is scored against the same topic definitions and weights. A rise in the line is a rise in the skill, not a change of paper." },
  { icon: Repeat, title: "Retakes are cheap, comparisons are strict", body: "One free diagnostic a month, unlimited on paid plans — but each retake draws a fresh sample of items so practice on remembered questions cannot inflate the score." },
  { icon: CalendarRange, title: "Timelines, not snapshots", body: "Six attempts become a curve. The curve is what a parent, a tutor or a head of year actually reads." },
  { icon: TrendingUp, title: "Movement per topic", body: "Overall scores hide trade-offs. Prisma shows which topics moved, by how much, and which slipped while you were looking elsewhere." },
];

/** Page 10 — Progress tracking, explained with the demo learner's real curve. */
export default function ProgressPage() {
  return (
    <>
      <PageHero
        decor="math"
        eyebrow="Progress tracking"
        title="Improvement you can point at."
        body="Most products show a score. Prisma shows the difference between two scores measured with the same ruler — per subject, per domain, per topic — and tells you which change mattered."
        actions={[
          { label: "Open my progress", href: "/student/progress" },
          { label: "Take a Diagnostic", href: "/student/diagnostic/start", variant: "secondary" },
        ]}
        meta={[
          { label: "Attempts recorded", value: String(SAMPLE_TIMELINE.length) },
          { label: "Mathematics", value: `${firstResult.math.score}→${latestResult.math.score}`, suffix: "%" },
          { label: "English", value: `${firstResult.english.score}→${latestResult.english.score}`, suffix: "%" },
          { label: "Topics improved", value: String(movements.filter((m) => m.delta > 0).length) },
        ]}
      />

      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="The demo learner, March → September"
            title="Six attempts. One honest curve."
            body="This is the exact chart a Prisma learner sees — rendered from the same timeline data, not a mockup of one."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-9">
          <div className="relative overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-sm">
            <CurveSketch className="opacity-40" />
            <div className="relative">
              <ProgressPreview />
            </div>
          </div>
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Why comparisons are trustworthy" title="Four rules we do not break." size="md" />
            <div className="mt-7 space-y-5">
              {PRINCIPLES.map((item, index) => (
                <div key={item.title} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-brand-line bg-brand-soft text-brand">
                    <item.icon className="size-[17px]" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[14.5px] font-semibold tracking-[-0.012em] text-ink">
                      <span className="tnum mr-2 font-mono text-[10.5px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                      {item.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-xl border border-line bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">Biggest movements since {first.term ?? "March"}</p>
                <Badge tone="strong" size="sm" dot>Live data</Badge>
              </div>
              <ul className="mt-5 divide-y divide-line">
                {gains.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-medium text-ink">{row.name}</p>
                      <p className="mt-0.5 text-[11.5px] text-muted">{row.subject === "math" ? "Mathematics" : "English"}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="tnum text-[12px] text-faint">
                        {row.before}% → <span className="font-semibold text-ink">{row.after}%</span>
                      </span>
                      <DeltaTag value={row.delta} />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-md border border-line bg-canvas p-4">
                <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
                  <LineChart className="size-4 text-brand" aria-hidden="true" />
                  Overall movement
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-4">
                  {[
                    { label: "Mathematics", before: firstResult.math.score, after: latestResult.math.score },
                    { label: "English", before: firstResult.english.score, after: latestResult.english.score },
                  ].map((row) => (
                    <div key={row.label}>
                      <p className="text-[11.5px] text-muted">{row.label}</p>
                      <p className="tnum mt-1 font-display text-[26px] leading-none text-ink">
                        {row.before}
                        <span className="mx-1 text-[14px] text-faint">→</span>
                        <span className="text-strong">{row.after}</span>
                      </p>
                      <DeltaTag value={row.after - row.before} className="mt-1.5" />
                    </div>
                  ))}
                </div>
              </div>
              <a href="/student/progress" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline">
                Open the interactive progress view
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </MarketingSection>

      <CtaBand
        title="Your first point on the curve is twenty minutes away."
        body="Take the baseline now and every later attempt becomes a comparison instead of a guess."
        primary={{ label: "Take a Diagnostic", href: "/student/diagnostic/start" }}
        secondary={{ label: "See the sample timeline", href: "/sample-report" }}
      />
    </>
  );
}
