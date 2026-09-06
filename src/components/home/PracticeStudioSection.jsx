import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLaptopCode,
  FaRobot,
  FaGraduationCap,
  FaGamepad,
  FaHeadphones,
  FaBookOpen,
  FaArrowRight,
  FaCheck,
  FaPlay,
  FaExternalLinkAlt,
  FaClock,
  FaAward
} from 'react-icons/fa';

export default function PracticeStudioSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('reading');

  const studioTabs = [
    {
      id: 'reading',
      label: 'CDI Reading Suite',
      badge: '6 Full Mock Tests',
      icon: <FaBookOpen />,
      title: 'Haqiqiy CDI Reading Simulyatsiyasi',
      desc: 'Kompyuterda topshiriladigan IELTS imtihonining split-screen formatidagi akademik matnlari, matndan so\'z ajratish va real taymer bilan ishlash.',
      highlights: ['Split-screen interfeys', 'Real imtihon taymeri (60 min)', 'Akademik matnlar tahlili'],
      link: '/reading-tests',
      cta: 'Reading Testlarini Ochish',
      previewComponent: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10 text-xs font-bold">
            <span className="text-slate-800 dark:text-slate-200">Passage 1: The Evolution of Language</span>
            <span className="font-mono text-rose-600 dark:text-rose-400">Time Left: 54:12</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 h-28 overflow-hidden bg-slate-50 dark:bg-[#111728] p-3 rounded-xl border border-slate-200/60 dark:border-white/5">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Paragraph A</p>
              Human communication evolved over millennia through subtle phonetic shifts...
            </div>
            <div className="border-l border-slate-200 dark:border-white/10 pl-3">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Questions 1–4</p>
              Choose the correct heading for Paragraph A from the list of headings below...
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'listening',
      label: 'CDI Listening Hub',
      badge: '6 Audio Tests',
      icon: <FaHeadphones />,
      title: 'Haqiqiy Audio va Ko\'p Variantli Savollar',
      desc: 'British Council audio formati, turli xil aksentlar (British, American, Australian) va interaktiv javob kiritish oynasi.',
      highlights: ['Turli xalqaro aksentlar', 'Section 1-4 to\'liq format', 'Darhol javoblarni tekshirish'],
      link: '/listening-tests',
      cta: 'Listening Hub\'ni Ochish',
      previewComponent: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10 text-xs font-bold">
            <span className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Section 2: Campus Tour Guide
            </span>
            <span className="font-mono text-slate-400">Audio 128kbps HQ</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
            <div className="text-xs font-bold text-purple-700 dark:text-purple-300">
              Q 11. What time does the library close on Fridays?
            </div>
            <span className="px-2.5 py-1 rounded bg-purple-600 text-white font-mono text-[10px] font-bold">
              8:30 PM
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'writing',
      label: 'AI Writing Assessor',
      badge: 'Band 9 AI Diagnostic',
      icon: <FaRobot />,
      title: 'Insholarni 4 Mezon Bo\'yicha Baholash',
      desc: 'Task 1 va Task 2 insholaringizni yozing. Sun\'iy intellekt moduli lug\'at boyligi, bog\'lovchilar va grammatik aniqlik bo\'yicha tezkor tavsiyalar beradi.',
      highlights: ['TR, CC, LR, GRA mezonlari', 'So\'z boyligini boyitish tavsiyalari', 'Band Score taxmini'],
      link: '/ielts-writing',
      cta: 'Writing Tekshirishni Boshlash',
      previewComponent: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>AI Lexical Diagnostics</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">Score: 8.0</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-700 dark:text-emerald-300">
            ✓ "fundamentally transformed" — sophisticated collocation detected (+0.5 LR)
          </div>
        </div>
      )
    },
    {
      id: 'placement',
      label: '40-Savolli Daraja Testi',
      badge: 'Adaptive Diagnostic',
      icon: <FaGraduationCap />,
      title: '10 Daqiqada CEFR A1–C2 Diagnostikasi',
      desc: 'Boshlang\'ich grammatika, murakkab zamonlar va kontekstli iboralarni qamrab olgan adaptiv 40-savolli bepul joylashuv testi.',
      highlights: ['40 ta adaptiv savol', 'Darhol hisoblanadigan natija', 'Kurs tavsiyasi va to\'g\'ridan-to\'g\'ri yozilish'],
      link: '/level-test',
      cta: 'Daraja Testini Topshirish',
      previewComponent: (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Level Test Progress</span>
            <span className="font-mono text-rose-600 dark:text-rose-400">40 / 40 Questions</span>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-700 dark:text-rose-300 flex items-center justify-between font-bold">
            <span>Tavsiya Daraja: B2 (Upper-Intermediate)</span>
            <span className="font-mono">92% To'g'ri</span>
          </div>
        </div>
      )
    }
  ];

  const currentTab = studioTabs.find((t) => t.id === activeTab) || studioTabs[0];

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-slate-100/60 dark:bg-[#070912]/90 border-y border-slate-200/80 dark:border-white/[0.06] select-none">
      
      {/* Background Lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[160px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="badge-neon mb-3">
            ✦ OPTIMUM DIGITAL PRACTICE STUDIO
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Imtihonga tayyorgarlikning{' '}
            <span className="text-gradient-accent">raqamli ekotizimi.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Biz o'quvchilarimizga faqat nazariya bermaymiz — haqiqiy Cambridge imtihon muhiti, audio pleyerlar va AI baholash vositalari orqali yuqori ko'nikmalarni shakllantiramiz.
          </p>
        </div>

        {/* Interactive Studio Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {studioTabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/35 scale-[1.02]'
                    : 'bg-white dark:bg-[#0e121e] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-rose-500/40'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Studio View Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-glow-card p-6 sm:p-10 lg:p-12 rounded-[32px] sm:rounded-[40px] bg-white dark:bg-[#0b0f1b] border border-slate-200/90 dark:border-white/10 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="badge-pill">
                  {currentTab.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
                  {currentTab.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {currentTab.desc}
                </p>

                {/* Highlights */}
                <div className="space-y-2.5 pt-2">
                  {currentTab.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <FaCheck className="w-2.5 h-2.5" />
                      </div>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    to={currentTab.link}
                    className="btn-primary text-xs sm:text-sm py-3.5 px-7"
                  >
                    <span>{currentTab.cta}</span>
                    <FaArrowRight className="w-3 h-3" />
                  </Link>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    ✦ O'quvchilar uchun 100% ochiq
                  </span>
                </div>
              </div>

              {/* Right Live Preview Component */}
              <div className="lg:col-span-5 p-4 rounded-3xl bg-slate-50 dark:bg-[#111728] border border-slate-200 dark:border-white/10 shadow-inner space-y-3">
                <div className="flex items-center justify-between px-2 text-[11px] font-mono font-bold text-slate-400">
                  <span>LIVE STUDIO PREVIEW</span>
                  <span className="text-rose-600 dark:text-rose-400">OPTIMUM CDI v2.4</span>
                </div>
                {currentTab.previewComponent}
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
