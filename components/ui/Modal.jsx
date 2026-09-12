"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useEscapeKey, useFocusTrap, useLockBodyScroll, useReducedMotion } from "@/lib/hooks/useMotion";
import { X } from "lucide-react";

/**
 * Modal — subtle scale + opacity, focus trapped, Escape and backdrop dismiss,
 * body scroll locked. Mounted through a portal so it never inherits overflow.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  icon: Icon,
  dismissible = true,
}) {
  const panelRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useLockBodyScroll(open);
  useFocusTrap(panelRef, open && visible);
  useEscapeKey(() => dismissible && onClose?.(), open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    return undefined;
  }, [open]);

  if (!mounted || !open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const node = (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "Dialog"}
    >
      <div
        className={cn(
          "absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
        onClick={dismissible ? onClose : undefined}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className={cn(
          "relative w-full overflow-hidden rounded-t-xl border border-line bg-surface shadow-xl sm:rounded-xl",
          sizes[size] ?? sizes.md,
          "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
          visible || reduced ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.985] opacity-0",
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            {Icon ? (
              <span className="grid size-8 shrink-0 place-items-center rounded-md border border-brand-line bg-brand-soft text-brand">
                <Icon className="size-4" aria-hidden="true" />
              </span>
            ) : null}
            <div className="min-w-0">
              <h2 className="font-display text-[17px] leading-snug text-ink">{title}</h2>
              {description ? <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p> : null}
            </div>
          </div>
          {dismissible ? (
            <button
              type="button"
              onClick={onClose}
              className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-surface-3 hover:text-ink"
              aria-label="Close dialog"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </header>

        <div className="scroll-slim max-h-[65vh] overflow-y-auto px-5 py-4">{children}</div>

        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface-2 px-5 py-3.5">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}

/** Confirmation dialog built on Modal. */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", tone = "primary", children }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-md px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:bg-surface-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className={cn(
              "h-9 rounded-md px-3.5 text-[13px] font-medium text-white transition-transform active:scale-[0.98]",
              tone === "danger" ? "bg-risk hover:brightness-95" : "bg-ink hover:bg-ink-2",
            )}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {children ?? <p className="text-[13.5px] leading-relaxed text-ink-soft">This action cannot be undone.</p>}
    </Modal>
  );
}
