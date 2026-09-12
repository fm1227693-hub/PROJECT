"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** True when the visitor asked for reduced motion. Reactive to OS changes. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, [query]);

  return matches;
}

/**
 * Fires once when the element enters the viewport — used to trigger chart
 * entrance animations so charts never animate continuously.
 */
export function useInViewOnce(options = {}) {
  const { rootMargin = "0px 0px -12% 0px", threshold = 0.15 } = options;
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return [ref, inView];
}

/** Track which section id is currently active (for in-page nav highlights). */
export function useActiveSection(ids = [], offset = 120) {
  const [active, setActive] = useState(ids[0] ?? null);

  useEffect(() => {
    if (typeof window === "undefined" || !ids.length) return undefined;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= offset) current = id;
        }
        setActive(current);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [ids.join("|"), offset]); // eslint-disable-line react-hooks/exhaustive-deps

  return active;
}

export function useOnClickOutside(ref, handler, enabled = true) {
  const saved = useRef(handler);
  saved.current = handler;

  useEffect(() => {
    if (!enabled) return undefined;
    const listener = (event) => {
      const el = ref?.current;
      if (!el || el.contains(event.target)) return;
      saved.current?.(event);
    };
    document.addEventListener("pointerdown", listener);
    document.addEventListener("touchstart", listener, { passive: true });
    return () => {
      document.removeEventListener("pointerdown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, enabled]);
}

export function useLockBodyScroll(locked = false) {
  useEffect(() => {
    if (!locked || typeof document === "undefined") return undefined;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

/** Move focus into a container and keep it trapped (modals, mobile menu). */
export function useFocusTrap(ref, active = true) {
  useEffect(() => {
    if (!active) return undefined;
    const el = ref?.current;
    if (!el) return undefined;

    const selector =
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';
    const previous = document.activeElement;

    const nodes = () => Array.from(el.querySelectorAll(selector)).filter((n) => n.offsetParent !== null);
    const first = nodes()[0];
    first?.focus?.();

    const onKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const list = nodes();
      if (!list.length) return;
      const idx = list.indexOf(document.activeElement);
      if (event.shiftKey && idx <= 0) {
        event.preventDefault();
        list[list.length - 1].focus();
      } else if (!event.shiftKey && idx === list.length - 1) {
        event.preventDefault();
        list[0].focus();
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => {
      el.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [ref, active]);
}

/** localStorage-backed state that is SSR-safe (hydrates after mount). */
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw));
    } catch {
      /* storage unavailable — keep the default */
    }
    hydrated.current = true;
  }, [key]);

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore quota / privacy-mode errors */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated.current];
}

/** Escape-key listener. */
export function useEscapeKey(handler, enabled = true) {
  const saved = useRef(handler);
  saved.current = handler;

  useEffect(() => {
    if (!enabled) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") saved.current?.(event);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
