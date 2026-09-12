import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Layers, ListChecks } from "lucide-react";

import { cn } from "@/lib/utils";
import { topicHref } from "@/lib/data/topicRoutes";
import { FAQS } from "@/lib/data/faq";
import { MATH_DOMAINS, ENGLISH_DOMAINS, topicsForDomain, SUBJECT_TOPICS } from "@/lib/data/topics";
import { SAMPLE_TOPIC_SCORES } from "@/lib/data/sampleResult";
import { questionsForSubject } from "@/lib/data/questions";
import { buildResult } from "@/lib/engine/scoring";
import { prioritiseGaps } from "@/lib/engine/diagnose";
import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import CircularProgress from "@/components/ui/CircularProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import { DiagnosisCallout, SpectrumRow } from "@/components/domain/Primitives";

/**
 * Shared template for the two public diagnostic explainers
 * (/diagnostic/math and /diagnostic/english).
 */
export default function DiagnosticPage({ subject, copy, faqCategory }) {
  const isMath = subject === "math";
  const tone = isMath ? "brand" : "accent";
  const domains = isMath ? MATH_DOMAINS : ENGLISH_DOMAINS;
  const topics = SUBJECT_TOPICS[subject];
  const result = buildResult(SAMPLE_TOPIC_SCORES)[subject];
  const gaps = prioritiseGaps(SAMPLE_TOPIC_SCORES, subject);

  const samples = questionsForSubject(subject)
    .filter((q) => !q.stimulus)
    .slice(0, 3);

  const faqs = FAQS.filter((item) => item.category === faqCategory).slice(0, 4);

  return (
    <>
      <PageHero decor={subject === "math" ? "math" : "english"}
        eyebrow={copy.eyebrow}
        title={copy.title}
        body={copy.body}
        actions={[
          { label: `Start the ${isMath ? "Mathematics" : "English"} diagnostic`, href: `/student/diagnostic/${subject}/test` },
          { label: "See a sample report", href: "/sample-report", variant: "secondary" },
        ]}
        meta={[
          { label: "Questions", value: isMath ? "15" : "15", hint: "30 in a full diagnostic" },
          { label: "Skills measured", value: String(topics.length) },
          { label: "Typical time", value: isMath ? "12–15" : "14–18", suffix: " min" },
          { label: "Levels", value: isMath ? "Grades 5–12" : "A1 → C1" },
        ]}
      />

      {/* ---- what you get ---- */}
      <MarketingSection tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="What you receive"
              title="A report you can act on the same day."
              body="Five things come back with every diagnostic — and none of them is a single number."
              size="md"
            />
            <ul className="mt-8 space-y-5">
              {copy.whatYouGet.map((item, index) => (
                <li key={item.title} className="flex gap-4">
                  <span className={cn("tnum mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border font-mono text-[11px]", tone === "brand" ? "border-brand-line bg-brand-soft text-brand" : "border-accent-line bg-accent-soft text-accent")}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold tracking-[-0.012em] text-ink">{item.title}</span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-muted">{item.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="scale" delay={0.08}>
            <div className={cn("rounded-xl border bg-surface p-6 shadow-md", tone === "brand" ? "border-brand-line/70" : "border-accent-line/70")}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">Sample {isMath ? "Mathematics" : "English"} report</p>
                  <p className="mt-2 text-[13px] text-muted">Amina Y. · Grade 10</p>
                </div>
                <CircularProgress value={result.score} size={96} stroke={8} tone={tone} />
              </div>

              <div className="mt-6 space-y-4">
                {result.domains.map((domain) => (
                  <div key={domain.id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <p className="text-[13px] font-semibold text-ink">{domain.name}</p>
                      <p className={cn("tnum text-[13px] font-semibold", domain.score >= 80 ? "text-strong" : domain.score >= 60 ? "text-developing" : "text-risk")}>
                        {domain.score}%
                      </p>
                    </div>
                    <ProgressBar value={domain.score} size="sm" />
                    <ul className="mt-2.5 space-y-1 pl-3">
                      {domain.topics.map((topic) => (
                        <li key={topic.id} className="flex items-baseline justify-between gap-3 text-[12.5px]">
                          <span className="truncate text-muted">{topic.name}</span>
                          <span className="tnum shrink-0 font-medium text-ink-soft">{topic.score}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <Link href={`/student/diagnostic/${subject}-analysis`} className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline">
                Open the full analysis
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </MarketingSection>

      {/* ---- skill map ---- */}
      <MarketingSection tone="canvas">
        <Reveal>
          <SectionHeading
            eyebrow="The skill map"
            title={isMath ? "Twelve measured skills across three domains." : "Thirteen measured skills across four domains."}
            body="Each percentage beside a topic is its weight in the diagnostic — the share of your score it explains. Weights are what allow Prisma to rank gaps by real impact."
            action={
              <Button href={`/${subject}`} variant="secondary" size="sm" iconRight={ArrowRight}>
                Full topic map
              </Button>
            }
          />
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain, index) => {
            const domainTopics = topicsForDomain(domain.id);
            const domainResult = result.domains.find((d) => d.id === domain.id);
            return (
              <Reveal key={domain.id} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-lg border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-[18px] leading-none tracking-[-0.02em] text-ink">{domain.name}</h3>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{domain.description}</p>
                    </div>
                    {domainResult ? (
                      <span className={cn("tnum shrink-0 font-display text-[22px] leading-none", domainResult.score >= 80 ? "text-strong" : domainResult.score >= 60 ? "text-developing" : "text-risk")}>
                        {domainResult.score}%
                      </span>
                    ) : null}
                  </div>

                  <ul className="mt-4 space-y-2 border-t border-line pt-4">
                    {domainTopics.map((topic) => {
                      const score = SAMPLE_TOPIC_SCORES[topic.id];
                      return (
                        <li key={topic.id}>
                          <div className="mb-1 flex items-baseline justify-between gap-3">
                            <Link
                              href={topicHref(topic.id)}
                              className="truncate text-[13px] text-ink-soft transition-colors hover:text-brand"
                            >
                              {topic.name}
                            </Link>
                            <span className="tnum shrink-0 text-[11.5px] font-medium text-ink">{score}%</span>
                          </div>
                          <ProgressBar value={score} size="xs" />
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-auto flex items-center gap-1.5 border-t border-line pt-3.5 text-[11.5px] text-faint">
                    <Layers className="size-3.5" aria-hidden="true" />
                    {domainTopics.reduce((acc, t) => acc + t.weight, 0)}% of the {isMath ? "Mathematics" : "English"} score
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </MarketingSection>

      {/* ---- sample items ---- */}
      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Inside the diagnostic"
            title="What the questions actually look like."
            body="Every item is tagged to one skill and one difficulty band, so your answer changes the map rather than just the total."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {samples.map((question, index) => (
            <Reveal key={question.id} delay={index * 0.06}>
              <article className="flex h-full flex-col rounded-lg border border-line bg-canvas p-5">
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={tone} size="xs">
                    {question.difficulty === "foundation" ? "Foundation" : question.difficulty === "core" ? "Core" : "Advanced"}
                  </Badge>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">Item {index + 1}</span>
                </div>

                <p className="mt-3.5 text-[14.5px] font-medium leading-relaxed text-ink">{question.prompt}</p>

                <ul className="mt-4 flex-1 space-y-1.5">
                  {question.options.map((option, optionIndex) => {
                    const correct = optionIndex === question.answer;
                    return (
                      <li
                        key={option}
                        className={cn(
                          "flex items-start gap-2.5 rounded-md border px-3 py-2 text-[13px] leading-snug",
                          correct ? "border-strong/30 bg-strong-soft text-ink" : "border-line bg-surface text-ink-soft",
                        )}
                      >
                        <span className={cn("mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border text-[9px] font-semibold", correct ? "border-strong bg-strong text-white" : "border-line-2 text-faint")} aria-hidden="true">
                          {correct ? <CheckCircle2 className="size-3" /> : String.fromCharCode(65 + optionIndex)}
                        </span>
                        {option}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 rounded-md border border-line bg-surface p-3">
                  <p className="eyebrow">Why this answer</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">{question.explanation}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </MarketingSection>

      {/* ---- format + diagnosis ---- */}
      <MarketingSection tone="canvas">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Format" title="How the assessment runs." size="md" />
            <dl className="mt-6 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
              {copy.format.map((row) => (
                <div key={row.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[140px_1fr] sm:gap-4">
                  <dt className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em] text-faint">
                    {row.label}
                  </dt>
                  <dd className="text-[13.5px] leading-relaxed text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 space-y-2.5">
              {[
                { icon: Clock, text: "Pause and resume — progress is saved automatically." },
                { icon: ListChecks, text: "Flag an item and return to it before submitting." },
                { icon: CheckCircle2, text: "Every answer is explained after submission." },
              ].map((row) => (
                <li key={row.text} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                  <row.icon className="mt-0.5 size-4 shrink-0 text-strong" aria-hidden="true" />
                  {row.text}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={0.06}>
              <DiagnosisCallout
                tone={tone}
                label={`Sample ${isMath ? "Mathematics" : "English"} diagnosis`}
                text={
                  gaps.length
                    ? `You are strong in ${result.topics[0].name.toLowerCase()} but need more practice with ${gaps
                        .slice(0, 2)
                        .map((g) => g.name.toLowerCase())
                        .join(" and ")}.`
                    : "No significant gaps were found in this subject."
                }
                tip="Generated from the sample learner's topic scores. Your own wording is built the same way from your answers."
              />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-lg border border-line bg-surface p-5">
                <p className="eyebrow mb-3">Gaps ranked by impact</p>
                <ul className="divide-y divide-line">
                  {gaps.slice(0, 5).map((gap, index) => (
                    <li key={gap.id}>
                      <SpectrumRow
                        name={gap.name}
                        score={gap.score}
                        size="sm"
                        delay={index * 60}
                        meta={`worth ~${gap.impact} pts`}
                        href={topicHref(gap.id)}
                      />
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-line pt-3.5 text-[12.5px] leading-relaxed text-muted">
                  Impact is the topic's weight multiplied by its distance from a strong score — the number of
                  points you would recover by closing that gap.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <Accordion items={faqs.map((item) => ({ ...item, content: item.answer }))} />
            </Reveal>
          </div>
        </div>
      </MarketingSection>

      <CtaBand
        title={isMath ? "Find out which part of mathematics is holding you back." : "Find out which part of English is holding you back."}
        body="The diagnostic is free on the entry plan, runs in about fifteen minutes for a single subject, and reports every skill separately."
        primary={{ label: `Start the ${isMath ? "Mathematics" : "English"} test`, href: `/student/diagnostic/${subject}/test` }}
        secondary={{ label: "Browse the topic map", href: `/${subject}` }}
      />
    </>
  );
}
