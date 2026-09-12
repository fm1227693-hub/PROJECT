/**
 * Brand constants + design tokens shared by marketing and product surfaces.
 * Kept in one place so a rebrand never touches component code.
 */

export const BRAND = {
  name: "Prisma",
  legalName: "Prisma Learning Technologies",
  product: "Math & English Diagnostic Center",
  tagline: "Know exactly what to learn next.",
  hero: "Know what you know. Know what to learn next.",
  summary:
    "Prisma turns a single score into a precise map of your mathematical and linguistic skills — then builds the learning path that follows from it.",
  email: "hello@prisma.education",
  support: "support@prisma.education",
  founded: 2024,
  address: "Prisma Learning Technologies · Remote-first · EU & UK",
};

/** The brand metaphor: one score in, a full spectrum of skills out. */
export const BRAND_STORY = {
  problem: "A score tells you almost nothing.",
  insight:
    "Two students can both score 68% in Mathematics and need completely different help. One is losing marks on quadratic equations, the other on ratios. The number hides the reason.",
  promise:
    "Prisma separates a result into the skills that produced it, ranks them by how much they hold a learner back, and turns the weakest ones into a sequenced plan.",
};

export const SOCIALS = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "YouTube", href: "#" },
];

export const SUBJECT_META = {
  math: {
    id: "math",
    name: "Mathematics",
    short: "Math",
    accent: "math",
    textClass: "text-math",
    bgClass: "bg-math-soft",
    borderClass: "border-brand-line",
    dotClass: "bg-math",
    blurb:
      "From number sense to functions — measured topic by topic, not as one undifferentiated grade.",
  },
  english: {
    id: "english",
    name: "English",
    short: "English",
    accent: "english",
    textClass: "text-english",
    bgClass: "bg-english-soft",
    borderClass: "border-accent-line",
    dotClass: "bg-english",
    blurb:
      "Grammar, vocabulary, reading and listening — each reported as its own measurable skill.",
  },
};

/** Mastery bands used across dashboards, reports and recommendations. */
export const MASTERY_BANDS = [
  {
    id: "strong",
    label: "Strong",
    min: 80,
    tone: "strong",
    meaning: "Reliable under time pressure. Maintain with occasional review.",
  },
  {
    id: "developing",
    label: "Developing",
    min: 60,
    tone: "developing",
    meaning: "Workable, but errors cluster on harder variations.",
  },
  {
    id: "at-risk",
    label: "Needs work",
    min: 0,
    tone: "risk",
    meaning: "A real gap. This is where the next hours of study should go.",
  },
];

export function bandFor(score) {
  const value = Number(score) || 0;
  return MASTERY_BANDS.find((band) => value >= band.min) ?? MASTERY_BANDS[MASTERY_BANDS.length - 1];
}

/** Tailwind token map per tone — avoids conditional class strings that break JIT. */
export const TONE_CLASSES = {
  strong: {
    text: "text-strong",
    bg: "bg-strong-soft",
    border: "border-strong/25",
    bar: "bg-strong",
    dot: "bg-strong",
    chip: "bg-strong-soft text-strong border-strong/20",
    stroke: "#14855c",
  },
  developing: {
    text: "text-developing",
    bg: "bg-developing-soft",
    border: "border-developing/25",
    bar: "bg-developing",
    dot: "bg-developing",
    chip: "bg-developing-soft text-developing border-developing/20",
    stroke: "#b8791a",
  },
  risk: {
    text: "text-risk",
    bg: "bg-risk-soft",
    border: "border-risk/25",
    bar: "bg-risk",
    dot: "bg-risk",
    chip: "bg-risk-soft text-risk border-risk/20",
    stroke: "#bf4a3f",
  },
  brand: {
    text: "text-brand",
    bg: "bg-brand-soft",
    border: "border-brand-line",
    bar: "bg-brand",
    dot: "bg-brand",
    chip: "bg-brand-soft text-brand border-brand-line",
    stroke: "#2b4fe0",
  },
  accent: {
    text: "text-accent",
    bg: "bg-accent-soft",
    border: "border-accent-line",
    bar: "bg-accent",
    dot: "bg-accent",
    chip: "bg-accent-soft text-accent border-accent-line",
    stroke: "#7a5cd6",
  },
  neutral: {
    text: "text-muted",
    bg: "bg-surface-3",
    border: "border-line",
    bar: "bg-ink-soft",
    dot: "bg-muted",
    chip: "bg-surface-3 text-muted border-line",
    stroke: "#6d7789",
  },
};

export const toneForScore = (score) => bandFor(score).tone;
