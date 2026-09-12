"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const CONTROL =
  "w-full rounded-md border bg-surface text-ink placeholder:text-faint " +
  "transition-[border-color,box-shadow,background-color] duration-200 " +
  "focus-visible:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/15 " +
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-muted";

const SIZES = { sm: "h-9 px-3 text-[13px]", md: "h-11 px-3.5 text-[14px]", lg: "h-12 px-4 text-[15px]" };

export function Field({ label, hint, error, required, children, htmlFor, className, optional }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label htmlFor={htmlFor} className="flex items-baseline justify-between gap-3 text-[12.5px] font-medium text-ink-soft">
          <span>
            {label}
            {required ? <span className="ml-0.5 text-risk" aria-hidden="true">*</span> : null}
          </span>
          {optional ? <span className="text-[11px] font-normal text-faint">Optional</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-[12px] font-medium text-risk" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef(function Input(
  { label, hint, error, required, optional, className, size = "md", icon: Icon, suffix, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;

  const control = (
    <div className="relative">
      {Icon ? (
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(
          CONTROL,
          SIZES[size] ?? SIZES.md,
          Icon && "pl-9",
          suffix && "pr-16",
          error ? "border-risk/50 focus-visible:border-risk focus-visible:ring-risk/15" : "border-line hover:border-line-2",
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-faint">{suffix}</span>
      ) : null}
    </div>
  );

  if (!label && !hint && !error) return control;

  return (
    <Field label={label} hint={hint} error={error} required={required} optional={optional} htmlFor={inputId}>
      {control}
    </Field>
  );
});

export const Select = forwardRef(function Select(
  { label, hint, error, required, optional, options = [], className, size = "md", id, onChange, ...props },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;

  const control = (
    <div className="relative">
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        onChange={(event) => (onChange ? onChange(event.target.value, event) : undefined)}
        className={cn(
          CONTROL,
          SIZES[size] ?? SIZES.md,
          "appearance-none pr-9",
          error ? "border-risk/50 focus-visible:border-risk focus-visible:ring-risk/15" : "border-line hover:border-line-2",
          className,
        )}
        {...props}
      >
        {options.map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ),
        )}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-faint"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  if (!label && !hint && !error) return control;

  return (
    <Field label={label} hint={hint} error={error} required={required} optional={optional} htmlFor={selectId}>
      {control}
    </Field>
  );
});

export const Textarea = forwardRef(function Textarea({ label, hint, error, required, className, rows = 4, id, ...props }, ref) {
  const autoId = useId();
  const areaId = id ?? autoId;
  return (
    <Field label={label} hint={hint} error={error} required={required} htmlFor={areaId}>
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn(
          CONTROL,
          "resize-y px-3.5 py-2.5 text-[14px] leading-relaxed",
          error ? "border-risk/50" : "border-line hover:border-line-2",
          className,
        )}
        {...props}
      />
    </Field>
  );
});

export function Switch({ checked, onChange, label, description, disabled, name, id }) {
  const autoId = useId();
  const switchId = id ?? autoId;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <label htmlFor={switchId} className="block cursor-pointer text-[13.5px] font-medium text-ink">
          {label}
        </label>
        {description ? <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{description}</p> : null}
      </div>
      <button
        id={switchId}
        name={name}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          checked ? "border-brand bg-brand" : "border-line-2 bg-surface-3",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-xs transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            checked ? "translate-x-[26px]" : "translate-x-[3px]",
          )}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export function Checkbox({ checked, onChange, label, description, className, name, disabled }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 py-1.5",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span className="relative mt-px flex size-[18px] shrink-0 items-center justify-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
          className="peer size-[18px] cursor-pointer appearance-none rounded-[5px] border border-line-2 bg-surface transition-colors checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed"
        />
        <Check
          className="pointer-events-none absolute size-3 scale-75 text-white opacity-0 transition-[opacity,scale] duration-150 peer-checked:scale-100 peer-checked:opacity-100"
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[13.5px] leading-snug text-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-[12px] leading-relaxed text-muted">{description}</span> : null}
      </span>
    </label>
  );
}

/** Large selectable card — used for onboarding choices and plan selection. */
export function RadioCard({ selected, onSelect, title, description, meta, icon: Icon, value, name, className, disabled }) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 rounded-lg border bg-surface p-4 text-left",
        "transition-[border-color,box-shadow,transform,background-color] duration-200",
        selected ? "border-brand bg-brand-soft/50 shadow-sm" : "border-line hover:-translate-y-px hover:border-line-3 hover:shadow-xs",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect?.(value)}
        className="sr-only"
      />
      {Icon ? (
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-md border transition-colors",
            selected ? "border-brand-line bg-brand-soft text-brand" : "border-line bg-surface-2 text-muted group-hover:text-ink",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[14px] font-semibold tracking-[-0.01em] text-ink">{title}</span>
          {meta ? <span className="tnum text-[11.5px] text-muted">{meta}</span> : null}
        </span>
        {description ? <span className="mt-1 block text-[12.5px] leading-relaxed text-muted">{description}</span> : null}
      </span>
      <span
        className={cn(
          "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors",
          selected ? "border-brand bg-brand" : "border-line-2 bg-surface group-hover:border-line-3",
        )}
        aria-hidden="true"
      >
        {selected ? <span className="size-1.5 rounded-full bg-white" /> : null}
      </span>
    </label>
  );
}

/** Segmented control for compact binary/ternary choices. */
export function Segmented({ options, value, onChange, className, size = "md", ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn("inline-flex items-center gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5", className)}
    >
      {options.map((opt) => {
        const val = opt.value ?? opt;
        const label = opt.label ?? opt;
        const active = val === value;
        return (
          <button
            key={String(val)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange?.(val)}
            className={cn(
              "rounded-md font-medium transition-[background-color,color,box-shadow] duration-200",
              size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-8 px-3 text-[13px]",
              active ? "bg-surface text-ink shadow-xs" : "text-muted hover:text-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
