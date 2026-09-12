/** Plain-language legal copy. Structured so it can be localised later. */

export const PRIVACY_SECTIONS = [
  {
    id: "summary",
    title: "The short version",
    body: [
      "Prisma collects the minimum needed to diagnose a learner: an account identity, their answers to assessment items, and the results those answers produce. We do not sell that data, we do not use it for advertising, and we do not train third-party models on it.",
      "If a learner is attached to a school, the school controls who inside the organisation may view the detail. The learner (or their guardian, where the learner is a minor) can always export or delete their own record.",
    ],
  },
  {
    id: "collected",
    title: "What we collect",
    items: [
      { label: "Account data", body: "Name, email address, role, grade or year group, and — where a school provides it — an organisation identifier." },
      { label: "Assessment data", body: "Every answer given, the time taken, the item it was given to, and the resulting topic, domain and subject scores." },
      { label: "Learning data", body: "Generated learning paths, unit completion, practice attempts, streaks, XP and issued certificates." },
      { label: "Technical data", body: "Coarse device and browser information used for error diagnosis and to make the interface responsive. No advertising identifiers." },
    ],
  },
  {
    id: "why",
    title: "Why we collect it",
    items: [
      { label: "To produce a diagnosis", body: "Topic scores are the product. Without answer-level data there is no decomposition and therefore nothing to report." },
      { label: "To generate a plan", body: "The recommendation engine reads topic scores and weights; it stores the plan it produced so progress can be compared later." },
      { label: "To let educators teach", body: "Where a learner belongs to a class, their teacher needs the same view in order to plan a lesson." },
      { label: "To keep the service working", body: "Error logs and performance measurements, retained for a short period and never linked to marketing profiles." },
    ],
  },
  {
    id: "minors",
    title: "Learners under 16",
    body: [
      "Accounts for learners under 16 are created by a school or a guardian rather than by the learner. In that case the school or guardian is the data controller and Prisma acts as a processor: we only handle the data needed to run the assessment and we do not contact the learner directly.",
      "Guardians on the Pro plan may hold read-only seats. A guardian seat can view reports and progress but cannot take a diagnostic or change account settings on the learner's behalf.",
    ],
  },
  {
    id: "sharing",
    title: "Who can see it",
    items: [
      { label: "The learner", body: "Everything, always, including the raw answers behind every score." },
      { label: "Their teacher", body: "Topic scores, bands, gaps, progress and the generated plan — only if the learner belongs to that teacher's class and the school has enabled it." },
      { label: "School administrators", body: "Aggregated analytics and, where enabled, individual records for learners in their organisation." },
      { label: "Prisma staff", body: "Only where needed to support the service, under access logging and a written confidentiality obligation." },
    ],
  },
  {
    id: "retention",
    title: "Retention and deletion",
    body: [
      "Assessment history is retained for the life of the account, because the comparison between attempts is the point of the product. Deleting an account removes the profile, all results, all plans and all certificates permanently.",
      "Where a learner leaves a school, the organisation can release the record so the learner can keep it, or delete it. Either way the learner may export their full history first — results, plans and reports as PDF and CSV.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    items: [
      { label: "Access", body: "Request a complete copy of everything held about you." },
      { label: "Correction", body: "Ask us to fix inaccurate profile data at any time." },
      { label: "Erasure", body: "Delete your account and all associated assessment data." },
      { label: "Portability", body: "Export results and reports in machine-readable form." },
      { label: "Objection", body: "Opt out of research participation and non-essential email from Settings." },
    ],
  },
  {
    id: "security",
    title: "How we protect it",
    body: [
      "Data is encrypted in transit and at rest. Access is role-based and logged. Assessment items and scoring weights are stored server-side in a live deployment so that answer keys cannot be read from a client bundle.",
      "We run a limited set of sub-processors: infrastructure hosting, transactional email, and error reporting. Each is bound by a data-processing agreement and none receives answer-level assessment data.",
    ],
  },
  {
    id: "contact",
    title: "Contact and complaints",
    body: [
      "Privacy questions, access requests and deletion requests go to support@prisma.education and are answered within one working day. If you are unsatisfied with our response, you may complain to your local data-protection authority; for learners in the European Union and United Kingdom we will supply the relevant supervisory authority's details on request.",
    ],
  },
];

export const TERMS_SECTIONS = [
  {
    id: "acceptance",
    title: "Agreement",
    body: [
      "These terms govern access to the Prisma Math & English Diagnostic Center. Creating an account, starting a diagnostic or using a workspace means you accept them. If you are using Prisma on behalf of a school or centre, you confirm you are authorised to accept on that organisation's behalf.",
    ],
  },
  {
    id: "service",
    title: "What the service is",
    items: [
      { label: "A diagnostic tool", body: "Prisma measures skills and reports them. It does not award accredited qualifications and is not a substitute for a regulated examination." },
      { label: "An interpretation layer", body: "Scores, bands, impact rankings and generated plans are modelled outputs derived from your answers. They are designed to be explainable, and the arithmetic behind each is shown in the product." },
      { label: "Not a guarantee", body: "A plan projects a score based on the assumption that its units are completed. Actual results depend on the learner, the time available and the difficulty of the material." },
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    body: [
      "You are responsible for keeping your credentials secure and for activity under your account. One learner per account: sharing an account makes the diagnostic meaningless, because the topic scores would describe nobody.",
      "School and centre accounts are administered by the organisation. The organisation is responsible for the accuracy of the roster it supplies and for obtaining any consent required for its learners.",
    ],
  },
  {
    id: "assessment-integrity",
    title: "Assessment integrity",
    items: [
      { label: "Answer honestly", body: "A diagnostic completed with outside help produces a report about the helper, not the learner. It also makes the generated plan wrong." },
      { label: "No redistribution", body: "Assessment items, scoring weights and answer keys may not be copied, published or redistributed. This protects the validity of every future attempt." },
      { label: "Timed conditions", body: "Where a teacher assigns a timed assessment, the timer is part of the measurement. Attempts to bypass it invalidate the result." },
    ],
  },
  {
    id: "subscriptions",
    title: "Subscriptions and payment",
    body: [
      "Paid plans renew on the cycle you choose until cancelled. Upgrades take effect immediately and are prorated; downgrades and cancellations take effect at the end of the current period. School plans are invoiced against the enrolment reported at the start of each term.",
      "Prices shown in this demo build are placeholders and no payment is taken. In a live deployment, taxes are added where applicable and invoices are available from the Billing screen for the full history of the account.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    items: [
      { label: "Do not probe the scoring model", body: "Systematic submission of answers to reverse-engineer weights or answer keys is prohibited." },
      { label: "Do not impersonate", body: "Taking a diagnostic on another person's account is prohibited and invalidates both records." },
      { label: "Do not scrape", body: "Automated collection of assessment content or other users' data is prohibited." },
      { label: "Do not upload harmful content", body: "Where the product accepts free text, it must be relevant and lawful." },
    ],
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: [
      "Prisma, its assessment items, its scoring model and its interface are owned by Prisma Learning Technologies. You retain ownership of everything you produce with it — your results, your plans, your reports — and you may use and share those freely.",
      "Educators who author custom assessments keep authorship credit inside the organisation and may reuse their items across their own classes.",
    ],
  },
  {
    id: "liability",
    title: "Liability",
    body: [
      "The service is provided on a reasonable-efforts basis. Our total liability for any claim arising from use of the service is limited to the fees paid in the twelve months preceding the claim. We are not liable for indirect loss, and nothing here limits liability for fraud, death or personal injury caused by negligence.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      "We may update these terms as the product develops. Material changes are announced in the product and by email at least fourteen days before they take effect. Continued use after that date means the updated terms apply.",
    ],
  },
  {
    id: "law",
    title: "Governing law",
    body: [
      "These terms are governed by the laws of England and Wales, and the courts of England and Wales have exclusive jurisdiction — without prejudice to any mandatory consumer protections available in your country of residence.",
    ],
  },
];

export const LEGAL_META = {
  updated: "1 September 2026",
  version: "2.4",
  contact: "support@prisma.education",
  entity: "Prisma Learning Technologies",
};
