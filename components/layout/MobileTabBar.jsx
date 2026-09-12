"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MOBILE_TABS } from "@/lib/data/navigation";
import { navIcon } from "@/components/layout/navIcons";

const ROLE_TABS = {
  student: MOBILE_TABS,
  teacher: [
    { label: "Dashboard", href: "/teacher/dashboard", icon: "layout-dashboard" },
    { label: "Students", href: "/teacher/students", icon: "users" },
    { label: "Assign", href: "/teacher/classes", icon: "send" },
    { label: "Classes", href: "/teacher/classes", icon: "bar-chart-3" },
    { label: "Bank", href: "/teacher/analytics", icon: "library" },
  ],
  school: [
    { label: "Dashboard", href: "/school/dashboard", icon: "layout-dashboard" },
    { label: "Students", href: "/school/analytics", icon: "users" },
    { label: "Teachers", href: "/school/dashboard", icon: "presentation" },
    { label: "Analytics", href: "/school/analytics", icon: "activity" },
  ],
  account: [
    { label: "Settings", href: "/settings", icon: "settings" },
    { label: "Billing", href: "/billing", icon: "credit-card" },
  ],
};

export default function MobileTabBar({ role = "student" }) {
  const pathname = usePathname();
  const tabs = ROLE_TABS[role] ?? ROLE_TABS.student;

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-[8px] lg:hidden"
      aria-label="Quick navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {tabs.map((tab) => {
          const Icon = navIcon(tab.icon);
          const active = isActive(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-1 transition-colors duration-200",
                  active ? "text-brand" : "text-muted",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0 h-[2px] w-8 rounded-b-full bg-brand transition-[opacity,transform] duration-250",
                    active ? "scale-x-100 opacity-100" : "scale-x-50 opacity-0",
                  )}
                  aria-hidden="true"
                />
                {Icon ? <Icon className="size-[19px]" aria-hidden="true" /> : null}
                <span className="text-[10.5px] font-medium leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
