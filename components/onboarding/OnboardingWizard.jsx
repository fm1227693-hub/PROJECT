"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Compass, CalendarClock, Gauge, Sparkles, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Field, Input, Select, RadioCard, Checkbox, Segmented } from "@/components/ui/Field";

const DRAFT_KEY = "prisma.onboarding.v1";

const STEPS = [
  { id: "profile", label: "Profile", href: "/onboarding/profile", icon: UserRound },
  { id: "goals", label: "Goals", href: "/onboarding/goals", icon: Compass },
  { id: "assessment", label: "Assessment", href: "/onboarding/assessment", icon: Gauge },
];

const DEFAULT_DRAFT = {
  name: "",
  email: "",
  grade: "10",
  organisation: "",
  goal: "exam",
  subjects: ["math", "english"],
  weeklyMinutes: "240",
  timed: "untimed",
  preset: "balanced",
};

function readDraft() {
  if (typeof window === "undefined") return DEFAULT_DRAFT;
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    return raw ? { ...DEFAULT_DRAFT, ...JSON.parse(raw) } : DEFAULT_DRAFT;
  } catch {
    return DEFAULT_DRAFT;
  }
}

function Stepper({ current }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);
  return (
    <ol className="flex items-center gap-2" aria-label="Onboarding progress">
      {STEPS.map((step, index) => {
        const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "todo";
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-medium transition-colors",
                state === "done" && "border-strong/30 bg-strong-soft text-strong",
                state === "current" && "border-brand bg-brand-soft text-brand",
                state === "todo" && "border-line bg-surface text-faint",
              )}
            >
              {state === "done" ? <Check className="size-3" aria-hidden="true" /> : <step.icon className="size-3" aria-hidden="true" />}
              {step.label}
            </span>
            {index < STEPS.length - 1 ? <span className="h-px w-4 bg-line-2" aria-hidden="true" /> : null}
          </li>
        );
      })}
    </ol>
  );
}

function Shell({ step, title, subtitle, children, footer }) {
  return (
    <div className="w-full max-w-xl">
      <Stepper current={step} />
      <h1 className="mt-6 font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">{title}</h1>
      <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{subtitle}</p>
      <div className="mt-7">{children}</div>
      <div className="mt-8">{footer}</div>
    </div>
  );
}

/* ------------------------------------------------------------- welcome ---- */

export function OnboardingStart() {
  const router = useRouter();
  const { user, status } = useApp();

  const cards = [
    { icon: UserRound, title: "Your profile", body: "Name, year group and — if you have one — your school." },
    { icon: Compass, title: "Your goals", body: "What you are studying for, and how many minutes a week you really have." },
    { icon: Gauge, title: "Assessment preferences", body: "Timed or untimed, and how intensive your learning path should be." },
  ];

  return (
    <div className="w-full max-w-xl">
      <Badge tone="brand" size="sm" dot>Setup · about 90 seconds</Badge>
      <h1 className="mt-4 font-display text-[30px] leading-tight tracking-[-0.028em] text-ink">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}. Let's calibrate Prisma to you.
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-muted">
        Three short steps. Nothing here is a test — it only decides which questions you see first and how your
        learning path is packed into your week.
      </p>

      <ol className="mt-8 space-y-3">
        {cards.map((card, index) => (
          <li key={card.title} className="flex items-start gap-4 rounded-lg border border-line bg-surface p-4">
            <span className="tnum grid size-8 shrink-0 place-items-center rounded-md border border-brand-line bg-brand-soft font-mono text-[11px] text-brand">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-[14px] font-semibold text-ink">{card.title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{card.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <Button size="lg" onClick={() => router.push("/onboarding/profile")}>
          Start setup
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
        <Button size="lg" variant="ghost" onClick={() => router.push("/student/dashboard")}>
          Skip for now
        </Button>
      </div>
      <p className="mt-4 text-[12px] text-faint">
        Signed in as {user?.email}. {status === "anonymous" ? "Demo session." : ""} You can change all of this later in Settings.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- profile ---- */

export function OnboardingProfile() {
  const router = useRouter();
  const { user } = useApp();
  const [draft, setDraft] = useState(() => ({ ...readDraft(), name: user?.name ?? "", email: user?.email ?? "" }));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const next = () => {
    const nextErrors = {};
    if (draft.name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (!draft.email.includes("@")) nextErrors.email = "Enter a valid email.";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) router.push("/onboarding/goals");
  };

  return (
    <Shell
      step="profile"
      title="Who is learning?"
      subtitle="Used to address you, place your baseline against your year group, and label your reports."
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" href="/onboarding">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button size="md" onClick={next}>
            Continue to goals
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <div className="space-y-4 rounded-lg border border-line bg-surface p-5">
        <Field label="Full name" required error={errors.name} htmlFor="ob-name">
          <Input id="ob-name" value={draft.name} error={errors.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
        </Field>
        <Field label="Email" required error={errors.email} htmlFor="ob-email">
          <Input id="ob-email" type="email" value={draft.email} error={errors.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Year group / grade"
            id="ob-grade"
            value={draft.grade}
            onChange={(value) => setDraft((d) => ({ ...d, grade: value }))}
            options={["6", "7", "8", "9", "10", "11", "12", "Adult learner"].map((g) => ({ value: g, label: g === "Adult learner" ? g : `Grade ${g}` }))}
          />
          <Field label="School or centre" optional hint="Leave empty if you study independently." htmlFor="ob-org">
            <Input id="ob-org" value={draft.organisation} placeholder="Northgate International Academy" onChange={(e) => setDraft((d) => ({ ...d, organisation: e.target.value }))} />
          </Field>
        </div>
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- goals ---- */

const GOALS = [
  { value: "exam", title: "Exam preparation", description: "National exams, SAT/GCSE-style papers, entrance tests." },
  { value: "catchup", title: "Catch up", description: "Close gaps from missed schooling or a difficult year." },
  { value: "enrich", title: "Get ahead", description: "I am comfortable and want to be challenged further." },
  { value: "general", title: "General improvement", description: "No specific exam — I want a clear picture and a plan." },
];

export function OnboardingGoals() {
  const router = useRouter();
  const [draft, setDraft] = useState(readDraft);
  const [error, setError] = useState("");

  useEffect(() => {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const toggleSubject = (subject) => {
    setDraft((d) => {
      const has = d.subjects.includes(subject);
      const subjects = has ? d.subjects.filter((s) => s !== subject) : [...d.subjects, subject];
      return { ...d, subjects };
    });
  };

  const next = () => {
    if (!draft.subjects.length) return setError("Choose at least one subject.");
    setError("");
    router.push("/onboarding/assessment");
  };

  return (
    <Shell
      step="goals"
      title="What are you working towards?"
      subtitle="This changes which topics the path prioritises and how explanations are framed — not which skills are measured."
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" href="/onboarding/profile">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button size="md" onClick={next}>
            Continue to assessment
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Learning goal">
          {GOALS.map((goal) => (
            <RadioCard
              key={goal.value}
              selected={draft.goal === goal.value}
              onSelect={() => setDraft((d) => ({ ...d, goal: goal.value }))}
              title={goal.title}
              description={goal.description}
              name="goal"
              value={goal.value}
            />
          ))}
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="eyebrow mb-3">Subjects</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Checkbox checked={draft.subjects.includes("math")} onChange={() => toggleSubject("math")} label="Mathematics" description="Arithmetic · Algebra · Geometry" />
            <Checkbox checked={draft.subjects.includes("english")} onChange={() => toggleSubject("english")} label="English" description="Grammar · Vocabulary · Reading · Listening" />
          </div>
          {error ? <p className="mt-2 text-[12px] text-risk">{error}</p> : null}
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <CalendarClock className="size-4 text-brand" aria-hidden="true" />
              Realistic weekly study time
            </p>
            <Segmented
              size="sm"
              ariaLabel="Weekly minutes"
              options={[
                { value: "120", label: "2 h" },
                { value: "240", label: "4 h" },
                { value: "360", label: "6 h" },
              ]}
              value={draft.weeklyMinutes}
              onChange={(value) => setDraft((d) => ({ ...d, weeklyMinutes: value }))}
            />
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            The path packs its units into weeks of this size. An honest number beats an ambitious one — plans that fit
            your timetable are plans that finish.
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* ---------------------------------------------------------- assessment ---- */

export function OnboardingAssessment() {
  const router = useRouter();
  const { completeOnboarding, generatePath, toast } = useApp();
  const [draft, setDraft] = useState(readDraft);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft]);

  const finish = () => {
    setPending(true);
    window.setTimeout(() => {
      completeOnboarding({
        name: draft.name,
        email: draft.email,
        grade: draft.grade,
        goal: draft.goal,
        weeklyMinutes: draft.weeklyMinutes,
        preset: draft.preset,
      });
      generatePath({ weeklyMinutes: Number(draft.weeklyMinutes) });
      window.sessionStorage.removeItem(DRAFT_KEY);
      toast("Setup complete. Your baseline diagnostic is ready when you are.", { tone: "success", title: "You're set up" });
      router.push("/student/diagnostic/start");
    }, 600);
  };

  return (
    <Shell
      step="assessment"
      title="How should we measure you?"
      subtitle="Last step. These preferences apply to your first diagnostic and can be changed per attempt later."
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="md" href="/onboarding/goals">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
          <Button size="lg" onClick={finish} disabled={pending}>
            {pending ? "Finishing setup…" : "Finish setup"}
            <Sparkles className="size-4" aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="eyebrow mb-3">Test conditions</p>
          <div className="grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Test conditions">
            <RadioCard
              selected={draft.timed === "untimed"}
              onSelect={() => setDraft((d) => ({ ...d, timed: "untimed" }))}
              title="Untimed"
              description="Recommended for a first baseline. Think as long as you need."
              name="timed"
              value="untimed"
            />
            <RadioCard
              selected={draft.timed === "timed"}
              onSelect={() => setDraft((d) => ({ ...d, timed: "timed" }))}
              title="Timed (26 min)"
              description="Exam conditions. The timer is part of the measurement."
              name="timed"
              value="timed"
            />
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="eyebrow mb-3">Path intensity</p>
          <div className="grid gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Path intensity">
            {[
              { value: "light", title: "Light", description: "Fewer, shorter units per week." },
              { value: "balanced", title: "Balanced", description: "The default mix of study and practice." },
              { value: "intensive", title: "Intensive", description: "Maximum coverage before a deadline." },
            ].map((preset) => (
              <RadioCard
                key={preset.value}
                selected={draft.preset === preset.value}
                onSelect={() => setDraft((d) => ({ ...d, preset: preset.value }))}
                title={preset.title}
                description={preset.description}
                name="preset"
                value={preset.value}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-brand-line bg-brand-soft/60 p-5">
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            <Sparkles className="size-4 text-brand" aria-hidden="true" />
            What happens next
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">
            You'll take a 30-question diagnostic ({draft.subjects.includes("math") && draft.subjects.includes("english") ? "Mathematics + English" : draft.subjects.includes("math") ? "Mathematics" : "English"}),
            see your topic-level report, and get a generated path packed into {Number(draft.weeklyMinutes) / 60}-hour weeks.
          </p>
          <Link href="/sample-report" className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline">
            Preview an example report first →
          </Link>
        </div>
      </div>
    </Shell>
  );
}
