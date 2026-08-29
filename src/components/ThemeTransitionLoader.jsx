import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PremiumLoader from './PremiumLoader';

export default function ThemeTransitionLoader() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleTrigger = () => {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3500);
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
          className="fixed inset-0 z-[999999]"
        >
          <PremiumLoader 
            loop={false} 
            text={t("themeLoader.text", "REJIM")}
            captions={[
              t("themeLoader.cap1", "Rejim o'zgartirilmoqda"),
              t("themeLoader.cap2", "Ranglar moslashtirilmoqda"),
              t("themeLoader.cap3", "Deyarli tayyor"),
              t("themeLoader.cap4", "Tayyor")
            ]}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
