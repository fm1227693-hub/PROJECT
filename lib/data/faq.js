export const FAQ_CATEGORIES = [
  { id: "all", label: "All questions" },
  { id: "diagnostics", label: "Diagnostics" },
  { id: "mathematics", label: "Mathematics" },
  { id: "english", label: "English" },
  { id: "teachers", label: "Teachers & schools" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "accounts", label: "Accounts & data" },
];

export const FAQS = [
  {
    id: "faq_01",
    category: "diagnostics",
    question: "How is a Prisma diagnostic different from a normal test?",
    answer:
      "A normal test produces one number. A Prisma diagnostic attributes every question to a specific skill — quadratic equations, dependent prepositions, inference — and reports a separate mastery score for each. You finish knowing which two or three gaps explain most of your result, not just how large the result was.",
  },
  {
    id: "faq_02",
    category: "diagnostics",
    question: "How long does a full diagnostic take?",
    answer:
      "A complete Mathematics and English diagnostic runs to 30 questions and takes most learners 20 to 30 minutes. Subject-only diagnostics take roughly half that. You can pause and resume; progress is saved automatically.",
  },
  {
    id: "faq_03",
    category: "diagnostics",
    question: "Can I retake a diagnostic?",
    answer:
      "Yes — and you should. Retesting is how improvement becomes visible. On paid plans diagnostics are unlimited, and every attempt is stored so the platform can compare your newest result against the previous one, topic by topic.",
  },
  {
    id: "faq_04",
    category: "diagnostics",
    question: "Is the diagnostic adaptive?",
    answer:
      "The current release assigns questions by topic weight so every skill is measured with enough evidence to be trusted. Adaptive selection — where the next question depends on your last answer — is on the roadmap and the data model already supports it.",
  },
  {
    id: "faq_05",
    category: "mathematics",
    question: "Which Mathematics topics are measured?",
    answer:
      "Number systems, fractions, ratios and proportions, percentages, expressions and identities, linear equations, systems of equations, quadratic equations, inequalities, functions, plane geometry and coordinate geometry. These are grouped into three domains: Number & Operations, Algebra, and Geometry & Measure.",
  },
  {
    id: "faq_06",
    category: "mathematics",
    question: "What grade levels does the Mathematics diagnostic cover?",
    answer:
      "The bank spans Grades 5 to 12. Foundation items sit at Grades 5–7, core items at Grades 7–10, and advanced items — quadratics, functions, coordinate geometry — at Grades 9–12. The report tells you where on that ladder you currently stand.",
  },
  {
    id: "faq_07",
    category: "english",
    question: "Which English skills are measured?",
    answer:
      "Grammar (tenses, articles, prepositions, sentence structure, word formation), vocabulary (core academic words, meaning in context, word families), reading (main idea, inference, detail retrieval) and listening (gist and detail). Each is reported separately against CEFR-aligned bands from A1 to C1.",
  },
  {
    id: "faq_08",
    category: "english",
    question: "How does the listening section work?",
    answer:
      "Listening items are built around short recordings — public announcements and academic discussions. You hear each recording once or twice depending on the item type, then answer questions about gist, detail and speaker intent.",
  },
  {
    id: "faq_09",
    category: "english",
    question: "Is the English diagnostic suitable for exam preparation?",
    answer:
      "It is designed around the same skill structure used by international proficiency exams, so it tells you which underlying skills need work before you practise exam format. It is a diagnostic tool, not a replica of any specific exam.",
  },
  {
    id: "faq_10",
    category: "teachers",
    question: "What can a teacher see about an individual student?",
    answer:
      "The student's topic-level scores, their band for each skill, the gaps ranked by how much they cost the student marks, their progress across attempts, and the learning path the platform generated for them. Nothing is hidden behind an average.",
  },
  {
    id: "faq_11",
    category: "teachers",
    question: "Can I assign a diagnostic to a class?",
    answer:
      "Yes. Choose the subjects, set a due date, and select the students or whole class. Assigned diagnostics appear in each student's dashboard as a required task, and completion and results flow back to your class analytics automatically.",
  },
  {
    id: "faq_12",
    category: "teachers",
    question: "Can I build my own assessment?",
    answer:
      "Teachers on the Teacher and School plans can assemble an assessment from the question bank, filtering by subject, topic, difficulty and grade band, and can save it for reuse across cohorts.",
  },
  {
    id: "faq_13",
    category: "teachers",
    question: "What does a school administrator get?",
    answer:
      "Organisation-level analytics: total active students, average performance by subject, strongest and weakest topics across the school, improvement rate between terms, and teacher-level and class-level breakdowns.",
  },
  {
    id: "faq_14",
    category: "subscriptions",
    question: "What is included in the Free plan?",
    answer:
      "One full Mathematics and English diagnostic per month, the complete topic-level report, your strengths and gaps, and one generated learning path. It is enough to see exactly what the platform does before you pay for anything.",
  },
  {
    id: "faq_15",
    category: "subscriptions",
    question: "Can I change or cancel my plan at any time?",
    answer:
      "Yes. Upgrades take effect immediately and are prorated. Downgrades and cancellations take effect at the end of the current billing period, and your result history stays readable for the retention window of your plan.",
  },
  {
    id: "faq_16",
    category: "subscriptions",
    question: "Do you offer discounts for schools?",
    answer:
      "School pricing is per student and drops as enrolment grows, starting from $6 per student per month. Annual billing removes two months. Contact us with your student count and we will send a quote.",
  },
  {
    id: "faq_17",
    category: "accounts",
    question: "Who owns the diagnostic data?",
    answer:
      "You do. Learners can export their own results at any time. Schools control whether a teacher may view a student's detail, and a student's data is never sold or used for advertising.",
  },
  {
    id: "faq_18",
    category: "accounts",
    question: "Can a parent see their child's progress?",
    answer:
      "On the Pro plan a learner can invite up to two guardian seats with read-only access to reports and progress. Guardians cannot take diagnostics or change settings on the learner's behalf.",
  },
  {
    id: "faq_19",
    category: "accounts",
    question: "Which languages is the interface available in?",
    answer:
      "The interface currently ships in English. All user-facing copy is stored in a locale dictionary and every data structure is language-agnostic, so additional interface languages can be added without changing the product.",
  },
  {
    id: "faq_20",
    category: "accounts",
    question: "How do I delete my account?",
    answer:
      "Account deletion is available from Settings → Account. It removes your profile, results and learning paths permanently. If your account belongs to a school, ask your administrator to release it first so your history can be exported.",
  },
];

export const faqsForCategory = (category) =>
  category === "all" ? FAQS : FAQS.filter((item) => item.category === category);
