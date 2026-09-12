"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, FileText, FlaskConical, GraduationCap, Route, Search, Sigma, BookOpen, FileCheck2, Layers } from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import { PUBLIC_NAV, NAV_BY_ROLE, ADMIN_NAV } from "@/lib/data/navigation";
import { TOPICS } from "@/lib/data/topics";
import { topicHref } from "@/lib/data/topicRoutes";
import { navIcon } from "@/components/layout/navIcons";
import { cn } from "@/lib/utils";
import { useEscapeKey, useLockBodyScroll } from "@/lib/hooks/useMotion";

/**
 * Global search (Cmd/Ctrl + K). One palette for the whole product:
 * pages, topics, students, questions and tests — filtered by the current role.
 * Mounted once in the root layout; buttons open it by dispatching
 * `window.dispatchEvent(new CustomEvent("prisma:open-search"))`.
 */

export function openSearch() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("prisma:open-search"));
}

const match = (text, query) => (text ?? "").toLowerCase().includes(query);

export default function CommandPalette() {
  const router = useRouter();
  const { user, questions, tests, derived, hydrated } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const role = user?.role ?? "student";
  const isAdmin = role === "admin";

  useLockBodyScroll(open);
  useEscapeKey(() => setOpen(false), open);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("prisma:open-search", onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("prisma:open-search", onEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = [];

    /* pages: public nav + the current role's workspace + admin when admin */
    const pages = [];
    const seen = new Set();
    const pushPage = (label, href, icon, description) => {
      if (!href || seen.has(href)) return;
      if (q && !match(label, q) && !match(href, q) && !match(description, q)) return;
      seen.add(href);
      pages.push({ label, href, icon, description });
    };
    const walk = (items) => {
      for (const item of items) {
        pushPage(item.label, item.href, item.icon, item.description);
        if (item.children) walk(item.children);
      }
    };
    walk(PUBLIC_NAV);
    const roleNav = isAdmin ? ADMIN_NAV : (NAV_BY_ROLE[role] ?? NAV_BY_ROLE.student);
    for (const group of roleNav) walk(group.items);
    if (pages.length) out.push({ label: query ? "Pages" : "Pages — jump anywhere", items: pages.slice(0, 8) });

    /* topics */
    const topics = TOPICS.filter((topic) => !q || match(topic.name, q) || match(topic.summary, q))
      .slice(0, 5)
      .map((topic) => ({
        label: topic.name,
        href: topicHref(topic.id),
        icon: topic.subject === "math" ? Sigma : BookOpen,
        description: `${topic.subject === "math" ? "Mathematics" : "English"} · ${topic.level} · ${topic.summary}`,
      }));
    if (topics.length) out.push({ label: "Topics", items: topics });

    /* students (teachers + admin) */
    if (role === "teacher" || isAdmin) {
      const students = (derived.allStudents ?? [])
        .filter((student) => !q || match(student.name, q) || match(student.className, q))
        .slice(0, 5)
        .map((student) => ({
          label: student.name,
          href: isAdmin ? "/admin/students" : "/teacher/students",
          icon: GraduationCap,
          description: `${student.className} · overall ${student.overall ?? "—"}%`,
        }));
      if (students.length) out.push({ label: "Students", items: students });
    }

    /* questions + tests (admin) */
    if (isAdmin) {
      const qs = (questions ?? [])
        .filter((item) => !q || match(item.prompt, q) || match(item.topicId, q))
        .slice(0, 5)
        .map((item) => ({
          label: item.prompt,
          href: "/admin/questions",
          icon: FlaskConical,
          description: `${item.subject} · ${item.topicId} · ${item.difficulty} · ${item.type}`,
        }));
      if (qs.length) out.push({ label: "Question bank", items: qs });

      const ts = (tests ?? [])
        .filter((item) => !q || match(item.title, q))
        .slice(0, 4)
        .map((item) => ({
          label: item.title,
          href: "/admin/tests",
          icon: FileCheck2,
          description: `${item.subject} · ${item.questionCount} questions · ${item.status}`,
        }));
      if (ts.length) out.push({ label: "Tests", items: ts });
    }

    return out;
  }, [query, role, isAdmin, derived.allStudents, questions, tests, hydrated]);

  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  useEffect(() => setCursor(0), [query]);

  const go = (href) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12dvh]" role="dialog" aria-modal="true" aria-label="Global search">
      <button
        type="button"
        aria-label="Close search"
        className="absolute inset-0 cursor-default bg-ink/35 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
        tabIndex={-1}
      />
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_70px_-18px_rgba(16,24,43,0.35)]">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-[17px] shrink-0 text-faint" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((prev) => Math.min(flat.length - 1, prev + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((prev) => Math.max(0, prev - 1));
              } else if (event.key === "Enter") {
                event.preventDefault();
                if (flat[cursor]) go(flat[cursor].href);
              }
            }}
            placeholder="Search pages, topics, students, questions…"
            aria-label="Search query"
            className="h-12 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
          />
          <kbd className="hidden shrink-0 rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10.5px] text-muted sm:block">ESC</kbd>
        </div>

        <div ref={listRef} className="scroll-slim max-h-[52dvh] overflow-y-auto px-2 py-2" role="listbox" aria-label="Search results">
          {flat.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-muted">
              No results for “{query}”. Try a topic name like <em>fractions</em> or a page like <em>pricing</em>.
            </p>
          ) : null}
          {groups.map((group) => (
            <div key={group.label} className="mb-1 last:mb-0">
              <p className="px-3 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">{group.label}</p>
              {group.items.map((item) => {
                flatIndex += 1;
                const active = flatIndex === cursor;
                const Icon = typeof item.icon === "string" ? navIcon(item.icon) : item.icon;
                const ResolvedIcon = Icon ?? (item.href.startsWith("/student") ? Route : Layers);
                const index = flatIndex;
                return (
                  <button
                    key={`${group.label}-${item.href}-${item.label}`}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => go(item.href)}
                    onMouseEnter={() => setCursor(index)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                      active ? "bg-brand-soft" : "hover:bg-surface-2",
                    )}
                  >
                    <ResolvedIcon className={cn("mt-0.5 size-[16px] shrink-0", active ? "text-brand" : "text-muted")} aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-ink">{item.label}</span>
                      {item.description ? (
                        <span className="mt-0.5 block truncate text-[11.5px] text-muted">{item.description}</span>
                      ) : null}
                    </span>
                    {active ? <CornerDownLeft className="mt-1 size-[14px] shrink-0 text-brand" aria-hidden="true" /> : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-surface-2/60 px-4 py-2 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-line bg-surface px-1 py-px font-mono text-[10px]">↑↓</kbd> navigate
            <kbd className="ml-1 rounded border border-line bg-surface px-1 py-px font-mono text-[10px]">↵</kbd> open
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <FileText className="size-[13px]" aria-hidden="true" /> Prisma demo data — nothing leaves this browser
          </span>
        </div>
      </div>
    </div>
  );
}
