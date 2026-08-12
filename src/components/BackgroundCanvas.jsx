import React, { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracker
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 220,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    // Click Ripple Effect Array
    const ripples = [];
    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 160 + Math.random() * 80,
        alpha: 0.6,
        color: e.clientY % 2 === 0 ? 'rgba(225, 29, 72, ' : 'rgba(244, 63, 94, ',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const colors = [
      'rgba(225, 29, 72, ',   // Crimson Red
      'rgba(244, 63, 94, ',   // Rose Pink
      'rgba(251, 113, 133, ',  // Bright Rose
      'rgba(245, 158, 11, ',  // Amber Accent
      'rgba(239, 68, 68, ',   // Ruby
    ];

    // Particle nodes
    const particleCount = Math.min(Math.floor((width * height) / 16000), 65);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.8 + 1,
        baseAlpha: Math.random() * 0.45 + 0.15,
        alpha: Math.random() * 0.45 + 0.15,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.025 + 0.008,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    // Shooting Stars / Meteors
    const meteors = [];
    const createMeteor = () => {
      meteors.push({
        x: Math.random() * width * 1.2 - width * 0.1,
        y: -50,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 6 + 4,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg
        alpha: 0.8,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // Periodically spawn meteors
    const meteorInterval = setInterval(() => {
      if (meteors.length < 3 && Math.random() > 0.3) {
        createMeteor();
      }
    }, 2800);

    // Floating 3D Geometric Poly Shapes
    const polyCount = 7;
    const polys = [];
    for (let i = 0; i < polyCount; i++) {
      polys.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 70 + 35,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.006,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        sides: Math.floor(Math.random() * 3) + 5,
        colorPrefix: colors[i % colors.length],
      });
    }

    const render = () => {
      // Smooth mouse follow interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Render Interactive Click Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3.5;
        r.alpha -= 0.012;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = r.color + r.alpha + ')';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(225, 29, 72, 0.5)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Interactive Mouse Glow Spotlight
      const mouseGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        mouse.radius * 1.6
      );
      mouseGlow.addColorStop(0, 'rgba(225, 29, 72, 0.16)');
      mouseGlow.addColorStop(0.5, 'rgba(244, 63, 94, 0.05)');
      mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mouseGlow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Render Shooting Stars (Meteors)
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.005;

        if (m.y > height + 100 || m.x > width + 100 || m.alpha <= 0) {
          meteors.splice(i, 1);
          continue;
        }

        const headX = m.x;
        const headY = m.y;
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        meteorGrad.addColorStop(0, 'rgba(225, 29, 72, 0)');
        meteorGrad.addColorStop(0.7, m.colorPrefix + (m.alpha * 0.6) + ')');
        meteorGrad.addColorStop(1, 'rgba(255, 255, 255, ' + m.alpha + ')');

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.8)';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.restore();
      }

      // Render Floating Polygons
      polys.forEach((poly) => {
        poly.x += poly.vx;
        poly.y += poly.vy;
        poly.rotation += poly.vRot;

        if (poly.x < -100) poly.x = width + 100;
        if (poly.x > width + 100) poly.x = -100;
        if (poly.y < -100) poly.y = height + 100;
        if (poly.y > height + 100) poly.y = -100;

        ctx.save();
        ctx.translate(poly.x, poly.y);
        ctx.rotate(poly.rotation);
        ctx.beginPath();
        for (let i = 0; i < poly.sides; i++) {
          const angle = (i * 2 * Math.PI) / poly.sides;
          const px = Math.cos(angle) * poly.size;
          const py = Math.sin(angle) * poly.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = poly.colorPrefix + '0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = poly.colorPrefix + '0.02)';
        ctx.fill();
        ctx.restore();
      });

      // Render Particles and Constellation Connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        p1.pulseAngle += p1.pulseSpeed;
        p1.alpha = p1.baseAlpha + Math.sin(p1.pulseAngle) * 0.18;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.colorPrefix + p1.alpha + ')';
        ctx.shadowColor = 'rgba(225, 29, 72, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const lineAlpha = (1 - dist / 140) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(225, 29, 72, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }

        // Connect particles to mouse if close
        const dxMouse = p1.x - mouse.x;
        const dyMouse = p1.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < mouse.radius) {
          const mouseLineAlpha = (1 - distMouse / mouse.radius) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(244, 63, 94, ${mouseLineAlpha})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(meteorInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-90 transition-opacity duration-700"
    />
  );
}
