"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  SAMPLE_ACHIEVEMENTS,
  SAMPLE_ACTIVITY,
  SAMPLE_CERTIFICATES,
  SAMPLE_GAMIFICATION,
  SAMPLE_PROFILE,
  SAMPLE_TIMELINE,
  SAMPLE_TOPIC_SCORES,
  SAMPLE_TOPIC_ATTEMPTS,
} from "@/lib/data/sampleResult";
import { mergeTopicScores, scoreAnswers, buildResult } from "@/lib/engine/scoring";
import { buildLearningPath, currentUnit, pathProgress } from "@/lib/engine/recommend";
import { nextStep } from "@/lib/engine/diagnose";
import { uid } from "@/lib/utils";

/**
 * Single source of truth for the product demo.
 *
 * Everything here is plain, serialisable data with the same shape a real API
 * would return (Student, Result, LearningPath, Subscription…). Swapping the
 * mock layer for `fetch` calls means changing this file only.
 */

const STORAGE_KEY = "prisma.state.v1";

const DEFAULT_SETTINGS = {
  appearance: "default", // default | warm | contrast  (all bright by design)
  density: "comfortable", // comfortable | compact
  language: "en",
  notifications: {
    emailWeeklyReport: true,
    emailPathReminders: true,
    pushStudyReminders: false,
    teacherUpdates: true,
    productNews: false,
  },
  privacy: {
    shareWithTeacher: true,
    shareWithSchool: true,
    publicProfile: false,
    researchOptIn: false,
  },
  study: {
    weeklyGoalMinutes: 240,
    reminderTime: "18:30",
    pathPreset: "balanced",
  },
};

const initialState = {
  status: "active", // anonymous | onboarding | active
  user: SAMPLE_PROFILE,
  onboarded: true,
  topicScores: SAMPLE_TOPIC_SCORES,
  attempts: SAMPLE_TOPIC_ATTEMPTS,
  diagnostics: SAMPLE_TIMELINE,
  activity: SAMPLE_ACTIVITY,
  gamification: SAMPLE_GAMIFICATION,
  achievements: SAMPLE_ACHIEVEMENTS,
  certificates: SAMPLE_CERTIFICATES,
  path: null,
  pathProgress: {},
  activeTest: null,
  lastResultId: "diag_2026_09",
  settings: DEFAULT_SETTINGS,
  subscription: { planId: "student", status: "active", renewsAt: "2026-10-06" },
};

const AppContext = createContext(null);

const serialisableKeys = [
  "status",
  "user",
  "onboarded",
  "topicScores",
  "attempts",
  "diagnostics",
  "activity",
  "gamification",
  "achievements",
  "certificates",
  "path",
  "pathProgress",
  "lastResultId",
  "settings",
  "subscription",
];

function readStorage() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  /* ---- hydrate once, persist on change ---- */
  useEffect(() => {
    const saved = readStorage();
    if (saved) {
      setState((prev) => ({
        ...prev,
        ...saved,
        settings: { ...DEFAULT_SETTINGS, ...(saved.settings ?? {}) },
      }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload = {};
      for (const key of serialisableKeys) payload[key] = state[key];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* private mode / quota — the demo still works in memory */
    }
  }, [hydrated, state]);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((id) => window.clearTimeout(id));
  }, []);

  const patch = useCallback((partial) => {
    setState((prev) => (typeof partial === "function" ? partial(prev) : { ...prev, ...partial }));
  }, []);

  /* ---- toasts ---- */
  const dismissToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      const id = uid("toast");
      const item = {
        id,
        message,
        title: options.title ?? null,
        tone: options.tone ?? "default", // default | success | warning | danger | info
        duration: options.duration ?? 3600,
      };
      setToasts((list) => [...list.slice(-2), item]);
      const timer = window.setTimeout(() => dismissToast(id), item.duration);
      timers.current.set(id, timer);
      return id;
    },
    [dismissToast],
  );

  /* ---- auth (demo) ---- */
  const signIn = useCallback(
    ({ email, name, role = "student" } = {}) => {
      const base = role === "student" ? SAMPLE_PROFILE : { ...SAMPLE_PROFILE, role };
      patch((prev) => ({
        ...prev,
        status: "active",
        user: { ...prev.user, ...base, email: email || base.email, name: name || base.name },
      }));
      toast(`Signed in as ${name || base.name}`, { tone: "success", title: "Welcome back" });
    },
    [patch, toast],
  );

  const signOut = useCallback(() => {
    patch({ status: "anonymous" });
    toast("You have been signed out.", { tone: "info" });
  }, [patch, toast]);

  const completeOnboarding = useCallback(
    (answers) => {
      patch((prev) => ({
        ...prev,
        onboarded: true,
        status: "active",
        user: {
          ...prev.user,
          ...(answers.name ? { name: answers.name, firstName: answers.name.split(" ")[0] } : {}),
          ...(answers.email ? { email: answers.email } : {}),
          ...(answers.grade ? { grade: Number(answers.grade) } : {}),
          ...(answers.goal ? { goal: answers.goal } : {}),
          ...(answers.targetExam ? { targetExam: answers.targetExam } : {}),
          ...(answers.weeklyMinutes
            ? { weeklyStudyMinutes: Number(answers.weeklyMinutes) }
            : {}),
        },
        settings: {
          ...prev.settings,
          study: {
            ...prev.settings.study,
            weeklyGoalMinutes: Number(answers.weeklyMinutes) || prev.settings.study.weeklyGoalMinutes,
            pathPreset: answers.preset || prev.settings.study.pathPreset,
          },
        },
      }));
      toast("Profile created. Your baseline diagnostic is ready.", {
        tone: "success",
        title: "Onboarding complete",
      });
    },
    [patch, toast],
  );

  /* ---- diagnostics ---- */
  const startTest = useCallback(
    ({ subject, questions, timed = false, durationMinutes = 26 } = {}) => {
      patch({
        activeTest: {
          id: uid("test"),
          subject,
          questions,
          answers: {},
          index: 0,
          flagged: [],
          startedAt: Date.now(),
          timed,
          secondsRemaining: timed ? durationMinutes * 60 : null,
        },
      });
    },
    [patch],
  );

  const answerQuestion = useCallback((questionId, value) => {
    setState((prev) => {
      if (!prev.activeTest) return prev;
      return {
        ...prev,
        activeTest: {
          ...prev.activeTest,
          answers: { ...prev.activeTest.answers, [questionId]: value },
        },
      };
    });
  }, []);

  const flagQuestion = useCallback((questionId) => {
    setState((prev) => {
      if (!prev.activeTest) return prev;
      const set = new Set(prev.activeTest.flagged);
      if (set.has(questionId)) set.delete(questionId);
      else set.add(questionId);
      return { ...prev, activeTest: { ...prev.activeTest, flagged: [...set] } };
    });
  }, []);

  const goToQuestion = useCallback((index) => {
    setState((prev) => {
      if (!prev.activeTest) return prev;
      const max = prev.activeTest.questions.length - 1;
      return { ...prev, activeTest: { ...prev.activeTest, index: Math.max(0, Math.min(max, index)) } };
    });
  }, []);

  const tickTest = useCallback((seconds = 1) => {
    setState((prev) => {
      if (!prev.activeTest?.timed) return prev;
      return {
        ...prev,
        activeTest: {
          ...prev.activeTest,
          secondsRemaining: Math.max(0, prev.activeTest.secondsRemaining - seconds),
        },
      };
    });
  }, []);

  /** Finish the active test, score it, and merge into the learner profile. */
  const finishTest = useCallback(() => {
    let result = null;

    setState((prev) => {
      const test = prev.activeTest;
      if (!test) return prev;

      const scored = scoreAnswers(test.questions, test.answers);
      // Untested topics keep their previous score (same as a real adaptive test).
      const merged = mergeTopicScores(prev.topicScores, scored.topicScores);
      const minutes = Math.max(1, Math.round((Date.now() - test.startedAt) / 60000));
      const snapshot = {
        id: uid("diag"),
        date: new Date().toISOString().slice(0, 10),
        label: "Live attempt",
        kind:
          test.subject === "math"
            ? "Mathematics focus"
            : test.subject === "english"
              ? "English focus"
              : "Full diagnostic",
        durationMinutes: minutes,
        topics: merged,
        answered: scored.answered,
        accuracy: scored.accuracy,
      };

      result = {
        id: snapshot.id,
        scored,
        merged,
        breakdown: buildResult(merged, { attempts: prev.attempts }),
        snapshot,
        minutes,
      };

      const attempts = { ...prev.attempts };
      for (const question of test.questions) {
        attempts[question.topicId] = (attempts[question.topicId] ?? 0) + 1;
      }

      const xp = 40 + scored.correct * 4;

      return {
        ...prev,
        topicScores: merged,
        attempts,
        diagnostics: [...prev.diagnostics.slice(-7), snapshot],
        lastResultId: snapshot.id,
        activity: [
          {
            id: uid("act"),
            date: snapshot.date,
            type: "Diagnostic",
            subject: test.subject === "both" ? "both" : test.subject,
            topicId: null,
            title: `${snapshot.kind} · ${scored.answered} questions`,
            minutes,
            score: scored.accuracy,
            xp,
          },
          ...prev.activity,
        ].slice(0, 60),
        gamification: {
          ...prev.gamification,
          xp: prev.gamification.xp + xp,
          minutesThisWeek: prev.gamification.minutesThisWeek + minutes,
        },
        activeTest: null,
        // A new attempt invalidates any previously generated plan.
        path: null,
      };
    });

    return result;
  }, []);

  const cancelTest = useCallback(() => patch({ activeTest: null }), [patch]);

  /* ---- learning path ---- */
  const generatePath = useCallback(
    (options = {}) => {
      let created = null;
      setState((prev) => {
        const presetMinutes =
          options.weeklyMinutes ?? prev.settings?.study?.weeklyGoalMinutes ?? 240;
        const path = buildLearningPath(prev.topicScores, {
          weeklyMinutes: presetMinutes,
          weeks: options.weeks ?? 6,
          subjects: options.subjects,
          maxTopics: options.maxTopics,
        });
        created = path;
        return { ...prev, path };
      });
      return created;
    },
    [],
  );

  const toggleUnit = useCallback(
    (key, meta = {}) => {
      setState((prev) => {
        const entry = prev.pathProgress[key];
        const completed = !entry?.completed;
        const nextProgress = {
          ...prev.pathProgress,
          [key]: {
            completed,
            completedAt: completed ? new Date().toISOString() : null,
            minutes: meta.minutes ?? 0,
            topicId: meta.topicId ?? null,
          },
        };
        if (!completed) delete nextProgress[key];

        const minutes = completed ? meta.minutes ?? 0 : 0;
        const xp = completed ? Math.max(10, Math.round((meta.minutes ?? 12) * 1.6)) : 0;

        return {
          ...prev,
          pathProgress: nextProgress,
          gamification: {
            ...prev.gamification,
            xp: prev.gamification.xp + xp,
            minutesThisWeek: prev.gamification.minutesThisWeek + minutes,
          },
          activity: completed
            ? [
                {
                  id: uid("act"),
                  date: new Date().toISOString().slice(0, 10),
                  type: meta.type === "assessment" ? "Mini assessment" : meta.type === "practice" ? "Practice set" : "Lesson",
                  subject: meta.subject ?? null,
                  topicId: meta.topicId ?? null,
                  title: meta.title ?? "Learning unit",
                  minutes: meta.minutes ?? 0,
                  score: null,
                  xp,
                },
                ...prev.activity,
              ].slice(0, 60)
            : prev.activity,
        };
      });
    },
    [],
  );

  const updateSettings = useCallback(
    (partial) => {
      patch((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...partial,
          notifications: { ...prev.settings.notifications, ...(partial.notifications ?? {}) },
          privacy: { ...prev.settings.privacy, ...(partial.privacy ?? {}) },
          study: { ...prev.settings.study, ...(partial.study ?? {}) },
        },
      }));
    },
    [patch],
  );

  const updateSubscription = useCallback(
    (planId) => patch((prev) => ({ ...prev, subscription: { ...prev.subscription, planId, status: "active" } })),
    [patch],
  );

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setState({ ...initialState, path: null, pathProgress: {} });
    toast("Demo data restored to its original state.", { tone: "info", title: "Demo reset" });
  }, [toast]);

  /* ---- derived (memoised, so dashboards never recompute needlessly) ---- */
  const derived = useMemo(() => {
    const breakdown = buildResult(state.topicScores, { attempts: state.attempts });
    const plan = state.path ?? buildLearningPath(state.topicScores, {
      weeklyMinutes: state.settings.study.weeklyGoalMinutes,
    });
    const step = nextStep(state.topicScores);
    const progress = pathProgress(plan, state.pathProgress);
    const next = currentUnit(plan, state.pathProgress);
    const latest = state.diagnostics[state.diagnostics.length - 1];
    const previous = state.diagnostics[state.diagnostics.length - 2];

    return { breakdown, plan, nextStep: step, pathProgress: progress, currentUnit: next, latest, previous };
  }, [state.topicScores, state.attempts, state.path, state.pathProgress, state.diagnostics, state.settings.study.weeklyGoalMinutes]);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      toasts,
      derived,
      // actions
      patch,
      toast,
      dismissToast,
      signIn,
      signOut,
      completeOnboarding,
      startTest,
      answerQuestion,
      flagQuestion,
      goToQuestion,
      tickTest,
      finishTest,
      cancelTest,
      generatePath,
      toggleUnit,
      updateSettings,
      updateSubscription,
      resetDemo,
    }),
    [
      state,
      hydrated,
      toasts,
      derived,
      patch,
      toast,
      dismissToast,
      signIn,
      signOut,
      completeOnboarding,
      startTest,
      answerQuestion,
      flagQuestion,
      goToQuestion,
      tickTest,
      finishTest,
      cancelTest,
      generatePath,
      toggleUnit,
      updateSettings,
      updateSubscription,
      resetDemo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/** Narrow selector hook — re-renders only when the selected slice changes. */
export function useAppSelect(selector) {
  const app = useApp();
  return useMemo(() => selector(app), [app, selector]);
}

export { DEFAULT_SETTINGS, STORAGE_KEY };
