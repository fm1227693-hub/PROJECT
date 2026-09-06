import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Ingliz tili darajamni qanday qilib bepul aniqlashim mumkin?",
      a: "Saytimizdagi '40-Savolli Daraja Testi' bo'limi orqali 10 daqiqa ichida xalqaro CEFR A1-C2 darajangizni bepul aniqlashingiz va mos kurs tavsiyasini olishingiz mumkin."
    },
    {
      q: "CDI Mock nima va u qanday foyda beradi?",
      a: "CDI (Computer-Delivered IELTS) — bu rasmiy imtihonning kompyuterda topshiriladigan formati. OptimumELC da aynan British Council formati bilan 100% bir xil interfeysda Listening va Reading testlarini mashq qilasiz."
    },
    {
      q: "Birinchi darsga qatnashib ko'rish bepulmi?",
      a: "Ha! Har bir yangi o'quvchi uchun birinchi sinov darsi mutlaqo bepul. Dars jarayoni, o'qituvchi metodikasi va guruh muhiti bilan shaxsan tanishib chiqishingiz mumkin."
    },
    {
      q: "Darslar haftasiga necha marta va necha soatdan bo'ladi?",
      a: "Asosiy akademik darslar haftasiga 3 marta, 90 daqiqadan (1.5 soat) bo'lib o'tadi. Bundan tashqari, har yakshanba kuni barcha talabalar uchun bepul Speaking Club va munozara guruhlari o'tkaziladi."
    },
    {
      q: "Ustozlarning malakasi va IELTS ballari qanday?",
      a: "OptimumELC mentorlari IELTS 8.0+ sertifikatiga, 4-6 yildan ortiq tajribaga hamda yuzlab Band 7.0+ natijalariga ega bo'lgan kuchli mutaxassislardir."
    },
    {
      q: "IELTS Writing insholarini qanday tekshirasizlar?",
      a: "Insholar ham tajribali mentorlar tomonidan, ham sun'iy intellekt (AI Writing Assessor) moduli orqali 4 ta mezon (Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range) bo'yicha tahlil qilinadi."
    },
    {
      q: "OptimumELC manzili qayerda joylashgan?",
      a: "O'quv markazimiz Buxoro shahrida, Namozgoh ko'chasi (Premier School majmuasi)da joylashgan. Har kuni soat 08:00 dan 20:00 gacha ochiq."
    }
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 relative select-none bg-slate-100/50 dark:bg-[#060810]/70 border-t border-slate-200/80 dark:border-white/[0.06]">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-16">
          <span className="badge-pill mb-3">
            ✦ Ko'p Beriladigan Savollar
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Savollaringiz bormi?{' '}
            <span className="text-gradient-accent">Javob beramiz.</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400 font-normal">
            Quyida o'quvchilarimiz va ota-onalar tomonidan eng ko'p beriladigan savollarga aniq javoblar keltirilgan.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="premium-surface rounded-2xl overflow-hidden bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {faq.q}
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
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
