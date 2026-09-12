import Link from "next/link";
import { ArrowRight, GitBranch, Layers } from "lucide-react";

import { cn } from "@/lib/utils";
import { topicHref } from "@/lib/data/topicRoutes";
import { SUBJECT_DOMAINS, SUBJECT_TOPICS } from "@/lib/data/topics";
import { SAMPLE_TOPIC_SCORES } from "@/lib/data/sampleResult";
import { buildResult } from "@/lib/engine/scoring";
import { bandFor } from "@/lib/data/brand";
import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import { TopicCard } from "@/components/ui/Cards";
import ProgressBar from "@/components/ui/ProgressBar";

const LEVELS = [
  { id: "Foundation", label: "Foundation", note: "The base everything else rests on" },
  { id: "Core", label: "Core", note: "Where most marks are decided" },
  { id: "Advanced", label: "Advanced", note: "The skills that separate good from strong" },
];

/**
 * Shared visual topic map for /subjects/math and /subjects/english.
 * Columns are domains, rows are difficulty levels — the shape of the curriculum.
 */
export default function SubjectMap({ subject, copy }) {
  const domains = SUBJECT_DOMAINS[subject];
  const topics = SUBJECT_TOPICS[subject];
  const result = buildResult(SAMPLE_TOPIC_SCORES)[subject];
  const tone = subject === "math" ? "brand" : "accent";

  return (
    <>
      <PageHero decor={subject === "math" ? "math" : "english"}
        eyebrow={copy.eyebrow}
        title={copy.mapTitle}
        body={copy.mapBody}
        actions={[
          { label: `Start the ${subject === "math" ? "Mathematics" : "English"} diagnostic`, href: `/student/diagnostic/${subject}` },
          { label: "How scoring works", href: "/how-it-works", variant: "secondary" },
        ]}
        meta={[
          { label: "Domains", value: String(domains.length) },
          { label: "Measured skills", value: String(topics.length) },
          { label: "Learning units", value: String(topics.reduce((a, t) => a + t.units.length, 0)) },
          { label: "Total weighting", value: "100", suffix: "%" },
        ]}
      />

      {/* ---- the map ---- */}
      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="The map"
            title="Domains across, difficulty down."
            body="Every measured skill sits at exactly one point on this grid. A gap low on the grid explains failures higher up — which is why Prisma reports position, not just score."
            action={
              <div className="hidden items-center gap-3 sm:flex">
                <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
                  <span className="size-2 rounded-full bg-strong" aria-hidden="true" /> Strong
                </span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
                  <span className="size-2 rounded-full bg-developing" aria-hidden="true" /> Developing
                </span>
                <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
                  <span className="size-2 rounded-full bg-risk" aria-hidden="true" /> Needs work
                </span>
              </div>
            }
          />
        </Reveal>

        <div className="scroll-slim mt-10 overflow-x-auto pb-2">
          <div className="min-w-[820px]">
            {/* column headers */}
            <div className="grid gap-3" style={{ gridTemplateColumns: `150px repeat(${domains.length}, minmax(0,1fr))` }}>
              <div />
              {domains.map((domain) => {
                const domainResult = result.domains.find((d) => d.id === domain.id);
                return (
                  <div key={domain.id} className={cn("rounded-lg border p-4", tone === "brand" ? "border-brand-line bg-brand-soft/40" : "border-accent-line bg-accent-soft/40")}>
                    <p className="text-[13.5px] font-semibold tracking-[-0.012em] text-ink">{domain.name}</p>
                    <p className="mt-1 text-[11.5px] leading-snug text-muted">{domain.description}</p>
                    <p className="tnum mt-2.5 font-display text-[22px] leading-none text-ink">
                      {domainResult?.score ?? "—"}
                      <span className="ml-0.5 font-sans text-[11px] text-faint">%</span>
                    </p>
                  </div>
                );
              })}
            </div>

            {/* rows */}
            {LEVELS.map((level, rowIndex) => (
              <div
                key={level.id}
                className="mt-3 grid items-stretch gap-3"
                style={{ gridTemplateColumns: `150px repeat(${domains.length}, minmax(0,1fr))` }}
              >
                <div className="flex flex-col justify-center rounded-lg border border-line bg-canvas px-4 py-3">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-faint">
                    {String(rowIndex + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1 text-[13.5px] font-semibold text-ink">{level.label}</p>
                  <p className="mt-1 text-[11px] leading-snug text-muted">{level.note}</p>
                </div>

                {domains.map((domain) => {
                  const cellTopics = topics.filter((t) => t.domain === domain.id && t.level === level.id);
                  return (
                    <div key={`${domain.id}-${level.id}`} className="flex flex-col gap-2">
                      {cellTopics.length ? (
                        cellTopics.map((topic) => {
                          const score = SAMPLE_TOPIC_SCORES[topic.id];
                          const band = bandFor(score);
                          return (
                            <Link
                              key={topic.id}
                              href={topicHref(topic.id)}
                              className="group flex-1 rounded-md border border-line bg-surface p-3 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-px hover:border-line-3 hover:shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-[12.5px] font-semibold leading-snug text-ink">{topic.name}</p>
                                <span className={cn("tnum shrink-0 text-[12px] font-semibold", band.tone === "strong" ? "text-strong" : band.tone === "developing" ? "text-developing" : "text-risk")}>
                                  {score}%
                                </span>
                              </div>
                              <ProgressBar value={score} size="xs" className="mt-2" />
                              <p className="mt-2 flex items-center gap-1 text-[10.5px] text-faint">
                                <Layers className="size-3" aria-hidden="true" />
                                {topic.weight}% weight · {topic.units.length} units
                              </p>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="flex-1 rounded-md border border-dashed border-line bg-canvas/60" aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            <p className="mt-5 flex items-center gap-2 text-[12px] text-muted">
              <GitBranch className="size-3.5" aria-hidden="true" />
              Percentages shown are the sample learner's mastery. Your own map is generated from your answers.
            </p>
          </div>
        </div>
      </MarketingSection>

      {/* ---- topic detail cards ---- */}
      <MarketingSection tone="canvas">
        <Reveal>
          <SectionHeading
            eyebrow="Every skill in detail"
            title={copy.detailTitle}
            body="Sub-skills, the errors we typically see, and the learning units a plan will use if this skill shows up as a gap."
          />
        </Reveal>

        {domains.map((domain) => (
          <div key={domain.id} className="mt-10 first:mt-8">
            <Reveal>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3">
                <h3 className="font-display text-[20px] leading-none tracking-[-0.02em] text-ink">{domain.name}</h3>
                <p className="text-[12.5px] text-muted">
                  {topics.filter((t) => t.domain === domain.id).length} skills ·{" "}
                  {topics.filter((t) => t.domain === domain.id).reduce((a, t) => a + t.weight, 0)}% of the subject score
                </p>
              </div>
            </Reveal>

            <Reveal variant="stagger" stagger={0.06} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {topics
                .filter((topic) => topic.domain === domain.id)
                .map((topic) => (
                  <div key={topic.id} className="flex flex-col">
                    <TopicCard topic={topic} score={SAMPLE_TOPIC_SCORES[topic.id]} href={topicHref(topic.id)} className="flex-1" />
                    <div className="mt-2 rounded-md border border-line bg-surface-2 px-3 py-2.5">
                      <p className="eyebrow mb-1.5">Common errors</p>
                      <ul className="space-y-1">
                        {topic.commonErrors.slice(0, 2).map((error) => (
                          <li key={error} className="flex gap-1.5 text-[11.5px] leading-snug text-muted">
                            <span className="mt-1 size-1 shrink-0 rounded-full bg-risk/60" aria-hidden="true" />
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </Reveal>
          </div>
        ))}
      </MarketingSection>

      <CtaBand
        title={copy.ctaTitle}
        body={copy.ctaBody}
        primary={{ label: "Start the diagnostic", href: `/student/diagnostic/${subject}` }}
        secondary={{ label: "Read a sample report", href: "/sample-report" }}
        note={
          <>
            Also available:{" "}
            <Link href={subject === "math" ? "/english" : "/math"} className="font-medium text-brand hover:underline">
              the {subject === "math" ? "English" : "Mathematics"} skill map
              <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
            </Link>
          </>
        }
      />
    </>
  );
}
