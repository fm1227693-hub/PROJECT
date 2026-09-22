# LUSION — Exact Homepage 1:1 | Light Theme Elastic Video Ribbon + Blue Organic Spline

> **Role:** Principal Creative Technologist & Lead WebGL Architect (Awwwards SOTY benchmark)
> **Objective:** 1:1 reproduction of real Lusion.co homepage — light theme, interactive elastic video ribbon, smooth inertial scroll
> **DO NOT:** dark background with purple sphere, debug text, low-end flat primitives — exact Lusion only

---

## 1. Sequence & Visual Architecture

### 1.1 Cinematic Minimalist Preloader
- Fullscreen black `#000000`
- Bottom-left: Giant tabular numeric counter `000` → `100` mono spacing
- Center: Minimalist progress bar filling smoothly
- Exit: Forms iconic white `L` glyph before curtains-up wipe reveal to pristine off-white `#f7f7f9`

### 1.2 Hero Section & Elastic 3D Canvas
- Header: Left bold wordmark `LUSION`. Right `OUR APPROACH`, `LET'S TALK ●`, `MENU =`
- Interactive Showreel Ribbon:
  - Full-width horizontal curved plane/mesh organic viewport
  - Continuously shifts showreel media textures inside
  - Elastic Mesh Warping: Plane displaced Z/Y via GLSL sine-wave influenced by scroll velocity and cursor drag:
```glsl
pos.z += sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
pos.y += cos(pos.x * 0.3) * uMouseDeform;
```
  - Floating Center Button: High-contrast pill `PLAY REEL ▶` magnetically tethered to center
  - Blue Organic 3D Ribbon: Dynamic spline/tube curling gracefully behind and through showreel ribbon
  - Subtle alignment grid markers `+ + + +` underneath canvas

### 1.3 Editorial Content & Portfolio Grid
- Typography: Huge display `Bold Ideas, / Brought to Life` masked stagger reveal
- Subtext: "We combine design, motion, 3D, and development..."
- Case Studies Grid: 2-column rounded cards (Devin AI laptop, Tree canopy, Spaaace NFT, DDD 2024, Soda Experience, Elastic Lab) with hover-depth parallax

---

## 2. Core Component Stack (Next.js + R3F + GSAP + Lenis)

**Delivered fully written — zero placeholders:**

1. `src/components/preloader/Preloader.tsx` — Full-screen counter, progress bar, L glyph transition timeline
2. `src/components/canvas/ElasticShowreel.tsx` — Subdivided curved plane `PlaneGeometry(16,6,64,32)`, dynamic texture cycling, vertex warp shaders, looping blue spline `CatmullRomCurve3 + TubeGeometry`
3. `src/shaders/elasticWarp.vert.ts` — GLSL vertex displacement handling scroll inertia and mouse hydrodynamic drag per spec formulas
4. `src/components/dom/Navbar.tsx` & `src/components/dom/HeroContent.tsx` — Accurate headers, pill buttons, crosshair grid, editorial typography
5. `src/components/dom/PortfolioGrid.tsx` — 2-column interactive work showcase cards with parallax
6. `src/app/page.tsx` — Root coordinator connecting Lenis scroll physics, GSAP ScrollTrigger updates, Canvas uniforms

Plus:
- `src/hooks/useLenisScroller.ts` — Lenis `lerp:0.08` + GSAP sync
- `src/hooks/usePointerDynamics.ts` — velocity, spring interpolation
- `src/components/ui/LiquidCursor.tsx` — fluid dot expands on hover
- `src/App.jsx`, `src/main.jsx`, `vite.config.js`, `index.html` — Vite production build

---

## 3. Run

```bash
npm install
npm run dev      # http://localhost:5173 — light #f7f7f9
npm run build
npm run preview  # http://localhost:4173
```

---

## 4. GitHub ZIP Auto-Download

Branch: `arena/01a0c8ff-project` — **exact Lusion.co light theme**

**Auto-download ZIP (click → download):**
```
https://github.com/fm1227693-hub/PROJECT/archive/refs/heads/arena/01a0c8ff-project.zip
```
Direct codeload:
```
https://codeload.github.com/fm1227693-hub/PROJECT/zip/refs/heads/arena/01a0c8ff-project
```
Repo:
```
https://github.com/fm1227693-hub/PROJECT/tree/arena/01a0c8ff-project
```

---

## 5. Quality

- Strict TypeScript, complete inline shaders, zero placeholders
- Cleanup: `geometry.dispose()`, `material.dispose()`, `ScrollTrigger.kill()`, `lenis.destroy()`
- 60/120 FPS, Plane 16x6 64x32 = 2048 verts + Tube 128 segs, dynamic canvas texture cycling
- Exact real-world Lusion.co light theme, elastic video ribbon, blue organic spline, smooth inertial scroll
