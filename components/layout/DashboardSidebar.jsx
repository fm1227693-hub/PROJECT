"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, initials } from "@/lib/utils";
import { NAV_BY_ROLE } from "@/lib/data/navigation";
import { navIcon } from "@/components/layout/navIcons";
import Logo from "@/components/brand/Logo";
import { Badge } from "@/components/ui/Badge";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/Dropdown";
import { useApp } from "@/lib/store/AppProvider";
import { ArrowLeftRight, Building, GraduationCap, LogOut, Presentation, Settings, ShieldCheck, X } from "lucide-react";

const WORKSPACES = [
  { id: "student", label: "Student workspace", href: "/student/dashboard", icon: GraduationCap, description: "Your diagnostics, plan and progress" },
  { id: "teacher", label: "Teacher workspace", href: "/teacher/dashboard", icon: Presentation, description: "Classes, students and assessments" },
  { id: "school", label: "School workspace", href: "/school/dashboard", icon: Building, description: "Organisation analytics" },
];

export default function DashboardSidebar({ navKey = "student", open = false, onClose }) {
  const pathname = usePathname();
  const { user, subscription, signOut, hydrated } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const groups = NAV_BY_ROLE[navKey] ?? NAV_BY_ROLE.student;
  const role = navKey === "teacher" ? "teacher" : navKey === "school" ? "school" : "student";

  /* the admin console only ever appears for the admin account */
  const workspaces = user?.role === "admin"
    ? [...WORKSPACES, { id: "admin", label: "Admin console", href: "/admin", icon: ShieldCheck, description: "Platform administration" }]
    : WORKSPACES;

  const isActive = (href, end) => (end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`${href}?`));

  const content = (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line px-5 lg:h-[68px]">
        <Link href="/" className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
          <Logo suffix="Diagnostic Center" compact />
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-md border border-line text-ink-soft transition-colors hover:bg-surface-2 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-[18px]" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="px-4 pt-4">
        <Dropdown
          width="w-64"
          align="left"
          variant="outline"
          className="w-full justify-between"
          label={workspaces.find((w) => w.id === role)?.label ?? "Workspace"}
          icon={ArrowLeftRight}
        >
          <DropdownLabel>Switch workspace</DropdownLabel>
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            return (
              <DropdownItem key={workspace.id} href={workspace.href} icon={Icon} description={workspace.description} selected={workspace.id === role}>
                {workspace.label}
              </DropdownItem>
            );
          })}
          <DropdownSeparator />
          <DropdownLabel>Demo</DropdownLabel>
          <DropdownItem href="/sample-report" description="See a fully explained report">
            Sample diagnostic report
          </DropdownItem>
        </Dropdown>
      </div>

      <nav className="scroll-slim flex-1 overflow-y-auto px-3 py-5" aria-label="Workspace">
        {groups.map((group) => (
          <div key={group.group} className="mb-6 last:mb-0">
            <p className="eyebrow px-3 pb-2">{group.group}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = navIcon(item.icon);
                const active = isActive(item.href, item.end);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] font-medium transition-colors duration-150",
                        active ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-surface-2 hover:text-ink",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 top-1/2 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full bg-brand transition-[opacity,transform] duration-200",
                          active ? "scale-y-100 opacity-100" : "scale-y-50 opacity-0",
                        )}
                        aria-hidden="true"
                      />
                      {Icon ? <Icon className="size-[17px] shrink-0" aria-hidden="true" /> : null}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <div className="rounded-lg border border-line bg-surface-2 p-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink font-mono text-[12px] font-semibold text-canvas">
              {mounted && hydrated ? initials(user?.name) : "AY"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink">{mounted && hydrated ? user?.name : "Amina Yusupova"}</p>
              <p className="truncate text-[11.5px] text-muted">
                {role === "student" ? `Grade ${mounted && hydrated ? user?.grade ?? 10 : 10} · ${user?.className ?? "10-B"}` : role === "teacher" ? "Ms. Amara Adeyemi" : "Northgate International"}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Badge tone="brand" size="xs" className="capitalize">
              {subscription?.planId ?? "student"} plan
            </Badge>
            <Link href="/billing" className="ml-auto text-[11.5px] font-medium text-muted transition-colors hover:text-brand">
              Manage
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3">
            <Link
              href="/settings"
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line bg-surface text-[12px] font-medium text-ink-soft transition-colors hover:border-line-3 hover:text-ink"
            >
              <Settings className="size-3.5" aria-hidden="true" />
              Settings
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border border-line bg-surface text-[12px] font-medium text-ink-soft transition-colors hover:border-risk/30 hover:text-risk"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-line lg:block" aria-label="Sidebar">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] border-r border-line shadow-xl">{content}</div>
        </div>
      ) : null}
    </>
  );
}
