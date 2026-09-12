"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, Ban, Building2, CalendarPlus, CheckCircle2, ClipboardCheck, FileCheck2,
  GraduationCap, Layers, ListChecks, Plus, Presentation, School, Search, Sigma, BookOpen,
  Sparkles, TrendingUp, UserCheck, Users, XCircle, Eye,
} from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import { STUDENTS, TEACHER_LIST, CLASSES_WITH_SIZE } from "@/lib/data/people";
import { TOPICS, DOMAINS, SUBJECT_TOPICS } from "@/lib/data/topics";
import { topicHref } from "@/lib/data/topicRoutes";
import { cn, average } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import Tabs from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { TopicBars } from "@/components/charts/PrismaCharts";
import {
  AdminHeader, StatTile, StatusPill, Toolbar, SearchInput, FilterSelect, DataTable, Pagination, usePagination,
} from "@/components/admin/AdminPrimitives";

/* ------------------------------------------------------------------ utils */

export const selectOptions = (list, all = "All") => [{ value: "all", label: all }, ...list];

function useFlaggedStatus() {
  const { userFlags } = useApp();
  return (record, fallback = "active") => userFlags[record.id] ?? record.status ?? fallback;
}

/* ================================================================ 1 · home */

export function AdminDashboard() {
  const { applications, derived, classesLocal, tests, submissions, diagnostics, notify } = useApp();
  const flagged = useFlaggedStatus();
  const students = derived.allStudents ?? STUDENTS;

  const pending = applications.filter((item) => item.status === "pending");
  const suspendedStudents = students.filter((s) => flagged(s) === "suspended").length;
  const avgOverall = Math.round(average(students.map((s) => s.overall ?? 0)));
  const avgMath = Math.round(average(students.map((s) => s.math ?? 0)));
  const avgEnglish = Math.round(average(students.map((s) => s.english ?? 0)));
  const testsCompleted = diagnostics.length + submissions.length;
  const totalUsers = students.length + TEACHER_LIST.length + pending.length + 1;

  const activity = [
    ...applications
      .filter((item) => item.decidedAt)
      .map((item) => ({
        id: item.id,
        date: item.decidedAt,
        icon: item.status === "approved" ? UserCheck : XCircle,
        tone: item.status === "approved" ? "strong" : "risk",
        text: `Teacher application ${item.status}: ${item.firstName} ${item.lastName} (${item.subject})`,
      })),
    ...applications
      .filter((item) => item.status === "pending")
      .map((item) => ({
        id: `${item.id}-sub`,
        date: item.submittedAt,
        icon: ClipboardCheck,
        tone: "developing",
        text: `New teacher application: ${item.firstName} ${item.lastName} (${item.subject})`,
      })),
    ...submissions.map((sub) => ({
      id: sub.id,
      date: sub.submittedAt,
      icon: FileCheck2,
      tone: "brand",
      text: `${sub.studentName ?? "A student"} submitted “${sub.assignmentTitle}” — ${sub.score}%`,
    })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 7);

  return (
    <div>
      <AdminHeader
        title="Platform overview"
        description="Everything happening across Prisma today: people, applications, assessment and content."
        actions={
          <>
            <Button size="sm" variant="outline" href="/admin/teacher-applications">
              <ClipboardCheck className="size-3.5" aria-hidden="true" /> Review applications
              {pending.length ? <span className="ml-1 rounded-full bg-developing px-1.5 text-[10px] font-bold text-white">{pending.length}</span> : null}
            </Button>
            <Button size="sm" href="/admin/questions"><Plus className="size-3.5" aria-hidden="true" /> New question</Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatTile label="Total users" value={totalUsers} sub={`${students.length} students · ${TEACHER_LIST.length} teachers · 1 admin${suspendedStudents ? ` · ${suspendedStudents} suspended` : ""}`} icon={Users} tone="brand" />
        <StatTile label="Pending applications" value={pending.length} sub={pending.length ? pending.map((p) => p.lastName).join(", ") + " awaiting review" : "Review queue is clear"} icon={ClipboardCheck} tone={pending.length ? "developing" : "strong"} />
        <StatTile label="Active classes" value={classesLocal.length} sub={`${classesLocal.reduce((sum, c) => sum + (c.size ?? 0), 0)} seats across ${new Set(classesLocal.map((c) => c.grade)).size} grades`} icon={School} tone="accent" />
        <StatTile label="Tests completed" value={testsCompleted} sub={`${diagnostics.length} diagnostics · ${submissions.length} assignment submissions`} icon={ListChecks} tone="brand" />
        <StatTile label="Average score" value={`${avgOverall}%`} sub="Across every student record" icon={TrendingUp} tone={avgOverall >= 70 ? "strong" : avgOverall >= 55 ? "developing" : "risk"} />
        <StatTile label="Mathematics" value={`${avgMath}%`} sub="Cohort average · algebra is the hardest domain" icon={Sigma} tone="brand" />
        <StatTile label="English" value={`${avgEnglish}%`} sub="Cohort average · inference questions lead errors" icon={BookOpen} tone="accent" />
        <StatTile label="Published tests" value={tests.filter((t) => t.status === "published").length} sub={`${tests.filter((t) => t.status === "draft").length} in draft`} icon={FileCheck2} tone="neutral" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="adm-activity">
          <div className="flex items-center justify-between gap-3">
            <h2 id="adm-activity" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <Activity className="size-4 text-brand" aria-hidden="true" /> Recent platform activity
            </h2>
            <Link href="/admin/reports" className="text-[11.5px] font-medium text-brand hover:underline">Open reports →</Link>
          </div>
          <ul className="mt-3 space-y-0 divide-y divide-line">
            {activity.length === 0 ? (
              <li className="py-6 text-center text-[12.5px] text-muted">No activity recorded yet in this browser session.</li>
            ) : null}
            {activity.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5 py-2.5">
                <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border",
                  item.tone === "strong" ? "border-strong/25 bg-strong-soft text-strong" :
                  item.tone === "risk" ? "border-risk/25 bg-risk-soft text-risk" :
                  item.tone === "developing" ? "border-developing/25 bg-developing-soft text-developing" :
                  "border-brand-line bg-brand-soft text-brand")}>
                  <item.icon className="size-3.5" aria-hidden="true" />
                </span>
                <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink-soft">{item.text}</p>
                <time className="tnum shrink-0 font-mono text-[10.5px] text-faint">{item.date}</time>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-4">
          <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="adm-quick">
            <h2 id="adm-quick" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <Sparkles className="size-4 text-accent" aria-hidden="true" /> Quick actions
            </h2>
            <div className="mt-3 grid gap-1.5">
              {[
                { href: "/admin/teacher-applications", label: "Review teacher applications", icon: ClipboardCheck, count: pending.length },
                { href: "/admin/tests", label: "Create or publish a test", icon: FileCheck2 },
                { href: "/admin/homepage", label: "Edit the homepage hero", icon: Layers },
                { href: "/admin/announcements", label: "Send an announcement", icon: Building2 },
              ].map((action) => (
                <Link key={action.href} href={action.href}
                  className="flex items-center gap-2.5 rounded-md border border-line bg-canvas px-3 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <action.icon className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{action.label}</span>
                  {action.count ? <Badge tone="developing" size="xs">{action.count}</Badge> : null}
                  <ArrowRight className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="adm-need">
            <h2 id="adm-need" className="text-[13px] font-semibold text-ink">Students needing support</h2>
            <p className="mt-0.5 text-[11.5px] text-muted">Lowest overall scores across the cohort.</p>
            <ul className="mt-2.5 space-y-1.5">
              {[...students].sort((a, b) => (a.overall ?? 0) - (b.overall ?? 0)).slice(0, 4).map((student) => (
                <li key={student.id} className="flex items-center gap-2.5">
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{student.name}</span>
                  <span className="shrink-0 text-[11px] text-muted">{student.className}</span>
                  <Badge tone={(student.overall ?? 0) >= 60 ? "developing" : "risk"} size="xs">{student.overall ?? 0}%</Badge>
                </li>
              ))}
            </ul>
            <Link href="/admin/students" className="mt-2.5 inline-block text-[11.5px] font-medium text-brand hover:underline">
              Open student directory →
            </Link>
          </section>
        </div>
      </div>

      <section className="mt-4 rounded-lg border border-line bg-surface p-4" aria-labelledby="adm-cohort">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="adm-cohort" className="text-[13px] font-semibold text-ink">Cohort performance by topic</h2>
          <Link href="/admin/analytics" className="text-[11.5px] font-medium text-brand hover:underline">Full analytics →</Link>
        </div>
        <TopicBars
          className="mt-3"
          height={220}
          data={TOPICS.slice(0, 12).map((topic) => ({
            name: topic.name,
            score: Math.round(average(students.map((s) => s.topicScores?.[topic.id]).filter((v) => typeof v === "number")) || (topic.subject === "math" ? avgMath : avgEnglish)),
          }))}
        />
      </section>
    </div>
  );
}

/* =============================================================== 2 · users */

function buildUserRows(allStudents) {
  return [
    ...allStudents.map((s) => ({ id: s.id, name: s.name, email: `${s.id}@students.prisma.demo`, role: "student", meta: s.className, joined: s.lastDiagnostic ?? "2026-09-01", baseStatus: "active" })),
    ...TEACHER_LIST.map((t) => ({ id: t.id, name: t.name, email: t.email, role: "teacher", meta: t.subject, joined: `${t.since}`, baseStatus: t.status === "on-leave" ? "on-leave" : "active" })),
    { id: "adm_001", name: "Demo Admin", email: "admin@prisma.education", role: "admin", meta: "Platform administrator", joined: "2025", baseStatus: "active" },
  ];
}

export function AdminUsers() {
  const { derived, userFlags, setUserFlag } = useApp();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [confirm, setConfirm] = useState(null); // { row, next }

  const rows = useMemo(() => {
    const flagged = (row) => userFlags[row.id] ?? row.baseStatus;
    return buildUserRows(derived.allStudents ?? STUDENTS)
      .filter((row) => (role === "all" ? true : row.role === role))
      .filter((row) => (status === "all" ? true : flagged(row) === status))
      .filter((row) => {
        const q = query.trim().toLowerCase();
        return !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q) || row.meta.toLowerCase().includes(q);
      })
      .map((row) => ({ ...row, status: flagged(row) }));
  }, [derived.allStudents, userFlags, query, role, status]);

  const { slice, paginationProps } = usePagination(rows, 14);

  const askToggle = (row) => setConfirm({ row, next: row.status === "suspended" ? "active" : "suspended" });

  return (
    <div>
      <AdminHeader
        title="All users"
        description="Every account on the platform — students, teachers and administrators. Search, filter and moderate access."
        actions={<Button size="sm" variant="outline" href="/admin/students"><GraduationCap className="size-3.5" aria-hidden="true" /> Student directory</Button>}
      />

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search name, email or class…" id="users-search" />
        <FilterSelect id="users-role" label="Filter by role" value={role} onChange={setRole}
          options={[{ value: "all", label: "All roles" }, { value: "student", label: "Students" }, { value: "teacher", label: "Teachers" }, { value: "admin", label: "Admins" }]} />
        <FilterSelect id="users-status" label="Filter by status" value={status} onChange={setStatus}
          options={[{ value: "all", label: "Any status" }, { value: "active", label: "Active" }, { value: "suspended", label: "Suspended" }, { value: "on-leave", label: "On leave" }]} />
      </Toolbar>

      <DataTable
        columns={[
          { key: "name", label: "User", render: (row) => (
            <span className="flex items-center gap-2">
              <span className="grid size-6.5 shrink-0 place-items-center rounded-full bg-surface-3 font-mono text-[9.5px] font-bold text-ink-soft" aria-hidden="true">
                {row.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-semibold text-ink">{row.name}</span>
                <span className="block truncate text-[11px] text-muted">{row.email}</span>
              </span>
            </span>
          ) },
          { key: "role", label: "Role", render: (row) => <Badge tone={row.role === "admin" ? "neutral" : row.role === "teacher" ? "accent" : "brand"} size="xs">{row.role}</Badge> },
          { key: "meta", label: "Details", render: (row) => <span className="text-muted">{row.meta}</span> },
          { key: "joined", label: "Joined", mono: true, hideMobile: true },
          { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
          { key: "actions", label: "Actions", align: "right", render: (row) => (
            row.role === "admin" ? <span className="text-[11px] text-faint">Protected</span> : (
              <div className="flex items-center justify-end gap-1.5">
                <Button size="xs" variant="ghost" href={row.role === "teacher" ? "/admin/teachers" : "/admin/students"} aria-label={`View ${row.name}`}>
                  <Eye className="size-3.5" aria-hidden="true" />
                </Button>
                <Button size="xs" variant={row.status === "suspended" ? "outline" : "ghost"} onClick={() => askToggle(row)}
                  className={row.status === "suspended" ? "text-strong" : "text-risk hover:bg-risk-soft"}>
                  {row.status === "suspended" ? <><CheckCircle2 className="size-3.5" aria-hidden="true" /> Activate</> : <><Ban className="size-3.5" aria-hidden="true" /> Suspend</>}
                </Button>
              </div>
            )
          ) },
        ]}
        rows={slice}
        keyFor={(row) => row.id}
        empty={<EmptyState icon={Search} title="No users match those filters" description="Try clearing the search box or choosing a different role." action={<Button size="sm" variant="outline" onClick={() => { setQuery(""); setRole("all"); setStatus("all"); }}>Clear all filters</Button>} />}
      />
      <div className="mt-3"><Pagination {...paginationProps} /></div>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={() => { setUserFlag(confirm.row.id, confirm.next); setConfirm(null); }}
        title={confirm?.next === "suspended" ? `Suspend ${confirm?.row.name}?` : `Reactivate ${confirm?.row.name}?`}
        description={confirm?.next === "suspended"
          ? "Suspended accounts are blocked from their workspace immediately. You can reactivate at any time."
          : "The account regains full access to its workspace immediately."}
        confirmLabel={confirm?.next === "suspended" ? "Suspend user" : "Reactivate user"}
        tone={confirm?.next === "suspended" ? "danger" : "primary"}
      />
    </div>
  );
}

/* ============================================================= 3 · students */

export function AdminStudents() {
  const { derived, userFlags, setUserFlag, classesLocal } = useApp();
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [record, setRecord] = useState(null);

  const students = derived.allStudents ?? STUDENTS;
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students
      .filter((s) => (classFilter === "all" ? true : s.classId === classFilter || s.className === classFilter))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || (s.className ?? "").toLowerCase().includes(q))
      .map((s) => ({ ...s, status: userFlags[s.id] ?? "active" }));
  }, [students, query, classFilter, userFlags]);

  const { slice, paginationProps } = usePagination(rows, 14);

  return (
    <div>
      <AdminHeader
        title="Students"
        description="The full student directory: scores, trends, class membership and access status."
        actions={<Button size="sm" variant="outline" href="/admin/test-results"><ListChecks className="size-3.5" aria-hidden="true" /> Test results</Button>}
      />

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search students…" id="students-search" />
        <FilterSelect id="students-class" label="Filter by class" value={classFilter} onChange={setClassFilter}
          options={[{ value: "all", label: "All classes" }, ...classesLocal.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade}` }))]} />
      </Toolbar>

      <DataTable
        columns={[
          { key: "name", label: "Student", render: (s) => (
            <button type="button" onClick={() => setRecord(s)} className="text-left text-[12.5px] font-semibold text-ink hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
              {s.name}
            </button>
          ) },
          { key: "className", label: "Class", render: (s) => <span className="font-mono text-[11.5px] text-muted">{s.className ?? "—"}</span> },
          { key: "math", label: "Math", align: "right", mono: true, render: (s) => <span className={cn("font-semibold", (s.math ?? 0) >= 80 ? "text-strong" : (s.math ?? 0) >= 60 ? "text-developing" : "text-risk")}>{s.math ?? "—"}%</span> },
          { key: "english", label: "English", align: "right", mono: true, render: (s) => <span className={cn("font-semibold", (s.english ?? 0) >= 80 ? "text-strong" : (s.english ?? 0) >= 60 ? "text-developing" : "text-risk")}>{s.english ?? "—"}%</span> },
          { key: "overall", label: "Overall", align: "right", mono: true, render: (s) => <span className="font-bold text-ink">{s.overall ?? "—"}%</span> },
          { key: "trend", label: "Trend", align: "right", hideMobile: true, render: (s) => (
            <span className={cn("tnum font-mono text-[11.5px]", (s.trend ?? 0) > 0 ? "text-strong" : (s.trend ?? 0) < 0 ? "text-risk" : "text-muted")}>
              {(s.trend ?? 0) > 0 ? "+" : ""}{s.trend ?? 0} pts
            </span>
          ) },
          { key: "lastDiagnostic", label: "Last diagnostic", mono: true, hideMobile: true, render: (s) => <span className="text-muted">{s.lastDiagnostic ?? "—"}</span> },
          { key: "status", label: "Status", render: (s) => <StatusPill status={s.status} /> },
          { key: "actions", label: "", align: "right", render: (s) => (
            <Button size="xs" variant="ghost" onClick={() => setUserFlag(s.id, s.status === "suspended" ? "active" : "suspended")}
              className={s.status === "suspended" ? "text-strong hover:bg-strong-soft" : "text-risk hover:bg-risk-soft"}>
              {s.status === "suspended" ? "Activate" : "Suspend"}
            </Button>
          ) },
        ]}
        rows={slice}
        keyFor={(s) => s.id}
        empty={<EmptyState icon={GraduationCap} title="No students match" description="Adjust the search or class filter." action={<Button size="sm" variant="outline" onClick={() => { setQuery(""); setClassFilter("all"); }}>Clear filters</Button>} />}
      />
      <div className="mt-3"><Pagination {...paginationProps} /></div>

      <Modal open={Boolean(record)} onClose={() => setRecord(null)} title={record?.name ?? ""} description={record ? `${record.className ?? "No class"} · last diagnostic ${record.lastDiagnostic ?? "—"}` : ""} size="md" icon={GraduationCap}>
        {record ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <StatTile label="Math" value={`${record.math ?? 0}%`} tone="brand" />
              <StatTile label="English" value={`${record.english ?? 0}%`} tone="accent" />
              <StatTile label="Overall" value={`${record.overall ?? 0}%`} tone={(record.overall ?? 0) >= 70 ? "strong" : "developing"} />
            </div>
            <div>
              <p className="eyebrow mb-2">Topic scores on record</p>
              {Object.keys(record.topicScores ?? {}).length ? (
                <TopicBars height={200} data={Object.entries(record.topicScores).slice(0, 10).map(([id, score]) => ({ name: TOPICS.find((t) => t.id === id)?.name ?? id, score }))} />
              ) : (
                <p className="rounded-md border border-dashed border-line px-3 py-4 text-center text-[12px] text-muted">
                  No diagnostic on file — scores appear after the student's first test.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" href="/admin/test-results">View test results</Button>
              <Button size="sm" variant="ghost" onClick={() => { setUserFlag(record.id, (userFlags[record.id] ?? "active") === "suspended" ? "active" : "suspended"); setRecord(null); }}>
                {(userFlags[record.id] ?? "active") === "suspended" ? "Reactivate account" : "Suspend account"}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

/* ============================================================= 4 · teachers */

export function AdminTeachers() {
  const { applications, userFlags, setUserFlag, classesLocal } = useApp();
  const [query, setQuery] = useState("");

  const approvedApps = applications.filter((a) => a.status === "approved");
  const rows = useMemo(() => {
    const base = [
      ...TEACHER_LIST.map((t) => ({
        id: t.id, name: t.name, email: t.email, subject: t.subject, since: t.since,
        classes: t.classes.map((cid) => classesLocal.find((c) => c.id === cid)?.name ?? cid).join(", ") || "—",
        status: t.status === "on-leave" ? "on-leave" : "active",
      })),
      ...approvedApps.map((a) => ({
        id: a.id, name: `${a.firstName} ${a.lastName}`, email: a.email, subject: a.subject,
        since: a.decidedAt?.slice(0, 4) ?? "2026", classes: "Not assigned yet", status: "active",
      })),
    ];
    const q = query.trim().toLowerCase();
    return base
      .map((t) => ({ ...t, status: userFlags[t.id] ?? t.status }))
      .filter((t) => !q || t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.email.toLowerCase().includes(q));
  }, [applications, userFlags, classesLocal, query]);

  return (
    <div>
      <AdminHeader
        title="Teachers"
        description="Active teaching staff, their subjects and class assignments. New teachers appear here once their application is approved."
        actions={
          <Button size="sm" variant="outline" href="/admin/teacher-applications">
            <ClipboardCheck className="size-3.5" aria-hidden="true" /> Applications
            {applications.filter((a) => a.status === "pending").length ? (
              <span className="ml-1 rounded-full bg-developing px-1.5 text-[10px] font-bold text-white">{applications.filter((a) => a.status === "pending").length}</span>
            ) : null}
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search teachers…" id="teachers-search" />
      </Toolbar>

      <DataTable
        columns={[
          { key: "name", label: "Teacher", render: (t) => <span className="text-[12.5px] font-semibold text-ink">{t.name}</span> },
          { key: "email", label: "Email", mono: true, hideMobile: true, render: (t) => <span className="text-muted">{t.email}</span> },
          { key: "subject", label: "Subject", render: (t) => <Badge tone={t.subject.startsWith("Math") ? "brand" : t.subject.startsWith("English") ? "accent" : "neutral"} size="xs">{t.subject.split(" · ")[0]}</Badge> },
          { key: "classes", label: "Classes", render: (t) => <span className="font-mono text-[11.5px] text-muted">{t.classes}</span> },
          { key: "since", label: "Since", mono: true, hideMobile: true },
          { key: "status", label: "Status", render: (t) => <StatusPill status={t.status} /> },
          { key: "actions", label: "", align: "right", render: (t) => (
            <Button size="xs" variant="ghost" onClick={() => setUserFlag(t.id, t.status === "suspended" ? "active" : "suspended")}
              className={t.status === "suspended" ? "text-strong hover:bg-strong-soft" : "text-risk hover:bg-risk-soft"}>
              {t.status === "suspended" ? "Activate" : "Suspend"}
            </Button>
          ) },
        ]}
        rows={rows}
        keyFor={(t) => t.id}
        empty={<EmptyState icon={Presentation} title="No teachers match" description="Clear the search to see all teaching staff." action={<Button size="sm" variant="outline" onClick={() => setQuery("")}>Clear search</Button>} />}
      />
    </div>
  );
}

/* ========================================================= 5 · applications */

const APP_TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

export function AdminApplications() {
  const { applications, decideApplication } = useApp();
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [approving, setApproving] = useState(null);

  const rows = applications
    .filter((a) => (tab === "all" ? true : a.status === tab))
    .filter((a) => {
      const q = query.trim().toLowerCase();
      return !q || `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q) || a.institution.toLowerCase().includes(q);
    });

  return (
    <div>
      <AdminHeader
        title="Teacher applications"
        description="Every teacher workspace request. Applications stay pending — and the applicant stays on /pending-approval — until you decide."
      />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <Tabs tabs={APP_TABS.map((t) => ({
          ...t,
          label: t.id === "pending" ? `Pending (${applications.filter((a) => a.status === "pending").length})` : t.label,
        }))} value={tab} onChange={setTab} size="sm" ariaLabel="Application status" />
        <SearchInput value={query} onChange={setQuery} placeholder="Search applications…" id="apps-search" className="sm:max-w-[240px]" />
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Applicant", render: (a) => (
            <Link href={`/admin/teacher-applications/${a.id}`} className="text-[12.5px] font-semibold text-ink hover:text-brand hover:underline">
              {a.firstName} {a.lastName}
            </Link>
          ) },
          { key: "email", label: "Email", mono: true, hideMobile: true, render: (a) => <span className="text-muted">{a.email}</span> },
          { key: "subject", label: "Subject", render: (a) => <Badge tone={a.subject === "Mathematics" ? "brand" : a.subject === "English" ? "accent" : "neutral"} size="xs">{a.subject}</Badge> },
          { key: "experience", label: "Experience", hideMobile: true },
          { key: "institution", label: "Institution", render: (a) => <span className="text-muted">{a.institution}</span> },
          { key: "submittedAt", label: "Submitted", mono: true, hideMobile: true },
          { key: "status", label: "Status", render: (a) => <StatusPill status={a.status} /> },
          { key: "actions", label: "Actions", align: "right", render: (a) => (
            a.status === "pending" ? (
              <span className="flex items-center justify-end gap-1.5">
                <Button size="xs" onClick={() => setApproving(a)} className="bg-strong border-strong hover:brightness-95">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" /> Approve
                </Button>
                <Button size="xs" variant="ghost" onClick={() => { setRejecting(a); setReason(""); }} className="text-risk hover:bg-risk-soft">
                  <XCircle className="size-3.5" aria-hidden="true" /> Reject
                </Button>
              </span>
            ) : (
              <Button size="xs" variant="ghost" href={`/admin/teacher-applications/${a.id}`}>View details</Button>
            )
          ) },
        ]}
        rows={rows}
        keyFor={(a) => a.id}
        empty={<EmptyState icon={ClipboardCheck} title={tab === "pending" ? "The review queue is empty" : "No applications here"} description={tab === "pending" ? "Every teacher application has been processed. New submissions land here automatically." : "Switch tabs to see other applications."} />}
      />

      <ConfirmDialog
        open={Boolean(approving)}
        onClose={() => setApproving(null)}
        onConfirm={() => { decideApplication(approving.id, "approved"); setApproving(null); }}
        title={`Approve ${approving?.firstName ?? ""} ${approving?.lastName ?? ""}?`}
        description="The applicant immediately gains access to the teacher workspace: classes, assignments and analytics."
        confirmLabel="Approve teacher"
        tone="primary"
      />

      <Modal open={Boolean(rejecting)} onClose={() => setRejecting(null)} title={`Reject ${rejecting?.firstName ?? ""} ${rejecting?.lastName ?? ""}?`}
        description="The applicant sees your reason on their pending-approval page. This can be reversed from the All tab." size="sm" icon={XCircle}>
        <div className="space-y-4">
          <Field label="Reason (shown to the applicant)" required htmlFor="reject-reason" hint="Be specific — it helps the applicant reapply successfully.">
            <Textarea id="reject-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. We could not verify the institution. Please reapply with a school email address." />
          </Field>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setRejecting(null)}>Cancel</Button>
            <Button size="sm" variant="danger" disabled={reason.trim().length < 5}
              onClick={() => { decideApplication(rejecting.id, "rejected", reason.trim()); setRejecting(null); }}>
              Reject application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function AdminApplicationDetail({ id }) {
  const { applications, decideApplication } = useApp();
  const application = applications.find((a) => a.id === id);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [approveOpen, setApproveOpen] = useState(false);

  if (!application) {
    return (
      <EmptyState icon={Search} title="Application not found"
        description="It may have been removed from this browser's demo data."
        action={<Button size="sm" href="/admin/teacher-applications">Back to applications</Button>} />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader
        eyebrow={`Application ${application.id}`}
        title={`${application.firstName} ${application.lastName}`}
        description={`Submitted ${application.submittedAt}${application.decidedAt ? ` · decided ${application.decidedAt}` : ""}`}
        actions={<Button size="sm" variant="ghost" href="/admin/teacher-applications">← All applications</Button>}
      />

      <div className="rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-accent-soft font-display text-[15px] font-semibold text-accent" aria-hidden="true">
              {application.firstName[0]}{application.lastName[0]}
            </span>
            <span>
              <span className="block text-[14px] font-semibold text-ink">{application.firstName} {application.lastName}</span>
              <span className="block font-mono text-[11.5px] text-muted">{application.email}</span>
            </span>
          </span>
          <StatusPill status={application.status} />
        </div>

        <dl className="mt-5 grid gap-x-8 gap-y-0 sm:grid-cols-2">
          {[
            ["Subject", application.subject],
            ["Experience", application.experience],
            ["Institution", application.institution],
            ["Submitted", application.submittedAt],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-line py-2.5">
              <dt className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-faint">{label}</dt>
              <dd className="mt-0.5 text-[13px] font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-faint">About their teaching</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{application.bio}</p>
        </div>

        {application.status === "rejected" && application.rejectionReason ? (
          <div className="mt-4 rounded-md border border-risk/25 bg-risk-soft/60 p-3.5">
            <p className="eyebrow text-risk">Rejection reason</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink">{application.rejectionReason}</p>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
          {application.status === "pending" ? (
            <>
              <Button size="md" onClick={() => setApproveOpen(true)} className="bg-strong border-strong hover:brightness-95">
                <CheckCircle2 className="size-4" aria-hidden="true" /> Approve application
              </Button>
              <Button size="md" variant="ghost" className="text-risk hover:bg-risk-soft" onClick={() => { setRejectOpen(true); setReason(""); }}>
                <XCircle className="size-4" aria-hidden="true" /> Reject with reason
              </Button>
            </>
          ) : (
            <Button size="md" variant="outline" href="/admin/teacher-applications">Back to review queue</Button>
          )}
          <Button size="md" variant="ghost" href={`mailto:${application.email}`}>
            Email applicant
          </Button>
        </div>
      </div>

      <ConfirmDialog open={approveOpen} onClose={() => setApproveOpen(false)}
        onConfirm={() => { decideApplication(application.id, "approved"); setApproveOpen(false); }}
        title={`Approve ${application.firstName} ${application.lastName}?`}
        description="Their /pending-approval page flips to approved and the teacher workspace unlocks immediately."
        confirmLabel="Approve teacher" />

      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject application" description="The reason below is shown to the applicant." size="sm" icon={XCircle}>
        <div className="space-y-4">
          <Field label="Reason" required htmlFor="detail-reject-reason">
            <Textarea id="detail-reject-reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the decision so the applicant can reapply successfully." />
          </Field>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button size="sm" variant="danger" disabled={reason.trim().length < 5}
              onClick={() => { decideApplication(application.id, "rejected", reason.trim()); setRejectOpen(false); }}>
              Reject application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* =============================================================== 6 · classes */

export function AdminClasses() {
  const { classesLocal, classCreate, derived } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [roster, setRoster] = useState(null);
  const [form, setForm] = useState({ name: "", grade: "9", subject: "Mathematics", description: "" });
  const [errors, setErrors] = useState({});

  const students = derived.allStudents ?? STUDENTS;
  const rosterOf = (klass) => students.filter((s) => s.classId === klass.id || s.className === klass.name);

  const submit = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Give the class a name, e.g. 10-C.";
    setErrors(next);
    if (Object.keys(next).length) return;
    classCreate({ name: form.name.trim(), grade: Number(form.grade), subject: form.subject, description: form.description.trim(), teacherId: null, room: "—" });
    setCreateOpen(false);
    setForm({ name: "", grade: "9", subject: "Mathematics", description: "" });
  };

  return (
    <div>
      <AdminHeader
        title="Classes"
        description="Every class on the platform with its grade, size and assigned teacher."
        actions={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="size-3.5" aria-hidden="true" /> Create class</Button>}
      />

      <DataTable
        columns={[
          { key: "name", label: "Class", render: (c) => <span className="font-mono text-[12.5px] font-bold text-ink">{c.name}</span> },
          { key: "grade", label: "Grade", mono: true },
          { key: "subject", label: "Subject", hideMobile: true, render: (c) => <Badge tone={c.subject === "Mathematics" ? "brand" : c.subject === "English" ? "accent" : "neutral"} size="xs">{c.subject ?? "Mixed"}</Badge> },
          { key: "teacherId", label: "Teacher", render: (c) => <span className="text-muted">{TEACHER_LIST.find((t) => t.id === c.teacherId)?.name ?? "Unassigned"}</span> },
          { key: "size", label: "Students", align: "right", mono: true, render: (c) => <span className="font-semibold text-ink">{rosterOf(c).length || c.size || 0}</span> },
          { key: "room", label: "Room", mono: true, hideMobile: true, render: (c) => <span className="text-muted">{c.room ?? "—"}</span> },
          { key: "term", label: "Term", hideMobile: true, render: (c) => <span className="text-muted">{c.term}</span> },
          { key: "actions", label: "", align: "right", render: (c) => (
            <Button size="xs" variant="ghost" onClick={() => setRoster(c)}>View roster</Button>
          ) },
        ]}
        rows={classesLocal}
        keyFor={(c) => c.id}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a class" description="Classes organise students for assignments and analytics." size="sm" icon={CalendarPlus}>
        <div className="space-y-4">
          <Field label="Class name" required error={errors.name} htmlFor="cls-name">
            <Input id="cls-name" value={form.name} error={errors.name} placeholder="10-C" onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Grade" htmlFor="cls-grade">
              <Select id="cls-grade" value={form.grade} onChange={(value) => setForm((f) => ({ ...f, grade: value }))}
                options={[7, 8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Grade ${g}` }))} />
            </Field>
            <Field label="Primary subject" htmlFor="cls-subject">
              <Select id="cls-subject" value={form.subject} onChange={(value) => setForm((f) => ({ ...f, subject: value }))}
                options={[{ value: "Mathematics", label: "Mathematics" }, { value: "English", label: "English" }, { value: "Mixed", label: "Mixed" }]} />
            </Field>
          </div>
          <Field label="Description" optional htmlFor="cls-desc">
            <Textarea id="cls-desc" rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Focus of the class this term…" />
          </Field>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={submit}>Create class</Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(roster)} onClose={() => setRoster(null)} title={roster ? `Roster · ${roster.name}` : ""} description={roster ? `${roster.grade ? `Grade ${roster.grade} · ` : ""}${roster.term}` : ""} size="md" icon={Users}>
        {roster ? (
          rosterOf(roster).length ? (
            <ul className="divide-y divide-line">
              {rosterOf(roster).map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="text-[12.5px] font-medium text-ink">{s.name}</span>
                  <span className="flex items-center gap-2">
                    <Badge tone="brand" size="xs">Math {s.math ?? 0}%</Badge>
                    <Badge tone="accent" size="xs">Eng {s.english ?? 0}%</Badge>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-dashed border-line px-3 py-6 text-center text-[12.5px] text-muted">
              No students assigned yet. Teachers add students from their own workspace.
            </p>
          )
        ) : null}
      </Modal>
    </div>
  );
}

/* ============================================================== 7 · subjects */

export function AdminSubjects() {
  const [subject, setSubject] = useState("math");
  const topics = SUBJECT_TOPICS[subject] ?? [];

  return (
    <div>
      <AdminHeader
        title="Subjects & topics"
        description="The skill taxonomy every diagnostic, question and learning path is built on. Manage each topic's learning content from here."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Tabs tabs={[{ id: "math", label: "Mathematics" }, { id: "english", label: "English" }]} value={subject} onChange={setSubject} size="sm" ariaLabel="Subject" />
        <p className="text-[11.5px] text-muted">{topics.length} topics · {Object.values(DOMAINS).filter((d) => d.subject === subject).length} domains</p>
      </div>

      {Object.values(DOMAINS).filter((d) => d.subject === subject).map((domain) => {
        const domainTopics = topics.filter((t) => t.domain === domain.id);
        if (!domainTopics.length) return null;
        return (
          <section key={domain.id} className="mb-4 overflow-hidden rounded-lg border border-line bg-surface" aria-labelledby={`dom-${domain.id}`}>
            <header className="flex items-center justify-between gap-2 border-b border-line bg-surface-2/70 px-4 py-2.5">
              <h2 id={`dom-${domain.id}`} className="text-[12.5px] font-semibold text-ink">{domain.name}</h2>
              <span className="text-[11px] text-muted">{domainTopics.length} topics</span>
            </header>
            <ul className="divide-y divide-line">
              {domainTopics.map((topic) => (
                <li key={topic.id} className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 py-2.5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold text-ink">{topic.name}</span>
                    <span className="block truncate text-[11.5px] text-muted">{topic.summary}</span>
                  </span>
                  <span className="hidden shrink-0 items-center gap-1.5 text-[11px] text-muted sm:flex">
                    <Badge tone="neutral" size="xs">{topic.level}</Badge>
                    <span className="tnum font-mono">weight {topic.weight}</span>
                    <span className="tnum font-mono">{topic.units.length} units</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    <Button size="xs" variant="ghost" href={`/admin/learning-content?subject=${subject}&topic=${topic.id}`}>
                      Manage content
                    </Button>
                    <Button size="xs" variant="outline" href={topicHref(topic.id)}>
                      <Eye className="size-3.5" aria-hidden="true" /> Student view
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
