"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarClock, CalendarPlus, CheckCircle2, ClipboardList, FileCheck2, Plus, Send, Sigma, BookOpen, Users,
} from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/States";
import { Card, CardHeader } from "@/components/ui/Card";
import { DataTable, StatusPill } from "@/components/admin/AdminPrimitives";

const today = () => new Date().toISOString().slice(0, 10);

function dueMeta(dueAt) {
  const due = new Date(`${dueAt}T23:59:59`);
  const now = new Date();
  const days = Math.ceil((due - now) / 86400000);
  if (days > 1) return { label: `Due in ${days} days`, tone: "text-muted" };
  if (days === 1) return { label: "Due tomorrow", tone: "text-developing" };
  if (days === 0) return { label: "Due today", tone: "text-developing" };
  return { label: `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`, tone: "text-risk" };
}

function assignmentStatus(assignment) {
  if (assignment.status === "closed") return "closed";
  const due = new Date(`${assignment.dueAt}T23:59:59`);
  return due < new Date() ? "overdue" : "open";
}

/** /teacher/assignments — create, track and review assigned work. */
export default function TeacherAssignments() {
  const { assignments, submissions, tests, classesLocal, derived, assignmentCreate } = useApp();
  const students = derived.allStudents ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: "", testId: "", audience: "class", classId: "", individual: [], dueAt: "", note: "" });
  const [errors, setErrors] = useState({});

  const publishedTests = tests.filter((t) => t.status === "published");
  const selectedTest = publishedTests.find((t) => t.id === form.testId);

  const rows = useMemo(
    () =>
      assignments.map((assignment) => {
        const test = tests.find((t) => t.id === assignment.testId);
        const klass = classesLocal.find((c) => c.id === assignment.classId);
        const audience = klass ? `Class ${klass.name}` : assignment.assignedTo?.length ? `${assignment.assignedTo.length} students individually` : "Whole cohort";
        return {
          ...assignment,
          testTitle: test?.title ?? assignment.title,
          audience,
          submitted: submissions.filter((s) => s.assignmentId === assignment.id).length,
          status: assignmentStatus(assignment),
        };
      }),
    [assignments, tests, classesLocal, submissions],
  );

  const openCreate = () => {
    const firstClass = classesLocal.find((c) => c.teacherId === "tch_002") ?? classesLocal[0];
    setForm({
      title: "",
      testId: publishedTests[0]?.id ?? "",
      audience: "class",
      classId: firstClass?.id ?? "",
      individual: [],
      dueAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      note: "",
    });
    setErrors({});
    setCreateOpen(true);
  };

  const toggleStudent = (id) =>
    setForm((f) => ({
      ...f,
      individual: f.individual.includes(id) ? f.individual.filter((s) => s !== id) : [...f.individual, id],
    }));

  const submit = () => {
    const next = {};
    if (form.title.trim().length < 4) next.title = "Name the assignment so students recognise it.";
    if (!form.testId) next.testId = "Choose a published test.";
    if (!form.dueAt) next.dueAt = "Set a deadline.";
    if (form.audience === "class" && !form.classId) next.classId = "Choose a class.";
    if (form.audience === "individual" && !form.individual.length) next.individual = "Pick at least one student.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const test = publishedTests.find((t) => t.id === form.testId);
    assignmentCreate({
      title: form.title.trim(),
      testId: form.testId,
      subject: test?.subject ?? "both",
      classId: form.audience === "class" ? form.classId : null,
      assignedTo: form.audience === "individual" ? form.individual : [],
      dueAt: form.dueAt,
      estimatedMinutes: test?.durationMinutes ?? 15,
      questionCount: test?.questionCount ?? 12,
      note: form.note.trim() || null,
    });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Teaching</p>
          <h1 className="mt-1 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">Assignments</h1>
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
            Assign a published test to a class or to individual students. Submissions arrive here the moment a
            student finishes.
          </p>
        </div>
        <Button size="md" onClick={openCreate} disabled={!publishedTests.length}>
          <Plus className="size-4" aria-hidden="true" /> Create Assignment
        </Button>
      </div>

      {!publishedTests.length ? (
        <EmptyState
          icon={FileCheck2}
          title="No published tests yet"
          description="Assignments draw from published tests. The demo ships with three — if you unpublished them all, republish one from the admin console."
          action={<Button size="sm" href="/admin/tests">Open tests manager</Button>}
        />
      ) : null}

      <DataTable
        columns={[
          { key: "title", label: "Assignment", render: (a) => (
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-ink">{a.title}</span>
              <span className="block max-w-[320px] truncate text-[11px] text-muted">{a.testTitle}</span>
            </span>
          ) },
          { key: "subject", label: "Subject", render: (a) => (
            <Badge tone={a.subject === "math" ? "brand" : a.subject === "english" ? "accent" : "info"} size="xs"
              icon={a.subject === "math" ? Sigma : a.subject === "english" ? BookOpen : undefined}>
              {a.subject === "both" ? "Math + English" : a.subject === "math" ? "Math" : "English"}
            </Badge>
          ) },
          { key: "audience", label: "Assigned to", render: (a) => <span className="text-muted">{a.audience}</span> },
          { key: "dueAt", label: "Deadline", render: (a) => {
            const meta = dueMeta(a.dueAt);
            return (
              <span className="min-w-0">
                <span className="tnum block font-mono text-[11.5px] text-ink">{a.dueAt}</span>
                <span className={cn("block text-[11px]", meta.tone)}>{meta.label}</span>
              </span>
            );
          } },
          { key: "submitted", label: "Submissions", align: "right", render: (a) => (
            <span className="tnum font-mono text-[12px] font-semibold text-ink">{a.submitted}</span>
          ) },
          { key: "status", label: "Status", render: (a) => <StatusPill status={a.status} /> },
        ]}
        rows={rows}
        keyFor={(a) => a.id}
        empty={<EmptyState icon={ClipboardList} title="No assignments yet" description="Create your first assignment — a class diagnostic takes two minutes to set up."
          action={<Button size="sm" onClick={openCreate}><Plus className="size-3.5" aria-hidden="true" /> Create Assignment</Button>} />}
      />

      <Card>
        <CardHeader title="Recent submissions" description="Live feed — recorded as soon as students finish." icon={Send}
          action={<Link href="/teacher/analytics" className="text-[12px] font-medium text-brand hover:underline">Class analytics →</Link>} />
        {submissions.length ? (
          <ul className="divide-y divide-line border-t border-line">
            {submissions.slice(0, 6).map((sub) => (
              <li key={sub.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-5 py-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-strong" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{sub.studentName ?? "Student"}</span>
                <span className="hidden min-w-0 flex-1 truncate text-[12px] text-muted sm:block">{sub.assignmentTitle}</span>
                <Badge tone={(sub.score ?? 0) >= 80 ? "strong" : (sub.score ?? 0) >= 60 ? "developing" : "risk"} size="xs">{sub.score}%</Badge>
                <time className="tnum font-mono text-[10.5px] text-faint">{sub.submittedAt}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t border-line px-5 py-6 text-center text-[12.5px] text-muted">
            No submissions yet. When a student finishes an assigned test it appears here instantly.
          </p>
        )}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} size="md" icon={CalendarPlus}
        title="Create an assignment" description="Pick a published test, choose who receives it, and set the deadline.">
        <div className="space-y-4">
          <Field label="Assignment name" required error={errors.title} htmlFor="ta-title"
            hint="Students see this exact name in their Assignments tab.">
            <Input id="ta-title" value={form.title} error={errors.title} placeholder="Week 4 algebra checkpoint — Class 10-B"
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </Field>

          <Field label="Test" required error={errors.testId} htmlFor="ta-test">
            <Select id="ta-test" value={form.testId} onChange={(value) => setForm((f) => ({ ...f, testId: value }))}
              options={publishedTests.map((t) => ({ value: t.id, label: `${t.title} · ${t.questionCount} Qs · ${t.durationMinutes} min${t.adaptive ? " · adaptive" : ""}` }))} />
          </Field>

          <div>
            <p className="mb-1.5 text-[12px] font-semibold text-ink">Assign to</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setForm((f) => ({ ...f, audience: "class" }))} aria-pressed={form.audience === "class"}
                className={cn("flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                  form.audience === "class" ? "border-brand bg-brand-soft" : "border-line hover:border-line-2")}>
                <Users className={cn("size-4", form.audience === "class" ? "text-brand" : "text-muted")} aria-hidden="true" />
                <span>
                  <span className="block text-[12.5px] font-semibold text-ink">A whole class</span>
                  <span className="block text-[11px] text-muted">Everyone on the roster receives it</span>
                </span>
              </button>
              <button type="button" onClick={() => setForm((f) => ({ ...f, audience: "individual" }))} aria-pressed={form.audience === "individual"}
                className={cn("flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors",
                  form.audience === "individual" ? "border-brand bg-brand-soft" : "border-line hover:border-line-2")}>
                <CalendarClock className={cn("size-4", form.audience === "individual" ? "text-brand" : "text-muted")} aria-hidden="true" />
                <span>
                  <span className="block text-[12.5px] font-semibold text-ink">Individual students</span>
                  <span className="block text-[11px] text-muted">Targeted support for specific learners</span>
                </span>
              </button>
            </div>
          </div>

          {form.audience === "class" ? (
            <Field label="Class" required error={errors.classId} htmlFor="ta-class">
              <Select id="ta-class" value={form.classId} onChange={(value) => setForm((f) => ({ ...f, classId: value }))}
                options={classesLocal.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade} · ${c.size ?? 0} students` }))} />
            </Field>
          ) : (
            <div>
              <p className="mb-1.5 text-[12px] font-semibold text-ink">
                Students <span className="font-normal text-muted">— {form.individual.length} selected</span>
              </p>
              <div className="scroll-slim max-h-44 space-y-1 overflow-y-auto rounded-md border border-line p-2">
                {students.slice(0, 24).map((student) => (
                  <label key={student.id} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 hover:bg-surface-2">
                    <input type="checkbox" checked={form.individual.includes(student.id)} onChange={() => toggleStudent(student.id)}
                      className="size-3.5 accent-[#2b4fe0]" aria-label={`Assign to ${student.name}`} />
                    <span className="min-w-0 flex-1 truncate text-[12px] text-ink">{student.name}</span>
                    <span className="shrink-0 font-mono text-[10.5px] text-faint">{student.className}</span>
                  </label>
                ))}
              </div>
              {errors.individual ? <p className="mt-1.5 text-[12px] text-risk">{errors.individual}</p> : null}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Deadline" required error={errors.dueAt} htmlFor="ta-due">
              <Input id="ta-due" type="date" value={form.dueAt} error={errors.dueAt} min={today()}
                onChange={(e) => setForm((f) => ({ ...f, dueAt: e.target.value }))} />
            </Field>
            <Field label="Estimated minutes" htmlFor="ta-mins" hint="Taken from the selected test.">
              <Input id="ta-mins" type="number" readOnly value={selectedTest?.durationMinutes ?? 15} onChange={() => {}} />
            </Field>
          </div>

          <Field label="Note to students" optional htmlFor="ta-note">
            <Textarea id="ta-note" rows={2} value={form.note} placeholder="e.g. Revise inequalities before starting — results feed next week's plan."
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
          </Field>

          <div className="flex justify-end gap-2 border-t border-line pt-3">
            <Button size="sm" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={submit}><Send className="size-3.5" aria-hidden="true" /> Create assignment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
