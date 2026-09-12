"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BarChart3, CalendarClock, ClipboardList, Download, FilePlus, Flag, Plus, School as SchoolIcon,
  Send, Users, UserPlus,
} from "lucide-react";

import { cn, formatDate, formatRelative } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { CLASSES_WITH_SIZE, STUDENTS, studentsInClass, ASSESSMENTS, getClass } from "@/lib/data/people";
import { diagnoseCohort, prioritiseGaps, diagnose } from "@/lib/engine/diagnose";
import Button from "@/components/ui/Button";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import { Card, SectionHeading } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import { Field, Input, Select, Segmented } from "@/components/ui/Field";
import { ChartCard, CohortBars, TopicBars } from "@/components/charts";
import { SpectrumRow } from "@/components/domain/Primitives";
import { EmptyState } from "@/components/ui/States";

const bandTone = (score) => (score >= 80 ? "strong" : score >= 60 ? "developing" : "risk");
const BAND_TEXT = { strong: "text-strong", developing: "text-developing", risk: "text-risk" };

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------- shared modals ---- */

export function AddStudentModal({ open, onClose, classId }) {
  const { studentAdd } = useApp();
  const [values, setValues] = useState({ name: "", email: "", classId: classId ?? "cls_10b" });
  const [error, setError] = useState("");

  const submit = () => {
    if (values.name.trim().length < 2) return setError("Enter the student's full name.");
    setError("");
    const klass = CLASSES_WITH_SIZE.find((c) => c.id === values.classId);
    studentAdd({
      name: values.name.trim(),
      firstName: values.name.trim().split(" ")[0],
      email: values.email.trim() || null,
      classId: values.classId,
      className: klass?.name ?? "—",
      grade: klass?.grade ?? 10,
      teacherId: klass?.teacherId ?? "tch_002",
    });
    setValues({ name: "", email: "", classId: values.classId });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add a student" description="They receive an invite link; their first diagnostic sets the baseline." size="sm">
      <div className="space-y-4">
        <Field label="Full name" required error={error} htmlFor="as-name">
          <Input id="as-name" value={values.name} error={error} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} placeholder="e.g. Malika Yusupova" />
        </Field>
        <Field label="Guardian email" optional hint="Used for the invite and, on Pro, the guardian read-only seat." htmlFor="as-email">
          <Input id="as-email" type="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} placeholder="guardian@example.com" />
        </Field>
        <Select label="Class" id="as-class" value={values.classId} onChange={(value) => setValues((v) => ({ ...v, classId: value }))}
          options={CLASSES_WITH_SIZE.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade}` }))} />
      </div>
      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={submit}><UserPlus className="size-4" aria-hidden="true" /> Add student</Button>
      </div>
    </Modal>
  );
}

export function AssignModal({ open, onClose, defaultClass }) {
  const { assignmentCreate } = useApp();
  const [values, setValues] = useState({ classId: defaultClass ?? "cls_10b", subject: "both", due: "2026-09-26", timed: "untimed" });
  const roster = studentsInClass(values.classId);

  const submit = () => {
    const klass = CLASSES_WITH_SIZE.find((c) => c.id === values.classId);
    const paper = values.subject === "both"
      ? { id: "tst_baseline", title: "Autumn baseline · Full diagnostic", count: 30, minutes: 26 }
      : values.subject === "math"
        ? { id: "tst_algebra", title: "Algebra checkpoint · Equations & inequalities", count: 12, minutes: 14 }
        : { id: "tst_literacy", title: "Literacy checkpoint · Reading & vocabulary", count: 12, minutes: 14 };
    assignmentCreate({
      title: `${paper.title} — Class ${klass?.name ?? ""}`.trim(),
      testId: paper.id,
      subject: values.subject,
      classId: values.classId,
      assignedTo: [],
      dueAt: values.due,
      estimatedMinutes: paper.minutes,
      questionCount: paper.count,
      timed: values.timed === "timed",
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Assign a diagnostic" description="Students see it at the top of their dashboard until it is sat." size="md">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Class" id="ag-class" value={values.classId} onChange={(value) => setValues((v) => ({ ...v, classId: value }))}
          options={CLASSES_WITH_SIZE.map((c) => ({ value: c.id, label: `${c.name} · ${studentsInClass(c.id).length} students` }))} />
        <Select label="Paper" id="ag-subject" value={values.subject} onChange={(value) => setValues((v) => ({ ...v, subject: value }))}
          options={[{ value: "both", label: "Full (Math + English)" }, { value: "math", label: "Mathematics focus" }, { value: "english", label: "English focus" }]} />
        <Field label="Due date" htmlFor="ag-due"><Input id="ag-due" type="date" value={values.due} onChange={(e) => setValues((v) => ({ ...v, due: e.target.value }))} /></Field>
        <div>
          <p className="mb-1.5 text-[12px] font-medium text-ink-soft">Conditions</p>
          <Segmented size="sm" ariaLabel="Conditions" options={[{ value: "untimed", label: "Untimed" }, { value: "timed", label: "Timed" }]} value={values.timed} onChange={(value) => setValues((v) => ({ ...v, timed: value }))} />
        </div>
      </div>
      <p className="mt-4 rounded-md border border-line bg-canvas p-3 text-[12px] leading-relaxed text-muted">
        {roster.length} students will be notified. Results land in your analytics the moment each paper is submitted —
        no marking, no data entry.
      </p>
      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={submit}><Send className="size-4" aria-hidden="true" /> Assign to {roster.length} students</Button>
      </div>
    </Modal>
  );
}

export function CreateClassModal({ open, onClose }) {
  const { classCreate } = useApp();
  const [values, setValues] = useState({ name: "", grade: "10", room: "" });
  const [error, setError] = useState("");

  const submit = () => {
    if (!values.name.trim()) return setError("Give the class a name, e.g. 10-C.");
    setError("");
    classCreate({
      name: values.name.trim(),
      grade: Number(values.grade),
      room: values.room.trim() || "—",
      subject: "Mixed",
      teacherId: "tch_002",
    });
    setValues({ name: "", grade: "10", room: "" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create a class" size="sm">
      <div className="space-y-4">
        <Field label="Class name" required error={error} htmlFor="cc-name">
          <Input id="cc-name" value={values.name} error={error} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} placeholder="10-C" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Grade" id="cc-grade" value={values.grade} onChange={(value) => setValues((v) => ({ ...v, grade: value }))}
            options={["8", "9", "10", "11", "12"].map((g) => ({ value: g, label: `Grade ${g}` }))} />
          <Field label="Room" optional htmlFor="cc-room"><Input id="cc-room" value={values.room} onChange={(e) => setValues((v) => ({ ...v, room: e.target.value }))} placeholder="B-210" /></Field>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={submit}><Plus className="size-4" aria-hidden="true" /> Create class</Button>
      </div>
    </Modal>
  );
}

/* ======================================================= 55 · dashboard == */

export function TeacherDashboard() {
  const { toast } = useApp();
  const [classId, setClassId] = useState("cls_10b");
  const [modal, setModal] = useState(null);
  const roster = studentsInClass(classId);
  const cohortMath = diagnoseCohort(roster, "math");
  const cohortEnglish = diagnoseCohort(roster, "english");
  const weakest = [...cohortMath, ...cohortEnglish].sort((a, b) => a.score - b.score).slice(0, 5);
  const avgMath = Math.round(roster.reduce((a, s) => a + s.math, 0) / roster.length);
  const avgEnglish = Math.round(roster.reduce((a, s) => a + s.english, 0) / roster.length);
  const undiagnosed = roster.filter((s) => !s.lastDiagnostic);
  const atRisk = roster.filter((s) => s.overall < 60);

  const exportReport = () => {
    downloadCsv(`prisma-class-${classId}.csv`, [
      ["Student", "Class", "Mathematics", "English", "Overall", "Trend", "Last diagnostic"],
      ...roster.map((s) => [s.name, s.className, s.math, s.english, s.overall, s.trend, s.lastDiagnostic ?? "not sat"]),
    ]);
    toast("Class report downloaded as CSV.", { tone: "success", title: "Export complete" });
  };

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden p-6">
        <div className="field-brand pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Teacher workspace</p>
            <h1 className="mt-2 font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">
              See what your students actually understand.
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
              Class averages hide the lesson. The weakest-topic ranking below tells you what to teach next — and to whom.
            </p>
          </div>
          <Segmented
            ariaLabel="Class"
            options={CLASSES_WITH_SIZE.map((c) => ({ value: c.id, label: c.name }))}
            value={classId}
            onChange={setClassId}
            size="sm"
          />
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
          {[
            { label: "Students", value: roster.length, sub: `${undiagnosed.length} not yet diagnosed` },
            { label: "Average Math", value: `${avgMath}%`, tone: avgMath >= 60 ? "text-brand" : "text-risk" },
            { label: "Average English", value: `${avgEnglish}%`, tone: avgEnglish >= 60 ? "text-accent" : "text-risk" },
            { label: "Below threshold", value: atRisk.length, sub: "overall < 60%", tone: atRisk.length ? "text-risk" : "text-strong" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-3.5">
              <p className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{stat.label}</p>
              <p className={cn("tnum mt-1 font-display text-[26px] leading-none", stat.tone ?? "text-ink")}>{stat.value}</p>
              {stat.sub ? <p className="mt-1 text-[11px] text-muted">{stat.sub}</p> : null}
            </div>
          ))}
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2.5">
          <Button size="md" onClick={() => setModal("assign")}>
            <Send className="size-4" aria-hidden="true" />
            Assign Diagnostic
          </Button>
          <Button size="md" variant="secondary" onClick={() => setModal("student")}>
            <UserPlus className="size-4" aria-hidden="true" />
            Add Student
          </Button>
          <Button size="md" variant="secondary" onClick={() => setModal("class")}>
            <Plus className="size-4" aria-hidden="true" />
            Create Class
          </Button>
          <Button size="md" variant="secondary" href="/teacher/assignments">
            <ClipboardList className="size-4" aria-hidden="true" />
            Create Assignment
          </Button>
          <Button size="md" variant="ghost" href="/teacher/analytics">
            View Class Analytics
          </Button>
          <Button size="md" variant="ghost" onClick={exportReport}>
            <Download className="size-4" aria-hidden="true" />
            Export Report
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeading eyebrow="Weakest topics" title="What to teach next." size="sm" />
            <Link href="/teacher/analytics" className="text-[12px] font-medium text-brand hover:underline">Analytics →</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {weakest.map((row, index) => (
              <li key={row.topicId}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-[13px] text-ink-soft">
                    <span className="tnum mr-2 font-mono text-[10px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                    {row.name}
                  </span>
                  <span className="tnum shrink-0 text-[11.5px] text-muted">{row.atRisk} of {row.students} below 60%</span>
                  <span className={cn("tnum shrink-0 text-[13px] font-semibold", BAND_TEXT[bandTone(row.score)])}>{row.score}%</span>
                </div>
                <ProgressBar value={row.score} tone={bandTone(row.score)} size="xs" className="mt-1.5" />
              </li>
            ))}
          </ul>
          <Button
            size="sm"
            className="mt-5"
            onClick={() => {
              setModal("assign");
              toast(`Prefilled for ${weakest[0]?.name}: assign targeted practice after the next diagnostic.`, { tone: "info" });
            }}
          >
            <Flag className="size-3.5" aria-hidden="true" />
            Assign targeted practice
          </Button>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-3">
            <SectionHeading eyebrow="Recent diagnostics" title="Latest submissions." size="sm" />
            <Link href="/teacher/students" className="text-[12px] font-medium text-brand hover:underline">All students →</Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {roster.slice(0, 6).map((student) => (
              <li key={student.id}>
                <Link href="/teacher/students" className="flex items-center gap-3 py-2.5 transition-opacity hover:opacity-80">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-[10px] font-semibold text-canvas">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{student.name}</span>
                    <span className="mt-0.5 block text-[11px] text-muted">
                      {student.lastDiagnostic ? `${formatRelative(student.lastDiagnostic)} · ${student.className}` : "Not yet diagnosed"}
                    </span>
                  </span>
                  <DeltaTag value={student.trend} />
                  <span className="tnum shrink-0 text-[12.5px] font-semibold text-ink">{student.overall}%</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading eyebrow="Assigned assessments" title="Papers you have set." size="sm" />
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {ASSESSMENTS.slice(0, 4).map((assessment) => (
            <li key={assessment.id} className="rounded-lg border border-line bg-canvas p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-[13px] font-semibold text-ink">{assessment.title}</p>
                <Badge tone={assessment.status === "open" ? "developing" : assessment.status === "closed" ? "neutral" : "brand"} size="xs">{assessment.status}</Badge>
              </div>
              <p className="mt-1.5 text-[11.5px] text-muted">
                {getClass(assessment.assignedTo?.[0])?.name ?? "—"} · due {formatDate(assessment.dueAt)} · {assessment.completed}/{assessment.total} submitted
              </p>
              <ProgressBar value={Math.round((assessment.completed / assessment.total) * 100)} size="xs" className="mt-2.5" />
            </li>
          ))}
        </ul>
      </Card>

      <AddStudentModal open={modal === "student"} onClose={() => setModal(null)} classId={classId} />
      <AssignModal open={modal === "assign"} onClose={() => setModal(null)} defaultClass={classId} />
      <CreateClassModal open={modal === "class"} onClose={() => setModal(null)} />
    </div>
  );
}

/* ======================================================== 56 · students == */

export function StudentsManagement() {
  const { toast } = useApp();
  const [query, setQuery] = useState("");
  const [classId, setClassId] = useState("all");
  const [sort, setSort] = useState("overall");
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STUDENTS.filter((s) => (classId === "all" || s.classId === classId) && (!q || s.name.toLowerCase().includes(q)))
      .sort((a, b) => (sort === "overall" ? a.overall - b.overall : sort === "trend" ? b.trend - a.trend : a.name.localeCompare(b.name)));
  }, [query, classId, sort]);

  const detail = selected ? diagnose(selected.topicScores) : null;

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Students</p>
            <h1 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">{STUDENTS.length} learners on your roster.</h1>
          </div>
          <Button size="md" onClick={() => setAddOpen(true)}>
            <UserPlus className="size-4" aria-hidden="true" />
            Add Student
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Input aria-label="Search students" placeholder="Search by name…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
          <Select aria-label="Filter by class" value={classId} onChange={setClassId} className="max-w-[180px]"
            options={[{ value: "all", label: "All classes" }, ...CLASSES_WITH_SIZE.map((c) => ({ value: c.id, label: c.name }))]} />
          <Segmented ariaLabel="Sort" size="sm" options={[{ value: "overall", label: "Lowest first" }, { value: "trend", label: "Improving" }, { value: "name", label: "A–Z" }]} value={sort} onChange={setSort} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {rows.length ? (
          <div className="scroll-slim overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-[11px] uppercase tracking-[0.08em] text-muted">
                  <th className="px-5 py-2.5 font-semibold">Student</th>
                  <th className="px-3 py-2.5 font-semibold">Class</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Math</th>
                  <th className="px-3 py-2.5 text-right font-semibold">English</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Overall</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Trend</th>
                  <th className="px-5 py-2.5 font-semibold">Last diagnostic</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((student) => (
                  <tr key={student.id} onClick={() => setSelected(student)} className="cursor-pointer border-b border-line/70 transition-colors last:border-0 hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-mono text-[10px] font-semibold text-canvas">
                          {student.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                        <span className="text-[13px] font-medium text-ink">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12px] text-muted">{student.className}</td>
                    <td className={cn("tnum px-3 py-3 text-right text-[12.5px] font-semibold", BAND_TEXT[bandTone(student.math)])}>{student.math}%</td>
                    <td className={cn("tnum px-3 py-3 text-right text-[12.5px] font-semibold", BAND_TEXT[bandTone(student.english)])}>{student.english}%</td>
                    <td className="tnum px-3 py-3 text-right text-[13px] font-semibold text-ink">{student.overall}%</td>
                    <td className="px-3 py-3 text-right"><DeltaTag value={student.trend} className="justify-end" /></td>
                    <td className="px-5 py-3 text-[12px] text-muted">{student.lastDiagnostic ? formatDate(student.lastDiagnostic) : <Badge tone="developing" size="xs">Not sat</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Users} title="No students match" description="Adjust the search or class filter." action={<Button variant="secondary" size="sm" onClick={() => { setQuery(""); setClassId("all"); }}>Clear filters</Button>} />
        )}
      </Card>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.name ?? ""} description={selected ? `${selected.className} · overall ${selected.overall}% · trend ${selected.trend >= 0 ? "+" : ""}${selected.trend}` : ""} size="lg">
        {selected && detail ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="eyebrow mb-2">Mathematics gaps</p>
                <ul className="space-y-1.5">
                  {detail.math.gaps.slice(0, 4).map((gap) => (
                    <li key={gap.id}><SpectrumRow name={gap.name} score={gap.score} size="sm" showBand={false} meta={<span className="tnum text-risk">+{gap.impact}</span>} /></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-2">English gaps</p>
                <ul className="space-y-1.5">
                  {detail.english.gaps.slice(0, 4).map((gap) => (
                    <li key={gap.id}><SpectrumRow name={gap.name} score={gap.score} size="sm" showBand={false} meta={<span className="tnum text-risk">+{gap.impact}</span>} /></li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="rounded-md border border-brand-line bg-brand-soft/60 p-3.5 text-[12.5px] leading-relaxed text-ink">{detail.headline}</p>
            <div className="flex flex-wrap justify-end gap-2.5">
              <Button variant="ghost" size="md" onClick={() => setSelected(null)}>Close</Button>
              <Button size="md" href="/teacher/assignments" onClick={() => setSelected(null)}>
                <ClipboardList className="size-4" aria-hidden="true" />
                Create a targeted assignment
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <AddStudentModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}

/* ========================================================= 57 · classes == */

export function ClassManagement() {
  const { toast } = useApp();
  const [modal, setModal] = useState(null);

  return (
    <div className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="eyebrow">Classes</p>
          <h1 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">Four classes, one ranking each.</h1>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted">
            Every class card shows its own weakest-topic list — the same computation as the student report, aggregated.
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button size="md" onClick={() => setModal("class")}><Plus className="size-4" aria-hidden="true" /> Create Class</Button>
          <Button size="md" variant="secondary" onClick={() => setModal("assign")}><Send className="size-4" aria-hidden="true" /> Assign</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {CLASSES_WITH_SIZE.map((klass) => {
          const roster = studentsInClass(klass.id);
          const cohort = [...diagnoseCohort(roster, "math"), ...diagnoseCohort(roster, "english")].sort((a, b) => a.score - b.score);
          const avg = Math.round(roster.reduce((a, s) => a + s.overall, 0) / roster.length);
          return (
            <Card key={klass.id} className="card-lift rule-top relative overflow-hidden p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-[20px] leading-snug tracking-[-0.02em] text-ink">{klass.name}</h2>
                  <p className="mt-1 text-[12px] text-muted">Grade {klass.grade} · Room {klass.room} · {roster.length} students</p>
                </div>
                <div className="text-right">
                  <p className={cn("tnum font-display text-[26px] leading-none", BAND_TEXT[bandTone(avg)])}>{avg}%</p>
                  <p className="mt-1 text-[10.5px] uppercase tracking-[0.08em] text-faint">class average</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {cohort.slice(0, 3).map((row) => (
                  <li key={row.topicId} className="flex items-center justify-between gap-3 text-[12px]">
                    <span className="truncate text-ink-soft">{row.name}</span>
                    <span className="tnum shrink-0 text-muted">{row.atRisk} at risk</span>
                    <span className={cn("tnum shrink-0 font-semibold", BAND_TEXT[bandTone(row.score)])}>{row.score}%</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex gap-2 border-t border-line pt-3.5">
                <Button size="sm" variant="secondary" onClick={() => setModal("assign")}>Assign diagnostic</Button>
                <Button size="sm" variant="ghost" href="/teacher/analytics">Class analytics</Button>
              </div>
            </Card>
          );
        })}
      </div>

      <CreateClassModal open={modal === "class"} onClose={() => setModal(null)} />
      <AssignModal open={modal === "assign"} onClose={() => setModal(null)} />
    </div>
  );
}

/* ======================================================= 58 · analytics == */

export function TeacherAnalytics() {
  const { toast } = useApp();
  const [subject, setSubject] = useState("math");
  const cohort = diagnoseCohort(STUDENTS, subject);
  const sorted = [...cohort].sort((a, b) => a.score - b.score);
  const participation = Math.round((STUDENTS.filter((s) => s.lastDiagnostic).length / STUDENTS.length) * 100);
  const improving = STUDENTS.filter((s) => s.trend > 0).length;

  const exportCsv = () => {
    downloadCsv(`prisma-cohort-${subject}.csv`, [
      ["Topic", "Subject", "Class average", "Students below 60", "Students measured"],
      ...sorted.map((row) => [row.name, subject, row.score, row.atRisk, row.students]),
    ]);
    toast("Cohort analytics exported.", { tone: "success", title: "Export complete" });
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Teacher analytics</p>
            <h1 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">The cohort, ranked by need.</h1>
          </div>
          <div className="flex items-center gap-3">
            <Tabs2 value={subject} onChange={setSubject} />
            <Button size="sm" variant="secondary" onClick={exportCsv}><Download className="size-3.5" aria-hidden="true" /> Export CSV</Button>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
          {[
            { label: "Participation", value: `${participation}%` },
            { label: "Improving", value: `${improving}/${STUDENTS.length}` },
            { label: "Topics at risk", value: String(sorted.filter((r) => r.score < 60).length) },
            { label: "Weakest topic", value: sorted[0]?.name ?? "—", small: true },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-3.5">
              <p className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{stat.label}</p>
              <p className={cn("tnum mt-1 font-display leading-none text-ink", stat.small ? "text-[16px]" : "text-[24px]")}>{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <ChartCard title="Weakest topics across all your students" description="Class planning starts at the top of this list.">
        <TopicBars data={sorted.slice(0, 10).map((row) => ({ name: row.name, score: row.score }))} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="At-risk headcount per topic" description="How many learners sit below the 60% threshold.">
          <CohortBars data={sorted.slice(0, 8).map((row) => ({ label: row.name.split(" ")[0], value: row.atRisk }))} keys={[{ key: "value", name: "Students below 60%", color: "#bf4a3f" }]} height={240} />
        </ChartCard>
        <Card className="p-5">
          <SectionHeading eyebrow="Class comparison" title="Where each class stands." size="sm" />
          <ul className="mt-4 space-y-3">
            {CLASSES_WITH_SIZE.map((klass) => {
              const roster = studentsInClass(klass.id);
              const avg = subject === "math"
                ? Math.round(roster.reduce((a, s) => a + s.math, 0) / roster.length)
                : Math.round(roster.reduce((a, s) => a + s.english, 0) / roster.length);
              return (
                <li key={klass.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-[12.5px]">
                    <span className="text-ink-soft">{klass.name} · Grade {klass.grade}</span>
                    <span className={cn("tnum font-semibold", BAND_TEXT[bandTone(avg)])}>{avg}%</span>
                  </div>
                  <ProgressBar value={avg} tone={bandTone(avg)} size="xs" />
                </li>
              );
            })}
          </ul>
          <p className="mt-4 rounded-md border border-line bg-canvas p-3 text-[12px] leading-relaxed text-muted">
            <BarChart3 className="mr-1.5 inline size-3.5 text-brand" aria-hidden="true" />
            School leadership sees the same computation one level up, per year group.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Tabs2({ value, onChange }) {
  return (
    <Segmented
      ariaLabel="Subject"
      size="sm"
      options={[{ value: "math", label: "Math" }, { value: "english", label: "English" }]}
      value={value}
      onChange={onChange}
    />
  );
}
