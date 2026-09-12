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
import { ALL_QUESTIONS, DIFFICULTIES } from "@/lib/data/questions";
import { FAQS } from "@/lib/data/faq";
import { PLANS } from "@/lib/data/plans";
import { CLASSES_WITH_SIZE, STUDENTS } from "@/lib/data/people";
import { TOPIC_BY_ID } from "@/lib/data/topics";
import {
  ADMIN_PROFILE,
  DEFAULT_CMS,
  SEED_APPLICATIONS,
  SEED_ASSIGNMENTS,
  SEED_NOTIFICATIONS,
  SEED_SUBMISSIONS,
  SEED_TESTS,
  TEACHER_DEMO,
} from "@/lib/data/platform";
import { mergeTopicScores, scoreAnswers, buildResult } from "@/lib/engine/scoring";
import { buildLearningPath, currentUnit, pathProgress } from "@/lib/engine/recommend";
import { nextStep } from "@/lib/engine/diagnose";
import { uid } from "@/lib/utils";

/**
 * Single source of truth for the product demo.
 *
 * Everything here is plain, serialisable data with the same shape a real API
 * would return (User, Application, Assignment, Test, Question, Notification…).
 * Swapping the mock layer for `fetch` calls means changing this file only.
 */

const STORAGE_KEY = "prisma.state.v2";

const DEFAULT_SETTINGS = {
  appearance: "default",
  density: "comfortable",
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
  status: "active", // anonymous | active
  user: SAMPLE_PROFILE,
  teacherStatus: "approved", // pending | approved | rejected | suspended (teacher role)
  userFlags: {}, // admin-controlled per-user status overrides
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
  pendingSubjects: [], // remaining papers in a two-subject diagnostic
  flowTimed: false,   // timed mode carried across papers
  pendingSubjects: [],
  flowTimed: false,
  lastResultId: "diag_2026_09",
  settings: DEFAULT_SETTINGS,
  subscription: { planId: "student", status: "active", renewsAt: "2026-10-06" },
  /* platform layer */
  applications: SEED_APPLICATIONS,
  notifications: SEED_NOTIFICATIONS,
  cms: DEFAULT_CMS,
  faqs: FAQS,
  plans: PLANS,
  questions: ALL_QUESTIONS,
  tests: SEED_TESTS,
  contentUnits: {}, // topicId → units override (learning content CMS)
  assignments: SEED_ASSIGNMENTS,
  submissions: SEED_SUBMISSIONS, // { id, assignmentId, studentId, score, submittedAt }
  classesLocal: CLASSES_WITH_SIZE.map((c) => ({ ...c })),
  extraStudents: [], // students added by teachers/admin in this session
};

const AppContext = createContext(null);

const serialisableKeys = [
  "status",
  "user",
  "teacherStatus",
  "userFlags",
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
  "pendingSubjects",
  "flowTimed",
  "settings",
  "subscription",
  "applications",
  "notifications",
  "cms",
  "faqs",
  "plans",
  "questions",
  "tests",
  "contentUnits",
  "assignments",
  "submissions",
  "classesLocal",
  "extraStudents",
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
        cms: { ...DEFAULT_CMS, ...(saved.cms ?? {}), hero: { ...DEFAULT_CMS.hero, ...(saved.cms?.hero ?? {}) }, sections: { ...DEFAULT_CMS.sections, ...(saved.cms?.sections ?? {}) } },
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
      /* storage full or unavailable — demo continues in memory */
    }
  }, [state, hydrated]);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const patch = useCallback((partial) => {
    setState((prev) => (typeof partial === "function" ? partial(prev) : { ...prev, ...partial }));
  }, []);

  /* ------------------------------------------------------------ toasts ---- */
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      const id = uid("toast");
      const item = {
        id,
        message,
        title: options.title ?? null,
        tone: options.tone ?? "info",
        duration: options.duration ?? 4200,
      };
      setToasts((prev) => [...prev.slice(-3), item]);
      const timer = window.setTimeout(() => dismissToast(id), item.duration);
      timers.current.set(id, timer);
      return id;
    },
    [dismissToast],
  );

  /* ------------------------------------------------------- notifications ---- */
  const notify = useCallback((role, { title, body, tone = "info" }) => {
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [role]: [
          { id: uid("ntf"), title, body, tone, date: new Date().toISOString().slice(0, 10), read: false },
          ...(prev.notifications[role] ?? []),
        ].slice(0, 30),
      },
    }));
  }, []);

  const markNotificationsRead = useCallback((role) => {
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [role]: (prev.notifications[role] ?? []).map((item) => ({ ...item, read: true })),
      },
    }));
  }, []);

  /* -------------------------------------------------------------- auth ---- */
  const signIn = useCallback(
    ({ email, name, role = "student" } = {}) => {
      const base = role === "student" ? SAMPLE_PROFILE : role === "teacher" ? TEACHER_DEMO : role === "admin" ? ADMIN_PROFILE : { ...SAMPLE_PROFILE, role };
      patch((prev) => ({
        ...prev,
        status: "active",
        user: { ...prev.user, ...base, email: email || base.email, name: name || base.name },
        teacherStatus: role === "teacher" ? "approved" : prev.teacherStatus,
      }));
      toast(`Signed in as ${name || base.name}`, { tone: "success", title: "Welcome back" });
    },
    [patch, toast],
  );

  const signInDemo = useCallback(
    (role) => {
      const profile = role === "teacher" ? TEACHER_DEMO : role === "admin" ? ADMIN_PROFILE : SAMPLE_PROFILE;
      patch((prev) => ({
        ...prev,
        status: "active",
        user: { ...profile },
        teacherStatus: role === "teacher" ? "approved" : prev.teacherStatus,
      }));
      toast(`Demo ${role} session started. All data is local to this browser.`, { tone: "info", title: `Demo ${role}` });
    },
    [patch, toast],
  );

  const signOut = useCallback(() => {
    patch({ status: "anonymous" });
    toast("You have been signed out.", { tone: "info" });
  }, [patch, toast]);

  const submitTeacherApplication = useCallback(
    (application) => {
      const record = {
        id: uid("app"),
        ...application,
        submittedAt: new Date().toISOString().slice(0, 10),
        status: "pending",
        rejectionReason: null,
      };
      patch((prev) => ({
        ...prev,
        status: "active",
        teacherStatus: "pending",
        user: {
          ...prev.user,
          role: "teacher",
          name: `${application.firstName} ${application.lastName}`,
          firstName: application.firstName,
          email: application.email,
          subject: application.subject,
          institution: application.institution,
        },
        applications: [record, ...prev.applications],
      }));
      notify("admin", { title: "New teacher application", body: `${application.firstName} ${application.lastName} (${application.subject}) awaits review.`, tone: "developing" });
      toast("Application submitted. It is now with the administration team.", { tone: "success", title: "Application received" });
      return record;
    },
    [patch, notify, toast],
  );

  const decideApplication = useCallback(
    (id, decision, reason = null) => {
      let decided = null;
      setState((prev) => {
        const applications = prev.applications.map((item) => {
          if (item.id !== id) return item;
          decided = { ...item, status: decision, rejectionReason: reason, decidedAt: new Date().toISOString().slice(0, 10) };
          return decided;
        });
        const sameUser = decided && prev.user.email === decided.email;
        return {
          ...prev,
          applications,
          teacherStatus: sameUser ? (decision === "approved" ? "approved" : decision) : prev.teacherStatus,
        };
      });
      if (decided) {
        notify("teacher", {
          title: decision === "approved" ? "Teacher application approved" : "Teacher application update",
          body: decision === "approved" ? "Your workspace is active. Welcome aboard." : `Decision: ${decision}.${reason ? ` Reason: ${reason}` : ""}`,
          tone: decision === "approved" ? "success" : "risk",
        });
        toast(`${decided.firstName} ${decided.lastName} ${decision === "approved" ? "approved" : decision}.`, {
          tone: decision === "approved" ? "success" : "info",
          title: decision === "approved" ? "Teacher approved" : "Application updated",
        });
      }
    },
    [notify, toast],
  );

  const setUserFlag = useCallback(
    (id, flag) => {
      patch((prev) => ({ ...prev, userFlags: { ...prev.userFlags, [id]: flag } }));
      toast(`User ${id} set to ${flag}.`, { tone: "info", title: "User updated" });
    },
    [patch, toast],
  );

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
          ...(answers.weeklyMinutes ? { weeklyStudyMinutes: Number(answers.weeklyMinutes) } : {}),
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
      toast("Profile created. Your baseline diagnostic is ready.", { tone: "success", title: "Onboarding complete" });
    },
    [patch, toast],
  );

  /* -------------------------------------------------------- diagnostics ---- */
  const startTest = useCallback(
    ({ subject, questions, timed = false, durationMinutes = 26, adaptive = false, label = null } = {}) => {
      patch({
        activeTest: {
          id: uid("test"),
          subject,
          label,
          questions,
          answers: {},
          index: 0,
          flagged: [],
          startedAt: Date.now(),
          timed,
          adaptive,
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
        activeTest: { ...prev.activeTest, answers: { ...prev.activeTest.answers, [questionId]: value } },
      };
    });
  }, []);

  /** Deterministic adaptivity: correct → harder follow-up, wrong → easier. */
  const adaptAfterAnswer = useCallback((question, correct) => {
    setState((prev) => {
      const test = prev.activeTest;
      if (!test?.adaptive) return prev;
      if (test.questions.length >= 34) return prev;
      const order = { foundation: 1, core: 2, advanced: 3 };
      const target = correct ? order[question.difficulty] + 1 : order[question.difficulty] - 1;
      const wanted = Object.keys(DIFFICULTIES).find((key) => order[key] === target);
      if (!wanted) return prev;
      const used = new Set(test.questions.map((item) => item.id));
      const pool = prev.questions.filter(
        (item) => item.topicId === question.topicId && item.difficulty === wanted && !used.has(item.id),
      );
      if (!pool.length) return prev;
      const next = pool[0];
      return { ...prev, activeTest: { ...test, questions: [...test.questions, { ...next, adapted: true }] } };
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
        activeTest: { ...prev.activeTest, secondsRemaining: Math.max(0, prev.activeTest.secondsRemaining - seconds) },
      };
    });
  }, []);

  const finishTest = useCallback(() => {
    let result = null;
    setState((prev) => {
      const test = prev.activeTest;
      if (!test) return prev;

      const scored = scoreAnswers(test.questions, test.answers);
      const merged = mergeTopicScores(prev.topicScores, scored.topicScores);
      const minutes = Math.max(1, Math.round((Date.now() - test.startedAt) / 60000));
      const snapshot = {
        id: uid("diag"),
        date: new Date().toISOString().slice(0, 10),
        label: test.label ?? "Live attempt",
        kind: test.subject === "math" ? "Mathematics focus" : test.subject === "english" ? "English focus" : "Full diagnostic",
        durationMinutes: minutes,
        topics: merged,
        answered: scored.answered,
        accuracy: scored.accuracy,
      };

      result = { id: snapshot.id, scored, merged, breakdown: buildResult(merged, { attempts: prev.attempts }), snapshot, minutes };

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
            subject: test.subject,
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
        notifications: {
          ...prev.notifications,
          student: [
            {
              id: uid("ntf"),
              title: "Diagnostic results ready",
              body: `Mathematics ${result.breakdown.math.score}% · English ${result.breakdown.english.score}%. Analysis and plan updated.`,
              tone: "success",
              date: snapshot.date,
              read: false,
            },
            ...prev.notifications.student,
          ].slice(0, 30),
        },
        activeTest: null,
  pendingSubjects: [], // remaining papers in a two-subject diagnostic
  flowTimed: false,   // timed mode carried across papers
        path: null,
      };
    });
    return result;
  }, []);

  const cancelTest = useCallback(() => patch({ activeTest: null }), [patch]);

  /* -------------------------------------------------------------- path ---- */
  const generatePath = useCallback(
    (options = {}) => {
      setState((prev) => {
        const presetMinutes = { light: 120, balanced: 240, intensive: 360 }[options.preset ?? prev.settings.study.pathPreset];
        const path = buildLearningPath(prev.topicScores, {
          weeklyMinutes: options.weeklyMinutes ?? presetMinutes ?? 240,
        });
        return { ...prev, path };
      });
    },
    [],
  );

  const toggleUnit = useCallback((key, meta = {}) => {
    setState((prev) => {
      const entry = prev.pathProgress[key];
      const completed = !entry?.completed;
      const nextProgress = { ...prev.pathProgress, [key]: { completed, completedAt: completed ? new Date().toISOString().slice(0, 10) : null } };
      const minutes = completed ? meta.minutes ?? 0 : 0;
      const xp = completed ? Math.max(10, Math.round((meta.minutes ?? 12) * 1.6)) : 0;
      return {
        ...prev,
        pathProgress: nextProgress,
        gamification: {
          ...prev.gamification,
          xp: prev.gamification.xp + (completed ? xp : -Math.min(xp, prev.gamification.xp)),
          minutesThisWeek: Math.max(0, prev.gamification.minutesThisWeek + (completed ? minutes : -minutes)),
        },
      };
    });
  }, []);

  /* ---------------------------------------------------------- settings ---- */
  const updateSettings = useCallback((partial) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...partial } }));
  }, []);

  const updateSubscription = useCallback((partial) => {
    setState((prev) => ({ ...prev, subscription: { ...prev.subscription, ...partial } }));
  }, []);

  /* ----------------------------------------------------- CMS: homepage ---- */
  const updateCms = useCallback(
    (partial) => {
      setState((prev) => ({
        ...prev,
        cms: {
          ...prev.cms,
          ...partial,
          hero: { ...prev.cms.hero, ...(partial.hero ?? {}) },
          sections: { ...prev.cms.sections, ...(partial.sections ?? {}) },
          announcement: { ...prev.cms.announcement, ...(partial.announcement ?? {}) },
        },
      }));
      toast("Homepage content updated — the live site reflects it immediately.", { tone: "success", title: "Content saved" });
    },
    [toast],
  );

  /* ---------------------------------------------------------- CMS: FAQ ---- */
  const faqSave = useCallback(
    (item) => {
      setState((prev) => {
        const exists = prev.faqs.some((f) => f.id === item.id);
        return { ...prev, faqs: exists ? prev.faqs.map((f) => (f.id === item.id ? { ...f, ...item } : f)) : [...prev.faqs, { ...item, id: item.id ?? uid("faq") }] };
      });
      toast("FAQ saved.", { tone: "success" });
    },
    [toast],
  );

  const faqDelete = useCallback(
    (id) => {
      setState((prev) => ({ ...prev, faqs: prev.faqs.filter((f) => f.id !== id) }));
      toast("FAQ deleted.", { tone: "info" });
    },
    [toast],
  );

  const faqMove = useCallback((id, direction) => {
    setState((prev) => {
      const list = [...prev.faqs];
      const index = list.findIndex((f) => f.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, faqs: list };
    });
  }, []);

  /* ------------------------------------------------------- CMS: pricing ---- */
  const updatePlan = useCallback(
    (id, partial) => {
      setState((prev) => ({ ...prev, plans: prev.plans.map((plan) => (plan.id === id ? { ...plan, ...partial } : plan)) }));
      toast("Pricing updated on the public pricing page.", { tone: "success", title: "Plan saved" });
    },
    [toast],
  );

  /* ---------------------------------------------------- CMS: questions ---- */
  const questionSave = useCallback(
    (question) => {
      setState((prev) => {
        const exists = prev.questions.some((q) => q.id === question.id);
        return {
          ...prev,
          questions: exists ? prev.questions.map((q) => (q.id === question.id ? { ...q, ...question } : q)) : [...prev.questions, { ...question, id: question.id ?? uid("q") }],
        };
      });
      toast("Question saved to the bank. It is immediately available to tests.", { tone: "success", title: "Question saved" });
    },
    [toast],
  );

  const questionDelete = useCallback(
    (id) => {
      setState((prev) => ({ ...prev, questions: prev.questions.filter((q) => q.id !== id) }));
      toast("Question removed from the bank.", { tone: "info" });
    },
    [toast],
  );

  /* -------------------------------------------------------- CMS: tests ---- */
  const testSave = useCallback(
    (test) => {
      setState((prev) => {
        const exists = prev.tests.some((t) => t.id === test.id);
        return { ...prev, tests: exists ? prev.tests.map((t) => (t.id === test.id ? { ...t, ...test } : t)) : [...prev.tests, { ...test, id: test.id ?? uid("tst") }] };
      });
      toast("Test saved.", { tone: "success" });
    },
    [toast],
  );

  const testSetStatus = useCallback(
    (id, status) => {
      setState((prev) => ({ ...prev, tests: prev.tests.map((t) => (t.id === id ? { ...t, status } : t)) }));
      toast(`Test ${status === "published" ? "published — assignable now" : "unpublished — hidden from assignment"}.`, {
        tone: status === "published" ? "success" : "info",
        title: status === "published" ? "Test published" : "Test unpublished",
      });
    },
    [toast],
  );

  /* ----------------------------------------------- CMS: learning content ---- */
  const unitsFor = useCallback(
    (topicId) => state.contentUnits[topicId] ?? TOPIC_BY_ID[topicId]?.units ?? [],
    [state.contentUnits],
  );

  const unitSave = useCallback(
    (topicId, unit) => {
      setState((prev) => {
        const current = prev.contentUnits[topicId] ?? TOPIC_BY_ID[topicId]?.units ?? [];
        const exists = current.some((u) => u.key === unit.key);
        const next = exists ? current.map((u) => (u.key === unit.key ? { ...u, ...unit } : u)) : [...current, { ...unit, key: unit.key ?? uid("unit") }];
        return { ...prev, contentUnits: { ...prev.contentUnits, [topicId]: next } };
      });
      toast("Learning unit saved.", { tone: "success" });
    },
    [toast],
  );

  const unitDelete = useCallback(
    (topicId, key) => {
      setState((prev) => {
        const current = prev.contentUnits[topicId] ?? TOPIC_BY_ID[topicId]?.units ?? [];
        return { ...prev, contentUnits: { ...prev.contentUnits, [topicId]: current.filter((u) => u.key !== key) } };
      });
      toast("Learning unit removed.", { tone: "info" });
    },
    [toast],
  );

  /* ---------------------------------------------------- classes & roster ---- */
  const classCreate = useCallback(
    (klass) => {
      const record = { id: uid("cls"), size: 0, term: "Autumn 2026", ...klass };
      patch((prev) => ({ ...prev, classesLocal: [...prev.classesLocal, record] }));
      toast(`Class ${klass.name} created.`, { tone: "success", title: "Class created" });
      return record;
    },
    [patch, toast],
  );

  const studentAdd = useCallback(
    (student) => {
      const record = {
        id: uid("stu"),
        className: CLASSES_WITH_SIZE.find((c) => c.id === student.classId)?.name ?? "—",
        math: 0,
        english: 0,
        overall: 0,
        trend: 0,
        lastDiagnostic: null,
        topicScores: {},
        ...student,
      };
      patch((prev) => ({ ...prev, extraStudents: [...prev.extraStudents, record] }));
      notify("teacher", { title: "New student added", body: `${record.name} joined ${record.className}.`, tone: "info" });
      toast(`${record.name} added to ${record.className}.`, { tone: "success", title: "Student added" });
      return record;
    },
    [patch, notify, toast],
  );

  const studentRemove = useCallback(
    (id) => {
      patch((prev) => ({ ...prev, extraStudents: prev.extraStudents.filter((s) => s.id !== id) }));
      toast("Student removed from your roster.", { tone: "info" });
    },
    [patch, toast],
  );

  /* -------------------------------------------------------- assignments ---- */
  const assignmentCreate = useCallback(
    (assignment) => {
      const record = { id: uid("asg"), createdAt: new Date().toISOString().slice(0, 10), status: "open", assignedTo: [], ...assignment };
      patch((prev) => ({ ...prev, assignments: [record, ...prev.assignments] }));
      notify("student", {
        title: `New assignment: ${record.title}`,
        body: `Due ${record.dueAt} · about ${record.estimatedMinutes} minutes.`,
        tone: "info",
      });
      toast("Assignment created. Students see it immediately.", { tone: "success", title: "Assignment created" });
      return record;
    },
    [patch, notify, toast],
  );

  const submissionRecord = useCallback(
    (submission) => {
      patch((prev) => ({ ...prev, submissions: [submission, ...prev.submissions] }));
      notify("teacher", { title: "Assignment submitted", body: `${submission.studentName ?? "A student"} completed “${submission.assignmentTitle}” with ${submission.score}%.`, tone: "success" });
    },
    [patch, notify],
  );

  const resetDemo = useCallback(() => {
    setState((prev) => ({ ...initialState, settings: prev.settings }));
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    toast("Demo restored to the shipped baseline.", { tone: "info", title: "Reset complete" });
  }, [toast]);

  /* ----------------------------------------------------------- derived ---- */
  const derived = useMemo(() => {
    const breakdown = buildResult(state.topicScores, { attempts: state.attempts });
    const plan = state.path ?? buildLearningPath(state.topicScores, { weeklyMinutes: state.settings.study.weeklyGoalMinutes });
    const step = nextStep(state.topicScores);
    const progress = pathProgress(plan, state.pathProgress);
    const next = currentUnit(plan, state.pathProgress);
    const latest = state.diagnostics[state.diagnostics.length - 1];
    const previous = state.diagnostics[state.diagnostics.length - 2];
    const role = state.user?.role ?? "student";
    const allStudents = [...STUDENTS, ...state.extraStudents];

    return { breakdown, plan, nextStep: step, pathProgress: progress, currentUnit: next, latest, previous, role, allStudents };
  }, [state.topicScores, state.attempts, state.path, state.pathProgress, state.diagnostics, state.settings.study.weeklyGoalMinutes, state.user, state.extraStudents]);

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      toasts,
      derived,
      patch,
      toast,
      dismissToast,
      notify,
      markNotificationsRead,
      signIn,
      signInDemo,
      signOut,
      submitTeacherApplication,
      decideApplication,
      setUserFlag,
      completeOnboarding,
      startTest,
      answerQuestion,
      adaptAfterAnswer,
      flagQuestion,
      goToQuestion,
      tickTest,
      finishTest,
      cancelTest,
      generatePath,
      toggleUnit,
      updateSettings,
      updateSubscription,
      updateCms,
      faqSave,
      faqDelete,
      faqMove,
      updatePlan,
      questionSave,
      questionDelete,
      testSave,
      testSetStatus,
      unitsFor,
      unitSave,
      unitDelete,
      classCreate,
      studentAdd,
      studentRemove,
      assignmentCreate,
      submissionRecord,
      resetDemo,
    }),
    [
      state, hydrated, toasts, derived, patch, toast, dismissToast, notify, markNotificationsRead,
      signIn, signInDemo, signOut, submitTeacherApplication, decideApplication, setUserFlag,
      completeOnboarding, startTest, answerQuestion, adaptAfterAnswer, flagQuestion, goToQuestion,
      tickTest, finishTest, cancelTest, generatePath, toggleUnit, updateSettings, updateSubscription,
      updateCms, faqSave, faqDelete, faqMove, updatePlan, questionSave, questionDelete, testSave,
      testSetStatus, unitsFor, unitSave, unitDelete, classCreate, studentAdd, studentRemove,
      assignmentCreate, submissionRecord, resetDemo,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside <AppProvider>");
  return ctx;
}

/** Narrow selector hook — re-renders only when the selected slice changes. */
export function useAppSelect(selector) {
  const app = useApp();
  return useMemo(() => selector(app), [app, selector]);
}

export { DEFAULT_SETTINGS, STORAGE_KEY };
