/* =====================================================================
   MAIN
   Boot sequence, the single animation loop, and global lifecycle.

   One rAF (GSAP's ticker) drives everything: Lenis → ScrollTrigger → page
   systems → state damping → WebGL → 2D canvases → perf governor. There is
   no second loop anywhere in the codebase.
   ===================================================================== */
import { gsap, ScrollTrigger, VENDOR_OK } from './core/vendor.js';
import { state, bus, setPointer, updateState } from './core/state.js';
import { DEVICE, SECTION_ORDER } from './core/config.js';
import { scroll } from './core/scroll.js';
import { cursor } from './core/cursor.js';
import { createLoader } from './core/loader.js';
import { perf } from './core/perf.js';
import { initWorld, renderFrame, resizeWorld, pauseWorld, setTier, warmUp, world } from './core/scene.js';
import { anim } from './components/generative.js';
import { magnetic } from './components/magnetic.js';
import { chrome } from './components/chrome.js';
import { setRevealGate } from './components/textReveal.js';
import { router } from './core/router.js';
import { byId, qsa, debounce } from './core/utils.js';

/* ------------------------------------------------------------- reveal gate */
let gateOpen = false;
const gateQueue = [];
setRevealGate(fn => { if (gateOpen) fn(); else gateQueue.push(fn); });

function releaseGate() {
  gateOpen = true;
  gateQueue.forEach((fn, i) => setTimeout(fn, i * 65));
  gateQueue.length = 0;
}

/* --------------------------------------------------------- static fallback */
function staticFallback(reason) {
  console.warn('[lusion] degraded mode:', reason);
  document.documentElement.classList.add('no-gl');
  document.body.classList.add('no-gl');
  const pl = byId('preloader');
  if (pl && pl.parentNode) pl.parentNode.removeChild(pl);
  if (!document.querySelector('.page.active')) {
    const first = document.querySelector('.page');
    if (first) first.classList.add('active');
  }
  qsa('[data-reveal], .reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = 'none';
    el.style.clipPath = 'none';
  });
  const fps = byId('fpsBadge');
  if (fps) fps.textContent = 'static';
  document.documentElement.classList.remove('booting');
}

/* ---------------------------------------------------------------- main loop */
let mainTick = null;

function installLoop() {
  if (mainTick) return;

  mainTick = (time, dtMs) => {
    const dt = Math.min(0.05, Math.max(0.0005, dtMs / 1000));

    /* 1. global visual state (damped world fields, pointer, camera) */
    updateState(dt);
    if (state.route !== '/') state.page.pageProgress = state.scrollProgress;

    /* 2. performance governor — measured, never faked */
    perf.update(dt);

    /* 3. the WebGL world */
    if (world.ready && !world.paused) renderFrame(dt);

    /* 4. 2D generative canvases (only the visible ones) */
    anim.tick(time, dt);

    /* 5. page systems (reel timecode, preview tilt, orb energy …) */
    router.tick(dt);
  };

  gsap.ticker.add(mainTick);
}

/** keep the render step last in the ticker queue so pages write state first */
function promoteLoop() {
  if (!mainTick) return;
  gsap.ticker.remove(mainTick);
  gsap.ticker.add(mainTick);
}

/* ------------------------------------------------------------------- boot */
async function boot() {
  const loader = createLoader();

  /* words cycle while real work happens */
  const words = qsa('#plWords span');
  let wordTween = null;
  if (words.length > 1) {
    const tl = gsap.timeline({ repeat: -1 });
    for (let i = 1; i <= words.length; i++) {
      tl.to(words, { y: -(i % words.length) * 1.35 + 'em', duration: 0.6, ease: 'power3.inOut' })
        .to({}, { duration: 0.8 });
    }
    wordTween = tl;
  }

  /* 1 — typefaces (measured against the real FontFaceSet) */
  loader.task('typefaces', 10, async () => {
    if (!document.fonts || !document.fonts.ready) return;
    await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2600))]);
  });

  /* 2 — WebGL engine: renderer, IBL, materials, atmosphere, post chain */
  loader.task('webgl engine', 26, async () => {
    if (!DEVICE.webgl) throw new Error('webgl-unavailable');
    await initWorld(byId('gl'), (name, msg) => loader.stage(msg || name));
  });

  /* 3 — motion stack + first route (Lenis, ScrollTrigger, page systems) */
  loader.task('motion + route', 16, async () => {
    scroll.init();
    router.init();
  });

  /* 4 — shader compile: real frames, reported honestly */
  loader.task('shader compile', 18, async progress => {
    installLoop();
    await warmUp(3, progress);
  });

  /* 5 — layout: measure everything once fonts and DOM art exist */
  loader.task('layout + scroll', 14, async () => {
    anim.init();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    ScrollTrigger.refresh();
    scroll.refresh();
  });

  /* 6 — interaction layer */
  loader.task('interaction', 16, async () => {
    cursor.init();
    magnetic.init();
    chrome.init();
    perf.init();
    bindGlobals();
  });

  await loader.run(950);

  if (!world.ready && DEVICE.webgl) {
    if (wordTween) wordTween.kill();
    staticFallback('world unavailable');
    return;
  }
  if (!DEVICE.webgl) {
    if (wordTween) wordTween.kill();
    staticFallback('webgl unavailable');
    return;
  }

  /* ---- reveal ---------------------------------------------------------- */
  document.documentElement.classList.remove('booting');
  await new Promise(resolve => loader.reveal(resolve));
  if (wordTween) wordTween.kill();
  releaseGate();
  promoteLoop();

  gsap.fromTo('#gl', { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' });
  bus.emit('ready');
}

/* --------------------------------------------------------------- globals */
function bindGlobals() {
  /* one pointer listener feeds cursor, state, magnetic field and the world */
  window.addEventListener('pointermove', e => setPointer(e.clientX, e.clientY), { passive: true });
  window.addEventListener('pointerdown', () => { state.mouse.down = true; });
  window.addEventListener('pointerup', () => { state.mouse.down = false; });

  /* resize: renderer, composer, Lenis and every ScrollTrigger */
  const onResize = debounce(() => {
    resizeWorld();
    scroll.resize();
    ScrollTrigger.refresh();
    anim.items.forEach(i => { i.st = {}; });
  }, 170);
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  /* stop burning GPU when the tab is hidden */
  document.addEventListener('visibilitychange', () => {
    const hidden = document.hidden;
    pauseWorld(hidden);
    anim.running = !hidden;
    if (!hidden) { ScrollTrigger.refresh(); promoteLoop(); }
  });

  /* page systems are (re)registered per route — keep the render step last */
  bus.on('route', () => promoteLoop());

  /* context loss recovery */
  const canvas = byId('gl');
  if (canvas) {
    canvas.addEventListener('webglcontextlost', e => {
      e.preventDefault();
      pauseWorld(true);
      document.body.classList.add('no-gl');
    });
    canvas.addEventListener('webglcontextrestored', () => {
      document.body.classList.remove('no-gl');
      pauseWorld(false);
      resizeWorld();
    });
  }

  /* Alt+1/2/3 forces a quality tier (handy for testing, harmless in prod) */
  window.addEventListener('keydown', e => {
    if (!e.altKey) return;
    if (e.key === '1') setTier(0);
    if (e.key === '2') setTier(1);
    if (e.key === '3') setTier(2);
  });

  if (DEVICE.touch) document.body.classList.add('touch');

  /* small, honest debug surface */
  window.LUSION = { state, world, router, scroll, anim, perf, setTier, sections: SECTION_ORDER };
}

/* ------------------------------------------------------------------ start */
if (!VENDOR_OK) {
  staticFallback('gsap / scrolltrigger / lenis unavailable');
} else {
  boot().catch(err => {
    console.error('[lusion] boot failed', err);
    staticFallback(err && err.message);
  });
}
