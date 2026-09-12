"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Award, BookOpen, CalendarClock, Check, CheckCircle2, Circle, Clock, Download, Dumbbell,
  Flame, History as HistoryIcon, Languages, Medal, Play, Route, ScanLine, ScrollText, Sigma, Sparkles,
  Target, TrendingUp, Trophy, UserRound, X,
} from "lucide-react";

import { cn, formatDate, formatRelative } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { diagnose, compareSnapshots, prioritiseGaps } from "@/lib/engine/diagnose";
import { getTopic } from "@/lib/data/topics";
import { buildTopicSet } from "@/lib/data/questions";
import Button from "@/components/ui/Button";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import { Card, SectionHeading } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { Segmented, Field, Input, Select } from "@/components/ui/Field";
import Tabs from "@/components/ui/Tabs";
import { ChartCard, TrendChart, TopicBars, WeeklyBars, SkillRadar, Sparkline } from "@/components/charts";
import { DiagnosisCallout, SpectrumRow, StrengthGapPanel } from "@/components/domain/Primitives";
import { EmptyState } from "@/components/ui/States";
import TestRunner from "@/components/test/TestRunner";
import { topicHref } from "@/components/student/StudyPages";

const bandTone = (score) => (score >= 80 ? "strong" : score >= 60 ? "developing" : "risk");
const BAND_TEXT = { strong: "text-strong", developing: "text-developing", risk: "text-risk" };

/* ========================================================= 27 · dashboard == */

export function DashboardHome() {
  const router = useRouter();
  const { user, derived, diagnostics, activity, gamification, topicScores, startTest, toast, questions } = useApp();
  const { breakdown, nextStep, currentUnit, plan } = derived;
  const diagnosis = useMemo(() => diagnose(topicScores), [topicScores]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const timeline = diagnostics.map((entry) => {
    const result = diagnose(entry.topics).result;
    return { label: entry.label ?? formatDate(entry.date, { year: undefined }), math: result.math.score, english: result.english.score };
  });

  const quickActions = [
    { icon: ScanLine, label: "Take Diagnostic", href: "/student/diagnostic/start", tone: "brand" },
    { icon: Sigma, label: "Practice Math", onClick: () => beginPractice("linear_equations"), tone: "brand" },
    { icon: Languages, label: "Practice English", onClick: () => beginPractice("academic_vocabulary"), tone: "accent" },
    { icon: TrendingUp, label: "View Progress", href: "/student/progress", tone: "neutral" },
    { icon: Target, label: "View Skills", href: "/student/skills", tone: "neutral" },
    { icon: Route, label: "View Learning Path", href: "/student/learning-path", tone: "neutral" },
    { icon: Medal, label: "View Achievements", href: "/student/achievements", tone: "neutral" },
    { icon: ScrollText, label: "Certificates", href: "/student/certificates", tone: "neutral" },
  ];

  function beginPractice(topicId) {
    const topic = getTopic(topicId);
    startTest({ subject: topic.subject, questions: buildTopicSet(topicId, 6, 11, questions), timed: false, adaptive: true });
    toast(`Practice: ${topic.name}. Explanations after every answer.`, { tone: "info", title: "Practice started" });
    router.push(`/student/practice?topic=${topicId}`);
  }

  return (
    <div className="space-y-5">
      {/* greeting + headline numbers */}
      <Card className="relative overflow-hidden p-6">
        <div className="field-brand pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{formatDate(new Date(), { weekday: "long" })}</p>
            <h1 className="mt-2 font-display text-[30px] leading-tight tracking-[-0.028em] text-ink">
              {greeting}, {user?.firstName ?? "learner"}.
            </h1>
            <p className="mt-2 max-w-lg text-[13.5px] leading-relaxed text-muted">
              {nextStep.title} — {nextStep.reason}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button size="md" onClick={() => (currentUnit ? router.push(topicHref(currentUnit.unit.topicId)) : router.push("/student/diagnostic/start"))}>
                <Play className="size-4" aria-hidden="true" />
                Continue learning
              </Button>
              <Button href="/student/diagnostic/start" variant="secondary" size="md">Take Diagnostic</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
            {[
              { label: "Mathematics", value: breakdown.math.score, tone: "brand" },
              { label: "English", value: breakdown.english.score, tone: "accent" },
            ].map((item) => (
              <div key={item.label} className="bg-surface px-5 py-4">
                <p className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{item.label}</p>
                <p className={cn("tnum mt-1 font-display text-[38px] leading-none tracking-[-0.03em]", item.tone === "brand" ? "text-brand" : "text-accent")}>
                  {item.value}
                  <span className="ml-0.5 font-sans text-[13px] text-faint">%</span>
                </p>
                <ProgressBar value={item.value} size="xs" tone={item.tone} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* quick actions */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickActions.map((action) => {
          const inner = (
            <>
              <span className={cn(
                "grid size-9 place-items-center rounded-md border",
                action.tone === "brand" && "border-brand-line bg-brand-soft text-brand",
                action.tone === "accent" && "border-accent-line bg-accent-soft text-accent",
                action.tone === "neutral" && "border-line bg-surface-2 text-ink-soft",
              )}>
                <action.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="mt-2.5 block text-[12.5px] font-semibold text-ink">{action.label}</span>
            </>
          );
          const className = "card-lift rule-top relative overflow-hidden rounded-lg border border-line bg-surface p-4 text-left";
          return action.href ? (
            <Link key={action.label} href={action.href} className={className}>{inner}</Link>
          ) : (
            <button key={action.label} type="button" onClick={action.onClick} className={className}>{inner}</button>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* next unit */}
        <Card className="p-5">
          <SectionHeading eyebrow="Next up in your path" title={currentUnit ? currentUnit.unit.title : "Path complete"} size="sm" />
          {currentUnit ? (
            <>
              <p className="mt-3 text-[12.5px] leading-relaxed text-muted">
                Week {currentUnit.week.index} · {currentUnit.unit.topicName} · {currentUnit.unit.minutes} min ·{" "}
                {currentUnit.unit.type}
              </p>
              <ProgressBar value={derived.pathProgress.percent} size="sm" className="mt-3" />
              <p className="mt-1.5 text-[11.5px] text-faint">{derived.pathProgress.percent}% of the path complete</p>
              <Button href={topicHref(currentUnit.unit.topicId)} size="sm" className="mt-4" full>
                Start this unit <ArrowRight className="size-3.5" aria-hidden="true" />
              </Button>
            </>
          ) : (
            <p className="mt-3 text-[12.5px] text-muted">Generate a fresh path from your latest scores.</p>
          )}
        </Card>

        {/* weak areas */}
        <Card className="p-5">
          <SectionHeading eyebrow="Focus areas" title="Where the points are." size="sm" />
          <ul className="mt-3 space-y-1.5">
            {diagnosis.topGaps.slice(0, 3).map((gap) => (
              <li key={gap.id}>
                <Link href={topicHref(gap.id)} className="block rounded-md px-1 py-0.5 transition-opacity hover:opacity-80">
                  <SpectrumRow name={gap.name} score={gap.score} size="sm" showBand={false} meta={<span className="tnum text-risk">+{gap.impact}</span>} />
                </Link>
              </li>
            ))}
          </ul>
          <Button href="/student/recommendations" variant="ghost" size="sm" full className="mt-3">
            All recommendations <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </Card>

        {/* streak + week */}
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeading eyebrow="This week" title={`${gamification.minutesThisWeek} min`} size="sm" />
            <Badge tone="developing" size="sm"><Flame className="size-3" aria-hidden="true" /> {gamification.streakDays}-day streak</Badge>
          </div>
          <div className="mt-4">
            <WeeklyBars data={gamification.weeklyActivity} target={Math.round(gamification.weeklyGoalMinutes / 7)} />
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
            Level {gamification.level} · {gamification.levelLabel} · {gamification.xp} XP —{" "}
            <span className="tnum">{gamification.nextLevelXp - gamification.xp} XP</span> to level {gamification.level + 1}.
          </p>
        </Card>
      </div>

      {/* progress + activity */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <ChartCard
          title="Your curve"
          description="Every diagnostic on the same skill definitions."
          action={<Link href="/student/progress" className="text-[12px] font-medium text-brand hover:underline">Open progress →</Link>}
        >
          <TrendChart data={timeline} height={240} />
        </ChartCard>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeading eyebrow="Recent activity" title="Last six sessions." size="sm" />
            <Link href="/student/history" className="text-[12px] font-medium text-brand hover:underline">All</Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {activity.slice(0, 6).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{item.type} · {formatRelative(item.date)} · {item.minutes} min</p>
                </div>
                <span className="tnum shrink-0 text-[11.5px] font-semibold text-developing">+{item.xp} XP</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ====================================================== 31 · learning path == */

export function LearningPathView() {
  const router = useRouter();
  const { derived, pathProgress, toggleUnit, generatePath, settings, patch, toast } = useApp();
  const { plan } = derived;
  const preset = settings.study.pathPreset;

  const setPreset = (value) => {
    patch({ settings: { ...settings, study: { ...settings.study, pathPreset: value } } });
    generatePath({ preset: value });
    toast(`Path repacked for a ${value} week.`, { tone: "info", title: "Path updated" });
  };

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Your learning path</p>
            <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">
              {plan.weeks.length} weeks, generated from your last diagnostic.
            </h1>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">{plan.summary}</p>
          </div>
          <div className="text-right">
            <p className="tnum font-display text-[40px] leading-none tracking-[-0.03em] text-ink">{pathProgress.percent}%</p>
            <p className="mt-1 text-[11.5px] text-muted">{pathProgress.completed} of {pathProgress.total} units</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[12px] text-muted">Weekly budget</span>
            <Segmented
              size="sm"
              ariaLabel="Path intensity"
              options={[{ value: "light", label: "Light" }, { value: "balanced", label: "Balanced" }, { value: "intensive", label: "Intensive" }]}
              value={preset}
              onChange={setPreset}
            />
          </div>
          <div className="flex gap-2.5">
            <Button size="sm" variant="secondary" onClick={() => { generatePath(); toast("Path rebuilt from your current scores.", { tone: "success" }); }}>
              Regenerate from scores
            </Button>
            <Button size="sm" href="/personalized-learning" variant="ghost">How this is built</Button>
          </div>
        </div>
        <ProgressBar value={pathProgress.percent} className="mt-4" />
      </Card>

      {/* timeline */}
      <ol className="relative space-y-4 border-l border-line pl-6">
        {plan.weeks.map((week) => {
          const weekDone = week.units.every((unit) => pathProgress[unit.key]?.completed);
          const weekActive = !weekDone && week.units.some((unit) => !pathProgress[unit.key]?.completed);
          return (
            <li key={week.index} className="relative">
              <span
                className={cn(
                  "absolute -left-[31px] top-5 grid size-5 place-items-center rounded-full border-2 bg-surface",
                  weekDone ? "border-strong text-strong" : weekActive ? "border-brand" : "border-line-2",
                )}
                aria-hidden="true"
              >
                {weekDone ? <Check className="size-3" /> : <span className={cn("size-1.5 rounded-full", weekActive ? "bg-brand" : "bg-line-3")} />}
              </span>

              <Card className={cn("p-5", weekActive && "border-brand-line shadow-md")}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="tnum font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">Week {String(week.index).padStart(2, "0")}</p>
                    <h2 className="mt-1 font-display text-[18px] leading-snug tracking-[-0.02em] text-ink">{week.topicName}</h2>
                    <p className="mt-1 text-[12px] text-muted">
                      {week.minutes} min · {week.units.length} units · impact +{week.impact ?? "—"} pts
                    </p>
                  </div>
                  {weekActive ? <Badge tone="brand" size="sm" dot>Current week</Badge> : weekDone ? <Badge tone="strong" size="sm">Complete</Badge> : null}
                </div>

                <ul className="mt-4 space-y-2">
                  {week.units.map((unit) => {
                    const done = pathProgress[unit.key]?.completed;
                    return (
                      <li key={unit.key}>
                        <button
                          type="button"
                          onClick={() => toggleUnit(unit.key, { minutes: unit.minutes, topicId: unit.topicId })}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md border px-3.5 py-2.5 text-left transition-[border-color,background-color] duration-200",
                            done ? "border-strong/30 bg-strong-soft/60" : "border-line bg-canvas hover:border-line-3",
                          )}
                          aria-pressed={Boolean(done)}
                        >
                          {done ? <CheckCircle2 className="size-4 shrink-0 text-strong" aria-hidden="true" /> : <Circle className="size-4 shrink-0 text-line-3" aria-hidden="true" />}
                          <span className="min-w-0 flex-1">
                            <span className={cn("block truncate text-[12.5px]", done ? "text-strong line-through decoration-strong/40" : "text-ink-soft")}>{unit.title}</span>
                            <span className="mt-0.5 block text-[11px] text-muted">{unit.type} · {unit.minutes} min</span>
                          </span>
                          <span className="shrink-0 text-[11.5px] font-medium text-brand">{done ? "Completed" : unit.type === "practice" ? "Do it" : "Open"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 flex flex-wrap gap-2.5 border-t border-line pt-3.5">
                  <Button size="sm" variant="secondary" href={topicHref(week.units[0].topicId)}>
                    Open {week.topicName} topic page
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const topic = getTopic(week.units[0].topicId);
                      router.push(`/student/practice?topic=${topic.id}`);
                    }}
                  >
                    <Dumbbell className="size-3.5" aria-hidden="true" />
                    Practice this topic
                  </Button>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="max-w-xl text-[13px] leading-relaxed text-muted">
          Completing a unit updates your streak, minutes and XP. Completing a week's mini-test is what moves the topic
          score — and the next diagnostic confirms it.
        </p>
        <Button href="/student/diagnostic/start" size="md">
          <ScanLine className="size-4" aria-hidden="true" />
          Confirm with a retake
        </Button>
      </Card>
    </div>
  );
}

/* ========================================================= 42 · practice == */

export function PracticeCenter() {
  const router = useRouter();
  const { activeTest, topicScores, derived, startTest, cancelTest, patch, gamification, activity, toast, questions } = useApp();
  const [topicId, setTopicId] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("topic");
    if (requested) setTopicId(requested);
  }, []);

  const topics = derived.breakdown.math.topics.concat(derived.breakdown.english.topics);
  const [filter, setFilter] = useState("all");
  const visible = topics.filter((topic) => filter === "all" || topic.subject === filter);

  const begin = (id) => {
    const topic = getTopic(id);
    startTest({ subject: topic.subject, questions: buildTopicSet(id, 6, 11, questions), timed: false, adaptive: true });
    setSummary(null);
    toast(`Six questions on ${topic.name}.`, { tone: "info", title: "Practice started" });
  };

  const complete = () => {
    const test = activeTest;
    const correct = test.questions.filter((q) => test.answers[q.id] === q.answer).length;
    const accuracy = Math.round((correct / test.questions.length) * 100);
    patch({
      gamification: { ...gamification, xp: gamification.xp + 10 + correct * 3, minutesThisWeek: gamification.minutesThisWeek + 6 },
      activity: [
        {
          id: `act_${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          type: "Practice set",
          subject: test.subject,
          topicId: test.questions[0]?.topicId ?? null,
          title: `Practice · ${getTopic(test.questions[0]?.topicId)?.name ?? test.subject}`,
          minutes: 6,
          score: accuracy,
          xp: 10 + correct * 3,
        },
        ...activity,
      ].slice(0, 60),
    });
    cancelTest();
    setSummary({ correct, total: test.questions.length, accuracy });
    toast(`Practice complete: ${correct}/${test.questions.length}. Mastery changes only come from diagnostics.`, { tone: "success", title: "Set complete" });
  };

  if (activeTest) {
    return (
      <div className="space-y-5">
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <p className="text-[13px] text-muted">
            Practice mode — explanations appear after each answer. Scores here train you; diagnostics measure you.
          </p>
          <Badge tone="accent" size="sm" dot>Practice session</Badge>
        </Card>
        <TestRunner mode="practice" onFinish={complete} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Practice center</p>
            <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">Six questions. One topic. Instant explanations.</h1>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
              Practice sets draw from the same bank as the diagnostic. They build fluency and XP — topic mastery only
              moves when a diagnostic confirms it, which keeps your progress honest.
            </p>
          </div>
          <Segmented
            ariaLabel="Subject filter"
            options={[{ value: "all", label: "All" }, { value: "math", label: "Math" }, { value: "english", label: "English" }]}
            value={filter}
            onChange={setFilter}
            size="sm"
          />
        </div>
      </Card>

      {summary ? (
        <Card className="border-strong/30 bg-strong-soft/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                <Trophy className="size-4 text-strong" aria-hidden="true" />
                Set complete — {summary.correct} of {summary.total} correct ({summary.accuracy}%)
              </p>
              <p className="mt-1.5 text-[12.5px] text-muted">+{10 + summary.correct * 3} XP added. Ready for another topic?</p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setSummary(null)}>Choose another topic</Button>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((topic) => {
          const score = topicScores[topic.id] ?? 0;
          return (
            <Card key={topic.id} className={cn("card-lift rule-top relative overflow-hidden p-4", topicId === topic.id && "border-brand ring-1 ring-brand/20")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{topic.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted">{topic.subject === "math" ? "Mathematics" : "English"} · {topic.domainName}</p>
                </div>
                <span className={cn("tnum shrink-0 text-[13px] font-semibold", BAND_TEXT[bandTone(score)])}>{score}%</span>
              </div>
              <ProgressBar value={score} tone={bandTone(score)} size="xs" className="mt-3" />
              <div className="mt-3.5 flex items-center justify-between gap-2">
                <Badge tone={bandTone(score)} size="xs">{score >= 80 ? "Maintain" : score >= 60 ? "Improve" : "Priority"}</Badge>
                <Button size="sm" variant={score < 60 ? "primary" : "secondary"} onClick={() => begin(topic.id)}>
                  <Dumbbell className="size-3.5" aria-hidden="true" />
                  Practice
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================== 29 · skills == */

export function SkillsView() {
  const { derived, topicScores } = useApp();
  const [subject, setSubject] = useState("math");
  const side = derived.breakdown[subject];
  const radar = side.domains.map((d) => ({ axis: d.short, now: d.score }));

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">My skills</p>
            <h1 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">25 skills, one ruler.</h1>
          </div>
          <Tabs tabs={[{ id: "math", label: "Mathematics" }, { id: "english", label: "English" }]} value={subject} onChange={setSubject} size="sm" />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <ChartCard title="Domain balance" description={`${subject === "math" ? "Mathematics" : "English"} domains`}>
          <SkillRadar data={radar} series={[{ key: "now", name: "Current", color: subject === "math" ? "#2b4fe0" : "#7a5cd6" }]} height={280} />
        </ChartCard>
        <Card className="p-5">
          <SectionHeading eyebrow="Every topic" title="Sorted by mastery." size="sm" />
          <ul className="mt-4 space-y-1">
            {side.topics.map((topic) => (
              <li key={topic.id}>
                <Link href={topicHref(topic.id)} className="block rounded-md px-1.5 py-1 transition-colors hover:bg-surface-2">
                  <SpectrumRow name={topic.name} score={topic.score} domain={topic.domainName} size="sm" meta={`weight ${topic.weight}%`} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="max-w-xl text-[13px] leading-relaxed text-muted">
          Bands: <Badge tone="strong" size="xs">Strong ≥ 80</Badge> <Badge tone="developing" size="xs">Developing 60–79</Badge>{" "}
          <Badge tone="risk" size="xs">At risk &lt; 60</Badge>. The plan only spends time below 80.
        </p>
        <Button href="/student/diagnostic/analysis" variant="secondary" size="md">Open detailed analysis</Button>
      </Card>
    </div>
  );
}

/* ========================================================= 30 · progress == */

export function ProgressView() {
  const { diagnostics, topicScores } = useApp();
  const timeline = diagnostics.map((entry) => {
    const result = diagnose(entry.topics).result;
    return { label: entry.label ?? formatDate(entry.date, { year: undefined }), math: result.math.score, english: result.english.score };
  });
  const first = diagnostics[0];
  const latest = diagnostics[diagnostics.length - 1];
  const movements = compareSnapshots(first.topics, topicScores);
  const best = [...movements].sort((a, b) => b.delta - a.delta).slice(0, 5);
  const firstResult = diagnose(first.topics).result;
  const latestResult = diagnose(topicScores).result;

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">My progress</p>
            <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">Same ruler, every attempt.</h1>
            <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
              {diagnostics.length} diagnostics on record. Because topic definitions and weights never change between
              attempts, every movement below is a real change in measured skill.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Mathematics", from: firstResult.math.score, to: latestResult.math.score },
              { label: "English", from: firstResult.english.score, to: latestResult.english.score },
            ].map((row) => (
              <div key={row.label} className="rounded-lg border border-line bg-canvas px-4 py-3 text-center">
                <p className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{row.label}</p>
                <p className="tnum mt-1 font-display text-[24px] leading-none text-ink">
                  {row.from}<span className="mx-1 text-[13px] text-faint">→</span><span className="text-strong">{row.to}</span>
                </p>
                <DeltaTag value={row.to - row.from} className="mt-1.5 justify-center" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <ChartCard title="Attempt timeline" description="Mathematics and English across every diagnostic." action={<Button href="/student/diagnostic/start" size="sm" variant="secondary">Add a point</Button>}>
        <TrendChart data={timeline} height={280} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading eyebrow="Biggest gains" title="Since your first diagnostic." size="sm" />
          <ul className="mt-4 space-y-2">
            {best.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-canvas px-3.5 py-2.5">
                <span className="min-w-0 truncate text-[12.5px] text-ink-soft">{row.name}</span>
                <span className="tnum shrink-0 text-[11.5px] text-faint">{row.before}% → {row.after}%</span>
                <DeltaTag value={row.delta} />
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <SectionHeading eyebrow="Attempt log" title="Every paper you have sat." size="sm" />
          <ul className="mt-4 divide-y divide-line">
            {[...diagnostics].reverse().map((entry) => {
              const result = diagnose(entry.topics).result;
              return (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-ink">{entry.kind}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{formatDate(entry.date)} · {entry.durationMinutes} min · {entry.answered} answers</p>
                  </div>
                  <span className="tnum shrink-0 text-[12px] font-semibold text-ink">{result.math.score} / {result.english.score}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ================================================== 51 · recommendations == */

export function RecommendationsView() {
  const { topicScores, derived } = useApp();
  const diagnosis = useMemo(() => diagnose(topicScores), [topicScores]);
  const gaps = diagnosis.topGaps.slice(0, 6);
  const planTopics = new Set(derived.plan.weeks.flatMap((w) => w.units).map((u) => u.topicId));

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <p className="eyebrow">Recommendations</p>
        <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">Ranked by impact, not by alphabet.</h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
          Impact = topic weight × distance from the 80% target. It is the number of overall points each gap costs you,
          and the only sorting key Prisma uses.
        </p>
        <DiagnosisCallout className="mt-5" text={diagnosis.headline} />
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {gaps.map((gap, index) => (
          <Card key={gap.id} className="card-lift rule-top relative overflow-hidden p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="tnum font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">Priority {String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-1 font-display text-[18px] leading-snug tracking-[-0.02em] text-ink">{gap.name}</h2>
                <p className="mt-1 text-[12px] text-muted">{gap.subject === "math" ? "Mathematics" : "English"} · {gap.domainName} · weight {gap.weight}%</p>
              </div>
              <div className="shrink-0 text-right">
                <p className={cn("tnum font-display text-[26px] leading-none", BAND_TEXT[bandTone(gap.score)])}>{gap.score}%</p>
                <p className="tnum mt-1 text-[11px] font-semibold text-risk">+{gap.impact} pts available</p>
              </div>
            </div>

            <p className="mt-3 rounded-md border border-line bg-canvas p-3 text-[12.5px] leading-relaxed text-muted">
              {gap.score < 50
                ? "Fundamentals first: the path starts this topic at concept level before any timed practice."
                : gap.score < 60
                  ? "Close to the band threshold — focused practice and a mini-test should clear it."
                  : "Developing: consolidation work will push this into the strong band."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" href={topicHref(gap.id)}>Open topic</Button>
              <Button size="sm" variant="secondary" href={`/student/practice?topic=${gap.id}`}>Practice set</Button>
              {planTopics.has(gap.id) ? <Badge tone="brand" size="xs" className="self-center">In your path</Badge> : null}
            </div>
          </Card>
        ))}
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="max-w-xl text-[13px] leading-relaxed text-muted">
          Recommendations refresh after every diagnostic and every generated path. Nothing here is editorial — it is
          arithmetic you can redo from the analysis table.
        </p>
        <div className="flex gap-2.5">
          <Button href="/student/learning-path" size="md"><Route className="size-4" aria-hidden="true" /> Open learning path</Button>
          <Button href="/student/diagnostic/analysis" variant="ghost" size="md">See the arithmetic</Button>
        </div>
      </Card>
    </div>
  );
}

/* ============================================== 52–54 · record pages == */

export function AchievementsView() {
  const { achievements, gamification } = useApp();
  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Achievements</p>
            <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">Consistency, recorded.</h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
              No confetti, no mascots. Achievements mark things that actually happened: streaks kept, bands reached,
              gains confirmed by a second diagnostic.
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "XP", value: gamification.xp },
              { label: "Level", value: gamification.level },
              { label: "Streak", value: `${gamification.streakDays}d` },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-canvas px-4 py-3 text-center">
                <p className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{item.label}</p>
                <p className="tnum mt-1 font-display text-[22px] leading-none text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <ProgressBar value={Math.round((gamification.xp / gamification.nextLevelXp) * 100)} className="mt-5" />
        <p className="mt-1.5 text-[11.5px] text-faint">{gamification.nextLevelXp - gamification.xp} XP to level {gamification.level + 1} · {gamification.levelLabel}</p>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item) => {
          const locked = !item.earnedAt;
          return (
            <Card key={item.id} className={cn("p-4", locked && "opacity-70")}>
              <div className="flex items-start justify-between gap-3">
                <span className={cn("grid size-10 place-items-center rounded-lg border", locked ? "border-line bg-surface-2 text-faint" : "border-brand-line bg-brand-soft text-brand")}>
                  {locked ? <Circle className="size-4" aria-hidden="true" /> : <Award className="size-4" aria-hidden="true" />}
                </span>
                <Badge tone={locked ? "neutral" : item.tone === "strong" ? "strong" : item.tone === "accent" ? "accent" : item.tone === "developing" ? "developing" : "brand"} size="xs">
                  {item.tier}
                </Badge>
              </div>
              <h2 className="mt-3 text-[14px] font-semibold text-ink">{item.name}</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{item.description}</p>
              {locked ? (
                <div className="mt-3">
                  <ProgressBar value={Math.round(((item.progress ?? 0) / (item.target ?? 1)) * 100)} size="xs" />
                  <p className="tnum mt-1 text-[10.5px] text-faint">{item.progress} / {item.target}</p>
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-faint">Earned {formatDate(item.earnedAt)}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function HistoryView() {
  const { activity } = useApp();
  const [filter, setFilter] = useState("all");
  const rows = activity.filter((item) => filter === "all" || item.subject === filter || (filter === "both" && item.subject === "both"));
  const totalMinutes = rows.reduce((acc, item) => acc + item.minutes, 0);

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Study history</p>
            <h1 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">Everything you have done.</h1>
          </div>
          <Segmented
            ariaLabel="Filter activity"
            size="sm"
            options={[{ value: "all", label: "All" }, { value: "math", label: "Math" }, { value: "english", label: "English" }]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <p className="mt-3 text-[12.5px] text-muted">
          <span className="tnum font-semibold text-ink">{rows.length}</span> sessions ·{" "}
          <span className="tnum font-semibold text-ink">{totalMinutes}</span> minutes ·{" "}
          <span className="tnum font-semibold text-ink">{rows.reduce((a, r) => a + r.xp, 0)}</span> XP
        </p>
      </Card>

      <Card className="overflow-hidden">
        <div className="scroll-slim overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-[11px] uppercase tracking-[0.08em] text-muted">
                <th className="px-5 py-2.5 font-semibold">Session</th>
                <th className="px-3 py-2.5 font-semibold">Type</th>
                <th className="px-3 py-2.5 font-semibold">Subject</th>
                <th className="px-3 py-2.5 text-right font-semibold">Minutes</th>
                <th className="px-3 py-2.5 text-right font-semibold">Score</th>
                <th className="px-5 py-2.5 text-right font-semibold">XP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface-2">
                  <td className="px-5 py-3">
                    <p className="text-[13px] font-medium text-ink">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{formatDate(item.date)}</p>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-muted">{item.type}</td>
                  <td className="px-3 py-3"><Badge tone={item.subject === "math" ? "brand" : item.subject === "english" ? "accent" : "info"} size="xs">{item.subject}</Badge></td>
                  <td className="tnum px-3 py-3 text-right text-[12px] text-muted">{item.minutes}</td>
                  <td className={cn("tnum px-3 py-3 text-right text-[12.5px] font-semibold", item.score === null ? "text-faint" : BAND_TEXT[bandTone(item.score)])}>
                    {item.score === null ? "—" : `${item.score}%`}
                  </td>
                  <td className="tnum px-5 py-3 text-right text-[12px] font-semibold text-developing">+{item.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function CertificatesView() {
  const { certificates, toast } = useApp();
  return (
    <div className="space-y-5">
      <Card className="p-6">
        <p className="eyebrow">Certificates</p>
        <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">Proof, with a verifier code.</h1>
        <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
          Issued for completed diagnostics and completed path modules. Each carries a code a school or employer can
          check. Locked certificates show exactly what unlocks them.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((cert) => {
          const locked = cert.status === "locked";
          return (
            <Card key={cert.id} className={cn("relative overflow-hidden p-5", locked && "border-dashed")}>
              <div className="prism-rule absolute inset-x-0 top-0" aria-hidden="true" />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-faint">
                    <ScrollText className="size-3.5" aria-hidden="true" />
                    {cert.subject === "math" ? "Mathematics" : cert.subject === "english" ? "English" : "Prisma"}
                  </p>
                  <h2 className="mt-2 font-display text-[18px] leading-snug tracking-[-0.02em] text-ink">{cert.title}</h2>
                  <p className="mt-1.5 text-[12px] text-muted">{cert.verifier}</p>
                </div>
                {locked ? (
                  <Badge tone="neutral" size="sm">Locked</Badge>
                ) : (
                  <Badge tone="strong" size="sm" dot>Issued</Badge>
                )}
              </div>

              {locked ? (
                <div className="mt-4">
                  <ProgressBar value={Math.round(((cert.progress ?? 0) / (cert.target ?? 1)) * 100)} size="xs" tone="developing" />
                  <p className="tnum mt-1.5 text-[11.5px] text-muted">{cert.progress}% of {cert.target}% mastery</p>
                  <Button href="/student/practice?topic=quadratic_equations" size="sm" variant="secondary" className="mt-3">Work towards it</Button>
                </div>
              ) : (
                <>
                  <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line">
                    <div className="bg-canvas px-3 py-2.5"><dt className="text-[10px] uppercase tracking-[0.08em] text-faint">Score</dt><dd className="tnum mt-0.5 text-[15px] font-semibold text-ink">{cert.score}%</dd></div>
                    <div className="bg-canvas px-3 py-2.5"><dt className="text-[10px] uppercase tracking-[0.08em] text-faint">Issued</dt><dd className="tnum mt-0.5 text-[12px] font-semibold text-ink">{formatDate(cert.issuedAt, { year: undefined })}</dd></div>
                    <div className="bg-canvas px-3 py-2.5"><dt className="text-[10px] uppercase tracking-[0.08em] text-faint">Code</dt><dd className="mt-0.5 truncate font-mono text-[10px] text-ink-soft">{cert.code}</dd></div>
                  </dl>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => window.print()}>
                      <Download className="size-3.5" aria-hidden="true" /> Download
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toast(`Code ${cert.code} would open the public verifier in a live deployment.`, { tone: "info", title: "Verifier" })}>
                      Verify
                    </Button>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ========================================================== 28 · profile == */

export function ProfileView() {
  const { user, patch, subscription, signOut, toast, settings } = useApp();
  const [values, setValues] = useState({ name: user?.name ?? "", email: user?.email ?? "", grade: String(user?.grade ?? 10) });
  const [saved, setSaved] = useState(false);

  const save = () => {
    patch({ user: { ...user, ...values, grade: Number(values.grade), firstName: values.name.split(" ")[0] } });
    setSaved(true);
    toast("Profile updated.", { tone: "success", title: "Saved" });
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card className="p-6">
        <p className="eyebrow">Profile</p>
        <h1 className="mt-2 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">Your account details.</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="pf-name"><Input id="pf-name" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} /></Field>
          <Field label="Email" htmlFor="pf-email"><Input id="pf-email" type="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} /></Field>
          <Select label="Year group" id="pf-grade" value={values.grade} onChange={(value) => setValues((v) => ({ ...v, grade: value }))}
            options={["6", "7", "8", "9", "10", "11", "12"].map((g) => ({ value: g, label: `Grade ${g}` }))} />
          <Field label="Role" htmlFor="pf-role"><Input id="pf-role" value={user?.role ?? "student"} disabled /></Field>
        </div>
        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <Button size="md" onClick={save}>{saved ? <Check className="size-4" aria-hidden="true" /> : null}{saved ? "Saved" : "Save changes"}</Button>
          <Button variant="ghost" size="md" href="/settings">Privacy & notification settings</Button>
          <Button variant="ghost" size="md" className="ml-auto text-risk" onClick={signOut}>Sign out</Button>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-5">
          <SectionHeading eyebrow="Subscription" title={subscription?.planId ?? "free"} size="sm" />
          <p className="mt-2 text-[12.5px] text-muted">Status: {subscription?.status} · renews {subscription?.renewsAt ? formatDate(subscription.renewsAt) : "—"}</p>
          <Button href="/billing" variant="secondary" size="sm" full className="mt-4">Manage billing</Button>
        </Card>
        <Card className="p-5">
          <SectionHeading eyebrow="Study preferences" title={`${settings.study.weeklyGoalMinutes} min / week`} size="sm" />
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            Path preset: {settings.study.pathPreset}. Change it any time from the learning path page — the plan repacks
            immediately.
          </p>
          <Button href="/student/learning-path" variant="ghost" size="sm" full className="mt-3">Open learning path</Button>
        </Card>
      </div>
    </div>
  );
}
