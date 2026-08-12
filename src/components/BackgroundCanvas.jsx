import React, { useEffect, useState } from 'react';

export default function BackgroundCanvas() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Telefonni aniqlash
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    let animationFrameId;
    
    // Yengil sichqoncha kuzatuvchi (Faqat kompyuterda ishlaydi)
    const handleMouseMove = (e) => {
      if (window.innerWidth < 768) return; // Telefonda batareya va protsessorni tejash uchun
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030712]">
      
      {/* Interactive premium mouse glow (Faqat kompyuterda ko'rinadi) */}
      {!isMobile && (
        <div 
          className="absolute w-[800px] h-[800px] opacity-40 transition-transform duration-[800ms] ease-out will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(225,29,72,0.12) 0%, rgba(244,63,94,0.04) 40%, rgba(0,0,0,0) 70%)',
            transform: `translate(${mousePos.x - 400}px, ${mousePos.y - 400}px)`,
          }}
        />
      )}
      
      {/* Ambient floating mesh orbs - 
          Telefonda qotishni (lag) yo'q qilish uchun CSS blur() o'rniga radial-gradient ishlatildi. 
          Mix-blend-mode ham olib tashlandi, chunki u mobil GPU ni eng ko'p qiynaydi. */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[150vw] md:w-[70vw] h-[150vw] md:h-[70vw] animate-aurora-1"
        style={{ background: 'radial-gradient(circle, rgba(225,29,72,0.07) 0%, rgba(0,0,0,0) 60%)' }}
      />
      <div 
        className="absolute bottom-[-20%] right-[-10%] w-[150vw] md:w-[80vw] h-[150vw] md:h-[80vw] animate-aurora-2"
        style={{ background: 'radial-gradient(circle, rgba(190,18,60,0.05) 0%, rgba(0,0,0,0) 60%)' }}
      />
      
      {/* Static elegant dot pattern background (Ultra lightweight) */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+CjxyZWN0IHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0idHJhbnNwYXJlbnQiLz4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjAuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA2KSIvPgo8L3N2Zz4=')] opacity-70" />
    </div>
  );
}
