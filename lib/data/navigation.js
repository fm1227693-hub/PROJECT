/**
 * Navigation model. Icons are referenced by *name* and resolved in the
 * components, so this file stays serialisable (and could be served by an API).
 */

export const PUBLIC_NAV = [
  {
    label: "Products",
    href: "/how-it-works",
    icon: "layers",
    children: [
      { label: "How it works", href: "/how-it-works", description: "Test → Diagnose → Learn → Improve", icon: "route" },
      { label: "Personalized learning", href: "/personalized-learning", description: "How results become a plan", icon: "compass" },
      { label: "Sample report", href: "/sample-report", description: "A real diagnostic, fully explained", icon: "file-text" },
      { label: "Mathematics topics", href: "/subjects/math", description: "The full math skill map", icon: "sigma" },
      { label: "English topics", href: "/subjects/english", description: "The full English skill map", icon: "book-open" },
    ],
  },
  { label: "Mathematics", href: "/diagnostic/math", icon: "sigma" },
  { label: "English", href: "/diagnostic/english", icon: "languages" },
  { label: "For Students", href: "/students", icon: "graduation-cap" },
  {
    label: "For Educators",
    href: "/teachers",
    icon: "presentation",
    children: [
      { label: "Teachers", href: "/teachers", description: "Class analytics and assignments", icon: "presentation" },
      { label: "Tutors", href: "/tutors", description: "One-to-one diagnostic insight", icon: "user-check" },
      { label: "Schools", href: "/schools", description: "Organisation-wide reporting", icon: "building" },
    ],
  },
  { label: "Pricing", href: "/pricing", icon: "badge-dollar-sign" },
];

export const PUBLIC_ACTIONS = [
  { label: "Log in", href: "/login", variant: "ghost" },
  { label: "Get started", href: "/register", variant: "primary" },
];

export const FOOTER_NAV = [
  {
    title: "Product",
    links: [
      { label: "Math Diagnostic", href: "/diagnostic/math" },
      { label: "English Diagnostic", href: "/diagnostic/english" },
      { label: "Learning Paths", href: "/personalized-learning" },
      { label: "Progress Tracking", href: "/student/progress" },
      { label: "Sample Report", href: "/sample-report" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "For Educators",
    links: [
      { label: "Teachers", href: "/teachers" },
      { label: "Tutors", href: "/tutors" },
      { label: "Schools", href: "/schools" },
      { label: "Teacher Dashboard", href: "/teacher/dashboard" },
      { label: "School Analytics", href: "/school/analytics" },
      { label: "Question Bank", href: "/teacher/question-bank" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Assessment Policy", href: "/terms" },
      { label: "Accessibility", href: "/privacy" },
    ],
  },
];

export const STUDENT_NAV = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/student/dashboard", icon: "layout-dashboard", end: true },
      { label: "My Skills", href: "/student/skills", icon: "radar" },
      { label: "My Progress", href: "/student/progress", icon: "trending-up" },
    ],
  },
  {
    group: "Diagnose",
    items: [
      { label: "Start Diagnostic", href: "/student/diagnostic/start", icon: "scan-line" },
      { label: "Math Analysis", href: "/student/diagnostic/math-analysis", icon: "sigma" },
      { label: "English Analysis", href: "/student/diagnostic/english-analysis", icon: "languages" },
      { label: "Results", href: "/student/diagnostic/results", icon: "award" },
    ],
  },
  {
    group: "Learn",
    items: [
      { label: "Learning Path", href: "/student/learning-path", icon: "route" },
      { label: "Recommended Plan", href: "/student/recommended-plan", icon: "compass" },
      { label: "Practice Center", href: "/student/practice", icon: "dumbbell" },
      { label: "Mathematics", href: "/student/math", icon: "sigma" },
      { label: "English", href: "/student/english", icon: "book-open" },
    ],
  },
  {
    group: "Record",
    items: [
      { label: "Achievements", href: "/student/achievements", icon: "medal" },
      { label: "Study History", href: "/student/history", icon: "history" },
      { label: "Certificates", href: "/student/certificates", icon: "scroll-text" },
      { label: "Profile", href: "/student/profile", icon: "user" },
    ],
  },
];

export const TEACHER_NAV = [
  {
    group: "Teaching",
    items: [
      { label: "Dashboard", href: "/teacher/dashboard", icon: "layout-dashboard", end: true },
      { label: "Students", href: "/teacher/students", icon: "users" },
      { label: "Class Analytics", href: "/teacher/classes", icon: "bar-chart-3" },
    ],
  },
  {
    group: "Assessment",
    items: [
      { label: "Assign Diagnostic", href: "/teacher/assign", icon: "send" },
      { label: "Create Assessment", href: "/teacher/assessments/create", icon: "file-plus" },
      { label: "Assessment Results", href: "/teacher/assessments/results", icon: "clipboard-list" },
      { label: "Question Bank", href: "/teacher/question-bank", icon: "library" },
    ],
  },
  {
    group: "Planning",
    items: [{ label: "Learning Plans", href: "/teacher/learning-plans", icon: "route" }],
  },
];

export const SCHOOL_NAV = [
  {
    group: "Organisation",
    items: [
      { label: "Dashboard", href: "/school/dashboard", icon: "layout-dashboard", end: true },
      { label: "Students", href: "/school/students", icon: "users" },
      { label: "Teachers", href: "/school/teachers", icon: "presentation" },
      { label: "Analytics", href: "/school/analytics", icon: "activity" },
    ],
  },
];

export const ACCOUNT_NAV = [
  {
    group: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: "settings" },
      { label: "Billing", href: "/billing", icon: "credit-card" },
    ],
  },
  {
    group: "Switch view",
    items: [
      { label: "Student workspace", href: "/student/dashboard", icon: "graduation-cap" },
      { label: "Teacher workspace", href: "/teacher/dashboard", icon: "presentation" },
      { label: "School workspace", href: "/school/dashboard", icon: "building" },
    ],
  },
];

export const MOBILE_TABS = [
  { label: "Home", href: "/student/dashboard", icon: "layout-dashboard" },
  { label: "Skills", href: "/student/skills", icon: "radar" },
  { label: "Path", href: "/student/learning-path", icon: "route" },
  { label: "Practice", href: "/student/practice", icon: "dumbbell" },
  { label: "Progress", href: "/student/progress", icon: "trending-up" },
];

export const NAV_BY_ROLE = {
  student: STUDENT_NAV,
  teacher: TEACHER_NAV,
  school: SCHOOL_NAV,
  account: ACCOUNT_NAV,
};
