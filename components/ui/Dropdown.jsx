"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useOnClickOutside, useReducedMotion } from "@/lib/hooks/useMotion";
import { Check, ChevronDown } from "lucide-react";

const DropdownContext = createContext({ setOpen: () => {} });

/**
 * Accessible dropdown. Handles click-outside, Escape, arrow-key navigation and
 * focus return. Used by the navbar, dashboard filters and table row actions.
 */
export function Dropdown({
  label,
  trigger,
  children,
  align = "left",
  width = "w-56",
  icon: Icon,
  className,
  panelClassName,
  variant = "ghost",
  size = "md",
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const id = useId();
  const reduced = useReducedMotion();

  useOnClickOutside(rootRef, () => setOpen(false), open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = Array.from(
        panelRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])') ?? [],
      );
      if (!items.length) return;
      event.preventDefault();
      const current = items.indexOf(document.activeElement);
      const next =
        event.key === "ArrowDown"
          ? (current + 1) % items.length
          : (current - 1 + items.length) % items.length;
      items[current < 0 ? 0 : next]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  const triggerNode = trigger ?? (
    <button
      ref={buttonRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={`${id}-panel`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        size === "sm" ? "h-8 px-2.5 text-[12.5px]" : "h-9 px-3 text-[13.5px]",
        variant === "ghost" && "text-ink-soft hover:bg-surface-3 hover:text-ink",
        variant === "outline" && "border border-line bg-surface text-ink hover:border-line-3",
        variant === "subtle" && "bg-surface-3 text-ink hover:bg-line/60",
        open && variant === "ghost" && "bg-surface-3 text-ink",
        className,
      )}
      onClick={() => setOpen((v) => !v)}
    >
      {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
      <span className="truncate">{label}</span>
      <ChevronDown
        className={cn("size-3.5 shrink-0 text-faint transition-transform duration-200", open && "rotate-180")}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <div className="relative" ref={rootRef}>
      {triggerNode}
      {open ? (
        <div
          id={`${id}-panel`}
          ref={panelRef}
          role="menu"
          aria-label={label}
          className={cn(
            "absolute z-50 mt-2 origin-top overflow-hidden rounded-lg border border-line bg-surface p-1.5 shadow-lg",
            align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
            width,
            "transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
            reduced ? "" : "animate-[dropdown-in_150ms_ease-out]",
            panelClassName,
          )}
        >
          <DropdownContext.Provider value={{ setOpen }}>{children}</DropdownContext.Provider>
        </div>
      ) : null}
    </div>
  );
}

export function DropdownItem({ children, href, onClick, icon: Icon, description, selected, disabled, closeOnClick = true }) {
  const { setOpen } = useContext(DropdownContext);
  const classes = cn(
    "flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors duration-150",
    disabled ? "cursor-not-allowed opacity-45" : "hover:bg-surface-3",
    "focus-visible:bg-surface-3 focus-visible:outline-none",
  );

  const inner = (
    <>
      {Icon ? <Icon className="mt-0.5 size-4 shrink-0 text-ink-soft" aria-hidden="true" /> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink">{children}</span>
        {description ? <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{description}</span> : null}
      </span>
      {selected ? <Check className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        role="menuitem"
        className={classes}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => closeOnClick && setOpen?.(false)}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      className={classes}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (closeOnClick) setOpen?.(false);
      }}
    >
      {inner}
    </button>
  );
}

export function DropdownLabel({ children, className }) {
  return (
    <p className={cn("px-2.5 pb-1.5 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-faint", className)}>
      {children}
    </p>
  );
}

export function DropdownSeparator({ className }) {
  return <div className={cn("my-1.5 h-px bg-line", className)} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ *
 * Select — a dropdown specialised for choosing one value from a list
 * ------------------------------------------------------------------ */

export function Select({ value, onChange, options = [], placeholder = "Select…", id, label, className, size = "md" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useOnClickOutside(rootRef, () => setOpen(false), open);

  const current = options.find((opt) => (opt.value ?? opt) === value);
  const currentLabel = current ? current.label ?? current : placeholder;

  const handleSelect = useCallback(
    (next) => {
      onChange?.(next);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <div className={cn("relative", className)} ref={rootRef}>
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-[12px] font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-md border border-line bg-surface text-left transition-colors",
          "hover:border-line-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          size === "sm" ? "h-8 px-2.5 text-[12.5px]" : "h-10 px-3 text-[13.5px]",
          open && "border-line-3",
        )}
      >
        <span className={cn("truncate", value ? "text-ink" : "text-faint")}>{currentLabel}</span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-faint transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 max-h-64 w-full overflow-y-auto rounded-lg border border-line bg-surface p-1 shadow-lg scroll-slim"
        >
          {options.map((opt) => {
            const val = opt.value ?? opt;
            const text = opt.label ?? opt;
            const active = val === value;
            return (
              <li key={String(val)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handleSelect(val)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors",
                    active ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-3",
                  )}
                >
                  <span className="truncate">{text}</span>
                  {active ? <Check className="size-3.5 shrink-0" aria-hidden="true" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
