# LUSION — 1:1 Fidelity Recreation | WebGL Fluid Lab

> Principal Creative Technologist & Lead WebGL Graphics Programmer — matching Lusion.co, Edan Kwan, Active Theory standards.

**Live Stack:** React 19 + Vite + R3F + Drei + Three.js + GSAP + Lenis + Postprocessing

This is a complete from-scratch recreation of the iconic [Lusion.co](https://lusion.co) experience featuring:
- Organic jelly-like fluid physics
- Hyper-realistic refractive dispersion glass
- Curl-noise reactive particle ribbons
- Magnetic cursor interactions
- Viscous inertial scrolling

---

## 1. Mathematical & Visual Specifications (Lusion Signature)

### Organic Fluid Mesh & Raymarching Vertex Noise
- Base Mesh: `IcosahedronGeometry(2.2, 64)`
- GLSL Noise: `vec3 newPosition = position + normal * (snoise(vec4(position * 1.5, uTime * 0.8)) * 0.45);`
- Mouse Hydrodynamic: Raycast cursor onto plane z=0, exponential falloff repulsion:
```glsl
float dist = length(vWorldPosition.xy - uMousePos.xy);
float impulse = smoothstep(2.5, 0.0, dist) * uMouseVelocity;
newPosition += normal * impulse * 0.6;
```

### Material Science
- `roughness: 0.04` liquid gloss
- `metalness: 0.1`
- `transmission: 0.98`
- `ior: 1.52`
- `thickness: 2.4`
- `chromaticAberration / dispersion: 0.08` rainbow fringes
- Iridescent thin-film: violet `#7928ca`, cyan `#00f0ff`, amber

### Flowing Ribbon / GPGPU Curl-Noise
- 6,000 points orbiting central fluid
- Dynamic curl-noise vector field for turbulence
- Accelerate when cursor cuts through, decelerate back into vortex

### Post-Processing
- Depth-of-Field bokeh (shallow focus)
- Selective Bloom `luminanceThreshold: 0.85, intensity: 1.2`
- Film grain `alpha: 0.04`

---

## 2. File Tree (Complete)

```
├── package.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── LusionCanvas.tsx (R3F Canvas, Camera, Post-processing)
│   │   │   ├── OrganicLiquidMesh.tsx (Deformed mesh + GLSL + Raycasting)
│   │   │   ├── FluidRibbons.tsx (Curl-noise GPGPU particle trails)
│   │   │   └── LightingCaustics.tsx (Multi-point studio lighting & HDR)
│   │   ├── dom/
│   │   │   ├── Navigation.tsx (Minimal brandmark, sound toggle, menu)
│   │   │   ├── HeroTypography.tsx (Mask-reveal GSAP scrub)
│   │   │   ├── ProjectCardShowcase.tsx (3D depth tilt)
│   │   │   └── InteractiveCursor.tsx (Elastic magnetic follower)
│   ├── hooks/
│   │   ├── useLenisScroll.ts (Viscous smooth-scroll)
│   │   └── usePointerPhysics.ts (Mouse speed, accel, inertia)
│   └── shaders/
│       ├── fluidNoise.vert.glsl
│       └── dispersion.frag.glsl
```

Also provided as `.jsx/.js` for Vite compatibility.

---

## 3. Interaction & Scroll Choreography (GSAP & Lenis)

- Lenis: `lerp: 0.055, wheelMultiplier: 0.85, infinite: false`
- GSAP ScrollTrigger synced on Lenis scroll tick

**Phases:**
- **Phase 1 (0-25%)**: Fluid breathes center, title *"WE CRAFT SENSORY DIGITAL EXPERIENCES"* mask stagger
- **Phase 2 (25-50%)**: Elongates & shears along scroll vector, morphs into glass prism, camera glides 45°
- **Phase 3 (50-75%)**: Ribbons explode outwards swirling borders, project titles spring dampening
- **Phase 4 (75-100%)**: Condenses into glowing ring anchoring at footer

**DOM Micro:**
- Cursor liquid dot → ring on hover with `mix-blend-mode: difference`
- Magnetic text: spring `stiffness: 150, damping: 15`

---

## 4. Run

```bash
npm install
npm run dev
npm run build
```

Vite dev: `http://localhost:5173`

---

## 5. GitHub ZIP Auto-Download

Branch: `arena/01a0c8ff-project`

Direct ZIP link (auto downloads):
```
https://github.com/fm1227693-hub/PROJECT/archive/refs/heads/arena/01a0c8ff-project.zip
```

Or via gh CLI:
```bash
gh repo clone fm1227693-hub/PROJECT -- -b arena/01a0c8ff-project
```

---

## 6. Code Quality

- Strict cleanup: `geometry.dispose()`, `material.dispose()`, `cancelAnimationFrame()`
- 60-120 FPS target
- Full GLSL math inline, no pseudocode
- TypeScript compatible

Built by Principal Creative Technologist — Lusion-grade standards.
