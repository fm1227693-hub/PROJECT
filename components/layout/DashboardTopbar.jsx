"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn, initials } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { openSearch } from "@/components/layout/CommandPalette";
import { useEscapeKey, useLockBodyScroll, useOnClickOutside } from "@/lib/hooks/useMotion";
import { Badge } from "@/components/ui/Badge";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  Settings,
  User,
} from "lucide-react";

/** Search launcher — opens the global command palette (Cmd/Ctrl + K). */
function GlobalSearch({ className }) {
  return (
    <button
      type="button"
      onClick={openSearch}
      className={cn(
        "flex h-9 w-full items-center gap-2 rounded-md border border-line bg-surface-2 px-3 text-left text-[13px] text-muted transition-colors hover:border-line-2 hover:bg-surface",
        className,
      )}
      aria-label="Search the workspace (opens the command palette)"
    >
      <Search className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 truncate">Search workspace…</span>
      <kbd className="hidden shrink-0 rounded border border-line bg-surface px-1.5 py-px font-mono text-[10px] text-faint sm:block">⌘K</kbd>
    </button>
  );
}

export default function DashboardTopbar({ onOpenNav, breadcrumb, title, navKey = "student" }) {
  const { user, hydrated, resetDemo, signOut, notifications, markNotificationsRead } = useApp();
  const pathname = usePathname();
  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bellRef = useRef(null);

  useOnClickOutside(bellRef, () => setBellOpen(false), bellOpen);

  const bellRole = navKey === "teacher" ? "teacher" : navKey === "school" ? "school" : "student";
  const bellItems = notifications[bellRole] ?? [];
  const unread = bellItems.filter((n) => !n.read).length;
  const displayName = hydrated ? user?.name ?? "Amina Yusupova" : "Amina Yusupova";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-[8px]">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:h-[68px]">
        <button
          type="button"
          onClick={onOpenNav}
          className="grid size-9 shrink-0 place-items-center rounded-md border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-2 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-[18px]" aria-hidden="true" />
        </button>

        <div className="hidden min-w-0 lg:block">
          {breadcrumb?.length ? (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11.5px] text-faint">
              {breadcrumb.map((crumb, index) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  <span className={index === breadcrumb.length - 1 ? "text-muted" : undefined}>{crumb}</span>
                </span>
              ))}
            </nav>
          ) : null}
          <p className="truncate text-[13px] font-medium capitalize text-ink">{title ?? pathname.split("/").filter(Boolean).join(" · ")}</p>
        </div>

        <GlobalSearch className="ml-auto hidden w-full max-w-sm md:block" />

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <button
            type="button"
            onClick={resetDemo}
            className="hidden h-9 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-line-3 hover:text-ink xl:inline-flex"
            title="Restore the demo dataset"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset demo
          </button>

          <div className="relative" ref={bellRef}>
            <button
              type="button"
              onClick={() => setBellOpen((v) => !v)}
              aria-expanded={bellOpen}
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
              className="relative grid size-9 place-items-center rounded-md border border-line bg-surface text-ink-soft transition-colors hover:bg-surface-2"
            >
              <Bell className="size-[17px]" aria-hidden="true" />
              {unread ? (
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand ring-2 ring-surface" aria-hidden="true" />
              ) : null}
            </button>

            {bellOpen ? (
              <div className="absolute right-0 top-full z-50 mt-2 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-line bg-surface shadow-xl animate-[dropdown-in_150ms_ease-out]">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-[13px] font-semibold text-ink">Notifications</p>
                  <button
                    type="button"
                    onClick={() => markNotificationsRead(bellRole)}
                    className="text-[11.5px] font-medium text-brand hover:underline"
                  >
                    {unread ? `Mark ${unread} read` : "All caught up"}
                  </button>
                </div>
                <ul className="scroll-slim max-h-80 divide-y divide-line overflow-y-auto">
                  {bellItems.length === 0 ? (
                    <li className="px-4 py-8 text-center text-[12.5px] text-muted">
                      Nothing yet — updates for your workspace appear here.
                    </li>
                  ) : null}
                  {bellItems.map((item) => (
                    <li key={item.id} className={cn("flex gap-3 px-4 py-3", !item.read && "bg-brand-soft/40")}>
                      <span
                        className={cn(
                          "mt-1.5 size-1.5 shrink-0 rounded-full",
                          item.tone === "risk" ? "bg-risk" : item.tone === "success" || item.tone === "strong" ? "bg-strong" : item.tone === "developing" ? "bg-developing" : "bg-brand",
                        )}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className={cn("block text-[13px]", item.read ? "font-medium text-ink" : "font-semibold text-ink")}>{item.title}</span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{item.body}</span>
                        <span className="mt-1 block text-[11px] text-faint">{item.date}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line bg-surface-2 px-4 py-2.5">
                  <Link href="/settings" onClick={() => setBellOpen(false)} className="text-[12.5px] font-medium text-brand hover:underline">
                    Notification preferences
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex h-9 items-center gap-2 rounded-md border border-line bg-surface pl-1 pr-2.5 transition-colors hover:bg-surface-2"
            >
              <span className="grid size-7 place-items-center rounded-full bg-ink font-mono text-[11px] font-semibold text-canvas">
                {initials(displayName)}
              </span>
              <span className="hidden max-w-[8rem] truncate text-[12.5px] font-medium text-ink sm:block">
                {displayName.split(" ")[0]}
              </span>
            </button>

            {menuOpen ? (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-line bg-surface p-1.5 shadow-xl animate-[dropdown-in_150ms_ease-out]" role="menu">
                <div className="px-2.5 py-2">
                  <p className="truncate text-[13px] font-semibold text-ink">{displayName}</p>
                  <p className="truncate text-[11.5px] text-muted">{user?.email ?? "amina.yusupova@student.prisma.education"}</p>
                </div>
                <div className="my-1 h-px bg-line" aria-hidden="true" />
                {[
                  { label: "Profile", href: navKey === "student" ? "/student/profile" : "/settings", icon: User },
                  { label: "Settings", href: "/settings", icon: Settings },
                  { label: "Billing", href: "/billing", icon: CreditCard },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-ink transition-colors hover:bg-surface-2"
                  >
                    <item.icon className="size-4 text-ink-soft" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
                <div className="my-1 h-px bg-line" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-risk transition-colors hover:bg-risk-soft"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
