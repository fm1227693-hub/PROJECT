/* =====================================================================
   DATA / CONTENT
   All editorial content in one place so the page modules stay about
   behaviour, not copy.
   ===================================================================== */

export const WORKS = [
  { t: 'Aero Dispersion', c: 'Nike', tags: ['webgl', '3d'], y: '2025', pal: ['#ff4d1f', '#ffb199', '#1a0b06'], award: 'SOTD', kind: 'flow' },
  { t: 'Subsurface Cloth', c: 'Balenciaga', tags: ['3d', 'campaign'], y: '2025', pal: ['#4f46e5', '#c7d2fe', '#0b0b23'], award: 'FWA', kind: 'cloth' },
  { t: 'Volumetric Configurator', c: 'Polestar', tags: ['webgl', 'product'], y: '2024', pal: ['#0ea5e9', '#e0f2fe', '#04131c'], award: 'SOTM', kind: 'wave' },
  { t: 'Kinetic Typography', c: 'Spotify', tags: ['campaign'], y: '2024', pal: ['#22c55e', '#bbf7d0', '#03170a'], award: 'SOTD', kind: 'type' },
  { t: 'Fluid Identity', c: 'Adobe MAX', tags: ['webgl', 'campaign'], y: '2024', pal: ['#f43f5e', '#fecdd3', '#1c0409'], award: 'Honors', kind: 'fluid' },
  { t: 'Spatial Retail', c: 'IKEA', tags: ['3d', 'product'], y: '2023', pal: ['#f59e0b', '#fde68a', '#1c1204'], award: 'SOTY Nominee', kind: 'meta' },
  { t: 'Particle Orchestra', c: 'Sony Music', tags: ['webgl'], y: '2023', pal: ['#a855f7', '#e9d5ff', '#12041c'], award: 'FWA', kind: 'swarm' },
  { t: 'Glass Interface', c: 'Apple Vision', tags: ['product'], y: '2023', pal: ['#94a3b8', '#f1f5f9', '#0b0f14'], award: 'SOTD', kind: 'glass' },
  { t: 'Terrain Engine', c: 'Land Rover', tags: ['3d', 'webgl'], y: '2022', pal: ['#65a30d', '#d9f99d', '#0a1203'], award: 'SOTM', kind: 'terrain' },
  { t: 'Neon Commerce', c: 'Off-White', tags: ['campaign', 'product'], y: '2022', pal: ['#facc15', '#fef9c3', '#141101'], award: 'Honors', kind: 'plasma' },
  { t: 'Ocean Simulation', c: 'National Geographic', tags: ['webgl', '3d'], y: '2021', pal: ['#06b6d4', '#cffafe', '#03181c'], award: 'SOTD', kind: 'ocean' },
  { t: 'Signal Field', c: 'Ericsson', tags: ['webgl'], y: '2021', pal: ['#ec4899', '#fbcfe8', '#1c0412'], award: 'Honors', kind: 'signal' }
];

export const SERVICES = [
  {
    n: '01', t: 'Real-time 3D & WebGL', kind: 'wire',
    d: 'Custom render pipelines, GLSL shaders, GPGPU particles and physically based materials — running at native refresh rates on the web.',
    tags: ['Three.js', 'WebGPU', 'GLSL', 'GPGPU'], col: '#ff4d1f'
  },
  {
    n: '02', t: 'Interactive Design', kind: 'sculpt',
    d: 'Motion-first interface design where every transition carries meaning. Prototyped in code, validated on device.',
    tags: ['UX', 'Motion', 'Prototyping'], col: '#4f46e5'
  },
  {
    n: '03', t: 'Creative Development', kind: 'arch',
    d: 'Robust front-end engineering that scales — from launch microsites to full product platforms with 3D at the core.',
    tags: ['Front-end', 'Performance', 'CMS'], col: '#0ea5e9'
  },
  {
    n: '04', t: 'CGI & Motion', kind: 'liquid',
    d: 'Look development, procedural animation and real-time film — bridging offline quality with in-browser delivery.',
    tags: ['Houdini', 'Blender', 'Look-dev'], col: '#22c55e'
  },
  {
    n: '05', t: 'Spatial & Immersive', kind: 'swarm',
    d: 'Installations, WebXR and volumetric experiences that extend brand worlds beyond the rectangle.',
    tags: ['WebXR', 'Installation', 'AR'], col: '#f59e0b'
  }
];

export const AWARDS = [
  { o: 'Awwwards', t: 'Studio of the Year', y: '2024', n: 1 },
  { o: 'Awwwards', t: 'Site of the Day', y: '2019 — 2026', n: 27 },
  { o: 'FWA', t: 'FWA of the Day', y: '2019 — 2026', n: 19 },
  { o: 'CSS Design Awards', t: 'Website of the Year', y: '2023', n: 1 },
  { o: 'Webby Awards', t: 'Best Visual Design', y: '2022, 2025', n: 2 },
  { o: 'D&AD', t: 'Wood Pencil — Digital Craft', y: '2024', n: 1 }
];

export const TEAM = [
  { n: 'Edan Kwan', r: 'Founder / Creative Technologist', h: 18, kind: 'portrait-a' },
  { n: 'Mira Sato', r: 'Design Director', h: 260, kind: 'portrait-b' },
  { n: 'Tomas Ekholm', r: 'Lead WebGL Engineer', h: 200, kind: 'portrait-c' },
  { n: 'Aisha Rahman', r: 'Executive Producer', h: 330, kind: 'portrait-a' },
  { n: 'Leo Marchetti', r: '3D Artist', h: 40, kind: 'portrait-b' },
  { n: 'Yuna Park', r: 'Motion Designer', h: 290, kind: 'portrait-c' },
  { n: 'Sam Oduya', r: 'Creative Developer', h: 150, kind: 'portrait-a' },
  { n: 'Clara Weiss', r: 'Technical Director', h: 210, kind: 'portrait-b' }
];

export const VALUES = [
  {
    idx: '01', t: 'Craft over shortcuts', kind: 'wire',
    d: 'Every shader, easing curve and interaction is hand-tuned. We don\'t reach for templates — we build systems that fit the story.',
    col: '#ff4d1f'
  },
  {
    idx: '02', t: 'Performance is design', kind: 'signal',
    d: 'A beautiful frame that stutters is a broken frame. We budget every millisecond and profile on real devices, not just top-tier laptops.',
    col: '#4f46e5'
  },
  {
    idx: '03', t: 'Play seriously', kind: 'fluid',
    d: 'Our best work started as a Lab experiment. We protect time to explore, break things, and turn curiosity into client value.',
    col: '#22c55e'
  },
  {
    idx: '04', t: 'Partners, not vendors', kind: 'arch',
    d: 'We embed with your team, share our process openly, and stay long after launch to keep the experience evolving.',
    col: '#f59e0b'
  }
];

export const TIMELINE = [
  { y: '2018', t: 'Two engineers and a designer', d: 'Founded in Bristol with a shared obsession for real-time graphics on the web. First studio: a kitchen table.', kind: 'meta' },
  { y: '2020', t: 'First global launches', d: 'Awwwards Site of the Year nomination. The team grows to eight and moves into a converted warehouse studio.', kind: 'wave' },
  { y: '2022', t: 'Lusion Labs opens', d: 'Our open R&D playground for fluid sims, GPGPU particles and generative shaders — published every Friday.', kind: 'flow' },
  { y: '2024', t: 'Studio of the Year', d: 'Work shipped for automotive, fashion and consumer tech brands across four continents. Eighteen people, nine countries.', kind: 'sculpt' },
  { y: '2026', t: 'Spatial computing', d: 'WebGPU pipelines, real-time collaborative 3D and installation work — still chasing the perfect frame.', kind: 'plasma' }
];

export const BRANDS = ['Nike', 'Balenciaga', 'Polestar', 'Spotify', 'Adobe', 'IKEA', 'Sony', 'Apple', 'Land Rover', 'Off-White', 'National Geographic', 'Ericsson'];

/* Lab experiments — every tile is a different algorithm */
export const LABS = [
  { t: 'Fluid Ink', s: 'Navier–Stokes advection', k: 'fluid', pal: ['#ff4d1f', '#4f46e5', '#0b0b0c'] },
  { t: 'Metaballs', s: 'Marching threshold field', k: 'meta', pal: ['#f8fafc', '#ff4d1f', '#0b0b0c'] },
  { t: 'Flow Field', s: 'Curl noise particles', k: 'flow', pal: ['#0b0b0c', '#38bdf8', '#050810'] },
  { t: 'Wave Grid', s: 'Sine interference', k: 'wave', pal: ['#ff4d1f', '#fde68a', '#0b0b0c'] },
  { t: 'Orbit Cloth', s: 'Verlet spring lattice', k: 'cloth', pal: ['#4f46e5', '#f1f5f9', '#0b0b0c'] },
  { t: 'Plasma', s: 'Domain warped fbm', k: 'plasma', pal: ['#ff4d1f', '#4f46e5', '#0b0b0c'] },
  { t: 'Reaction', s: 'Gray–Scott diffusion', k: 'reaction', pal: ['#22d3ee', '#f0abfc', '#06080f'] },
  { t: 'Voronoi', s: 'Cellular distance field', k: 'voronoi', pal: ['#facc15', '#4f46e5', '#0b0b0c'] },
  { t: 'Moiré', s: 'Interfering line grids', k: 'moire', pal: ['#f8fafc', '#ff4d1f', '#0b0b0c'] },
  { t: 'Growth', s: 'Space colonisation', k: 'growth', pal: ['#4ade80', '#0ea5e9', '#060b08'] },
  { t: 'Swarm', s: 'Boids + cursor repulsion', k: 'swarm', pal: ['#fb7185', '#fef3c7', '#0d0507'] },
  { t: 'Glitch', s: 'Scanline displacement', k: 'glitch', pal: ['#a855f7', '#22d3ee', '#07060c'] }
];

export const PHILOSOPHY_STRIP = [
  { k: 'sculpt', cap: 'Form study 014' },
  { k: 'wave', cap: 'Light behaviour' },
  { k: 'flow', cap: 'Motion grammar' }
];

export const MARQUEE_ITEMS = ['Real-time 3D', 'WebGL', 'Interaction', 'Motion', 'Shaders', 'Spatial', 'Creative Dev'];
