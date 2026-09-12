/**
 * All long-form marketing copy lives here, keyed by section.
 * Components read from this file so translation is a data swap, not a refactor.
 */

export const HERO = {
  eyebrow: "Math & English Diagnostic Center",
  titleLines: ["Know what you know.", "Know what to learn next."],
  body:
    "Diagnose your Mathematics and English skills, discover your weak areas, and follow a personalized learning path built around your actual needs — not around a single number.",
  primaryCta: { label: "Take a Diagnostic", href: "/student/diagnostic/start" },
  secondaryCta: { label: "Explore the Platform", href: "/how-it-works" },
  meta: [
    { label: "Questions", value: 30, suffix: "" },
    { label: "Skills measured", value: 25, suffix: "" },
    { label: "Minutes", value: 26, suffix: "", hint: "20–30 typical" },
  ],
};

/** Landing story arc: Problem → Solution → Proof → Personalization → Progress → CTA */
export const STORY = {
  problem: {
    eyebrow: "The problem",
    title: "Most students know their score. Almost none know what it means.",
    body:
      "Two learners can both score 68% in Mathematics and need completely different help. One is losing marks on quadratic equations, the other on ratios. The number hides the reason — so revision becomes guesswork, and effort goes to the topics that were already fine.",
    bullets: [
      "A single grade cannot tell you what to study next.",
      "Students revise what they already understand because it feels productive.",
      "Teachers see the class average and miss the individual gap.",
      "Parents hear “68%” and cannot act on it.",
    ],
  },
  solution: {
    eyebrow: "How Prisma answers it",
    title: "We separate the score into the skills that produced it.",
    body:
      "Every question in a Prisma diagnostic is mapped to one specific skill. Your result is not one number — it is a map of 25 measured skills, each scored, banded, and ranked by how much it is actually costing you.",
    bullets: [
      "25 measured skills across Mathematics and English.",
      "Each gap ranked by impact: topic weight × distance from a strong score.",
      "A plain-language diagnosis, written the way a good tutor would say it.",
      "A sequenced plan generated from the diagnosis, not from a template.",
    ],
  },
  proof: {
    eyebrow: "What a report actually says",
    title: "Not “you scored 68%”. Instead: here is exactly why.",
    body:
      "This is a real Prisma report. Read the diagnosis line — it is the entire product in one sentence.",
  },
  personalization: {
    eyebrow: "Personalization",
    title: "Weaknesses become a plan with a week attached to each one.",
    body:
      "The highest-impact gaps are expanded into their learning units and packed into weeks that fit your study budget. Every week ends with practice; every second week ends with a short assessment so the next plan is built on evidence.",
  },
  progress: {
    eyebrow: "Progress",
    title: "Retest, and see the same map move.",
    body:
      "Because every attempt is scored on the same skill definitions, improvement is measurable topic by topic — not inferred from a grade that may simply have been an easier paper.",
  },
  cta: {
    title: "Find out where you stand.",
    body:
      "Twenty minutes now tells you what to do with the next twenty hours. Start with the free diagnostic — no card required.",
    primary: { label: "Take a Diagnostic", href: "/student/diagnostic/start" },
    secondary: { label: "See a sample report", href: "/sample-report" },
  },
};

export const HOW_IT_WORKS = {
  eyebrow: "The method",
  title: "Four steps, and the second one is the important one.",
  body:
    "Testing is easy. Interpretation is the hard part — and it is where almost every assessment product stops.",
  steps: [
    {
      id: "test",
      n: "01",
      title: "Test",
      icon: "scan-line",
      time: "20–30 minutes",
      summary: "Answer 30 questions across Mathematics and English in a calm, distraction-free interface.",
      detail:
        "Each question is pre-mapped to one skill and weighted by how much of the subject that skill explains. Nothing is asked that cannot be reported back to you.",
      outcomes: ["30 questions", "Mathematics + English", "Pause and resume", "Optional timer"],
      preview: [
        { label: "Mathematics items", value: "15" },
        { label: "English items", value: "15" },
        { label: "Reading passages", value: "2" },
        { label: "Listening tracks", value: "2" },
        { label: "Typical completion", value: "26 min" },
      ],
    },
    {
      id: "diagnose",
      n: "02",
      title: "Diagnose",
      icon: "radar",
      time: "Instant",
      summary: "Receive a topic-level map of your ability, with every gap ranked by real impact.",
      detail:
        "Domain scores are derived from topic scores, never stored separately, so a report can never contradict itself. Impact is calculated as topic weight × distance from a strong score — the number of points you would recover by closing that gap.",
      outcomes: ["25 measured skills", "Strength / developing / risk bands", "Impact ranking", "Plain-language diagnosis"],
      preview: [
        { label: "Mathematics", value: "68%", tone: "ink" },
        { label: "Algebra domain", value: "62%", tone: "risk" },
        { label: "Linear Equations", value: "90%", tone: "strong" },
        { label: "Quadratic Equations", value: "41%", tone: "risk" },
        { label: "English", value: "74%" },
        { label: "Vocabulary domain", value: "54%", tone: "risk" },
      ],
    },
    {
      id: "learn",
      n: "03",
      title: "Learn",
      icon: "route",
      time: "4–8 weeks",
      summary: "Follow a generated path that targets your weakest skills first, in the right order.",
      detail:
        "A weak topic is expanded into its learning units — fundamentals, method, practice set, mini assessment — and packed into weeks that respect your weekly study budget. Strong skills are scheduled for maintenance, not repair.",
      outcomes: ["Weekly units", "Practice sets by topic", "Mini assessments", "Projected score at completion"],
      preview: [
        { label: "Week 1", value: "Quadratic fundamentals" },
        { label: "Week 2", value: "Inequalities" },
        { label: "Week 3", value: "Core vocabulary" },
        { label: "Week 4", value: "Systems of equations" },
        { label: "Total study time", value: "392 min" },
      ],
    },
    {
      id: "improve",
      n: "04",
      title: "Improve",
      icon: "trending-up",
      time: "Ongoing",
      summary: "Retest and compare the same map, skill by skill, attempt by attempt.",
      detail:
        "Progress is measured against your own previous attempts on identical skill definitions. You can see which gap closed, which stalled, and what the next plan should target.",
      outcomes: ["Retest comparison", "Topic deltas", "Trend charts", "Regenerated path"],
      preview: [
        { label: "Mathematics, March", value: "52%" },
        { label: "Mathematics, September", value: "68%", tone: "strong" },
        { label: "English, March", value: "61%" },
        { label: "English, September", value: "74%", tone: "strong" },
        { label: "Largest gain", value: "+14 pts" , tone: "strong"},
      ],
    },
  ],
};

export const ABOUT = {
  eyebrow: "About Prisma",
  title: "We built the interpretation layer that assessment never had.",
  intro:
    "Prisma exists because a score is not information. It is the compressed output of twenty-five separate abilities, and compression loses exactly the part a learner needs.",
  sections: [
    {
      id: "mission",
      title: "Mission",
      icon: "target",
      body:
        "Make it impossible for a learner to finish an assessment without knowing what to do next. Every screen in Prisma is judged against one question: does the person leave knowing their next action?",
    },
    {
      id: "problem",
      title: "The problem",
      icon: "alert-triangle",
      body:
        "Testing has never been cheaper and interpretation has never been scarcer. Platforms generate results at scale and hand back a percentage. Students respond by revising everything, or by revising what feels comfortable. Teachers respond by teaching to the class average. Both are rational reactions to insufficient information.",
    },
    {
      id: "solution",
      title: "Our solution",
      icon: "prism",
      body:
        "A diagnostic that reports the spectrum instead of the single beam. Every question carries a skill attribution and a weight. Results are decomposed, banded, and ranked by the number of points each gap costs. The ranked gaps are then expanded into a sequenced plan with a week attached to each one.",
    },
    {
      id: "philosophy",
      title: "Philosophy",
      icon: "compass",
      body:
        "Three rules shape every decision. First, derived data only — a domain score is always computed from its topics, so reports cannot disagree with themselves. Second, explainability — every recommendation can answer “why this?” with arithmetic a student can check. Third, restraint — no confetti, no leaderboards, no dark patterns. Motivation should come from seeing a real gap close.",
    },
    {
      id: "approach",
      title: "Educational approach",
      icon: "graduation-cap",
      body:
        "We follow a mastery model rather than a coverage model. A skill is not “done” because a lesson was watched; it is done when measured performance holds above the strong threshold. Units are ordered so prerequisites come first, and every second week ends with a short assessment that feeds the next plan.",
    },
    {
      id: "vision",
      title: "Where this goes",
      icon: "telescope",
      body:
        "Mathematics and English are the first two subjects because they carry the widest diagnostic signal. The skill graph, weighting model and plan generator are subject-agnostic: adding sciences or a second language means adding topics and questions, not rebuilding the product. Longer term we want adaptive selection, where the next question is chosen from the current estimate of your ability, so a diagnostic can reach the same precision in half the time.",
    },
  ],
  principles: [
    { title: "Derived, never duplicated", body: "Every aggregate in Prisma is computed from topic scores at read time." },
    { title: "Explainable by default", body: "Impact = weight × deficit. If we cannot show the arithmetic, we do not show the recommendation." },
    { title: "Calm interfaces", body: "One primary action per screen. No animation that does not carry meaning." },
    { title: "Learner-owned data", body: "Results belong to the student, are exportable, and are never sold." },
  ],
};

export const BENEFITS = {
  eyebrow: "Why it works",
  title: "Built around measurable progress.",
  body:
    "Four capabilities, each one designed to remove a specific kind of guesswork from studying.",
  items: [
    {
      id: "clarity",
      icon: "scan-line",
      title: "Diagnostic clarity",
      body:
        "Every question maps to one skill, so a result decomposes into 25 measured abilities rather than collapsing into one grade.",
      points: ["Topic-level scores", "Domain roll-ups derived from topics", "Evidence per skill"],
    },
    {
      id: "analysis",
      icon: "radar",
      title: "Skill-level analysis",
      body:
        "Gaps are banded and ranked by impact — the points you would recover by closing each one — so effort goes where it returns most.",
      points: ["Strength / developing / risk", "Impact ranking", "Common error patterns"],
    },
    {
      id: "recommendation",
      icon: "compass",
      title: "Personalized recommendations",
      body:
        "The ranked gaps are expanded into learning units and packed into weeks that fit the learner's actual study budget.",
      points: ["Sequenced weekly plan", "Practice sets per topic", "Projected score at completion"],
    },
    {
      id: "tracking",
      icon: "trending-up",
      title: "Progress tracking",
      body:
        "Retests are compared on identical skill definitions, so improvement is measured rather than assumed.",
      points: ["Attempt history", "Topic deltas", "Trend and radar charts"],
    },
  ],
};

export const AUDIENCES = {
  students: {
    eyebrow: "For students",
    title: "Stop revising everything. Start revising the right thing.",
    body:
      "You already know how much time you have. What you are missing is a reliable answer to “where should that time go?”. Prisma gives you that answer in one sentence, then hands you the plan that follows from it.",
    benefits: [
      { title: "Know your real level", body: "A topic-level map of Mathematics and English, not a single percentage." },
      { title: "See why you lost marks", body: "Each gap is reported with the error patterns that typically cause it." },
      { title: "Get a plan you can finish", body: "Weekly units sized to your study budget, weakest gap first." },
      { title: "Watch the map move", body: "Retest and compare skill by skill against your own previous attempts." },
      { title: "Practise what matters", body: "Practice sets filtered by topic and difficulty, generated from your diagnosis." },
      { title: "Keep the record", body: "History, achievements and printable certificates for every milestone." },
    ],
    steps: [
      "Take the free diagnostic — 20 to 30 minutes.",
      "Read the diagnosis: your strongest skills and the gaps ranked by impact.",
      "Generate a learning path and work the first week.",
      "Retest after four weeks and compare the same map.",
    ],
    cta: { label: "Take a Diagnostic", href: "/student/diagnostic/start" },
  },
  teachers: {
    eyebrow: "For teachers",
    title: "See twenty-four different gaps in one class view.",
    body:
      "A class average tells you how the lesson landed. It does not tell you which student needs the discriminant and which needs dependent prepositions. Prisma reports both, in the same screen.",
    benefits: [
      { title: "Class-level topic analytics", body: "Strongest and weakest topics across the whole cohort, ranked by how many students fall below threshold." },
      { title: "Individual student detail", body: "Topic scores, bands, gaps, progress and the plan generated for each learner." },
      { title: "Assign diagnostics", body: "Set subjects, a due date and a cohort; results return to your analytics automatically." },
      { title: "Build assessments", body: "Assemble a paper from the question bank by subject, topic, difficulty and grade band." },
      { title: "Review learning plans", body: "See, adjust and approve the path the engine generated for each student." },
      { title: "Export the evidence", body: "CSV and PDF reports for parents, departments and inspections." },
    ],
    steps: [
      "Import or add your class roster.",
      "Assign a full diagnostic with a due date.",
      "Read the class topic map to plan the next lesson.",
      "Open an individual student when you need the detail.",
    ],
    cta: { label: "Open the teacher dashboard", href: "/teacher/dashboard" },
  },
  tutors: {
    eyebrow: "For tutors",
    title: "Walk into every session already knowing where to start.",
    body:
      "One-to-one teaching fails most often at diagnosis, not delivery. Prisma gives an independent tutor the same analytic depth a large centre has, without the administrative weight.",
    benefits: [
      { title: "Pre-session briefing", body: "Each student's current gaps, ranked, before you open the first exercise." },
      { title: "Multi-student roster", body: "Up to forty students per class on the Teacher plan, each with its own topic map." },
      { title: "Between-session practice", body: "Assign topic practice sets and see completion and accuracy on return." },
      { title: "Progress evidence for parents", body: "Printable reports that show the gap closing, in numbers and dates." },
      { title: "Question bank access", body: "Filter by topic and difficulty to build a session in minutes." },
      { title: "No admin overhead", body: "No scheduling, invoicing or LMS to maintain alongside it." },
    ],
    steps: [
      "Ask the student to complete a diagnostic before the first session.",
      "Read the ranked gaps and pick the top one or two.",
      "Teach to the gap, then assign a matching practice set.",
      "Retest after four to six weeks and show the delta to the parent.",
    ],
    cta: { label: "Open the teacher dashboard", href: "/teacher/dashboard" },
  },
  schools: {
    eyebrow: "For schools",
    title: "One shared picture of attainment across the organisation.",
    body:
      "Departments currently argue from different data. Prisma gives the leadership team, the department and the classroom teacher the same skill definitions — so disagreements become about teaching, not about measurement.",
    benefits: [
      { title: "Organisation analytics", body: "Total active students, average performance, improvement rate, strongest and weakest topics across the school." },
      { title: "Cohort comparison", body: "Compare year groups, classes and subjects on identical skill definitions." },
      { title: "Teacher workload visibility", body: "See which classes have been diagnosed recently and which are overdue." },
      { title: "Role-based access", body: "Control what a teacher may see about a student, and what a guardian may see." },
      { title: "Single sign-on", body: "SAML and Google Workspace, with roster sync." },
      { title: "Data ownership", body: "Student data stays with the school, exportable in full at any time." },
    ],
    steps: [
      "Run a baseline diagnostic across the year groups you want to track.",
      "Read organisation analytics to set the term's priorities.",
      "Let departments plan against the weakest-topic ranking.",
      "Retest at the end of term and measure the improvement rate.",
    ],
    cta: { label: "Open the school dashboard", href: "/school/dashboard" },
  },
};

export const MATH_DIAGNOSTIC_PAGE = {
  eyebrow: "Mathematics diagnostic",
  title: "Twelve skills. One honest picture of your mathematical reasoning.",
  body:
    "Mathematics is not one ability; it is a sequence of them, and a weakness early in the sequence shows up as failure much later. Prisma measures each link separately so you can see where the chain actually breaks.",
  whatYouGet: [
    { title: "A topic-level score", body: "Twelve measured skills across three domains, each reported out of 100." },
    { title: "Domain roll-ups", body: "Number & Operations, Algebra, and Geometry & Measure — derived from topics, never stored separately." },
    { title: "An impact ranking", body: "Gaps ordered by how many points they cost your overall Mathematics score." },
    { title: "Error patterns", body: "The typical mistakes for each weak skill, so you know what to watch for." },
    { title: "A generated path", body: "Quadratic fundamentals, then factoring, then the discriminant — in the order that actually works." },
  ],
  mapTitle: "The Mathematics skill map.",
  mapBody:
    "Twelve measured skills arranged by domain and difficulty. Read the map the way a curriculum is built: left to right across domains, top to bottom through increasing demand.",
  detailTitle: "Every Mathematics skill, in full.",
  ctaTitle: "Find the link in the chain that is actually broken.",
  ctaBody:
    "A weakness in Foundation arithmetic usually surfaces later as failure in Algebra. The diagnostic tells you which one it is.",
  format: [
    { label: "Questions", value: "15 per Mathematics diagnostic" },
    { label: "Time", value: "12–15 minutes on its own" },
    { label: "Item types", value: "Multiple choice and short numeric response" },
    { label: "Levels", value: "Foundation · Core · Advanced (Grades 5–12)" },
    { label: "Scoring", value: "Weighted by topic; low-evidence topics are shrunk toward 50%" },
  ],
};

export const ENGLISH_DIAGNOSTIC_PAGE = {
  eyebrow: "English diagnostic",
  title: "Thirteen skills across grammar, vocabulary, reading and listening.",
  body:
    "English results are usually reported as one band, which hides the most actionable fact about a learner: whether the problem is accuracy, range, or comprehension. Prisma measures all three separately.",
  whatYouGet: [
    { title: "Four domains, thirteen skills", body: "Grammar & Structure, Vocabulary, Reading and Listening, each decomposed." },
    { title: "Accuracy vs range", body: "Grammar and vocabulary are reported separately, so “weak English” becomes a specific diagnosis." },
    { title: "Comprehension depth", body: "Main idea, inference and detail retrieval measured as distinct reading skills." },
    { title: "Listening under realistic conditions", body: "Announcements and academic discussion, tested for gist and for detail." },
    { title: "CEFR-aligned bands", body: "A1 to C1 descriptors attached to every skill score." },
  ],
  mapTitle: "The English skill map.",
  mapBody:
    "Thirteen measured skills across grammar, vocabulary, reading and listening. Each sits at a level of demand, and each is reported separately against CEFR-aligned bands.",
  detailTitle: "Every English skill, in full.",
  ctaTitle: "Find out whether the problem is accuracy, range, or comprehension.",
  ctaBody:
    "One English band hides three very different problems. The map separates them, and the plan follows from the diagnosis.",
  format: [
    { label: "Questions", value: "15 per English diagnostic" },
    { label: "Time", value: "14–18 minutes including listening" },
    { label: "Item types", value: "Multiple choice over passages and audio tracks" },
    { label: "Levels", value: "A1 → C1 (CEFR-aligned)" },
    { label: "Stimuli", value: "Two reading passages, two listening tracks" },
  ],
};

export const PERSONALIZED_LEARNING_PAGE = {
  eyebrow: "Personalized learning",
  title: "From a diagnosis to a plan, in one step.",
  body:
    "A recommendation engine is only trustworthy if you can check its working. Here is exactly how Prisma turns your scores into the next four weeks of study.",
  rules: [
    {
      n: "01",
      title: "Rank every gap by impact",
      body: "Impact = topic weight × distance from a strong score. A gap in a heavily weighted topic outranks a similar gap in a minor one, because it explains more of your result.",
      example: "Quadratic Equations: 41% · weight 12 → impact 4.7 points on your Mathematics score.",
    },
    {
      n: "02",
      title: "Expand the gap into its units",
      body: "Each topic carries an ordered set of learning units — fundamentals, method, application, practice set, mini assessment. The engine emits them in order rather than inventing a sequence.",
      example: "Quadratic fundamentals → Factoring → Discriminant → Quadratic formula → Practice set → Mini assessment.",
    },
    {
      n: "03",
      title: "Pack units into your week",
      body: "Units are grouped into weeks that respect your weekly study budget. A 240-minute budget produces a six-week plan; a 120-minute budget stretches the same content across eight.",
      example: "Balanced 240 min/week → 6 weeks · Intensive 420 min/week → 4 weeks · Steady 120 min/week → 8 weeks.",
    },
    {
      n: "04",
      title: "Close every cycle with evidence",
      body: "Each week ends with practice; every second week ends with a short assessment. Results feed back into the topic scores, so the next plan is generated from new evidence rather than from the original diagnosis.",
      example: "Complete Week 2 assessment → Inequalities re-scored → path regenerated.",
    },
    {
      n: "05",
      title: "Project the payoff",
      body: "The plan shows the score it expects you to reach, using a conservative 72% of each gap. If a projection looks unreachable, the plan is too ambitious and should be lengthened.",
      example: "Mathematics 68% → projected 76% on completion.",
    },
  ],
  contrast: {
    title: "Same score, different plan",
    body:
      "Two learners, both at 68% in Mathematics. Prisma generates completely different first weeks — which is the entire point.",
    a: {
      name: "Learner A",
      score: 68,
      strong: "Linear Equations 90%",
      weak: "Quadratic Equations 41%",
      week: "Week 1 · Quadratic fundamentals → factoring → discriminant → practice → mini assessment",
    },
    b: {
      name: "Learner B",
      score: 68,
      strong: "Quadratic Equations 78%",
      weak: "Ratios 52%",
      week: "Week 1 · Ratio language → unit rates → solving proportions → practice set",
    },
  },
};

export const TRUST = {
  eyebrow: "Why schools choose it",
  title: "Built around measurable progress.",
  body: "Four commitments that shape the product — and four things we deliberately refuse to do.",
  commitments: [
    { title: "Diagnostic clarity", body: "25 measured skills, each with enough evidence to be trusted." },
    { title: "Skill-level analysis", body: "Gaps ranked by impact, not listed alphabetically." },
    { title: "Personalized recommendations", body: "Generated from your scores, explainable in arithmetic." },
    { title: "Progress tracking", body: "Compared on identical skill definitions across attempts." },
  ],
  refusals: [
    { title: "No leaderboards", body: "Comparing a learner against strangers does not tell them what to study." },
    { title: "No invented statistics", body: "We do not claim audience numbers we cannot evidence." },
    { title: "No data resale", body: "Results belong to the learner and the school, and are exportable." },
    { title: "No engagement theatre", body: "Streaks exist to support a study habit, never to manufacture anxiety." },
  ],
};
