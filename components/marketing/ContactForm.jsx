"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Send } from "lucide-react";

import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { isEmail } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";

const REASONS = [
  { value: "school", label: "School or centre rollout" },
  { value: "teacher", label: "Teacher or tutor plan" },
  { value: "student", label: "Student account question" },
  { value: "report", label: "Question about a diagnostic report" },
  { value: "billing", label: "Billing or invoices" },
  { value: "other", label: "Something else" },
];

export default function ContactForm() {
  const router = useRouter();
  const { toast } = useApp();
  const [values, setValues] = useState({ name: "", email: "", organisation: "", reason: "school", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);

  const update = (key) => (event) => setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!isEmail(values.email)) next.email = "Enter a valid email address so we can reply.";
    if (values.message.trim().length < 20) next.message = "A little more detail helps us answer properly — at least 20 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setPending(true);
    // Demo build: no backend. Simulate the round trip, then confirm.
    window.setTimeout(() => {
      setPending(false);
      setSubmitted(true);
      toast("Your message is queued. In a live deployment this reaches support@prisma.education.", {
        tone: "success",
        title: "Message sent",
      });
    }, 700);
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-strong/25 bg-strong-soft/50 p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-strong/25 bg-surface text-strong">
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-[21px] leading-snug text-ink">Message received</h2>
        <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink-soft">
          Thank you, {values.name.split(" ")[0]}. We reply within one working day — usually much sooner for school
          enquiries. A copy has been sent to {values.email}.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => router.push("/pricing")}>
            Back to pricing
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setValues({ name: "", email: "", organisation: "", reason: "school", message: "" });
            }}
          >
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-lg border border-line bg-surface p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required error={errors.name} htmlFor="cf-name">
          <Input id="cf-name" value={values.name} onChange={update("name")} placeholder="Alex Mercer" autoComplete="name" error={errors.name} />
        </Field>
        <Field label="Email" required error={errors.email} htmlFor="cf-email">
          <Input id="cf-email" type="email" value={values.email} onChange={update("email")} placeholder="you@school.org" autoComplete="email" error={errors.email} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="School or organisation" optional htmlFor="cf-org">
          <Input id="cf-org" value={values.organisation} onChange={update("organisation")} placeholder="Northgate International Academy" autoComplete="organization" />
        </Field>
        <Select label="What is this about?" id="cf-reason" value={values.reason} options={REASONS} onChange={(value) => setValues((prev) => ({ ...prev, reason: value }))} />
      </div>

      <div className="mt-4">
        <Field label="Message" required error={errors.message} hint="Include year groups, student numbers or the report you are asking about — it lets us answer properly the first time." htmlFor="cf-message">
          <Textarea
            id="cf-message"
            rows={6}
            value={values.message}
            onChange={update("message")}
            placeholder="We have 340 students across Grades 9–11 and would like to run a baseline diagnostic in October…"
            error={errors.message}
          />
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
        <p className="max-w-xs text-[11.5px] leading-relaxed text-faint">
          We use this information only to answer your enquiry. It is never added to a marketing list.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-ink bg-ink px-5 text-[14px] font-medium text-canvas shadow-xs transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-ink-2 disabled:pointer-events-none disabled:opacity-60"
        >
          <Send className="size-4" aria-hidden="true" />
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
