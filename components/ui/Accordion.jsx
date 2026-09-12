"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks/useMotion";
import { ChevronDown, Minus, Plus } from "lucide-react";

/**
 * Accordion. Height is animated with `grid-template-rows: 0fr → 1fr`, which
 * avoids measuring content and never causes a layout jump on open.
 */
export function AccordionItem({
  title,
  children,
  open,
  onToggle,
  id,
  className,
  meta,
  icon: Icon,
  tone = "default",
}) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("border-b border-line last:border-b-0", className)}>
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-start gap-4 py-4 text-left transition-colors duration-200 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        >
          {Icon ? (
            <span
              className={cn(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border transition-colors",
                open ? "border-brand-line bg-brand-soft text-brand" : "border-line bg-surface-2 text-muted group-hover:text-ink",
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
          ) : null}
          <span className="min-w-0 flex-1">
            <span className={cn("block font-medium tracking-[-0.01em]", tone === "display" ? "font-display text-[17px]" : "text-[14.5px]", open ? "text-ink" : "text-ink-soft group-hover:text-ink")}>
              {title}
            </span>
            {meta ? <span className="mt-1 block text-[12px] text-muted">{meta}</span> : null}
          </span>
          <span
            className={cn(
              "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line text-muted transition-[transform,color,border-color] duration-250",
              open ? "rotate-180 border-brand-line bg-brand-soft text-brand" : "group-hover:border-line-2 group-hover:text-ink",
            )}
            aria-hidden="true"
          >
            <ChevronDown className="size-3.5" />
          </span>
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="grid"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: reduced ? "none" : "grid-template-rows 300ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div className="overflow-hidden">
          <div className={cn("pb-5", Icon ? "pl-11" : "pr-10")}>
            <div className="text-[14px] leading-relaxed text-ink-soft">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ items = [], defaultOpen = null, className, tone = "default", allowMultiple = false }) {
  const [openIds, setOpenIds] = useState(defaultOpen ? [defaultOpen] : []);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={cn("divide-y-0 overflow-hidden rounded-lg border border-line bg-surface", className)}>
      <div className="px-5">
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            id={item.id}
            title={item.question ?? item.title}
            meta={item.meta}
            icon={item.icon}
            tone={tone}
            open={openIds.includes(item.id)}
            onToggle={() => toggle(item.id)}
          >
            {item.content ?? item.children ?? item.answer}
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}

/** Compact +/− disclosure used inside dashboards. */
export function Disclosure({ label, children, defaultOpen = false, className, count }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduced = useReducedMotion();
  return (
    <div className={cn("rounded-lg border border-line bg-surface", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2"
      >
        <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
          {label}
          {typeof count === "number" ? (
            <span className="tnum rounded-[4px] bg-surface-3 px-1.5 py-px text-[11px] text-muted">{count}</span>
          ) : null}
        </span>
        <span className="text-muted" aria-hidden="true">
          {open ? <Minus className="size-4" /> : <Plus className="size-4" />}
        </span>
      </button>
      <div
        className="grid"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", transition: reduced ? "none" : "grid-template-rows 260ms cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line px-4 py-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
