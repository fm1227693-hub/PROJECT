import { DOMAINS, SUBJECT_TOPICS } from "@/lib/data/topics";
import { bandFor } from "@/lib/data/brand";
import { prioritiseGaps, STRONG_THRESHOLD, TARGET_SCORE, classify } from "@/lib/engine/diagnose";
import { buildResult } from "@/lib/engine/scoring";
import { round, sortBy, sum } from "@/lib/utils";

/**
 * Recommendation engine — turns a diagnosis into a sequenced learning path.
 *
 * Rules (deliberately simple, explainable, backend-portable):
 *   1. Rank every gap by impact = topic weight × deficit from "Strong".
 *   2. Expand the highest-impact gaps into their topic learning units.
 *   3. Pack units into weeks that respect the learner's weekly study budget.
 *   4. Every week ends with practice, every second week ends with an assessment.
 *   5. Project the resulting scores so the learner can see the payoff.
 */

const IMPROVEMENT_FACTOR = 0.72; // realistic share of a deficit a plan closes

export const PATH_PRESETS = {
  balanced: { label: "Balanced", weeklyMinutes: 240, weeks: 6 },
  intensive: { label: "Intensive", weeklyMinutes: 420, weeks: 4 },
  gentle: { label: "Steady", weeklyMinutes: 120, weeks: 8 },
};

function unitKey(unit, index) {
  return `${unit.title}-${index}-${unit.type}`;
}

/**
 * @param {Record<string, number>} topicScores
 * @param {{weeks?: number, weeklyMinutes?: number, subjects?: string[], maxTopics?: number}} options
 */
export function buildLearningPath(topicScores = {}, options = {}) {
  const {
    weeks: maxWeeks = 6,
    weeklyMinutes = 240,
    subjects = ["math", "english"],
    maxTopics = 6,
  } = options;

  const gaps = subjects
    .flatMap((subject) => prioritiseGaps(topicScores, subject))
    .sort((a, b) => b.impact - a.impact)
    .slice(0, maxTopics);

  if (!gaps.length) {
    return emptyPath(topicScores, options);
  }

  const pathWeeks = [];
  let weekIndex = 0;

  for (const gap of gaps) {
    if (weekIndex >= maxWeeks) break;

    const units = (gap.units ?? []).map((unit, i) => ({
      key: unitKey(unit, i),
      title: unit.title,
      minutes: unit.minutes,
      type: unit.type,
      topicId: gap.id,
      topicName: gap.name,
      subject: gap.subject,
      order: i + 1,
      status: "planned",
    }));

    // A week holds as many units as fit the study budget; overflow rolls over.
    let buffer = [];
    let bufferMinutes = 0;

    const flush = (isLast) => {
      if (!buffer.length) return;
      weekIndex += 1;
      pathWeeks.push(
        makeWeek({
          index: weekIndex,
          gap,
          units: buffer,
          minutes: bufferMinutes,
          isLast: isLast && weekIndex % 2 === 0,
        }),
      );
      buffer = [];
      bufferMinutes = 0;
    };

    for (const unit of units) {
      if (bufferMinutes + unit.minutes > weeklyMinutes && buffer.length) flush(false);
      buffer.push(unit);
      bufferMinutes += unit.minutes;
    }
    flush(true);

    if (weekIndex >= maxWeeks) break;
  }

  // Guarantee every plan ends with a checkpoint assessment.
  const last = pathWeeks[pathWeeks.length - 1];
  if (last && !last.units.some((u) => u.type === "assessment")) {
    last.units.push({
      key: `checkpoint-${last.index}`,
      title: "Checkpoint assessment",
      minutes: 12,
      type: "assessment",
      topicId: last.topicId,
      topicName: last.topicName,
      subject: last.subject,
      order: last.units.length + 1,
      status: "planned",
    });
    last.minutes = sum(last.units.map((u) => u.minutes));
  }

  const projection = projectScores(topicScores, pathWeeks);

  return {
    id: `path_${Date.now().toString(36)}`,
    generatedAt: new Date().toISOString(),
    preset: weeklyMinutes,
    focusTopics: gaps.map((g) => ({
      id: g.id,
      name: g.name,
      subject: g.subject,
      domain: DOMAINS[g.domain]?.short ?? "",
      score: g.score,
      impact: g.impact,
      band: g.band,
    })),
    weeks: pathWeeks,
    totalMinutes: sum(pathWeeks.map((w) => w.minutes)),
    weeklyMinutes,
    projection,
    summary: summarise(gaps, pathWeeks.length),
  };
}

function makeWeek({ index, gap, units, minutes, isLast }) {
  const expectedGain = round(Math.max(0, TARGET_SCORE - gap.score) * IMPROVEMENT_FACTOR, 0);
  return {
    index,
    label: `Week ${index}`,
    topicId: gap.id,
    topicName: gap.name,
    subject: gap.subject,
    subjectName: gap.subject === "math" ? "Mathematics" : "English",
    domain: DOMAINS[gap.domain]?.name ?? "",
    goal: goalFor(gap, index),
    fromScore: gap.score,
    toScore: Math.min(100, gap.score + expectedGain),
    expectedGain,
    impact: gap.impact,
    minutes,
    units,
    unitCount: units.length,
    hasAssessment: units.some((u) => u.type === "assessment") || isLast,
    status: "planned",
  };
}

function goalFor(gap, index) {
  const band = bandFor(gap.score);
  if (index === 1) {
    return `Rebuild the fundamentals of ${gap.name.toLowerCase()} until the standard variations are automatic.`;
  }
  if (band.id === "at-risk") {
    return `Move ${gap.name} out of the risk band and hold it above 60%.`;
  }
  return `Consolidate ${gap.name} so it stops costing marks under time pressure.`;
}

function summarise(gaps, weekCount) {
  const names = gaps.slice(0, 3).map((g) => g.name);
  const list = names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  return `${weekCount} weeks targeted at ${list} — the gaps that explain most of your current score.`;
}

function emptyPath(topicScores, options) {
  const result = buildResult(topicScores);
  return {
    id: "path_empty",
    generatedAt: new Date().toISOString(),
    preset: options.weeklyMinutes ?? 240,
    focusTopics: [],
    weeks: [],
    totalMinutes: 0,
    weeklyMinutes: options.weeklyMinutes ?? 240,
    projection: {
      math: { now: result.math.score, after: result.math.score, delta: 0 },
      english: { now: result.english.score, after: result.english.score, delta: 0 },
      overall: { now: result.overall, after: result.overall, delta: 0 },
    },
    summary: "No gaps below the threshold. Your plan focuses on depth rather than repair.",
    isEmpty: true,
  };
}

/** Projected scores if every week in the plan is completed. */
export function projectScores(topicScores = {}, weeks = []) {
  const projected = { ...topicScores };
  for (const week of weeks) {
    const current = projected[week.topicId];
    if (typeof current !== "number") continue;
    projected[week.topicId] = Math.min(100, Math.round(current + week.expectedGain));
  }

  const now = buildResult(topicScores);
  const after = buildResult(projected);

  return {
    math: { now: now.math.score, after: after.math.score, delta: after.math.score - now.math.score },
    english: { now: now.english.score, after: after.english.score, delta: after.english.score - now.english.score },
    overall: { now: now.overall, after: after.overall, delta: after.overall - now.overall },
    projectedTopicScores: projected,
  };
}

/** The next unit to work on across the whole plan. */
export function currentUnit(path, progress = {}) {
  if (!path?.weeks?.length) return null;
  for (const week of path.weeks) {
    for (const unit of week.units) {
      if (!progress[unit.key]?.completed) {
        return { week, unit };
      }
    }
  }
  return null;
}

export function pathProgress(path, progress = {}) {
  const units = (path?.weeks ?? []).flatMap((w) => w.units);
  const done = units.filter((u) => progress[u.key]?.completed).length;
  const minutesDone = units
    .filter((u) => progress[u.key]?.completed)
    .reduce((acc, u) => acc + (u.minutes || 0), 0);
  return {
    total: units.length,
    completed: done,
    percent: units.length ? round((done / units.length) * 100, 0) : 0,
    minutesTotal: sum(units.map((u) => u.minutes || 0)),
    minutesDone,
  };
}

/* ------------------------------------------------------------------ *
 * Practice recommendations
 * ------------------------------------------------------------------ */

export function recommendPractice(topicScores = {}, { subject, limit = 6 } = {}) {
  const subjects = subject ? [subject] : ["math", "english"];
  const rows = subjects.flatMap((s) => prioritiseGaps(topicScores, s, { threshold: STRONG_THRESHOLD }));
  return sortByImpact(rows).slice(0, limit).map((topic) => ({
    id: `practice_${topic.id}`,
    topicId: topic.id,
    topicName: topic.name,
    subject: topic.subject,
    domain: DOMAINS[topic.domain]?.short ?? "",
    score: topic.score,
    band: topic.band,
    impact: topic.impact,
    level: classify(topic.score) === "at-risk" ? "foundation" : "core",
    itemCount: topic.units.find((u) => u.type === "practice") ? 18 : 12,
    minutes: topic.units.find((u) => u.type === "practice")?.minutes ?? 12,
    reason:
      topic.score < 60
        ? `Below the risk threshold — ${topic.deficit} points from a strong score.`
        : `Developing. Targeted reps will move it past ${STRONG_THRESHOLD}%.`,
  }));
}

const sortByImpact = (rows) => [...rows].sort((a, b) => b.impact - a.impact);

/** Maintenance suggestions for skills that are already strong. */
export function recommendReview(topicScores = {}, { subject, limit = 3 } = {}) {
  const subjects = subject ? [subject] : ["math", "english"];
  const rows = subjects.flatMap((s) =>
    (SUBJECT_TOPICS[s] ?? [])
      .filter((topic) => (topicScores[topic.id] ?? 0) >= STRONG_THRESHOLD)
      .map((topic) => ({
        id: topic.id,
        topicId: topic.id,
        name: topic.name,
        subject: topic.subject,
        domain: DOMAINS[topic.domain]?.short ?? "",
        score: round(topicScores[topic.id], 0),
        cadence: topic.weight >= 10 ? "Weekly" : "Every two weeks",
        minutes: 10,
      })),
  );
  return sortBy(rows, (r) => r.score, "desc").slice(0, limit);
}

/** A single, unambiguous instruction for the learner's next session. */
export function todayTask(topicScores = {}, path = null, progress = {}) {
  const next = path ? currentUnit(path, progress) : null;
  if (next) {
    return {
      kind: "unit",
      title: next.unit.title,
      subject: next.unit.subject,
      topicName: next.unit.topicName,
      weekLabel: next.week.label,
      minutes: next.unit.minutes,
      type: next.unit.type,
      href: `/student/${next.unit.subject}/topic?id=${next.unit.topicId}`,
    };
  }
  const practice = recommendPractice(topicScores, { limit: 1 })[0];
  if (practice) {
    return {
      kind: "practice",
      title: `${practice.topicName} practice set`,
      subject: practice.subject,
      topicName: practice.topicName,
      minutes: practice.minutes,
      type: "practice",
      href: `/student/practice?topic=${practice.topicId}`,
    };
  }
  return {
    kind: "diagnostic",
    title: "Retake your full diagnostic",
    subject: null,
    topicName: null,
    minutes: 26,
    type: "assessment",
    href: "/student/diagnostic/start",
  };
}
