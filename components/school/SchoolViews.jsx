"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Download, FileBarChart, Plus, Presentation, TrendingUp, UserPlus, Users } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { SCHOOL, SCHOOL_TERMS, YEAR_GROUP_PERFORMANCE, CLASSES_WITH_SIZE, studentsInClass, TEACHER_LIST } from "@/lib/data/people";
import Button from "@/components/ui/Button";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import { Card, SectionHeading } from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import { Field, Input, Select } from "@/components/ui/Field";
import { ChartCard, TermComparison, CohortBars } from "@/components/charts";

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

function AddTeacherModal({ open, onClose }) {
  const { toast } = useApp();
  const [values, setValues] = useState({ name: "", email: "", subject: "Mathematics" });
  const [error, setError] = useState("");

  return (
    <Modal open={open} onClose={onClose} title="Add a teacher" description="They receive an invite and can immediately create classes and assign diagnostics." size="sm">
      <div className="space-y-4">
        <Field label="Full name" required error={error} htmlFor="at-name">
          <Input id="at-name" value={values.name} error={error} onChange={(e) => { setValues((v) => ({ ...v, name: e.target.value })); setError(""); }} placeholder="e.g. Ms. Amara Adeyemi" />
        </Field>
        <Field label="School email" htmlFor="at-email">
          <Input id="at-email" type="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} placeholder="name@northgate.sch" />
        </Field>
        <Select label="Department" id="at-subject" value={values.subject} onChange={(value) => setValues((v) => ({ ...v, subject: value }))}
          options={["Mathematics", "English", "Languages", "Sciences"]} />
      </div>
      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={() => {
          if (values.name.trim().length < 2) return setError("Enter the teacher's name.");
          toast(`${values.name} invited to the ${values.subject} department.`, { tone: "success", title: "Invite sent" });
          onClose();
        }}>
          <Plus className="size-4" aria-hidden="true" /> Send invite
        </Button>
      </div>
    </Modal>
  );
}

function BulkStudentsModal({ open, onClose }) {
  const { toast } = useApp();
  const [count, setCount] = useState("120");
  const [year, setYear] = useState("Grade 9");

  return (
    <Modal open={open} onClose={onClose} title="Add students in bulk" description="Paste a roster or sync from your MIS. In this demo we simulate the import." size="sm">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Number of students" htmlFor="bs-count">
          <Input id="bs-count" type="number" value={count} onChange={(e) => setCount(e.target.value)} />
        </Field>
        <Select label="Year group" id="bs-year" value={year} onChange={setYear} options={SCHOOL.yearGroups} />
      </div>
      <p className="mt-4 rounded-md border border-line bg-canvas p-3 text-[12px] leading-relaxed text-muted">
        Accounts are created with a year-group baseline assignment. Guardians are only attached where the school
        enables read-only seats.
      </p>
      <div className="mt-6 flex justify-end gap-2.5">
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button size="md" onClick={() => { toast(`${count} ${year} accounts queued for import.`, { tone: "success", title: "Import started" }); onClose(); }}>
          <UserPlus className="size-4" aria-hidden="true" /> Start import
        </Button>
      </div>
    </Modal>
  );
}

/* ======================================================= 59 · dashboard == */

export function SchoolDashboard() {
  const { toast } = useApp();
  const [modal, setModal] = useState(null);
  const current = SCHOOL_TERMS[SCHOOL_TERMS.length - 1];
  const previous = SCHOOL_TERMS[SCHOOL_TERMS.length - 2];

  const classRows = CLASSES_WITH_SIZE.map((klass) => {
    const roster = studentsInClass(klass.id);
    const math = Math.round(roster.reduce((a, s) => a + s.math, 0) / roster.length);
    const english = Math.round(roster.reduce((a, s) => a + s.english, 0) / roster.length);
    return { ...klass, math, english, overall: Math.round((math + english) / 2) };
  }).sort((a, b) => b.overall - a.overall);

  const generateReport = () => {
    downloadCsv("prisma-school-report.csv", [
      ["Year group", "Students", "Mathematics", "English", "Improvement vs last term"],
      ...YEAR_GROUP_PERFORMANCE.map((g) => [g.group, g.students, g.math, g.english, g.improvement]),
    ]);
    toast("Organisation report downloaded.", { tone: "success", title: "Report generated" });
  };

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden p-6">
        <div className="field-accent pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow flex items-center gap-2"><Building2 className="size-3.5 text-accent" aria-hidden="true" /> {SCHOOL.name}</p>
            <h1 className="mt-2 font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">
              Turn student performance into actionable insight.
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
              {SCHOOL.students} students · {SCHOOL.teachers} teachers · {SCHOOL.classes} classes · on Prisma since{" "}
              {formatDate(SCHOOL.since, { year: undefined, month: "long" })} {new Date(SCHOOL.since).getFullYear()}.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button size="md" onClick={() => setModal("students")}><UserPlus className="size-4" aria-hidden="true" /> Add Students</Button>
            <Button size="md" variant="secondary" onClick={() => setModal("teacher")}><Presentation className="size-4" aria-hidden="true" /> Add Teacher</Button>
            <Button size="md" variant="ghost" onClick={generateReport}><Download className="size-4" aria-hidden="true" /> Generate Report</Button>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-5">
          {[
            { label: "Students", value: SCHOOL.students.toLocaleString() },
            { label: "Teachers", value: String(SCHOOL.teachers) },
            { label: "Classes", value: String(SCHOOL.classes) },
            { label: "Average Math", value: `${current.math}%`, tone: "text-brand" },
            { label: "Average English", value: `${current.english}%`, tone: "text-accent" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-3.5">
              <p className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{stat.label}</p>
              <p className={cn("tnum mt-1 font-display text-[26px] leading-none", stat.tone ?? "text-ink")}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-3">
          <Badge tone="strong" size="sm" dot>
            Improvement since {previous.term}: +{current.overall - previous.overall} pts overall
          </Badge>
          <Link href="/school/analytics" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline">
            Open school analytics →
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading eyebrow="Top performing classes" title="This term's league table." size="sm" />
          <ul className="mt-4 space-y-3">
            {classRows.slice(0, 4).map((klass, index) => (
              <li key={klass.id}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-[12.5px]">
                  <span className="text-ink-soft">
                    <span className="tnum mr-2 font-mono text-[10px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                    {klass.name} · Grade {klass.grade}
                  </span>
                  <span className="tnum text-muted">M {klass.math}% · E {klass.english}%</span>
                  <span className={cn("tnum font-semibold", BAND_TEXT[bandTone(klass.overall)])}>{klass.overall}%</span>
                </div>
                <ProgressBar value={klass.overall} tone={bandTone(klass.overall)} size="xs" />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <SectionHeading eyebrow="Areas requiring attention" title="Year groups below the school average." size="sm" />
          <ul className="mt-4 space-y-3">
            {[...YEAR_GROUP_PERFORMANCE].sort((a, b) => (a.math + a.english) - (b.math + b.english)).slice(0, 4).map((group) => {
              const overall = Math.round((group.math + group.english) / 2);
              return (
                <li key={group.group}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-[12.5px]">
                    <span className="text-ink-soft">{group.group} · {group.students} students</span>
                    <DeltaTag value={group.improvement} suffix="pts vs last term" />
                    <span className={cn("tnum font-semibold", BAND_TEXT[bandTone(overall)])}>{overall}%</span>
                  </div>
                  <ProgressBar value={overall} tone={bandTone(overall)} size="xs" />
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionHeading eyebrow="Diagnostic participation" title="Coverage across the school." size="sm" />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-line bg-canvas p-4 text-center">
              <p className="tnum font-display text-[30px] leading-none text-strong">94%</p>
              <p className="mt-1 text-[11.5px] text-muted">students with a baseline</p>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-4 text-center">
              <p className="tnum font-display text-[30px] leading-none text-brand">71%</p>
              <p className="mt-1 text-[11.5px] text-muted">with a second attempt</p>
            </div>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            Participation is the one metric leadership controls directly: without a baseline there is nothing to compare,
            and without a retake there is no evidence of improvement.
          </p>
        </Card>

        <Card className="p-5">
          <SectionHeading eyebrow="Staff" title="Departments on Prisma." size="sm" />
          <ul className="mt-4 divide-y divide-line">
            {TEACHER_LIST.slice(0, 5).map((teacher) => (
              <li key={teacher.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[10px] font-semibold text-ink-soft">{teacher.initials}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-ink">{teacher.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{teacher.subject}</p>
                  </div>
                </div>
                <Badge tone={teacher.status === "active" ? "strong" : "neutral"} size="xs">{teacher.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <AddTeacherModal open={modal === "teacher"} onClose={() => setModal(null)} />
      <BulkStudentsModal open={modal === "students"} onClose={() => setModal(null)} />
    </div>
  );
}

/* ======================================================= 60 · analytics == */

export function SchoolAnalytics() {
  const { toast } = useApp();
  const current = SCHOOL_TERMS[SCHOOL_TERMS.length - 1];
  const previous = SCHOOL_TERMS[SCHOOL_TERMS.length - 2];

  const exportCsv = () => {
    downloadCsv("prisma-school-analytics.csv", [
      ["Term", "Students", "Mathematics", "English", "Overall"],
      ...SCHOOL_TERMS.map((term) => [term.term, term.students, term.math, term.english, term.overall]),
    ]);
    toast("Term analytics exported.", { tone: "success", title: "Export complete" });
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">School analytics</p>
            <h1 className="mt-1.5 font-display text-[24px] leading-tight tracking-[-0.026em] text-ink">Four terms of evidence.</h1>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
              The same skill definitions every term, so the improvement rate is a measurement — not a mood.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={exportCsv}><Download className="size-3.5" aria-hidden="true" /> Export CSV</Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
          {[
            { label: "Overall now", value: `${current.overall}%` },
            { label: "vs last term", value: `+${current.overall - previous.overall}`, tone: "text-strong" },
            { label: "vs Spring 2025", value: `+${current.overall - SCHOOL_TERMS[0].overall}`, tone: "text-strong" },
            { label: "Students measured", value: current.students.toLocaleString() },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-3.5">
              <p className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{stat.label}</p>
              <p className={cn("tnum mt-1 font-display text-[24px] leading-none", stat.tone ?? "text-ink")}>{stat.value}</p>
            </div>
          ))}
        </div>
      </Card>

      <ChartCard title="Mathematics vs English by term" description="The gap between subjects is where staffing decisions live.">
        <TermComparison data={SCHOOL_TERMS} height={280} />
      </ChartCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Year-group averages" description="Current term, both subjects.">
          <CohortBars
            data={YEAR_GROUP_PERFORMANCE.map((g) => ({ label: g.group.replace("Grade ", "G"), math: g.math, english: g.english }))}
            keys={[{ key: "math", name: "Mathematics", color: "#2b4fe0" }, { key: "english", name: "English", color: "#7a5cd6" }]}
            height={260}
          />
        </ChartCard>

        <Card className="overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <SectionHeading eyebrow="Year groups" title="Improvement since last term." size="sm" />
          </div>
          <div className="scroll-slim overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-surface-2 text-[11px] uppercase tracking-[0.08em] text-muted">
                  <th className="px-5 py-2.5 font-semibold">Year group</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Students</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Math</th>
                  <th className="px-3 py-2.5 text-right font-semibold">English</th>
                  <th className="px-5 py-2.5 text-right font-semibold">Improvement</th>
                </tr>
              </thead>
              <tbody>
                {YEAR_GROUP_PERFORMANCE.map((group) => (
                  <tr key={group.group} className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface-2">
                    <td className="px-5 py-3 text-[13px] font-medium text-ink">{group.group}</td>
                    <td className="tnum px-3 py-3 text-right text-[12px] text-muted">{group.students}</td>
                    <td className={cn("tnum px-3 py-3 text-right text-[12.5px] font-semibold", BAND_TEXT[bandTone(group.math)])}>{group.math}%</td>
                    <td className={cn("tnum px-3 py-3 text-right text-[12.5px] font-semibold", BAND_TEXT[bandTone(group.english)])}>{group.english}%</td>
                    <td className="px-5 py-3 text-right"><DeltaTag value={group.improvement} className="justify-end" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <p className="flex max-w-xl items-start gap-2 text-[13px] leading-relaxed text-muted">
          <FileBarChart className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
          Board packs need one number and one chart. This page produces both from the same computation every teacher
          sees in their own classroom — which is why the arguments in staff meetings get shorter.
        </p>
        <div className="flex gap-2.5">
          <Button href="/school/dashboard" variant="secondary" size="md">Back to dashboard</Button>
          <Button href="/contact" size="md"><Users className="size-4" aria-hidden="true" /> Talk to us</Button>
        </div>
      </Card>
    </div>
  );
}
