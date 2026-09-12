"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, CheckCircle2, CircleAlert, Dumbbell, Lightbulb, Route, Sigma, Target } from "lucide-react";

import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { getTopic, domainsForSubject, topicsForDomain, TOPIC_BY_ID } from "@/lib/data/topics";
import { questionsForTopic } from "@/lib/data/questions";
import { classify, prioritiseGaps } from "@/lib/engine/diagnose";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, SectionHeading } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { SpectrumRow } from "@/components/domain/Primitives";
import { ChartCard, TopicBars } from "@/components/charts";

import { TOPIC_ROUTES, DOMAIN_ROUTES, topicHref, domainHref } from "@/lib/data/topicRoutes";

export { TOPIC_ROUTES, DOMAIN_ROUTES, topicHref, domainHref };

const bandTone = (score) => (score >= 80 ? "strong" : score >= 60 ? "developing" : "risk");
const BAND_TEXT = { strong: "text-strong", developing: "text-developing", risk: "text-risk" };
const bandText = (score) => BAND_TEXT[bandTone(score)];

function startPractice(router, startTest, topicId, toast) {
  const topic = getTopic(topicId);
  startTest({ subject: topic.subject, questions: questionsForTopic(topicId).slice(0, 6), timed: false });
  toast(`Practice set: ${topic.name}. Explanations after every answer.`, { tone: "info", title: "Practice started" });
  router.push(`/student/practice?topic=${topicId}`);
}

/* ======================================================= subject hub (32/33) */

export function SubjectHub({ subject }) {
  const router = useRouter();
  const { topicScores, derived, startTest, toast } = useApp();
  const meta = derived.breakdown[subject];
  const domains = meta.domains;
  const isMath = subject === "math";

  return (
    <div className="space-y-5">
      <Card className={cn("relative overflow-hidden p-6", isMath ? "math-plot" : "eng-rule")}>
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-2">
              {isMath ? <Sigma className="size-3.5 text-brand" aria-hidden="true" /> : <BookOpen className="size-3.5 text-accent" aria-hidden="true" />}
              {isMath ? "Mathematics" : "English"} learning
            </p>
            <h1 className="mt-2 font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">
              {isMath ? "Arithmetic, algebra and geometry — measured separately." : "Grammar, vocabulary, reading and listening — measured separately."}
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
              {meta.topicCount} skills across {meta.domains.length} domains. Open a domain for its topics, or a topic
              for concepts, classic errors and a practice set.
            </p>
          </div>
          <div className="text-right">
            <p className={cn("tnum font-display text-[46px] leading-none tracking-[-0.035em]", isMath ? "text-brand" : "text-accent")}>
              {meta.score}
              <span className="ml-1 font-sans text-[15px] text-faint">%</span>
            </p>
            <Badge tone={bandTone(meta.score)} size="sm" className="mt-2">{classify(meta.score).label}</Badge>
          </div>
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2.5">
          <Button size="md" onClick={() => startPractice(router, startTest, meta.topics[meta.topics.length - 1]?.id ?? meta.topics[0].id, toast)}>
            <Dumbbell className="size-4" aria-hidden="true" />
            Practice weakest topic
          </Button>
          <Button href={`/student/diagnostic/start`} variant="secondary" size="md">Retake {isMath ? "math" : "English"} paper</Button>
          <Button href={`/student/diagnostic/analysis`} variant="ghost" size="md">Full analysis</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {domains.map((domain) => {
          const topics = domain.topics;
          return (
            <Card key={domain.id} className="card-lift rule-top relative overflow-hidden p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link href={domainHref(domain.id)} className="font-display text-[19px] leading-snug tracking-[-0.02em] text-ink hover:text-brand">
                    {domain.name}
                  </Link>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{domain.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={cn("tnum font-display text-[26px] leading-none", bandText(domain.score))}>{domain.score}%</p>
                  <ProgressBar value={domain.score} tone={bandTone(domain.score)} size="xs" className="mt-1.5 w-20" />
                </div>
              </div>
              <ul className="mt-4 space-y-1">
                {topics.map((topic) => (
                  <li key={topic.id}>
                    <Link href={topicHref(topic.id)} className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-[12.5px] transition-colors hover:bg-surface-2">
                      <span className="truncate text-ink-soft">{topic.name}</span>
                      <span className={cn("tnum shrink-0 font-semibold", bandText(topic.score))}>{topic.score}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={domainHref(domain.id)} className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-brand hover:underline">
                Open {domain.short} <ArrowRight className="size-3" aria-hidden="true" />
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ===================================================== domain page (34/38-41) */

export function DomainStudy({ domainId }) {
  const router = useRouter();
  const { derived, startTest, toast } = useApp();
  const domain = derived.breakdown.math.domains.find((d) => d.id === domainId) ?? derived.breakdown.english.domains.find((d) => d.id === domainId);
  if (!domain) return null;
  const subject = domain.topics[0]?.subject ?? "math";
  const isMath = subject === "math";
  const weakest = [...domain.topics].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="space-y-5">
      <Card className={cn("relative overflow-hidden p-6", isMath ? "math-plot" : "eng-rule")}>
        <div className="relative">
          <p className="eyebrow">{isMath ? "Mathematics domain" : "English domain"}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
            <h1 className="font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">{domain.name}</h1>
            <div className="text-right">
              <p className={cn("tnum font-display text-[40px] leading-none", bandText(domain.score))}>{domain.score}%</p>
              <p className="mt-1 text-[11.5px] text-muted">domain mastery</p>
            </div>
          </div>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">{domain.description}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button size="md" onClick={() => startPractice(router, startTest, weakest.id, toast)}>
              <Dumbbell className="size-4" aria-hidden="true" />
              Practice {weakest.name}
            </Button>
            <Button href={`/student/skills`} variant="secondary" size="md">All skills</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <ChartCard title="Topics in this domain" description="Weighted into the domain score above.">
          <TopicBars data={domain.topics.map((t) => ({ name: t.name, score: t.score }))} />
        </ChartCard>
        <Card className="p-5">
          <SectionHeading eyebrow="Priority" title="Start here." size="sm" />
          <p className="mt-3 rounded-md border border-line bg-canvas p-3.5 text-[12.5px] leading-relaxed text-muted">
            <span className="font-semibold text-ink">{weakest.name}</span> is the weakest topic in this domain at{" "}
            <span className={cn("tnum font-semibold", bandText(weakest.score))}>{weakest.score}%</span>. Its weight
            in the subject score is {weakest.weight}%.
          </p>
          <ul className="mt-4 space-y-1.5">
            {domain.topics.map((topic) => (
              <li key={topic.id}>
                <Link href={topicHref(topic.id)} className="block rounded-md px-1 py-1 transition-opacity hover:opacity-75">
                  <SpectrumRow name={topic.name} score={topic.score} size="sm" meta={`${topic.weight}% weight`} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ====================================================== topic page (35-37) */

export function TopicStudy({ topicId }) {
  const router = useRouter();
  const { topicScores, attempts, derived, startTest, toast, path } = useApp();
  const topic = TOPIC_BY_ID[topicId];
  const score = topicScores[topicId] ?? null;
  const band = score === null ? null : classify(score);
  const questions = useMemo(() => questionsForTopic(topicId).slice(0, 3), [topicId]);
  const plan = derived.plan;
  const plannedUnits = plan.weeks.flatMap((w) => w.units).filter((u) => u.topicId === topicId);

  if (!topic) return null;
  const isMath = topic.subject === "math";

  return (
    <div className="space-y-5">
      {/* hero */}
      <Card className={cn("relative overflow-hidden p-6", isMath ? "math-plot" : "eng-rule")}>
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="eyebrow">
              <Link href={isMath ? "/student/math" : "/student/english"} className="hover:text-brand">
                {isMath ? "Mathematics" : "English"}
              </Link>
              {" → "}
              <Link href={domainHref(topic.domain)} className="hover:text-brand">{topic.domain}</Link>
            </p>
            <h1 className="mt-2 font-display text-[30px] leading-tight tracking-[-0.028em] text-ink">{topic.name}</h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">{topic.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="neutral" size="xs">{topic.level}</Badge>
              <Badge tone="neutral" size="xs">{topic.gradeBand}</Badge>
              <Badge tone="neutral" size="xs">weight {topic.weight}%</Badge>
              <Badge tone="neutral" size="xs">{attempts[topicId] ?? 0} attempts</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="eyebrow">Mastery</p>
            <p className={cn("tnum mt-1 font-display text-[52px] leading-none tracking-[-0.04em]", score === null ? "text-faint" : bandText(score))}>
              {score ?? "—"}
              {score !== null ? <span className="ml-1 font-sans text-[16px] text-faint">%</span> : null}
            </p>
            {band ? <Badge tone={bandTone(score)} size="sm" className="mt-2">{band.label}</Badge> : null}
          </div>
        </div>
        <div className="relative mt-5">
          <ProgressBar value={score ?? 0} tone={bandTone(score ?? 0)} size="sm" />
        </div>
        <div className="relative mt-5 flex flex-wrap gap-2.5">
          <Button size="md" onClick={() => startPractice(router, startTest, topicId, toast)}>
            <Dumbbell className="size-4" aria-hidden="true" />
            Start practice
          </Button>
          <Button href="/student/learning-path" variant="secondary" size="md">
            <Route className="size-4" aria-hidden="true" />
            See it in my path
          </Button>
          <Button href={`/student/diagnostic/analysis`} variant="ghost" size="md">Why this score?</Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading eyebrow="What you know" title="Skills already measured here." size="sm" />
          <ul className="mt-4 space-y-2">
            {topic.skills.map((skill) => (
              <li key={skill} className="flex items-start gap-2.5 text-[13px] text-ink-soft">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-strong" aria-hidden="true" />
                {skill}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <SectionHeading eyebrow="What you struggle with" title="The classic errors in this topic." size="sm" />
          <ul className="mt-4 space-y-2">
            {topic.commonErrors.map((error) => (
              <li key={error} className="flex items-start gap-2.5 text-[13px] text-ink-soft">
                <CircleAlert className="mt-0.5 size-4 shrink-0 text-risk" aria-hidden="true" />
                {error}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-md border border-line bg-canvas p-3 text-[12px] leading-relaxed text-muted">
            <Lightbulb className="mr-1.5 inline size-3.5 text-developing" aria-hidden="true" />
            Every practice explanation in Prisma names the error it prevents, not just the right answer.
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading eyebrow="Example problems" title="What this topic asks of you." size="sm" />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {questions.map((question, index) => (
            <div key={question.id} className="rounded-lg border border-line bg-canvas p-4">
              <p className="tnum font-mono text-[10.5px] text-faint">{String(index + 1).padStart(2, "0")} · {question.difficulty}</p>
              <p className="mt-2 font-mono text-[12.5px] leading-relaxed tracking-tight text-ink">{question.prompt}</p>
              <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-relaxed text-muted">{question.explanation}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <SectionHeading eyebrow="Recommended lessons" title={plannedUnits.length ? "Already in your path." : "Units this topic would add."} size="sm" />
          <ol className="mt-4 space-y-2">
            {(plannedUnits.length ? plannedUnits : topic.units.map((u, i) => ({ title: u.title, minutes: u.minutes, type: u.type, key: `preview-${i}` }))).map((unit, index) => (
              <li key={unit.key ?? index} className="flex items-center justify-between gap-3 rounded-md border border-line bg-canvas px-3.5 py-2.5">
                <span className="flex min-w-0 items-center gap-2.5 text-[12.5px] text-ink-soft">
                  <span className="tnum font-mono text-[10px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                  <span className="truncate">{unit.title}</span>
                </span>
                <span className="tnum shrink-0 text-[11.5px] text-muted">{unit.minutes} min</span>
              </li>
            ))}
          </ol>
        </Card>
        <Card className="flex flex-col justify-between p-5">
          <div>
            <SectionHeading eyebrow="Next step" title="Six questions, instant explanations." size="sm" />
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              A practice set draws from the same bank as the diagnostic, tagged to this topic. Your mastery updates the
              moment you finish — and so does the plan.
            </p>
          </div>
          <div className="mt-5 grid gap-2.5">
            <Button size="md" onClick={() => startPractice(router, startTest, topicId, toast)}>
              <Target className="size-4" aria-hidden="true" />
              Start practice set
            </Button>
            <Button href="/student/diagnostic/start" variant="ghost" size="sm">Or re-measure with a paper</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
