import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function FAQ() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const FAQ_ITEMS = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faq.q${i + 1}`),
    answer: t(`faq.a${i + 1}`)
  }));

  return (
    <div className="pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans select-none max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="badge-pill mb-3">
          ✦ {t('faq.badge', 'Yordam & Savollar')}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('faq.title', 'Ko\'p beriladigan savollar')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
          {t('faq.subtitle', 'Kurslarimiz va ta\'lim jarayoni bo\'yicha barcha savollarga javoblar')}
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className="premium-surface rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer gap-4 focus:outline-none"
              >
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {item.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-rose-600 dark:text-rose-400' : ''
                  }`}
                >
                  <FaChevronDown className="w-3 h-3" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3.5">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
