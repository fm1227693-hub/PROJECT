import React, { useEffect, useState } from 'react';

export default function BackgroundCanvas() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    let animationFrameId;
    
    // Use requestAnimationFrame for incredibly smooth, non-blocking state updates
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030712]">
      {/* Interactive premium mouse glow */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[100px] opacity-25 transition-transform duration-[800ms] ease-out will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(225,29,72,0.8) 0%, rgba(244,63,94,0.3) 30%, rgba(0,0,0,0) 70%)',
          transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
        }}
      />
      
      {/* Ambient floating mesh orbs (Pure CSS, GPU accelerated) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-600/15 blur-[120px] animate-aurora-1 mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-red-700/10 blur-[150px] animate-aurora-2 mix-blend-screen" />
      <div className="absolute top-[30%] left-[60%] w-[40vw] h-[40vw] rounded-full bg-pink-500/10 blur-[120px] animate-float-orb mix-blend-screen" />
      
      {/* Static elegant dot pattern background (Ultra lightweight) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+CjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjE1KSIvPgo8L3N2Zz4=')] opacity-60 mix-blend-overlay" />
    </div>
  );
}
