// All copy and structured content for the site lives here.
// Formwork is a fictional design & engineering studio; every name, project and quote is original.

export const brand = {
  name: 'Formwork',
  legal: 'Formwork B.V.',
  tagline: 'Design & Engineering studio',
  email: 'hello@formwork.studio',
  founded: 2019,
  cities: [
    { name: 'Amsterdam', tz: 'Europe/Amsterdam', short: 'AMS' },
    { name: 'Tashkent', tz: 'Asia/Tashkent', short: 'TAS' },
  ],
  availability: 'Booking Q1 2027',
}

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Approach', href: '#approach' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' },
]

export const socials = [
  { label: 'Instagram', href: 'https://instagram.com', handle: '@formwork.studio' },
  { label: 'LinkedIn', href: 'https://linkedin.com', handle: 'formwork-studio' },
  { label: 'Are.na', href: 'https://are.na', handle: 'formwork' },
  { label: 'GitHub', href: 'https://github.com', handle: 'formwork-studio' },
]

export const hero = {
  eyebrow: 'Formwork — Design & Engineering studio',
  lines: ['Nothing', 'here is an', 'accident.'],
  support:
    'We design and engineer digital products where every detail — the type, the tempo, the transitions — is decided on purpose.',
  cta: { label: 'Selected work', href: '#work' },
  meta: ['Amsterdam · Tashkent', 'Est. 2019', 'Booking Q1 2027'],
  token: {
    title: 'ease-out-expo',
    value: 'cubic-bezier(0.16, 1, 0.3, 1)',
    note: 'Used for every reveal on this page.',
  },
  image: { src: '/images/hero-object.webp', alt: 'A folded chrome sculpture on a plaster pedestal', w: 840, h: 1043 },
}

export const intro = {
  index: '01',
  label: 'Approach',
  statement:
    'Most products are assembled. Ours are composed. We work at the exact point where design becomes engineering — where a choice of typeface is also a choice about a frame budget — and we stay there until the whole thing feels inevitable.',
  note: { index: 'Note 014', text: 'A transition is a sentence. It should say one thing, then stop.' },
  budget: { label: 'Frame budget', total: '16.6 ms', used: '4.2 ms', pct: 25 },
  link: { label: 'How we work', href: '#capabilities' },
  image: { src: '/images/intro-stair.webp', alt: 'Curved concrete stairwell in warm afternoon light', w: 1200, h: 805 },
}

export const projects = [
  {
    id: 'perch',
    title: 'Perch',
    category: 'Property platform',
    scope: 'Product · iOS · Web',
    year: '2026',
    image: { src: '/images/work-perch.webp', alt: 'Aerial view of small clay rooftops in low sunlight', w: 1000, h: 747 },
  },
  {
    id: 'norr',
    title: 'Norr',
    category: 'Banking for the self-employed',
    scope: 'Brand · Product · Design system',
    year: '2025',
    image: { src: '/images/work-norr.webp', alt: 'Matte cobalt card on a black stone surface', w: 1000, h: 747 },
  },
  {
    id: 'cinder',
    title: 'Cinder',
    category: 'Grid operations dashboard',
    scope: 'Data visualisation · Engineering',
    year: '2025',
    image: { src: '/images/work-cinder.webp', alt: 'Amber light lines flowing across a dark surface', w: 1000, h: 747 },
  },
  {
    id: 'marrow',
    title: 'Marrow',
    category: 'Editorial publishing',
    scope: 'Product · Type system · CMS',
    year: '2024',
    image: { src: '/images/work-marrow.webp', alt: 'A stack of paper with a single black stripe', w: 1000, h: 747 },
  },
  {
    id: 'kestrel',
    title: 'Kestrel',
    category: 'Rail booking, twelve countries',
    scope: 'Product · Native apps',
    year: '2024',
    image: { src: '/images/work-kestrel.webp', alt: 'Landscape blurred through a train window at dusk', w: 1000, h: 747 },
  },
]

export const principles = {
  index: '02',
  label: 'Principles',
  items: [
    { text: 'Clarity over cleverness.', style: 'sans' },
    { text: 'Motion needs a reason.', style: 'serif' },
    { text: 'Built, not mocked.', style: 'sans' },
    { text: 'Details are the design.', style: 'serif' },
  ],
  chips: ['/images/work-marrow.webp', '/images/work-cinder.webp', '/images/work-kestrel.webp'],
}

export const visual = {
  index: '03',
  label: 'Craft',
  headline: 'The work is the proof.',
  body: 'Designed and engineered under one roof. The people who draw the interface are the people who ship it — so nothing gets lost in the hand-off, because there is no hand-off.',
  image: { src: '/images/immersive-ribbon.webp', alt: 'A twisted chrome ribbon lit by a single cobalt light', w: 1376, h: 768 },
}

export const capabilities = {
  index: '04',
  label: 'Capabilities',
  heading: 'Five ways in. One way of working.',
  items: [
    {
      n: '01',
      title: 'Strategy & research',
      body: 'We start with the question behind the brief, and we keep asking until the answer is something we can draw.',
      tags: ['Research', 'Positioning', 'Roadmaps', 'Prototyping'],
      tone: 'white',
      visual: 'rings',
    },
    {
      n: '02',
      title: 'Product design',
      body: 'Interfaces that explain themselves. Hierarchy, rhythm and restraint, tested on real people before anyone falls in love with a mock-up.',
      tags: ['UX', 'UI', 'Interaction', 'Prototypes'],
      tone: 'bone',
      visual: 'grid',
    },
    {
      n: '03',
      title: 'Design systems',
      body: 'One language across every surface. Tokens, components and the documentation that keeps them honest a year from now.',
      tags: ['Tokens', 'Components', 'Documentation', 'Governance'],
      tone: 'ink',
      visual: 'sheets',
    },
    {
      n: '04',
      title: 'Engineering',
      body: 'Production code from the first week. Accessible, measured, fast on the phones people actually own.',
      tags: ['React', 'Native', 'WebGL', 'Performance'],
      tone: 'cobalt',
      visual: 'bars',
    },
    {
      n: '05',
      title: 'Motion & 3D',
      body: 'Movement that carries meaning — timing systems, real-time 3D and micro-interactions that never get in the way.',
      tags: ['Motion systems', 'Real-time 3D', 'Micro-interactions'],
      tone: 'white',
      visual: 'path',
    },
  ],
}

export const studio = {
  index: '05',
  label: 'Studio',
  heading: ['Two studios.', 'One team.'],
  body: 'Fourteen designers and engineers between Amsterdam and Tashkent. Small by choice: every project is led by the people who will actually make it, and we take on four at a time — never more.',
  images: [
    { src: '/images/studio-room.webp', alt: 'A bright studio with a long oak table and tall windows', w: 1200, h: 805, city: 'Amsterdam' },
    { src: '/images/studio-desk.webp', alt: 'A notebook, a pencil and a chrome sphere on an oak desk', w: 840, h: 1043, city: 'Tashkent' },
  ],
  facts: [
    ['14', 'people'],
    ['04', 'projects at a time'],
    ['07', 'years'],
  ],
}

export const cta = {
  label: 'Start a project',
  lines: ["Let's do it", 'on purpose.'],
  button: 'Start a project',
  meta: ['Booking Q1 2027', 'Replies within two working days', 'Amsterdam · Tashkent'],
}

export const footer = {
  colophon: 'Designed and built in-house. Set in Instrument Sans & Instrument Serif.',
  version: 'v1.0 — 09 / 2026',
}
