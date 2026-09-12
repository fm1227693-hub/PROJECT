"use client";

import Link from "next/link";
import { ArrowRight, Clock3, FileCheck2, Mail, ShieldCheck, XCircle, CheckCircle2, LogOut, Presentation } from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * Shown to teachers between application and admin decision. Role-gated areas
 * (/teacher/*) redirect here while `teacherStatus` is pending or rejected.
 */

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-0">
      <dt className="shrink-0 text-[11.5px] font-medium uppercase tracking-[0.08em] text-faint">{label}</dt>
      <dd className="min-w-0 text-right text-[12.5px] font-medium text-ink">{value || "—"}</dd>
    </div>
  );
}

function Timeline({ status }) {
  const steps = [
    { key: "submitted", label: "Application submitted", done: true },
    { key: "review", label: "Administration review", done: status !== "pending" },
    { key: "decision", label: status === "rejected" ? "Application rejected" : "Workspace activated", done: status === "approved" || status === "rejected" },
  ];
  return (
    <ol className="space-y-0" aria-label="Application progress">
      {steps.map((step, index) => {
        const rejectedStep = step.key === "decision" && status === "rejected";
        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center" aria-hidden="true">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full border text-[11px] font-bold",
                  rejectedStep
                    ? "border-risk/30 bg-risk-soft text-risk"
                    : step.done
                      ? "border-strong/30 bg-strong-soft text-strong"
                      : "border-line-2 bg-surface-2 text-faint",
                )}
              >
                {rejectedStep ? <XCircle className="size-3.5" /> : step.done ? <CheckCircle2 className="size-3.5" /> : index + 1}
              </span>
              {index < steps.length - 1 ? <span className={cn("w-px flex-1", step.done ? "bg-strong/25" : "bg-line")} /> : null}
            </div>
            <div className={cn("pb-5", index === steps.length - 1 && "pb-0")}>
              <p className={cn("text-[13px] font-semibold", rejectedStep ? "text-risk" : step.done ? "text-ink" : "text-muted")}>{step.label}</p>
              {step.key === "review" && status === "pending" ? (
                <p className="mt-0.5 text-[11.5px] text-muted">Typically within 1–2 working days.</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function PendingApproval() {
  const { user, teacherStatus, applications, signOut, hydrated } = useApp();

  if (!hydrated) {
    return (
      <div className="grid min-h-[50dvh] place-items-center" role="status" aria-live="polite">
        <p className="text-[13px] text-muted">Loading your application status…</p>
      </div>
    );
  }

  const application =
    applications.find((item) => item.email === user?.email) ??
    applications.find((item) => item.status === "pending") ??
    null;

  const status = application?.status ?? (teacherStatus === "approved" ? "approved" : teacherStatus);

  if (status === "approved") {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-strong/25 bg-strong-soft text-strong">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <h1 className="font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">Application approved</h1>
        <p className="text-[13.5px] leading-relaxed text-muted">
          The administration team has activated your teacher workspace. Your classes, assignments and analytics are
          ready.
        </p>
        <Button href="/teacher/dashboard" size="lg" full>
          Open my teacher dashboard <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="space-y-5">
        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full border border-risk/25 bg-risk-soft text-risk">
            <XCircle className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">
            Application not approved
          </h1>
          <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
            After review, we could not activate this teacher application.
          </p>
        </div>

        {application?.rejectionReason ? (
          <div className="rounded-lg border border-risk/25 bg-risk-soft/60 p-4">
            <p className="eyebrow text-risk">Reason given by the reviewer</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{application.rejectionReason}</p>
          </div>
        ) : null}

        <div className="grid gap-2.5">
          <Button href="/contact" size="md" full variant="outline">
            <Mail className="size-4" aria-hidden="true" /> Contact the review team
          </Button>
          <Button size="md" full variant="ghost" onClick={signOut}>
            <LogOut className="size-4" aria-hidden="true" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  /* pending (default) */
  return (
    <div className="space-y-5">
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full border border-developing/25 bg-developing-soft text-developing">
          <Clock3 className="size-5" aria-hidden="true" />
        </span>
        <Badge tone="developing" size="sm" className="mt-4" dot>
          Pending review
        </Badge>
        <h1 className="mt-3 font-display text-[26px] leading-tight tracking-[-0.028em] text-ink">
          Application submitted — thank you
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">
          Your teacher application is with our administration team. Teacher workspaces stay locked until an
          administrator approves them — you will see the decision on this page.
        </p>
      </div>

      <div className="rounded-lg border border-line bg-surface p-4">
        <Timeline status="pending" />
      </div>

      {application ? (
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="eyebrow mb-1">Your application</p>
          <dl>
            <Row label="Name" value={`${application.firstName} ${application.lastName}`} />
            <Row label="Email" value={application.email} />
            <Row label="Subject" value={application.subject} />
            <Row label="Experience" value={application.experience} />
            <Row label="Institution" value={application.institution} />
            <Row label="Submitted" value={application.submittedAt} />
          </dl>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-line bg-surface-2 p-4 text-center">
          <Presentation className="mx-auto size-5 text-faint" aria-hidden="true" />
          <p className="mt-2 text-[12.5px] text-muted">
            No application found in this browser yet.{" "}
            <Link href="/register/teacher" className="font-medium text-brand hover:underline">
              Submit a teacher application →
            </Link>
          </p>
        </div>
      )}

      <div className="rounded-lg border border-line bg-surface-2 p-4 text-[12px] leading-relaxed text-muted">
        <p className="flex items-start gap-2">
          <FileCheck2 className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-ink">Testing the review loop?</strong> Open the{" "}
            <Link href="/admin/login" className="font-medium text-brand hover:underline">admin console</Link>, go to{" "}
            <Link href="/admin/teacher-applications" className="font-medium text-brand hover:underline">
              Teacher Applications
            </Link>{" "}
            and approve or reject this application — this page updates to the decision immediately.
          </span>
        </p>
      </div>

      <Button size="md" full variant="ghost" onClick={signOut}>
        <LogOut className="size-4" aria-hidden="true" /> Sign out
      </Button>
    </div>
  );
}
