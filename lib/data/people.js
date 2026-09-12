import { TOPICS } from "@/lib/data/topics";
import { SAMPLE_TOPIC_SCORES } from "@/lib/data/sampleResult";
import { seeded, round } from "@/lib/utils";

/**
 * Demo roster for the teacher and school workspaces.
 *
 * Topic scores are generated deterministically from each student's base level
 * and aptitude profile, so the same class always produces the same analytics —
 * exactly what a seeded fixture service would return.
 */

const FIRST = ["Amina", "Daniel", "Leila", "Tomas", "Nadia", "Ivan", "Sofia", "Kwame", "Hana", "Mateo", "Elif", "Jonas", "Priya", "Omar", "Clara", "Yusuf", "Mira", "Andrei", "Zainab", "Lucas", "Ines", "Noah", "Aisha", "Emil"];
const LAST = ["Yusupova", "Okonkwo", "Haddad", "Lindqvist", "Rahimi", "Petrov", "Marchetti", "Mensah", "Sato", "Alvarez", "Demir", "Weber", "Nair", "Farouk", "Duarte", "Karimov", "Novak", "Popescu", "Bello", "Ferreira", "Moreau", "Bergman", "Diallo", "Virtanen"];

const ARCHETYPES = [
  { id: "analytical", mathBias: 14, englishBias: -8, label: "Analytical" },
  { id: "verbal", mathBias: -10, englishBias: 15, label: "Verbal" },
  { id: "balanced", mathBias: 2, englishBias: 2, label: "Balanced" },
  { id: "uneven-math", mathBias: 4, englishBias: -4, label: "Uneven · algebra-heavy gaps", algebraPenalty: 16 },
  { id: "uneven-english", mathBias: -4, englishBias: 6, label: "Uneven · vocabulary gaps", vocabPenalty: 18 },
  { id: "recovering", mathBias: -2, englishBias: 0, label: "Recovering", trend: 9 },
];

const CLASSES = [
  { id: "cls_10b", name: "10-B", grade: 10, teacherId: "tch_002", size: 24, room: "B-204", term: "Autumn 2026" },
  { id: "cls_10a", name: "10-A", grade: 10, teacherId: "tch_001", size: 22, room: "B-201", term: "Autumn 2026" },
  { id: "cls_11c", name: "11-C", grade: 11, teacherId: "tch_003", size: 20, room: "C-118", term: "Autumn 2026" },
  { id: "cls_9d", name: "9-D", grade: 9, teacherId: "tch_004", size: 26, room: "A-107", term: "Autumn 2026" },
];

const TEACHERS = [
  { id: "tch_001", name: "Mr. Henrik Salo", subject: "Mathematics", email: "h.salo@northgate.sch", classes: ["cls_10a"], since: 2019, initials: "HS", status: "active" },
  { id: "tch_002", name: "Ms. Amara Adeyemi", subject: "Mathematics", email: "a.adeyemi@northgate.sch", classes: ["cls_10b"], since: 2021, initials: "AA", status: "active" },
  { id: "tch_003", name: "Mr. Erik Halvorsen", subject: "English", email: "e.halvorsen@northgate.sch", classes: ["cls_11c"], since: 2016, initials: "EH", status: "active" },
  { id: "tch_004", name: "Ms. Lucia Ferrari", subject: "English", email: "l.ferrari@northgate.sch", classes: ["cls_9d"], since: 2023, initials: "LF", status: "active" },
  { id: "tch_005", name: "Dr. Renata Kowalska", subject: "Mathematics · Head of Department", email: "r.kowalska@northgate.sch", classes: [], since: 2014, initials: "RK", status: "active" },
  { id: "tch_006", name: "Mr. Samuel Boateng", subject: "English · Literacy Lead", email: "s.boateng@northgate.sch", classes: [], since: 2020, initials: "SB", status: "on-leave" },
];

export const SCHOOL = {
  id: "sch_001",
  name: "Northgate International Academy",
  shortName: "Northgate",
  type: "International secondary school",
  location: "Rotterdam, Netherlands",
  students: 1284,
  teachers: 96,
  classes: 48,
  yearGroups: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
  plan: "school",
  since: "2025-09-01",
  principal: "Dr. Renata Kowalska",
};

function makeScores(rand, base, archetype) {
  const scores = {};
  for (const topic of TOPICS) {
    const bias = topic.subject === "math" ? archetype.mathBias : archetype.englishBias;
    let penalty = 0;
    if (archetype.algebraPenalty && topic.domain === "algebra") penalty = archetype.algebraPenalty;
    if (archetype.vocabPenalty && topic.domain === "vocabulary") penalty = archetype.vocabPenalty;
    const noise = (rand() - 0.5) * 26;
    const raw = base + bias - penalty + noise;
    scores[topic.id] = Math.max(28, Math.min(98, Math.round(raw)));
  }
  return scores;
}

function buildStudents() {
  const rand = seeded(20260912);
  const list = [];

  for (let i = 0; i < 24; i += 1) {
    const archetype = ARCHETYPES[i % ARCHETYPES.length];
    const base = 52 + Math.round(rand() * 34);
    const topicScores = i === 0 ? { ...SAMPLE_TOPIC_SCORES } : makeScores(rand, base, archetype);

    const weights = TOPICS.reduce((acc, t) => {
      acc[t.subject] = (acc[t.subject] ?? 0) + (topicScores[t.id] ?? 0) * t.weight;
      return acc;
    }, {});

    const math = Math.round((weights.math ?? 0) / 100);
    const english = Math.round((weights.english ?? 0) / 100);
    const cls = CLASSES[i % 3 === 0 ? 0 : i % 3]; // spread across 10-B, 10-A, 11-C
    const trend = Math.round((rand() - 0.35) * 18);
    const diagnosed = rand() > 0.16;

    list.push({
      id: `stu_${String(i + 1).padStart(4, "0")}`,
      name: `${FIRST[i]} ${LAST[i]}`,
      firstName: FIRST[i],
      lastName: LAST[i],
      grade: cls.grade,
      classId: cls.id,
      className: cls.name,
      teacherId: cls.teacherId,
      archetype: archetype.label,
      archetypeId: archetype.id,
      topicScores,
      math,
      english,
      overall: Math.round((math + english) / 2),
      trend,
      lastDiagnostic: diagnosed ? `2026-0${7 + (i % 3)}-${String(3 + ((i * 5) % 24)).padStart(2, "0")}` : null,
      diagnosticsTaken: diagnosed ? 2 + (i % 4) : 0,
      status: diagnosed ? "active" : "not-started",
      planFocused: i % 5 === 0,
      minutesThisWeek: Math.round(60 + rand() * 200),
      streakDays: Math.round(rand() * 21),
      email: `${FIRST[i].toLowerCase()}.${LAST[i].toLowerCase()}@student.northgate.sch`,
    });
  }
  return list;
}

export const STUDENTS = buildStudents();
export const STUDENT_BY_ID = Object.fromEntries(STUDENTS.map((s) => [s.id, s]));
export const CLASSES_WITH_SIZE = CLASSES;
export const TEACHER_LIST = TEACHERS;

export const getStudent = (id) => STUDENT_BY_ID[id] ?? STUDENTS.find((s) => s.id === id) ?? null;
export const getTeacher = (id) => TEACHERS.find((t) => t.id === id) ?? null;
export const getClass = (id) => CLASSES.find((c) => c.id === id) ?? null;

export const studentsInClass = (classId) => STUDENTS.filter((s) => s.classId === classId);
export const studentsForTeacher = (teacherId) =>
  STUDENTS.filter((s) => CLASSES.some((c) => c.id === s.classId && c.teacherId === teacherId));

/* ------------------------------------------------------------------ *
 * Assessments & assignments
 * ------------------------------------------------------------------ */

export const ASSESSMENTS = [
  {
    id: "asm_001",
    title: "Autumn baseline · Full diagnostic",
    subjects: ["math", "english"],
    questionCount: 30,
    durationMinutes: 28,
    createdBy: "tch_002",
    createdAt: "2026-09-02",
    dueAt: "2026-09-19",
    status: "open",
    assignedTo: ["cls_10b"],
    completed: 19,
    total: 24,
    average: 67,
  },
  {
    id: "asm_002",
    title: "Algebra checkpoint · Quadratics & inequalities",
    subjects: ["math"],
    questionCount: 12,
    durationMinutes: 14,
    createdBy: "tch_001",
    createdAt: "2026-08-21",
    dueAt: "2026-09-05",
    status: "closed",
    assignedTo: ["cls_10a", "cls_10b"],
    completed: 46,
    total: 46,
    average: 58,
  },
  {
    id: "asm_003",
    title: "English skills screen · Grammar & vocabulary",
    subjects: ["english"],
    questionCount: 15,
    durationMinutes: 16,
    createdBy: "tch_003",
    createdAt: "2026-09-08",
    dueAt: "2026-09-26",
    status: "open",
    assignedTo: ["cls_11c"],
    completed: 7,
    total: 20,
    average: 71,
  },
  {
    id: "asm_004",
    title: "Grade 9 numeracy entry check",
    subjects: ["math"],
    questionCount: 18,
    durationMinutes: 20,
    createdBy: "tch_004",
    createdAt: "2026-08-30",
    dueAt: "2026-09-12",
    status: "closing",
    assignedTo: ["cls_9d"],
    completed: 21,
    total: 26,
    average: 63,
  },
  {
    id: "asm_005",
    title: "Listening & reading comprehension set",
    subjects: ["english"],
    questionCount: 14,
    durationMinutes: 22,
    createdBy: "tch_003",
    createdAt: "2026-07-14",
    dueAt: "2026-07-28",
    status: "archived",
    assignedTo: ["cls_11c"],
    completed: 20,
    total: 20,
    average: 74,
  },
];

export const ASSIGNMENTS = [
  { id: "asg_01", assessmentId: "asm_001", studentId: "stu_0001", status: "completed", submittedAt: "2026-09-06", score: 68, durationMinutes: 26 },
  { id: "asg_02", assessmentId: "asm_001", studentId: "stu_0002", status: "completed", submittedAt: "2026-09-07", score: 64, durationMinutes: 29 },
  { id: "asg_03", assessmentId: "asm_001", studentId: "stu_0003", status: "completed", submittedAt: "2026-09-08", score: 72, durationMinutes: 24 },
  { id: "asg_04", assessmentId: "asm_001", studentId: "stu_0004", status: "in-progress", submittedAt: null, score: null, durationMinutes: null },
  { id: "asg_05", assessmentId: "asm_001", studentId: "stu_0005", status: "not-started", submittedAt: null, score: null, durationMinutes: null },
];

/** Cohort trend data for school analytics (term averages). */
export const SCHOOL_TERMS = [
  { term: "Spring 2025", math: 58, english: 64, overall: 61, students: 940 },
  { term: "Autumn 2025", math: 61, english: 66, overall: 64, students: 1102 },
  { term: "Spring 2026", math: 64, english: 69, overall: 67, students: 1218 },
  { term: "Autumn 2026", math: 67, english: 72, overall: 70, students: 1284 },
];

export const YEAR_GROUP_PERFORMANCE = [
  { group: "Grade 7", students: 218, math: 72, english: 74, improvement: 6 },
  { group: "Grade 8", students: 214, math: 69, english: 73, improvement: 5 },
  { group: "Grade 9", students: 221, math: 66, english: 71, improvement: 4 },
  { group: "Grade 10", students: 212, math: 64, english: 70, improvement: 7 },
  { group: "Grade 11", students: 208, math: 68, english: 75, improvement: 3 },
  { group: "Grade 12", students: 211, math: 71, english: 78, improvement: 2 },
];

export const round1 = (n) => round(n, 1);
