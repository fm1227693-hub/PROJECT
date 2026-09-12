"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Award, BookOpen, CalendarClock, Check, CheckCircle2, Clock, Download,
  Flag, Languages, ListChecks, Microscope, PartyPopper, Play, RotateCcw, Route, ScanLine, Sigma,
  Sparkles, Target, Timer,
} from "lucide-react";

import { cn, formatDate, formatDuration } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { buildDiagnosticSet, buildSubjectSet } from "@/lib/data/questions";
import { diagnose, compareSnapshots } from "@/lib/engine/diagnose";
import { MATH_TOPICS, ENGLISH_TOPICS } from "@/lib/data/topics";
import Button from "@/components/ui/Button";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import { Card, SectionHeading } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import CircularProgress from "@/components/ui/CircularProgress";
import Tabs from "@/components/ui/Tabs";
import { RadioCard, Segmented } from "@/components/ui/Field";
import { DiagnosisCallout, SpectrumRow, StrengthGapPanel } from "@/components/domain/Primitives";
import { ChartCard, TopicBars, SkillRadar } from "@/components/charts";
import { EmptyState } from "@/components/ui/States";
import Modal from "@/components/ui/Modal";

const SUBJECT_META = {
  math: { label: "Mathematics", icon: Sigma, tone: "brand", topics: MATH_TOPICS },
  english: { label: "English", icon: Languages, tone: "accent", topics: ENGLISH_TOPICS },
};

/* ============================================================ 43 · center == */

export function DiagnosticCenter() {
  const router = useRouter();
  const { diagnostics, activeTest, derived, topicScores } = useApp();
  const diagnosis = useMemo(() => diagnose(topicScores), [topicScores]);
  const latest = diagnostics[diagnostics.length - 1];

  const quickStart = (subject) => {
    router.push(`/student/diagnostic/start?subject=${subject}`);
  };

  return (
    <div className="space-y-6">
      {/* status strip */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Diagnostic center</p>
              <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">
                {activeTest ? "You have a test in progress." : "Measure, then understand, then plan."}
              </h1>
              <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-muted">
                {activeTest
                  ? "Pick up where you left off — your answers so far are saved in this session."
                  : "A full diagnostic takes 20–30 minutes and measures 25 skills. Subject-focused papers take about 13 minutes each."}
              </p>
            </div>
            {activeTest ? (
              <Button href={`/student/diagnostic/${activeTest.subject === "english" ? "english" : "math"}`} size="md">
                <Play className="size-4" aria-hidden="true" />
                Resume test
              </Button>
            ) : (
              <Button href="/student/diagnostic/start" size="md">
                <ScanLine className="size-4" aria-hidden="true" />
                Start a diagnostic
              </Button>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Object.entries(SUBJECT_META).map(([subject, meta]) => (
              <button
                key={subject}
                type="button"
                onClick={() => quickStart(subject)}
                className="card-lift rule-top relative flex items-center gap-4 overflow-hidden rounded-lg border border-line bg-canvas p-4 text-left"
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg border", meta.tone === "brand" ? "border-brand-line bg-brand-soft text-brand" : "border-accent-line bg-accent-soft text-accent")}>
                  <meta.icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-semibold text-ink">{meta.label} focus paper</span>
                  <span className="mt-0.5 block text-[12px] text-muted">15 questions · ~13 min · current {derived.breakdown[subject].score}%</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-faint" aria-hidden="true" />
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="eyebrow">Latest attempt</p>
          {latest ? (
            <>
              <p className="tnum mt-2 font-display text-[34px] leading-none tracking-[-0.03em] text-ink">
                {derived.breakdown.math.score}
                <span className="mx-1 text-[16px] text-faint">/</span>
                {derived.breakdown.english.score}
                <span className="ml-1.5 font-sans text-[12px] text-faint">math · english</span>
              </p>
              <p className="mt-2 text-[12px] text-muted">
                {latest.kind} · {formatDate(latest.date)} · {latest.durationMinutes} min
              </p>
              <div className="mt-4 grid gap-2">
                <Button href="/student/diagnostic/results" variant="secondary" size="sm" full>View results</Button>
                <Button href="/student/diagnostic/analysis" variant="ghost" size="sm" full>Detailed analysis</Button>
              </div>
            </>
          ) : (
            <EmptyState compact icon={ScanLine} title="No attempts yet" description="Your first diagnostic creates the baseline every later comparison uses." />
          )}
        </Card>
      </div>

      {/* what happens + history */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <SectionHeading eyebrow="What a diagnostic does" title="Three outputs, not one score." size="sm" />
          <ol className="mt-4 space-y-3">
            {[
              { icon: Microscope, title: "Topic-level mastery", body: "Every mark is attributed to one of 25 skills with a published weight." },
              { icon: Target, title: "Impact ranking", body: "Gaps ordered by weight × distance from target — what actually costs you points." },
              { icon: Route, title: "A generated plan", body: "The ranking becomes a sequenced, week-by-week path you can start immediately." },
            ].map((item, index) => (
              <li key={item.title} className="flex gap-3.5 rounded-md border border-line bg-canvas p-3.5">
                <span className="tnum grid size-7 shrink-0 place-items-center rounded-md border border-line bg-surface font-mono text-[10.5px] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink">
                    <item.icon className="size-3.5 text-brand" aria-hidden="true" />
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[12px] text-muted">
            Current focus from your latest data:{" "}
            <Link href="/student/recommendations" className="font-semibold text-brand hover:underline">
              {diagnosis.nextStep.title} →
            </Link>
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeading eyebrow="Attempt history" title="Every baseline you have set." size="sm" />
            <Badge tone="neutral" size="xs">{diagnostics.length}</Badge>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {[...diagnostics].reverse().slice(0, 6).map((entry) => {
              const result = entry.topics ? diagnose(entry.topics).result : null;
              return (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{entry.kind}</p>
                    <p className="mt-0.5 text-[11.5px] text-muted">
                      {formatDate(entry.date)} · {entry.durationMinutes} min · {entry.answered} answers
                    </p>
                  </div>
                  <div className="tnum shrink-0 text-right text-[12.5px] font-semibold text-ink">
                    {result ? `${result.math.score} / ${result.english.score}` : "—"}
                  </div>
                </li>
              );
            })}
          </ul>
          <Button href="/student/history" variant="ghost" size="sm" full className="mt-3">
            Full study history
          </Button>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================= 44 · setup == */

export function DiagnosticSetup() {
  const router = useRouter();
  const { startTest, patch, toast, settings } = useApp();
  const [subject, setSubject] = useState("both");
  const [timed, setTimed] = useState("untimed");
  const [length, setLength] = useState("standard");

  const counts = subject === "both" ? { math: 15, english: 15 } : subject === "math" ? { math: 15, english: 0 } : { math: 0, english: 15 };
  const total = counts.math + counts.english;
  const minutes = timed === "timed" ? (subject === "both" ? 26 : 13) : null;

  const begin = () => {
    const first = subject === "english" ? "english" : "math";
    const queue = subject === "both" ? ["english"] : [];
    const questions = subject === "both" ? buildSubjectSet("math", counts.math) : buildSubjectSet(subject, 15);
    patch({ pendingSubjects: queue, flowTimed: timed === "timed" });
    startTest({ subject: first, questions, timed: timed === "timed", durationMinutes: minutes ?? 13 });
    toast(`${SUBJECT_META[first].label} paper started. Good luck — answer honestly.`, { tone: "info", title: "Diagnostic started" });
    router.push(`/student/diagnostic/${first}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Card className="p-6">
        <p className="eyebrow">Diagnostic setup</p>
        <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">Choose what to measure.</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Both subjects gives the complete picture and unlocks the full learning path. A single subject is useful when
          you only have thirteen minutes or only one doubt.
        </p>

        <div className="mt-6 grid gap-3" role="radiogroup" aria-label="Subject">
          <RadioCard
            selected={subject === "both"}
            onSelect={() => setSubject("both")}
            title="Full diagnostic — Mathematics + English"
            description="30 questions · 20–30 minutes · the complete 25-skill report and plan."
            meta={<Badge tone="brand" size="xs">Recommended</Badge>}
            name="subject"
            value="both"
          />
          <RadioCard
            selected={subject === "math"}
            onSelect={() => setSubject("math")}
            title="Mathematics focus"
            description="15 questions · ~13 minutes · arithmetic, algebra and geometry."
            name="subject"
            value="math"
          />
          <RadioCard
            selected={subject === "english"}
            onSelect={() => setSubject("english")}
            title="English focus"
            description="15 questions · ~13 minutes · grammar, vocabulary, reading, listening."
            name="subject"
            value="english"
          />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-canvas p-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <Timer className="size-4 text-brand" aria-hidden="true" />
              Conditions
            </p>
            <div className="mt-3">
              <Segmented
                ariaLabel="Timing"
                options={[{ value: "untimed", label: "Untimed" }, { value: "timed", label: "Timed" }]}
                value={timed}
                onChange={setTimed}
                size="sm"
              />
            </div>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted">
              {timed === "timed"
                ? `A visible countdown of ${minutes} minutes. The timer is part of the measurement.`
                : "No clock. Recommended for your first baseline."}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-canvas p-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <ListChecks className="size-4 text-accent" aria-hidden="true" />
              Paper
            </p>
            <dl className="mt-3 space-y-1.5 text-[12.5px]">
              <div className="flex justify-between"><dt className="text-muted">Questions</dt><dd className="tnum font-semibold text-ink">{total}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Mathematics items</dt><dd className="tnum font-semibold text-ink">{counts.math}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">English items</dt><dd className="tnum font-semibold text-ink">{counts.english}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Length preset</dt><dd className="font-semibold text-ink">{length === "standard" ? "Standard" : "Standard"}</dd></div>
            </dl>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <p className="flex items-center gap-1.5 text-[12px] text-muted">
            <Clock className="size-3.5" aria-hidden="true" />
            You can pause between questions; answers are kept for this session.
          </p>
          <Button size="lg" onClick={begin}>
            Begin {subject === "both" ? "Mathematics paper" : SUBJECT_META[subject].label + " paper"}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </Card>

      <Card className="p-5">
        <p className="eyebrow mb-3">Before you start</p>
        <ul className="grid gap-2.5 text-[12.5px] leading-relaxed text-muted sm:grid-cols-2">
          <li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-strong" aria-hidden="true" />Work alone — the report describes you, so help distorts it.</li>
          <li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-strong" aria-hidden="true" />Flag anything unsure and revisit it from the palette.</li>
          <li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-strong" aria-hidden="true" />Guessing is fine; leaving blanks wastes information.</li>
          <li className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-strong" aria-hidden="true" />Results appear the moment you submit — no waiting.</li>
        </ul>
      </Card>
    </div>
  );
}

/* =========================================================== 47 · review == */

export function DiagnosticReview() {
  const router = useRouter();
  const { activeTest, goToQuestion, finishTest, startTest, patch, pendingSubjects, flowTimed, toast } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!activeTest) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Nothing to review"
        description="Review appears while a test is in progress. Start a diagnostic to see it here."
        action={<Button href="/student/diagnostic/start">Start a diagnostic</Button>}
      />
    );
  }

  const questions = activeTest.questions;
  const unanswered = questions.filter((q) => activeTest.answers[q.id] === undefined);
  const flagged = questions.filter((q) => activeTest.flagged?.includes(q.id));

  const submit = () => {
    const queue = pendingSubjects ?? [];
    finishTest();
    if (queue.length) {
      const next = queue[0];
      patch({ pendingSubjects: queue.slice(1) });
      startTest({ subject: next, questions: buildSubjectSet(next, 15), timed: Boolean(flowTimed), durationMinutes: 13 });
      toast(`${SUBJECT_META[next].label} paper is next. Same conditions.`, { tone: "info", title: "Half way there" });
      router.push(`/student/diagnostic/${next}`);
    } else {
      router.push("/student/diagnostic/completed");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Review before submitting</p>
            <h1 className="mt-2 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">
              {SUBJECT_META[activeTest.subject]?.label ?? "Diagnostic"} paper · {questions.length} questions
            </h1>
          </div>
          <div className="flex gap-2">
            <Badge tone={unanswered.length ? "developing" : "strong"} size="sm" dot>
              {unanswered.length ? `${unanswered.length} unanswered` : "All answered"}
            </Badge>
            {flagged.length ? <Badge tone="info" size="sm"><Flag className="size-3" aria-hidden="true" /> {flagged.length} flagged</Badge> : null}
          </div>
        </div>

        <ul className="mt-6 divide-y divide-line">
          {questions.map((question, index) => {
            const given = activeTest.answers[question.id];
            return (
              <li key={question.id} className="flex items-start gap-4 py-3.5">
                <span className="tnum mt-0.5 w-7 shrink-0 font-mono text-[11px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] leading-snug text-ink">{question.prompt}</p>
                  <p className="mt-1 text-[11.5px] text-muted">
                    {question.topicName ?? question.topicId}
                    {activeTest.flagged?.includes(question.id) ? " · flagged" : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={cn("text-[12.5px] font-semibold", given === undefined ? "text-developing" : "text-ink")}>
                    {given === undefined ? "Skipped" : question.type === "numeric" ? given : question.options[given]}
                  </p>
                  <button type="button" onClick={() => goToQuestion(index)} className="mt-1 text-[11.5px] font-medium text-brand hover:underline">
                    Change
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <Button variant="secondary" size="md" onClick={() => goToQuestion(questions.length - 1)}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to questions
          </Button>
          <Button size="lg" onClick={() => (unanswered.length ? setConfirmOpen(true) : submit())}>
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Submit paper
          </Button>
        </div>
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Submit with unanswered questions?" size="sm">
        <p className="text-[13.5px] leading-relaxed text-ink-soft">
          {unanswered.length} question{unanswered.length === 1 ? "" : "s"} have no answer. Unanswered items score zero and
          lower the topic scores they belong to. You can still submit — sometimes honesty about running out of time is
          the useful signal.
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button variant="ghost" size="md" onClick={() => setConfirmOpen(false)}>Keep reviewing</Button>
          <Button size="md" onClick={() => { setConfirmOpen(false); submit(); }}>Submit anyway</Button>
        </div>
      </Modal>
    </div>
  );
}

/* ======================================================== 48 · completed == */

export function DiagnosticCompleted() {
  const { diagnostics, gamification, derived } = useApp();
  const latest = diagnostics[diagnostics.length - 1];

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="relative overflow-hidden p-8 text-center">
        <div className="field-warm pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <span className="mx-auto grid size-14 place-items-center rounded-full border border-strong/25 bg-strong-soft text-strong">
            <PartyPopper className="size-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-[30px] leading-tight tracking-[-0.028em] text-ink">
            Your diagnostic is complete.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-muted">
            {latest?.kind} scored and merged into your profile. The report below is computed from your answers — not a
            template with your name on it.
          </p>

          <dl className="mx-auto mt-7 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
            {[
              { label: "Answered", value: String(latest?.answered ?? 0) },
              { label: "Time", value: `${latest?.durationMinutes ?? 0}m` },
              { label: "XP earned", value: `+${40 + Math.round((latest?.accuracy ?? 0) * 0.6)}` },
            ].map((item) => (
              <div key={item.label} className="bg-surface px-4 py-3.5">
                <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{item.label}</dt>
                <dd className="tnum mt-1 font-display text-[22px] leading-none text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            <Button href="/student/diagnostic/results" size="lg">
              <Award className="size-4" aria-hidden="true" />
              View my results
            </Button>
            <Button href="/student/diagnostic/analysis" variant="secondary" size="lg">
              <Microscope className="size-4" aria-hidden="true" />
              Detailed analysis
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-2.5">
            <Button href="/student/recommendations" variant="ghost" size="md">See recommendations</Button>
            <Button href="/student/diagnostic/start" variant="ghost" size="md">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Retake later
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ========================================================== 49 · results == */

export function DiagnosticResults() {
  const router = useRouter();
  const { topicScores, derived, previous, generatePath, toast } = useApp();
  const diagnosis = useMemo(() => diagnose(topicScores), [topicScores]);
  const { breakdown } = derived;

  const movements = previous ? compareSnapshots(previous.topics, topicScores) : [];
  const gain = movements.reduce((acc, row) => acc + Math.max(0, row.delta), 0);

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden p-6 md:p-8">
        <div className="field-brand pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Overall results</p>
              <h1 className="mt-2 font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">
                Here is where you actually stand.
              </h1>
            </div>
            {previous ? <DeltaTag value={breakdown.math.score - (previous.topics ? diagnose(previous.topics).result.math.score : breakdown.math.score)} /> : null}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-line bg-surface p-6 text-center">
              <CircularProgress value={breakdown.math.score} size={132} stroke={10} tone="brand" label="Mathematics" delay={200} />
              <p className="mt-3 text-[12px] text-muted">{breakdown.math.topicCount} skills measured</p>
            </div>
            <div className="rounded-xl border border-accent-line bg-surface p-6 text-center">
              <CircularProgress value={breakdown.english.score} size={132} stroke={10} tone="accent" label="English" delay={380} />
              <p className="mt-3 text-[12px] text-muted">{breakdown.english.topicCount} skills measured</p>
            </div>
          </div>

          <DiagnosisCallout className="mt-6" text={diagnosis.headline}><p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{diagnosis.narrative}</p></DiagnosisCallout>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading eyebrow="Your strengths" title="Protect these." size="sm" />
          <ul className="mt-4 space-y-1.5">
            {[...diagnosis.math.strengths, ...diagnosis.english.strengths].slice(0, 4).map((item) => (
              <li key={item.id}><SpectrumRow name={item.name} score={item.score} tone="strong" size="sm" /></li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <SectionHeading eyebrow="Focus areas" title="Where the points are." size="sm" />
          <ul className="mt-4 space-y-1.5">
            {diagnosis.topGaps.slice(0, 4).map((item) => (
              <li key={item.id}>
                <SpectrumRow name={item.name} score={item.score} tone="risk" size="sm" meta={<span className="tnum text-[11px] text-risk">+{item.impact} pts</span>} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Your next step</p>
            <p className="mt-2 text-[16px] font-semibold leading-snug text-ink">{diagnosis.nextStep.title}</p>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">{diagnosis.nextStep.reason}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button
              size="md"
              onClick={() => {
                generatePath();
                toast("Learning path regenerated from this attempt.", { tone: "success", title: "Path ready" });
                router.push("/student/learning-path");
              }}
            >
              <Route className="size-4" aria-hidden="true" />
              Start recommended path
            </Button>
            <Button href="/student/diagnostic/analysis" variant="secondary" size="md">
              <Microscope className="size-4" aria-hidden="true" />
              See weak topics
            </Button>
            <Button href="/student/practice" variant="ghost" size="md">
              <Sparkles className="size-4" aria-hidden="true" />
              Practice now
            </Button>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5 border-t border-line pt-4">
          <Button variant="ghost" size="sm" onClick={() => window.print()} className="no-print">
            <Download className="size-3.5" aria-hidden="true" />
            Download report (PDF)
          </Button>
          <Button variant="ghost" size="sm" href="/student/diagnostic/start">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Retake diagnostic
          </Button>
          <Button variant="ghost" size="sm" href="/sample-report">
            <BookOpen className="size-3.5" aria-hidden="true" />
            Compare with sample report
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* ========================================================= 50 · analysis == */

export function DiagnosticAnalysis() {
  const { topicScores, attempts, derived, previous } = useApp();
  const [subject, setSubject] = useState("math");
  const diagnosis = useMemo(() => diagnose(topicScores), [topicScores]);
  const side = diagnosis[subject];
  const subjectResult = derived.breakdown[subject];

  const bars = subjectResult.topics.map((topic) => ({ name: topic.name, score: topic.score }));
  const radar = subjectResult.domains.map((domain) => ({ axis: domain.short, now: domain.score }));
  const movements = previous ? compareSnapshots(previous.topics, topicScores).filter((row) => row.subject === subject) : [];

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Detailed analysis</p>
            <h1 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">
              Every skill, weighted and ranked.
            </h1>
          </div>
          <Tabs
            tabs={[
              { id: "math", label: "Mathematics" },
              { id: "english", label: "English" },
            ]}
            value={subject}
            onChange={setSubject}
            size="sm"
          />
        </div>
        <DiagnosisCallout className="mt-5" text={side.explanation} tone={subject === "math" ? "brand" : "accent"} label={`${subject === "math" ? "Mathematics" : "English"} diagnosis`} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <ChartCard title="Topic mastery" description="Sorted by score; the band threshold is 60%.">
          <TopicBars data={bars} />
        </ChartCard>
        <ChartCard title="Domain balance" description="Where the subject is carried and where it leaks.">
          <SkillRadar data={radar} series={[{ key: "now", name: "Current", color: subject === "math" ? "#2b4fe0" : "#7a5cd6" }]} height={260} />
        </ChartCard>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-line px-5 py-4">
          <SectionHeading eyebrow="Skill table" title={`${subjectResult.topicCount} topics · total weight ${subjectResult.totalWeight}`} size="sm" />
        </div>
        <div className="scroll-slim overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-[11px] uppercase tracking-[0.08em] text-muted">
                <th className="px-5 py-2.5 font-semibold">Topic</th>
                <th className="px-3 py-2.5 font-semibold">Domain</th>
                <th className="px-3 py-2.5 text-right font-semibold">Weight</th>
                <th className="px-3 py-2.5 text-right font-semibold">Mastery</th>
                <th className="px-3 py-2.5 text-right font-semibold">Impact</th>
                <th className="px-3 py-2.5 text-right font-semibold">Attempts</th>
                <th className="px-5 py-2.5 font-semibold">Band</th>
              </tr>
            </thead>
            <tbody>
              {subjectResult.topics.map((topic) => {
                const gap = side.gaps.find((g) => g.id === topic.id);
                const band = topic.score >= 80 ? "strong" : topic.score >= 60 ? "developing" : "risk";
                return (
                  <tr key={topic.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface-2">
                    <td className="px-5 py-3 text-[13px] font-medium text-ink">{topic.name}</td>
                    <td className="px-3 py-3 text-[12px] text-muted">{topic.domainName}</td>
                    <td className="tnum px-3 py-3 text-right text-[12px] text-muted">{topic.weight}%</td>
                    <td className={cn("tnum px-3 py-3 text-right text-[13px] font-semibold", band === "strong" ? "text-strong" : band === "developing" ? "text-developing" : "text-risk")}>
                      {topic.score}%
                    </td>
                    <td className="tnum px-3 py-3 text-right text-[12px] text-risk">{gap ? `+${gap.impact}` : "—"}</td>
                    <td className="tnum px-3 py-3 text-right text-[12px] text-muted">{attempts[topic.id] ?? 0}</td>
                    <td className="px-5 py-3">
                      <Badge tone={band} size="xs">{band === "risk" ? "At risk" : band === "developing" ? "Developing" : "Strong"}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {movements.length ? (
        <Card className="p-5">
          <SectionHeading eyebrow="Since your previous attempt" title="What moved, and what slipped." size="sm" />
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {[...movements].sort((a, b) => b.delta - a.delta).slice(0, 6).map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-canvas px-3.5 py-2.5">
                <span className="min-w-0 truncate text-[12.5px] text-ink-soft">{row.name}</span>
                <span className="tnum shrink-0 text-[11.5px] text-faint">{row.before}% → {row.after}%</span>
                <DeltaTag value={row.delta} />
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="max-w-xl text-[13px] leading-relaxed text-muted">
          The impact column is the product: <span className="font-semibold text-ink">weight × distance from target</span>.
          Your recommendations and learning path are sorted by exactly this number.
        </p>
        <div className="flex gap-2.5">
          <Button href="/student/recommendations" size="md">
            <Target className="size-4" aria-hidden="true" />
            My recommendations
          </Button>
          <Button href="/student/learning-path" variant="secondary" size="md">
            <Route className="size-4" aria-hidden="true" />
            Learning path
          </Button>
        </div>
      </Card>
    </div>
  );
}
