/**
 * Technical facts only.
 *
 * Every word the visitor reads lives in `src/i18n/dictionaries/*`; what lives
 * here is language-independent: contact data, media paths, intrinsic
 * dimensions, anchors and indexes. Translated lists are zipped onto these by
 * index, so a copy change never has to touch geometry and vice versa.
 */

export const SITE = {
  name: 'NUVANE',
  email: 'studio@nuvane.xyz',
  phone: '+49 30 5550 1188',
  address: 'Torstraße 140',
  coordinates: '52.5200° N, 13.4050° E',
  timeZoneId: 'Europe/Berlin',
  established: '2019',
};

/** Anchors in document order — labels come from `nav` in each dictionary. */
export const NAV_HREFS = ['#work', '#capabilities', '#about', '#contact'];

export const CAP_MEDIA = [
  { id: '01', image: '/media/aura.jpg' },
  { id: '02', image: '/media/synth.jpg' },
  { id: '03', image: '/media/orbit.jpg' },
  { id: '04', image: '/media/hero.jpg' },
];

export const PROJECT_MEDIA = [
  { id: '01', year: '2026', image: '/media/aura.jpg', width: 1408, height: 768, stack: ['DIFFUSION', 'WEBGL', 'EDGE RUNTIME'] },
  { id: '02', year: '2025', image: '/media/synth.jpg', width: 1408, height: 768, stack: ['WEBRTC', 'AUDIO DSP', 'RUST'] },
  { id: '03', year: '2025', image: '/media/orbit.jpg', width: 1408, height: 768, stack: ['GLSL', 'TELEMETRY', 'SPATIAL AUDIO'] },
];

/** Counters in the hero footer; the unit/label is translated per language. */
export const STAT_VALUES = [48, 11, 60];

/** Platform names are brand names — deliberately not translated. */
export const FOOTER_SOCIAL = [
  ['INSTAGRAM', 'https://www.instagram.com'],
  ['DRIBBBLE', 'https://dribbble.com'],
  ['GITHUB', 'https://github.com'],
  ['LINKEDIN', 'https://www.linkedin.com'],
];
