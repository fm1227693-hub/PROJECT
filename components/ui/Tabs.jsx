"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/hooks/useMotion";

/**
 * Tabs with a transform-only sliding indicator (measured, then animated with
 * translateX + scaleX — no layout work, no dependency on framer-motion).
 */
export default function Tabs({
  tabs,
  value,
  onChange,
  className,
  size = "md",
  variant = "pill",
  ariaLabel = "Tabs",
  full = false,
}) {
  const listRef = useRef(null);
  const itemRefs = useRef(new Map());
  const [indicator, setIndicator] = useState({ x: 0, w: 0 });
  const reduced = useReducedMotion();
  const activeIndex = Math.max(0, tabs.findIndex((t) => (t.value ?? t.id) === value));

  const measure = () => {
    const el = itemRefs.current.get(activeIndex);
    if (!el || !listRef.current) return;
    setIndicator({
      x: el.offsetLeft,
      w: el.offsetWidth,
    });
  };

  useLayoutEffect(measure, [activeIndex, tabs.length, value]);

  useEffect(() => {
    if (typeof window === "undefined" || !listRef.current) return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(listRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    let next = activeIndex;
    if (event.key === "ArrowRight") next = (activeIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (activeIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    const tab = tabs[next];
    onChange?.(tab.value ?? tab.id);
    itemRefs.current.get(next)?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "relative isolate flex items-center gap-1",
        variant === "pill" && "rounded-lg border border-line bg-surface-2 p-1",
        variant === "underline" && "gap-0 border-b border-line",
        full && "w-full",
        className,
      )}
    >
      {variant === "pill" ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 -z-10 rounded-md border border-line bg-surface shadow-xs"
          style={{
            width: indicator.w || undefined,
            transform: `translateX(${indicator.x}px)`,
            transition: reduced ? "none" : "transform 260ms cubic-bezier(0.22,1,0.36,1), width 260ms cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ) : null}

      {tabs.map((tab, index) => {
        const id = tab.value ?? tab.id;
        const active = index === activeIndex;
        const Icon = tab.icon;
        return (
          <button
            key={id}
            ref={(node) => {
              if (node) itemRefs.current.set(index, node);
              else itemRefs.current.delete(index);
            }}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={active}
            aria-controls={`panel-${id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange?.(id)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              size === "sm" ? "h-7 px-2.5 text-[12.5px]" : size === "lg" ? "h-11 px-5 text-[14.5px]" : "h-9 px-3.5 text-[13px]",
              full && "flex-1",
              variant === "pill" && "rounded-md",
              variant === "underline" && "-mb-px rounded-none border-b-2",
              variant === "underline" && (active ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"),
              variant === "pill" && (active ? "text-ink" : "text-muted hover:text-ink"),
            )}
          >
            {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
            {tab.label}
            {typeof tab.count === "number" ? (
              <span
                className={cn(
                  "tnum ml-0.5 rounded-[4px] px-1 py-px text-[10px]",
                  active ? "bg-brand-soft text-brand" : "bg-surface-3 text-muted",
                )}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({ id, active, children, className }) {
  if (!active) return null;
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} className={className}>
      {children}
    </div>
  );
}
