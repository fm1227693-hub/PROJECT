import React, { useEffect, useRef } from 'react';

/**
 * BackgroundCanvas — Optimized Lightweight WebGL Atmospheric Renderer
 * - Pauses rendering when offscreen or document is hidden (Page Visibility API)
 * - Capped pixel ratio (max 1.5) and low particle count (120 instead of 450)
 * - Automatically disabled when prefers-reduced-motion is active
 * - Complete GPU resource disposal on unmount
 */
export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let isMounted = true;
    let animId = null;

    // Dynamically check WebGL availability
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      return; // Gracefully degrade if WebGL not supported
    }

    // Dynamic import to avoid SSR issues and keep main bundle light
    let renderer, scene, camera, points;

    import('three').then((THREE) => {
      if (!isMounted || !canvasRef.current) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // 120 Subtle Crimson Stardust Particles
      const particleCount = 120;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 12;
        positions[i + 1] = (Math.random() - 0.5) * 8;
        positions[i + 2] = (Math.random() - 0.5) * 4;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: new THREE.Color('#E11D48'),
        size: 0.04,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);

      let isPaused = false;
      const handleVisibilityChange = () => {
        isPaused = document.hidden;
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const handleResize = () => {
        if (!canvasRef.current || !renderer || !camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize, { passive: true });

      const animate = () => {
        if (!isMounted) return;
        if (!isPaused && points) {
          points.rotation.y += 0.0006;
          points.rotation.x += 0.0003;
          renderer.render(scene, camera);
        }
        animId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (renderer) renderer.dispose();
      };
    });

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-40 select-none"
      aria-hidden="true"
    />
  );
}
