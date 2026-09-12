import { TOPICS, DOMAINS, SUBJECT_TOPICS, TOTAL_WEIGHT } from "@/lib/data/topics";
import { average, clamp, round } from "@/lib/utils";

/**
 * Scoring engine.
 *
 * Pure functions over plain data: `topicScores` is always
 * `{ [topicId]: number 0–100 }`. Domain and subject scores are *derived*,
 * never stored, so a report can never contradict itself.
 *
 * Replacing `lib/data/topics.js` with an API response requires no change here.
 */

export const SUBJECTS = ["math", "english"];

export const getWeight = (topicId) => TOPICS.find((t) => t.id === topicId)?.weight ?? 1;

export function normalizeTopicScores(topicScores = {}) {
  const out = {};
  for (const [id, value] of Object.entries(topicScores)) {
    if (typeof value !== "number" || Number.isNaN(value)) continue;
    out[id] = clamp(round(value, 1), 0, 100);
  }
  return out;
}

/** Weighted mean of the topics belonging to `subject`. */
export function subjectScore(topicScores = {}, subject) {
  const scores = normalizeTopicScores(topicScores);
  const topics = SUBJECT_TOPICS[subject] ?? [];
  const present = topics.filter((t) => scores[t.id] !== undefined);
  if (!present.length) return 0;
  const weighted = present.reduce((acc, t) => acc + scores[t.id] * t.weight, 0);
  const weightSum = present.reduce((acc, t) => acc + t.weight, 0);
  return round(weighted / (weightSum || 1), 0);
}

/** Weighted mean of the topics belonging to one domain. */
export function domainScore(topicScores = {}, domainId) {
  const scores = normalizeTopicScores(topicScores);
  const domain = DOMAINS[domainId];
  if (!domain) return 0;
  const topics = TOPICS.filter((t) => t.domain === domainId && scores[t.id] !== undefined);
  if (!topics.length) return 0;
  const weighted = topics.reduce((acc, t) => acc + scores[t.id] * t.weight, 0);
  const weightSum = topics.reduce((acc, t) => acc + t.weight, 0);
  return round(weighted / (weightSum || 1), 0);
}

/** Full breakdown: subject → domains → topics, all consistently derived. */
export function buildSubjectResult(topicScores = {}, subject, meta = {}) {
  const scores = normalizeTopicScores(topicScores);
  const topics = (SUBJECT_TOPICS[subject] ?? [])
    .map((topic) => ({
      id: topic.id,
      name: topic.name,
      domain: topic.domain,
      domainName: DOMAINS[topic.domain]?.short ?? "",
      level: topic.level,
      weight: topic.weight,
      score: scores[topic.id] ?? null,
      attempts: meta.attempts?.[topic.id] ?? null,
    }))
    .filter((t) => t.score !== null)
    .sort((a, b) => b.score - a.score);

  const domains = Object.values(DOMAINS)
    .filter((d) => d.subject === subject)
    .sort((a, b) => a.order - b.order)
    .map((d) => ({
      id: d.id,
      name: d.name,
      short: d.short,
      description: d.description,
      score: domainScore(scores, d.id),
      topics: topics.filter((t) => t.domain === d.id),
    }))
    .filter((d) => d.topics.length > 0);

  return {
    subject,
    score: subjectScore(scores, subject),
    domains,
    topics,
    topicCount: topics.length,
    totalWeight: TOTAL_WEIGHT[subject] ?? 100,
  };
}

/** Both subjects + a combined headline. */
export function buildResult(topicScores = {}, meta = {}) {
  const math = buildSubjectResult(topicScores, "math", meta);
  const english = buildSubjectResult(topicScores, "english", meta);
  return {
    math,
    english,
    overall: round(average([math.score, english.score]), 0),
    combined: { math: math.score, english: english.score },
  };
}

/* ------------------------------------------------------------------ *
 * Live-test scoring: answers → topic scores
 * ------------------------------------------------------------------ */

/**
 * Score a completed answer sheet.
 *
 * @param {Array} questions  items from lib/data/questions.js
 * @param {Record<string, number|string>} answers  questionId → selected option index / value
 * @returns {{ topicScores: object, answered: number, correct: number, accuracy: number, perTopic: object }}
 */
export function scoreAnswers(questions = [], answers = {}) {
  const buckets = new Map();
  let answered = 0;
  let correct = 0;

  for (const question of questions) {
    const given = answers[question.id];
    if (given === undefined || given === null || given === "") continue;
    answered += 1;
    const isCorrect = isAnswerCorrect(question, given);
    if (isCorrect) correct += 1;

    const entry = buckets.get(question.topicId) ?? { correct: 0, total: 0, weight: 0 };
    entry.total += 1;
    entry.correct += isCorrect ? 1 : 0;
    entry.weight += question.weight ?? 1;
    buckets.set(question.topicId, entry);
  }

  const perTopic = {};
  const topicScores = {};
  for (const [topicId, entry] of buckets) {
    const raw = entry.total ? (entry.correct / entry.total) * 100 : 0;
    // Blend toward 50 when a topic has very few items, so one lucky guess
    // cannot produce a 100% mastery claim.
    const confidence = Math.min(1, entry.total / 4);
    const score = round(50 + (raw - 50) * confidence, 0);
    perTopic[topicId] = { ...entry, raw: round(raw, 1), score };
    topicScores[topicId] = score;
  }

  return {
    topicScores,
    perTopic,
    answered,
    correct,
    accuracy: answered ? round((correct / answered) * 100, 0) : 0,
  };
}

export function isAnswerCorrect(question, given) {
  if (!question) return false;
  if (question.type === "numeric") {
    const tolerance = question.tolerance ?? 0;
    const value = Number(String(given).replace(",", "."));
    return Number.isFinite(value) && Math.abs(value - Number(question.answer)) <= tolerance;
  }
  return Number(given) === Number(question.answer);
}

/**
 * Merge a fresh partial result into an existing profile. Topics that were not
 * retested keep their previous score — a real diagnostic behaves the same way.
 */
export function mergeTopicScores(previous = {}, fresh = {}) {
  return { ...normalizeTopicScores(previous), ...normalizeTopicScores(fresh) };
}
