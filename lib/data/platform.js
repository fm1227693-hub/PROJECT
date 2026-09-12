import { STUDENTS } from "./people";

/**
 * Platform-level demo seeds: admin account, teacher applications, published
 * tests, assignments and notifications. Shapes mirror what a real backend
 * would return so the mock layer can be swapped for fetch calls.
 */

export const ADMIN_PROFILE = {
  id: "adm_001",
  name: "Demo Admin",
  firstName: "Admin",
  email: "admin@prisma.education",
  role: "admin",
  title: "Platform administrator",
  permissions: ["users", "applications", "content", "pricing", "analytics", "settings"],
};

export const TEACHER_DEMO = {
  id: "tch_002",
  name: "Ms. Amara Adeyemi",
  firstName: "Amara",
  email: "teacher@prisma.education",
  role: "teacher",
  subject: "Mathematics",
  experience: "6 years",
  institution: "Northgate International Academy",
  bio: "Head of Year 10 mathematics. Uses diagnostics to plan weekly revision.",
};

export const SEED_APPLICATIONS = [
  {
    id: "app_1001",
    firstName: "Yusuf",
    lastName: "Karimov",
    email: "y.karimov@exampleschool.org",
    subject: "Mathematics",
    experience: "8 years",
    institution: "Samarkand State Secondary School",
    bio: "I teach algebra to Grades 9–11 and want objective gap data before each term's revision block.",
    submittedAt: "2026-09-08",
    status: "pending",
    rejectionReason: null,
  },
  {
    id: "app_1002",
    firstName: "Elena",
    lastName: "Petrova",
    email: "e.petrova@northgate.sch",
    subject: "English",
    experience: "12 years",
    institution: "Northgate International Academy",
    bio: "Literacy lead. Interested in reading and inference diagnostics across Key Stage 3.",
    submittedAt: "2026-09-05",
    status: "pending",
    rejectionReason: null,
  },
  {
    id: "app_1003",
    firstName: "Marco",
    lastName: "Bianchi",
    email: "m.bianchi@tutorco.example",
    subject: "Mathematics",
    experience: "2 years",
    institution: "Independent tutor",
    bio: "Part-time tutor requesting a teacher workspace for six students.",
    submittedAt: "2026-08-28",
    status: "approved",
    rejectionReason: null,
    decidedAt: "2026-08-30",
  },
  {
    id: "app_1004",
    firstName: "Anonymous",
    lastName: "Applicant",
    email: "spam@examples.net",
    subject: "English",
    experience: "n/a",
    institution: "—",
    bio: "Incomplete application with no institution or teaching history.",
    submittedAt: "2026-08-20",
    status: "rejected",
    rejectionReason: "No verifiable institution or teaching experience provided.",
    decidedAt: "2026-08-21",
  },
];

export const SEED_TESTS = [
  {
    id: "tst_baseline",
    title: "Autumn baseline · Full diagnostic",
    subject: "both",
    questionCount: 30,
    durationMinutes: 26,
    status: "published",
    adaptive: true,
    createdBy: "admin",
    createdAt: "2026-09-01",
    description: "The standard 25-skill baseline. Mathematics and English, easy → hard.",
  },
  {
    id: "tst_algebra",
    title: "Algebra checkpoint · Equations & inequalities",
    subject: "math",
    questionCount: 12,
    durationMinutes: 14,
    status: "published",
    adaptive: true,
    createdBy: "admin",
    createdAt: "2026-09-03",
    description: "Focused checkpoint for classes finishing the algebra block.",
  },
  {
    id: "tst_literacy",
    title: "Literacy checkpoint · Reading & vocabulary",
    subject: "english",
    questionCount: 12,
    durationMinutes: 14,
    status: "published",
    adaptive: false,
    createdBy: "admin",
    createdAt: "2026-09-04",
    description: "Reading passages plus academic vocabulary in context.",
  },
  {
    id: "tst_geometry_draft",
    title: "Geometry & graphs · draft",
    subject: "math",
    questionCount: 10,
    durationMinutes: 12,
    status: "draft",
    adaptive: false,
    createdBy: "admin",
    createdAt: "2026-09-10",
    description: "Draft paper awaiting review of the graph-interpretation items.",
  },
];

export const SEED_ASSIGNMENTS = [
  {
    id: "asg_001",
    title: "Autumn baseline — Class 10-B",
    testId: "tst_baseline",
    subject: "both",
    classId: "cls_10b",
    assignedTo: [],
    dueAt: "2026-09-26",
    estimatedMinutes: 26,
    status: "open",
    createdAt: "2026-09-08",
  },
  {
    id: "asg_002",
    title: "Algebra checkpoint — quadratics focus",
    testId: "tst_algebra",
    subject: "math",
    classId: "cls_10b",
    assignedTo: ["stu_0001", "stu_0002"],
    dueAt: "2026-09-19",
    estimatedMinutes: 14,
    status: "open",
    createdAt: "2026-09-06",
  },
  {
    id: "asg_003",
    title: "Literacy checkpoint — completed set",
    testId: "tst_literacy",
    subject: "english",
    classId: "cls_10b",
    assignedTo: [],
    dueAt: "2026-09-05",
    estimatedMinutes: 14,
    status: "closed",
    createdAt: "2026-08-30",
  },
];

export const SEED_NOTIFICATIONS = {
  student: [
    { id: "ntf_s1", title: "New assignment: Algebra checkpoint", body: "Due 19 September · 14 minutes · Mathematics.", tone: "info", date: "2026-09-06", read: false },
    { id: "ntf_s2", title: "Diagnostic results ready", body: "Mathematics 68% · English 74%. Your analysis and plan are updated.", tone: "success", date: "2026-09-06", read: false },
    { id: "ntf_s3", title: "Recommendation updated", body: "Quadratic Equations is now your highest-impact gap (+7.1 pts).", tone: "info", date: "2026-09-07", read: true },
  ],
  teacher: [
    { id: "ntf_t1", title: "19 of 24 submissions", body: "Autumn baseline · Class 10-B is nearly complete.", tone: "info", date: "2026-09-10", read: false },
    { id: "ntf_t2", title: "Application status", body: "Your teacher workspace is active for Autumn 2026.", tone: "success", date: "2026-08-30", read: true },
  ],
  school: [
    { id: "ntf_sc1", title: "Cohort report ready", body: "Autumn term analytics for Northgate International Academy are available.", tone: "info", date: "2026-09-10", read: false },
  ],
  admin: [
    { id: "ntf_a1", title: "2 teacher applications pending", body: "Y. Karimov (Mathematics) and E. Petrova (English) await review.", tone: "developing", date: "2026-09-08", read: false },
    { id: "ntf_a2", title: "New student registrations", body: "14 new student accounts in the last 7 days.", tone: "info", date: "2026-09-11", read: false },
  ],
};

/** Admin-editable homepage copy. Defaults mirror lib/data/content HERO. */
export const DEFAULT_CMS = {
  hero: {
    eyebrow: "Math & English Diagnostic Center",
    titleLine1: "Know what you know.",
    titleLine2: "Know what to learn next.",
    body:
      "Diagnose your Mathematics and English skills, discover your weak areas, and follow a personalized learning path built around your actual needs — not around a single number.",
    primaryLabel: "Take a Diagnostic",
    primaryHref: "/student/diagnostic/start",
    secondaryLabel: "Explore the Platform",
    secondaryHref: "/how-it-works",
  },
  sections: {
    demoQuiz: true,
    problem: true,
    reportProof: true,
    subjects: true,
    path: true,
    progress: true,
    educators: true,
    testimonials: true,
    faq: true,
  },
  announcement: {
    enabled: false,
    text: "",
  },
};

export const QUESTION_TYPES = [
  { id: "mcq", label: "Multiple choice" },
  { id: "boolean", label: "True / false" },
  { id: "fill", label: "Fill in the blank" },
  { id: "short", label: "Short answer" },
  { id: "equation", label: "Equation / expression" },
  { id: "reading", label: "Reading question" },
  { id: "vocabulary", label: "Vocabulary question" },
];


/** Submissions already on record for the closed literacy checkpoint. */
export const SEED_SUBMISSIONS = STUDENTS.filter((student) => student.classId === "cls_10b")
  .slice(0, 3)
  .map((student, index) => ({
    id: `sub_seed_${index + 1}`,
    assignmentId: "asg_003",
    assignmentTitle: "Literacy checkpoint — completed set",
    studentId: student.id,
    studentName: student.name,
    className: student.className,
    subject: "english",
    score: student.english ?? 70,
    submittedAt: "2026-09-04",
  }));
