# Formwork — studio website

An original, art-directed single-page site for **Formwork**, a fictional design & engineering
studio (Amsterdam · Tashkent). Built from zero with React, Tailwind CSS v4, GSAP + ScrollTrigger
and one small, lazily loaded three.js object.

> Design language only (enormous type, extreme whitespace, editorial asymmetry, floating
> elements, scroll-driven motion, premium minimalism) is inspired by contemporary editorial
> sites. No third-party branding, copy, layouts or assets are reused.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
npm run lint
```

Node 20+ recommended. Fonts are self-hosted through Fontsource, so there are no runtime
requests to third-party font CDNs.

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| UI | React 19 + Vite 8 | JavaScript, no TypeScript by brief |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | design tokens in `src/styles/index.css` via `@theme` |
| Motion | GSAP 3.15 + ScrollTrigger, ScrollSmoother, SplitText | registered once in `src/lib/gsap.js` |
| 3D | three.js (code-split, idle-loaded) | one chrome object in the hero; CSS disc fallback |
| Type | Instrument Sans Variable + Instrument Serif Italic | Fontsource, latin subsets only |

## The page

Eight sections, each with its own art direction:

1. **Hero** — oversized three-line headline with floating object, motion-token card, chrome
   3D object and status chips. On desktop the stage pins and the whole composition transforms
   continuously with scroll (headline shrinks and parks, floaters drift on depth, the next
   section slides over it). Colour theme crossfades paper → bone mid-way.
2. **Approach** — large statement whose words ink in as you scroll, with a parallax image,
   a studio note and a frame-budget panel floating around the copy.
3. **Selected work** — editorial list. Desktop: hovering a row summons a floating preview
   image that follows the pointer and a "View" cursor label; siblings dim. Touch: stacked,
   offset image cards.
4. **Principles** — pinned horizontal typography: one giant line alternating sans and serif
   italic with image chips, scrubbed by scroll. Mobile stacks the lines with per-line reveals.
5. **Craft** — immersive image: a framed card that expands to full bleed while a caption
   crossfades in, with parallax inside the mask.
6. **Capabilities** — five cards that stack and pin one over the other as you scroll, each
   with its own tone, visual and index; the previous card scales back as the next arrives.
7. **Studio** — strip with live local clocks for both cities and open roles.
8. **Contact** — cobalt climax: huge "Let's do it on purpose." line, magnetic CTA, then a
   minimal editorial footer on the same ground.

Site-wide: minimal navbar that turns into a compact blurred pill after ~80 px of scroll;
theme-aware colours through CSS variables (`html[data-theme]` is switched by ScrollTrigger
at the viewport midline, so sections blend instead of hard-cutting); magnetic buttons;
line/flip hover micro-interactions; optional custom cursor with hover/label states.

## Architecture

```
src/
  main.jsx, App.jsx           entry and page composition
  styles/index.css            tokens, base, component classes (Tailwind v4 @theme / @layer)
  data/content.js             every string on the page — copy lives in one place
  lib/
    gsap.js                   plugin registration + defaults
    device.js                 capability detection (touch, reduced motion, WebGL quality)
    pointer.js                one shared pointer stream (rAF-throttled) for cursor/parallax/3D
  context/
    SmoothScrollProvider.jsx  readiness gate (fonts) + ScrollSmoother owner + scrollTo()
    scroll.js                 context + useScroll()/useCaps()
  hooks/
    useGsap.js                gsap.context() with automatic cleanup on unmount
    useMediaQuery.js          SSR-safe matchMedia subscription
    useMouseParallax.js       pointer-driven depth for floating elements (desktop only)
  animations/
    heroAnimations.js         hero intro + scroll transformation timeline
    scrollAnimations.js       reveal, word-highlight, parallax, theme switching, pin helpers
    hoverAnimations.js        magnetic, follower preview, cursor label
  components/                 Navbar, Footer, Section, Label, EditorialText, ImageReveal,
                              FloatingVisual, MagneticButton, CustomCursor, Clock, Logo, icons,
                              three/ObjectCanvas.jsx + three/ObjectScene.js
  sections/                   HeroSection, IntroSection, ShowcaseSection, TypographySection,
                              VisualSection, InteractiveSection, StudioSection, FinalCTA,
                              FooterSection
```

## Performance & motion budget

- Only `transform` and `opacity` are animated; blurs and filters are static.
- Every timeline, ScrollTrigger, SplitText, listener and rAF loop is created inside
  `gsap.context()` (via `useGsap`) or an effect with a matching cleanup.
- three.js is dynamically imported during idle time, renders only while on screen, is parked
  when the hero fades out, is skipped entirely on software GL (SwiftShader/llvmpipe), and
  disposes geometry/material/renderer on unmount. On touch and reduced motion it renders
  on demand instead of looping.
- Images are WebP with explicit dimensions (no layout shift), `sizes` hints where they scale, and lazy-loaded below the fold; the hero object is `fetchpriority="high"`.
- Fonts are awaited (explicit `document.fonts.load`) before anything is measured, so pins and
  horizontal tracks are computed against final metrics; a `loadingdone` listener refreshes
  ScrollTrigger as a safety net.
- Production build (gzip): app ~19 kB, GSAP ~52 kB, React ~68 kB, three.js ~133 kB (lazy).

## Responsiveness

The mobile layout is designed separately, not scaled down: the hero becomes a collage of the
floaters under the headline, the work list becomes offset image cards, principles stack,
capabilities become a vertical card sequence with their visuals, and every pinned/scrubbed
scene has a lighter unpinned counterpart. Tested at 320, 390, 430, 768, 1280, 1440 and 1920 px.

## Accessibility

Semantic landmarks and heading order, labelled sections, skip link, visible `:focus-visible`
rings, keyboard-operable menu (focus moves in, `Esc` closes, focus returns), no cursor
simulation on touch, decorative visuals `aria-hidden`, and `prefers-reduced-motion` honoured
at three levels: an inline class before first paint, capability flags that disable pins,
smoothing, parallax and the custom cursor, and CSS overrides for the remaining transitions.
