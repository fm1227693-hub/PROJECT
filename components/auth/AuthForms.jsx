"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building, CheckCircle2, GraduationCap, KeyRound, MailCheck, Presentation, ShieldAlert, Sparkles } from "lucide-react";

import { cn, isEmail } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import Button from "@/components/ui/Button";
import { Field, Input, Checkbox } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";

const ROLES = [
  {
    id: "student",
    label: "Student",
    icon: GraduationCap,
    description: "Take diagnostics, get a learning path, track improvement.",
    href: "/register/student",
  },
  {
    id: "teacher",
    label: "Teacher or tutor",
    icon: Presentation,
    description: "Assign diagnostics and see exactly where each class struggles.",
    href: "/register/teacher",
  },
  {
    id: "school",
    label: "School admin",
    icon: Building,
    description: "Organisation analytics, rollouts and role-based access.",
    href: "/register/school",
  },
];

function DemoNotice() {
  return (
    <p className="flex items-start gap-2 rounded-md border border-line bg-surface-2 px-3.5 py-2.5 text-[11.5px] leading-relaxed text-muted">
      <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-developing" aria-hidden="true" />
      Demo authentication: no server, no password storage. Your session lives in this browser only and is structured
      exactly like a real API session so a backend can replace it later.
    </p>
  );
}

/* ------------------------------------------------------------- sign in ---- */

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useApp();
  const [values, setValues] = useState({ email: "amina@prisma.education", password: "demo-password" });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!isEmail(values.email)) next.email = "Enter the email you registered with.";
    if (values.password.length < 6) next.password = "Passwords are at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    window.setTimeout(() => {
      signIn({ email: values.email, role: "student" });
      router.push("/student/dashboard");
    }, 500);
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

      <Field label="Email" required error={errors.email} htmlFor="li-email">
        <Input id="li-email" type="email" autoComplete="email" value={values.email} error={errors.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
      </Field>

      <Field label="Password" required error={errors.password} htmlFor="li-pass"
        hint={<Link href="/forgot-password" className="font-medium text-brand hover:underline">Forgot password?</Link>}>
        <Input id="li-pass" type="password" autoComplete="current-password" value={values.password} error={errors.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} />
      </Field>

      <Button type="submit" size="lg" full disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <DemoNotice />

      <div className="rounded-lg border border-line bg-surface p-4">
        <p className="eyebrow mb-3">Or continue with a demo role</p>
        <div className="grid gap-2">
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => {
                signIn({ role: role.id, name: role.id === "student" ? undefined : role.id === "teacher" ? "Dilnoza Saidova" : "Northgate Admin" });
                router.push(role.id === "student" ? "/student/dashboard" : role.id === "teacher" ? "/teacher/dashboard" : "/school/dashboard");
              }}
              className="card-lift flex items-center gap-3 rounded-md border border-line bg-canvas px-3.5 py-2.5 text-left"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-brand-line bg-brand-soft text-brand">
                <role.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-ink">{role.label} workspace</span>
                <span className="block truncate text-[11.5px] text-muted">{role.description}</span>
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------ register ---- */

export function RegisterForm({ role = "student" }) {
  const router = useRouter();
  const { signIn, toast } = useApp();
  const active = ROLES.find((item) => item.id === role) ?? ROLES[0];
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
    if (role !== "student" && values.organisation.trim().length < 2) next.organisation = "Add your school or centre name.";
    if (!agree) next.agree = "Please accept the terms to continue.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    window.setTimeout(() => {
      signIn({ name: values.name, email: values.email, role });
      toast("Account created in this browser. Next: a 90-second setup.", { tone: "success", title: "Welcome to Prisma" });
      router.push("/onboarding");
    }, 500);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <header>
        <Badge tone={role === "student" ? "brand" : role === "teacher" ? "accent" : "info"} size="sm" dot>
          {active.label}
        </Badge>
        <h1 className="mt-3 font-display text-[28px] leading-tight tracking-[-0.028em] text-ink">
          Create your {active.label.toLowerCase()} account
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{active.description}</p>
      </header>

      <div className="grid gap-1.5" role="radiogroup" aria-label="Account type">
        {ROLES.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            role="radio"
            aria-checked={item.id === role}
            className={cn(
              "flex items-center gap-2.5 rounded-md border px-3 py-2 text-[12.5px] font-medium transition-colors duration-200",
              item.id === role ? "border-brand bg-brand-soft text-brand" : "border-line bg-surface text-muted hover:border-line-3 hover:text-ink",
            )}
          >
            <item.icon className="size-3.5" aria-hidden="true" />
            {item.label}
            {item.id === role ? <CheckCircle2 className="ml-auto size-3.5" aria-hidden="true" /> : null}
          </Link>
        ))}
      </div>

      <Field label="Full name" required error={errors.name} htmlFor="rg-name">
        <Input id="rg-name" autoComplete="name" placeholder={role === "school" ? "Full name" : "e.g. Amina Karimova"} value={values.name} error={errors.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
      </Field>

      <Field label="Email" required error={errors.email} htmlFor="rg-email">
        <Input id="rg-email" type="email" autoComplete="email" placeholder="you@school.org" value={values.email} error={errors.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
      </Field>

      {role !== "student" ? (
        <Field label={role === "school" ? "School name" : "School or centre"} required error={errors.organisation} htmlFor="rg-org">
          <Input id="rg-org" autoComplete="organization" placeholder="Northgate International Academy" value={values.organisation} error={errors.organisation}
            onChange={(e) => setValues((v) => ({ ...v, organisation: e.target.value }))} />
        </Field>
      ) : null}

      <Field label="Password" required error={errors.password} hint="At least 6 characters." htmlFor="rg-pass">
        <Input id="rg-pass" type="password" autoComplete="new-password" value={values.password} error={errors.password}
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
        {pending ? "Creating account…" : "Create account"}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <DemoNotice />

      <p className="text-center text-[12.5px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
      </p>
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
  const [state, setState] = useState("pending"); // pending | verified

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
        <Button size="lg" full onClick={() => router.push("/student/dashboard")}>
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
