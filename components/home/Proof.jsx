import Link from "next/link";
import { ArrowRight, Building, Presentation, Quote, UserCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUDIENCES, STORY, TRUST } from "@/lib/data/content";
import { TESTIMONIALS } from "@/lib/data/testimonials";
import { SAMPLE_PROFILE, SAMPLE_TIMELINE } from "@/lib/data/sampleResult";
import { diagnose } from "@/lib/engine/diagnose";
import { buildLearningPath } from "@/lib/engine/recommend";
import Reveal from "@/components/motion/Reveal";
import { Section, SectionHeading } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import { DiagnosisCallout, StrengthGapPanel } from "@/components/domain/Primitives";
import ProgressPreview from "@/components/home/ProgressPreview";
import { formatDate } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Proof — the sample report, condensed
 * ------------------------------------------------------------------ */

export function ReportProof() {
  const diagnosis = diagnose(SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1].topics);
  const path = buildLearningPath(SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1].topics, { weeks: 3 });

  return (
    <Section tone="surface" aria-labelledby="proof-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={STORY.proof.eyebrow}
            title={STORY.proof.title}
            body={STORY.proof.body}
            action={
              <Button href="/sample-report" variant="secondary" iconRight={ArrowRight}>
                Open the full report
              </Button>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Reveal variant="scale">
            <div className="overflow-hidden rounded-xl border border-line bg-canvas shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-ink font-mono text-[11px] font-semibold text-canvas">AY</span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{SAMPLE_PROFILE.name}</p>
                    <p className="text-[11.5px] text-muted">
                      Grade {SAMPLE_PROFILE.grade} · {SAMPLE_PROFILE.className} ·{" "}
                      {formatDate(SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1].date)}
                    </p>
                  </div>
                </div>
                <Badge tone="strong" size="sm" dot>
                  6 attempts recorded
                </Badge>
              </div>

              <div className="grid gap-px bg-line sm:grid-cols-2">
                {[
                  { key: "math", label: "Mathematics", tone: "brand", delta: 16 },
                  { key: "english", label: "English", tone: "accent", delta: 12 },
                ].map((item) => {
                  const subject = diagnosis[item.key];
                  return (
                    <div key={item.key} className="bg-surface px-5 py-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="eyebrow">{item.label}</p>
                        <DeltaTag value={item.delta} suffix="pts since March" />
                      </div>
                      <p className={cn("tnum mt-2 font-display text-[46px] leading-none tracking-[-0.03em]", item.tone === "brand" ? "text-brand" : "text-accent")}>
                        {subject.score}
                        <span className="ml-1 font-sans text-[15px] text-faint">%</span>
                      </p>
                      <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">{subject.explanation}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-surface p-5">
                <StrengthGapPanel
                  strengths={[...diagnosis.math.strengths.slice(0, 2), ...diagnosis.english.strengths.slice(0, 2)].sort((a, b) => b.score - a.score).slice(0, 3)}
                  gaps={diagnosis.topGaps.slice(0, 3)}
                />
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5">
            <Reveal delay={0.08}>
              <DiagnosisCallout
                text={diagnosis.narrative}
                label="What Prisma tells you"
                tip="Generated from topic scores: strengths are skills at 80% or above, gaps are ranked by weight × deficit."
              >
                <div className="flex flex-wrap gap-2">
                  {diagnosis.topGaps.slice(0, 3).map((gap) => (
                    <Badge key={gap.id} tone={gap.subject === "math" ? "brand" : "accent"} size="sm">
                      {gap.name} · {gap.score}%
                    </Badge>
                  ))}
                </div>
              </DiagnosisCallout>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="flex-1 rounded-lg border border-line bg-canvas p-5">
                <p className="eyebrow">Next step</p>
                <p className="mt-2.5 font-display text-[19px] leading-snug tracking-[-0.02em] text-ink">
                  {diagnosis.nextStep.title}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{diagnosis.nextStep.reason}</p>

                <div className="mt-4 border-t border-line pt-4">
                  <p className="eyebrow mb-2.5">Generated plan · first {Math.min(3, path.weeks.length)} weeks</p>
                  <ol className="space-y-2">
                    {path.weeks.slice(0, 3).map((week) => (
                      <li key={week.index} className="flex items-start gap-2.5">
                        <span className="tnum mt-px grid size-5 shrink-0 place-items-center rounded-[4px] border border-line bg-surface font-mono text-[10px] text-muted">
                          {week.index}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-medium text-ink">{week.topicName}</span>
                          <span className="block truncate text-[11.5px] text-muted">
                            {week.units.map((unit) => unit.title).join(" → ")}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <Button href="/student/recommendations" size="sm" className="mt-5 w-full" iconRight={ArrowRight}>
                  View my learning path
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Progress visualisation
 * ------------------------------------------------------------------ */

export function ProgressSection() {
  return (
    <Section tone="canvas" aria-labelledby="progress-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading eyebrow={STORY.progress.eyebrow} title={STORY.progress.title} body={STORY.progress.body} />
        </Reveal>
        <Reveal variant="stagger" stagger={0.08} className="mt-10">
          <ProgressPreview />
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Educators
 * ------------------------------------------------------------------ */

const EDUCATOR_CARDS = [
  {
    key: "teachers",
    icon: Presentation,
    href: "/teachers",
    dashHref: "/teacher/dashboard",
    title: "For teachers",
    headline: AUDIENCES.teachers.title,
    body: AUDIENCES.teachers.body,
    points: AUDIENCES.teachers.benefits.slice(0, 3),
    tone: "brand",
  },
  {
    key: "tutors",
    icon: UserCheck,
    href: "/tutors",
    dashHref: "/teacher/students",
    title: "For tutors",
    headline: AUDIENCES.tutors.title,
    body: AUDIENCES.tutors.body,
    points: AUDIENCES.tutors.benefits.slice(0, 3),
    tone: "accent",
  },
  {
    key: "schools",
    icon: Building,
    href: "/schools",
    dashHref: "/school/dashboard",
    title: "For schools",
    headline: AUDIENCES.schools.title,
    body: AUDIENCES.schools.body,
    points: AUDIENCES.schools.benefits.slice(0, 3),
    tone: "neutral",
  },
];

export function EducatorsSection() {
  return (
    <Section tone="surface" aria-labelledby="educators-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="For educators"
            title="One picture, shared by the classroom, the department and the leadership team."
            body="Prisma reports the same skill definitions at every level, so conversations stay about teaching rather than about whose spreadsheet is right."
            action={
              <Button href="/schools" variant="secondary" iconRight={ArrowRight}>
                School overview
              </Button>
            }
          />
        </Reveal>

        <Reveal variant="stagger" stagger={0.08} className="mt-12 grid gap-5 lg:grid-cols-3">
          {EDUCATOR_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.key} className="flex flex-col rounded-lg border border-line bg-canvas p-6 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md">
                <span className={cn("grid size-10 place-items-center rounded-lg border", card.tone === "brand" ? "border-brand-line bg-brand-soft text-brand" : card.tone === "accent" ? "border-accent-line bg-accent-soft text-accent" : "border-line bg-surface-2 text-ink-soft")}>
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-[20px] leading-snug tracking-[-0.02em] text-ink">{card.headline}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{card.body}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-4">
                  {card.points.map((point) => (
                    <li key={point.title} className="flex gap-2.5">
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-line-3" aria-hidden="true" />
                      <span>
                        <span className="block text-[13px] font-medium text-ink">{point.title}</span>
                        <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">{point.body}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center gap-2 pt-5">
                  <Link href={card.href} className="text-[13px] font-medium text-brand hover:underline">
                    Learn more
                  </Link>
                  <span className="text-line-3" aria-hidden="true">·</span>
                  <Link href={card.dashHref} className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-soft hover:text-brand">
                    Open demo
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </Reveal>

        <Reveal delay={0.1} className="mt-8">
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.refusals.map((item) => (
              <div key={item.title} className="bg-surface px-5 py-4">
                <p className="text-[13px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Testimonials
 * ------------------------------------------------------------------ */

export function TestimonialsSection() {
  return (
    <Section tone="canvas" aria-labelledby="testimonials-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="From our 2026 pilot cohort"
            title="What changed for the people using it."
            body="First names and roles only. Every figure quoted below comes from that person's own before-and-after diagnostics."
          />
        </Reveal>

        <Reveal variant="stagger" stagger={0.07} className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.id} className="flex flex-col rounded-lg border border-line bg-surface p-6 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md">
              <Quote className="size-5 text-line-3" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-ink">“{item.quote}”</blockquote>
              <figcaption className="mt-5 border-t border-line pt-4">
                <p className="text-[13px] font-semibold text-ink">{item.name}</p>
                <p className="text-[12px] text-muted">{item.role}</p>
                {item.metric ? (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-md border border-line bg-surface-2 px-2.5 py-1.5">
                    <span className="text-[11px] uppercase tracking-[0.08em] text-faint">{item.metric.label}</span>
                    <span className="tnum text-[12.5px] font-semibold text-ink">
                      {item.metric.before} → {item.metric.after}
                    </span>
                    <DeltaTag value={item.metric.after - item.metric.before} suffix="" />
                  </p>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
