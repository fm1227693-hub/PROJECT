"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardTopbar from "@/components/layout/DashboardTopbar";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { useLockBodyScroll } from "@/lib/hooks/useMotion";

/**
 * Workspace chrome. Deliberately unrelated to the public navigation: a fixed
 * rail on desktop, a drawer + bottom tab bar on mobile.
 */
export default function AppShell({ navKey = "student", title, breadcrumb, children }) {
  const [navOpen, setNavOpen] = useState(false);
  useLockBodyScroll(navOpen);

  return (
    <div className="min-h-dvh bg-canvas">
      <DashboardSidebar navKey={navKey} open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex min-h-dvh flex-col lg:pl-[264px]">
        <DashboardTopbar
          onOpenNav={() => setNavOpen(true)}
          breadcrumb={breadcrumb}
          title={title}
          navKey={navKey}
        />

        <main
          id="main"
          className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7"
          tabIndex={-1}
        >
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>

      <MobileTabBar role={navKey} />
    </div>
  );
}
