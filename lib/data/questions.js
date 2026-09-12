/**
 * Prisma question bank.
 *
 * Each item is tagged with the topic it measures so the scoring engine can
 * attribute every mark to a skill. `weight` mirrors the topic weight so a
 * diagnostic reports the same picture as a full-length test.
 *
 * Shape:
 * { id, subject, topicId, difficulty, type, prompt, options, answer,
 *   explanation, weight, stimulus? }
 *
 * `answer` is the index of the correct option (or a number for type "numeric").
 */

export const DIFFICULTIES = {
  foundation: { id: "foundation", label: "Foundation", order: 1 },
  core: { id: "core", label: "Core", order: 2 },
  advanced: { id: "advanced", label: "Advanced", order: 3 },
};

/* ------------------------------------------------------------------ *
 * Stimuli — reading passages and listening tracks
 * ------------------------------------------------------------------ */

export const READING_PASSAGES = [
  {
    id: "passage_bees",
    title: "The Quiet Return of the Bees",
    genre: "Popular science",
    level: "B2",
    words: 268,
    minutes: 4,
    body: [
      "For a decade, the orchards around the Vistula valley produced reliable harvests while their pollinators quietly disappeared. Growers rented hives from further south each spring, a cost that seemed simply part of modern farming. Then, in the fifth year of the survey, something unexpected happened: the rented hives were no longer necessary.",
      "The change was not dramatic in the way that headlines prefer. No single policy reversed the decline. Instead, a patchwork of small decisions — hedgerows left uncut, pesticide sprayed at dusk rather than at dawn, strips of clover sown between rows — accumulated until the landscape could support wild pollinators again. Entomologists counted 34% more wild bee species in the valley than in the baseline year.",
      "What makes the valley instructive is not that it succeeded, but that it succeeded without anyone agreeing on a plan. Researchers describe it as an example of distributed intervention: many actors making locally sensible choices whose combined effect exceeded what a central programme might have achieved. That is a hopeful conclusion, and also an uncomfortable one, because it suggests that the obstacle was rarely knowledge. It was coordination.",
      "The valley's farmers are now consulted by neighbouring regions. They tend to give the same advice, which is not about bees at all. Leave the edges alone, they say. The middle will look after itself.",
    ],
  },
  {
    id: "passage_libraries",
    title: "What Libraries Became",
    genre: "Essay",
    level: "C1",
    words: 241,
    minutes: 4,
    body: [
      "The prediction that digital media would empty public libraries has been wrong for twenty years running, and the reason is worth examining. Libraries did not survive by defending books. They survived by noticing what people actually came for.",
      "In most cities today, the busiest resource in a library is not a title but a chair: a warm, lit, supervised place to sit that costs nothing. Around that chair grew a set of services nobody's founding charter anticipated — job clinics, language exchange, 3D printers, notary desks, and a great deal of quiet assistance with government websites.",
      "Critics argue this dilutes the institution's purpose. The stronger argument runs the other way. A library that had insisted on being a warehouse for printed matter would now be a warehouse for printed matter that fewer people visit. Instead it became infrastructure, and infrastructure is what survives austerity.",
      "There is a lesson here beyond libraries. Institutions rarely fail because their mission becomes irrelevant; they fail because they confuse the mission with the mechanism that once carried it.",
    ],
  },
];

export const LISTENING_TRACKS = [
  {
    id: "track_station",
    title: "Announcement · Platform change",
    kind: "Public announcement",
    level: "B1",
    durationSeconds: 42,
    speakers: 1,
    transcript:
      "Good afternoon. We're sorry to announce that the 14:35 service to Leeds will now depart from platform nine instead of platform four. Passengers who have already checked in should proceed to platform nine, where staff will be waiting. The departure time is unchanged at fourteen thirty-five, but boarding will close two minutes early, at fourteen thirty-three, because of the shorter platform. We apologise for any inconvenience.",
  },
  {
    id: "track_seminar",
    title: "Seminar · Urban heat islands",
    kind: "Academic discussion",
    level: "C1",
    durationSeconds: 68,
    speakers: 2,
    transcript:
      "Dr Rao: The figure everyone quotes — that cities are three degrees warmer than the surrounding countryside — is an average, and averages are misleading here. In the districts we surveyed, the difference reached seven degrees on still summer nights.\nModerator: And what drives that?\nDr Rao: Two things, mainly. The absence of vegetation, obviously. But more surprisingly, the geometry. Narrow streets between tall buildings trap longwave radiation, so the heat cannot escape at night. That is why we now recommend reflective roofing over planting alone — planting takes a decade, roofing takes a season.",
  },
];

/* ------------------------------------------------------------------ *
 * Mathematics
 * ------------------------------------------------------------------ */

const m = (q) => ({ ...q, subject: "math", type: q.type ?? "mcq" });

export const MATH_QUESTIONS = [
  m({
    id: "m_ns_01",
    topicId: "number_systems",
    difficulty: "foundation",
    prompt: "Evaluate:  −7 − (−12)",
    options: ["−19", "5", "−5", "19"],
    answer: 1,
    explanation: "Subtracting a negative is the same as adding: −7 + 12 = 5.",
    weight: 9,
  }),
  m({
    id: "m_ns_02",
    topicId: "number_systems",
    difficulty: "core",
    prompt: "Evaluate:  3 + 4 × 2²",
    options: ["28", "19", "50", "11"],
    answer: 1,
    explanation: "Powers first (2² = 4), then multiplication (4 × 4 = 16), then addition: 3 + 16 = 19.",
    weight: 9,
  }),
  m({
    id: "m_ns_03",
    topicId: "number_systems",
    difficulty: "core",
    prompt: "Which list is in ascending order?",
    options: ["−3, 0, −7, 4", "−7, −3, 0, 4", "4, 0, −3, −7", "0, −3, 4, −7"],
    answer: 1,
    explanation: "On the number line, −7 lies left of −3, which lies left of 0, which lies left of 4.",
    weight: 9,
  }),
  m({
    id: "m_fr_01",
    topicId: "fractions",
    difficulty: "foundation",
    prompt: "Simplify:  2/3 + 3/4",
    options: ["5/7", "17/12", "11/12", "5/12"],
    answer: 1,
    explanation: "Common denominator 12: 8/12 + 9/12 = 17/12.",
    weight: 8,
  }),
  m({
    id: "m_fr_02",
    topicId: "fractions",
    difficulty: "core",
    prompt: "Simplify:  5/6 ÷ 2/3",
    options: ["5/9", "10/18", "5/4", "4/5"],
    answer: 2,
    explanation: "Dividing by a fraction means multiplying by its reciprocal: 5/6 × 3/2 = 15/12 = 5/4.",
    weight: 8,
  }),
  m({
    id: "m_ra_01",
    topicId: "ratios",
    difficulty: "core",
    prompt:
      "A map has a scale of 1 : 25 000. Two towns are 6 cm apart on the map. What is the real distance?",
    options: ["1.5 km", "2.5 km", "15 km", "150 m"],
    answer: 0,
    explanation: "6 × 25 000 = 150 000 cm = 1 500 m = 1.5 km.",
    weight: 7,
  }),
  m({
    id: "m_ra_02",
    topicId: "ratios",
    difficulty: "advanced",
    prompt: "£420 is shared between Ana, Bo and Cy in the ratio 3 : 2 : 1. How much does Bo receive?",
    options: ["£70", "£140", "£210", "£105"],
    answer: 1,
    explanation: "Total parts = 6, so one part = £70. Bo has 2 parts = £140.",
    weight: 7,
  }),
  m({
    id: "m_pc_01",
    topicId: "percentages",
    difficulty: "core",
    prompt: "A price rises by 20% to $84. What was the original price?",
    options: ["$64", "$67.20", "$70", "$72"],
    answer: 2,
    explanation: "84 = 1.2 × original, so original = 84 ÷ 1.2 = $70.",
    weight: 6,
  }),
  m({
    id: "m_pc_02",
    topicId: "percentages",
    difficulty: "foundation",
    prompt: "What is 15% of 240?",
    options: ["24", "30", "36", "48"],
    answer: 2,
    explanation: "10% = 24 and 5% = 12, so 15% = 36.",
    weight: 6,
  }),
  m({
    id: "m_ex_01",
    topicId: "expressions",
    difficulty: "core",
    prompt: "Expand:  (2x − 3)(x + 4)",
    options: ["2x² + 5x − 12", "2x² + 11x − 12", "2x² − 5x + 12", "2x² + 5x + 12"],
    answer: 0,
    explanation: "2x² + 8x − 3x − 12 = 2x² + 5x − 12.",
    weight: 8,
  }),
  m({
    id: "m_ex_02",
    topicId: "expressions",
    difficulty: "core",
    prompt: "Factorise:  x² − 9x + 20",
    options: ["(x − 4)(x − 5)", "(x + 4)(x + 5)", "(x − 2)(x − 10)", "(x − 4)(x + 5)"],
    answer: 0,
    explanation: "We need two numbers that multiply to 20 and add to −9: −4 and −5.",
    weight: 8,
  }),
  m({
    id: "m_ex_03",
    topicId: "expressions",
    difficulty: "foundation",
    prompt: "Simplify:  5a + 3b − 2a + 4b",
    options: ["3a + 7b", "7a + 7b", "3a − 7b", "10ab"],
    answer: 0,
    explanation: "Collect like terms: (5a − 2a) + (3b + 4b) = 3a + 7b.",
    weight: 8,
  }),
  m({
    id: "m_le_01",
    topicId: "linear_equations",
    difficulty: "core",
    prompt: "Solve for x:  3(x − 2) = 2x + 5",
    options: ["x = 1", "x = 11", "x = −11", "x = 7"],
    answer: 1,
    explanation: "3x − 6 = 2x + 5 → x = 11.",
    weight: 12,
  }),
  m({
    id: "m_le_02",
    topicId: "linear_equations",
    difficulty: "core",
    prompt: "Which equation represents the line through (1, 3) with gradient 2?",
    options: ["y = 2x + 1", "y = 2x − 1", "y = x + 2", "y = 2x + 3"],
    answer: 0,
    explanation: "y − 3 = 2(x − 1) → y = 2x + 1.",
    weight: 12,
  }),
  m({
    id: "m_le_03",
    topicId: "linear_equations",
    difficulty: "foundation",
    prompt: "A taxi charges $3 plus $2 per kilometre. Which expression gives the fare for k kilometres?",
    options: ["2k + 3", "3k + 2", "5k", "2(k + 3)"],
    answer: 0,
    explanation: "Fixed charge 3, plus 2 for each of k kilometres: 2k + 3.",
    weight: 12,
  }),
  m({
    id: "m_sy_01",
    topicId: "systems_of_equations",
    difficulty: "core",
    prompt: "Solve:  2x + y = 7  and  x − y = 2",
    options: ["x = 3, y = 1", "x = 1, y = 5", "x = 2, y = 3", "x = 4, y = −1"],
    answer: 0,
    explanation: "Adding the equations gives 3x = 9, so x = 3, then y = 7 − 6 = 1.",
    weight: 9,
  }),
  m({
    id: "m_sy_02",
    topicId: "systems_of_equations",
    difficulty: "advanced",
    prompt: "How many solutions does the system  2x + 4y = 6  and  x + 2y = 3  have?",
    options: ["None", "Exactly one", "Exactly two", "Infinitely many"],
    answer: 3,
    explanation: "The second equation is the first divided by 2 — the same line, so infinitely many solutions.",
    weight: 9,
  }),
  m({
    id: "m_qu_01",
    topicId: "quadratic_equations",
    difficulty: "core",
    prompt: "Solve:  x² − 5x + 6 = 0",
    options: ["x = 1, x = 6", "x = 2, x = 3", "x = −2, x = −3", "x = 5, x = 6"],
    answer: 1,
    explanation: "(x − 2)(x − 3) = 0, so x = 2 or x = 3.",
    weight: 12,
  }),
  m({
    id: "m_qu_02",
    topicId: "quadratic_equations",
    difficulty: "advanced",
    prompt: "What is the discriminant of  2x² + 3x + 5 = 0, and what does it tell you?",
    options: [
      "−31; no real solutions",
      "31; two real solutions",
      "−31; two equal real solutions",
      "49; one real solution",
    ],
    answer: 0,
    explanation: "b² − 4ac = 9 − 40 = −31. A negative discriminant means no real solutions.",
    weight: 12,
  }),
  m({
    id: "m_qu_03",
    topicId: "quadratic_equations",
    difficulty: "foundation",
    prompt: "Solve:  x² = 49",
    options: ["x = 7 only", "x = ±7", "x = −7 only", "x = 49"],
    answer: 1,
    explanation: "Both 7² and (−7)² equal 49, so there are two solutions.",
    weight: 12,
  }),
  m({
    id: "m_qu_04",
    topicId: "quadratic_equations",
    difficulty: "advanced",
    prompt: "Write  x² + 6x + 2  in the form (x + a)² + b.",
    options: ["(x + 3)² − 7", "(x + 3)² + 11", "(x + 6)² − 34", "(x − 3)² − 7"],
    answer: 0,
    explanation: "x² + 6x + 2 = (x + 3)² − 9 + 2 = (x + 3)² − 7.",
    weight: 12,
  }),
  m({
    id: "m_in_01",
    topicId: "inequalities",
    difficulty: "core",
    prompt: "Solve:  −3x + 6 > 15",
    options: ["x > −3", "x < −3", "x > 3", "x < 3"],
    answer: 1,
    explanation: "−3x > 9, and dividing by a negative flips the sign: x < −3.",
    weight: 8,
  }),
  m({
    id: "m_in_02",
    topicId: "inequalities",
    difficulty: "advanced",
    prompt: "Solve the compound inequality:  −2 ≤ 3x < 12",
    options: ["−2/3 ≤ x < 4", "−2 ≤ x < 4", "−6 ≤ x < 36", "2/3 < x ≤ 4"],
    answer: 0,
    explanation: "Divide every part by 3 (positive, so the signs stay): −2/3 ≤ x < 4.",
    weight: 8,
  }),
  m({
    id: "m_fu_01",
    topicId: "functions",
    difficulty: "core",
    prompt: "If f(x) = 2x² − 3, what is f(−2)?",
    options: ["5", "−11", "1", "11"],
    answer: 0,
    explanation: "(−2)² = 4, so f(−2) = 2(4) − 3 = 5.",
    weight: 6,
  }),
  m({
    id: "m_fu_02",
    topicId: "functions",
    difficulty: "advanced",
    prompt: "What is the domain of  f(x) = 1 / (x − 4)?",
    options: ["All real numbers", "x ≠ 4", "x > 4", "x ≠ 0"],
    answer: 1,
    explanation: "The denominator cannot be zero, so x − 4 ≠ 0 → x ≠ 4.",
    weight: 6,
  }),
  m({
    id: "m_pg_01",
    topicId: "plane_geometry",
    difficulty: "core",
    prompt: "What is each interior angle of a regular hexagon?",
    options: ["108°", "120°", "135°", "90°"],
    answer: 1,
    explanation: "Interior angle = (n − 2) × 180 ÷ n = 4 × 180 ÷ 6 = 120°.",
    weight: 9,
  }),
  m({
    id: "m_pg_02",
    topicId: "plane_geometry",
    difficulty: "foundation",
    prompt: "A circle has radius 5 cm. What is its area, in terms of π?",
    options: ["10π cm²", "25π cm²", "5π cm²", "50π cm²"],
    answer: 1,
    explanation: "Area = πr² = π × 25 = 25π cm².",
    weight: 9,
  }),
  m({
    id: "m_cg_01",
    topicId: "coordinate_geometry",
    difficulty: "core",
    prompt: "Find the distance between (1, 2) and (4, 6).",
    options: ["5", "7", "25", "√7"],
    answer: 0,
    explanation: "√((4−1)² + (6−2)²) = √(9 + 16) = √25 = 5.",
    weight: 6,
  }),
  m({
    id: "m_cg_02",
    topicId: "coordinate_geometry",
    difficulty: "core",
    prompt: "What is the midpoint of (−3, 5) and (1, −1)?",
    options: ["(−1, 2)", "(2, −4)", "(−2, 4)", "(−1, −2)"],
    answer: 0,
    explanation: "((−3+1)/2, (5+(−1))/2) = (−1, 2).",
    weight: 6,
  }),
];

/* ------------------------------------------------------------------ *
 * English
 * ------------------------------------------------------------------ */

const e = (q) => ({ ...q, subject: "english", type: q.type ?? "mcq" });

export const ENGLISH_QUESTIONS = [
  e({
    id: "e_te_01",
    topicId: "tenses",
    difficulty: "core",
    prompt: "Choose the correct form:  “She ___ in Berlin since 2019.”",
    options: ["lives", "has lived", "is living", "lived"],
    answer: 1,
    explanation: "“Since 2019” links the past to now, so the present perfect is required.",
    weight: 12,
  }),
  e({
    id: "e_te_02",
    topicId: "tenses",
    difficulty: "advanced",
    prompt: "Choose the correct form:  “By the time we arrived, the film ___.”",
    options: ["already started", "has already started", "had already started", "was already starting"],
    answer: 2,
    explanation: "An action completed before another past action takes the past perfect.",
    weight: 12,
  }),
  e({
    id: "e_te_03",
    topicId: "tenses",
    difficulty: "core",
    prompt: "Choose the correct form:  “I ___ dinner when the phone rang.”",
    options: ["cooked", "have cooked", "was cooking", "had cooked"],
    answer: 2,
    explanation: "A longer background action interrupted by a shorter one uses the past continuous.",
    weight: 12,
  }),
  e({
    id: "e_te_04",
    topicId: "tenses",
    difficulty: "foundation",
    prompt: "Which sentence is correct?",
    options: [
      "Water boils at 100 °C.",
      "Water is boiling at 100 °C.",
      "Water has boiled at 100 °C.",
      "Water was boiling at 100 °C.",
    ],
    answer: 0,
    explanation: "General truths take the present simple.",
    weight: 12,
  }),
  e({
    id: "e_ar_01",
    topicId: "articles",
    difficulty: "core",
    prompt: "Choose the correct articles:  “___ honesty is valued, but sometimes ___ small lie is kinder.”",
    options: ["The / a", "An / the", "— (no article) / a", "A / an"],
    answer: 2,
    explanation: "Abstract nouns used generally take no article; “a small lie” is one unspecified instance.",
    weight: 7,
  }),
  e({
    id: "e_ar_02",
    topicId: "articles",
    difficulty: "foundation",
    prompt: "Choose the correct article:  “She plays ___ piano beautifully.”",
    options: ["a", "the", "— (no article)", "an"],
    answer: 1,
    explanation: "Musical instruments take the definite article: “plays the piano”.",
    weight: 7,
  }),
  e({
    id: "e_pr_01",
    topicId: "prepositions",
    difficulty: "core",
    prompt: "Choose the correct preposition:  “He is responsible ___ the marketing budget.”",
    options: ["of", "about", "for", "with"],
    answer: 2,
    explanation: "“Responsible for” is a fixed dependent preposition.",
    weight: 7,
  }),
  e({
    id: "e_pr_02",
    topicId: "prepositions",
    difficulty: "core",
    prompt: "Choose the correct preposition:  “The meeting has been postponed ___ Monday.”",
    options: ["at", "until", "in", "on"],
    answer: 1,
    explanation: "“Postponed until” marks the new point in time; “postponed to” is also acceptable.",
    weight: 7,
  }),
  e({
    id: "e_pr_03",
    topicId: "prepositions",
    difficulty: "foundation",
    prompt: "Which sentence uses the time preposition correctly?",
    options: [
      "The report is due in Friday.",
      "The report is due on Friday.",
      "The report is due at Friday.",
      "The report is due by Friday at the week.",
    ],
    answer: 1,
    explanation: "Days take “on”; months and years take “in”; clock times take “at”.",
    weight: 7,
  }),
  e({
    id: "e_ss_01",
    topicId: "sentence_structure",
    difficulty: "core",
    prompt: "Which sentence is grammatically complete and correctly punctuated?",
    options: [
      "The results were surprising, they contradicted the earlier study.",
      "The results were surprising; they contradicted the earlier study.",
      "The results were surprising they contradicted the earlier study.",
      "Because the results were surprising, they contradicted the earlier study.",
    ],
    answer: 1,
    explanation: "Two independent clauses need a semicolon, a full stop, or a coordinating conjunction.",
    weight: 9,
  }),
  e({
    id: "e_ss_02",
    topicId: "sentence_structure",
    difficulty: "advanced",
    prompt: "Choose the correct agreement:  “Each of the reports ___ reviewed.”",
    options: ["have been", "has been", "are being", "were"],
    answer: 1,
    explanation: "“Each” is singular, so the verb must be singular too: “has been”.",
    weight: 9,
  }),
  e({
    id: "e_wf_01",
    topicId: "word_formation",
    difficulty: "core",
    prompt: "Choose the correct form:  “The findings were ___ and changed our approach.”",
    options: ["surprise", "surprising", "surprised", "surprisingly"],
    answer: 1,
    explanation: "An -ing adjective describes the thing that causes the feeling.",
    weight: 5,
  }),
  e({
    id: "e_wf_02",
    topicId: "word_formation",
    difficulty: "advanced",
    prompt: "Which noun is derived from “to maintain”?",
    options: ["Maintenance", "Mentainance", "Maintaining", "Maintainance"],
    answer: 0,
    explanation: "The standard noun form is “maintenance”.",
    weight: 5,
  }),
  e({
    id: "e_av_01",
    topicId: "academic_vocabulary",
    difficulty: "core",
    prompt: "In “the effect was significant”, which word is closest in meaning to “significant”?",
    options: ["Unusual", "Considerable", "Obvious", "Statistical"],
    answer: 1,
    explanation: "Here “significant” means large enough to matter — “considerable”.",
    weight: 8,
  }),
  e({
    id: "e_av_02",
    topicId: "academic_vocabulary",
    difficulty: "foundation",
    prompt: "Choose the correct collocation:  “The committee will ___ a decision next week.”",
    options: ["do", "make", "take", "give"],
    answer: 1,
    explanation: "English uses “make a decision”, not “do” or “take”.",
    weight: 8,
  }),
  e({
    id: "e_av_03",
    topicId: "academic_vocabulary",
    difficulty: "advanced",
    prompt: "Which sentence uses “mitigate” correctly?",
    options: [
      "The new road will mitigate traffic flow.",
      "Planting trees can mitigate the effects of flooding.",
      "She mitigated the report before submitting it.",
      "The two countries mitigated a treaty.",
    ],
    answer: 1,
    explanation: "“Mitigate” means to make something less severe — it takes a harmful effect as its object.",
    weight: 8,
  }),
  e({
    id: "e_cm_01",
    topicId: "context_meaning",
    difficulty: "advanced",
    prompt:
      "“Smartphones have become ubiquitous; you will struggle to find a carriage where nobody is holding one.” What does “ubiquitous” mean here?",
    options: ["Expensive", "Present everywhere", "Recently invented", "Controversial"],
    answer: 1,
    explanation: "The second clause explains the word: they are everywhere.",
    weight: 7,
  }),
  e({
    id: "e_cm_02",
    topicId: "context_meaning",
    difficulty: "core",
    prompt:
      "“Her reply was lukewarm at best.” What does “lukewarm” suggest about the reply?",
    options: ["It was enthusiastic", "It was only mildly positive", "It was rude", "It was delayed"],
    answer: 1,
    explanation: "“Lukewarm” describes weak or half-hearted approval.",
    weight: 7,
  }),
  e({
    id: "e_wfa_01",
    topicId: "word_families",
    difficulty: "core",
    prompt: "The root “bene-” (as in benefit, benevolent) means:",
    options: ["Bad", "Good", "Two", "Life"],
    answer: 1,
    explanation: "Latin “bene” means well or good.",
    weight: 5,
  }),
  e({
    id: "e_mi_01",
    topicId: "main_idea",
    difficulty: "core",
    stimulus: "passage_bees",
    prompt: "What is the main point of the passage about the Vistula valley?",
    options: [
      "Rented hives are too expensive for modern farms.",
      "Many small, uncoordinated changes can restore pollinators.",
      "A central government programme saved the valley's orchards.",
      "Wild bee populations are declining across Europe.",
    ],
    answer: 1,
    explanation: "Paragraph two stresses that a patchwork of small decisions, not one policy, produced the result.",
    weight: 8,
  }),
  e({
    id: "e_mi_02",
    topicId: "main_idea",
    difficulty: "advanced",
    stimulus: "passage_libraries",
    prompt: "Which sentence best states the writer's central claim?",
    options: [
      "Digital media failed to reduce library usage.",
      "Libraries should return to focusing on books.",
      "Institutions fail by defending the mechanism rather than the mission.",
      "Austerity has damaged public services more than expected.",
    ],
    answer: 2,
    explanation: "The final paragraph generalises from libraries to institutions as a whole.",
    weight: 8,
  }),
  e({
    id: "e_in_01",
    topicId: "inference",
    difficulty: "advanced",
    stimulus: "passage_bees",
    prompt: "What does the writer imply by calling the conclusion “uncomfortable”?",
    options: [
      "The research methods were unreliable.",
      "Farmers dislike being consulted.",
      "The barrier was coordination, not knowledge — which is harder to fix.",
      "Central programmes are always more effective.",
    ],
    answer: 2,
    explanation: "The sentence immediately after identifies coordination, not knowledge, as the obstacle.",
    weight: 8,
  }),
  e({
    id: "e_in_02",
    topicId: "inference",
    difficulty: "core",
    stimulus: "passage_libraries",
    prompt: "What can be inferred about the critics mentioned in paragraph three?",
    options: [
      "They believe libraries should offer more digital services.",
      "They think the new services stray from the library's original purpose.",
      "They want libraries to be closed.",
      "They disagree that libraries are busy.",
    ],
    answer: 1,
    explanation: "The critics “argue this dilutes the institution's purpose”.",
    weight: 8,
  }),
  e({
    id: "e_dr_01",
    topicId: "detail_retrieval",
    difficulty: "foundation",
    stimulus: "passage_bees",
    prompt: "According to the passage, by how much did wild bee species increase?",
    options: ["14%", "24%", "34%", "43%"],
    answer: 2,
    explanation: "The entomologists counted 34% more wild bee species than in the baseline year.",
    weight: 8,
  }),
  e({
    id: "e_dr_02",
    topicId: "detail_retrieval",
    difficulty: "core",
    stimulus: "passage_libraries",
    prompt: "Which of these is NOT listed as a service modern libraries provide?",
    options: ["Job clinics", "3D printers", "Medical prescriptions", "Notary desks"],
    answer: 2,
    explanation: "Medical prescriptions are never mentioned; the others all appear in paragraph two.",
    weight: 8,
  }),
  e({
    id: "e_lg_01",
    topicId: "listening_gist",
    difficulty: "core",
    stimulus: "track_station",
    prompt: "What is the main purpose of the announcement?",
    options: [
      "To cancel the 14:35 service.",
      "To tell passengers their train departs from a different platform.",
      "To apologise for a delay.",
      "To ask passengers to check in again.",
    ],
    answer: 1,
    explanation: "The departure time is unchanged — only the platform has moved from four to nine.",
    weight: 7,
  }),
  e({
    id: "e_ld_01",
    topicId: "listening_detail",
    difficulty: "core",
    stimulus: "track_station",
    prompt: "At what time does boarding close?",
    options: ["14:30", "14:33", "14:35", "14:40"],
    answer: 1,
    explanation: "Departure is 14:35, but boarding closes two minutes early, at 14:33.",
    weight: 9,
  }),
  e({
    id: "e_ld_02",
    topicId: "listening_detail",
    difficulty: "advanced",
    stimulus: "track_seminar",
    prompt: "Why does Dr Rao recommend reflective roofing over planting alone?",
    options: [
      "It is cheaper per square metre.",
      "Planting takes a decade; roofing takes a season.",
      "Residents prefer the look of reflective roofs.",
      "Trees do not reduce temperature at night.",
    ],
    answer: 1,
    explanation: "Dr Rao contrasts the timescales explicitly: “planting takes a decade, roofing takes a season”.",
    weight: 9,
  }),
  e({
    id: "e_lg_02",
    topicId: "listening_gist",
    difficulty: "advanced",
    stimulus: "track_seminar",
    prompt: "What is the speaker's overall argument?",
    options: [
      "The three-degree figure is accurate for all cities.",
      "Urban heat varies more than averages suggest, and geometry is a key cause.",
      "Cities should plant more trees instead of changing roofs.",
      "Heat islands only occur on still nights.",
    ],
    answer: 1,
    explanation: "Dr Rao challenges the average and highlights street geometry trapping longwave radiation.",
    weight: 7,
  }),
];

/* ------------------------------------------------------------------ *
 * Accessors
 * ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ *
 * Extended question types — boolean, fill-in-the-blank, short answer
 * and equation items exercise the full runner + scoring pipeline.
 * ------------------------------------------------------------------ */

export const EXTENDED_QUESTIONS = [
  /* ---------------------------------------------------- MATHEMATICS */
  {
    id: "x_le_eq_01", subject: "math", topicId: "linear_equations", difficulty: "foundation", type: "equation",
    prompt: "Solve for x:   3x − 7 = 14",
    answer: "x=7", acceptable: ["7", "x = 7"],
    explanation: "Add 7 to both sides: 3x = 21. Divide by 3: x = 7.",
    skill: "Two-step equations", estTime: 1, weight: 8,
  },
  {
    id: "x_qe_eq_01", subject: "math", topicId: "quadratic_equations", difficulty: "core", type: "equation",
    prompt: "Solve  x² − 5x + 6 = 0.  Enter both roots, smaller first, separated by a comma.",
    answer: "2,3", acceptable: ["x=2,x=3", "2, 3", "x=2, x=3"],
    explanation: "Factor: (x − 2)(x − 3) = 0, so x = 2 or x = 3.",
    skill: "Factoring quadratics", estTime: 2, weight: 9,
  },
  {
    id: "x_ex_eq_01", subject: "math", topicId: "expressions", difficulty: "core", type: "equation",
    prompt: "Expand and simplify:   3(2x − 4) + 2x",
    answer: "8x-12", acceptable: ["8x−12", "8x - 12"],
    explanation: "Distribute: 6x − 12 + 2x, then combine like terms: 8x − 12.",
    skill: "Expanding brackets", estTime: 1, weight: 7,
  },
  {
    id: "x_pc_fl_01", subject: "math", topicId: "percentages", difficulty: "foundation", type: "fill",
    prompt: "A jacket costs 80,000 so'm. During a sale its price drops by 15%. The sale price is ____ so'm.",
    answer: "68000", acceptable: ["68 000", "68,000", "68000 so'm"],
    explanation: "15% of 80,000 is 12,000. 80,000 − 12,000 = 68,000 so'm.",
    skill: "Percentage decrease", estTime: 1, weight: 7,
  },
  {
    id: "x_rt_sh_01", subject: "math", topicId: "ratios", difficulty: "core", type: "short",
    prompt: "Three friends split 84,000 so'm in the ratio 2 : 3 : 7. How many so'm does the largest share receive? Write only the number.",
    answer: "42000", acceptable: ["42 000", "42,000"],
    explanation: "The ratio has 2 + 3 + 7 = 12 parts; one part is 7,000. The largest share is 7 × 7,000 = 42,000.",
    skill: "Ratio sharing", estTime: 2, weight: 7,
  },
  {
    id: "x_se_sh_01", subject: "math", topicId: "systems_of_equations", difficulty: "advanced", type: "short",
    prompt: "The sum of two numbers is 31 and their difference is 9. What is the larger number? Write only the number.",
    answer: "20", acceptable: ["twenty"],
    explanation: "Adding the two equations: 2x = 40, so x = 20 and y = 11.",
    skill: "Elimination method", estTime: 2, weight: 8,
  },
  {
    id: "x_fn_bl_01", subject: "math", topicId: "functions", difficulty: "foundation", type: "boolean",
    prompt: "True or false: the graph of  y = 2x + 3  crosses the y-axis at the point (0, 3).",
    answer: true,
    explanation: "The constant term of a linear function is its y-intercept: when x = 0, y = 3.",
    skill: "Intercepts of linear functions", estTime: 1, weight: 6,
  },
  {
    id: "x_in_bl_01", subject: "math", topicId: "inequalities", difficulty: "foundation", type: "boolean",
    prompt: "True or false:  x = −2  is a solution of the inequality  3x + 1 > 0.",
    answer: false,
    explanation: "Substituting gives 3(−2) + 1 = −5, and −5 is not greater than 0.",
    skill: "Testing inequality solutions", estTime: 1, weight: 6,
  },
  {
    id: "x_pg_fl_01", subject: "math", topicId: "plane_geometry", difficulty: "foundation", type: "fill",
    prompt: "The three interior angles of any triangle add up to ____ degrees.",
    answer: "180", acceptable: ["180°", "one hundred eighty"],
    explanation: "The angle-sum property of a triangle: interior angles always total 180°.",
    skill: "Angle sums", estTime: 1, weight: 5,
  },
  {
    id: "x_ns_sh_01", subject: "math", topicId: "number_systems", difficulty: "foundation", type: "short",
    prompt: "What is the value of the digit 5 in the number 3,540,108? Write it as a number.",
    answer: "500000", acceptable: ["500 000", "500,000", "5 hundred thousands"],
    explanation: "The 5 sits in the hundred-thousands place, so its value is 5 × 100,000 = 500,000.",
    skill: "Place value", estTime: 1, weight: 5,
  },

  /* -------------------------------------------------------- ENGLISH */
  {
    id: "x_te_bl_01", subject: "english", topicId: "tenses", difficulty: "foundation", type: "boolean",
    prompt: "True or false: the sentence “She has went to Samarkand twice” is grammatically correct.",
    answer: false,
    explanation: "The present perfect needs the past participle: “She has gone/been to Samarkand twice.” “Went” is the past simple.",
    skill: "Present perfect form", estTime: 1, weight: 6,
  },
  {
    id: "x_ar_fl_01", subject: "english", topicId: "articles", difficulty: "foundation", type: "fill",
    prompt: "Fill in the article (a / an / the):  “____ honest answer is worth more than a polite lie.”",
    answer: "an", acceptable: ["An"],
    explanation: "“Honest” begins with a vowel sound — the h is silent — so the article is “an”.",
    skill: "A vs an before silent h", estTime: 1, weight: 5,
  },
  {
    id: "x_pr_fl_01", subject: "english", topicId: "prepositions", difficulty: "core", type: "fill",
    prompt: "Fill in the preposition:  “The meeting was postponed ____ Friday.”",
    answer: "to", acceptable: ["until"],
    explanation: "Postpone takes “to” (or “until”) for the new time: postponed to Friday.",
    skill: "Verbs + prepositions", estTime: 1, weight: 5,
  },
  {
    id: "x_te_fl_02", subject: "english", topicId: "tenses", difficulty: "core", type: "fill",
    prompt: "Put the verb in the correct form:  “By the time we arrived, the film ____ (already / start).”",
    answer: "had already started", acceptable: ["had started already", "had already begun"],
    explanation: "An action completed before another past action takes the past perfect: had already started.",
    skill: "Past perfect", estTime: 2, weight: 7,
  },
  {
    id: "x_wf_bl_01", subject: "english", topicId: "word_formation", difficulty: "foundation", type: "boolean",
    prompt: "True or false: the noun form of the verb “decide” is “decision”.",
    answer: true,
    explanation: "decide → decision (noun), decisive (adjective), decisively (adverb).",
    skill: "Verb → noun suffixes", estTime: 1, weight: 5,
  },
  {
    id: "x_wf_fl_01", subject: "english", topicId: "word_formation", difficulty: "core", type: "fill",
    prompt: "Complete the sentence with the correct form of CARE:  “He drove ____ along the narrow mountain road.”",
    answer: "carefully",
    explanation: "The blank modifies the verb “drove”, so the adverb form is needed: carefully.",
    skill: "Adjective → adverb", estTime: 1, weight: 6,
  },
  {
    id: "x_av_mc_01", subject: "english", topicId: "academic_vocabulary", difficulty: "advanced", type: "mcq",
    prompt: "In academic writing, “the data corroborate the hypothesis” means the data…",
    options: ["contradict the hypothesis", "provide support for the hypothesis", "are unrelated to the hypothesis", "repeat the hypothesis word for word"],
    answer: 1,
    explanation: "“Corroborate” means to confirm or give support to — a staple of academic register.",
    skill: "Academic verbs", estTime: 1, weight: 7,
  },
  {
    id: "x_vo_mc_01", subject: "english", topicId: "vocabulary", difficulty: "core", type: "mcq",
    prompt: "Choose the word closest in meaning to “reluctant”.",
    options: ["eager", "unwilling", "careless", "confident"],
    answer: 1,
    explanation: "Reluctant means hesitant or unwilling to do something.",
    skill: "Synonyms", estTime: 1, weight: 6,
  },
  {
    id: "x_gr_mc_01", subject: "english", topicId: "grammar", difficulty: "core", type: "mcq",
    prompt: "Choose the correct modal: “You ____ submit the essay by Friday — it is mandatory.”",
    options: ["might", "must", "could", "would"],
    answer: 1,
    explanation: "Obligation from a rule takes “must”. “Might” and “could” express possibility, not requirement.",
    skill: "Modals of obligation", estTime: 1, weight: 6,
  },
  {
    id: "x_ss_mc_01", subject: "english", topicId: "sentence_structure", difficulty: "core", type: "mcq",
    prompt: "Rewrite in the passive voice: “The chef prepared the meal.”",
    options: ["The meal was prepared by the chef.", "The meal prepared the chef.", "The chef was prepared by the meal.", "The meal is prepared the chef."],
    answer: 0,
    explanation: "Passive = object + be + past participle (+ by-agent): “The meal was prepared by the chef.”",
    skill: "Passive transformations", estTime: 1, weight: 6,
  },
  {
    id: "x_mi_mc_01", subject: "english", topicId: "main_idea", difficulty: "core", type: "mcq",
    stimulus: "passage_libraries",
    prompt: "What is the central claim of the passage about libraries?",
    options: [
      "Digital media will eventually empty public libraries",
      "Libraries survived by becoming infrastructure for what people actually need",
      "Libraries should return to being warehouses for printed matter",
      "Austerity is the main threat to library funding",
    ],
    answer: 1,
    explanation: "The author argues libraries survived by noticing what people came for — chairs, assistance, services — and becoming infrastructure.",
    skill: "Identifying main ideas", estTime: 2, weight: 7,
  },
  {
    id: "x_if_mc_01", subject: "english", topicId: "inference", difficulty: "advanced", type: "mcq",
    stimulus: "passage_bees",
    prompt: "The farmers' advice — “Leave the edges alone” — most strongly implies that…",
    options: [
      "Field edges are too expensive to farm",
      "Small margin-habitat choices across many farms can restore pollinators without a central plan",
      "Wild bees only live at the edges of orchards",
      "Farmers should stop renting hives from the south",
    ],
    answer: 1,
    explanation: "The passage credits distributed, marginal interventions (hedgerows, clover strips) — the “edges” — for the recovery.",
    skill: "Drawing inferences", estTime: 2, weight: 8,
  },
  {
    id: "x_cm_mc_01", subject: "english", topicId: "context_meaning", difficulty: "core", type: "mcq",
    stimulus: "passage_bees",
    prompt: "In paragraph 2, “a patchwork of small decisions” suggests the decisions were…",
    options: ["contradictory and confusing", "numerous, varied and locally made", "sewn together by one authority", "decorative rather than practical"],
    answer: 1,
    explanation: "“Patchwork” conveys many separate pieces forming a whole — varied local choices accumulating into change.",
    skill: "Vocabulary in context", estTime: 1, weight: 6,
  },
  {
    id: "x_lg_mc_01", subject: "english", topicId: "listening_gist", difficulty: "core", type: "mcq",
    stimulus: "track_station",
    prompt: "What is the main purpose of the announcement?",
    options: [
      "To cancel the 14:35 service to Leeds",
      "To tell passengers the departure platform has changed",
      "To warn that the train will depart earlier than scheduled",
      "To apologise for staff shortages on platform nine",
    ],
    answer: 1,
    explanation: "The service moves from platform four to platform nine; the departure time is unchanged.",
    skill: "Listening for gist", estTime: 2, weight: 6,
  },
  {
    id: "x_ld_fl_01", subject: "english", topicId: "listening_detail", difficulty: "core", type: "fill",
    stimulus: "track_station",
    prompt: "According to the announcement, at what time does boarding close? Write the time (e.g. 14:00).",
    answer: "14:33", acceptable: ["fourteen thirty-three", "2:33 pm", "1433"],
    explanation: "Boarding closes two minutes before the 14:35 departure — at 14:33 — because the platform is shorter.",
    skill: "Listening for detail", estTime: 2, weight: 6,
  },
  {
    id: "x_ld_sh_01", subject: "english", topicId: "listening_detail", difficulty: "advanced", type: "short",
    stimulus: "track_seminar",
    prompt: "Why does Dr Rao recommend reflective roofing ahead of planting trees? Answer in a short phrase.",
    answer: "planting takes a decade, roofing takes a season",
    acceptable: ["roofing takes a season, planting takes a decade", "roofing is much faster than planting", "because planting takes ten years but roofing one season"],
    explanation: "Speed: vegetation needs about ten years to cool a district, while reflective roofing works within one season.",
    skill: "Listening for reasoning", estTime: 2, weight: 7,
  },
];

export const ALL_QUESTIONS = [...MATH_QUESTIONS, ...ENGLISH_QUESTIONS, ...EXTENDED_QUESTIONS];


export const QUESTION_BY_ID = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));

export const questionsForSubject = (subject) =>
  subject === "math" ? MATH_QUESTIONS : subject === "english" ? ENGLISH_QUESTIONS : ALL_QUESTIONS;

export const questionsForTopic = (topicId) => ALL_QUESTIONS.filter((q) => q.topicId === topicId);

export const questionsForStimulus = (stimulusId) => ALL_QUESTIONS.filter((q) => q.stimulus === stimulusId);

export const getStimulus = (id) =>
  READING_PASSAGES.find((p) => p.id === id) ?? LISTENING_TRACKS.find((t) => t.id === id) ?? null;

/** Deterministic pick so the demo test is identical on every reload. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(items, count, rand) {
  const pool = [...items];
  const out = [];
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]);
  }
  return out;
}

/**
 * Assemble a diagnostic set covering every topic as evenly as the bank allows.
 * @returns {{id:string, questions:Array, mathCount:number, englishCount:number}}
 */
export function buildDiagnosticSet({ mathCount = 15, englishCount = 15, seed = 20260912 } = {}) {
  const rand = mulberry32(seed);

  const build = (pool, count) => {
    const byTopic = new Map();
    for (const q of pool) {
      const list = byTopic.get(q.topicId) ?? [];
      list.push(q);
      byTopic.set(q.topicId, list);
    }
    const chosen = [];
    // Round-robin across topics for balanced coverage, then top up randomly.
    while (chosen.length < count) {
      let added = false;
      for (const list of byTopic.values()) {
        if (!list.length || chosen.length >= count) continue;
        const idx = Math.floor(rand() * list.length);
        chosen.push(list.splice(idx, 1)[0]);
        added = true;
      }
      if (!added) break;
    }
    return chosen;
  };

  const math = build(MATH_QUESTIONS, mathCount);
  const english = build(ENGLISH_QUESTIONS, englishCount);

  return {
    id: `diag_${seed}`,
    questions: [...math, ...english],
    mathCount: math.length,
    englishCount: english.length,
    totalCount: math.length + english.length,
    estimatedMinutes: 26,
  };
}

/** Short subject-only sets used by /student/practice and topic pages. */
export function buildSubjectSet(subject, count = 10, seed = 7, pool = null) {
  const rand = mulberry32(seed);
  const source = pool ?? ALL_QUESTIONS;
  const filtered =
    subject === "math" ? source.filter((q) => q.subject === "math")
    : subject === "english" ? source.filter((q) => q.subject === "english")
    : source;
  return pick(filtered, count, rand);
}

export function buildTopicSet(topicId, count = 6, seed = 11, pool = null) {
  const rand = mulberry32(seed);
  return pick((pool ?? ALL_QUESTIONS).filter((q) => q.topicId === topicId), count, rand);
}
