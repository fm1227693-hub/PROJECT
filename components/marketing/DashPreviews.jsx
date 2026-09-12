import Link from "next/link";
import { ArrowRight, CalendarClock, Flame, Users } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { SAMPLE_PROFILE, SAMPLE_TIMELINE } from "@/lib/data/sampleResult";
import { STUDENTS, studentsInClass } from "@/lib/data/people";
import { SCHOOL_TERMS, YEAR_GROUP_PERFORMANCE } from "@/lib/data/people";
import { buildResult } from "@/lib/engine/scoring";
import { diagnose, diagnoseCohort, prioritiseGaps } from "@/lib/engine/diagnose";
import ProgressBar from "@/components/ui/ProgressBar";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import { SpectrumRow } from "@/components/domain/Primitives";

/**
 * Compact, honest previews of the real product surfaces — used on the public
 * audience pages so a visitor sees the dashboard, not a description of it.
 */

const latest = SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1];

export function StudentDashPreview() {
  const result = buildResult(latest.topics);
  const diagnosis = diagnose(latest.topics);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
        <p className="text-[12.5px] font-semibold text-ink">Student dashboard</p>
        <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
          <Flame className="size-3.5 text-developing" aria-hidden="true" />
          12-day streak
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px bg-line">
        {[
          { label: "Mathematics", score: result.math.score, tone: "brand" },
          { label: "English", score: result.english.score, tone: "accent" },
        ].map((item) => (
          <div key={item.label} className="bg-surface px-4 py-4">
            <p className="eyebrow">Your current level</p>
            <p className="mt-0.5 text-[12px] text-muted">{item.label}</p>
            <p className={cn("tnum mt-1 font-display text-[34px] leading-none tracking-[-0.03em]", item.tone === "brand" ? "text-brand" : "text-accent")}>
              {item.score}
              <span className="ml-0.5 font-sans text-[13px] text-faint">%</span>
            </p>
            <ProgressBar value={item.score} size="xs" tone={item.tone} className="mt-2.5" />
          </div>
        ))}
      </div>

      <div className="border-t border-line px-4 py-4">
        <p className="eyebrow mb-2.5">Strongest skills</p>
        <ul className="space-y-1">
          {diagnosis.math.strengths.slice(0, 1).concat(diagnosis.english.strengths.slice(0, 2)).map((item, i) => (
            <li key={item.id}>
              <SpectrumRow name={item.name} score={item.score} tone="strong" size="sm" showBand={false} delay={i * 60} />
            </li>
          ))}
        </ul>

        <p className="eyebrow mt-4 mb-2.5">Needs attention</p>
        <ul className="space-y-1">
          {diagnosis.topGaps.slice(0, 2).map((item, i) => (
            <li key={item.id}>
              <SpectrumRow name={item.name} score={item.score} tone="risk" size="sm" showBand={false} delay={i * 60} />
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line bg-canvas px-4 py-4">
        <p className="eyebrow">Next step</p>
        <p className="mt-1.5 text-[13.5px] font-semibold leading-snug text-ink">{diagnosis.nextStep.title}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">{diagnosis.nextStep.reason}</p>
        <Link
          href="/student/learning-path"
          className="mt-3 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-ink text-[13px] font-medium text-canvas transition-transform hover:-translate-y-px"
        >
          Continue learning
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function TeacherDashPreview() {
  const roster = studentsInClass("cls_10b");
  const cohortMath = diagnoseCohort(roster, "math");
  const cohortEnglish = diagnoseCohort(roster, "english");
  const avgMath = Math.round(roster.reduce((a, s) => a + s.math, 0) / roster.length);
  const avgEnglish = Math.round(roster.reduce((a, s) => a + s.english, 0) / roster.length);
  const weakest = [...cohortMath, ...cohortEnglish].sort((a, b) => a.score - b.score).slice(0, 4);
  const notDiagnosed = roster.filter((s) => !s.lastDiagnostic).length;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
        <p className="text-[12.5px] font-semibold text-ink">Teacher dashboard · Class 10-B</p>
        <Badge tone="brand" size="xs">{roster.length} students</Badge>
      </div>

      <div className="grid grid-cols-3 gap-px bg-line">
        {[
          { label: "Avg Mathematics", value: `${avgMath}%`, tone: "text-brand" },
          { label: "Avg English", value: `${avgEnglish}%`, tone: "text-accent" },
          { label: "Not yet diagnosed", value: String(notDiagnosed), tone: notDiagnosed ? "text-developing" : "text-strong" },
        ].map((item) => (
          <div key={item.label} className="bg-surface px-4 py-3.5">
            <p className="text-[10.5px] uppercase tracking-[0.08em] text-faint">{item.label}</p>
            <p className={cn("tnum mt-1 font-display text-[24px] leading-none", item.tone)}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-4 py-4">
        <p className="eyebrow mb-3">Weakest topics in this class</p>
        <ul className="divide-y divide-line">
          {weakest.map((row, index) => (
            <li key={row.topicId}>
              <div className="flex items-baseline justify-between gap-3 py-1.5">
                <span className="truncate text-[12.5px] text-ink-soft">{row.name}</span>
                <span className="tnum shrink-0 text-[11.5px] text-muted">{row.atRisk} below 60%</span>
                <span className={cn("tnum shrink-0 text-[13px] font-semibold", row.score >= 60 ? "text-developing" : "text-risk")}>
                  {row.score}%
                </span>
              </div>
              <ProgressBar value={row.score} size="xs" className="mb-2.5" />
              {index === 0 ? (
                <p className="mb-3 rounded-md border border-brand-line bg-brand-soft/60 px-3 py-2 text-[12px] leading-relaxed text-ink">
                  {row.atRisk} of {row.students} students are below threshold here — this is the next lesson to teach.
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line bg-canvas px-4 py-3.5">
        <p className="eyebrow mb-2">Recent diagnostics</p>
        <ul className="space-y-1.5">
          {roster.slice(0, 3).map((student) => (
            <li key={student.id} className="flex items-center gap-2.5 text-[12px]">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[9.5px] text-ink-soft">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </span>
              <span className="min-w-0 flex-1 truncate text-ink-soft">{student.name}</span>
              <span className="tnum text-[11px] text-faint">{student.lastDiagnostic ? formatDate(student.lastDiagnostic, { year: undefined }) : "—"}</span>
              <span className="tnum shrink-0 font-semibold text-ink">{student.overall}%</span>
            </li>
          ))}
        </ul>
        <Link href="/teacher/dashboard" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline">
          Open the teacher dashboard
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export function TutorDashPreview() {
  const roster = STUDENTS.slice(0, 5);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
        <p className="text-[12.5px] font-semibold text-ink">Tutor roster</p>
        <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
          <Users className="size-3.5" aria-hidden="true" />
          {roster.length} of 6 students
        </span>
      </div>

      <ul className="divide-y divide-line">
        {roster.map((student) => {
          const gaps = prioritiseGaps(student.topicScores, student.math <= student.english ? "math" : "english").slice(0, 1);
          const gap = gaps[0];
          return (
            <li key={student.id} className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-[10.5px] font-semibold text-canvas">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{student.name}</p>
                <p className="mt-0.5 truncate text-[11.5px] text-muted">
                  {gap ? `Start with ${gap.name} · ${gap.score}%` : "No gaps below threshold"}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="tnum text-[12.5px] font-semibold text-ink">{student.overall}%</p>
                <DeltaTag value={student.trend} className="mt-0.5 justify-end" />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas px-4 py-3">
        <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
          <CalendarClock className="size-3.5" aria-hidden="true" />
          Pre-session briefing ready for 5 students
        </span>
        <Link href="/teacher/students" className="text-[12.5px] font-medium text-brand hover:underline">
          Open roster
        </Link>
      </div>
    </div>
  );
}

export function SchoolDashPreview() {
  const current = SCHOOL_TERMS[SCHOOL_TERMS.length - 1];
  const previousTerm = SCHOOL_TERMS[SCHOOL_TERMS.length - 2];
  const weakestGroups = [...YEAR_GROUP_PERFORMANCE].sort((a, b) => a.overall ?? a.math - b.math);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-md">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
        <p className="text-[12.5px] font-semibold text-ink">Northgate International Academy</p>
        <Badge tone="accent" size="xs">School plan</Badge>
      </div>

      <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {[
          { label: "Students", value: "1,284" },
          { label: "Teachers", value: "96" },
          { label: "Avg Mathematics", value: `${current.math}%` },
          { label: "Avg English", value: `${current.english}%` },
        ].map((item) => (
          <div key={item.label} className="bg-surface px-4 py-3.5">
            <p className="text-[10.5px] uppercase tracking-[0.08em] text-faint">{item.label}</p>
            <p className="tnum mt-1 font-display text-[22px] leading-none text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-line px-4 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="eyebrow">Improvement since {previousTerm.term}</p>
          <DeltaTag value={current.overall - previousTerm.overall} />
        </div>
        <ul className="mt-3 space-y-2">
          {weakestGroups.slice(0, 4).map((group) => (
            <li key={group.group}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-[12px]">
                <span className="text-ink-soft">{group.group}</span>
                <span className="tnum text-muted">
                  Math {group.math}% · Eng {group.english}%
                </span>
              </div>
              <ProgressBar value={Math.round((group.math + group.english) / 2)} size="xs" />
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-line bg-canvas px-4 py-3.5">
        <Link href="/school/analytics" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline">
          Open school analytics
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
