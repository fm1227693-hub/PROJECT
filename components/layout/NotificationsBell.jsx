"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { useApp } from "@/lib/store/AppProvider";
import { useOnClickOutside } from "@/lib/hooks/useMotion";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE_DOT = {
  info: "bg-brand",
  success: "bg-strong",
  developing: "bg-developing",
  risk: "bg-risk",
};

/** Role-aware notification bell with unread counter and mark-all-read. */
export default function NotificationsBell({ role, className, href = null }) {
  const { user, notifications, markNotificationsRead, derived } = useApp();
  const activeRole = role ?? derived.role ?? user?.role ?? "student";
  const items = notifications[activeRole] ?? [];
  const unread = items.filter((item) => !item.read).length;

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  useOnClickOutside(rootRef, () => setOpen(false), open);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        className="relative grid size-9 place-items-center rounded-md border border-transparent text-ink-soft transition-colors hover:border-line hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <Bell className="size-[17px]" aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 grid size-[15px] place-items-center rounded-full bg-brand text-[9.5px] font-bold text-white" aria-hidden="true">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-surface shadow-[0_18px_50px_-14px_rgba(16,24,43,0.28)]" role="dialog" aria-label="Notifications">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
            <p className="text-[12.5px] font-semibold text-ink">Notifications</p>
            <button
              type="button"
              onClick={() => markNotificationsRead(activeRole)}
              className="flex items-center gap-1 rounded text-[11.5px] font-medium text-brand transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <CheckCheck className="size-[13px]" aria-hidden="true" /> Mark all read
            </button>
          </div>
          <ul className="scroll-slim max-h-[320px] divide-y divide-line overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-8 text-center text-[12.5px] text-muted">Nothing yet. Activity for your {activeRole} workspace appears here.</li>
            ) : null}
            {items.map((item) => (
              <li key={item.id} className={cn("px-4 py-3", !item.read && "bg-brand-soft/40")}>
                <div className="flex items-start gap-2.5">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", TONE_DOT[item.tone] ?? TONE_DOT.info)} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className={cn("text-[12.5px] leading-snug text-ink", item.read ? "font-medium" : "font-semibold")}>{item.title}</p>
                    {item.body ? <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{item.body}</p> : null}
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-faint">{item.date}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {href ? (
            <Link
              href={href}
              onClick={() => setOpen(false)}
              className="block border-t border-line bg-surface-2/60 px-4 py-2.5 text-center text-[12px] font-semibold text-brand transition-colors hover:bg-brand-soft"
            >
              View all notifications
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
