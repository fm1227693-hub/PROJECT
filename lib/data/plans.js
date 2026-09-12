/**
 * Pricing architecture. Prices are placeholder values — the structure
 * (plans → features → limits) is what a billing backend would consume.
 */

export const BILLING_CYCLES = [
  { id: "monthly", label: "Monthly", note: "Billed every month" },
  { id: "annual", label: "Annual", note: "Two months free" },
];

export const PLANS = [
  {
    id: "free",
    name: "Free",
    audience: "Curious learners",
    tagline: "One full diagnostic and a taste of the report.",
    price: { monthly: 0, annual: 0 },
    currency: "USD",
    cta: "Start free",
    href: "/register",
    featured: false,
    limits: { diagnosticsPerMonth: 1, students: 1, learningPaths: 1, historyMonths: 3 },
    features: [
      { label: "1 full Math + English diagnostic per month", included: true },
      { label: "Topic-level score report", included: true },
      { label: "Strengths and gaps summary", included: true },
      { label: "One generated learning path", included: true },
      { label: "3 months of result history", included: true },
      { label: "Unlimited practice sets", included: false },
      { label: "Progress trend charts", included: false },
      { label: "Teacher or school reporting", included: false },
    ],
  },
  {
    id: "student",
    name: "Student",
    audience: "Independent learners",
    tagline: "Unlimited diagnostics and a path that adapts to every result.",
    price: { monthly: 9, annual: 7 },
    currency: "USD",
    cta: "Choose Student",
    href: "/register?plan=student",
    featured: true,
    limits: { diagnosticsPerMonth: -1, students: 1, learningPaths: -1, historyMonths: -1 },
    features: [
      { label: "Unlimited diagnostics", included: true },
      { label: "Full topic-level analysis", included: true },
      { label: "Adaptive learning paths", included: true },
      { label: "Unlimited practice sets by topic and difficulty", included: true },
      { label: "Progress trends and retest comparison", included: true },
      { label: "Achievements, streaks and certificates", included: true },
      { label: "Full result history", included: true },
      { label: "Class and organisation analytics", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    audience: "Exam candidates",
    tagline: "Everything in Student, tuned for a target exam and deadline.",
    price: { monthly: 16, annual: 13 },
    currency: "USD",
    cta: "Choose Pro",
    href: "/register?plan=pro",
    featured: false,
    limits: { diagnosticsPerMonth: -1, students: 1, learningPaths: -1, historyMonths: -1 },
    features: [
      { label: "Everything in Student", included: true },
      { label: "Exam-targeted plans with deadlines", included: true },
      { label: "Timed diagnostic conditions", included: true },
      { label: "Predicted score at plan completion", included: true },
      { label: "Priority question sets for weak topics", included: true },
      { label: "Printable diagnostic reports", included: true },
      { label: "Two parent or guardian seats", included: true },
      { label: "Class and organisation analytics", included: false },
    ],
  },
  {
    id: "teacher",
    name: "Teacher",
    audience: "Classroom teachers & tutors",
    tagline: "See every student's gaps in one view and assign what to do next.",
    price: { monthly: 24, annual: 19 },
    currency: "USD",
    cta: "Choose Teacher",
    href: "/register?plan=teacher",
    featured: false,
    perSeat: true,
    limits: { diagnosticsPerMonth: -1, students: 40, learningPaths: -1, historyMonths: -1 },
    features: [
      { label: "Up to 40 students per class", included: true },
      { label: "Class-level topic analytics", included: true },
      { label: "Assign diagnostics with deadlines", included: true },
      { label: "Build custom assessments", included: true },
      { label: "Full question bank with filters", included: true },
      { label: "Per-student learning plan review", included: true },
      { label: "Exportable reports (CSV / PDF)", included: true },
      { label: "Multiple teachers and organisation analytics", included: false },
    ],
  },
  {
    id: "school",
    name: "School",
    audience: "Schools & education centres",
    tagline: "Organisation-wide insight across teachers, classes and year groups.",
    price: { monthly: 6, annual: 5 },
    currency: "USD",
    cta: "Talk to us",
    href: "/contact",
    featured: false,
    perStudent: true,
    quote: true,
    limits: { diagnosticsPerMonth: -1, students: -1, learningPaths: -1, historyMonths: -1 },
    features: [
      { label: "Unlimited teachers and classes", included: true },
      { label: "Per-student pricing from $6/month", included: true },
      { label: "Organisation analytics and cohort comparison", included: true },
      { label: "Year-group and subject reporting", included: true },
      { label: "Role-based access and data ownership controls", included: true },
      { label: "Single sign-on (SAML / Google Workspace)", included: true },
      { label: "Onboarding and staff training", included: true },
      { label: "Dedicated success manager", included: true },
    ],
  },
];

export const PLAN_BY_ID = Object.fromEntries(PLANS.map((p) => [p.id, p]));

export const PLAN_COMPARISON = [
  { group: "Assessment", rows: [
    { label: "Full Math + English diagnostic", free: "1 / month", student: "Unlimited", pro: "Unlimited", teacher: "Unlimited", school: "Unlimited" },
    { label: "Topic-level score breakdown", free: true, student: true, pro: true, teacher: true, school: true },
    { label: "Timed exam conditions", free: false, student: false, pro: true, teacher: true, school: true },
    { label: "Custom assessments", free: false, student: false, pro: false, teacher: true, school: true },
    { label: "Question bank access", free: "Preview", student: true, pro: true, teacher: "Full + create", school: "Full + create" },
  ]},
  { group: "Learning", rows: [
    { label: "Generated learning path", free: "1", student: "Unlimited", pro: "Unlimited", teacher: "Per student", school: "Per student" },
    { label: "Practice sets", free: "3 / month", student: "Unlimited", pro: "Unlimited", teacher: "Unlimited", school: "Unlimited" },
    { label: "Predicted score at completion", free: false, student: false, pro: true, teacher: true, school: true },
    { label: "Certificates", free: false, student: true, pro: true, teacher: false, school: false },
  ]},
  { group: "Insight", rows: [
    { label: "Progress trends", free: "3 months", student: "Full history", pro: "Full history", teacher: "Full history", school: "Full history" },
    { label: "Retest comparison", free: false, student: true, pro: true, teacher: true, school: true },
    { label: "Class analytics", free: false, student: false, pro: false, teacher: true, school: true },
    { label: "Organisation analytics", free: false, student: false, pro: false, teacher: false, school: true },
  ]},
  { group: "Administration", rows: [
    { label: "Student seats", free: "1", student: "1", pro: "1", teacher: "Up to 40", school: "Unlimited" },
    { label: "Role-based access", free: false, student: false, pro: false, teacher: true, school: true },
    { label: "Single sign-on", free: false, student: false, pro: false, teacher: false, school: true },
    { label: "Data export", free: false, student: "PDF", pro: "PDF", teacher: "PDF + CSV", school: "PDF + CSV + API" },
  ]},
];

export const INVOICES = [
  { id: "inv_2409", number: "PRISMA-2409", date: "2026-09-06", description: "Student plan · monthly", amount: 9, currency: "USD", status: "paid", method: "Visa •••• 4291" },
  { id: "inv_2408", number: "PRISMA-2408", date: "2026-08-06", description: "Student plan · monthly", amount: 9, currency: "USD", status: "paid", method: "Visa •••• 4291" },
  { id: "inv_2407", number: "PRISMA-2407", date: "2026-07-06", description: "Student plan · monthly", amount: 9, currency: "USD", status: "paid", method: "Visa •••• 4291" },
  { id: "inv_2406", number: "PRISMA-2406", date: "2026-06-06", description: "Upgrade to Student plan (prorated)", amount: 5.4, currency: "USD", status: "paid", method: "Visa •••• 4291" },
  { id: "inv_2405", number: "PRISMA-2405", date: "2026-05-06", description: "Free plan", amount: 0, currency: "USD", status: "none", method: "—" },
];

export const PAYMENT_METHODS = [
  { id: "pm_visa", brand: "Visa", last4: "4291", expiry: "09/28", primary: true },
  { id: "pm_mc", brand: "Mastercard", last4: "7710", expiry: "02/27", primary: false },
];
