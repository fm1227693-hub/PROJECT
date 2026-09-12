"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Printer, RotateCcw, Sparkles } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { SUBJECT_META, TONE_CLASSES, bandFor } from "@/lib/data/brand";
import { DOMAINS } from "@/lib/data/topics";
import { buildResult } from "@/lib/engine/scoring";
import { compareSnapshots, diagnose, prioritiseGaps } from "@/lib/engine/diagnose";
import { buildLearningPath } from "@/lib/engine/recommend";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CircularProgress from "@/components/ui/CircularProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import Tabs from "@/components/ui/Tabs";
import { DiagnosisCallout, SpectrumRow, StepNumber, StrengthGapPanel } from "@/components/domain/Primitives";
import { InfoTip } from "@/components/ui/Tooltip";

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */

export function ReportHeader({ student, date, kind, durationMinutes, answered, badge }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ink font-mono text-[13px] font-semibold text-canvas">
          {student?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("") ?? "?"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-[-0.012em] text-ink">{student?.name}</p>
          <p className="mt-0.5 truncate text-[12.5px] text-muted">
            {student?.grade ? `Grade ${student.grade}` : null}
            {student?.className ? ` · ${student.className}` : null}
            {student?.school ? ` · ${student.school}` : null}
          </p>
        </div>
      </div>

      <dl className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px]">
        <div>
          <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">Date</dt>
          <dd className="tnum mt-0.5 font-medium text-ink">{formatDate(date)}</dd>
        </div>
        {kind ? (
          <div>
            <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">Assessment</dt>
            <dd className="mt-0.5 font-medium text-ink">{kind}</dd>
          </div>
        ) : null}
        {durationMinutes ? (
          <div>
            <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">Duration</dt>
            <dd className="tnum mt-0.5 font-medium text-ink">{durationMinutes} min</dd>
          </div>
        ) : null}
        {typeof answered === "number" ? (
          <div>
            <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">Answered</dt>
            <dd className="tnum mt-0.5 font-medium text-ink">{answered}</dd>
          </div>
        ) : null}
        {badge ? <div>{badge}</div> : null}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Score summary — the two headline numbers plus domain roll-ups
 * ------------------------------------------------------------------ */

export function ScoreSummary({ topicScores, subjects = ["math", "english"], showDomains = true, className }) {
  const result = useMemo(() => buildResult(topicScores), [topicScores]);

  return (
    <div className={cn("grid gap-px overflow-hidden rounded-lg border border-line bg-line", subjects.length > 1 ? "md:grid-cols-2" : "", className)}>
      {subjects.map((subject) => {
        const meta = SUBJECT_META[subject];
        const subjectResult = result[subject];
        const tone = subject === "math" ? "brand" : "accent";
        return (
          <section key={subject} className="bg-surface p-5 sm:p-6">
            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="eyebrow flex items-center gap-1.5">
                  <span className={cn("size-1.5 rounded-full", TONE_CLASSES[tone].dot)} aria-hidden="true" />
                  {meta.name}
                </p>
                <p className="tnum mt-2 font-display text-[clamp(2.75rem,7vw,3.75rem)] leading-none tracking-[-0.035em] text-ink">
                  {subjectResult.score}
                  <span className="ml-1 font-sans text-[18px] text-faint">%</span>
                </p>
                <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink-soft">
                  {diagnose(topicScores)[subject].explanation}
                </p>
              </div>
              <CircularProgress
                value={subjectResult.score}
                size={92}
                stroke={8}
                tone={tone}
                className="shrink-0"
                label={null}
              />
            </div>

            {showDomains ? (
              <ul className="mt-5 grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
                {subjectResult.domains.map((domain) => (
                  <li key={domain.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12px] text-muted">{domain.short}</span>
                      <span className={cn("tnum text-[13px] font-semibold", domain.score >= 80 ? "text-strong" : domain.score >= 60 ? "text-developing" : "text-risk")}>
                        {domain.score}%
                      </span>
                    </div>
                    <ProgressBar value={domain.score} size="xs" className="mt-1.5" />
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Topic breakdown with subject tabs
 * ------------------------------------------------------------------ */

export function TopicBreakdown({ topicScores, subjects = ["math", "english"], previousScores, className }) {
  const result = useMemo(() => buildResult(topicScores), [topicScores]);
  const deltas = useMemo(
    () => (previousScores ? compareSnapshots(previousScores, topicScores) : []),
    [previousScores, topicScores],
  );
  const [tab, setTab] = useState(subjects[0]);

  const tabs = subjects.map((subject) => ({
    id: subject,
    label: SUBJECT_META[subject].name,
    count: result[subject].topics.length,
  }));

  const active = result[tab] ?? result[subjects[0]];
  const deltaFor = (id) => deltas.find((d) => d.id === id)?.delta;

  return (
    <section className={cn("rounded-lg border border-line bg-surface", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-ink">Topic breakdown</h2>
          <p className="mt-0.5 text-[12.5px] text-muted">
            Every measured skill, grouped by domain and weighted by how much of the subject it explains.
          </p>
        </div>
        {subjects.length > 1 ? <Tabs tabs={tabs} value={tab} onChange={setTab} size="sm" /> : null}
      </header>

      <div className="divide-y divide-line">
        {active.domains.map((domain) => (
          <div key={domain.id} className="px-5 py-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                {domain.name}
                <InfoTip content={DOMAINS[domain.id]?.description} />
              </h3>
              <span className="flex items-baseline gap-2">
                <span className="text-[11.5px] text-faint">
                  {domain.topics.reduce((a, t) => a + t.weight, 0)}% weight
                </span>
                <span className={cn("tnum text-[14px] font-semibold", domain.score >= 80 ? "text-strong" : domain.score >= 60 ? "text-developing" : "text-risk")}>
                  {domain.score}%
                </span>
              </span>
            </div>

            <ul className="divide-y divide-line/70">
              {domain.topics.map((topic, index) => {
                const delta = deltaFor(topic.id);
                return (
                  <li key={topic.id}>
                    <SpectrumRow
                      name={topic.name}
                      score={topic.score}
                      size="sm"
                      delay={index * 40}
                      href={`/student/${tab}/topic?id=${topic.id}`}
                      meta={`${topic.weight}% weight${topic.attempts ? ` · ${topic.attempts} items` : ""}`}
                    />
                    {typeof delta === "number" && delta !== 0 ? (
                      <p className="mb-2 ml-4 flex items-center gap-1.5 text-[11px] text-muted">
                        Since last attempt
                        <DeltaTag value={delta} />
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Impact ranking — the table that justifies the plan
 * ------------------------------------------------------------------ */

export function ImpactTable({ topicScores, subjects = ["math", "english"], limit = 8, className }) {
  const rows = useMemo(() => {
    const all = subjects.flatMap((subject) => prioritiseGaps(topicScores, subject));
    return all.sort((a, b) => b.impact - a.impact).slice(0, limit);
  }, [topicScores, subjects, limit]);

  const totalImpact = rows.reduce((acc, row) => acc + row.impact, 0);

  if (!rows.length) {
    return (
      <section className={cn("rounded-lg border border-line bg-surface p-6 text-center", className)}>
        <p className="text-[14px] font-medium text-ink">No gaps below the 60% threshold.</p>
        <p className="mt-1 text-[13px] text-muted">Every measured skill is developing or strong.</p>
      </section>
    );
  }

  return (
    <section className={cn("overflow-hidden rounded-lg border border-line bg-surface", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.015em] text-ink">
            Gaps ranked by impact
            <InfoTip content="Impact = topic weight × distance from a strong (80%) score. It is the number of subject points you would recover by closing that gap." />
          </h2>
          <p className="mt-0.5 text-[12.5px] text-muted">Work down this list and nothing else.</p>
        </div>
        <p className="tnum rounded-md border border-line bg-surface-2 px-2.5 py-1 text-[12px] text-ink-soft">
          Total recoverable ≈ {totalImpact.toFixed(1)} pts
        </p>
      </header>

      <div className="scroll-slim overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface-2 text-[10.5px] uppercase tracking-[0.08em] text-faint">
              <th scope="col" className="px-5 py-2.5 font-medium">Rank</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Skill</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Subject</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Score</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Weight</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Deficit</th>
              <th scope="col" className="px-5 py-2.5 text-right font-medium">Impact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, index) => {
              const band = bandFor(row.score);
              const tone = TONE_CLASSES[band.tone];
              return (
                <tr key={row.id} className="group transition-colors hover:bg-surface-2">
                  <td className="px-5 py-3">
                    <StepNumber n={String(index + 1).padStart(2, "0")} size="sm" tone={index === 0 ? "brand" : "neutral"} />
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/student/${row.subject}/topic?id=${row.id}`}
                      className="text-[13.5px] font-medium text-ink transition-colors group-hover:text-brand"
                    >
                      {row.name}
                    </Link>
                    <p className="mt-0.5 text-[11.5px] text-muted">{row.domainName} · {row.level}</p>
                  </td>
                  <td className="px-3 py-3">
                    <Badge tone={row.subject === "math" ? "brand" : "accent"} size="xs">
                      {row.subject === "math" ? "Math" : "English"}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className={cn("tnum text-[14px] font-semibold", tone.text)}>{row.score}%</span>
                    <ProgressBar value={row.score} size="xs" tone={band.tone} className="mt-1.5 w-16 ml-auto" />
                  </td>
                  <td className="tnum px-3 py-3 text-right text-[12.5px] text-muted">{row.weight}%</td>
                  <td className="tnum px-3 py-3 text-right text-[12.5px] text-muted">−{row.deficit}</td>
                  <td className={cn("tnum px-5 py-3 text-right text-[13.5px] font-semibold", tone.text)}>+{row.impact}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Plan preview generated from the same scores
 * ------------------------------------------------------------------ */

export function PlanPreview({ topicScores, weeks = 3, className }) {
  const path = useMemo(() => buildLearningPath(topicScores, { weeks, weeklyMinutes: 240 }), [topicScores, weeks]);

  return (
    <section className={cn("rounded-lg border border-line bg-surface", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.015em] text-ink">
            <Sparkles className="size-4 text-brand" aria-hidden="true" />
            What Prisma would plan next
          </h2>
          <p className="mt-0.5 text-[12.5px] text-muted">{path.summary}</p>
        </div>
        <Button href="/student/recommended-plan" size="sm" variant="secondary" iconRight={ArrowRight}>
          Open the plan
        </Button>
      </header>

      <ol className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        {path.weeks.slice(0, weeks).map((week) => (
          <li key={week.index} className="bg-surface p-5">
            <div className="flex items-center justify-between gap-3">
              <StepNumber n={week.index} size="sm" tone={week.subject === "math" ? "brand" : "accent"} />
              <Badge tone={week.subject === "math" ? "brand" : "accent"} size="xs">
                {week.subjectName}
              </Badge>
            </div>
            <h3 className="mt-3.5 text-[14.5px] font-semibold tracking-[-0.012em] text-ink">{week.topicName}</h3>
            <ol className="mt-3 space-y-1.5 border-t border-line pt-3">
              {week.units.map((unit) => (
                <li key={unit.key} className="flex items-baseline gap-2 text-[12.5px]">
                  <span className="tnum shrink-0 font-mono text-[10px] text-faint">{unit.order}</span>
                  <span className="min-w-0 flex-1 truncate text-ink-soft">{unit.title}</span>
                  <span className="tnum shrink-0 text-[11px] text-faint">{unit.minutes}m</span>
                </li>
              ))}
            </ol>
            <p className="tnum mt-3 border-t border-line pt-3 text-[12px] text-muted">
              {week.fromScore}% → <span className="font-semibold text-strong">{week.toScore}%</span> projected
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Report actions
 * ------------------------------------------------------------------ */

export function ReportActions({ onPrint, className }) {
  return (
    <div className={cn("no-print flex flex-wrap items-center gap-2.5", className)}>
      <Button variant="secondary" size="sm" icon={Printer} onClick={onPrint ?? (() => window.print())}>
        Print report
      </Button>
      <Button variant="ghost" size="sm" icon={Download} href="/student/certificates">
        Download certificate
      </Button>
      <Button variant="ghost" size="sm" icon={RotateCcw} href="/student/diagnostic/start">
        Retake diagnostic
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Full report composition
 * ------------------------------------------------------------------ */

export default function DiagnosticReport({
  student,
  date,
  kind,
  durationMinutes,
  answered,
  topicScores,
  previousScores,
  subjects = ["math", "english"],
  showPlan = true,
  showImpact = true,
  planWeeks = 3,
  children,
}) {
  const diagnosis = useMemo(() => diagnose(topicScores), [topicScores]);

  const strengths = useMemo(
    () =>
      [...diagnosis.math.strengths, ...diagnosis.english.strengths]
        .filter((topic) => subjects.includes(topic.subject))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4),
    [diagnosis, subjects],
  );

  return (
    <div className="space-y-5">
      <ReportHeader student={student} date={date} kind={kind} durationMinutes={durationMinutes} answered={answered} />

      <ScoreSummary topicScores={topicScores} subjects={subjects} />

      <DiagnosisCallout
        text={subjects.length > 1 ? diagnosis.narrative : diagnosis[subjects[0]].explanation}
        label="Your diagnosis"
        tip="Generated from topic scores. Strengths are skills at 80% or above; gaps are ranked by weight × deficit."
      >
        <div className="flex flex-wrap items-center gap-2">
          {diagnosis.topGaps.slice(0, 3).map((gap) => (
            <Badge key={gap.id} tone={gap.subject === "math" ? "brand" : "accent"} size="sm">
              {gap.name} · {gap.score}% · worth {gap.impact} pts
            </Badge>
          ))}
        </div>
      </DiagnosisCallout>

      <StrengthGapPanel strengths={strengths.slice(0, 3)} gaps={diagnosis.topGaps.slice(0, 3)} />

      <TopicBreakdown topicScores={topicScores} subjects={subjects} previousScores={previousScores} />

      {showImpact ? <ImpactTable topicScores={topicScores} subjects={subjects} /> : null}

      {showPlan ? <PlanPreview topicScores={topicScores} weeks={planWeeks} /> : null}

      {children}
    </div>
  );
}
