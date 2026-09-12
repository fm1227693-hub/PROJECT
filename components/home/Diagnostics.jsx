import Link from "next/link";
import { ArrowRight, BookOpen, Sigma, Sparkles, Timer } from "lucide-react";

import { cn } from "@/lib/utils";
import { MATH_DIAGNOSTIC_PAGE, ENGLISH_DIAGNOSTIC_PAGE, PERSONALIZED_LEARNING_PAGE, STORY } from "@/lib/data/content";
import { MATH_DOMAINS, ENGLISH_DOMAINS, topicsForDomain, MATH_TOPICS, ENGLISH_TOPICS } from "@/lib/data/topics";
import { SAMPLE_TOPIC_SCORES, SAMPLE_TIMELINE } from "@/lib/data/sampleResult";
import { buildResult } from "@/lib/engine/scoring";
import { prioritiseGaps, strengths } from "@/lib/engine/diagnose";
import { buildLearningPath } from "@/lib/engine/recommend";
import Reveal from "@/components/motion/Reveal";
import { Section, SectionHeading } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CircularProgress from "@/components/ui/CircularProgress";
import { Badge } from "@/components/ui/Badge";
import { SpectrumRow, StepNumber } from "@/components/domain/Primitives";

const demo = buildResult(SAMPLE_TOPIC_SCORES);

/* ------------------------------------------------------------------ *
 * Subject preview — shared layout, per-subject data
 * ------------------------------------------------------------------ */

function SubjectPreview({ subject, page, reversed = false }) {
  const isMath = subject === "math";
  const result = isMath ? demo.math : demo.english;
  const domains = isMath ? MATH_DOMAINS : ENGLISH_DOMAINS;
  const tone = isMath ? "brand" : "accent";
  const Icon = isMath ? Sigma : BookOpen;

  const headlineTopics = result.topics.slice(0, 2).concat(prioritiseGaps(SAMPLE_TOPIC_SCORES, subject).slice(0, 3));
  const unique = [];
  for (const topic of headlineTopics) if (!unique.some((t) => t.id === topic.id)) unique.push(topic);
  const rows = unique.slice(0, 5).sort((a, b) => b.score - a.score);

  const gaps = prioritiseGaps(SAMPLE_TOPIC_SCORES, subject).slice(0, 2);

  return (
    <Section tone={isMath ? "canvas" : "surface"} aria-labelledby={`${subject}-preview-heading`}>
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <Reveal className={cn(reversed && "lg:order-2")}>
            <p className="eyebrow flex items-center gap-2">
              <Icon className={cn("size-3.5", isMath ? "text-brand" : "text-accent")} aria-hidden="true" />
              {page.eyebrow}
            </p>
            <h2
              id={`${subject}-preview-heading`}
              className="mt-3 font-display text-[clamp(1.7rem,3.2vw,2.45rem)] leading-[1.1] tracking-[-0.028em] text-ink"
            >
              {page.title}
            </h2>
            <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">{page.body}</p>

            <ul className="mt-7 space-y-3">
              {page.whatYouGet.slice(0, 4).map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", isMath ? "bg-brand" : "bg-accent")} aria-hidden="true" />
                  <span>
                    <span className="block text-[14px] font-semibold text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">{item.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-1.5">
              {(isMath ? MATH_TOPICS : ENGLISH_TOPICS).map((topic) => (
                <span key={topic.id} className="rounded-[5px] border border-line bg-surface-2 px-2 py-1 text-[11.5px] text-ink-soft">
                  {topic.name}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={isMath ? "/math-diagnostic" : "/english-diagnostic"} variant={isMath ? "brand" : "primary"} iconRight={ArrowRight}>
                Explore the {isMath ? "Mathematics" : "English"} diagnostic
              </Button>
              <Button href="/student/diagnostic/start" variant="ghost" size="md">
                Take it now
              </Button>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={0.08} className={cn(reversed && "lg:order-1")}>
            <div className={cn("rounded-xl border bg-surface p-5 shadow-md sm:p-6", isMath ? "border-brand-line/70" : "border-accent-line/70")}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">{isMath ? "Mathematics" : "English"} · sample result</p>
                  <p className="mt-2 text-[13px] text-muted">Amina Y. · Grade 10 · 6 September 2026</p>
                </div>
                <CircularProgress
                  value={result.score}
                  size={92}
                  stroke={8}
                  tone={tone}
                  suffix="%"
                  label={null}
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {domains.map((domain) => {
                  const domainResult = result.domains.find((d) => d.id === domain.id);
                  const score = domainResult?.score ?? 0;
                  return (
                    <div key={domain.id} className="rounded-md border border-line bg-surface-2 px-3 py-2.5">
                      <p className="truncate text-[10.5px] uppercase tracking-[0.08em] text-faint">{domain.short}</p>
                      <p className={cn("tnum mt-1 font-display text-[19px] leading-none", score >= 80 ? "text-strong" : score >= 60 ? "text-ink" : "text-risk")}>
                        {score}%
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-line pt-4">
                <p className="eyebrow mb-2">Measured skills</p>
                <ul className="divide-y divide-line">
                  {rows.map((row, index) => (
                    <li key={row.id}>
                      <SpectrumRow name={row.name} score={row.score} domain={row.domainName} size="sm" delay={index * 70} />
                    </li>
                  ))}
                </ul>
              </div>

              {gaps.length ? (
                <div className={cn("mt-5 rounded-md border p-3.5", isMath ? "border-brand-line bg-brand-soft/50" : "border-accent-line bg-accent-soft/50")}>
                  <p className={cn("flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.09em]", isMath ? "text-brand" : "text-accent")}>
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    What Prisma would say
                  </p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink">
                    Focus on <strong className="font-semibold">{gaps[0].name}</strong>
                    {gaps[1] ? <> and <strong className="font-semibold">{gaps[1].name}</strong></> : null} — together they account
                    for about {(gaps.reduce((a, g) => a + g.impact, 0)).toFixed(1)} points of this score.
                  </p>
                </div>
              ) : null}

              <div className="mt-5 flex items-center gap-4 border-t border-line pt-4 text-[11.5px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Timer className="size-3.5" aria-hidden="true" />
                  {isMath ? "12–15 min" : "14–18 min"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sigma className="size-3.5" aria-hidden="true" />
                  {isMath ? MATH_TOPICS.length : ENGLISH_TOPICS.length} skills measured
                </span>
                <Link
                  href={isMath ? "/math" : "/english"}
                  className="ml-auto font-medium text-brand hover:underline"
                >
                  Topic map
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function MathPreview() {
  return <SubjectPreview subject="math" page={MATH_DIAGNOSTIC_PAGE} />;
}

export function EnglishPreview() {
  return <SubjectPreview subject="english" page={ENGLISH_DIAGNOSTIC_PAGE} reversed />;
}

/* ------------------------------------------------------------------ *
 * Personalised learning path preview
 * ------------------------------------------------------------------ */

export function PathPreview() {
  const path = buildLearningPath(SAMPLE_TOPIC_SCORES, { weeks: 4, weeklyMinutes: 240 });
  const weeks = path.weeks.slice(0, 3);
  const first = SAMPLE_TIMELINE[0];
  const latest = SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1];
  const firstResult = buildResult(first.topics);
  const latestResult = buildResult(latest.topics);

  return (
    <Section tone="canvas" aria-labelledby="path-heading">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow={STORY.personalization.eyebrow}
            title={STORY.personalization.title}
            body={STORY.personalization.body}
            action={
              <Button href="/personalized-learning" variant="secondary" iconRight={ArrowRight}>
                How the engine works
              </Button>
            }
          />
        </Reveal>

        <Reveal variant="stagger" stagger={0.08} className="mt-12 grid gap-5 lg:grid-cols-3">
          {weeks.map((week, index) => (
            <article key={week.index} className="relative flex flex-col rounded-lg border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md">
              <div className="flex items-center justify-between gap-3">
                <StepNumber n={week.index} tone={week.subject === "math" ? "brand" : "accent"} />
                <Badge tone={week.subject === "math" ? "brand" : "accent"} size="xs">
                  {week.subjectName}
                </Badge>
              </div>

              <h3 className="mt-4 font-display text-[19px] leading-snug tracking-[-0.02em] text-ink">{week.topicName}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{week.goal}</p>

              <ol className="mt-4 space-y-2 border-t border-line pt-4">
                {week.units.map((unit) => (
                  <li key={unit.key} className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-1 grid size-4 shrink-0 place-items-center rounded-full border font-mono text-[9px]",
                        unit.type === "assessment"
                          ? "border-developing/30 bg-developing-soft text-developing"
                          : unit.type === "practice"
                            ? "border-accent-line bg-accent-soft text-accent"
                            : "border-line bg-surface-2 text-muted",
                      )}
                      aria-hidden="true"
                    >
                      {unit.order}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{unit.title}</span>
                    </span>
                    <span className="tnum shrink-0 text-[11px] text-faint">{unit.minutes}m</span>
                  </li>
                ))}
              </ol>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="tnum text-[12px] text-muted">{week.minutes} min this week</span>
                <span className="tnum text-[12px] font-semibold text-strong">
                  {week.fromScore}% → {week.toScore}%
                </span>
              </div>

              {index === 0 ? (
                <span className="absolute -top-2.5 left-5 rounded-full border border-brand-line bg-brand px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white">
                  Generated from your gaps
                </span>
              ) : null}
            </article>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          <div className="bg-surface px-5 py-4">
            <p className="eyebrow">Weeks in this plan</p>
            <p className="tnum mt-1.5 font-display text-[26px] leading-none text-ink">{path.weeks.length}</p>
          </div>
          <div className="bg-surface px-5 py-4">
            <p className="eyebrow">Total study time</p>
            <p className="tnum mt-1.5 font-display text-[26px] leading-none text-ink">
              {path.totalMinutes}
              <span className="ml-1 font-sans text-[12px] text-faint">min</span>
            </p>
          </div>
          <div className="bg-surface px-5 py-4">
            <p className="eyebrow">Projected Mathematics</p>
            <p className="tnum mt-1.5 font-display text-[26px] leading-none text-strong">
              {latestResult.math.score}% <span className="text-faint">→</span> {path.projection.math.after}%
            </p>
            <p className="mt-1 text-[11px] text-muted">
              Up from {firstResult.math.score}% at the March baseline
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-lg border border-line bg-surface-2 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[14px] font-semibold text-ink">{PERSONALIZED_LEARNING_PAGE.contrast.title}</p>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">{PERSONALIZED_LEARNING_PAGE.contrast.body}</p>
            </div>
            <Button href="/personalized-learning" variant="secondary" size="sm" iconRight={ArrowRight}>
              See both plans
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Domain coverage strip (used by /subjects/* and homepage)
 * ------------------------------------------------------------------ */

export function DomainStrip({ subject }) {
  const domains = subject === "math" ? MATH_DOMAINS : ENGLISH_DOMAINS;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain) => {
        const topics = topicsForDomain(domain.id);
        return (
          <div key={domain.id} className="rounded-lg border border-line bg-surface p-5">
            <p className="eyebrow">{domain.name}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{domain.description}</p>
            <ul className="mt-4 space-y-1.5 border-t border-line pt-3.5">
              {topics.map((topic) => (
                <li key={topic.id} className="flex items-center justify-between gap-3 text-[12.5px]">
                  <span className="truncate text-ink-soft">{topic.name}</span>
                  <span className="tnum shrink-0 text-[11px] text-faint">{topic.weight}%</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
