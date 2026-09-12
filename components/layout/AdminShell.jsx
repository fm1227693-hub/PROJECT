"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu, Search, ShieldCheck, UserCog, X } from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import { ADMIN_NAV } from "@/lib/data/navigation";
import { navIcon } from "@/components/layout/navIcons";
import NotificationsBell from "@/components/layout/NotificationsBell";
import { openSearch } from "@/components/layout/CommandPalette";
import { useLockBodyScroll } from "@/lib/hooks/useMotion";
import { cn, initials } from "@/lib/utils";
import Logo from "@/components/brand/Logo";

/**
 * Admin chrome — a compact, serious control center. Deliberately denser than
 * the student/teacher workspaces: 13px type, tight rows, grouped rail.
 */

const SECTION_TITLES = {
  "/admin": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/reports": "Reports",
  "/admin/users": "All Users",
  "/admin/students": "Students",
  "/admin/teachers": "Teachers",
  "/admin/teacher-applications": "Teacher Applications",
  "/admin/classes": "Classes",
  "/admin/learning-content": "Learning Content",
  "/admin/subjects": "Subjects & Topics",
  "/admin/questions": "Question Bank",
  "/admin/tests": "Tests",
  "/admin/test-results": "Test Results",
  "/admin/announcements": "Announcements",
  "/admin/notifications": "Notifications",
  "/admin/homepage": "Homepage",
  "/admin/faq": "FAQ",
  "/admin/pricing": "Pricing",
  "/admin/settings": "Settings",
};

export function adminTitle(pathname) {
  if (pathname.startsWith("/admin/teacher-applications/")) return "Application Review";
  return SECTION_TITLES[pathname] ?? "Admin";
}

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { user, applications, signOut } = useApp();
  const [navOpen, setNavOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  useLockBodyScroll(navOpen);

  useEffect(() => setNavOpen(false), [pathname]);

  const pending = applications.filter((item) => item.status === "pending").length;
  const isActive = (href, end) => (end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  const rail = (
    <nav className="scroll-slim flex-1 overflow-y-auto px-2.5 py-4" aria-label="Admin">
      {ADMIN_NAV.map((group) => (
        <div key={group.group} className="mb-5 last:mb-0">
          <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-faint">{group.group}</p>
          <ul className="space-y-px">
            {group.items.map((item) => {
              const Icon = navIcon(item.icon);
              const active = isActive(item.href, item.end);
              const count = item.href === "/admin/teacher-applications" ? pending : null;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                      active ? "bg-ink text-white" : "text-ink-soft hover:bg-surface-3 hover:text-ink",
                    )}
                  >
                    {Icon ? <Icon className="size-[15px] shrink-0 opacity-80" aria-hidden="true" /> : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {count ? (
                      <span className={cn("grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[10px] font-bold", active ? "bg-white/20 text-white" : "bg-developing-soft text-developing")}>
                        {count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-surface-2">
      {/* ---- desktop rail ---- */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] flex-col border-r border-line bg-surface lg:flex" aria-label="Admin navigation">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-4">
          <Link href="/admin" className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" aria-label="Admin dashboard">
            <Logo compact />
          </Link>
          <span className="ml-auto flex items-center gap-1 rounded-md bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            <ShieldCheck className="size-[12px]" aria-hidden="true" /> Admin
          </span>
        </div>
        {rail}
        <div className="shrink-0 border-t border-line p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md px-2.5 py-2 text-[12px] font-medium text-ink-soft transition-colors hover:bg-surface-3 hover:text-ink"
          >
            <ExternalLink className="size-[14px]" aria-hidden="true" /> View public site
          </Link>
        </div>
      </aside>

      {/* ---- mobile drawer ---- */}
      {navOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-ink/40" onClick={() => setNavOpen(false)} tabIndex={-1} />
          <div className="absolute inset-y-0 left-0 flex w-[270px] flex-col border-r border-line bg-surface shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-4">
              <Logo compact />
              <button type="button" onClick={() => setNavOpen(false)} aria-label="Close navigation" className="grid size-8 place-items-center rounded-md text-ink-soft hover:bg-surface-3">
                <X className="size-[16px]" aria-hidden="true" />
              </button>
            </div>
            {rail}
          </div>
        </div>
      ) : null}

      <div className="flex min-h-dvh flex-col lg:pl-[236px]">
        {/* ---- topbar ---- */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface/95 px-3 backdrop-blur sm:px-5">
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open admin navigation"
            className="grid size-9 place-items-center rounded-md border border-line text-ink-soft transition-colors hover:bg-surface-2 lg:hidden"
          >
            <Menu className="size-[17px]" aria-hidden="true" />
          </button>

          <nav aria-label="Breadcrumb" className="hidden min-w-0 items-center gap-1.5 text-[12.5px] sm:flex">
            <Link href="/admin" className="text-muted transition-colors hover:text-ink">Admin</Link>
            <span className="text-faint" aria-hidden="true">/</span>
            <span className="truncate font-semibold text-ink">{adminTitle(pathname)}</span>
          </nav>
          <span className="truncate text-[13px] font-semibold text-ink sm:hidden">{adminTitle(pathname)}</span>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className="hidden h-9 items-center gap-2 rounded-md border border-line bg-surface-2 px-3 text-[12px] text-muted transition-colors hover:border-line-2 hover:bg-surface-3 sm:flex"
            >
              <Search className="size-[14px]" aria-hidden="true" />
              Search platform…
              <kbd className="ml-2 rounded border border-line bg-surface px-1 py-px font-mono text-[10px]">⌘K</kbd>
            </button>
            <button
              type="button"
              onClick={openSearch}
              aria-label="Search platform"
              className="grid size-9 place-items-center rounded-md border border-line text-ink-soft transition-colors hover:bg-surface-2 sm:hidden"
            >
              <Search className="size-[16px]" aria-hidden="true" />
            </button>

            <NotificationsBell role="admin" href="/admin/notifications" />

            <div className="relative">
              <button
                type="button"
                onClick={() => setUserOpen((prev) => !prev)}
                aria-expanded={userOpen}
                aria-haspopup="true"
                className="flex h-9 items-center gap-2 rounded-md border border-transparent pl-1.5 pr-2 transition-colors hover:border-line hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span className="grid size-6 place-items-center rounded-full bg-brand-soft font-mono text-[10px] font-bold text-brand" aria-hidden="true">
                  {initials(user?.name ?? "Demo Admin")}
                </span>
                <span className="hidden max-w-[120px] truncate text-[12px] font-semibold text-ink md:block">{user?.name ?? "Demo Admin"}</span>
              </button>
              {userOpen ? (
                <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-[0_18px_50px_-14px_rgba(16,24,43,0.28)]" role="menu" aria-label="Admin account">
                  <p className="px-3 pb-1 pt-2 text-[10.5px] font-bold uppercase tracking-[0.14em] text-faint">Signed in</p>
                  <p className="truncate px-3 text-[12.5px] font-semibold text-ink">{user?.name ?? "Demo Admin"}</p>
                  <p className="truncate px-3 pb-2 text-[11.5px] text-muted">{user?.email ?? "admin@prisma.education"}</p>
                  <div className="my-1 border-t border-line" />
                  <Link href="/admin/settings" onClick={() => setUserOpen(false)} role="menuitem" className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-ink-soft transition-colors hover:bg-surface-2">
                    <UserCog className="size-[14px]" aria-hidden="true" /> Admin settings
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setUserOpen(false); signOut(); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12.5px] text-risk transition-colors hover:bg-risk-soft"
                  >
                    <LogOut className="size-[14px]" aria-hidden="true" /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 px-3 py-4 sm:px-5 sm:py-5" tabIndex={-1}>
          <div className="mx-auto w-full max-w-[1240px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
