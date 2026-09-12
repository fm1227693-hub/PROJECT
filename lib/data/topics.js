/**
 * The Prisma skill taxonomy.
 *
 * Everything the product says about a learner is derived from this file:
 *   domains → topics → sub-skills → learning units
 *
 * `weight` is the share of a diagnostic devoted to the topic; domain and
 * overall scores are weighted means of topic scores (see lib/engine/scoring.js).
 * Swapping this file for an API response is the only change a backend needs.
 */

export const DOMAINS = {
  arithmetic: {
    id: "arithmetic",
    subject: "math",
    name: "Number & Operations",
    short: "Arithmetic",
    order: 1,
    description: "Number sense, fractions, ratio reasoning and percentage change.",
  },
  algebra: {
    id: "algebra",
    subject: "math",
    name: "Algebra",
    short: "Algebra",
    order: 2,
    description: "Manipulating symbols, solving equations and reasoning about relationships.",
  },
  geometry: {
    id: "geometry",
    subject: "math",
    name: "Geometry & Measure",
    short: "Geometry",
    order: 3,
    description: "Shape, space, angle reasoning and the coordinate plane.",
  },
  grammar: {
    id: "grammar",
    subject: "english",
    name: "Grammar & Structure",
    short: "Grammar",
    order: 1,
    description: "The rules and patterns that make sentences accurate and clear.",
  },
  vocabulary: {
    id: "vocabulary",
    subject: "english",
    name: "Vocabulary",
    short: "Vocabulary",
    order: 2,
    description: "Breadth of word knowledge and precision of word choice.",
  },
  reading: {
    id: "reading",
    subject: "english",
    name: "Reading",
    short: "Reading",
    order: 3,
    description: "Extracting meaning, intent and detail from written text.",
  },
  listening: {
    id: "listening",
    subject: "english",
    name: "Listening",
    short: "Listening",
    order: 4,
    description: "Following spoken English at natural pace and register.",
  },
};

/**
 * Learning units are the atoms of a personalised path. Each weak topic is
 * expanded into its units by the recommendation engine.
 */
const u = (title, minutes, type = "lesson", focus = "") => ({ title, minutes, type, focus });

export const TOPICS = [
  /* ---------------------------------------------------------- MATHEMATICS */
  {
    id: "number_systems",
    subject: "math",
    domain: "arithmetic",
    name: "Number Systems",
    weight: 9,
    level: "Foundation",
    gradeBand: "Grades 5–7",
    summary: "Integers, ordering, place value and the rules of signed arithmetic.",
    skills: ["Integers & opposites", "Place value", "Ordering & rounding", "Order of operations"],
    commonErrors: ["Sign errors when subtracting negatives", "Misreading place value beyond millions"],
    units: [
      u("Integers and the number line", 12),
      u("Place value and rounding", 10),
      u("Order of operations", 14),
      u("Practice set · 20 items", 15, "practice"),
    ],
  },
  {
    id: "fractions",
    subject: "math",
    domain: "arithmetic",
    name: "Fractions",
    weight: 8,
    level: "Foundation",
    gradeBand: "Grades 5–8",
    summary: "Equivalence, the four operations and mixed numbers.",
    skills: ["Equivalent fractions", "Adding & subtracting", "Multiplying & dividing", "Mixed numbers"],
    commonErrors: ["Adding numerators and denominators", "Forgetting to invert when dividing"],
    units: [
      u("Equivalence and simplifying", 11),
      u("Common denominators", 13),
      u("Multiplying and dividing fractions", 12),
      u("Practice set · 18 items", 14, "practice"),
    ],
  },
  {
    id: "ratios",
    subject: "math",
    domain: "arithmetic",
    name: "Ratios & Proportions",
    weight: 7,
    level: "Core",
    gradeBand: "Grades 6–9",
    summary: "Comparing quantities, unit rates and proportional reasoning.",
    skills: ["Writing ratios", "Unit rate", "Proportional tables", "Scale drawings"],
    commonErrors: ["Treating a ratio as a fraction of the total", "Cross-multiplying the wrong pairs"],
    units: [
      u("Ratio language and notation", 10),
      u("Unit rates", 12),
      u("Solving proportions", 14),
      u("Practice set · 16 items", 13, "practice"),
    ],
  },
  {
    id: "percentages",
    subject: "math",
    domain: "arithmetic",
    name: "Percentages",
    weight: 6,
    level: "Core",
    gradeBand: "Grades 6–9",
    summary: "Percent of a quantity, reverse percentages and percentage change.",
    skills: ["Percent of a number", "Reverse percentage", "Percentage change", "Interest & discount"],
    commonErrors: ["Applying change to the wrong base", "Reversing a percentage by subtraction"],
    units: [
      u("Percent as a fraction and decimal", 9),
      u("Reverse percentages", 13),
      u("Percentage increase and decrease", 14),
      u("Practice set · 16 items", 12, "practice"),
    ],
  },
  {
    id: "expressions",
    subject: "math",
    domain: "algebra",
    name: "Expressions & Identities",
    weight: 8,
    level: "Core",
    gradeBand: "Grades 7–9",
    summary: "Expanding brackets, factorising and simplifying algebraic expressions.",
    skills: ["Collecting like terms", "Expanding single brackets", "Expanding double brackets", "Factorising"],
    commonErrors: ["Sign slips when expanding a negative bracket", "Stopping factorisation one step early"],
    units: [
      u("Like terms and simplification", 11),
      u("Expanding brackets", 13),
      u("Factorising quadratics", 16),
      u("Practice set · 20 items", 15, "practice"),
    ],
  },
  {
    id: "linear_equations",
    subject: "math",
    domain: "algebra",
    name: "Linear Equations",
    weight: 12,
    level: "Core",
    gradeBand: "Grades 7–10",
    summary: "Solving one-variable equations and modelling with straight lines.",
    skills: ["One- and two-step equations", "Variables on both sides", "Slope and intercept", "Word problems"],
    commonErrors: ["Dividing instead of subtracting when isolating x", "Mixing up slope and intercept"],
    units: [
      u("Balancing equations", 12),
      u("Variables on both sides", 14),
      u("Slope, intercept and graphing", 16),
      u("Modelling with linear equations", 15),
      u("Practice set · 22 items", 16, "practice"),
    ],
  },
  {
    id: "systems_of_equations",
    subject: "math",
    domain: "algebra",
    name: "Systems of Equations",
    weight: 9,
    level: "Advanced",
    gradeBand: "Grades 9–11",
    summary: "Solving simultaneous equations by substitution, elimination and graphing.",
    skills: ["Substitution", "Elimination", "Graphical interpretation", "No / infinite solutions"],
    commonErrors: ["Losing a sign during elimination", "Assuming every system has one solution"],
    units: [
      u("What a system represents", 10),
      u("Substitution method", 14),
      u("Elimination method", 15),
      u("Special cases", 12),
      u("Practice set · 18 items", 15, "practice"),
    ],
  },
  {
    id: "quadratic_equations",
    subject: "math",
    domain: "algebra",
    name: "Quadratic Equations",
    weight: 12,
    level: "Advanced",
    gradeBand: "Grades 9–12",
    summary: "Factorising, completing the square, the formula and the discriminant.",
    skills: ["Standard form", "Factoring", "Discriminant", "Quadratic formula", "Completing the square"],
    commonErrors: [
      "Forgetting the ± when taking a square root",
      "Sign errors in the discriminant b² − 4ac",
      "Factorising without checking by expanding back",
    ],
    units: [
      u("Quadratic fundamentals", 14),
      u("Factoring quadratics", 18),
      u("The discriminant", 13),
      u("The quadratic formula", 16),
      u("Completing the square", 17),
      u("Practice set · 24 items", 18, "practice"),
      u("Mini assessment", 10, "assessment"),
    ],
  },
  {
    id: "inequalities",
    subject: "math",
    domain: "algebra",
    name: "Inequalities",
    weight: 8,
    level: "Core",
    gradeBand: "Grades 8–11",
    summary: "Solving and graphing inequalities, including compound statements.",
    skills: ["Solving inequalities", "Flipping the sign", "Number line notation", "Compound inequalities"],
    commonErrors: [
      "Not reversing the sign when dividing by a negative",
      "Confusing open and closed endpoints",
    ],
    units: [
      u("Inequalities and the number line", 12),
      u("The sign-flip rule", 11),
      u("Compound inequalities", 14),
      u("Practice set · 18 items", 14, "practice"),
      u("Mini assessment", 9, "assessment"),
    ],
  },
  {
    id: "functions",
    subject: "math",
    domain: "algebra",
    name: "Functions",
    weight: 6,
    level: "Advanced",
    gradeBand: "Grades 9–12",
    summary: "Notation, domain and range, composition and transformations.",
    skills: ["Function notation", "Domain & range", "Composition", "Transformations"],
    commonErrors: ["Reading f(x) as f times x", "Applying transformations in the wrong order"],
    units: [
      u("Function notation", 12),
      u("Domain and range", 14),
      u("Composition of functions", 15),
      u("Practice set · 16 items", 13, "practice"),
    ],
  },
  {
    id: "plane_geometry",
    subject: "math",
    domain: "geometry",
    name: "Plane Geometry",
    weight: 9,
    level: "Core",
    gradeBand: "Grades 6–10",
    summary: "Angles, polygons, circles, perimeter, area and volume.",
    skills: ["Angle rules", "Triangles & polygons", "Circles", "Area, perimeter & volume"],
    commonErrors: ["Using diameter where radius is required", "Confusing exterior and interior angles"],
    units: [
      u("Angle relationships", 13),
      u("Triangles and polygons", 15),
      u("Circle measures", 13),
      u("Practice set · 18 items", 14, "practice"),
    ],
  },
  {
    id: "coordinate_geometry",
    subject: "math",
    domain: "geometry",
    name: "Coordinate Geometry",
    weight: 6,
    level: "Advanced",
    gradeBand: "Grades 9–11",
    summary: "The Cartesian plane, distance, midpoint and parallel/perpendicular lines.",
    skills: ["Plotting points", "Distance formula", "Midpoint", "Gradient of parallel lines"],
    commonErrors: ["Reversing x and y in the distance formula", "Using slope instead of negative reciprocal"],
    units: [
      u("The coordinate plane", 11),
      u("Distance and midpoint", 13),
      u("Parallel and perpendicular lines", 14),
      u("Practice set · 14 items", 12, "practice"),
    ],
  },

  /* -------------------------------------------------------------- ENGLISH */
  {
    id: "tenses",
    subject: "english",
    domain: "grammar",
    name: "Verb Tenses",
    weight: 12,
    level: "Core",
    gradeBand: "A2–B2",
    summary: "Choosing and forming the tense that matches the intended meaning.",
    skills: ["Simple vs continuous", "Present perfect", "Past perfect", "Future forms"],
    commonErrors: ["Present perfect with a finished time reference", "Stative verbs in continuous form"],
    units: [
      u("The tense system at a glance", 12),
      u("Present perfect vs past simple", 16),
      u("Continuous and perfect aspects", 15),
      u("Practice set · 22 items", 14, "practice"),
    ],
  },
  {
    id: "articles",
    subject: "english",
    domain: "grammar",
    name: "Articles & Determiners",
    weight: 7,
    level: "Foundation",
    gradeBand: "A1–B1",
    summary: "A, an, the and the zero article — including countable and uncountable nouns.",
    skills: ["Definite vs indefinite", "Zero article", "Countable & uncountable", "Quantifiers"],
    commonErrors: ["Missing article with singular countable nouns", "The with general plurals"],
    units: [
      u("When to use the", 10),
      u("A, an and the zero article", 11),
      u("Quantifiers", 12),
      u("Practice set · 20 items", 12, "practice"),
    ],
  },
  {
    id: "prepositions",
    subject: "english",
    domain: "grammar",
    name: "Prepositions",
    weight: 7,
    level: "Core",
    gradeBand: "A2–B2",
    summary: "Prepositions of time, place and dependent prepositions after verbs.",
    skills: ["Time prepositions", "Place prepositions", "Dependent prepositions", "Fixed phrases"],
    commonErrors: ["In / on / at with time", "Wrong preposition after a dependent verb"],
    units: [
      u("In, on, at for time and place", 11),
      u("Dependent prepositions", 14),
      u("Practice set · 20 items", 12, "practice"),
    ],
  },
  {
    id: "sentence_structure",
    subject: "english",
    domain: "grammar",
    name: "Sentence Structure",
    weight: 9,
    level: "Core",
    gradeBand: "B1–C1",
    summary: "Clauses, word order, agreement, cohesion and sentence variety.",
    skills: ["Word order", "Subject–verb agreement", "Clauses & conjunctions", "Cohesion"],
    commonErrors: ["Run-on sentences", "Agreement errors after 'each/every'", "Misplaced modifiers"],
    units: [
      u("Clauses and sentence types", 13),
      u("Agreement and word order", 14),
      u("Linking ideas", 12),
      u("Practice set · 18 items", 13, "practice"),
    ],
  },
  {
    id: "word_formation",
    subject: "english",
    domain: "grammar",
    name: "Word Formation",
    weight: 5,
    level: "Advanced",
    gradeBand: "B1–C1",
    summary: "Deriving nouns, adjectives and adverbs from a base word.",
    skills: ["Prefixes", "Suffixes", "Part-of-speech shifts", "Negative forms"],
    commonErrors: ["Choosing the wrong part of speech", "Double negatives from prefix errors"],
    units: [
      u("Common prefixes and suffixes", 12),
      u("Part-of-speech families", 13),
      u("Practice set · 16 items", 11, "practice"),
    ],
  },
  {
    id: "academic_vocabulary",
    subject: "english",
    domain: "vocabulary",
    name: "Core Vocabulary",
    weight: 8,
    level: "Core",
    gradeBand: "A2–B2",
    summary: "High-frequency academic and general service words.",
    skills: ["Academic word list", "Collocations", "Register", "Synonym precision"],
    commonErrors: ["Choosing a synonym with the wrong register", "Ignoring collocation"],
    units: [
      u("Core vocabulary · set 1", 14),
      u("Core vocabulary · set 2", 14),
      u("Collocations that native speakers use", 13),
      u("Practice set · 24 items", 15, "practice"),
    ],
  },
  {
    id: "context_meaning",
    subject: "english",
    domain: "vocabulary",
    name: "Vocabulary in Context",
    weight: 7,
    level: "Advanced",
    gradeBand: "B1–C1",
    summary: "Inferring meaning of unfamiliar words from surrounding text.",
    skills: ["Context clues", "Connotation", "Figurative language", "Reference"],
    commonErrors: ["Picking the most familiar meaning of a polysemous word"],
    units: [
      u("Reading for context clues", 13),
      u("Connotation and tone", 12),
      u("Practice set · 18 items", 13, "practice"),
    ],
  },
  {
    id: "word_families",
    subject: "english",
    domain: "vocabulary",
    name: "Word Families",
    weight: 5,
    level: "Core",
    gradeBand: "A2–B2",
    summary: "Building breadth from roots you already know.",
    skills: ["Latin & Greek roots", "Word families", "Derivation patterns"],
    commonErrors: ["Assuming a cognate means the same thing in English"],
    units: [
      u("Roots and word families", 13),
      u("Building a personal word map", 12),
      u("Practice set · 16 items", 11, "practice"),
    ],
  },
  {
    id: "main_idea",
    subject: "english",
    domain: "reading",
    name: "Main Idea & Purpose",
    weight: 8,
    level: "Core",
    gradeBand: "A2–C1",
    summary: "Identifying the central claim and the writer's intent.",
    skills: ["Main idea", "Writer's purpose", "Paragraph function", "Tone"],
    commonErrors: ["Choosing a detail that is true but not the main idea"],
    units: [
      u("Finding the main idea", 14),
      u("Purpose and tone", 13),
      u("Guided reading · 2 passages", 20, "practice"),
    ],
  },
  {
    id: "inference",
    subject: "english",
    domain: "reading",
    name: "Inference & Implication",
    weight: 8,
    level: "Advanced",
    gradeBand: "B1–C1",
    summary: "Reading between the lines with textual evidence.",
    skills: ["Implied meaning", "Evidence selection", "Author attitude"],
    commonErrors: ["Inferring beyond what the text supports"],
    units: [
      u("What inference actually requires", 13),
      u("Evidence-based answering", 15),
      u("Guided reading · 2 passages", 20, "practice"),
    ],
  },
  {
    id: "detail_retrieval",
    subject: "english",
    domain: "reading",
    name: "Detail & Scanning",
    weight: 8,
    level: "Foundation",
    gradeBand: "A1–B2",
    summary: "Locating specific information quickly and accurately.",
    skills: ["Scanning", "Synonym matching", "Numerical detail"],
    commonErrors: ["Matching a word instead of a meaning"],
    units: [
      u("Scanning technique", 11),
      u("Synonym matching", 12),
      u("Guided reading · 2 passages", 18, "practice"),
    ],
  },
  {
    id: "listening_gist",
    subject: "english",
    domain: "listening",
    name: "Listening for Gist",
    weight: 7,
    level: "Core",
    gradeBand: "A2–C1",
    summary: "Following the overall meaning of a recording at natural speed.",
    skills: ["Gist listening", "Topic shift", "Speaker attitude"],
    commonErrors: ["Getting stuck on one missed word"],
    units: [
      u("Listening strategy · gist first", 12),
      u("Audio set · 4 recordings", 22, "practice"),
    ],
  },
  {
    id: "listening_detail",
    subject: "english",
    domain: "listening",
    name: "Listening for Detail",
    weight: 9,
    level: "Advanced",
    gradeBand: "B1–C1",
    summary: "Capturing numbers, names and specific factual detail from speech.",
    skills: ["Note completion", "Number & date recognition", "Distractor handling"],
    commonErrors: ["Writing the first number you hear, not the corrected one"],
    units: [
      u("Predicting the answer type", 12),
      u("Handling distractors", 13),
      u("Audio set · 6 recordings", 24, "practice"),
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Derived lookups
 * ------------------------------------------------------------------ */

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((topic) => [topic.id, topic]));

export const MATH_TOPICS = TOPICS.filter((t) => t.subject === "math");
export const ENGLISH_TOPICS = TOPICS.filter((t) => t.subject === "english");

export const MATH_DOMAINS = Object.values(DOMAINS)
  .filter((d) => d.subject === "math")
  .sort((a, b) => a.order - b.order);
export const ENGLISH_DOMAINS = Object.values(DOMAINS)
  .filter((d) => d.subject === "english")
  .sort((a, b) => a.order - b.order);

export const SUBJECT_DOMAINS = { math: MATH_DOMAINS, english: ENGLISH_DOMAINS };
export const SUBJECT_TOPICS = { math: MATH_TOPICS, english: ENGLISH_TOPICS };

export const getTopic = (id) => TOPIC_BY_ID[id];
export const topicsForDomain = (domainId) => TOPICS.filter((t) => t.domain === domainId);
export const domainsForSubject = (subject) => SUBJECT_DOMAINS[subject] ?? [];

export const TOTAL_WEIGHT = {
  math: MATH_TOPICS.reduce((a, t) => a + t.weight, 0),
  english: ENGLISH_TOPICS.reduce((a, t) => a + t.weight, 0),
};

export const UNIT_TYPES = {
  lesson: { label: "Lesson", tone: "brand" },
  practice: { label: "Practice set", tone: "accent" },
  assessment: { label: "Assessment", tone: "developing" },
};
