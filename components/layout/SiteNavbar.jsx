"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { PUBLIC_NAV, PUBLIC_ACTIONS } from "@/lib/data/navigation";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import { useLockBodyScroll, useOnClickOutside, useReducedMotion } from "@/lib/hooks/useMotion";
import { useApp } from "@/lib/store/AppProvider";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";

const ICONS = {
  layers: "M12 2 2 7l10 5 10-5-10-5Z",
  route: "M6 19a3 3 0 1 0 0-6h12a3 3 0 1 0 0-6",
  compass: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z",
  "file-text": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z",
  sigma: "M18 4H6l6 8-6 8h12",
  "book-open": "M12 7v14M3 4h6a3 3 0 0 1 3 3v14a2.5 2.5 0 0 0-2.5-2.5H3Z",
  languages: "M4 5h9M8 3v2c0 4-2 8-5 9M6 12c1.5 3 4 5 7 6M13 21l5-12 5 12M15 16h6",
  "graduation-cap": "M22 9 12 5 2 9l10 4 10-4ZM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5",
  presentation: "M2 3h20M4 3v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3M12 16v5M8 21h8",
  "user-check": "M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM17 11l2 2 4-4",
  building: "M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4",
  "badge-dollar-sign": "M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z",
};

function NavIcon({ name, className }) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" className={cn("size-4", className)} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-transparent" aria-hidden="true">
      <div ref={barRef} className="h-px w-full origin-left bg-gradient-to-r from-brand via-accent to-transparent" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

function DesktopDropdown({ item, open, onToggle, onLeave, pathname }) {
  return (
    <div className="relative" onMouseEnter={onToggle} onMouseLeave={onLeave}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-md px-3 text-[13.5px] font-medium transition-colors duration-200",
          open || item.children?.some((c) => pathname.startsWith(c.href))
            ? "text-ink"
            : "text-ink-soft hover:text-ink",
        )}
      >
        {item.label}
        <ChevronDown className={cn("size-3.5 text-faint transition-transform duration-200", open && "rotate-180")} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-2"
          >
            <div className="overflow-hidden rounded-lg border border-line bg-surface p-1.5 shadow-lg">
              {item.children?.map((child) => {
                const active = pathname.startsWith(child.href);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "group flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors duration-150",
                      active ? "bg-brand-soft" : "hover:bg-surface-2",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border transition-colors",
                        active ? "border-brand-line bg-brand-soft text-brand" : "border-line bg-surface-2 text-muted group-hover:text-ink",
                      )}
                    >
                      <NavIcon name={child.icon} />
                    </span>
                    <span className="min-w-0">
                      <span className={cn("block text-[13.5px] font-medium", active ? "text-brand" : "text-ink")}>
                        {child.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-snug text-muted">{child.description}</span>
                    </span>
                    <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-line-3 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function SiteNavbar() {
  const pathname = usePathname();
  const { cms, settings } = useApp();
  const announcement = cms?.announcement?.enabled && cms?.announcement?.text ? cms.announcement.text : null;
  const maintenance = settings?.platform?.maintenance
    ? "Scheduled maintenance this Sunday 02:00–04:00. Diagnostics may pause briefly."
    : null;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const closeTimer = useRef(null);
  const reduced = useReducedMotion();

  useLockBodyScroll(mobileOpen);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 12);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const hoverOpen = (label) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  useEffect(() => () => closeTimer.current && clearTimeout(closeTimer.current), []);

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
          scrolled ? "nav-glass border-b border-line shadow-xs" : "border-b border-transparent bg-canvas",
        )}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-6 lg:h-[68px]">
            <Link href="/" className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand" aria-label="Prisma — home">
              <Logo suffix="Diagnostic Center" />
            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
              {PUBLIC_NAV.map((item) =>
                item.children ? (
                  <DesktopDropdown
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    open={openMenu === item.label}
                    onToggle={() => hoverOpen(item.label)}
                    onLeave={hoverClose}
                  />
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "inline-flex h-9 items-center rounded-md px-3 text-[13.5px] font-medium transition-colors duration-200",
                      isActive(item.href) ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              {PUBLIC_ACTIONS.map((action) => (
                <Button
                  key={action.href}
                  href={action.href}
                  variant={action.variant === "primary" ? "primary" : "ghost"}
                  size="sm"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 lg:hidden">
              <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log in
              </Button>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid size-10 place-items-center rounded-md border border-line bg-surface text-ink transition-colors hover:bg-surface-2"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="size-[18px]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        {scrolled ? <ScrollProgress /> : null}
      </header>
    </>
  );
}
