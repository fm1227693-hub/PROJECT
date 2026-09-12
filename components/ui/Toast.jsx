"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";

const TONES = {
  default: { icon: Info, ring: "border-line", accent: "text-ink-soft" },
  success: { icon: CheckCircle2, ring: "border-strong/25", accent: "text-strong" },
  info: { icon: Info, ring: "border-brand-line", accent: "text-brand" },
  warning: { icon: TriangleAlert, ring: "border-developing/25", accent: "text-developing" },
  danger: { icon: XCircle, ring: "border-risk/25", accent: "text-risk" },
};

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const tone = TONES[toast.tone] ?? TONES.default;
  const Icon = tone.icon;

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-[min(23rem,calc(100vw-2rem))] items-start gap-3 rounded-lg border bg-surface p-3.5 shadow-lg",
        tone.ring,
        "transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0",
      )}
      role="status"
    >
      <span className={cn("mt-0.5 shrink-0", tone.accent)}>
        <Icon className="size-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        {toast.title ? <p className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{toast.title}</p> : null}
        <p className={cn("text-[12.5px] leading-relaxed text-ink-soft", toast.title && "mt-0.5")}>{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="-mr-1 -mt-1 grid size-6 shrink-0 place-items-center rounded-md text-faint transition-colors hover:bg-surface-3 hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function Toaster() {
  const { toasts, dismissToast } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !toasts.length) return null;

  return createPortal(
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col-reverse items-end gap-2 sm:bottom-6 sm:right-6"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>,
    document.body,
  );
}
