"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, CheckCircle2, ClipboardList, Clock3, Play, Sigma, BookOpen, TriangleAlert } from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import { buildSubjectSet } from "@/lib/data/questions";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { Card } from "@/components/ui/Card";

const SUBJECT_META = {
  math: { label: "Mathematics", icon: Sigma, tone: "brand" },
  english: { label: "English", icon: BookOpen, tone: "accent" },
  both: { label: "Math + English", icon: ClipboardList, tone: "info" },
};

function daysUntil(dateStr) {
  const due = new Date(`${dateStr}T23:59:59`);
  return Math.ceil((due - new Date()) / 86400000);
}

function dueLabel(dateStr) {
  const days = daysUntil(dateStr);
  if (days > 1) return `Due in ${days} days`;
  if (days === 1) return "Due tomorrow";
  if (days === 0) return "Due today";
  return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
}

/** /student/assignments — everything a teacher has set, with one clear action each. */
export default function StudentAssignments() {
  const router = useRouter();
  const { assignments, submissions, tests, startTest, patch, toast, questions, activeTest, user } = useApp();
  const [tab, setTab] = useState("upcoming");

  const enriched = useMemo(
    () =>
      assignments.map((assignment) => {
        const test = tests.find((t) => t.id === assignment.testId);
        const submission = submissions.find(
          (s) => s.assignmentId === assignment.id && (!s.studentId || s.studentId === user?.id || s.studentId === "stu_0001"),
        );
        const inProgress = activeTest?.assignmentId === assignment.id;
        const days = daysUntil(assignment.dueAt);
        let state = "upcoming";
        if (submission) state = "completed";
        else if (inProgress) state = "progress";
        else if (days < 0) state = "overdue";
        return { ...assignment, test, submission, state, days };
      }),
    [assignments, tests, submissions, activeTest, user],
  );

  const buckets = {
    upcoming: enriched.filter((a) => a.state === "upcoming"),
    progress: enriched.filter((a) => a.state === "progress"),
    completed: enriched.filter((a) => a.state === "completed"),
    overdue: enriched.filter((a) => a.state === "overdue"),
  };

  const start = (assignment) => {
    const test = assignment.test;
    const subject = test?.subject ?? assignment.subject ?? "math";
    const count = Math.min(test?.questionCount ?? 12, 15);
    const first = subject === "english" ? "english" : "math";
    const queue = subject === "both" ? ["english"] : [];
    patch({ pendingSubjects: queue, flowTimed: true });
    startTest({
      subject: first,
      questions: buildSubjectSet(first, subject === "both" ? count : count, 17, questions),
      timed: true,
      durationMinutes: test?.durationMinutes ?? assignment.estimatedMinutes ?? 14,
      adaptive: Boolean(test?.adaptive),
      label: assignment.title,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
    });
    toast(`Starting “${assignment.title}”. The timer runs — answer honestly.`, { tone: "info", title: "Assignment started" });
    router.push(`/student/diagnostic/${first}`);
  };

  const list = buckets[tab] ?? [];

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Learning</p>
        <h1 className="mt-1 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">My assignments</h1>
        <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
          Work your teacher has set, with deadlines and estimated times. Finishing an assignment updates your skill
          profile exactly like a diagnostic does.
        </p>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        ariaLabel="Assignment groups"
        tabs={[
          { id: "upcoming", label: `Upcoming (${buckets.upcoming.length})` },
          { id: "progress", label: `In progress (${buckets.progress.length})` },
          { id: "completed", label: `Completed (${buckets.completed.length})` },
          { id: "overdue", label: `Overdue (${buckets.overdue.length})` },
        ]}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={tab === "completed" ? CheckCircle2 : tab === "overdue" ? TriangleAlert : CalendarClock}
          title={
            tab === "completed" ? "No completed assignments yet"
            : tab === "overdue" ? "Nothing overdue — good"
            : tab === "progress" ? "No assignment in progress"
            : "No upcoming assignments"
          }
          description={
            tab === "upcoming"
              ? "When a teacher assigns a test it appears here with its deadline. Meanwhile, a self-directed diagnostic keeps your profile fresh."
              : tab === "overdue"
                ? "Every assignment is submitted or still inside its deadline."
                : "Start an assignment and it moves here until you submit."
          }
          action={<Button size="sm" href="/student/diagnostic/start">Start a diagnostic instead</Button>}
        />
      ) : null}

      <ul className="grid gap-3 md:grid-cols-2">
        {list.map((assignment) => {
          const meta = SUBJECT_META[assignment.test?.subject ?? assignment.subject] ?? SUBJECT_META.both;
          const SubjectIcon = meta.icon;
          return (
            <li key={assignment.id}>
              <Card className={cn("flex h-full flex-col p-4", assignment.state === "overdue" && "border-risk/35")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-ink">{assignment.title}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-muted">{assignment.test?.title ?? "Assigned test"}</p>
                  </div>
                  <Badge tone={meta.tone} size="xs" icon={SubjectIcon}>{meta.label}</Badge>
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-2 border-y border-line py-2.5 text-center">
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-faint">Questions</dt>
                    <dd className="tnum mt-0.5 font-mono text-[13px] font-semibold text-ink">{assignment.test?.questionCount ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-faint">Time</dt>
                    <dd className="tnum mt-0.5 font-mono text-[13px] font-semibold text-ink">{assignment.estimatedMinutes ?? 15} min</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold uppercase tracking-[0.08em] text-faint">Deadline</dt>
                    <dd className="tnum mt-0.5 font-mono text-[13px] font-semibold text-ink">{assignment.dueAt.slice(5)}</dd>
                  </div>
                </dl>

                <p className={cn("mt-2 flex items-center gap-1.5 text-[11.5px] font-medium",
                  assignment.state === "completed" ? "text-strong"
                  : assignment.days < 0 ? "text-risk"
                  : assignment.days <= 1 ? "text-developing" : "text-muted")}>
                  {assignment.state === "completed" ? (
                    <><CheckCircle2 className="size-3.5" aria-hidden="true" /> Submitted · scored {assignment.submission?.score}%</>
                  ) : (
                    <><Clock3 className="size-3.5" aria-hidden="true" /> {dueLabel(assignment.dueAt)}</>
                  )}
                </p>

                {assignment.note ? (
                  <p className="mt-2 rounded-md border border-line bg-surface-2 px-3 py-2 text-[11.5px] leading-relaxed text-muted">
                    <strong className="font-semibold text-ink-soft">Teacher's note:</strong> {assignment.note}
                  </p>
                ) : null}

                <div className="mt-auto pt-3">
                  {assignment.state === "completed" ? (
                    <Button size="sm" variant="secondary" full href="/student/diagnostic/results">
                      View My Skill Analysis
                    </Button>
                  ) : (
                    <Button size="sm" full onClick={() => start(assignment)}
                      className={assignment.state === "overdue" ? "border-risk bg-risk hover:brightness-95" : undefined}>
                      <Play className="size-3.5" aria-hidden="true" />
                      {assignment.state === "overdue" ? `Submit Late — Start ${meta.label} Assignment` : `Start ${meta.label} Assignment`}
                    </Button>
                  )}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
