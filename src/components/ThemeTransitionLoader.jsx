import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ThemeTransitionLoader() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 700);
      return () => clearTimeout(timer);
    };

    window.addEventListener('trigger-theme-transition', handleTrigger);
    return () => {
      window.removeEventListener('trigger-theme-transition', handleTrigger);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#030712]/98 backdrop-blur-2xl overflow-hidden select-none pointer-events-auto text-white"
        >
          {/* Glowing Red Background Backdrop Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-br from-red-600/25 via-rose-500/15 to-transparent rounded-full blur-[110px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-tr from-amber-500/20 via-red-500/15 to-transparent rounded-full blur-[90px] animate-pulse [animation-delay:0.3s]" />
          </div>

          <div className="relative flex flex-col items-center gap-6 p-8 z-10">
            {/* Orbital Red Spinner */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20" />
              <div
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-red-600 animate-spin"
                style={{ animationDuration: "1s" }}
              />
              <div
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-rose-400 animate-spin"
                style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
              />
              <div className="absolute w-3 h-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-ping" />
              <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.7)]" />
            </div>

            {/* Brand Logo & Status */}
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-wider text-red-500 font-heading">
                OPTIMUM
              </h2>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-[0.25em] uppercase font-mono animate-pulse">
                {t('themeLoader.text', 'Rejim almashtirilmoqda...')}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
