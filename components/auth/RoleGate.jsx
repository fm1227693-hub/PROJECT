"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/lib/store/AppProvider";
import { cn } from "@/lib/utils";

/**
 * Mock role gate. Wraps a route group's layout and enforces access rules:
 *
 *  - anonymous visitors → /login (admins → /admin/login)
 *  - pending/rejected teachers → /pending-approval
 *  - wrong role → their own workspace home
 *
 * The whole auth layer lives in the store, so replacing it with real auth
 * later only changes AppProvider + this file.
 */

const HOME = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  school: "/school/dashboard",
  admin: "/admin",
};

function GateSkeleton({ label }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-6" role="status" aria-live="polite">
      <div className="w-full max-w-sm text-center">
        <div className={cn("mx-auto size-10 animate-pulse rounded-full bg-brand-soft")} aria-hidden="true" />
        <p className="mt-4 text-[13px] font-medium text-ink-soft">{label}</p>
        <p className="mt-1 text-[12px] text-muted">Checking your workspace access…</p>
      </div>
    </div>
  );
}

export default function RoleGate({ require = "student", children }) {
  const router = useRouter();
  const { hydrated, status, user, teacherStatus } = useApp();

  const role = user?.role ?? "student";
  const signedIn = status === "active";

  let allowed = false;
  if (!hydrated) allowed = false;
  else if (require === "admin") allowed = signedIn && role === "admin";
  else if (require === "teacher") allowed = signedIn && (role === "admin" || (role === "teacher" && teacherStatus === "approved"));
  else if (require === "school") allowed = signedIn && (role === "admin" || role === "school");
  else allowed = signedIn && (role === "student" || role === "admin");

  useEffect(() => {
    if (!hydrated || allowed) return;
    let target = HOME[role] ?? "/login";
    if (!signedIn) target = require === "admin" ? "/admin/login" : "/login";
    else if (require === "admin") target = HOME[role] ?? "/";
    else if (require === "teacher" && role === "teacher") target = "/pending-approval";
    else if (require === "teacher" && role !== "admin") target = HOME[role] ?? "/";
    else if (require === "school" && role !== "admin") target = HOME[role] ?? "/";
    else if (require === "student" && role === "teacher" && teacherStatus !== "approved") target = "/pending-approval";
    router.replace(target);
  }, [hydrated, allowed, signedIn, role, teacherStatus, require, router]);

  if (!hydrated) return <GateSkeleton label="Loading your workspace" />;
  if (!allowed) return <GateSkeleton label={`This area is for ${require} accounts`} />;
  return children;
}
