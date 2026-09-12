import Link from "next/link";
import { ArrowRight, Calculator, Sigma } from "lucide-react";

import { cn } from "@/lib/utils";
import { PERSONALIZED_LEARNING_PAGE as COPY, STORY } from "@/lib/data/content";
import { CONTRAST_PROFILE, SAMPLE_PROFILE, SAMPLE_TIMELINE } from "@/lib/data/sampleResult";
import { buildLearningPath, PATH_PRESETS } from "@/lib/engine/recommend";
import { buildResult } from "@/lib/engine/scoring";
import { prioritiseGaps } from "@/lib/engine/diagnose";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import Reveal from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { StepNumber } from "@/components/domain/Primitives";

export const metadata = {
  title: "Personalized Learning",
  description:
    "How Prisma turns a diagnostic result into a sequenced, week-by-week learning path — and the arithmetic behind every recommendation.",
  alternates: { canonical: "/personalized-learning" },
};

const latest = SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1].topics;
const planA = buildLearningPath(latest, { weeks: 3, weeklyMinutes: 240 });
const planB = buildLearningPath(CONTRAST_PROFILE.topics, { weeks: 3, weeklyMinutes: 240 });
const resultA = buildResult(latest);
const resultB = buildResult(CONTRAST_PROFILE.topics);

/** Page 09 — Personalized learning. The recommendation engine, explained. */
export default function PersonalizedLearningPage() {
  return (
    <>
      <PageHero
        decor="rings"
        eyebrow={COPY.eyebrow}
        title={COPY.title}
        body={COPY.body}
        actions={[
          { label: "See your plan", href: "/student/recommendations" },
          { label: "Read a sample report", href: "/sample-report", variant: "secondary" },
        ]}
        meta={[
          { label: "Rules in the engine", value: "5" },
          { label: "Plan length", value: "4–8", suffix: " weeks" },
          { label: "Improvement factor", value: "72", suffix: "%" },
          { label: "Recomputed", value: "Every attempt" },
        ]}
      />

      {/* ---- the five rules ---- */}
      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="The engine"
            title="Five rules. All of them checkable."
            body="A recommendation you cannot audit is just a suggestion. Every step below is arithmetic you can redo yourself."
          />
        </Reveal>

        <div className="mt-12 space-y-4">
          {COPY.rules.map((rule, index) => (
            <Reveal key={rule.n} delay={index * 0.04}>
              <article className="grid gap-5 rounded-lg border border-line bg-canvas p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
                <div className="flex gap-4">
                  <StepNumber n={rule.n} size="md" />
                  <div>
                    <h2 className="font-display text-[20px] leading-snug tracking-[-0.022em] text-ink">{rule.title}</h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{rule.body}</p>
                  </div>
                </div>
                <div className="rounded-md border border-line bg-surface p-4 md:self-center">
                  <p className="eyebrow mb-2 flex items-center gap-1.5">
                    <Calculator className="size-3.5" aria-hidden="true" />
                    Worked example
                  </p>
                  <p className="font-mono text-[12.5px] leading-relaxed text-ink">{rule.example}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </MarketingSection>

      {/* ---- same score, different plan ---- */}
      <MarketingSection tone="canvas">
        <Reveal>
          <SectionHeading
            eyebrow={COPY.contrast.title}
            title="Two learners. The same Mathematics score. Different first weeks."
            body={COPY.contrast.body}
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {[
            { name: SAMPLE_PROFILE.name, plan: planA, result: resultA, scores: latest, tone: "brand" },
            { name: CONTRAST_PROFILE.name, plan: planB, result: resultB, scores: CONTRAST_PROFILE.topics, tone: "accent" },
          ].map((learner, learnerIndex) => {
            const gaps = prioritiseGaps(learner.scores, "math").slice(0, 3);
            return (
              <Reveal key={learner.name} delay={learnerIndex * 0.08}>
                <article className={cn("flex h-full flex-col rounded-xl border bg-surface p-6 shadow-sm", learner.tone === "brand" ? "border-brand-line" : "border-accent-line")}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">{learner.name}</p>
                      <p className="tnum mt-2 font-display text-[42px] leading-none tracking-[-0.035em] text-ink">
                        {learner.result.math.score}
                        <span className="ml-1 font-sans text-[15px] text-faint">%</span>
                      </p>
                      <p className="mt-1 text-[12.5px] text-muted">Mathematics · overall</p>
                    </div>
                    <Badge tone={learner.tone} size="sm">
                      {learner.plan.weeks.length}-week plan
                    </Badge>
                  </div>

                  <div className="mt-5 rounded-md border border-line bg-canvas p-4">
                    <p className="eyebrow mb-2.5">Top three gaps</p>
                    <ul className="space-y-2">
                      {gaps.map((gap) => (
                        <li key={gap.id} className="flex items-baseline justify-between gap-3">
                          <span className="truncate text-[13px] text-ink-soft">{gap.name}</span>
                          <span className="tnum shrink-0 text-[12px] text-muted">
                            {gap.score}% · weight {gap.weight}%
                          </span>
                          <span className="tnum shrink-0 text-[12.5px] font-semibold text-risk">+{gap.impact} pts</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ol className="mt-5 flex-1 space-y-3">
                    {learner.plan.weeks.slice(0, 3).map((week) => (
                      <li key={week.index} className="rounded-md border border-line bg-surface p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[13.5px] font-semibold text-ink">
                            Week {week.index} · {week.topicName}
                          </p>
                          <span className="tnum shrink-0 text-[11.5px] text-muted">{week.minutes} min</span>
                        </div>
                        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] leading-relaxed text-muted">
                          {week.units.map((unit, unitIndex) => (
                            <span key={unit.key} className="flex items-center gap-1.5">
                              <span className={cn(unit.type === "assessment" ? "font-medium text-developing" : unit.type === "practice" ? "font-medium text-accent" : "text-ink-soft")}>
                                {unit.title}
                              </span>
                              {unitIndex < week.units.length - 1 ? <span className="text-line-3" aria-hidden="true">→</span> : null}
                            </span>
                          ))}
                        </p>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <p className="tnum text-[13px] text-muted">
                      Projected Mathematics{" "}
                      <span className="font-semibold text-strong">{learner.plan.projection.math.after}%</span>
                    </p>
                    <Link
                      href={learnerIndex === 0 ? "/student/recommendations" : "/student/recommendations"}
                      className="inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline"
                    >
                      {learnerIndex === 0 ? "Open this plan" : "Compare in the planner"}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.12} className="mt-6">
          <p className="rounded-lg border border-line bg-surface-2 p-5 text-[13.5px] leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">This is the whole argument for Prisma.</strong> Both learners
            score {resultA.math.score}% in Mathematics. A test tells them the same thing. Prisma sends them to
            completely different first lessons — because the number was never the information.
          </p>
        </Reveal>
      </MarketingSection>

      {/* ---- presets ---- */}
      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Study budget"
            title="The same content, packed into the week you actually have."
            body="A plan is not a wish list. Units are grouped into weeks that fit your weekly study budget, so the plan survives contact with a real timetable."
          />
        </Reveal>

        <Reveal variant="stagger" stagger={0.07} className="mt-10 grid gap-5 md:grid-cols-3">
          {Object.values(PATH_PRESETS).map((preset) => {
            const plan = buildLearningPath(latest, { weeklyMinutes: preset.weeklyMinutes, weeks: preset.weeks });
            return (
              <article key={preset.label} className="rounded-lg border border-line bg-canvas p-6">
                <p className="eyebrow">{preset.label}</p>
                <p className="tnum mt-2.5 font-display text-[34px] leading-none tracking-[-0.03em] text-ink">
                  {preset.weeklyMinutes}
                  <span className="ml-1 font-sans text-[13px] text-faint">min / week</span>
                </p>
                <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[13px]">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Weeks</dt>
                    <dd className="tnum font-semibold text-ink">{plan.weeks.length}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Total study time</dt>
                    <dd className="tnum font-semibold text-ink">{plan.totalMinutes} min</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">Projected Mathematics</dt>
                    <dd className="tnum font-semibold text-strong">{plan.projection.math.after}%</dd>
                  </div>
                </dl>
                <p className="mt-4 text-[12.5px] leading-relaxed text-muted">{plan.summary}</p>
              </article>
            );
          })}
        </Reveal>
      </MarketingSection>

      <CtaBand
        title="Generate your own plan."
        body={STORY.personalization.body}
        primary={{ label: "Open my recommended plan", href: "/student/recommendations" }}
        secondary={{ label: "Take a Diagnostic first", href: "/student/diagnostic/start" }}
        note={
          <>
            The engine behind this page lives in{" "}
            <code className="rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[11.5px] text-ink-soft">
              lib/engine/recommend.js
            </code>{" "}
            <Sigma className="ml-1 inline size-3 align-[-1px]" aria-hidden="true" />
          </>
        }
      />
    </>
  );
}
