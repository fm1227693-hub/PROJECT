import { clsx } from "clsx";

/** Conditional classnames — the single styling helper used everywhere. */
export function cn(...inputs) {
  return clsx(inputs);
}

export const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export const round = (value, digits = 0) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

/** 0.682 -> "68%", 68 -> "68%" */
export function pct(value, digits = 0) {
  const n = typeof value === "number" && value <= 1 ? value * 100 : value;
  return `${round(Number.isFinite(n) ? n : 0, digits)}%`;
}

export const average = (values) => {
  const list = (values || []).filter((v) => typeof v === "number" && Number.isFinite(v));
  if (!list.length) return 0;
  return round(list.reduce((a, b) => a + b, 0) / list.length, 1);
};

export const sum = (values) => (values || []).reduce((a, b) => a + (Number(b) || 0), 0);

export const uid = (prefix = "id") => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

/** "2026-04-18" -> "18 Apr 2026" */
export function formatDate(input, opts = {}) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatRelative(input) {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";
  const diffDays = Math.round((date.getTime() - Date.now()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0 && diffDays > -30) return `${Math.abs(diffDays)} days ago`;
  if (diffDays < 0) return `${Math.round(Math.abs(diffDays) / 30)} mo ago`;
  return `in ${diffDays} days`;
}

/** 125 -> "2:05" */
export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function formatMinutes(mins) {
  if (!mins && mins !== 0) return "—";
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const formatNumber = (n) => new Intl.NumberFormat("en-US").format(Number(n) || 0);

export function formatCurrency(amount, currency = "USD", digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(amount) || 0);
}

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const sortBy = (list, key, dir = "desc") =>
  [...(list || [])].sort((a, b) => {
    const av = typeof key === "function" ? key(a) : a?.[key];
    const bv = typeof key === "function" ? key(b) : b?.[key];
    if (av === bv) return 0;
    const r = av > bv ? 1 : -1;
    return dir === "desc" ? r : -r;
  });

export const groupBy = (list, key) =>
  (list || []).reduce((acc, item) => {
    const k = typeof key === "function" ? key(item) : item?.[key];
    (acc[k] ||= []).push(item);
    return acc;
  }, {});

/** Deterministic pseudo-random so demo data is stable between renders. */
export function seeded(seed = 1) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function isEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
}

export function deepMerge(base = {}, override = {}) {
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = deepMerge(out[key] || {}, value);
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}
