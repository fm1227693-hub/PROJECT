import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Mobil qurilmalarda kursor effektini o'chirish uchun
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-[50px] h-[50px] border-[1px] border-white/70 rounded-full pointer-events-none z-[99999]"
        animate={{
          x: mousePosition.x - 25,
          y: mousePosition.y - 25,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.1,
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-[7px] h-[7px] border-[2px] border-white bg-transparent rounded-full pointer-events-none z-[99999]"
        animate={{
          x: mousePosition.x - 3.5,
          y: mousePosition.y - 3.5,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 1200,
          damping: 40,
          mass: 0.1,
        }}
      />
    </>
  );
}
