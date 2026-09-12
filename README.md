# PRISMA — Math & English Diagnostic Center

A premium EdTech product that answers one question properly: **what exactly does this learner not know, and what should they do next?**

One score is not information. Prisma decomposes it into 25 measured skills across Mathematics and English, ranks the gaps by how many points each one costs, and generates a week-by-week learning plan from that ranking.

> **Demo build.** No backend, no database, no payments. All data is local mock data persisted to `localStorage` (`prisma.state.v2`), so the full loop — register (student **or** teacher application) → admin approval → onboarding → adaptive diagnostic → animated results → analysis → plan → practice → assignments → progress → teacher, school & **admin** consoles → CMS edits that change the live site — runs end to end in the browser.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

Node 20.9+ required (Next.js 16).

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 (`@theme` tokens in `app/globals.css`) |
| Animation | GSAP 3.15 + ScrollTrigger, Framer Motion only where it earns its place |
| Charts | Recharts 3 (lazy-loaded) |
| Icons | lucide-react |
| Utilities | clsx |

Fonts are self-hosted woff2 in `assets/fonts/` (Fraunces, Instrument Sans, JetBrains Mono) — no external font requests.

---

## Architecture

```
app/                 routes (grouped: (site), (auth), (account), student, teacher, school)
components/
  ui/                design-system primitives (Button, Card, Field, Tabs, Modal, States…)
  layout/            SiteNavbar, SiteFooter, AppShell, DashboardSidebar/Topbar, MobileTabBar
  motion/            Reveal — the single GSAP scroll-reveal wrapper
  charts/            lazy Recharts wrappers + ChartCard
  brand/             Logo
  domain/            product-specific primitives (SpectrumRow, DiagnosisCallout, StepNumber…)
  home/              homepage sections
  marketing/         shared page templates (PageHero, StoryJourney, DiagnosticPage,
                     SubjectMap, AudiencePage, PricingPlans, FaqBrowser, LegalPage…)
  report/            DiagnosticReport — the reusable full report composition
lib/
  data/              ALL content and mock data (no copy hardcoded in components)
  engine/            scoring.js · diagnose.js · recommend.js  ← the product logic
  store/             AppProvider — client store + localStorage persistence
  hooks/             useGsap (isomorphic layout effect), useMotion (reduced-motion)
  gsap.js            reusable animation utilities + cleanup helpers
  utils.js           cn, formatters, colour/band helpers
assets/fonts/        self-hosted woff2
```

**Rule:** components never contain the scoring logic and never contain marketing copy. Both live in `lib/`.

### The engine

- `lib/engine/scoring.js` — topic score → domain score (weighted mean) → subject score → overall.
- `lib/engine/diagnose.js` — bands (`strong` ≥ 80, `developing` 60–79, `at risk` < 60), **impact ranking** (`weight × (target − score)`), narrative generation, cohort diagnosis.
- `lib/engine/recommend.js` — turns the ranking into a sequenced plan: five rules, each one checkable arithmetic. `PATH_PRESETS` pack units into weeks that fit a weekly study budget.

The engine is pure functions over plain data, so it drops straight onto a backend later.

### Animation rules

- Everything goes through `Reveal` or `lib/gsap.js` utilities — no ad-hoc ScrollTriggers.
- GSAP context + cleanup on unmount; ScrollTriggers killed with their component.
- `prefers-reduced-motion` is respected globally (`lib/hooks/useMotion.js` + CSS).
- Charts are lazy-loaded; page transitions stay under 300 ms.

---

## Routes

### Public (15 + legal)

`/` · `/about` · `/how-it-works` · `/features` · `/math` · `/english` · `/math-diagnostic` · `/english-diagnostic` · `/personalized-learning` · `/progress` · `/students` · `/teachers` · `/schools` · `/sample-report` · `/pricing` · `/contact` · `/privacy` · `/terms` · `/faq` · `/tutors`

### Auth (8) + Onboarding (4)

`/login` · `/register` (two-card chooser: Student / Teacher) · `/register/student` · `/register/teacher` (creates a **pending application**) · `/register/school` · `/forgot-password` · `/verify-email` · `/pending-approval`
`/onboarding` · `/onboarding/profile` · `/onboarding/goals` · `/onboarding/assessment`

### Student (27)

`/student/dashboard` · `/assignments` · `/profile` · `/skills` · `/progress` · `/learning-path` · `/math` · `/english` · `/math/algebra` · `/math/linear-equations` · `/math/quadratic-equations` · `/math/inequalities` · `/english/grammar` · `/english/vocabulary` · `/english/reading` · `/english/listening` · `/practice` · `/diagnostic` · `/diagnostic/start` · `/diagnostic/math` · `/diagnostic/english` · `/diagnostic/review` · `/diagnostic/completed` · `/diagnostic/results` · `/diagnostic/analysis` · `/recommendations` · `/achievements` · `/history` · `/certificates`

### Teacher (5) · School (2) · Account (2)

`/teacher/dashboard` · `/teacher/students` · `/teacher/classes` · `/teacher/assignments` · `/teacher/analytics`
`/school/dashboard` · `/school/analytics`
`/settings` · `/billing`

### Admin (23)

`/admin` (KPI dashboard) · `/admin/login` · `/admin/users` · `/admin/students` · `/admin/teachers` · `/admin/teacher-applications` · `/admin/teacher-applications/[id]` · `/admin/classes` · `/admin/subjects` · `/admin/questions` · `/admin/tests` · `/admin/test-results` · `/admin/learning-content` (+ `/math`, `/english`) · `/admin/analytics` · `/admin/reports` · `/admin/notifications` · `/admin/announcements` · `/admin/faq` · `/admin/pricing` · `/admin/homepage` · `/admin/settings`

**93 real routes total.** Legacy paths (`/diagnostic/math`, `/subjects/*`, old student analysis URLs) 308-redirect to their replacements.

---

## Demo data

The demo learner is **Amina Karimova, Grade 10**, with an internally consistent score set:

- **Mathematics 68%** — Arithmetic 73 · Algebra 62 · Geometry 81
- **English 74%** — Grammar 81 · Vocabulary 54 · Reading 79 · Listening 72
- Strongest: Linear Equations 90, Sentence Structure 88, Tenses 86
- Largest gaps: Quadratic Equations 41 (impact +7.1 pts), Academic Vocabulary 54, Systems of Equations 50

`SAMPLE_TIMELINE` holds six attempts (March → September 2026) so every progress chart is a real comparison rather than a decorative line. Taking a diagnostic in the app recomputes and replaces this data.

### Demo accounts

| Account | Sign-in | Lands on |
| --- | --- | --- |
| **Demo Student** — Amina Karimova | `/login` quick button | `/student/dashboard` |
| **Demo Teacher** — Ms. Amara Adeyemi (approved) | `/login` quick button | `/teacher/dashboard` |
| **Demo Admin** | `/admin/login` (or `/login` → role "Platform administrator") | `/admin` |

Teacher registration deliberately does **not** activate: it files an application (`lib/data/platform.js` seeds two more pending ones) and parks the user on `/pending-approval` until an admin approves or rejects it in `/admin/teacher-applications`.

### Platform layer (admin CMS)

Everything the admin console edits is real local state that the rest of the app reads:

- **Homepage** hero copy + section toggles → `components/home/Hero.jsx`, `CmsSection` on `/`
- **FAQ** CRUD + reordering → `/faq` and the homepage FAQ band
- **Pricing** plans/prices/features → `/pricing`
- **Question bank** CRUD (MCQ, true/false, fill-in-blank, short answer, equation, numeric, reading & listening via stimuli) → diagnostics, practice sets and assignments draw from the same store
- **Tests** create/publish/unpublish → teacher assignment picker
- **Learning content** units per topic → topic study pages
- **Users** search/filter/suspend/activate · **Announcements** → site-wide banner + notification bells
- **Notifications** per role (student / teacher / school / admin) with unread badges everywhere

---

## Design system

Warm-white canvas `#fbfaf7`, deep-navy ink `#10182b`, thin `#e7e4dc` borders, soft shadows. Brand blue `#2b4fe0` (Mathematics), violet `#7a5cd6` (English). Status: strong `#14855c`, developing `#b8791a`, risk `#bf4a3f`.

Bright and premium — explicitly *not* dark, not neon, not childish. The signature visual is `prism-rule`: a thin blue→violet gradient rule, the prism splitting one score into a spectrum of skills.

All tokens live in `app/globals.css` under `@theme`; change them there and the whole product follows.

---

## Notes

- Pricing values are **placeholder** data. No fake partnerships, no invented statistics, no "trusted by 10,000 schools".
- Copy is centralised in `lib/data/` so the product is i18n-ready (English first).
- Empty, loading (skeleton) and error states are implemented in `components/ui/States.jsx`.
- Role protection is a mock layer (`components/auth/RoleGate.jsx` + store): students/teachers can never open `/admin/*`, pending teachers never reach `/teacher/*`. Swapping in real auth means changing `lib/store/AppProvider.jsx` and the gate only.
- Global search (`Cmd/Ctrl+K`) covers pages, topics, students, questions and tests, scoped to the signed-in role.
- Diagnostics are **adaptive** in a deterministic way: a correct answer pushes a harder same-topic item, a wrong answer an easier one (capped), and every added item is badged "Adaptive follow-up".
