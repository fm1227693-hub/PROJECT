"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  MailCheck,
  Presentation,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { cn, isEmail } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import Button from "@/components/ui/Button";
import { Field, Input, Checkbox, Select, Textarea } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";

const GRADE_OPTIONS = [
  { value: "5", label: "Grade 5 · age 10–11" },
  { value: "6", label: "Grade 6 · age 11–12" },
  { value: "7", label: "Grade 7 · age 12–13" },
  { value: "8", label: "Grade 8 · age 13–14" },
  { value: "9", label: "Grade 9 · age 14–15" },
  { value: "10", label: "Grade 10 · age 15–16" },
  { value: "11", label: "Grade 11 · age 16–17" },
  { value: "12", label: "Grade 12 · age 17–18" },
  { value: "adult", label: "Adult learner / university" },
];

const GOAL_OPTIONS = [
  { value: "exam", label: "Prepare for an exam (SAT, IELTS, national tests)" },
  { value: "grades", label: "Improve my school grades" },
  { value: "foundation", label: "Fix gaps and build a strong foundation" },
  { value: "enrichment", label: "Get ahead — enrichment and challenge" },
];

const SUBJECT_OPTIONS = [
  { value: "Mathematics", label: "Mathematics" },
  { value: "English", label: "English" },
  { value: "Mathematics & English", label: "Both Mathematics & English" },
  { value: "Other", label: "Other subject" },
];

const EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "Less than 1 year" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10+", label: "More than 10 years" },
];

/** Field's Select calls onChange(value) — wrap options with a placeholder. */
const withPlaceholder = (options, placeholder) => [
  { value: "", label: placeholder, disabled: true },
  ...options,
];

const LOGIN_ROLES = [
  { id: "student", label: "Student", home: "/student/dashboard" },
  { id: "teacher", label: "Teacher", home: "/teacher/dashboard" },
  { id: "school", label: "School admin", home: "/school/dashboard" },
];

function DemoNotice({ children }) {
  return (
    <p className="flex items-start gap-2 rounded-md border border-line bg-surface-2 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-muted">
      <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-developing" aria-hidden="true" />
      {children ?? (
        <>
          Demo authentication: no server, no password storage. Your session lives in this browser only and is
          structured exactly like a real API session so a backend can replace it later.
        </>
      )}
    </p>
  );
}

/* ------------------------------------------------------- register: choose ---- */

/** /register — two obvious account types, no guessing. */
export function RoleChooser() {
  const cards = [
    {
      id: "student",
      icon: GraduationCap,
      title: "I'm a Student",
      tagline: "Learn where you stand and what to do next",
      points: [
        "Take a 20–30 minute Math or English diagnostic",
        "Get a skill-by-skill analysis, not just a score",
        "Follow a personalized weekly learning path",
        "Track streaks, progress and certificates",
      ],
      cta: "Create student account",
      href: "/register/student",
      tone: "brand",
    },
    {
      id: "teacher",
      icon: Presentation,
      title: "I'm a Teacher",
      tagline: "See exactly where each student and class struggles",
      points: [
        "Create classes and add your students",
        "Assign diagnostics and homework with deadlines",
        "Class analytics: hard topics, struggling students",
        "Applications are reviewed before access is granted",
      ],
      cta: "Apply for a teacher account",
      href: "/register/teacher",
      tone: "accent",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">Create your account</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Choose how you will use Prisma. You can switch workspaces later if your role changes.
        </p>
      </header>

      <div className="grid gap-3">
        {cards.map((card) => (
          <Link
            key={card.id}
            href={card.href}
            className={cn(
              "card-lift group rounded-xl border bg-surface p-5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              card.tone === "brand" ? "border-brand-line hover:border-brand" : "border-accent-line hover:border-accent",
            )}
          >
            <div className="flex items-start gap-3.5">
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-lg border",
                  card.tone === "brand" ? "border-brand-line bg-brand-soft text-brand" : "border-accent-line bg-accent-soft text-accent",
                )}
              >
                <card.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold tracking-[-0.01em] text-ink">{card.title}</p>
                <p className="mt-0.5 text-[12.5px] text-muted">{card.tagline}</p>
              </div>
              <ArrowRight className="mt-1 size-4 shrink-0 text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
            </div>
            <ul className="mt-3.5 grid gap-1.5 border-t border-line pt-3.5">
              {card.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[12px] leading-relaxed text-ink-soft">
                  <CheckCircle2 className={cn("mt-0.5 size-3.5 shrink-0", card.tone === "brand" ? "text-brand" : "text-accent")} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <p className={cn("mt-3.5 text-[13px] font-semibold", card.tone === "brand" ? "text-brand" : "text-accent")}>
              {card.cta} →
            </p>
          </Link>
        ))}
      </div>

      <p className="text-center text-[12.5px] text-muted">
        Registering a whole school or organisation?{" "}
        <Link href="/register/school" className="font-medium text-ink-soft underline-offset-4 hover:text-brand hover:underline">
          School administrator registration →
        </Link>
      </p>

      <p className="text-center text-[12.5px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------ register: student ---- */

export function StudentRegisterForm() {
  const router = useRouter();
  const { signIn, completeOnboarding, toast } = useApp();
  const [values, setValues] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "", grade: "", goal: "", phone: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const setVal = (key) => (value) => setValues((v) => ({ ...v, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (values.firstName.trim().length < 2) next.firstName = "Enter your first name.";
    if (values.lastName.trim().length < 2) next.lastName = "Enter your last name.";
    if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 6) next.password = "Use at least 6 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords do not match.";
    if (!values.grade) next.grade = "Select your grade or age band.";
    if (!values.goal) next.goal = "Tell us your main goal.";
    if (values.phone && values.phone.replace(/\D/g, "").length < 7) next.phone = "That phone number looks too short.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setPending(true);
    const name = `${values.firstName.trim()} ${values.lastName.trim()}`;
    window.setTimeout(() => {
      signIn({ name, email: values.email, role: "student" });
      completeOnboarding({
        name,
        email: values.email,
        grade: values.grade === "adult" ? 13 : Number(values.grade),
        goal: values.goal,
      });
      toast("Student account created. Your dashboard is ready — start with the baseline diagnostic.", {
        tone: "success",
        title: `Welcome, ${values.firstName.trim()}`,
      });
      router.push("/student/dashboard");
    }, 500);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <header>
        <Badge tone="brand" size="sm" dot icon={GraduationCap}>Student account</Badge>
        <h1 className="mt-3 font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">
          Start learning with a plan
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Two minutes now, a personalized path for every week after. No card required.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" required error={errors.firstName} htmlFor="sr-first">
          <Input id="sr-first" autoComplete="given-name" placeholder="Amina" value={values.firstName} error={errors.firstName} onChange={set("firstName")} />
        </Field>
        <Field label="Last name" required error={errors.lastName} htmlFor="sr-last">
          <Input id="sr-last" autoComplete="family-name" placeholder="Karimova" value={values.lastName} error={errors.lastName} onChange={set("lastName")} />
        </Field>
      </div>

      <Field label="Email" required error={errors.email} htmlFor="sr-email">
        <Input id="sr-email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} error={errors.email} onChange={set("email")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" required error={errors.password} hint="At least 6 characters." htmlFor="sr-pass">
          <Input id="sr-pass" type="password" autoComplete="new-password" value={values.password} error={errors.password} onChange={set("password")} />
        </Field>
        <Field label="Confirm password" required error={errors.confirm} htmlFor="sr-confirm">
          <Input id="sr-confirm" type="password" autoComplete="new-password" value={values.confirm} error={errors.confirm} onChange={set("confirm")} />
        </Field>
      </div>

      <Field label="Grade / age band" required error={errors.grade} htmlFor="sr-grade">
        <Select id="sr-grade" value={values.grade} onChange={setVal("grade")} options={withPlaceholder(GRADE_OPTIONS, "Select your grade…")} />
      </Field>

      <Field label="Main goal" required error={errors.goal} htmlFor="sr-goal">
        <Select id="sr-goal" value={values.goal} onChange={setVal("goal")} options={withPlaceholder(GOAL_OPTIONS, "What do you want from Prisma?")} />
      </Field>

      <Field label="Phone" optional hint="For study reminders only. Never shared." error={errors.phone} htmlFor="sr-phone">
        <Input id="sr-phone" type="tel" autoComplete="tel" placeholder="+998 90 123 45 67" value={values.phone} error={errors.phone} onChange={set("phone")} />
      </Field>

      <div>
        <Checkbox checked={agree} onChange={setAgree} label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-brand hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="font-medium text-brand hover:underline">Privacy Policy</Link>.
          </>
        } />
        {errors.agree ? <p className="mt-1.5 text-[12px] text-risk">{errors.agree}</p> : null}
      </div>

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? "Creating your account…" : "Create my student account"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <DemoNotice />

      <p className="text-center text-[12.5px] text-muted">
        Not a student?{" "}
        <Link href="/register" className="font-medium text-brand hover:underline">Choose another account type</Link>
        {" · "}
        <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

/* ------------------------------------------------------ register: teacher ---- */

export function TeacherRegisterForm() {
  const router = useRouter();
  const { submitTeacherApplication, settings } = useApp();
  const applicationsOpen = settings?.platform?.teacherApplicationsOpen !== false;
  const [values, setValues] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "",
    subject: "", experience: "", institution: "", bio: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const set = (key) => (event) => setValues((v) => ({ ...v, [key]: event.target.value }));
  const setVal = (key) => (value) => setValues((v) => ({ ...v, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (values.firstName.trim().length < 2) next.firstName = "Enter your first name.";
    if (values.lastName.trim().length < 2) next.lastName = "Enter your last name.";
    if (!isEmail(values.email)) next.email = "Enter a valid email address — ideally your school email.";
    if (values.password.length < 6) next.password = "Use at least 6 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords do not match.";
    if (!values.subject) next.subject = "Select the subject you teach.";
    if (!values.experience) next.experience = "Select your teaching experience.";
    if (values.institution.trim().length < 2) next.institution = "Add your school, centre or 'Independent tutor'.";
    if (values.bio.trim().length < 30) next.bio = "Write at least 2–3 sentences (30+ characters) so reviewers can evaluate your application.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setPending(true);
    window.setTimeout(() => {
      submitTeacherApplication({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        subject: values.subject,
        experience: EXPERIENCE_OPTIONS.find((o) => o.value === values.experience)?.label ?? values.experience,
        institution: values.institution.trim(),
        bio: values.bio.trim(),
      });
      router.push("/pending-approval");
    }, 500);
  };

  if (!applicationsOpen) {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-developing/25 bg-developing-soft text-developing">
          <Presentation className="size-5" aria-hidden="true" />
        </span>
        <h1 className="font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">
          Teacher applications are temporarily closed
        </h1>
        <p className="text-[13.5px] leading-relaxed text-muted">
          Our administration team is working through the current review queue and is not accepting new teacher
          applications right now. Student registration remains open, and you can ask us to notify you when teacher
          onboarding reopens.
        </p>
        <div className="grid gap-2.5">
          <Button href="/contact" size="md" full>Ask to be notified when it reopens</Button>
          <Button href="/register" size="md" full variant="ghost">Choose another account type</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <header>
        <Badge tone="accent" size="sm" dot icon={Presentation}>Teacher application</Badge>
        <h1 className="mt-3 font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">
          Apply for a teacher workspace
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Teacher accounts are reviewed by our administration team before activation. You will see your application
          status the moment you submit — and we will notify you when a decision is made.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" required error={errors.firstName} htmlFor="tr-first">
          <Input id="tr-first" autoComplete="given-name" placeholder="Dilnoza" value={values.firstName} error={errors.firstName} onChange={set("firstName")} />
        </Field>
        <Field label="Last name" required error={errors.lastName} htmlFor="tr-last">
          <Input id="tr-last" autoComplete="family-name" placeholder="Saidova" value={values.lastName} error={errors.lastName} onChange={set("lastName")} />
        </Field>
      </div>

      <Field label="Work email" required error={errors.email} htmlFor="tr-email" hint="School email speeds up verification.">
        <Input id="tr-email" type="email" autoComplete="email" placeholder="you@school.org" value={values.email} error={errors.email} onChange={set("email")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" required error={errors.password} hint="At least 6 characters." htmlFor="tr-pass">
          <Input id="tr-pass" type="password" autoComplete="new-password" value={values.password} error={errors.password} onChange={set("password")} />
        </Field>
        <Field label="Confirm password" required error={errors.confirm} htmlFor="tr-confirm">
          <Input id="tr-confirm" type="password" autoComplete="new-password" value={values.confirm} error={errors.confirm} onChange={set("confirm")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Subject you teach" required error={errors.subject} htmlFor="tr-subject">
          <Select id="tr-subject" value={values.subject} onChange={setVal("subject")} options={withPlaceholder(SUBJECT_OPTIONS, "Select subject…")} />
        </Field>
        <Field label="Teaching experience" required error={errors.experience} htmlFor="tr-exp">
          <Select id="tr-exp" value={values.experience} onChange={setVal("experience")} options={withPlaceholder(EXPERIENCE_OPTIONS, "Select experience…")} />
        </Field>
      </div>

      <Field label="School or institution" required error={errors.institution} htmlFor="tr-inst">
        <Input id="tr-inst" autoComplete="organization" placeholder="Northgate International Academy" value={values.institution} error={errors.institution} onChange={set("institution")} />
      </Field>

      <Field label="About your teaching" required error={errors.bio} htmlFor="tr-bio"
        hint="What do you teach, who are your students, and how would you use diagnostics?">
        <Textarea id="tr-bio" rows={4} placeholder="I teach Grade 9–10 algebra at … and want objective gap data before each revision block…" value={values.bio} error={errors.bio} onChange={set("bio")} />
      </Field>

      <div>
        <Checkbox checked={agree} onChange={setAgree} label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-brand hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="font-medium text-brand hover:underline">Privacy Policy</Link>, and confirm
            the information above is accurate.
          </>
        } />
        {errors.agree ? <p className="mt-1.5 text-[12px] text-risk">{errors.agree}</p> : null}
      </div>

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? "Submitting application…" : "Submit teacher application"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <DemoNotice>
        Demo review flow: submit the form, then sign in as{" "}
        <Link href="/admin/login" className="font-medium text-brand hover:underline">Demo Admin</Link> to approve your
        own application under Teacher Applications — the full approval loop works locally.
      </DemoNotice>

      <p className="text-center text-[12.5px] text-muted">
        Not a teacher?{" "}
        <Link href="/register" className="font-medium text-brand hover:underline">Choose another account type</Link>
        {" · "}
        <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

/* -------------------------------------------- register: school (secondary) ---- */

export function SchoolRegisterForm() {
  const router = useRouter();
  const { signIn, toast } = useApp();
  const [values, setValues] = useState({ name: "", email: "", password: "", organisation: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (values.name.trim().length < 2) next.name = "Tell us what to call you.";
    if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 6) next.password = "Use at least 6 characters.";
    if (values.organisation.trim().length < 2) next.organisation = "Add your school or centre name.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    window.setTimeout(() => {
      signIn({ name: values.name, email: values.email, role: "school" });
      toast("School workspace created in this browser.", { tone: "success", title: "Welcome to Prisma" });
      router.push("/school/dashboard");
    }, 500);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <header>
        <Badge tone="info" size="sm" dot icon={Building}>School administrator</Badge>
        <h1 className="mt-3 font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">
          Register your organisation
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Organisation-wide analytics, teacher management and rollout reporting for schools and centres.
        </p>
      </header>

      <Field label="Contact name" required error={errors.name} htmlFor="sc-name">
        <Input id="sc-name" autoComplete="name" value={values.name} error={errors.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
      </Field>

      <Field label="Work email" required error={errors.email} htmlFor="sc-email">
        <Input id="sc-email" type="email" autoComplete="email" placeholder="admin@school.org" value={values.email} error={errors.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
      </Field>

      <Field label="School name" required error={errors.organisation} htmlFor="sc-org">
        <Input id="sc-org" autoComplete="organization" placeholder="Northgate International Academy" value={values.organisation} error={errors.organisation}
          onChange={(e) => setValues((v) => ({ ...v, organisation: e.target.value }))} />
      </Field>

      <Field label="Password" required error={errors.password} hint="At least 6 characters." htmlFor="sc-pass">
        <Input id="sc-pass" type="password" autoComplete="new-password" value={values.password} error={errors.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} />
      </Field>

      <div>
        <Checkbox checked={agree} onChange={setAgree} label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="font-medium text-brand hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="font-medium text-brand hover:underline">Privacy Policy</Link>.
          </>
        } />
        {errors.agree ? <p className="mt-1.5 text-[12px] text-risk">{errors.agree}</p> : null}
      </div>

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? "Creating workspace…" : "Create school workspace"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <DemoNotice />

      <p className="text-center text-[12.5px] text-muted">
        <Link href="/register" className="font-medium text-brand hover:underline">← Choose another account type</Link>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------- sign in ---- */

export function LoginForm() {
  const router = useRouter();
  const { signIn, signInDemo, teacherStatus } = useApp();
  const [values, setValues] = useState({ email: "amina@prisma.education", password: "demo-password", role: "student" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const homeFor = (role) => {
    if (role === "teacher") return teacherStatus === "approved" ? "/teacher/dashboard" : "/pending-approval";
    if (role === "admin") return "/admin";
    if (role === "school") return "/school/dashboard";
    return "/student/dashboard";
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!isEmail(values.email)) next.email = "Enter the email you registered with.";
    if (values.password.length < 6) next.password = "Passwords are at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    window.setTimeout(() => {
      if (values.role === "admin") {
        signInDemo("admin");
      } else {
        signIn({ email: values.email, role: values.role });
      }
      router.push(homeFor(values.role));
    }, 500);
  };

  const quickDemo = (role) => {
    signInDemo(role);
    router.push(homeFor(role));
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <header>
        <h1 className="font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">Welcome back</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          New here?{" "}
          <Link href="/register" className="font-medium text-brand hover:underline">
            Create an account
          </Link>{" "}
          — the first diagnostic is free.
        </p>
      </header>

      <Field label="I am signing in as" htmlFor="li-role" hint="Determines which workspace opens after sign-in.">
        <Select
          id="li-role"
          value={values.role}
          onChange={(value) => setValues((v) => ({ ...v, role: value }))}
          options={[
            { value: "student", label: "Student" },
            { value: "teacher", label: "Teacher" },
            { value: "school", label: "School administrator" },
            { value: "admin", label: "Platform administrator" },
          ]}
        />
      </Field>

      <Field label="Email" required error={errors.email} htmlFor="li-email">
        <Input id="li-email" type="email" autoComplete="email" value={values.email} error={errors.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
      </Field>

      <Field label="Password" required error={errors.password} htmlFor="li-pass">
        <Input id="li-pass" type="password" autoComplete="current-password" value={values.password} error={errors.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Checkbox checked={remember} onChange={setRemember} label="Remember me on this device" />
        <Link href="/forgot-password" className="text-[12.5px] font-medium text-brand hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? "Signing in…" : `Sign in as ${LOGIN_ROLES.find((r) => r.id === values.role)?.label ?? "administrator"}`}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <DemoNotice />

      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="eyebrow mb-3">Or continue with a demo account</p>
        <div className="grid gap-2">
          {[
            { id: "student", label: "Demo Student", icon: GraduationCap, description: "Amina Karimova · Grade 10 · full learning history", href: "/student/dashboard" },
            { id: "teacher", label: "Demo Teacher", icon: Presentation, description: "Ms. Adeyemi · approved · Class 10-B analytics", href: "/teacher/dashboard" },
            { id: "admin", label: "Demo Admin", icon: ShieldCheck, description: "Full platform control · 2 applications pending", href: "/admin" },
          ].map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => quickDemo(role.id)}
              className="card-lift flex items-center gap-3 rounded-md border border-line bg-canvas px-3.5 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-brand-line bg-brand-soft text-brand">
                <role.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-ink">{role.label}</span>
                <span className="block truncate text-[11.5px] text-muted">{role.description}</span>
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
            </button>
          ))}
          <Link
            href="/admin/login"
            className="flex items-center gap-2 rounded-md border border-dashed border-line px-3.5 py-2 text-[12px] font-medium text-muted transition-colors hover:border-brand hover:text-brand"
          >
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Administrator? Use the dedicated admin login →
          </Link>
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------ forgot / verify ---- */

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-strong/25 bg-strong-soft text-strong">
          <MailCheck className="size-5" aria-hidden="true" />
        </span>
        <h1 className="font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">Check your inbox</h1>
        <p className="text-[13.5px] leading-relaxed text-muted">
          If an account exists for <span className="font-semibold text-ink">{email}</span>, a reset link is on its way.
          The link expires in 30 minutes. In this demo build the email is simulated — use the button below to continue.
        </p>
        <div className="grid gap-2.5">
          <Button href="/login" size="md" full>Back to sign in</Button>
          <Button variant="ghost" size="md" full onClick={() => setSent(false)}>Use a different email</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!isEmail(email)) return setError("Enter the email on your account.");
        setError("");
        setSent(true);
      }}
    >
      <header>
        <span className="grid size-10 place-items-center rounded-lg border border-line bg-surface-2 text-brand">
          <KeyRound className="size-[18px]" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">Reset your password</h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Enter your account email and we will send a single-use reset link. We never send your password by email —
          nobody should, including us.
        </p>
      </header>

      <Field label="Email" required error={error} htmlFor="fp-email">
        <Input id="fp-email" type="email" autoComplete="email" placeholder="you@school.org" value={email} error={error}
          onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <Button type="submit" size="lg" full>Send reset link</Button>

      <p className="text-center text-[12.5px] text-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

export function VerifyEmailPanel() {
  const router = useRouter();
  const { user, toast } = useApp();
  const [state, setState] = useState("pending"); // pending | verifying | verified

  const verify = () => {
    setState("verifying");
    window.setTimeout(() => {
      setState("verified");
      toast("Email verified. Your account is fully active.", { tone: "success", title: "Verified" });
    }, 900);
  };

  return (
    <div className="space-y-5 text-center">
      <span className={cn("mx-auto grid size-12 place-items-center rounded-full border", state === "verified" ? "border-strong/25 bg-strong-soft text-strong" : "border-brand-line bg-brand-soft text-brand")}>
        <MailCheck className="size-5" aria-hidden="true" />
      </span>
      <h1 className="font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">
        {state === "verified" ? "Email verified" : "Verify your email"}
      </h1>
      <p className="text-[13.5px] leading-relaxed text-muted">
        {state === "verified"
          ? "You can now take diagnostics, receive reports by email and invite teachers to view your progress."
          : `We sent a six-character code to ${user?.email ?? "your inbox"}. Enter it below, or simulate the click in this demo build.`}
      </p>

      {state !== "verified" ? (
        <>
          <div className="flex justify-center gap-2" aria-label="Verification code">
            {Array.from({ length: 6 }, (_, i) => (
              <input
                key={i}
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${i + 1}`}
                className="tnum h-12 w-10 rounded-md border border-line bg-surface text-center font-mono text-[16px] text-ink transition-colors hover:border-line-2 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/15"
              />
            ))}
          </div>
          <Button size="lg" full onClick={verify} disabled={state === "verifying"}>
            {state === "verifying" ? "Verifying…" : "Verify email"}
          </Button>
          <Button variant="ghost" size="md" full onClick={() => toast("Code re-sent (simulated in this demo).", { tone: "info" })}>
            Resend code
          </Button>
        </>
      ) : (
        <Button size="lg" full onClick={() => router.push(user?.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard")}>
          Continue to my dashboard
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      )}

      <p className="flex items-center justify-center gap-1.5 text-[12px] text-faint">
        <Sparkles className="size-3.5" aria-hidden="true" />
        Demo build — codes are simulated, nothing is emailed.
      </p>
    </div>
  );
}
