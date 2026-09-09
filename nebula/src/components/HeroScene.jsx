'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import * as THREE from 'three';
import { scrollProgress } from '@/lib/scroll';
import { subscribePointer } from '@/lib/pointer';
import { whenBooted } from '@/lib/boot';
import { isFinePointer, isReducedMotion } from '@/lib/motion';

/**
 * HeroScene — the site's only WebGL scene.
 *
 * A faceted core inside a wire shell, an accretion ring and a sparse particle
 * halo, lit by one warm key light. It idles on its own, answers the pointer,
 * and reads scroll depth from the shared scroll bus — never from React.
 *
 * Performance contract
 *  - one renderer, one RAF, DPR capped (2 desktop / 1.4 mobile)
 *  - nothing renders before the curtain lifts, or while offscreen / hidden
 *  - particle count and subdivision drop on small or coarse-pointer devices
 *  - geometry, materials and the GL context are disposed on unmount
 *  - reduced motion or no WebGL → one still frame, zero JS cost
 */
export default function HeroScene({ className = '' }) {
  const mountRef = useRef(null);
  const [mode, setMode] = useState('canvas');

  // Reduced motion is decided after hydration so the server markup matches.
  useEffect(() => {
    if (isReducedMotion()) setMode('still');
  }, []);

  useEffect(() => {
    if (mode !== 'canvas') return undefined;
    const mount = mountRef.current;
    if (!mount) return undefined;

    const fine = isFinePointer();
    const isSmall = window.innerWidth < 768 || !fine;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSmall,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setMode('still');
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.4 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
    camera.position.set(0, 0, 8);

    const world = new THREE.Group();
    world.rotation.z = -0.18;
    scene.add(world);

    const accent = new THREE.Color('#c8703a');
    const pale = new THREE.Color('#d8d5cd');

    /* Core — low-poly faceted body */
    const coreGeo = new THREE.IcosahedronGeometry(2.05, isSmall ? 1 : 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0b0b0e'),
      emissive: new THREE.Color('#120a05'),
      emissiveIntensity: 1,
      metalness: 0.94,
      roughness: 0.28,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    world.add(core);

    /* Wire shell — additive, breathes against the core */
    const baseShell = new THREE.IcosahedronGeometry(2.62, 1);
    const shellGeo = new THREE.WireframeGeometry(baseShell);
    baseShell.dispose();
    const shellMat = new THREE.LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shell = new THREE.LineSegments(shellGeo, shellMat);
    world.add(shell);

    /* Accretion rings — two thin tori on different axes, ~800 tris total */
    const ringGeo = new THREE.TorusGeometry(3.45, 0.0075, 3, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: pale,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ringA = new THREE.Mesh(ringGeo, ringMat);
    ringA.rotation.set(Math.PI / 2.1, 0.2, 0);
    const ringB = new THREE.Mesh(ringGeo, ringMat);
    ringB.rotation.set(Math.PI / 1.75, -0.55, 0.35);
    ringB.scale.setScalar(1.16);
    world.add(ringA, ringB);

    /* Particle halo — desktop 980, mobile 360 */
    const COUNT = isSmall ? 360 : 980;
    const positions = new Float32Array(COUNT * 3);
    const scales = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i += 1) {
      const a = Math.random() * Math.PI * 2;
      const r = 3.1 + Math.pow(Math.random(), 0.65) * 4.2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * r * 0.55;
      positions[i * 3 + 2] = Math.sin(a) * r * 0.7 + (Math.random() - 0.5) * 1.6;
      scales[i] = 0.4 + Math.random() * 0.6;
    }
    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ptsGeo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    const ptsMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: isSmall ? 24 : 33 },
        uOpacity: { value: isSmall ? 0.5 : 0.6 },
        uColorA: { value: pale },
        uColorB: { value: accent },
        uDpr: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: `
        attribute float aScale;
        uniform float uTime;
        uniform float uSize;
        uniform float uDpr;
        varying float vFade;
        void main() {
          vec3 p = position;
          float ang = uTime * 0.055;
          float c = cos(ang), s = sin(ang);
          p.xz = mat2(c, -s, s, c) * p.xz;
          p.y += sin(uTime * 0.5 + p.x * 0.35) * 0.16;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * aScale * uDpr / max(0.001, -mv.z);
          vFade = 0.35 + 0.65 * aScale;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uOpacity;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.05, d);
          vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.5, d));
          gl_FragColor = vec4(col, a * vFade * uOpacity);
        }
      `,
    });
    const points = new THREE.Points(ptsGeo, ptsMat);
    world.add(points);

    /* Lights */
    const key = new THREE.DirectionalLight(0xffd9b8, 1.6);
    key.position.set(4, 3.4, 5);
    const rim = new THREE.DirectionalLight(0x8f9bb0, 1.8);
    rim.position.set(-5, -1.6, -3.4);
    scene.add(key, rim, new THREE.AmbientLight(0x0e0e12, 1.2));

    /* Sizing — measured from the mount, never from viewport state in React */
    const resize = () => {
      const rect = mount.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* Pointer parallax — rides the shared bus, no extra listener */
    const spin = { x: 0, y: 0 };
    const pxTo = gsap.quickTo(spin, 'y', { duration: 1.2, ease: 'power3.out' });
    const pyTo = gsap.quickTo(spin, 'x', { duration: 1.2, ease: 'power3.out' });
    const offPointer = isSmall
      ? () => {}
      : subscribePointer((p) => {
          pxTo(p.nx * 0.3);
          pyTo(p.ny * 0.2);
        });

    /* Render only while visible — and never before the curtain lifts. The loop
       switches itself off completely when the hero leaves the screen, so the
       rest of the page costs zero GPU frames. */
    let onScreen = true;
    let running = false;
    let intro = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) wake();
      },
      { threshold: 0 }
    );
    io.observe(mount);
    let tabVisible = !document.hidden;
    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) wake();
    };
    document.addEventListener('visibilitychange', onVisibility);

    /* One RAF loop with a hand-rolled clock (THREE.Clock is deprecated) */
    let elapsed = 0;
    let last = performance.now();
    let raf = 0;
    const render = () => {
      if (!onScreen || !tabVisible || !running) {
        raf = 0;
        return;
      }
      const now = performance.now();
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;

      elapsed += delta;
      const t = elapsed;
      const p = scrollProgress();
      const easeIn = 0.84 + 0.16 * intro;

      ptsMat.uniforms.uTime.value = t;
      ptsMat.uniforms.uOpacity.value = (isSmall ? 0.5 : 0.6) * intro;

      core.rotation.y = t * 0.13 + p * 1.25 + spin.y;
      core.rotation.x = Math.sin(t * 0.22) * 0.12 + p * 0.42 + spin.x;
      shell.rotation.y = -t * 0.085 - p * 0.85 - spin.y * 0.6;
      shell.rotation.z = t * 0.05;
      ringA.rotation.z = t * 0.06;
      ringB.rotation.z = -t * 0.045;

      core.scale.setScalar(easeIn * (1 + Math.sin(t * 0.7) * 0.018));
      shell.scale.setScalar(easeIn * (1 + Math.sin(t * 0.5 + 1) * 0.028));
      ringA.scale.setScalar(easeIn);
      ringB.scale.setScalar(easeIn * 1.16);
      world.position.y = Math.sin(t * 0.4) * 0.1;
      coreMat.emissiveIntensity = 0.7 + Math.sin(t * 0.9) * 0.25 + p * 0.5;

      // Depth: the world travels toward the viewer as the page descends.
      world.position.z = -1.2 + p * 3.2;
      camera.position.x = p * 1.15 + spin.x * 0.4;
      camera.position.y = -p * 0.95 + spin.y * 0.2;
      world.scale.setScalar(1 + p * 0.2);
      shellMat.opacity = (0.28 + Math.sin(t * 0.9) * 0.06 + p * 0.18) * intro;
      ringMat.opacity = (0.22 + p * 0.16) * intro;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    const wake = () => {
      if (raf || !onScreen || !tabVisible || !running) return;
      last = performance.now();
      raf = requestAnimationFrame(render);
    };
    wake();

    const introState = { v: 0 };
    let introTween = null;
    const cancelBoot = whenBooted(() => {
      running = true;
      wake();
      introTween = gsap.to(introState, {
        v: 1,
        duration: 1.9,
        ease: 'power2.out',
        onUpdate: () => {
          intro = introState.v;
        },
      });
    });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      cancelBoot();
      introTween?.kill();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      offPointer();
      pxTo.tween?.kill();
      pyTo.tween?.kill();
      coreGeo.dispose();
      coreMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ptsGeo.dispose();
      ptsMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.parentNode?.removeChild(renderer.domElement);
    };
  }, [mode]);

  if (mode !== 'canvas') {
    return (
      <div ref={mountRef} className={`relative flex items-center justify-center ${className}`.trim()}>
        <div
          aria-hidden="true"
          className="absolute inset-[16%] rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(200,112,58,0.18), transparent 65%)',
          }}
        />
        <Image
          src="/media/hero.jpg"
          alt=""
          width={1408}
          height={768}
          priority
          quality={72}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="hero-still relative h-full w-full object-contain opacity-90 mix-blend-screen"
        />
      </div>
    );
  }

  return <div ref={mountRef} className={className} />;
}
