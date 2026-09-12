"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn, initials } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
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

const SEARCH_INDEX = [
  { label: "Student dashboard", href: "/student/dashboard", group: "Student" },
  { label: "My skills", href: "/student/skills", group: "Student" },
  { label: "My progress", href: "/student/progress", group: "Student" },
  { label: "Learning path", href: "/student/learning-path", group: "Student" },
  { label: "Recommended plan", href: "/student/recommended-plan", group: "Student" },
  { label: "Practice center", href: "/student/practice", group: "Student" },
  { label: "Mathematics", href: "/student/math", group: "Student" },
  { label: "English", href: "/student/english", group: "Student" },
  { label: "Quadratic equations", href: "/student/math/topic?id=quadratic_equations", group: "Topic" },
  { label: "Inequalities", href: "/student/math/topic?id=inequalities", group: "Topic" },
  { label: "Academic vocabulary", href: "/student/english/topic?id=academic_vocabulary", group: "Topic" },
  { label: "Start diagnostic", href: "/student/diagnostic/start", group: "Assessment" },
  { label: "Mathematics test", href: "/student/diagnostic/math/test", group: "Assessment" },
  { label: "English test", href: "/student/diagnostic/english/test", group: "Assessment" },
  { label: "Results", href: "/student/diagnostic/results", group: "Assessment" },
  { label: "Math analysis", href: "/student/diagnostic/math-analysis", group: "Assessment" },
  { label: "English analysis", href: "/student/diagnostic/english-analysis", group: "Assessment" },
  { label: "Achievements", href: "/student/achievements", group: "Student" },
  { label: "Study history", href: "/student/history", group: "Student" },
  { label: "Certificates", href: "/student/certificates", group: "Student" },
  { label: "Teacher dashboard", href: "/teacher/dashboard", group: "Teacher" },
  { label: "Students", href: "/teacher/students", group: "Teacher" },
  { label: "Class analytics", href: "/teacher/classes", group: "Teacher" },
  { label: "Assign diagnostic", href: "/teacher/assign", group: "Teacher" },
  { label: "Create assessment", href: "/teacher/assessments/create", group: "Teacher" },
  { label: "Assessment results", href: "/teacher/assessments/results", group: "Teacher" },
  { label: "Question bank", href: "/teacher/question-bank", group: "Teacher" },
  { label: "Learning plans", href: "/teacher/learning-plans", group: "Teacher" },
  { label: "School dashboard", href: "/school/dashboard", group: "School" },
  { label: "School students", href: "/school/students", group: "School" },
  { label: "School teachers", href: "/school/teachers", group: "School" },
  { label: "School analytics", href: "/school/analytics", group: "School" },
  { label: "Settings", href: "/settings", group: "Account" },
  { label: "Billing", href: "/billing", group: "Account" },
  { label: "Pricing", href: "/pricing", group: "Website" },
  { label: "Sample report", href: "/sample-report", group: "Website" },
  { label: "How it works", href: "/how-it-works", group: "Website" },
];

const NOTIFICATIONS = [
  { id: "n1", title: "Diagnostic due Friday", body: "Autumn baseline · Full diagnostic is assigned to you.", time: "2 h ago", tone: "brand", href: "/student/diagnostic/start", unread: true },
  { id: "n2", title: "Quadratic Equations dropped 3 pts", body: "Your mastery slipped between the last two attempts.", time: "Yesterday", tone: "risk", href: "/student/diagnostic/math-analysis", unread: true },
  { id: "n3", title: "Week 3 unlocked", body: "You completed the Inequalities practice set.", time: "3 days ago", tone: "strong", href: "/student/learning-path", unread: false },
];

function GlobalSearch({ className }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useOnClickOutside(rootRef, () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        window.setTimeout(() => inputRef.current?.focus(), 20);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_INDEX.slice(0, 6);
    return SEARCH_INDEX.filter((item) => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const go = (href) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          window.setTimeout(() => inputRef.current?.focus(), 20);
        }}
        className="flex h-9 w-full items-center gap-2 rounded-md border border-line bg-surface-2 px-3 text-left text-[13px] text-muted transition-colors hover:border-line-2 hover:bg-surface"
        aria-label="Search the workspace"
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">Search pages, topics, students…</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-line-2 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
          ⌘K
        </kbd>
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-line bg-surface shadow-xl animate-[dropdown-in_150ms_ease-out]">
          <div className="flex items-center gap-2 border-b border-line px-3">
            <Search className="size-4 shrink-0 text-faint" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && results[0]) go(results[0].href);
              }}
              placeholder="Search the workspace"
              className="h-11 w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-faint"
              aria-label="Search query"
            />
            <kbd className="hidden shrink-0 rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">ESC</kbd>
          </div>

          <ul className="scroll-slim max-h-72 overflow-y-auto p-1.5" role="listbox">
            {results.length ? (
              results.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => go(item.href)}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
                  >
                    <LayoutDashboard className="size-4 shrink-0 text-faint" aria-hidden="true" />
                    <span className="truncate text-[13px] text-ink">{item.label}</span>
                    <Badge tone="neutral" size="xs" className="ml-auto shrink-0">
                      {item.group}
                    </Badge>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-6 text-center text-[13px] text-muted">
                No matches for “{query}”.
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardTopbar({ onOpenNav, breadcrumb, title, navKey = "student" }) {
  const { user, hydrated, resetDemo, signOut } = useApp();
  const pathname = usePathname();
  const [bellOpen, setBellOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const bellRef = useRef(null);

  useOnClickOutside(bellRef, () => setBellOpen(false), bellOpen);

  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
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
                  <Badge tone="brand" size="xs">{unread} new</Badge>
                </div>
                <ul className="scroll-slim max-h-80 divide-y divide-line overflow-y-auto">
                  {NOTIFICATIONS.map((item) => (
                    <li key={item.id}>
                      <Link href={item.href} onClick={() => setBellOpen(false)} className="flex gap-3 px-4 py-3 transition-colors hover:bg-surface-2">
                        <span
                          className={cn(
                            "mt-1.5 size-1.5 shrink-0 rounded-full",
                            item.tone === "risk" ? "bg-risk" : item.tone === "strong" ? "bg-strong" : "bg-brand",
                          )}
                          aria-hidden="true"
                        />
                        <span className="min-w-0">
                          <span className="block text-[13px] font-medium text-ink">{item.title}</span>
                          <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{item.body}</span>
                          <span className="mt-1 block text-[11px] text-faint">{item.time}</span>
                        </span>
                      </Link>
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
