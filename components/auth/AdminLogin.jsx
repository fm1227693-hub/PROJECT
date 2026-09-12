"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import { isEmail } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Field, Input, Checkbox } from "@/components/ui/Field";
import Logo from "@/components/brand/Logo";

/**
 * Dedicated administrator entrance — visually distinct from the student and
 * teacher login, and the only door into /admin/*.
 */
export default function AdminLogin() {
  const router = useRouter();
  const { signInDemo, toast } = useApp();
  const [values, setValues] = useState({ email: "admin@prisma.education", password: "demo-password" });
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!isEmail(values.email)) next.email = "Enter the administrator email.";
    if (values.password.length < 6) next.password = "Passwords are at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    window.setTimeout(() => {
      signInDemo("admin");
      router.push("/admin");
    }, 500);
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-[26rem]">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/" className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            <Logo compact suffix="Diagnostic Center" />
          </Link>
          <Link href="/login" className="flex items-center gap-1 text-[12px] font-medium text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-3.5" aria-hidden="true" /> Regular login
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_18px_50px_-24px_rgba(16,24,43,0.3)]">
          <div className="border-b border-line bg-ink px-6 py-5 text-center">
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-white/10 text-white" aria-hidden="true">
              <ShieldCheck className="size-5" />
            </span>
            <h1 className="mt-3 font-display text-[20px] leading-tight tracking-[-0.02em] text-white">Administration console</h1>
            <p className="mt-1 text-[12px] text-white/65">Restricted area — platform administrators only.</p>
          </div>

          <form onSubmit={submit} noValidate className="space-y-4 p-6">
            <Field label="Admin email" required error={errors.email} htmlFor="ad-email">
              <Input id="ad-email" type="email" autoComplete="username" value={values.email} error={errors.email}
                onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
            </Field>
            <Field label="Password" required error={errors.password} htmlFor="ad-pass">
              <Input id="ad-pass" type="password" autoComplete="current-password" value={values.password} error={errors.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))} />
            </Field>
            <Checkbox checked={remember} onChange={setRemember} label="Keep me signed in on this device" />
            <Button type="submit" size="md" full disabled={pending}>
              {pending ? "Verifying…" : "Enter admin console"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>

            <p className="flex items-start gap-2 rounded-md border border-line bg-surface-2 px-3 py-2.5 text-[11.5px] leading-relaxed text-muted">
              <Lock className="mt-0.5 size-3.5 shrink-0 text-faint" aria-hidden="true" />
              Demo credentials are pre-filled: <span className="font-mono">admin@prisma.education</span> · any password
              of 6+ characters. Student and teacher accounts cannot open this console.
            </p>

            <button
              type="button"
              onClick={() => { signInDemo("admin"); toast("Admin session started.", { tone: "info" }); router.push("/admin"); }}
              className="w-full rounded-md border border-dashed border-line px-3 py-2 text-[12px] font-medium text-brand transition-colors hover:border-brand hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              Continue instantly as Demo Admin →
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11.5px] text-faint">
          Not an administrator?{" "}
          <Link href="/register" className="font-medium text-muted underline-offset-4 hover:text-brand hover:underline">
            Create a student or teacher account
          </Link>
        </p>
      </div>
    </div>
  );
}
