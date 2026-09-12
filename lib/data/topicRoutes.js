/**
 * Canonical routes for topic and domain study pages.
 * Plain module (no "use client") so server components can build hrefs too.
 */

export const TOPIC_ROUTES = {
  linear_equations: "/student/math/linear-equations",
  quadratic_equations: "/student/math/quadratic-equations",
  inequalities: "/student/math/inequalities",
};

export const DOMAIN_ROUTES = {
  algebra: "/student/math/algebra",
  grammar: "/student/english/grammar",
  vocabulary: "/student/english/vocabulary",
  reading: "/student/english/reading",
  listening: "/student/english/listening",
};

/** Topics without a dedicated page open straight into a practice set. */
export const topicHref = (topicId) => TOPIC_ROUTES[topicId] ?? `/student/practice?topic=${topicId}`;

export const domainHref = (domainId) => DOMAIN_ROUTES[domainId] ?? `/student/skills`;
