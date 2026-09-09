export const SITE = {
  name: 'NEBULA',
  tagline: 'AI Creative Studio',
  email: 'studio@nebula.xyz',
  city: 'Berlin',
  address: 'Torstraße 140',
  country: 'Germany',
  phone: '+49 30 5550 1188',
  coordinates: '52.5200° N, 13.4050° E',
  timezone: 'CET / CEST',
  timeZoneId: 'Europe/Berlin',
  established: '2019',
};

export const NAV_LINKS = [
  { label: 'WORK', href: '#work' },
  { label: 'CAPABILITIES', href: '#capabilities' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
];

export const HERO_LINES = ['WE BUILD', 'DIGITAL WORLDS', 'FOR THE <em>AI ERA</em>.'];

/** Rotating index used by the section seams — one voice across the page. */
export const SEAM_TICKER = [
  'AI EXPERIENCE',
  'DIGITAL PRODUCTS',
  'INTERACTIVE SYSTEMS',
  'CREATIVE TECHNOLOGY',
  'REALTIME GRAPHICS',
  'GENERATIVE INTERFACES',
];

export const CAPABILITIES = [
  {
    id: '01',
    title: 'AI EXPERIENCE',
    blurb:
      'Interfaces where models become behaviour. We design the conversation between human and machine — latency, tone, memory, trust.',
    detail: ['Conversational UI', 'Generative interfaces', 'Model evaluation', 'Voice & vision'],
    metric: '0.4s PERCEIVED LATENCY',
    image: '/media/aura.jpg',
  },
  {
    id: '02',
    title: 'DIGITAL PRODUCTS',
    blurb:
      'Full-stack product craft from first sketch to shipped release. Systems that stay elegant while the roadmap doubles underneath them.',
    detail: ['Product design', 'Design systems', 'Realtime frontends', 'Platform architecture'],
    metric: '11 WEEKS CONCEPT → V1',
    image: '/media/synth.jpg',
  },
  {
    id: '03',
    title: 'INTERACTIVE SYSTEMS',
    blurb:
      'Installation-scale work: sensors, projection, spatial audio and WebGL running as one choreographed organism.',
    detail: ['Installation', 'WebGL & shaders', 'Spatial computing', 'Sensor pipelines'],
    metric: '60 FPS AT 40 METRES',
    image: '/media/orbit.jpg',
  },
  {
    id: '04',
    title: 'CREATIVE TECHNOLOGY',
    blurb:
      'R&D for the moments that need a new tool. Prototypes in weeks, patent-grade engineering when it earns it.',
    detail: ['Prototyping', 'Custom engines', 'ML tooling', 'Technical direction'],
    metric: '3 LANGUAGES, ONE ENGINE',
    image: '/media/hero.jpg',
  },
];

export const PROJECTS = [
  {
    id: '01',
    title: 'AURA',
    category: 'AI EXPERIENCE',
    year: '2026',
    role: 'Creative Direction · Web',
    blurb:
      'A generative identity system that designs its own interface around each visitor — one brand, infinite surfaces.',
    image: '/media/aura.jpg',
    width: 1408,
    height: 768,
    stack: ['DIFFUSION', 'WEBGL', 'EDGE RUNTIME'],
    outcome: '+312% SESSION DEPTH',
  },
  {
    id: '02',
    title: 'SYNTH',
    category: 'DIGITAL PRODUCT',
    year: '2025',
    role: 'Product · Engineering',
    blurb:
      'A realtime collaborative instrument for sound artists. Sub-40ms sync across continents, zero-latency feel.',
    image: '/media/synth.jpg',
    width: 1408,
    height: 768,
    stack: ['WEBRTC', 'AUDIO DSP', 'RUST'],
    outcome: '38MS MEDIAN SYNC',
  },
  {
    id: '03',
    title: 'ORBIT',
    category: 'INTERACTIVE SYSTEM',
    year: '2025',
    role: 'Installation · WebGL',
    blurb:
      'A rotating exhibition of light and motion driven by live orbital telemetry, mapped onto 40 metres of curved glass.',
    image: '/media/orbit.jpg',
    width: 1408,
    height: 768,
    stack: ['GLSL', 'TELEMETRY', 'SPATIAL AUDIO'],
    outcome: '1.2M VISITORS',
  },
];

export const TECH_PILLARS = [
  {
    id: '01',
    word: 'AI',
    copy: 'We treat models as raw material — not magic. Everything is measured, latency-tested and designed to fail gracefully.',
    note: 'MODELS AS MATERIAL',
  },
  {
    id: '02',
    word: 'DESIGN',
    copy: 'Art direction first. Type, spacing and light carry more of the product than any decoration ever will.',
    note: 'DIRECTION FIRST',
  },
  {
    id: '03',
    word: 'CODE',
    copy: 'Engineered like an instrument. Sixty frames per second is a design decision, and we defend it in review.',
    note: 'BUILT LIKE AN INSTRUMENT',
  },
  {
    id: '04',
    word: 'MOTION',
    copy: 'Choreography over decoration: few systems, precisely timed, responding to scroll, pointer and physics.',
    note: 'CHOREOGRAPHY, NOT DECORATION',
  },
];

export const STATS = [
  { value: 48, label: 'SHIPPED WORLDS' },
  { value: 11, label: 'INDUSTRY AWARDS' },
  { value: 60, label: 'FPS — NON-NEGOTIABLE' },
];

export const AVAILABILITY = [
  ['NEXT OPENING', 'FEBRUARY 2027'],
  ['ENGAGEMENT', 'RETAINER OR PROJECT'],
  ['CAPACITY', 'TWO PARTNERSHIPS'],
];

export const FOOTER_SOCIAL = [
  ['INSTAGRAM', 'https://www.instagram.com'],
  ['DRIBBBLE', 'https://dribbble.com'],
  ['GITHUB', 'https://github.com'],
  ['LINKEDIN', 'https://www.linkedin.com'],
];
