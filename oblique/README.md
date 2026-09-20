# Oblique — studio website

A single-page, art-directed website for **Oblique**, a fictional independent design & engineering studio (Lisbon · Berlin). Built from zero with React, Tailwind CSS v4, GSAP (ScrollTrigger, ScrollSmoother, SplitText) and a small, lazy-loaded three.js object.

The design language — oversized editorial typography, extreme whitespace, broken grids, floating elements, scroll-driven narrative, a controlled palette and a single vermilion accent — is original; no third-party branding, copy, layouts or assets are used.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle in dist/
npm run preview   # serve the production bundle
npm run lint
```

Requires Node 20+.

## Stack

| Layer      | Choice                                                                            |
| ---------- | --------------------------------------------------------------------------------- |
| UI         | React 19 (JavaScript), Vite 8                                                     |
| Styling    | Tailwind CSS v4 (`@theme` tokens in `src/styles/index.css`)                       |
| Motion     | GSAP 3.15 — ScrollTrigger, ScrollSmoother, SplitText, `@gsap/react`               |
| 3D         | three.js (one custom-shader object, code-split and mounted only when near view)   |
| Type       | Geist Variable + Geist Mono Variable (self-hosted via Fontsource)                 |

No UI kit, no animation helper libraries, no state management.

## Structure

```
src/
├── animations/        reusable GSAP building blocks
│   ├── heroAnimations.js     hero entrance + scroll transformation
│   ├── scrollAnimations.js   line/word reveals, parallax, image reveal, themes, horizontal scroll
│   └── hoverAnimations.js    magnetic, tilt, cursor follower
├── components/        presentational + behavioural components
│   ├── Navbar, CustomCursor, MagneticButton, FloatingVisual, EditorialText,
│   ├── ImageReveal, Section, ScrollSection (pinned stage), Clock, Logo, Footer
│   └── three/         BlobScene.js (vanilla three) + BlobCanvas.jsx (lazy wrapper)
├── sections/          one file per page section (Hero, Intro, Showcase, Typography,
│                      Visual, Interactive, FinalCTA, Footer)
├── context/           SmoothScrollProvider — owns ScrollSmoother, readiness gate
├── hooks/             useMediaQuery, useMouseParallax
├── lib/               gsap registration, device capabilities, shared pointer store
├── data/              all copy and project data
└── styles/            Tailwind + design tokens + global rules
```

## How the motion system is organised

- **Readiness gate.** `SmoothScrollProvider` waits for fonts, creates the ScrollSmoother (desktop, non-reduced-motion only) and _then_ mounts the page, so every ScrollTrigger is registered after the smoother.
- **Section themes.** Each section carries `data-theme` (`light`, `bone`, `dark`, `signal`). A ScrollTrigger per section sets the theme on `<html>`; the body eases its colours in CSS, so section changes are colour transitions rather than hard cuts.
- **Transform layering.** Floating elements have separate wrappers for scroll motion, pointer parallax, entrance animation and static rotation, so tweens never fight over the same transform.
- **Transforms & opacity only.** Nothing animates width/height/top/left. The immersive image expands with a scale + counter-scale pair; the horizontal gallery moves with `x`; parallax uses `y`.
- **Desktop-only cursor / pointer effects.** Enabled only for `(hover: hover) and (pointer: fine)` and never with `prefers-reduced-motion`. Touch devices get native scrolling, simpler parallax and no cursor.
- **Reduced motion.** Entrance animations, pins, smoothing and the 3D loop are disabled; the gallery falls back to the vertical layout; everything stays readable.
- **Cleanup.** All GSAP work lives inside `useGSAP` contexts (auto-reverted on unmount); listeners, observers and the WebGL context are disposed explicitly.

## Responsive art direction

- **≥ 1024 px** — full composition: floating collage, pinned horizontal gallery, pinned image expansion, cursor-following previews, fanned note cards.
- **640 – 1023 px** — tablet: hero collage becomes a centred cluster, gallery and process stack vertically, notes scroll horizontally.
- **320 – 639 px** — mobile: display type at 15 vw, offset vertical gallery, native horizontal card scroller, full-screen menu.

## Images

`public/images/` holds optimised WebP artwork (≤ 1376 px, plus 640 px `-sm` variants used through `srcset`). The imagery was generated for this project and is used purely as placeholder art direction.
