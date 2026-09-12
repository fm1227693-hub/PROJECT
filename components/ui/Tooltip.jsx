"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

const POSITIONS = {
  top: {
    center: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    start: "bottom-full left-0 mb-2",
    end: "bottom-full right-0 mb-2",
  },
  bottom: {
    center: "top-full left-1/2 mt-2 -translate-x-1/2",
    start: "top-full left-0 mt-2",
    end: "top-full right-0 mt-2",
  },
  left: {
    center: "right-full top-1/2 mr-2 -translate-y-1/2",
    start: "right-full top-0 mr-2",
    end: "right-full bottom-0 mr-2",
  },
  right: {
    center: "left-full top-1/2 ml-2 -translate-y-1/2",
    start: "left-full top-0 ml-2",
    end: "left-full bottom-0 ml-2",
  },
};

/**
 * CSS-only tooltip — no timers, no portals, no re-renders. Appears on hover and
 * on keyboard focus of the trigger.
 */
export default function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  className,
  as: Component = "span",
}) {
  const id = useId();
  const position = POSITIONS[side]?.[align] ?? POSITIONS.top.center;

  return (
    <Component className={cn("group/tt relative inline-flex", className)} aria-describedby={id}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-[16rem] rounded-md border border-ink/10 bg-ink px-2.5 py-1.5",
          "text-[11.5px] font-medium leading-snug text-canvas shadow-lg",
          "scale-[0.97] opacity-0 transition-[opacity,scale] duration-150 ease-out",
          position,
          "group-hover/tt:scale-100 group-hover/tt:opacity-100",
          "group-focus-within/tt:scale-100 group-focus-within/tt:opacity-100",
        )}
      >
        {content}
      </span>
    </Component>
  );
}

/** Small circled "i" affordance used beside dashboard labels. */
export function InfoTip({ content, label = "More information about this metric", className }) {
  return (
    <Tooltip content={content} className={className}>
      <button
        type="button"
        aria-label={label}
        className="grid size-4 place-items-center rounded-full border border-line-2 text-[9px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        i
      </button>
    </Tooltip>
  );
}
