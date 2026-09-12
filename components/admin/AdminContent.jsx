"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell, BookMarked, ChevronDown, ChevronUp, Download, Eye, FileCheck2, FlaskConical,
  HelpCircle, Layers, Megaphone, Pencil, Plus, Save, Send, Settings2, Sigma, BookOpen,
  Trash2, TriangleAlert, BadgeDollarSign, PanelTop, RotateCcw, ListChecks, Search, Sparkles, TrendingUp,
} from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import { SUBJECT_TOPICS, TOPIC_BY_ID } from "@/lib/data/topics";
import { DIFFICULTIES } from "@/lib/data/questions";
import { QUESTION_TYPES } from "@/lib/data/platform";
import { FAQ_CATEGORIES } from "@/lib/data/faq";
import { STUDENTS } from "@/lib/data/people";
import { cn, average } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import { Field, Input, Select, Switch, Textarea } from "@/components/ui/Field";
import Tabs from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { TrendChart, TopicBars, CohortBars } from "@/components/charts/PrismaCharts";
import {
  AdminHeader, StatTile, StatusPill, Toolbar, SearchInput, FilterSelect, DataTable, Pagination, usePagination,
} from "@/components/admin/AdminPrimitives";

const SUBJECT_OPTIONS = [
  { value: "math", label: "Mathematics" },
  { value: "english", label: "English" },
];

const topicOptions = (subject) =>
  (subject === "both" || !subject
    ? Object.values(TOPIC_BY_ID)
    : SUBJECT_TOPICS[subject] ?? []
  ).map((topic) => ({ value: topic.id, label: `${topic.name} (${topic.subject})` }));

const difficultyLabel = (id) => DIFFICULTIES[id]?.label ?? id;
const typeLabel = (id) => QUESTION_TYPES.find((t) => t.id === id)?.label ?? id;

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

/* ============================================================= 1 · questions */

const BLANK_QUESTION = {
  subject: "math", topicId: "number_systems", difficulty: "foundation", type: "mcq",
  prompt: "", options: ["", "", "", ""], answer: 0, explanation: "", skill: "", estTime: 1, tags: "",
};

function QuestionEditor({ open, onClose, initial }) {
  const { questionSave } = useApp();
  const isNew = !initial?.id;
  const [draft, setDraft] = useState(BLANK_QUESTION);
  const [errors, setErrors] = useState({});

  /* re-seed the draft every time the editor opens */
  useEffect(() => {
    if (!open) return;
    setDraft(initial
      ? { ...initial, options: initial.options ? [...initial.options] : ["", "", "", ""], tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : initial.tags ?? "" }
      : { ...BLANK_QUESTION, options: ["", "", "", ""] });
    setErrors({});
  }, [open, initial]);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const needsOptions = ["mcq", "reading", "vocabulary"].includes(draft.type);

  const save = () => {
    const next = {};
    if (draft.prompt.trim().length < 8) next.prompt = "Write the full question text (8+ characters).";
    if (needsOptions && draft.options.some((o) => !o.trim())) next.options = "All four options must be filled in.";
    if (["fill", "short", "equation"].includes(draft.type) && String(draft.answer ?? "").trim().length < 1) next.answer = "Enter the accepted answer.";
    if (!draft.explanation.trim()) next.explanation = "Every question needs an explanation — it powers the results analysis.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const topic = TOPIC_BY_ID[draft.topicId];
    questionSave({
      ...draft,
      id: draft.id ?? undefined,
      subject: draft.subject,
      topicId: draft.topicId,
      weight: topic?.weight ?? draft.weight ?? 6,
      answer: needsOptions ? Number(draft.answer) : draft.type === "boolean" ? draft.answer === true || draft.answer === "true" : String(draft.answer).trim(),
      options: needsOptions ? draft.options.map((o) => o.trim()) : undefined,
      estTime: Number(draft.estTime) || 1,
      tags: String(draft.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    });
    onClose(true);
  };

  return (
    <Modal
      open={open}
      onClose={() => onClose(false)}
      title={isNew ? "New question" : `Edit question · ${initial?.id}`}
      description="Questions feed diagnostics, practice sets and teacher assignments immediately after saving."
      size="lg"
      icon={FlaskConical}
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Subject" htmlFor="qe-subject">
            <Select id="qe-subject" value={draft.subject}
              onChange={(value) => {
                const firstTopic = (SUBJECT_TOPICS[value] ?? [])[0];
                set({ subject: value, topicId: firstTopic?.id ?? draft.topicId });
              }}
              options={SUBJECT_OPTIONS} />
          </Field>
          <Field label="Topic" htmlFor="qe-topic">
            <Select id="qe-topic" value={draft.topicId} onChange={(value) => set({ topicId: value })} options={topicOptions(draft.subject)} />
          </Field>
          <Field label="Difficulty" htmlFor="qe-diff">
            <Select id="qe-diff" value={draft.difficulty} onChange={(value) => set({ difficulty: value })}
              options={Object.values(DIFFICULTIES).map((d) => ({ value: d.id, label: d.label }))} />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Question type" htmlFor="qe-type">
            <Select id="qe-type" value={draft.type}
              onChange={(value) => set({ type: value, answer: ["mcq", "reading", "vocabulary"].includes(value) ? 0 : value === "boolean" ? true : "" })}
              options={QUESTION_TYPES.filter((t) => !["reading", "vocabulary"].includes(t.id)).concat([{ id: "numeric", label: "Numeric input" }]).map((t) => ({ value: t.id, label: t.label }))} />
          </Field>
          <Field label="Estimated time (min)" htmlFor="qe-time">
            <Input id="qe-time" type="number" min={1} max={10} value={draft.estTime ?? 1} onChange={(e) => set({ estTime: e.target.value })} />
          </Field>
          <Field label="Tags" htmlFor="qe-tags" hint="Comma separated">
            <Input id="qe-tags" value={Array.isArray(draft.tags) ? draft.tags.join(", ") : draft.tags ?? ""} placeholder="exam-style, word-problem" onChange={(e) => set({ tags: e.target.value })} />
          </Field>
        </div>

        <Field label="Question text" required error={errors.prompt} htmlFor="qe-prompt">
          <Textarea id="qe-prompt" rows={2} value={draft.prompt} error={errors.prompt}
            placeholder={draft.subject === "math" ? "e.g. Solve for x:  2x + 5 = 17" : "e.g. Choose the correct form: “She ____ (work) here since 2019.”"}
            onChange={(e) => set({ prompt: e.target.value })}
            className={draft.subject === "math" ? "font-mono" : undefined} />
        </Field>

        {needsOptions ? (
          <div>
            <p className="mb-1.5 text-[12px] font-semibold text-ink">Options <span className="font-normal text-muted">— select the correct one</span></p>
            <div className="grid gap-2">
              {draft.options.map((option, index) => (
                <label key={index} className={cn("flex items-center gap-2.5 rounded-md border px-3 py-2 transition-colors",
                  Number(draft.answer) === index ? "border-strong/40 bg-strong-soft/50" : "border-line bg-surface hover:border-line-2")}>
                  <input
                    type="radio"
                    name="qe-correct"
                    checked={Number(draft.answer) === index}
                    onChange={() => set({ answer: index })}
                    className="size-3.5 accent-[#14855c]"
                    aria-label={`Option ${String.fromCharCode(65 + index)} is correct`}
                  />
                  <span className="w-4 shrink-0 font-mono text-[11px] text-faint">{String.fromCharCode(65 + index)}</span>
                  <input
                    value={option}
                    onChange={(e) => {
                      const options = [...draft.options];
                      options[index] = e.target.value;
                      set({ options });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    aria-label={`Option ${String.fromCharCode(65 + index)} text`}
                    className={cn("w-full bg-transparent text-[12.5px] text-ink outline-none placeholder:text-faint", draft.subject === "math" && "font-mono")}
                  />
                </label>
              ))}
            </div>
            {errors.options ? <p className="mt-1.5 text-[12px] text-risk">{errors.options}</p> : null}
          </div>
        ) : draft.type === "boolean" ? (
          <Field label="Correct answer" htmlFor="qe-bool">
            <Select id="qe-bool" value={draft.answer === true || draft.answer === "true" ? "true" : "false"}
              onChange={(value) => set({ answer: value === "true" })}
              options={[{ value: "true", label: "True" }, { value: "false", label: "False" }]} />
          </Field>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Accepted answer" required error={errors.answer} htmlFor="qe-answer"
              hint={draft.type === "equation" ? "Spaces and × / ÷ spellings are normalised." : "Case and trailing punctuation are ignored."}>
              <Input id="qe-answer" value={draft.answer ?? ""} error={errors.answer} onChange={(e) => set({ answer: e.target.value })}
                className={["equation", "numeric"].includes(draft.type) ? "font-mono" : undefined} />
            </Field>
            <Field label="Also accept" htmlFor="qe-alt" hint="Comma separated alternatives">
              <Input id="qe-alt" value={Array.isArray(draft.acceptable) ? draft.acceptable.join(", ") : ""} placeholder="e.g. 7, x=7"
                onChange={(e) => set({ acceptable: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
            </Field>
          </div>
        )}

        <Field label="Explanation" required error={errors.explanation} htmlFor="qe-expl"
          hint="Shown after practice answers and inside diagnostic reports.">
          <Textarea id="qe-expl" rows={2} value={draft.explanation} error={errors.explanation} onChange={(e) => set({ explanation: e.target.value })} />
        </Field>

        <Field label="Skill measured" optional htmlFor="qe-skill" hint="Appears in the question bank and analytics.">
          <Input id="qe-skill" value={draft.skill ?? ""} placeholder="e.g. Two-step equations" onChange={(e) => set({ skill: e.target.value })} />
        </Field>

        <div className="flex justify-end gap-2 border-t border-line pt-3">
          <Button size="sm" variant="ghost" onClick={() => onClose(false)}>Cancel</Button>
          <Button size="sm" onClick={save}>
            <Save className="size-3.5" aria-hidden="true" /> {isNew ? "Add to question bank" : "Save question"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function AdminQuestions() {
  const { questions, questionDelete, toast } = useApp();
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [type, setType] = useState("all");
  const [editor, setEditor] = useState(null); // null | "new" | question
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions
      .filter((item) => (subject === "all" ? true : item.subject === subject))
      .filter((item) => (topic === "all" ? true : item.topicId === topic))
      .filter((item) => (difficulty === "all" ? true : item.difficulty === difficulty))
      .filter((item) => (type === "all" ? true : item.type === type))
      .filter((item) => !q || item.prompt.toLowerCase().includes(q) || (item.skill ?? "").toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
  }, [questions, query, subject, topic, difficulty, type]);

  const { slice, paginationProps } = usePagination(rows, 12);

  return (
    <div>
      <AdminHeader
        title="Question bank"
        description={`${questions.length} questions powering every diagnostic, practice set and assignment. Edits apply immediately.`}
        actions={<Button size="sm" onClick={() => setEditor("new")}><Plus className="size-3.5" aria-hidden="true" /> New question</Button>}
      />

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search prompt, skill or id…" id="q-search" />
        <FilterSelect id="q-subject" label="Subject" value={subject} onChange={setSubject}
          options={[{ value: "all", label: "All subjects" }, ...SUBJECT_OPTIONS]} />
        <FilterSelect id="q-topic" label="Topic" value={topic} onChange={setTopic}
          options={[{ value: "all", label: "All topics" }, ...topicOptions(subject === "all" ? "both" : subject)]} />
        <FilterSelect id="q-diff" label="Difficulty" value={difficulty} onChange={setDifficulty}
          options={[{ value: "all", label: "Any difficulty" }, ...Object.values(DIFFICULTIES).map((d) => ({ value: d.id, label: d.label }))]} />
        <FilterSelect id="q-type" label="Type" value={type} onChange={setType}
          options={[{ value: "all", label: "All types" }, ...QUESTION_TYPES.concat([{ id: "numeric", label: "Numeric input" }]).map((t) => ({ value: t.id, label: t.label }))]} />
      </Toolbar>

      <DataTable
        columns={[
          { key: "prompt", label: "Question", render: (q) => (
            <span className="block max-w-[420px] truncate text-[12.5px] text-ink" title={q.prompt}>{q.prompt}</span>
          ) },
          { key: "subject", label: "Subject", render: (q) => <Badge tone={q.subject === "math" ? "brand" : "accent"} size="xs">{q.subject === "math" ? "Math" : "English"}</Badge> },
          { key: "topicId", label: "Topic", hideMobile: true, render: (q) => <span className="text-muted">{TOPIC_BY_ID[q.topicId]?.name ?? q.topicId}</span> },
          { key: "difficulty", label: "Level", hideMobile: true, render: (q) => <span className="text-muted">{difficultyLabel(q.difficulty)}</span> },
          { key: "type", label: "Type", render: (q) => <span className="font-mono text-[11px] text-muted">{q.type ?? "mcq"}</span> },
          { key: "actions", label: "", align: "right", render: (q) => (
            <span className="flex items-center justify-end gap-1">
              <Button size="xs" variant="ghost" onClick={() => setEditor(q)} aria-label={`Edit question ${q.id}`}>
                <Pencil className="size-3.5" aria-hidden="true" /> Edit
              </Button>
              <Button size="xs" variant="ghost" className="text-risk hover:bg-risk-soft" onClick={() => setDeleting(q)} aria-label={`Delete question ${q.id}`}>
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </span>
          ) },
        ]}
        rows={slice}
        keyFor={(q) => q.id}
        empty={<EmptyState icon={Search} title="No questions match those filters" description="Adjust the filters or add the question you are missing."
          action={<Button size="sm" onClick={() => setEditor("new")}><Plus className="size-3.5" aria-hidden="true" /> New question</Button>} />}
      />
      <div className="mt-3"><Pagination {...paginationProps} /></div>

      <QuestionEditor
        open={Boolean(editor)}
        initial={editor === "new" ? null : editor}
        onClose={(saved) => {
          setEditor(null);
          if (saved) toast("Question bank updated — diagnostics pick it up on the next start.", { tone: "success" });
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => { questionDelete(deleting.id); setDeleting(null); }}
        title="Delete this question?"
        description={`“${deleting?.prompt?.slice(0, 90)}…” will be removed from the bank and from future test builds.`}
        confirmLabel="Delete question"
        tone="danger"
      />
    </div>
  );
}

/* ================================================================ 2 · tests */

const BLANK_TEST = { title: "", subject: "math", questionCount: 12, durationMinutes: 14, adaptive: false, status: "draft", description: "" };

export function AdminTests() {
  const { tests, testSave, testSetStatus, questions } = useApp();
  const [editor, setEditor] = useState(null);
  const [draft, setDraft] = useState(BLANK_TEST);
  const [errors, setErrors] = useState({});

  const openEditor = (test) => {
    setDraft(test ? { ...test } : { ...BLANK_TEST });
    setErrors({});
    setEditor(test ?? "new");
  };

  const save = () => {
    const next = {};
    if (draft.title.trim().length < 4) next.title = "Give the test a clear name.";
    if (Number(draft.questionCount) < 3) next.questionCount = "A test needs at least 3 questions.";
    setErrors(next);
    if (Object.keys(next).length) return;
    testSave({
      ...draft,
      id: editor === "new" ? undefined : editor.id,
      title: draft.title.trim(),
      questionCount: Number(draft.questionCount),
      durationMinutes: Number(draft.durationMinutes),
      createdBy: "admin",
      createdAt: draft.createdAt ?? new Date().toISOString().slice(0, 10),
    });
    setEditor(null);
  };

  const bankFor = (subject) => questions.filter((q) => subject === "both" ? true : q.subject === subject).length;

  return (
    <div>
      <AdminHeader
        title="Tests"
        description="Create, edit, publish and unpublish tests. Only published tests can be assigned by teachers."
        actions={<Button size="sm" onClick={() => openEditor(null)}><Plus className="size-3.5" aria-hidden="true" /> Create test</Button>}
      />

      <DataTable
        columns={[
          { key: "title", label: "Test", render: (t) => (
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-ink">{t.title}</span>
              <span className="block max-w-[380px] truncate text-[11px] text-muted">{t.description}</span>
            </span>
          ) },
          { key: "subject", label: "Subject", render: (t) => <Badge tone={t.subject === "math" ? "brand" : t.subject === "english" ? "accent" : "info"} size="xs">{t.subject === "both" ? "Math + English" : t.subject === "math" ? "Math" : "English"}</Badge> },
          { key: "questionCount", label: "Questions", align: "right", mono: true, hideMobile: true, render: (t) => <span>{t.questionCount} · {t.durationMinutes} min</span> },
          { key: "adaptive", label: "Adaptive", align: "center", hideMobile: true, render: (t) => (t.adaptive ? <Badge tone="accent" size="xs" icon={Sparkles}>Adaptive</Badge> : <span className="text-[11px] text-faint">Fixed</span>) },
          { key: "createdAt", label: "Created", mono: true, hideMobile: true },
          { key: "status", label: "Status", render: (t) => <StatusPill status={t.status} /> },
          { key: "actions", label: "Actions", align: "right", render: (t) => (
            <span className="flex items-center justify-end gap-1">
              <Button size="xs" variant="ghost" onClick={() => openEditor(t)}><Pencil className="size-3.5" aria-hidden="true" /> Edit</Button>
              {t.status === "published" ? (
                <Button size="xs" variant="ghost" onClick={() => testSetStatus(t.id, "draft")}>Unpublish</Button>
              ) : (
                <Button size="xs" onClick={() => testSetStatus(t.id, "published")} className="bg-strong border-strong hover:brightness-95">Publish</Button>
              )}
            </span>
          ) },
        ]}
        rows={tests}
        keyFor={(t) => t.id}
      />

      <Modal open={Boolean(editor)} onClose={() => setEditor(null)} size="md" icon={FileCheck2}
        title={editor === "new" ? "Create a test" : `Edit · ${editor?.title ?? ""}`}
        description="Tests draw questions from the bank by subject when a student or assignment starts them.">
        <div className="space-y-4">
          <Field label="Test name" required error={errors.title} htmlFor="te-title">
            <Input id="te-title" value={draft.title} error={errors.title} placeholder="Algebra checkpoint · Grade 10" onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Subject" htmlFor="te-subject">
              <Select id="te-subject" value={draft.subject} onChange={(value) => setDraft((d) => ({ ...d, subject: value }))}
                options={[...SUBJECT_OPTIONS, { value: "both", label: "Math + English" }]} />
            </Field>
            <Field label="Questions" required error={errors.questionCount} htmlFor="te-count">
              <Input id="te-count" type="number" min={3} max={40} value={draft.questionCount} error={errors.questionCount} onChange={(e) => setDraft((d) => ({ ...d, questionCount: e.target.value }))} />
            </Field>
            <Field label="Minutes" htmlFor="te-mins">
              <Input id="te-mins" type="number" min={3} max={120} value={draft.durationMinutes} onChange={(e) => setDraft((d) => ({ ...d, durationMinutes: e.target.value }))} />
            </Field>
          </div>
          <p className="rounded-md border border-line bg-surface-2 px-3 py-2 text-[11.5px] text-muted">
            The bank currently holds <strong className="font-semibold text-ink">{bankFor(draft.subject)}</strong> questions for this selection.
          </p>
          <Field label="Description" optional htmlFor="te-desc">
            <Textarea id="te-desc" rows={2} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="What does this test measure, and who is it for?" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Switch checked={Boolean(draft.adaptive)} onChange={(v) => setDraft((d) => ({ ...d, adaptive: v }))}
              label="Adaptive difficulty" description="Correct answers unlock harder same-topic items; mistakes unlock easier ones." />
            <Field label="Initial status" htmlFor="te-status">
              <Select id="te-status" value={draft.status} onChange={(value) => setDraft((d) => ({ ...d, status: value }))}
                options={[{ value: "draft", label: "Draft (hidden)" }, { value: "published", label: "Published (assignable)" }]} />
            </Field>
          </div>
          <div className="flex justify-end gap-2 border-t border-line pt-3">
            <Button size="sm" variant="ghost" onClick={() => setEditor(null)}>Cancel</Button>
            <Button size="sm" onClick={save}><Save className="size-3.5" aria-hidden="true" /> Save test</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ========================================================== 3 · test results */

export function AdminTestResults() {
  const { derived, submissions, diagnostics } = useApp();
  const students = derived.allStudents ?? STUDENTS;
  const [subject, setSubject] = useState("all");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const fromStudents = students.map((s) => ({
      id: `${s.id}-latest`, student: s.name, className: s.className ?? "—",
      test: "Autumn baseline · Full diagnostic", subject: "both",
      score: s.overall ?? 0, math: s.math ?? 0, english: s.english ?? 0,
      date: s.lastDiagnostic ?? "—", status: "completed",
    }));
    const fromSubs = submissions.map((sub) => ({
      id: sub.id, student: sub.studentName ?? "Student", className: sub.className ?? "—",
      test: sub.assignmentTitle ?? "Assignment", subject: sub.subject ?? "both",
      score: sub.score, math: sub.score, english: sub.score, date: sub.submittedAt, status: "completed",
    }));
    const q = query.trim().toLowerCase();
    return [...fromSubs, ...fromStudents]
      .filter((r) => (subject === "all" ? true : r.subject === subject || r.subject === "both"))
      .filter((r) => !q || r.student.toLowerCase().includes(q) || r.test.toLowerCase().includes(q));
  }, [students, submissions, query, subject]);

  const avg = Math.round(average(rows.map((r) => r.score)) || 0);
  const { slice, paginationProps } = usePagination(rows, 14);

  return (
    <div>
      <AdminHeader
        title="Test results"
        description="Every completed diagnostic and assignment submission across the platform."
        actions={
          <Button size="sm" variant="outline" onClick={() => downloadCsv("prisma-test-results.csv", [
            ["Student", "Class", "Test", "Subject", "Score %", "Date"],
            ...rows.map((r) => [r.student, r.className, r.test, r.subject, r.score, r.date]),
          ])}>
            <Download className="size-3.5" aria-hidden="true" /> Export CSV
          </Button>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatTile label="Results on record" value={rows.length} icon={ListChecks} tone="brand" />
        <StatTile label="Average score" value={`${avg}%`} icon={TrendingUp} tone={avg >= 70 ? "strong" : "developing"} />
        <StatTile label="Diagnostics (demo student)" value={diagnostics.length} sub="Latest session timeline" icon={FileCheck2} tone="accent" />
        <StatTile label="Assignment submissions" value={submissions.length} sub="Recorded in this browser" icon={Send} tone="neutral" />
      </div>

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search student or test…" id="tr-search" />
        <FilterSelect id="tr-subject" label="Subject" value={subject} onChange={setSubject}
          options={[{ value: "all", label: "All subjects" }, ...SUBJECT_OPTIONS, { value: "both", label: "Combined" }]} />
      </Toolbar>

      <DataTable
        columns={[
          { key: "student", label: "Student", render: (r) => <span className="text-[12.5px] font-semibold text-ink">{r.student}</span> },
          { key: "className", label: "Class", mono: true, hideMobile: true },
          { key: "test", label: "Test", render: (r) => <span className="text-muted">{r.test}</span> },
          { key: "subject", label: "Subject", render: (r) => <Badge tone={r.subject === "math" ? "brand" : r.subject === "english" ? "accent" : "info"} size="xs">{r.subject === "both" ? "Both" : r.subject}</Badge> },
          { key: "score", label: "Score", align: "right", mono: true, render: (r) => <span className={cn("font-bold", r.score >= 80 ? "text-strong" : r.score >= 60 ? "text-developing" : "text-risk")}>{r.score}%</span> },
          { key: "date", label: "Date", mono: true, hideMobile: true },
          { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
        ]}
        rows={slice}
        keyFor={(r) => r.id}
        empty={<EmptyState icon={ListChecks} title="No results match" description="Clear the filters to see every recorded result." />}
      />
      <div className="mt-3"><Pagination {...paginationProps} /></div>
    </div>
  );
}

/* ====================================================== 4 · learning content */

export function AdminLearningContent({ initialSubject = "math", initialTopic = null }) {
  const { unitsFor, unitSave, unitDelete, toast } = useApp();
  const [subject, setSubject] = useState(initialSubject === "english" ? "english" : "math");
  const [topicId, setTopicId] = useState(initialTopic && TOPIC_BY_ID[initialTopic] ? initialTopic : (SUBJECT_TOPICS[initialSubject === "english" ? "english" : "math"] ?? [])[0]?.id);
  const [editor, setEditor] = useState(null); // null | "new" | unit
  const [draft, setDraft] = useState({ title: "", minutes: 12, type: "lesson", focus: "" });
  const [deleting, setDeleting] = useState(null);

  const topics = SUBJECT_TOPICS[subject] ?? [];
  const topic = TOPIC_BY_ID[topicId];
  const units = topicId ? unitsFor(topicId) : [];

  const switchSubject = (value) => {
    setSubject(value);
    setTopicId((SUBJECT_TOPICS[value] ?? [])[0]?.id ?? null);
  };

  const openEditor = (unit) => {
    setDraft(unit ? { ...unit } : { title: "", minutes: 12, type: "lesson", focus: "" });
    setEditor(unit ?? "new");
  };

  const save = () => {
    if (draft.title.trim().length < 3) {
      toast("Give the unit a title of at least 3 characters.", { tone: "risk", title: "Cannot save" });
      return;
    }
    unitSave(topicId, {
      ...draft,
      title: draft.title.trim(),
      minutes: Number(draft.minutes) || 12,
      key: editor === "new" ? undefined : editor.key ?? editor.title,
      published: true,
    });
    setEditor(null);
  };

  return (
    <div>
      <AdminHeader
        title="Learning content"
        description="The units behind every topic page and learning path week. Add, edit or remove units — student pages update immediately."
        actions={
          <Button size="sm" onClick={() => openEditor(null)} disabled={!topicId}>
            <Plus className="size-3.5" aria-hidden="true" /> Add unit
          </Button>
        }
      />

      <Toolbar>
        <Tabs tabs={[{ id: "math", label: "Mathematics" }, { id: "english", label: "English" }]} value={subject} onChange={switchSubject} size="sm" ariaLabel="Subject" />
        <FilterSelect id="lc-topic" label="Topic" value={topicId ?? ""} onChange={setTopicId}
          options={topics.map((t) => ({ value: t.id, label: t.name }))} />
        {topic ? (
          <span className="ml-auto flex items-center gap-2">
            <Button size="xs" variant="outline" href={topic.subject === "math" ? `/student/math` : `/student/english`}>
              <Eye className="size-3.5" aria-hidden="true" /> Preview student page
            </Button>
          </span>
        ) : null}
      </Toolbar>

      {topic ? (
        <div className="mb-3 rounded-lg border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[14px] font-semibold text-ink">{topic.name}</h2>
              <p className="mt-0.5 max-w-2xl text-[12px] leading-relaxed text-muted">{topic.summary}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="neutral" size="sm">{topic.level}</Badge>
              <Badge tone={topic.subject === "math" ? "brand" : "accent"} size="sm">{topic.gradeBand}</Badge>
            </div>
          </div>
        </div>
      ) : null}

      <DataTable
        columns={[
          { key: "title", label: "Unit", render: (u) => (
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-ink">{u.title}</span>
              {u.focus ? <span className="block truncate text-[11px] text-muted">{u.focus}</span> : null}
            </span>
          ) },
          { key: "type", label: "Type", render: (u) => <Badge tone={u.type === "practice" ? "accent" : u.type === "review" ? "developing" : "neutral"} size="xs">{u.type ?? "lesson"}</Badge> },
          { key: "minutes", label: "Minutes", align: "right", mono: true },
          { key: "actions", label: "", align: "right", render: (u) => (
            <span className="flex items-center justify-end gap-1">
              <Button size="xs" variant="ghost" onClick={() => openEditor(u)}><Pencil className="size-3.5" aria-hidden="true" /> Edit</Button>
              <Button size="xs" variant="ghost" className="text-risk hover:bg-risk-soft" onClick={() => setDeleting(u)} aria-label={`Remove unit ${u.title}`}>
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </span>
          ) },
        ]}
        rows={units}
        keyFor={(u, i) => u.key ?? `${u.title}-${i}`}
        empty={<EmptyState icon={BookMarked} title="No units for this topic yet" description="Add the first lesson, practice set or review unit."
          action={<Button size="sm" onClick={() => openEditor(null)}><Plus className="size-3.5" aria-hidden="true" /> Add unit</Button>} />}
      />

      <Modal open={Boolean(editor)} onClose={() => setEditor(null)} size="sm" icon={BookMarked}
        title={editor === "new" ? `New unit · ${topic?.name ?? ""}` : `Edit unit`}
        description="Units appear on the topic study page and inside generated learning paths.">
        <div className="space-y-4">
          <Field label="Unit title" required htmlFor="lu-title">
            <Input id="lu-title" value={draft.title} placeholder="e.g. Completing the square — worked examples" onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Minutes" htmlFor="lu-mins">
              <Input id="lu-mins" type="number" min={3} max={90} value={draft.minutes} onChange={(e) => setDraft((d) => ({ ...d, minutes: e.target.value }))} />
            </Field>
            <Field label="Type" htmlFor="lu-type">
              <Select id="lu-type" value={draft.type ?? "lesson"} onChange={(value) => setDraft((d) => ({ ...d, type: value }))}
                options={[{ value: "lesson", label: "Lesson" }, { value: "practice", label: "Practice set" }, { value: "review", label: "Review" }]} />
            </Field>
          </div>
          <Field label="Focus" optional htmlFor="lu-focus" hint="One line shown under the title.">
            <Input id="lu-focus" value={draft.focus ?? ""} placeholder="e.g. Signs, discriminant, checking roots" onChange={(e) => setDraft((d) => ({ ...d, focus: e.target.value }))} />
          </Field>
          <div className="flex justify-end gap-2 border-t border-line pt-3">
            <Button size="sm" variant="ghost" onClick={() => setEditor(null)}>Cancel</Button>
            <Button size="sm" onClick={save}><Save className="size-3.5" aria-hidden="true" /> Save unit</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)}
        onConfirm={() => { unitDelete(topicId, deleting.key ?? deleting.title); setDeleting(null); }}
        title="Remove this unit?"
        description={`“${deleting?.title}” disappears from the topic page and future learning paths.`}
        confirmLabel="Remove unit" tone="danger" />
    </div>
  );
}

/* ============================================================= 5 · analytics */

export function AdminAnalytics() {
  const { derived, diagnostics, classesLocal } = useApp();
  const students = derived.allStudents ?? STUDENTS;

  const mathAvg = Math.round(average(students.map((s) => s.math ?? 0)));
  const englishAvg = Math.round(average(students.map((s) => s.english ?? 0)));

  const trend = diagnostics.map((d, i) => ({
    label: d.date.slice(5),
    math: d.topics ? Math.round(average(Object.entries(d.topics).filter(([id]) => TOPIC_BY_ID[id]?.subject === "math").map(([, v]) => v)) || mathAvg) : mathAvg,
    english: d.topics ? Math.round(average(Object.entries(d.topics).filter(([id]) => TOPIC_BY_ID[id]?.subject === "english").map(([, v]) => v)) || englishAvg) : englishAvg,
    index: i,
  }));

  const hardest = Object.values(TOPIC_BY_ID)
    .map((topic) => ({
      name: topic.name,
      subject: topic.subject,
      score: Math.round(average(students.map((s) => s.topicScores?.[topic.id]).filter((v) => typeof v === "number")) || (topic.subject === "math" ? mathAvg : englishAvg)),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 8);

  const byClass = classesLocal.map((c) => {
    const roster = students.filter((s) => s.classId === c.id || s.className === c.name);
    return { label: c.name, value: roster.length ? Math.round(average(roster.map((s) => s.overall ?? 0))) : 0 };
  });

  return (
    <div>
      <AdminHeader title="Analytics" description="Platform-wide learning signals: cohort averages, hardest topics and class comparison." />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <StatTile label="Cohort · Mathematics" value={`${mathAvg}%`} icon={Sigma} tone="brand" sub={`${students.filter((s) => (s.math ?? 0) < 60).length} students below 60%`} />
        <StatTile label="Cohort · English" value={`${englishAvg}%`} icon={BookOpen} tone="accent" sub={`${students.filter((s) => (s.english ?? 0) < 60).length} students below 60%`} />
        <StatTile label="Improving students" value={students.filter((s) => (s.trend ?? 0) > 0).length} icon={TrendingUp} tone="strong" sub="Trend above zero since last term" />
        <StatTile label="Classes" value={classesLocal.length} icon={Layers} tone="neutral" sub={`${students.length} student records`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="ana-trend">
          <h2 id="ana-trend" className="text-[13px] font-semibold text-ink">Demo student · score timeline</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">Every diagnostic stored in this browser, oldest to newest.</p>
          <TrendChart className="mt-3" data={trend.length > 1 ? trend : [{ label: "now", math: mathAvg, english: englishAvg }]} height={220} />
        </section>

        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="ana-class">
          <h2 id="ana-class" className="text-[13px] font-semibold text-ink">Average score by class</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">Cohort means per class roster.</p>
          <CohortBars className="mt-3" data={byClass} height={220} bandColour />
        </section>
      </div>

      <section className="mt-4 rounded-lg border border-line bg-surface p-4" aria-labelledby="ana-hard">
        <h2 id="ana-hard" className="text-[13px] font-semibold text-ink">Hardest topics across the cohort</h2>
        <p className="mt-0.5 text-[11.5px] text-muted">Lowest average mastery first — the platform-wide teaching priorities.</p>
        <TopicBars className="mt-3" data={hardest} height={260} />
      </section>
    </div>
  );
}

/* ============================================================== 6 · reports */

export function AdminReports() {
  const { derived, applications, tests, questions, classesLocal, toast } = useApp();
  const students = derived.allStudents ?? STUDENTS;
  const [report, setReport] = useState("students");

  const reports = {
    students: {
      label: "Student performance",
      icon: TrendingUp,
      description: "Every student record with subject scores, trend and last diagnostic.",
      rows: students.map((s) => ({ id: s.id, a: s.name, b: s.className ?? "—", c: `${s.math ?? 0}%`, d: `${s.english ?? 0}%`, e: `${s.trend > 0 ? "+" : ""}${s.trend ?? 0} pts`, f: s.lastDiagnostic ?? "—" })),
      columns: ["Student", "Class", "Math", "English", "Trend", "Last diagnostic"],
      csv: ["Student", "Class", "Math", "English", "Trend", "Last diagnostic"],
    },
    applications: {
      label: "Teacher applications",
      icon: Layers,
      description: "Full application history with decisions and reasons.",
      rows: applications.map((a) => ({ id: a.id, a: `${a.firstName} ${a.lastName}`, b: a.subject, c: a.institution, d: a.submittedAt, e: a.status, f: a.rejectionReason ?? "—" })),
      columns: ["Applicant", "Subject", "Institution", "Submitted", "Status", "Reason"],
      csv: ["Applicant", "Subject", "Institution", "Submitted", "Status", "Reason"],
    },
    content: {
      label: "Content inventory",
      icon: BookMarked,
      description: "Question bank and test coverage by subject and status.",
      rows: tests.map((t) => ({ id: t.id, a: t.title, b: t.subject, c: `${t.questionCount} Qs`, d: `${t.durationMinutes} min`, e: t.status, f: t.createdAt })),
      columns: ["Test", "Subject", "Size", "Duration", "Status", "Created"],
      csv: ["Test", "Subject", "Size", "Duration", "Status", "Created"],
    },
    classes: {
      label: "Class roster summary",
      icon: Sigma,
      description: "Classes with sizes and cohort averages.",
      rows: classesLocal.map((c) => {
        const roster = students.filter((s) => s.classId === c.id || s.className === c.name);
        return { id: c.id, a: c.name, b: `Grade ${c.grade}`, c: `${roster.length || c.size}`, d: `${roster.length ? Math.round(average(roster.map((s) => s.overall ?? 0))) : "—"}%`, e: c.term, f: c.room ?? "—" };
      }),
      columns: ["Class", "Grade", "Students", "Average", "Term", "Room"],
      csv: ["Class", "Grade", "Students", "Average", "Term", "Room"],
    },
  };

  const active = reports[report];

  return (
    <div>
      <AdminHeader title="Reports" description="Generate and export the standard platform reports. Everything is computed from live demo data." />

      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(reports).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setReport(key)}
            aria-pressed={report === key}
            className={cn("rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              report === key ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-line-2")}
          >
            <item.icon className={cn("size-4", report === key ? "text-brand" : "text-muted")} aria-hidden="true" />
            <p className={cn("mt-2 text-[12.5px] font-semibold", report === key ? "text-brand" : "text-ink")}>{item.label}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted">{item.description}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12px] text-muted"><strong className="font-semibold text-ink">{active.rows.length}</strong> rows · {active.label}</p>
        <Button size="sm" variant="outline"
          onClick={() => {
            downloadCsv(`prisma-${report}-report.csv`, [
              active.csv,
              ...active.rows.map((r) => [r.a, r.b, r.c, r.d, r.e, r.f]),
            ]);
            toast(`${active.label} exported as CSV.`, { tone: "success", title: "Report downloaded" });
          }}>
          <Download className="size-3.5" aria-hidden="true" /> Download {active.label} (CSV)
        </Button>
      </div>

      <DataTable
        className="mt-3"
        columns={active.columns.map((label, i) => ({
          key: ["a", "b", "c", "d", "e", "f"][i],
          label,
          render: i === 4 && (report === "applications" || report === "content") ? (row) => <StatusPill status={row[["a", "b", "c", "d", "e", "f"][i]]} /> : undefined,
          hideMobile: i > 3,
        }))}
        rows={active.rows}
        keyFor={(r) => r.id}
      />
    </div>
  );
}

/* ========================================================= 7 · notifications */

export function AdminNotifications() {
  const { notifications, notify, markNotificationsRead, toast } = useApp();
  const [audience, setAudience] = useState("student");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState({});

  const send = () => {
    const next = {};
    if (title.trim().length < 4) next.title = "Add a clear notification title.";
    if (body.trim().length < 8) next.body = "Add the message body (8+ characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    notify(audience, { title: title.trim(), body: body.trim(), tone: "info" });
    toast(`Notification delivered to ${audience === "admin" ? "administrators" : `${audience}s`}.`, { tone: "success", title: "Notification sent" });
    setTitle("");
    setBody("");
  };

  return (
    <div>
      <AdminHeader title="Notifications" description="Compose role-targeted notifications and review what each workspace has received." />

      <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section className="h-fit rounded-lg border border-line bg-surface p-4" aria-labelledby="ntf-compose">
          <h2 id="ntf-compose" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <Megaphone className="size-4 text-brand" aria-hidden="true" /> Compose
          </h2>
          <div className="mt-3 space-y-3.5">
            <Field label="Audience" htmlFor="ntf-audience">
              <Select id="ntf-audience" value={audience} onChange={setAudience}
                options={[{ value: "student", label: "All students" }, { value: "teacher", label: "All teachers" }, { value: "admin", label: "Administrators" }]} />
            </Field>
            <Field label="Title" required error={errors.title} htmlFor="ntf-title">
              <Input id="ntf-title" value={title} error={errors.title} placeholder="Maintenance window on Sunday" onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="Message" required error={errors.body} htmlFor="ntf-body">
              <Textarea id="ntf-body" rows={3} value={body} error={errors.body} placeholder="What do recipients need to know, and by when?" onChange={(e) => setBody(e.target.value)} />
            </Field>
            <Button size="sm" full onClick={send}><Send className="size-3.5" aria-hidden="true" /> Send notification</Button>
            <p className="text-[11px] leading-relaxed text-faint">
              Recipients see this instantly in their bell menu. In this demo nothing leaves the browser.
            </p>
          </div>
        </section>

        <div className="space-y-4">
          {(["student", "teacher", "admin"]).map((role) => (
            <section key={role} className="rounded-lg border border-line bg-surface" aria-labelledby={`ntf-${role}`}>
              <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
                <h2 id={`ntf-${role}`} className="flex items-center gap-2 text-[12.5px] font-semibold capitalize text-ink">
                  <Bell className="size-3.5 text-muted" aria-hidden="true" /> {role}s
                  {notifications[role]?.filter((n) => !n.read).length ? (
                    <Badge tone="developing" size="xs">{notifications[role].filter((n) => !n.read).length} unread</Badge>
                  ) : null}
                </h2>
                <button type="button" onClick={() => markNotificationsRead(role)} className="text-[11.5px] font-medium text-brand hover:underline">
                  Mark all read
                </button>
              </header>
              <ul className="divide-y divide-line">
                {(notifications[role] ?? []).slice(0, 6).map((item) => (
                  <li key={item.id} className={cn("flex items-start gap-2.5 px-4 py-2.5", !item.read && "bg-brand-soft/40")}>
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-medium text-ink">{item.title}</p>
                      <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{item.body}</p>
                    </div>
                    <time className="tnum shrink-0 font-mono text-[10px] text-faint">{item.date}</time>
                  </li>
                ))}
                {!(notifications[role] ?? []).length ? (
                  <li className="px-4 py-6 text-center text-[12px] text-muted">No notifications for this audience yet.</li>
                ) : null}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================================================== 8 · announcements */

export function AdminAnnouncements() {
  const { cms, updateCms, notify, toast } = useApp();
  const [text, setText] = useState(cms.announcement?.text ?? "");
  const [enabled, setEnabled] = useState(Boolean(cms.announcement?.enabled));

  const saveBanner = () => {
    if (enabled && text.trim().length < 5) {
      toast("Write the announcement text before enabling the banner.", { tone: "risk", title: "Cannot publish" });
      return;
    }
    updateCms({ announcement: { enabled, text: text.trim() } });
  };

  const broadcast = () => {
    if (text.trim().length < 5) {
      toast("Write the announcement first.", { tone: "risk", title: "Nothing to send" });
      return;
    }
    notify("student", { title: "Announcement", body: text.trim(), tone: "info" });
    notify("teacher", { title: "Announcement", body: text.trim(), tone: "info" });
    toast("Announcement pushed to every student and teacher bell.", { tone: "success", title: "Announcement sent" });
  };

  return (
    <div>
      <AdminHeader title="Announcements" description="Publish a site-wide banner and push the same message into student and teacher notifications." />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="ann-editor">
          <h2 id="ann-editor" className="text-[13px] font-semibold text-ink">Announcement text</h2>
          <div className="mt-3 space-y-4">
            <Field label="Message" htmlFor="ann-text" hint="One or two sentences. Shown in a slim banner above the public navigation.">
              <Textarea id="ann-text" rows={3} value={text} onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Autumn diagnostic window opens 20 September — book your class slot now." />
            </Field>
            <Switch checked={enabled} onChange={setEnabled} label="Show banner on the public site" description="The banner appears above the navbar on every marketing page." />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={saveBanner}><Save className="size-3.5" aria-hidden="true" /> Save banner settings</Button>
              <Button size="sm" variant="outline" onClick={broadcast}><Megaphone className="size-3.5" aria-hidden="true" /> Push to all bells</Button>
              <Button size="sm" variant="ghost" href="/">
                <Eye className="size-3.5" aria-hidden="true" /> Preview on homepage
              </Button>
            </div>
          </div>
        </section>

        <section className="h-fit rounded-lg border border-line bg-surface p-4" aria-labelledby="ann-preview">
          <h2 id="ann-preview" className="text-[13px] font-semibold text-ink">Live preview</h2>
          {enabled && text.trim() ? (
            <div className="mt-3">
              <div className="rounded-t-lg bg-ink px-3 py-2 text-center text-[11.5px] font-medium text-canvas">{text.trim()}</div>
              <div className="rounded-b-lg border border-t-0 border-line bg-surface px-3 py-4 text-center text-[11px] text-faint">…public navigation below…</div>
            </div>
          ) : (
            <p className="mt-3 rounded-md border border-dashed border-line px-3 py-6 text-center text-[12px] text-muted">
              Banner is off. Write a message and enable it to preview.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

/* =================================================================== 9 · faq */

export function AdminFaq() {
  const { faqs, faqSave, faqDelete, faqMove } = useApp();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState(null);
  const [draft, setDraft] = useState({ category: FAQ_CATEGORIES[0]?.id ?? "general", question: "", answer: "" });
  const [deleting, setDeleting] = useState(null);

  const rows = faqs
    .map((faq, index) => ({ ...faq, index }))
    .filter((faq) => (category === "all" ? true : faq.category === category))
    .filter((faq) => {
      const q = query.trim().toLowerCase();
      return !q || faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    });

  const openEditor = (faq) => {
    setDraft(faq ? { ...faq } : { id: undefined, category: category === "all" ? (FAQ_CATEGORIES[0]?.id ?? "general") : category, question: "", answer: "" });
    setEditor(faq ?? "new");
  };

  const save = () => {
    if (draft.question.trim().length < 6 || draft.answer.trim().length < 10) return;
    faqSave({ ...draft, question: draft.question.trim(), answer: draft.answer.trim(), id: editor === "new" ? undefined : editor.id });
    setEditor(null);
  };

  return (
    <div>
      <AdminHeader
        title="FAQ manager"
        description="Edit the public help centre. Changes appear on /faq immediately — including question order."
        actions={<Button size="sm" onClick={() => openEditor(null)}><Plus className="size-3.5" aria-hidden="true" /> New FAQ entry</Button>}
      />

      <Toolbar>
        <SearchInput value={query} onChange={setQuery} placeholder="Search questions…" id="faq-search" />
        <FilterSelect id="faq-cat" label="Category" value={category} onChange={setCategory}
          options={[{ value: "all", label: "All categories" }, ...FAQ_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))]} />
        <Button size="sm" variant="ghost" href="/faq" className="ml-auto"><Eye className="size-3.5" aria-hidden="true" /> View public FAQ</Button>
      </Toolbar>

      <DataTable
        columns={[
          { key: "question", label: "Question", render: (f) => (
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-ink">{f.question}</span>
              <span className="block max-w-[460px] truncate text-[11px] text-muted">{f.answer}</span>
            </span>
          ) },
          { key: "category", label: "Category", hideMobile: true, render: (f) => <Badge tone="neutral" size="xs">{FAQ_CATEGORIES.find((c) => c.id === f.category)?.label ?? f.category}</Badge> },
          { key: "order", label: "Order", align: "center", hideMobile: true, render: (f) => (
            <span className="flex items-center justify-center gap-0.5">
              <button type="button" aria-label={`Move “${f.question}” up`} disabled={f.index === 0} onClick={() => faqMove(f.id, -1)}
                className="grid size-6 place-items-center rounded text-muted transition-colors hover:bg-surface-3 hover:text-ink disabled:opacity-30">
                <ChevronUp className="size-3.5" aria-hidden="true" />
              </button>
              <button type="button" aria-label={`Move “${f.question}” down`} disabled={f.index === faqs.length - 1} onClick={() => faqMove(f.id, 1)}
                className="grid size-6 place-items-center rounded text-muted transition-colors hover:bg-surface-3 hover:text-ink disabled:opacity-30">
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          ) },
          { key: "actions", label: "", align: "right", render: (f) => (
            <span className="flex items-center justify-end gap-1">
              <Button size="xs" variant="ghost" onClick={() => openEditor(f)}><Pencil className="size-3.5" aria-hidden="true" /> Edit</Button>
              <Button size="xs" variant="ghost" className="text-risk hover:bg-risk-soft" onClick={() => setDeleting(f)} aria-label={`Delete FAQ ${f.question}`}>
                <Trash2 className="size-3.5" aria-hidden="true" />
              </Button>
            </span>
          ) },
        ]}
        rows={rows}
        keyFor={(f) => f.id}
        empty={<EmptyState icon={HelpCircle} title="No FAQ entries match" description="Clear the filters or add a new entry." />}
      />

      <Modal open={Boolean(editor)} onClose={() => setEditor(null)} size="md" icon={HelpCircle}
        title={editor === "new" ? "New FAQ entry" : "Edit FAQ entry"}
        description="Answers render on the public /faq page with full formatting.">
        <div className="space-y-4">
          <Field label="Category" htmlFor="faq-cat-edit">
            <Select id="faq-cat-edit" value={draft.category} onChange={(value) => setDraft((d) => ({ ...d, category: value }))}
              options={FAQ_CATEGORIES.map((c) => ({ value: c.id, label: c.label }))} />
          </Field>
          <Field label="Question" required htmlFor="faq-q">
            <Input id="faq-q" value={draft.question} onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))} placeholder="How long does a full diagnostic take?" />
          </Field>
          <Field label="Answer" required htmlFor="faq-a">
            <Textarea id="faq-a" rows={4} value={draft.answer} onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))} />
          </Field>
          <div className="flex justify-end gap-2 border-t border-line pt-3">
            <Button size="sm" variant="ghost" onClick={() => setEditor(null)}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={draft.question.trim().length < 6 || draft.answer.trim().length < 10}>
              <Save className="size-3.5" aria-hidden="true" /> Save entry
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)}
        onConfirm={() => { faqDelete(deleting.id); setDeleting(null); }}
        title="Delete this FAQ entry?" description={`“${deleting?.question}” disappears from the public help centre.`}
        confirmLabel="Delete entry" tone="danger" />
    </div>
  );
}

/* =============================================================== 10 · pricing */

export function AdminPricing() {
  const { plans, updatePlan } = useApp();
  const [editor, setEditor] = useState(null);
  const [draft, setDraft] = useState(null);

  const openEditor = (plan) => {
    setDraft({ ...plan, price: { ...plan.price } });
    setEditor(plan);
  };

  const save = () => {
    updatePlan(editor.id, {
      name: draft.name,
      tagline: draft.tagline,
      price: { monthly: Number(draft.price.monthly), annual: Number(draft.price.annual) },
      currency: draft.currency,
      cta: draft.cta,
      featured: draft.featured,
      features: draft.features,
    });
    setEditor(null);
  };

  return (
    <div>
      <AdminHeader
        title="Pricing"
        description="Plans, prices and feature lists shown on the public pricing page. Save to publish instantly."
        actions={<Button size="sm" variant="ghost" href="/pricing#compare"><Eye className="size-3.5" aria-hidden="true" /> View pricing page</Button>}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <section key={plan.id} className={cn("flex flex-col rounded-lg border bg-surface p-4", plan.featured ? "border-brand" : "border-line")} aria-labelledby={`plan-${plan.id}`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 id={`plan-${plan.id}`} className="text-[14px] font-semibold text-ink">{plan.name}</h2>
                <p className="text-[11px] text-muted">{plan.audience}</p>
              </div>
              {plan.featured ? <Badge tone="brand" size="xs" icon={Sparkles}>Featured</Badge> : null}
            </div>
            <p className="tnum mt-3 font-display text-[26px] leading-none text-ink">
              {plan.price.monthly === 0 ? "Free" : `$${plan.price.monthly}`}
              {plan.price.monthly > 0 ? <span className="text-[12px] font-sans text-muted"> / month</span> : null}
            </p>
            <p className="mt-1 text-[11px] text-muted">${plan.price.annual} billed annually</p>
            <ul className="mt-3 flex-1 space-y-1.5 border-t border-line pt-3">
              {plan.features.slice(0, 5).map((feature) => (
                <li key={feature.label} className={cn("flex items-start gap-1.5 text-[11.5px] leading-snug", feature.included ? "text-ink-soft" : "text-faint line-through")}>
                  {feature.label}
                </li>
              ))}
              {plan.features.length > 5 ? <li className="text-[11px] text-faint">+{plan.features.length - 5} more</li> : null}
            </ul>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => openEditor(plan)}>
              <Pencil className="size-3.5" aria-hidden="true" /> Edit {plan.name}
            </Button>
          </section>
        ))}
      </div>

      <Modal open={Boolean(editor)} onClose={() => setEditor(null)} size="md" icon={BadgeDollarSign}
        title={editor ? `Edit · ${editor.name}` : ""} description="Prices are demo values — safe to experiment.">
        {draft ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Plan name" htmlFor="pl-name">
                <Input id="pl-name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
              </Field>
              <Field label="CTA label" htmlFor="pl-cta">
                <Input id="pl-cta" value={draft.cta} onChange={(e) => setDraft((d) => ({ ...d, cta: e.target.value }))} />
              </Field>
            </div>
            <Field label="Tagline" htmlFor="pl-tag">
              <Input id="pl-tag" value={draft.tagline} onChange={(e) => setDraft((d) => ({ ...d, tagline: e.target.value }))} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Monthly (USD)" htmlFor="pl-m">
                <Input id="pl-m" type="number" min={0} value={draft.price.monthly} onChange={(e) => setDraft((d) => ({ ...d, price: { ...d.price, monthly: e.target.value } }))} />
              </Field>
              <Field label="Annual (USD)" htmlFor="pl-a">
                <Input id="pl-a" type="number" min={0} value={draft.price.annual} onChange={(e) => setDraft((d) => ({ ...d, price: { ...d.price, annual: e.target.value } }))} />
              </Field>
              <Field label="Currency" htmlFor="pl-c">
                <Input id="pl-c" value={draft.currency} onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))} />
              </Field>
            </div>
            <Switch checked={Boolean(draft.featured)} onChange={(v) => setDraft((d) => ({ ...d, featured: v }))}
              label="Featured plan" description="Highlighted with the brand border on the pricing page." />
            <div>
              <p className="mb-1.5 text-[12px] font-semibold text-ink">Features</p>
              <ul className="space-y-1.5">
                {draft.features.map((feature, index) => (
                  <li key={feature.label + index} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={feature.included}
                      onChange={(e) => {
                        const features = [...draft.features];
                        features[index] = { ...feature, included: e.target.checked };
                        setDraft((d) => ({ ...d, features }));
                      }}
                      className="size-3.5 shrink-0 accent-[#2b4fe0]"
                      aria-label={`Include feature: ${feature.label}`}
                    />
                    <input
                      value={feature.label}
                      onChange={(e) => {
                        const features = [...draft.features];
                        features[index] = { ...feature, label: e.target.value };
                        setDraft((d) => ({ ...d, features }));
                      }}
                      aria-label={`Feature ${index + 1} label`}
                      className="w-full rounded-md border border-line bg-surface px-2.5 py-1.5 text-[12px] text-ink outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/15"
                    />
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => setDraft((d) => ({ ...d, features: [...d.features, { label: "New feature", included: true }] }))}
                className="mt-2 text-[11.5px] font-medium text-brand hover:underline">
                + Add feature line
              </button>
            </div>
            <div className="flex justify-end gap-2 border-t border-line pt-3">
              <Button size="sm" variant="ghost" onClick={() => setEditor(null)}>Cancel</Button>
              <Button size="sm" onClick={save}><Save className="size-3.5" aria-hidden="true" /> Save plan</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

/* ============================================================== 11 · homepage */

export function AdminHomepage() {
  const { cms, updateCms } = useApp();
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(cms)));
  const [saved, setSaved] = useState(false);

  const setHero = (key, value) => setDraft((d) => ({ ...d, hero: { ...d.hero, [key]: value } }));
  const setSection = (key, value) => setDraft((d) => ({ ...d, sections: { ...d.sections, [key]: value } }));

  const SECTIONS = [
    ["demoQuiz", "Try-a-question demo", "Interactive sample question on the hero fold"],
    ["problem", "“One score is not enough”", "The problem statement section"],
    ["reportProof", "Sample report visual", "The explained diagnostic report preview"],
    ["subjects", "Subject maps", "Mathematics & English skill maps"],
    ["path", "Learning path", "How results become a weekly plan"],
    ["progress", "Progress tracking", "Timeline and improvement chart"],
    ["educators", "For educators", "Teacher and school value proposition"],
    ["testimonials", "Testimonials", "Demo quotes (clearly marked as demo)"],
    ["faq", "FAQ preview", "Top questions with a link to /faq"],
  ];

  const save = () => {
    updateCms(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <AdminHeader
        title="Homepage"
        description="Edit the public homepage hero and choose which sections render. Saves apply to the live marketing site immediately."
        actions={
          <>
            <Button size="sm" variant="ghost" href="/"><Eye className="size-3.5" aria-hidden="true" /> View homepage</Button>
            <Button size="sm" onClick={save}><Save className="size-3.5" aria-hidden="true" /> {saved ? "Saved ✓" : "Publish changes"}</Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="hp-hero">
          <h2 id="hp-hero" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <PanelTop className="size-4 text-brand" aria-hidden="true" /> Hero
          </h2>
          <div className="mt-3 space-y-3.5">
            <Field label="Eyebrow" htmlFor="hp-eyebrow">
              <Input id="hp-eyebrow" value={draft.hero.eyebrow} onChange={(e) => setHero("eyebrow", e.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title line 1" htmlFor="hp-t1">
                <Input id="hp-t1" value={draft.hero.titleLine1} onChange={(e) => setHero("titleLine1", e.target.value)} />
              </Field>
              <Field label="Title line 2" htmlFor="hp-t2">
                <Input id="hp-t2" value={draft.hero.titleLine2} onChange={(e) => setHero("titleLine2", e.target.value)} />
              </Field>
            </div>
            <Field label="Body copy" htmlFor="hp-body">
              <Textarea id="hp-body" rows={3} value={draft.hero.body} onChange={(e) => setHero("body", e.target.value)} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Primary CTA label" htmlFor="hp-c1">
                <Input id="hp-c1" value={draft.hero.primaryLabel} onChange={(e) => setHero("primaryLabel", e.target.value)} />
              </Field>
              <Field label="Primary CTA link" htmlFor="hp-c1h">
                <Input id="hp-c1h" value={draft.hero.primaryHref} onChange={(e) => setHero("primaryHref", e.target.value)} className="font-mono text-[12px]" />
              </Field>
              <Field label="Secondary CTA label" htmlFor="hp-c2">
                <Input id="hp-c2" value={draft.hero.secondaryLabel} onChange={(e) => setHero("secondaryLabel", e.target.value)} />
              </Field>
              <Field label="Secondary CTA link" htmlFor="hp-c2h">
                <Input id="hp-c2h" value={draft.hero.secondaryHref} onChange={(e) => setHero("secondaryHref", e.target.value)} className="font-mono text-[12px]" />
              </Field>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="hp-preview">
            <h2 id="hp-preview" className="text-[13px] font-semibold text-ink">Hero preview</h2>
            <div className="mt-3 rounded-lg border border-line bg-canvas p-4">
              <p className="eyebrow">{draft.hero.eyebrow}</p>
              <p className="mt-2 font-display text-[19px] leading-tight tracking-[-0.02em] text-ink">
                {draft.hero.titleLine1}<br />{draft.hero.titleLine2}
              </p>
              <p className="mt-2 line-clamp-3 text-[11.5px] leading-relaxed text-muted">{draft.hero.body}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="rounded-md bg-brand px-2.5 py-1.5 text-[11px] font-semibold text-white">{draft.hero.primaryLabel}</span>
                <span className="rounded-md border border-line-2 px-2.5 py-1.5 text-[11px] font-semibold text-ink">{draft.hero.secondaryLabel}</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="hp-sections">
            <h2 id="hp-sections" className="text-[13px] font-semibold text-ink">Homepage sections</h2>
            <p className="mt-0.5 text-[11px] text-muted">Toggle what renders below the hero.</p>
            <div className="mt-3 space-y-1">
              {SECTIONS.map(([key, label, description]) => (
                <div key={key} className="flex items-center justify-between gap-3 rounded-md px-1 py-1.5">
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-medium text-ink">{label}</span>
                    <span className="block truncate text-[10.5px] text-muted">{description}</span>
                  </span>
                  <Switch checked={Boolean(draft.sections[key])} onChange={(v) => setSection(key, v)} label={`Show ${label}`} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================== 12 · settings */

export function AdminSettings() {
  const { user, settings, updateSettings, resetDemo, signOut } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const platform = settings.platform ?? {};

  const setPlatform = (key, value) => updateSettings({ platform: { ...platform, [key]: value } });

  return (
    <div>
      <AdminHeader title="Settings" description="Platform-wide configuration for this demo deployment." />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="set-reg">
          <h2 id="set-reg" className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <Settings2 className="size-4 text-brand" aria-hidden="true" /> Registration & access
          </h2>
          <div className="mt-3 space-y-2">
            <Switch checked={platform.teacherApplicationsOpen !== false} onChange={(v) => setPlatform("teacherApplicationsOpen", v)}
              label="Teacher applications open" description="When off, the teacher registration form shows a closed notice instead of the form." />
            <Switch checked={platform.studentRegistrationOpen !== false} onChange={(v) => setPlatform("studentRegistrationOpen", v)}
              label="Student registration open" description="Students can create accounts without review." />
            <Switch checked={Boolean(platform.maintenance)} onChange={(v) => setPlatform("maintenance", v)}
              label="Maintenance banner" description="Shows a slim maintenance notice above the public navigation." />
          </div>
        </section>

        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="set-support">
          <h2 id="set-support" className="text-[13px] font-semibold text-ink">Support contacts</h2>
          <div className="mt-3 space-y-3.5">
            <Field label="Support email" htmlFor="set-email" hint="Used on the contact and pending-approval pages.">
              <Input id="set-email" type="email" value={platform.supportEmail ?? "support@prisma.education"}
                onChange={(e) => setPlatform("supportEmail", e.target.value)} />
            </Field>
            <Field label="Review promise" htmlFor="set-sla" hint="Shown to applicants awaiting a decision.">
              <Input id="set-sla" value={platform.reviewSla ?? "1–2 working days"}
                onChange={(e) => setPlatform("reviewSla", e.target.value)} />
            </Field>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-surface p-4" aria-labelledby="set-admin">
          <h2 id="set-admin" className="text-[13px] font-semibold text-ink">Administrator</h2>
          <dl className="mt-3 space-y-0">
            {[["Name", user?.name ?? "Demo Admin"], ["Email", user?.email ?? "admin@prisma.education"], ["Role", "admin · full permissions"]].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-0">
                <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">{k}</dt>
                <dd className="text-[12.5px] font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" href="/admin/users"><Search className="size-3.5" aria-hidden="true" /> Manage users</Button>
            <Button size="sm" variant="ghost" onClick={signOut}>Sign out</Button>
          </div>
        </section>

        <section className="rounded-lg border border-risk/30 bg-risk-soft/40 p-4" aria-labelledby="set-danger">
          <h2 id="set-danger" className="flex items-center gap-2 text-[13px] font-semibold text-risk">
            <TriangleAlert className="size-4" aria-hidden="true" /> Danger zone
          </h2>
          <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
            Reset every CMS edit, question, test, application decision and student record in this browser back to the
            shipped demo baseline. This cannot be undone.
          </p>
          <Button size="sm" variant="danger" className="mt-3" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="size-3.5" aria-hidden="true" /> Reset demo data
          </Button>
        </section>
      </div>

      <ConfirmDialog open={confirmReset} onClose={() => setConfirmReset(false)}
        onConfirm={() => { resetDemo(); setConfirmReset(false); }}
        title="Reset all demo data?"
        description="Homepage copy, FAQ, pricing, questions, tests, applications and local records all return to their shipped defaults."
        confirmLabel="Reset everything" tone="danger" />
    </div>
  );
}
