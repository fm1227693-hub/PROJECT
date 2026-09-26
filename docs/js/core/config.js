/* =====================================================================
   CORE / CONFIG
   Quality tiers, section atmosphere profiles and asset paths.
   Everything the renderer needs to know about "how a section should feel"
   lives here so the scroll systems stay declarative.
   ===================================================================== */

export const ASSETS = {
  hdri: 'assets/hdr/studio.hdr',       /* optional: drop a Poly Haven CC0 .hdr here */
  heroModel: 'assets/3d/hero.glb',     /* optional: drop a GLB sculpture here       */
  textures: 'assets/textures/'
};

/* ---------------------------------------------------------------------
   DEVICE / QUALITY
   --------------------------------------------------------------------- */
export const DEVICE = (() => {
  const boot = window.__LUSION_BOOT__ || {};
  const w = window.innerWidth;
  const touch = !!boot.touch;
  const cores = boot.cores || 4;
  const mem = boot.mem || 4;
  const weak = touch || cores <= 4 || mem <= 4;
  return {
    touch,
    reduced: !!boot.reduced,
    webgl: boot.webgl !== false,
    width: w,
    height: window.innerHeight,
    /* tier 2 = full, 1 = balanced, 0 = minimal */
    tier: touch ? (weak ? 0 : 1) : (cores >= 8 && mem >= 8 ? 2 : 1),
    weak,
    isMobile: w < 820,
    isTablet: w >= 820 && w < 1280
  };
})();

export const QUALITY = {
  0: { dpr: 1.0,  msaa: 0, bloom: false, particles: 0.25, transmission: false, shadows: false, sculptureDetail: 0.4, postFx: false, canvas2dDpr: 1.0 },
  1: { dpr: 1.35, msaa: 0, bloom: true,  particles: 0.55, transmission: false, shadows: true,  sculptureDetail: 0.7, postFx: true,  canvas2dDpr: 1.25 },
  2: { dpr: 1.75, msaa: 4, bloom: true,  particles: 1.0,  transmission: true,  shadows: true,  sculptureDetail: 1.0, postFx: true,  canvas2dDpr: 1.5 }
};

/* ---------------------------------------------------------------------
   SECTION ATMOSPHERE PROFILES
   Each key matches a [data-section] in the markup.
   intensity  → global energy of the world (drives particles, light, motion)
   dark       → 0 = paper world, 1 = cinematic black
   bloom      → UnrealBloom strength
   grain      → film grain opacity
   ca         → chromatic aberration amount (kept tiny — restraint)
   distort    → lens barrel distortion
   fog        → fog density
   exposure   → tone mapping exposure
   sky        → [horizon, zenith, accent] colours for the sky shader
   cam        → default camera shot for the section
   --------------------------------------------------------------------- */
export const SECTIONS = {
  /* ---- home ---- */
  hero: {
    intensity: 0.2, dark: 0.0, bloom: 0.16, grain: 0.05, ca: 0.0, distort: 0.0, fog: 0.012, exposure: 1.06,
    sky: ['#f3f1ec', '#e2ded6', '#ff4d1f'],
    cam: { pos: [0.9, 0.15, 7.4], look: [0.4, 0.05, 0], fov: 34 }
  },
  reel: {
    intensity: 0.55, dark: 0.94, bloom: 0.62, grain: 0.1, ca: 0.35, distort: 0.22, fog: 0.05, exposure: 1.0,
    sky: ['#0d0d11', '#050507', '#ff4d1f'],
    cam: { pos: [0, 0, 5.2], look: [0, 0, 0], fov: 40 }
  },
  manifesto: {
    intensity: 0.3, dark: 0.05, bloom: 0.2, grain: 0.055, ca: 0.05, distort: 0.0, fog: 0.018, exposure: 1.05,
    sky: ['#efede8', '#e4e0d8', '#4f46e5'],
    cam: { pos: [-1.4, 0.4, 6.6], look: [-0.2, 0.1, 0], fov: 36 }
  },
  works: {
    intensity: 0.35, dark: 0.1, bloom: 0.2, grain: 0.06, ca: 0.06, distort: 0.0, fog: 0.02, exposure: 1.04,
    sky: ['#eceae5', '#dedad2', '#ff4d1f'],
    cam: { pos: [1.8, -0.2, 7.0], look: [0.6, 0, 0], fov: 35 }
  },
  services: {
    intensity: 0.8, dark: 0.9, bloom: 0.5, grain: 0.085, ca: 0.16, distort: 0.06, fog: 0.045, exposure: 1.0,
    sky: ['#0a0a0d', '#060608', '#4f46e5'],
    cam: { pos: [0, 0.1, 6.4], look: [0, 0, 0], fov: 38 }
  },
  carousel: {
    intensity: 0.9, dark: 0.96, bloom: 0.55, grain: 0.09, ca: 0.18, distort: 0.05, fog: 0.035, exposure: 1.02,
    sky: ['#08080b', '#040406', '#ff4d1f'],
    cam: { pos: [0, 0.35, 8.6], look: [0, 0, 0], fov: 40 }
  },
  marquee: {
    intensity: 0.45, dark: 0.15, bloom: 0.24, grain: 0.06, ca: 0.1, distort: 0.0, fog: 0.02, exposure: 1.04,
    sky: ['#e9e6e0', '#dcd8d0', '#ff4d1f'],
    cam: { pos: [0, 0.6, 7.6], look: [0, 0.2, 0], fov: 36 }
  },
  stats: {
    intensity: 0.3, dark: 0.0, bloom: 0.16, grain: 0.05, ca: 0.02, distort: 0.0, fog: 0.014, exposure: 1.06,
    sky: ['#efede8', '#e5e1d9', '#4f46e5'],
    cam: { pos: [-2.2, 0.3, 7.8], look: [-0.6, 0.1, 0], fov: 34 }
  },
  awards: {
    intensity: 0.25, dark: 0.0, bloom: 0.14, grain: 0.05, ca: 0.0, distort: 0.0, fog: 0.012, exposure: 1.06,
    sky: ['#efede8', '#e7e3db', '#ff4d1f'],
    cam: { pos: [2.4, 0.2, 8.2], look: [0.8, 0, 0], fov: 33 }
  },
  cta: {
    intensity: 0.75, dark: 0.9, bloom: 0.7, grain: 0.09, ca: 0.2, distort: 0.08, fog: 0.04, exposure: 1.0,
    sky: ['#0b0b0e', '#050507', '#ff4d1f'],
    cam: { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 42 }
  },

  /* ---- about ---- */
  'about-hero': {
    intensity: 0.35, dark: 0.0, bloom: 0.22, grain: 0.055, ca: 0.03, distort: 0.0, fog: 0.016, exposure: 1.05,
    sky: ['#f1efea', '#e0dcd4', '#4f46e5'],
    cam: { pos: [0, 0.1, 6.8], look: [0, 0, 0], fov: 36 }
  },
  philosophy: {
    intensity: 0.3, dark: 0.04, bloom: 0.2, grain: 0.055, ca: 0.02, distort: 0.0, fog: 0.016, exposure: 1.05,
    sky: ['#efede8', '#e3dfd7', '#ff4d1f'],
    cam: { pos: [-2.6, 0.2, 7.2], look: [-0.8, 0, 0], fov: 34 }
  },
  values: {
    intensity: 0.4, dark: 0.06, bloom: 0.24, grain: 0.06, ca: 0.04, distort: 0.0, fog: 0.018, exposure: 1.05,
    sky: ['#eeece7', '#e0dcd4', '#4f46e5'],
    cam: { pos: [2.2, 0, 7.0], look: [0.7, 0, 0], fov: 35 }
  },
  team: {
    intensity: 0.3, dark: 0.02, bloom: 0.18, grain: 0.055, ca: 0.02, distort: 0.0, fog: 0.014, exposure: 1.06,
    sky: ['#efede8', '#e6e2da', '#ff4d1f'],
    cam: { pos: [0, 0.8, 8.0], look: [0, 0.2, 0], fov: 34 }
  },
  timeline: {
    intensity: 0.45, dark: 0.12, bloom: 0.26, grain: 0.06, ca: 0.05, distort: 0.02, fog: 0.02, exposure: 1.04,
    sky: ['#e9e6e0', '#d9d5cc', '#4f46e5'],
    cam: { pos: [-1.6, -0.4, 7.4], look: [-0.4, -0.1, 0], fov: 35 }
  },
  brands: {
    intensity: 0.3, dark: 0.0, bloom: 0.16, grain: 0.05, ca: 0.02, distort: 0.0, fog: 0.012, exposure: 1.06,
    sky: ['#efede8', '#e5e1d9', '#ff4d1f'],
    cam: { pos: [1.4, 0.4, 8.4], look: [0.4, 0.1, 0], fov: 33 }
  },
  'about-cta': {
    intensity: 0.75, dark: 0.9, bloom: 0.66, grain: 0.09, ca: 0.18, distort: 0.07, fog: 0.04, exposure: 1.0,
    sky: ['#0b0b0e', '#050507', '#ff4d1f'],
    cam: { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 42 }
  },

  /* ---- work ---- */
  'work-hero': {
    intensity: 0.4, dark: 0.05, bloom: 0.24, grain: 0.06, ca: 0.04, distort: 0.0, fog: 0.018, exposure: 1.05,
    sky: ['#efede8', '#e1ddd5', '#4f46e5'],
    cam: { pos: [0.6, 0.2, 7.4], look: [0.2, 0, 0], fov: 35 }
  },
  'work-grid': {
    intensity: 0.45, dark: 0.08, bloom: 0.24, grain: 0.06, ca: 0.05, distort: 0.0, fog: 0.02, exposure: 1.04,
    sky: ['#eceae5', '#dcd8d0', '#ff4d1f'],
    cam: { pos: [-1.2, 0.1, 8.4], look: [-0.3, 0, 0], fov: 34 }
  },
  'work-cta': {
    intensity: 0.75, dark: 0.9, bloom: 0.66, grain: 0.09, ca: 0.18, distort: 0.07, fog: 0.04, exposure: 1.0,
    sky: ['#0b0b0e', '#050507', '#ff4d1f'],
    cam: { pos: [0, 0, 6.2], look: [0, 0, 0], fov: 42 }
  },

  /* ---- lab ---- */
  'lab-hero': {
    intensity: 0.9, dark: 0.86, bloom: 0.6, grain: 0.09, ca: 0.24, distort: 0.1, fog: 0.035, exposure: 1.0,
    sky: ['#0a0a10', '#050508', '#4f46e5'],
    cam: { pos: [0, 0, 6.4], look: [0, 0, 0], fov: 40 }
  },
  'lab-grid': {
    intensity: 1.0, dark: 0.9, bloom: 0.66, grain: 0.1, ca: 0.28, distort: 0.12, fog: 0.04, exposure: 1.0,
    sky: ['#08080d', '#040406', '#ff4d1f'],
    cam: { pos: [0, 0, 5.8], look: [0, 0, 0], fov: 42 }
  },

  /* ---- contact ---- */
  'contact-hero': {
    intensity: 0.6, dark: 0.96, bloom: 0.72, grain: 0.09, ca: 0.2, distort: 0.08, fog: 0.05, exposure: 1.0,
    sky: ['#07070a', '#030304', '#ff4d1f'],
    cam: { pos: [0, 0, 7.6], look: [0, 0, 0], fov: 40 }
  },
  'contact-form': {
    intensity: 0.5, dark: 0.94, bloom: 0.55, grain: 0.08, ca: 0.14, distort: 0.05, fog: 0.045, exposure: 1.0,
    sky: ['#0a0a0d', '#040406', '#4f46e5'],
    cam: { pos: [-2.4, 0.2, 7.0], look: [-0.8, 0, 0], fov: 38 }
  }
};

export const SECTION_ORDER = {
  '/': ['hero', 'reel', 'manifesto', 'works', 'services', 'carousel', 'marquee', 'stats', 'awards', 'cta'],
  '/about': ['about-hero', 'philosophy', 'values', 'team', 'timeline', 'brands', 'about-cta'],
  '/work': ['work-hero', 'work-grid', 'work-cta'],
  '/lab': ['lab-hero', 'lab-grid'],
  '/contact': ['contact-hero', 'contact-form']
};

/* Route → which world stages are alive */
export const ROUTE_STAGES = {
  '/': ['sculpture', 'portal', 'ribbon', 'panels', 'serviceObject', 'carousel', 'orb', 'dust'],
  '/about': ['sculpture', 'ribbon', 'shards', 'orb', 'dust'],
  '/work': ['panels', 'ribbon', 'dust'],
  '/lab': ['orb', 'shards', 'labField', 'dust'],
  '/contact': ['orb', 'dust', 'shards']
};

export const DEFAULT_PROFILE = SECTIONS.hero;
