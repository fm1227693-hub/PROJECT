"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Minus, Sparkles } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { BILLING_CYCLES, PLAN_COMPARISON, PLANS } from "@/lib/data/plans";
import { Segmented } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useApp } from "@/lib/store/AppProvider";

/** Plan cards with a monthly / annual toggle. */
export function PricingPlans({ defaultCycle = "monthly" }) {
  const [cycle, setCycle] = useState(defaultCycle);
  const { subscription, toast } = useApp();

  const saving = useMemo(() => {
    const monthlyTotal = PLANS.reduce((acc, plan) => acc + (plan.price.monthly ?? 0), 0);
    const annualTotal = PLANS.reduce((acc, plan) => acc + (plan.price.annual ?? 0), 0);
    return monthlyTotal > 0 ? Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100) : 0;
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Segmented
          options={BILLING_CYCLES.map((option) => ({ value: option.id, label: option.label }))}
          value={cycle}
          onChange={setCycle}
          ariaLabel="Billing cycle"
        />
        {cycle === "annual" ? (
          <Badge tone="strong" size="sm" dot>
            Save about {saving}% — two months free
          </Badge>
        ) : (
          <p className="text-[12.5px] text-muted">{BILLING_CYCLES[0].note}</p>
        )}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3 xl:grid-cols-5">
        {PLANS.map((plan) => {
          const price = plan.price[cycle] ?? plan.price.monthly;
          const isCurrent = subscription?.planId === plan.id;

          return (
            <article
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-xl border bg-surface p-6 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:shadow-md",
                plan.featured ? "border-brand shadow-lg lg:-mt-3 lg:mb-3" : "border-line shadow-hairline",
                isCurrent && "ring-1 ring-brand/25",
                plan.id === "school" && "lg:col-span-1 xl:col-span-1",
              )}
            >
              {plan.featured ? (
                <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full border border-brand-line bg-brand px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-white">
                  <Sparkles className="size-3" aria-hidden="true" />
                  Most chosen
                </span>
              ) : null}

              {isCurrent ? (
                <span className="absolute -top-2.5 right-6 rounded-full border border-strong/25 bg-strong-soft px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-strong">
                  Your plan
                </span>
              ) : null}

              <p className="eyebrow">{plan.audience}</p>
              <h3 className="mt-2 font-display text-[24px] leading-none tracking-[-0.025em] text-ink">{plan.name}</h3>
              <p className="mt-2.5 min-h-[3.2em] text-[13px] leading-relaxed text-muted">{plan.tagline}</p>

              <div className="mt-4 border-y border-line py-4">
                <p className="flex items-baseline gap-1">
                  <span className="tnum font-display text-[38px] leading-none tracking-[-0.035em] text-ink">
                    {price === 0 ? "Free" : formatCurrency(price)}
                  </span>
                  {price > 0 ? (
                    <span className="text-[12.5px] text-muted">
                      / {plan.perStudent ? "student / " : ""}mo
                    </span>
                  ) : null}
                </p>
                <p className="mt-1.5 text-[11.5px] text-faint">
                  {cycle === "annual" && price > 0 ? "Billed annually" : "Billed monthly"}
                  {plan.quote ? " · volume quote available" : ""}
                </p>
              </div>

              <ul className="mt-4 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="mt-0.5 size-3.5 shrink-0 text-strong" aria-hidden="true" />
                    ) : (
                      <Minus className="mt-0.5 size-3.5 shrink-0 text-line-3" aria-hidden="true" />
                    )}
                    <span className={cn("text-[12.5px] leading-snug", feature.included ? "text-ink-soft" : "text-faint line-through decoration-line-3")}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                {plan.href.startsWith("/contact") ? (
                  <Button href={plan.href} variant="secondary" size="md" full>
                    {plan.cta}
                  </Button>
                ) : (
                  <Button
                    href={plan.href}
                    variant={plan.featured ? "primary" : "secondary"}
                    size="md"
                    full
                    onClick={() =>
                      toast(`${plan.name} plan selected. Billing is disabled in this demo build.`, {
                        tone: "info",
                        title: "Plan selected",
                      })
                    }
                  >
                    {isCurrent ? "Current plan" : plan.cta}
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href="#compare"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-4 text-[13px] font-medium text-ink transition-[transform,border-color] duration-200 hover:-translate-y-px hover:border-line-3"
        >
          Compare plans in detail
        </a>
      </div>

      <p className="mt-4 text-center text-[12.5px] text-muted">
        Prices are placeholders for this demo build. Schools are quoted per student;{" "}
        <Link href="/contact" className="font-medium text-brand hover:underline">
          request a quote
        </Link>
        .
      </p>
    </div>
  );
}

/** Full feature comparison matrix. */
export function ComparisonTable() {
  const columns = [
    { key: "free", label: "Free" },
    { key: "student", label: "Student" },
    { key: "pro", label: "Pro" },
    { key: "teacher", label: "Teacher" },
    { key: "school", label: "School" },
  ];

  const cell = (value) => {
    if (value === true) return <Check className="mx-auto size-4 text-strong" aria-label="Included" />;
    if (value === false || value === undefined) return <Minus className="mx-auto size-4 text-line-3" aria-label="Not included" />;
    return <span className="block text-center text-[12.5px] text-ink">{value}</span>;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="scroll-slim overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface-2">
              <th scope="col" className="w-[34%] px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-muted">
                Feature
              </th>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-3 py-3.5 text-center text-[12.5px] font-semibold text-ink">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          {PLAN_COMPARISON.map((group) => (
            <tbody key={group.group}>
              <tr className="border-b border-line bg-canvas">
                <th scope="colgroup" colSpan={columns.length + 1} className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-faint">
                  {group.group}
                </th>
              </tr>
              {group.rows.map((row, index) => (
                <tr
                  key={row.label}
                  className={cn("transition-colors hover:bg-surface-2", index !== group.rows.length - 1 && "border-b border-line/70")}
                >
                  <th scope="row" className="px-5 py-3 text-[13px] font-normal text-ink-soft">
                    {row.label}
                  </th>
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-3">
                      {cell(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
}
