"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/States";
import Button from "@/components/ui/Button";

/* ------------------------------------------------------------ header ---- */

export function AdminHeader({ eyebrow = "Admin console", title, description, actions }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[22px] leading-tight tracking-[-0.024em] text-ink sm:text-[24px]">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* ---------------------------------------------------------- stat tile ---- */

export function StatTile({ label, value, sub, icon: Icon, tone = "brand", className }) {
  const tones = {
    brand: "border-brand-line bg-brand-soft text-brand",
    accent: "border-accent-line bg-accent-soft text-accent",
    strong: "border-strong/25 bg-strong-soft text-strong",
    developing: "border-developing/25 bg-developing-soft text-developing",
    risk: "border-risk/25 bg-risk-soft text-risk",
    neutral: "border-line bg-surface-2 text-ink-soft",
  };
  return (
    <div className={cn("rounded-lg border border-line bg-surface p-3.5", className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.09em] text-faint">{label}</p>
        {Icon ? (
          <span className={cn("grid size-7 shrink-0 place-items-center rounded-md border", tones[tone] ?? tones.brand)}>
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="tnum mt-1.5 font-display text-[24px] leading-none tracking-[-0.02em] text-ink">{value}</p>
      {sub ? <p className="mt-1.5 text-[11.5px] leading-snug text-muted">{sub}</p> : null}
    </div>
  );
}

/* --------------------------------------------------------- status pill ---- */

const PILL = {
  pending: "bg-developing-soft text-developing border-developing/25",
  review: "bg-developing-soft text-developing border-developing/25",
  approved: "bg-strong-soft text-strong border-strong/25",
  active: "bg-strong-soft text-strong border-strong/25",
  published: "bg-strong-soft text-strong border-strong/25",
  open: "bg-brand-soft text-brand border-brand-line",
  completed: "bg-info-soft text-info border-info/25",
  rejected: "bg-risk-soft text-risk border-risk/25",
  suspended: "bg-risk-soft text-risk border-risk/25",
  closed: "bg-surface-3 text-muted border-line-2",
  draft: "bg-surface-3 text-muted border-line-2",
  overdue: "bg-risk-soft text-risk border-risk/25",
  "on-leave": "bg-surface-3 text-muted border-line-2",
  anonymous: "bg-surface-3 text-muted border-line-2",
};

export function StatusPill({ status, className }) {
  return (
    <span className={cn("inline-flex h-5.5 items-center rounded-full border px-2 text-[10.5px] font-semibold capitalize", PILL[status] ?? PILL.draft, className)}>
      {status}
    </span>
  );
}

/* -------------------------------------------------------------- tools ---- */

export function Toolbar({ children, className }) {
  return <div className={cn("mb-3 flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

export function SearchInput({ value, onChange, placeholder = "Search…", className, id }) {
  return (
    <div className={cn("relative min-w-[180px] flex-1 sm:max-w-xs", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-8.5 w-full rounded-md border border-line bg-surface pl-8 pr-3 text-[12.5px] text-ink transition-colors placeholder:text-faint hover:border-line-2 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/15"
      />
    </div>
  );
}

export function FilterSelect({ value, onChange, options, label, id }) {
  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-8.5 rounded-md border border-line bg-surface px-2.5 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-line-2 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/15"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}

/* --------------------------------------------------------------- table ---- */

/**
 * Enterprise data table: real <table> on md+, stacked cards below.
 * columns: { key, label, render?(row), align?, width?, mono? }
 */
export function DataTable({ columns, rows, keyFor, empty, rowHref, onRowClick, className, dense = true }) {
  if (!rows.length) {
    return empty ?? <EmptyState title="Nothing here yet" description="Records created in this workspace will appear in this table." />;
  }
  return (
    <div className={cn("overflow-hidden rounded-lg border border-line bg-surface", className)}>
      {/* desktop */}
      <div className="scroll-slim hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-surface-2/70">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-3 py-2 text-[10.5px] font-bold uppercase tracking-[0.1em] text-faint",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row, rowIndex) => {
              const key = keyFor ? keyFor(row, rowIndex) : rowIndex;
              const Tag = onRowClick || rowHref ? "tr" : "tr";
              return (
                <Tag
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "transition-colors hover:bg-surface-2/60",
                    (onRowClick || rowHref) && "cursor-pointer",
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-3 text-[12.5px] text-ink-soft",
                        dense ? "py-2" : "py-2.5",
                        col.mono && "font-mono text-[11.5px]",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.width,
                      )}
                    >
                      {col.render ? col.render(row, rowIndex) : row[col.key]}
                    </td>
                  ))}
                </Tag>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <ul className="divide-y divide-line md:hidden">
        {rows.map((row, rowIndex) => {
          const key = keyFor ? keyFor(row, rowIndex) : rowIndex;
          return (
            <li
              key={key}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn("px-3.5 py-3", (onRowClick || rowHref) && "cursor-pointer active:bg-surface-2")}
            >
              {columns.map((col) => (
                <div key={col.key} className={cn("flex items-baseline justify-between gap-3 py-0.5", col.hideMobile && "hidden")}>
                  <span className="shrink-0 text-[10.5px] font-bold uppercase tracking-[0.09em] text-faint">{col.label}</span>
                  <span className={cn("min-w-0 text-right text-[12.5px] text-ink", col.mono && "font-mono text-[11.5px]")}>
                    {col.render ? col.render(row, rowIndex) : row[col.key]}
                  </span>
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------- pagination ---- */

export function Pagination({ page, pages, onPage, total, shown }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-[11.5px] text-muted">
        Showing {shown} of <span className="tnum font-semibold text-ink">{total}</span> records
      </p>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page">
          <ChevronLeft className="size-3.5" aria-hidden="true" /> Prev
        </Button>
        <span className="tnum px-2 text-[12px] font-medium text-ink-soft">
          {page} / {pages}
        </span>
        <Button size="sm" variant="outline" onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages} aria-label="Next page">
          Next <ChevronRight className="size-3.5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/** Small hook: paginated slice of a filtered list. */
export function usePagination(list, pageSize = 12) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(page, pages);
  const slice = list.slice((safePage - 1) * pageSize, safePage * pageSize);
  return { page: safePage, pages, slice, setPage, paginationProps: { page: safePage, pages, onPage: setPage, total: list.length, shown: slice.length } };
}
