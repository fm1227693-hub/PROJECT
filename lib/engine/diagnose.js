import { topicHref } from "@/lib/data/topicRoutes";
import { DOMAINS, TOPICS, SUBJECT_TOPICS, TOTAL_WEIGHT } from "@/lib/data/topics";
import { bandFor } from "@/lib/data/brand";
import { buildResult, subjectScore } from "@/lib/engine/scoring";
import { round, sortBy } from "@/lib/utils";

/**
 * Diagnosis engine — the layer that turns scores into meaning.
 *
 * Core idea: a gap is only worth attention in proportion to how much of the
 * subject it explains. `impact` = weight × deficit, expressed as the number of
 * overall points a learner would recover by closing that gap to "Strong".
 */

export const STRONG_THRESHOLD = 80;
export const RISK_THRESHOLD = 60;
/** The score we assume a learner can realistically reach with focused work. */
export const TARGET_SCORE = 80;

export function classify(score) {
  if (score >= STRONG_THRESHOLD) return "strong";
  if (score >= RISK_THRESHOLD) return "developing";
  return "at-risk";
}

/** Points recoverable on the subject score if this topic reaches TARGET_SCORE. */
export function impactOf(topic, score) {
  const totalWeight = TOTAL_WEIGHT[topic.subject] ?? 100;
  const deficit = Math.max(0, TARGET_SCORE - score);
  return round((topic.weight / totalWeight) * deficit, 1);
}

/** Ranked list of gaps, most valuable to fix first. */
export function prioritiseGaps(topicScores = {}, subject, { threshold = RISK_THRESHOLD } = {}) {
  const topics = SUBJECT_TOPICS[subject] ?? [];
  const rows = topics
    .filter((topic) => typeof topicScores[topic.id] === "number")
    .filter((topic) => topicScores[topic.id] < threshold)
    .map((topic) => {
      const score = round(topicScores[topic.id], 0);
      return {
        ...topic,
        domainName: DOMAINS[topic.domain]?.short ?? "",
        score,
        deficit: round(TARGET_SCORE - score, 0),
        impact: impactOf(topic, score),
        band: bandFor(score),
      };
    });

  return sortBy(rows, (row) => row.impact, "desc");
}

export function strengths(topicScores = {}, subject) {
  const topics = SUBJECT_TOPICS[subject] ?? [];
  return sortBy(
    topics
      .filter((topic) => typeof topicScores[topic.id] === "number")
      .filter((topic) => topicScores[topic.id] >= STRONG_THRESHOLD)
      .map((topic) => ({ ...topic, score: round(topicScores[topic.id], 0), band: bandFor(topicScores[topic.id]) })),
    (row) => row.score,
    "desc",
  );
}

export function developingSkills(topicScores = {}, subject) {
  const topics = SUBJECT_TOPICS[subject] ?? [];
  return sortBy(
    topics
      .filter((t) => typeof topicScores[t.id] === "number")
      .filter((t) => t.id in topicScores && topicScores[t.id] >= RISK_THRESHOLD && topicScores[t.id] < STRONG_THRESHOLD)
      .map((topic) => ({ ...topic, score: round(topicScores[topic.id], 0), band: bandFor(topicScores[topic.id]) })),
    (row) => row.score,
    "desc",
  );
}

/* ------------------------------------------------------------------ *
 * Plain-language explanation
 * ------------------------------------------------------------------ */

const listify = (items, conjunction = "and") => {
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, ${conjunction} ${items[items.length - 1]}`;
};

export const lower = (name = "") => name.toLowerCase();

/**
 * The sentence the whole product exists to produce:
 * "You are strong in linear equations but need more practice with quadratic
 *  equations and inequalities."
 */
export function explainSubject(topicScores = {}, subject) {
  const strong = strengths(topicScores, subject).slice(0, 2).map((t) => lower(t.name));
  const gaps = prioritiseGaps(topicScores, subject).slice(0, 2).map((t) => lower(t.name));
  const score = subjectScore(topicScores, subject);
  const subjectName = subject === "math" ? "Mathematics" : "English";

  if (!strong.length && !gaps.length) {
    return `Your ${subjectName} results are evenly spread around ${score}%. A full diagnostic will show where to focus.`;
  }
  if (!gaps.length) {
    return `You are consistently strong in ${subjectName}${strong.length ? ` — especially ${listify(strong)}` : ""}. Move on to harder material to keep progressing.`;
  }
  if (!strong.length) {
    return `${subjectName} is currently your weaker subject. The gaps that cost you the most are ${listify(gaps)}.`;
  }
  return `You are strong in ${listify(strong)} but need more practice with ${listify(gaps)}.`;
}

/** Full narrative across both subjects. */
export function explainProfile(topicScores = {}) {
  const math = explainSubject(topicScores, "math");
  const english = explainSubject(topicScores, "english");
  return `${math} ${english}`;
}

/** One-line diagnosis used as a page headline. */
export function headline(topicScores = {}) {
  const mathGaps = prioritiseGaps(topicScores, "math");
  const englishGaps = prioritiseGaps(topicScores, "english");
  const worst = [...mathGaps, ...englishGaps].sort((a, b) => b.impact - a.impact)[0];
  if (!worst) return "No significant gaps detected — time to go deeper.";
  const subjectName = worst.subject === "math" ? "Mathematics" : "English";
  return `${worst.name} is costing you the most in ${subjectName}.`;
}

/* ------------------------------------------------------------------ *
 * Trend analysis between two diagnostics
 * ------------------------------------------------------------------ */

export function compareSnapshots(previous = {}, current = {}) {
  return TOPICS.map((topic) => {
    const before = previous[topic.id];
    const after = current[topic.id];
    if (typeof before !== "number" || typeof after !== "number") return null;
    return {
      id: topic.id,
      name: topic.name,
      subject: topic.subject,
      domain: DOMAINS[topic.domain]?.short ?? "",
      before: round(before, 0),
      after: round(after, 0),
      delta: round(after - before, 0),
    };
  }).filter(Boolean);
}

export function biggestGains(previous = {}, current = {}, limit = 3) {
  return sortBy(compareSnapshots(previous, current), (r) => r.delta, "desc").slice(0, limit);
}

export function biggestSlips(previous = {}, current = {}, limit = 3) {
  return sortBy(compareSnapshots(previous, current), (r) => r.delta, "asc").slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * The single "what should the user do next" answer
 * ------------------------------------------------------------------ */

export function nextStep(topicScores = {}) {
  const gaps = [
    ...prioritiseGaps(topicScores, "math").map((t) => ({ ...t, subjectName: "Mathematics" })),
    ...prioritiseGaps(topicScores, "english").map((t) => ({ ...t, subjectName: "English" })),
  ].sort((a, b) => b.impact - a.impact);

  if (!gaps.length) {
    return {
      topic: null,
      title: "Take an advanced challenge set",
      reason: "Every measured skill is at or above 80%. Push into harder material to keep growing.",
      href: "/student/practice?difficulty=advanced",
      impact: 0,
      subjectName: null,
    };
  }

  const top = gaps[0];
  const firstUnit = top.units?.[0] ?? { title: `${top.name} fundamentals`, minutes: 15 };

  return {
    topic: top,
    topicId: top.id,
    subject: top.subject,
    subjectName: top.subjectName,
    title: `${top.name} — ${firstUnit.title}`,
    reason: `At ${top.score}%, this is the single gap holding your ${top.subjectName} score back the most. Closing it is worth about ${top.impact} points.`,
    href: topicHref(top.id),
    impact: top.impact,
    minutes: firstUnit.minutes,
  };
}

/** Everything a report screen needs, in one call. */
export function diagnose(topicScores = {}, options = {}) {
  const result = buildResult(topicScores, options.meta);
  const mathGaps = prioritiseGaps(topicScores, "math");
  const englishGaps = prioritiseGaps(topicScores, "english");

  const diagnosis = {
    result,
    math: {
      score: result.math.score,
      band: bandFor(result.math.score),
      strengths: strengths(topicScores, "math"),
      developing: developingSkills(topicScores, "math"),
      gaps: mathGaps,
      explanation: explainSubject(topicScores, "math"),
    },
    english: {
      score: result.english.score,
      band: bandFor(result.english.score),
      strengths: strengths(topicScores, "english"),
      developing: developingSkills(topicScores, "english"),
      gaps: englishGaps,
      explanation: explainSubject(topicScores, "english"),
    },
    headline: headline(topicScores),
    narrative: explainProfile(topicScores),
    nextStep: nextStep(topicScores),
    focusSubject: result.math.score <= result.english.score ? "math" : "english",
    topGaps: sortBy([...mathGaps, ...englishGaps], (g) => g.impact, "desc"),
  };

  return diagnosis;
}

/** Class-level diagnosis used by teacher and school dashboards. */
export function diagnoseCohort(students = [], subject) {
  const buckets = new Map();
  for (const student of students) {
    const scores = student.topicScores ?? {};
    for (const topic of SUBJECT_TOPICS[subject] ?? []) {
      if (typeof scores[topic.id] !== "number") continue;
      const entry = buckets.get(topic.id) ?? { topicId: topic.id, name: topic.name, values: [] };
      entry.values.push(scores[topic.id]);
      buckets.set(topic.id, entry);
    }
  }

  return Array.from(buckets.values())
    .map((entry) => ({
      topicId: entry.topicId,
      name: entry.name,
      score: round(entry.values.reduce((a, b) => a + b, 0) / entry.values.length, 0),
      students: entry.values.length,
      atRisk: entry.values.filter((v) => v < RISK_THRESHOLD).length,
    }))
    .sort((a, b) => a.score - b.score);
}
