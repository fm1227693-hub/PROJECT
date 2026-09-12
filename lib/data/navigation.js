/**
 * Navigation model. Icons are referenced by *name* and resolved in the
 * components, so this file stays serialisable (and could be served by an API).
 */

export const PUBLIC_NAV = [
  {
    label: "Product",
    href: "/features",
    icon: "layers",
    children: [
      { label: "Features", href: "/features", description: "Everything Prisma does, grouped", icon: "sparkles" },
      { label: "How it works", href: "/how-it-works", description: "Test → Diagnose → Learn → Improve", icon: "route" },
      { label: "Diagnostics", href: "/student/diagnostic", description: "The diagnostic center", icon: "scan-line" },
      { label: "Personalized learning", href: "/personalized-learning", description: "How results become a plan", icon: "compass" },
      { label: "Progress tracking", href: "/progress", description: "Improvement on one ruler", icon: "trending-up" },
    ],
  },
  {
    label: "Subjects",
    href: "/math",
    icon: "sigma",
    children: [
      { label: "Mathematics", href: "/math", description: "The full math skill map", icon: "sigma" },
      { label: "Math diagnostic", href: "/math-diagnostic", description: "What the math paper measures", icon: "calculator" },
      { label: "English", href: "/english", description: "The full English skill map", icon: "book-open" },
      { label: "English diagnostic", href: "/english-diagnostic", description: "Grammar to listening", icon: "languages" },
    ],
  },
  {
    label: "For",
    href: "/students",
    icon: "users",
    children: [
      { label: "Students", href: "/students", description: "Your level, your gaps, your plan", icon: "graduation-cap" },
      { label: "Teachers", href: "/teachers", description: "Class analytics and assignments", icon: "presentation" },
      { label: "Tutors", href: "/tutors", description: "One-to-one diagnostic insight", icon: "user-check" },
      { label: "Schools", href: "/schools", description: "Organisation-wide reporting", icon: "building" },
    ],
  },
  {
    label: "Resources",
    href: "/sample-report",
    icon: "library",
    children: [
      { label: "Sample report", href: "/sample-report", description: "A real diagnostic, fully explained", icon: "file-text" },
      { label: "FAQ", href: "/faq", description: "The help centre", icon: "help-circle" },
      { label: "About Prisma", href: "/about", description: "Why we build this", icon: "info" },
      { label: "Contact", href: "/contact", description: "Talk to the team", icon: "mail" },
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
      { label: "Features", href: "/features" },
      { label: "Math Diagnostic", href: "/math-diagnostic" },
      { label: "English Diagnostic", href: "/english-diagnostic" },
      { label: "Learning Paths", href: "/personalized-learning" },
      { label: "Progress Tracking", href: "/progress" },
      { label: "Sample Report", href: "/sample-report" },
    ],
  },
  {
    title: "For Educators",
    links: [
      { label: "Teachers", href: "/teachers" },
      { label: "Tutors", href: "/tutors" },
      { label: "Schools", href: "/schools" },
      { label: "Teacher Dashboard", href: "/teacher/dashboard" },
      { label: "Teacher Analytics", href: "/teacher/analytics" },
      { label: "School Analytics", href: "/school/analytics" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "How It Works", href: "/how-it-works" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Settings", href: "/settings" },
      { label: "Billing", href: "/billing" },
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
      { label: "Diagnostic Center", href: "/student/diagnostic", icon: "scan-line" },
      { label: "Start Diagnostic", href: "/student/diagnostic/start", icon: "play" },
      { label: "Results", href: "/student/diagnostic/results", icon: "award" },
      { label: "Detailed Analysis", href: "/student/diagnostic/analysis", icon: "microscope" },
    ],
  },
  {
    group: "Learn",
    items: [
      { label: "Assignments", href: "/student/assignments", icon: "calendar-clock" },
      { label: "Learning Path", href: "/student/learning-path", icon: "route" },
      { label: "Recommendations", href: "/student/recommendations", icon: "compass" },
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
      { label: "Classes", href: "/teacher/classes", icon: "school" },
      { label: "Assignments", href: "/teacher/assignments", icon: "calendar-clock" },
    ],
  },
  {
    group: "Insight",
    items: [{ label: "Analytics", href: "/teacher/analytics", icon: "bar-chart-3" }],
  },
];

export const SCHOOL_NAV = [
  {
    group: "Organisation",
    items: [
      { label: "Dashboard", href: "/school/dashboard", icon: "layout-dashboard", end: true },
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

export const ADMIN_NAV = [
  {
    group: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "layout-dashboard", end: true },
      { label: "Analytics", href: "/admin/analytics", icon: "activity" },
      { label: "Reports", href: "/admin/reports", icon: "file-spreadsheet" },
    ],
  },
  {
    group: "People",
    items: [
      { label: "All Users", href: "/admin/users", icon: "users" },
      { label: "Students", href: "/admin/students", icon: "graduation-cap" },
      { label: "Teachers", href: "/admin/teachers", icon: "presentation" },
      { label: "Teacher Applications", href: "/admin/teacher-applications", icon: "clipboard-check" },
      { label: "Classes", href: "/admin/classes", icon: "school" },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "Learning Content", href: "/admin/learning-content", icon: "book-marked" },
      { label: "Subjects & Topics", href: "/admin/subjects", icon: "layers" },
      { label: "Question Bank", href: "/admin/questions", icon: "flask-conical" },
      { label: "Tests", href: "/admin/tests", icon: "file-check-2" },
      { label: "Test Results", href: "/admin/test-results", icon: "list-checks" },
    ],
  },
  {
    group: "Communication",
    items: [
      { label: "Announcements", href: "/admin/announcements", icon: "megaphone" },
      { label: "Notifications", href: "/admin/notifications", icon: "bell" },
    ],
  },
  {
    group: "Site",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: "panel-top" },
      { label: "FAQ", href: "/admin/faq", icon: "help-circle" },
      { label: "Pricing", href: "/admin/pricing", icon: "badge-dollar-sign" },
    ],
  },
  {
    group: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: "settings" }],
  },
];

export const NAV_BY_ROLE = {
  student: STUDENT_NAV,
  teacher: TEACHER_NAV,
  school: SCHOOL_NAV,
  account: ACCOUNT_NAV,
  admin: ADMIN_NAV,
};
