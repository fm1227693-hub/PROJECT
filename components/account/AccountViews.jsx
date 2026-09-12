"use client";

import { useState } from "react";
import { BadgeCheck, CreditCard, Download, ShieldCheck } from "lucide-react";

import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { PLANS } from "@/lib/data/plans";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Switch, Select } from "@/components/ui/Field";

const INVOICES = [
  { id: "inv_2026_09", date: "2026-09-06", amount: 12, status: "paid", description: "Student Pro · September" },
  { id: "inv_2026_08", date: "2026-08-06", amount: 12, status: "paid", description: "Student Pro · August" },
  { id: "inv_2026_07", date: "2026-07-06", amount: 12, status: "paid", description: "Student Pro · July" },
];

export function SettingsView() {
  const { settings, updateSettings, toast, user, resetDemo } = useApp();
  const [draft, setDraft] = useState(settings);

  const set = (path, value) => {
    setDraft((prev) => {
      const [group, key] = path.split(".");
      return { ...prev, [group]: { ...prev[group], [key]: value } };
    });
  };

  const save = () => {
    updateSettings(draft);
    toast("Settings saved. They apply immediately across every workspace.", { tone: "success", title: "Saved" });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Card className="p-5">
          <SectionHeading eyebrow="Study" title="How your week is planned." size="sm" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Select
              label="Weekly goal"
              id="st-goal"
              value={String(draft.study.weeklyGoalMinutes)}
              onChange={(value) => set("study.weeklyGoalMinutes", Number(value))}
              options={[{ value: "120", label: "2 hours / week" }, { value: "240", label: "4 hours / week" }, { value: "360", label: "6 hours / week" }]}
            />
            <Select
              label="Path preset"
              id="st-preset"
              value={draft.study.pathPreset}
              onChange={(value) => set("study.pathPreset", value)}
              options={[{ value: "light", label: "Light" }, { value: "balanced", label: "Balanced" }, { value: "intensive", label: "Intensive" }]}
            />
          </div>
        </Card>

        <Card className="p-5">
          <SectionHeading eyebrow="Notifications" title="What reaches your inbox." size="sm" />
          <ul className="mt-4 space-y-3">
            {[
              ["notifications.emailWeeklyReport", "Weekly progress report", "A Monday summary of movement per subject."],
              ["notifications.emailPathReminders", "Path reminders", "When a planned unit is overdue by three days."],
              ["notifications.teacherUpdates", "Teacher updates", "When a teacher assigns or comments."],
              ["notifications.productNews", "Product news", "Rare, and never marketing dressed as product."],
            ].map(([path, label, description]) => (
              <li key={path}>
                <Switch checked={draft.notifications[path.split(".")[1]]} onChange={(value) => set(path, value)} label={label} description={description} />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <SectionHeading eyebrow="Privacy" title="Who can see your results." size="sm" />
          <ul className="mt-4 space-y-3">
            {[
              ["privacy.shareWithTeacher", "Share with my teacher", "Topic scores and plans for classes you belong to."],
              ["privacy.shareWithSchool", "Share with school analytics", "Aggregated into year-group statistics."],
              ["privacy.publicProfile", "Public profile", "Off by default; enables certificate name display."],
              ["privacy.researchOptIn", "Research opt-in", "Anonymised item-level data for assessment research."],
            ].map(([path, label, description]) => (
              <li key={path}>
                <Switch checked={draft.privacy[path.split(".")[1]]} onChange={(value) => set(path, value)} label={label} description={description} />
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 rounded-md border border-line bg-canvas p-3 text-[12px] leading-relaxed text-muted">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-strong" aria-hidden="true" />
            This mirrors the commitments in the privacy policy — including permanent deletion on request.
          </p>
        </Card>

        <div className="flex justify-end">
          <Button size="md" onClick={save}>Save settings</Button>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <SectionHeading eyebrow="Account" title={user?.name ?? "Learner"} size="sm" />
          <p className="mt-2 text-[12.5px] text-muted">{user?.email}</p>
          <Button href="/student/profile" variant="secondary" size="sm" full className="mt-4">Edit profile</Button>
        </Card>
        <Card className="p-5">
          <SectionHeading eyebrow="Danger zone" title="Reset the demo" size="sm" />
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            Restores the demo learner, timeline and plan. Your local session data is replaced.
          </p>
          <Button
            variant="ghost"
            size="sm"
            full
            className="mt-4 text-risk"
            onClick={() => {
              resetDemo();
              toast("Demo data restored to the shipped baseline.", { tone: "info", title: "Reset complete" });
            }}
          >
            Reset demo data
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function BillingView() {
  const { subscription, updateSubscription, toast } = useApp();
  const plan = PLANS.find((p) => p.id === subscription?.planId) ?? PLANS[0];

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Billing</p>
            <h1 className="mt-2 font-display text-[26px] leading-tight tracking-[-0.026em] text-ink">
              {plan.name} plan · {subscription?.status}
            </h1>
            <p className="mt-2 text-[13.5px] text-muted">
              Renews {subscription?.renewsAt ? formatDate(subscription.renewsAt) : "—"} · {formatCurrency(plan.price.monthly ?? 0)} / month
            </p>
          </div>
          <Badge tone="strong" size="sm" dot><BadgeCheck className="size-3" aria-hidden="true" /> Active</Badge>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.filter((p) => p.price.monthly !== undefined).map((option) => {
            const current = option.id === subscription?.planId;
            return (
              <button
                key={option.id}
                type="button"
                disabled={current}
                onClick={() => {
                  updateSubscription({ planId: option.id });
                  toast(`Switched to ${option.name}. Prorated in this demo — no payment taken.`, { tone: "success", title: "Plan changed" });
                }}
                className={cn(
                  "card-lift rule-top relative overflow-hidden rounded-lg border p-4 text-left",
                  current ? "border-brand bg-brand-soft/50" : "border-line bg-canvas",
                )}
              >
                <p className="text-[13px] font-semibold text-ink">{option.name}</p>
                <p className="tnum mt-1 font-display text-[22px] leading-none text-ink">
                  {option.price.monthly === 0 ? "Free" : formatCurrency(option.price.monthly)}
                  <span className="ml-1 font-sans text-[11px] text-faint">/mo</span>
                </p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{current ? "Current plan" : option.tagline}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-[12px] text-muted">
          Placeholder pricing for the demo build. School plans are quoted per student —{" "}
          <a href="/contact" className="font-medium text-brand hover:underline">request a quote</a>.
        </p>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <SectionHeading eyebrow="Invoices" title="Payment history." size="sm" />
          <CreditCard className="size-4 text-faint" aria-hidden="true" />
        </div>
        <ul className="divide-y divide-line">
          {INVOICES.map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-ink">{invoice.description}</p>
                <p className="mt-0.5 text-[11.5px] text-muted">{formatDate(invoice.date)} · {invoice.id}</p>
              </div>
              <span className="tnum shrink-0 text-[13px] font-semibold text-ink">{formatCurrency(invoice.amount)}</span>
              <Badge tone="strong" size="xs">{invoice.status}</Badge>
              <Button variant="ghost" size="sm" onClick={() => toast(`Invoice ${invoice.id} would download as PDF in a live deployment.`, { tone: "info" })}>
                <Download className="size-3.5" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
