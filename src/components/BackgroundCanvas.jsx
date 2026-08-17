import React, { useEffect, useRef } from "react";

export default function BackgroundCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const x = e.clientX;
      const y = e.clientY;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{
        "--mouse-x": "50vw",
        "--mouse-y": "50vh",
      }}
    >
      {/* 1. Hardware Accelerated Glowing Orbs (GPU Layer) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-gradient-to-br from-red-600/15 via-rose-600/10 to-transparent blur-[120px] animate-pulse [animation-duration:8s] [will-change:transform]" />
      
      <div className="absolute bottom-[-10%] right-[-5%] w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full bg-gradient-to-tr from-rose-700/15 via-amber-600/10 to-transparent blur-[140px] animate-pulse [animation-duration:12s] [will-change:transform]" />
      
      <div className="absolute top-[35%] right-[20%] w-[350px] h-[350px] rounded-full bg-gradient-to-l from-red-500/10 to-transparent blur-[100px] animate-pulse [animation-duration:10s] [will-change:transform]" />

      {/* 2. Interactive Mouse Glow (GPU Composited via CSS Variables) */}
      <div
        className="absolute w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-600/12 via-rose-500/8 to-transparent blur-[90px] transition-transform duration-300 ease-out [will-change:transform]"
        style={{
          left: "var(--mouse-x)",
          top: "var(--mouse-y)",
        }}
      />

      {/* 3. Subtle Futuristic Cyber Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(rgba(225, 29, 72, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />
    </div>
  );
}
