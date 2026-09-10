/**
 * EN — the authored source copy. Every other dictionary mirrors this shape
 * key-for-key (checked by `node scripts/i18n-audit.mjs`).
 *
 * Display lines are measured against the mask width, so a translation that is
 * much longer than English must be re-cut, not just re-worded.
 */
export const en = {
  meta: {
    tagline: 'AI Creative Studio',
    title: 'NUVANE — AI Creative Studio',
    description:
      'NUVANE is an AI creative studio building digital worlds: AI experiences, digital products, interactive systems and creative technology.',
    ogDescription: 'We build digital worlds for the AI era.',
    city: 'Berlin',
    country: 'Germany',
    timezone: 'CET / CEST',
  },

  ui: {
    skip: 'Skip to content',
    menu: 'MENU',
    close: 'CLOSE',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    chooseLanguage: 'Choose language',
    currentLanguage: 'Current language',
    theme: 'Theme',
    themeDark: 'Dark theme',
    themeLight: 'Light theme',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    primary: 'Primary',
    mobileNav: 'Mobile',
    footerNav: 'Footer',
    backToTop: 'BACK TO TOP',
    localTime: 'Local studio time',
    established: 'EST.',
    independent: 'INDEPENDENT STUDIO',
    availability: 'AVAILABLE FOR SELECT PROJECTS',
    scroll: 'SCROLL',
    scrollDescend: 'SCROLL TO DESCEND',
    startProject: 'START A PROJECT',
    viewWork: 'VIEW WORK',
    holdDrag: 'HOLD AND DRAG · OR KEEP SCROLLING',
    studio: 'STUDIO',
    openCase: 'OPEN CASE',
    builtWith: 'Built with',
    drag: 'DRAG',
    view: 'VIEW',
    open: 'OPEN',
    write: 'WRITE',
    emailAria: 'Email the studio at',
    caseAria: 'Open case',
    visual: 'project visual',
    index: 'INDEX',
    contact: 'CONTACT',
    elsewhere: 'ELSEWHERE',
    rights: 'ALL RIGHTS RESERVED',
    designedIn: 'DESIGNED IN',
    entering: 'ENTERING THE STUDIO',
    loading: 'Loading the NUVANE studio experience',
    studioAvailability: 'Studio availability',
  },

  nav: ['WORK', 'CAPABILITIES', 'ABOUT', 'CONTACT'],

  hero: {
    lines: ['WE BUILD', 'DIGITAL WORLDS', 'FOR THE <em>AI ERA</em>.'],
    lead: 'A studio for experiences that feel inevitable. We compose intelligence, design and real-time graphics into products people remember — engineered to stay weightless.',
    stats: ['SHIPPED WORLDS', 'INDUSTRY AWARDS', 'FPS — NON-NEGOTIABLE'],
  },

  seams: {
    capabilities: { label: 'CAPABILITIES', note: 'FOUR PRACTICES — ONE TEAM' },
    work: { label: 'SELECTED WORK', note: '2025 — 2026' },
    engine: { label: 'TECHNOLOGY / EXPERIENCE', note: 'AI · DESIGN · CODE · MOTION' },
    contact: { label: 'CONTACT', note: 'TWO PARTNERSHIPS OPEN' },
  },

  capabilities: {
    eyebrow: 'WHAT WE DO / 04',
    heading: ['WE TURN COMPLEX', 'TECHNOLOGY INTO', 'EXPERIENCES.'],
    lead: 'Four practices, one team. We move between research, design and engineering without hand-offs — which is the only way to ship intelligent work that feels considered.',
    count: '04 PRACTICES',
    items: [
      {
        title: 'AI EXPERIENCE',
        blurb:
          'Interfaces where models become behaviour. We design the conversation between human and machine — latency, tone, memory, trust.',
        detail: ['Conversational UI', 'Generative interfaces', 'Model evaluation', 'Voice & vision'],
        metric: '0.4s PERCEIVED LATENCY',
      },
      {
        title: 'DIGITAL PRODUCTS',
        blurb:
          'Full-stack product craft from first sketch to shipped release. Systems that stay elegant while the roadmap doubles underneath them.',
        detail: ['Product design', 'Design systems', 'Realtime frontends', 'Platform architecture'],
        metric: '11 WEEKS CONCEPT → V1',
      },
      {
        title: 'INTERACTIVE SYSTEMS',
        blurb:
          'Installation-scale work: sensors, projection, spatial audio and WebGL running as one choreographed organism.',
        detail: ['Installation', 'WebGL & shaders', 'Spatial computing', 'Sensor pipelines'],
        metric: '60 FPS AT 40 METRES',
      },
      {
        title: 'CREATIVE TECHNOLOGY',
        blurb:
          'R&D for the moments that need a new tool. Prototypes in weeks, patent-grade engineering when it earns it.',
        detail: ['Prototyping', 'Custom engines', 'ML tooling', 'Technical direction'],
        metric: '3 LANGUAGES, ONE ENGINE',
      },
    ],
  },

  projects: {
    eyebrow: 'THREE WORLDS, SHIPPED END TO END',
    heading: ['THREE WORLDS', 'WE SHIPPED'],
    lead: 'Scrolling advances the rail. Every project below shipped end to end — concept, interface, engine, and the night we made it production-ready.',
    items: [
      {
        category: 'AI EXPERIENCE',
        role: 'Creative Direction · Web',
        blurb:
          'A generative identity system that designs its own interface around each visitor — one brand, infinite surfaces.',
        outcome: '+312% SESSION DEPTH',
      },
      {
        category: 'DIGITAL PRODUCT',
        role: 'Product · Engineering',
        blurb:
          'A realtime collaborative instrument for sound artists. Sub-40ms sync across continents, zero-latency feel.',
        outcome: '38MS MEDIAN SYNC',
      },
      {
        category: 'INTERACTIVE SYSTEM',
        role: 'Installation · WebGL',
        blurb:
          'A rotating exhibition of light and motion driven by live orbital telemetry, mapped onto 40 metres of curved glass.',
        outcome: '1.2M VISITORS',
      },
    ],
  },

  technology: {
    eyebrow: 'THE ENGINE / 04 DISCIPLINES',
    heading: ['FOUR DISCIPLINES.', 'ONE SYSTEM.'],
    manifesto:
      'We are a studio of eleven: designers who read papers, engineers who kern, and one director who refuses to ship anything at 55 frames per second.',
    independent: 'INDEPENDENT',
    pillars: [
      {
        word: 'AI',
        note: 'MODELS AS MATERIAL',
        copy: 'We treat models as raw material — not magic. Everything is measured, latency-tested and designed to fail gracefully.',
      },
      {
        word: 'DESIGN',
        note: 'DIRECTION FIRST',
        copy: 'Art direction first. Type, spacing and light carry more of the product than any decoration ever will.',
      },
      {
        word: 'CODE',
        note: 'BUILT LIKE AN INSTRUMENT',
        copy: 'Engineered like an instrument. Sixty frames per second is a design decision, and we defend it in review.',
      },
      {
        word: 'MOTION',
        note: 'CHOREOGRAPHY, NOT DECORATION',
        copy: 'Choreography over decoration: few systems, precisely timed, responding to scroll, pointer and physics.',
      },
    ],
  },

  cta: {
    eyebrow: 'OPEN COMMISSIONS — Q1 2027',
    heading: ["LET'S BUILD", 'SOMETHING', 'UNEXPECTED.'],
    lead: "Have an ambitious idea? Let's turn it into an experience. Two weeks of discovery, then a working prototype you can feel.",
    facts: [
      ['NEXT OPENING', 'FEBRUARY 2027'],
      ['ENGAGEMENT', 'RETAINER OR PROJECT'],
      ['CAPACITY', 'TWO PARTNERSHIPS'],
    ],
  },

  footer: {
    blurb:
      'An independent AI creative studio building interfaces, products and interactive systems for people who care how it feels.',
  },

  ticker: [
    'AI EXPERIENCE',
    'DIGITAL PRODUCTS',
    'INTERACTIVE SYSTEMS',
    'CREATIVE TECHNOLOGY',
    'REALTIME GRAPHICS',
    'GENERATIVE INTERFACES',
  ],

  rail: ['NUVANE', 'CAPABILITIES', 'WORK', 'ENGINE', 'CONTACT'],
};
