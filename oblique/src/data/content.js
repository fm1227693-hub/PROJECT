export const studio = {
  name: 'Oblique',
  tagline: 'Made to be looked at twice.',
  email: 'hello@oblique.studio',
  cities: [
    { city: 'Lisbon', timeZone: 'Europe/Lisbon', address: 'Rua da Prata 12, 1100-415' },
    { city: 'Berlin', timeZone: 'Europe/Berlin', address: 'Torstraße 8, 10119' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Are.na', href: 'https://are.na' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'X', href: 'https://x.com' },
  ],
}

export const projects = [
  {
    id: 'meridian',
    index: '01',
    title: 'Meridian',
    summary: 'Private banking, rebuilt around a single ledger.',
    category: 'Product · Interface',
    year: '2026',
    image: '/images/work-meridian.webp',
    imageSm: '/images/work-meridian-sm.webp',
    alt: 'Frosted glass panels standing in a row, light refracting through them',
    ratio: '4 / 5',
    height: 54, // vh, desktop showcase
    offset: 0, // vh
  },
  {
    id: 'aster',
    index: '02',
    title: 'Aster',
    summary: 'An identity system for a type foundry.',
    category: 'Identity',
    year: '2025',
    image: '/images/work-aster.webp',
    imageSm: '/images/work-aster-sm.webp',
    alt: 'Printed poster with a vermilion circle, a black arc and a diagonal line',
    ratio: '3 / 4',
    height: 42,
    offset: 16,
  },
  {
    id: 'field',
    index: '03',
    title: 'Field',
    summary: 'A pocket weather station for growers.',
    category: 'Hardware · Product',
    year: '2025',
    image: '/images/work-field.webp',
    imageSm: '/images/work-field-sm.webp',
    alt: 'Matte graphite handheld device resting on a concrete plinth',
    ratio: '4 / 5',
    height: 50,
    offset: 4,
  },
  {
    id: 'norr',
    index: '04',
    title: 'Norr',
    summary: 'A reading platform for long-form journalism.',
    category: 'Editorial · Platform',
    year: '2024',
    image: '/images/work-norr.webp',
    imageSm: '/images/work-norr-sm.webp',
    alt: 'Open art magazine on an oak table next to a ceramic cup',
    ratio: '4 / 3',
    height: 40,
    offset: 20,
  },
  {
    id: 'cinder',
    index: '05',
    title: 'Cinder',
    summary: 'A motion language for a mobility brand.',
    category: 'Motion · Systems',
    year: '2024',
    image: '/images/work-cinder.webp',
    imageSm: '/images/work-cinder-sm.webp',
    alt: 'Long-exposure ribbons of warm light on a dark background',
    ratio: '16 / 10',
    height: 44,
    offset: 2,
  },
]

export const practice = [
  {
    index: '01',
    title: 'Strategy',
    text: 'Positioning, naming and the questions worth asking before the first pixel.',
    image: '/images/work-norr-sm.webp',
  },
  {
    index: '02',
    title: 'Identity',
    text: 'Systems that flex from a favicon to a facade without losing their voice.',
    image: '/images/work-aster-sm.webp',
  },
  {
    index: '03',
    title: 'Product',
    text: 'Interfaces designed in the browser, tested with real people, shipped weekly.',
    image: '/images/work-meridian-sm.webp',
  },
  {
    index: '04',
    title: 'Motion',
    text: 'Choreography that explains, never decorates.',
    image: '/images/work-cinder-sm.webp',
  },
  {
    index: '05',
    title: 'Engineering',
    text: 'Front-ends built to last: fast, accessible and pleasant to maintain.',
    image: '/images/work-field-sm.webp',
  },
]

export const notes = [
  {
    tag: 'Essay',
    title: 'The second glance',
    meta: '9 min read',
    tone: 'paper',
  },
  {
    tag: 'Talk',
    title: 'Slow interfaces, fast teams',
    meta: 'Config Lisbon · 2026',
    tone: 'ink',
  },
  {
    tag: 'Tool',
    title: 'Baseline — a grid calculator',
    meta: 'Open source',
    tone: 'signal',
  },
]

export const process = [
  {
    index: '01',
    title: 'Discover',
    text: 'Two weeks of interviews, audits and uncomfortable questions. We leave with a brief we actually believe.',
  },
  {
    index: '02',
    title: 'Define',
    text: 'Principles before pixels. A short document that every later decision can be checked against.',
  },
  {
    index: '03',
    title: 'Build & ship',
    text: 'Weekly releases in the open. No big reveal, just a product that gets better every Friday.',
  },
]
