"use client";

import { usePathname } from "next/navigation";

import RoleGate from "@/components/auth/RoleGate";
import AdminShell from "@/components/layout/AdminShell";

/**
 * Wraps the /admin route group: the admin login page stays public, everything
 * else is gated to the admin role and rendered inside AdminShell.
 */
export default function AdminGate({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return children;

  return (
    <RoleGate require="admin">
      <AdminShell>{children}</AdminShell>
    </RoleGate>
  );
}
