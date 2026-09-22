# LUSION — Exact Homepage Recreation | Light Theme Elastic Showreel Ribbon

> **Role:** Principal Creative Technologist & Lead WebGL/Frontend Architect (Awwwards SOTY benchmark)
> **CRITICAL:** No dark background with purple sphere. No technical params printed on screen. Exact real-world Lusion.co homepage — light theme, elastic showreel ribbon, editorial portfolio.

---

## 1. Core Visuals & Layout (Exact Lusion Match)

- **Background:** Clean studio white/light gray `#f9f9fb` to `#ffffff`
- **Typography:** High-contrast black `#0b0b0d`, bold grotesque editorial, refined grid
- **Header (Navbar):**
  - Left: Bold sans-serif `LUSION` wordmark
  - Right: Pill dark `LET'S TALK ●` + outline `MENU =`
- **Centerpiece — Hero 3D Elastic Ribbon / Reel:**
  - Full-width horizontal interactive 3D curved plane/ribbon center
  - Surface acts as interactive canvas playing dynamic showreel texture feeds
  - Elastic Mesh Distortion: vertices warp, stretch, bend like rubber/cloth based on mouse drag, velocity, scroll inertia
  - Center Play Button: Magnetic floating pill `PLAY REEL ▶` snaps and floats on 3D surface
  - Crosshair markers `+ + + +` under ribbon with proximity reaction
- **Downstream:**
  - `Featured Work` + huge statement `Bold Ideas, Brought to Life.`
  - 2-column editorial project grid rounded corners smooth scale on hover

---

## 2. Technical Specifications & Shaders (Elastic Ribbon)

### Elastic Mesh Physics (Three.js / R3F)
- Geometry: `PlaneGeometry(16, 6, 64, 32)` horizontal
- Vertex Shader `ribbon.vert.glsl`:
```glsl
vec3 pos = position;
float wave = sin(pos.x * 0.5 + uTime * 1.5) * cos(pos.y * 0.8 + uTime) * uWaveIntensity;
float mouseDist = length(pos.xy - uMouseTarget);
float mouseDeform = smoothstep(3.5, 0.0, mouseDist) * uMouseVelocity;
pos.z += wave + (mouseDeform * sin(uTime * 4.0));
gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
```
### Surface Material
- Dynamic canvas texture showreel mapping + subtle chromatic aberration on warped edges

### Smooth Motion
- Lenis Scroll `lerp: 0.08` synced with GSAP ScrollTrigger to fold/unfold ribbon into curved arc on scroll

---

## 3. Interactive DOM Overlay & Cursor

- Magnetic floating cursor morphs into fluid dot and expands on ribbon / project cards
- Typography reveals via GSAP stagger with `overflow-hidden` masks

---

## 4. Output Files — Production-Ready TypeScript + Tailwind

```
src/components/canvas/HeroRibbon.tsx — Three.js canvas elastic plane, shader uniforms, raycasting, studio lighting
src/shaders/ribbonShader.ts — Inlined GLSL vertex + fragment shaders wave & cursor drag distortion
src/components/dom/Navbar.tsx & HeroSection.tsx — Accurate navbar, PLAY REEL floating pill, crosshair grids
src/components/dom/ProjectGrid.tsx — 2-column featured case studies layout
src/app/page.tsx — Root orchestrator Lenis smooth scroll + 3D ribbon canvas + DOM layers
```

Plus:
- `src/hooks/useLenisScroller.ts` (lerp 0.08)
- `src/hooks/usePointerDynamics.ts`
- `src/components/ui/LiquidCursor.tsx`
- `src/App.jsx`, `src/main.jsx`, `vite.config.js`, `index.html`

---

## 5. Run

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
npm run preview # http://localhost:4173
```

---

## 6. GitHub ZIP Auto-Download

Branch: `arena/01a0c8ff-project` — **completely new light theme project**

**Auto-download ZIP:**
```
https://github.com/fm1227693-hub/PROJECT/archive/refs/heads/arena/01a0c8ff-project.zip
```
Direct:
```
https://codeload.github.com/fm1227693-hub/PROJECT/zip/refs/heads/arena/01a0c8ff-project
```
Repo:
```
https://github.com/fm1227693-hub/PROJECT/tree/arena/01a0c8ff-project
```

---

## 7. Quality

- No dark purple sphere, no code specs printed on screen — exact Lusion.co light editorial
- Strict TypeScript, Tailwind, R3F, GSAP, Lenis
- Bug-free, no placeholders, proper cleanup `geometry.dispose()`, `material.dispose()`, `ScrollTrigger.kill()`
- Buttery 60/120 FPS, Plane(16,6,64,32) = 2048 vertices + 8000 particle fallback removed for light theme purity
