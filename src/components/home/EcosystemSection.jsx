import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaLaptopCode,
  FaRobot,
  FaGraduationCap,
  FaGamepad,
  FaUsers,
  FaArrowRight,
  FaCheck,
  FaHeadphones,
  FaBookOpen
} from 'react-icons/fa';

export default function EcosystemSection() {
  const { t } = useTranslation();

  const tools = [
    {
      id: 'level-test',
      title: '40-Savolli Daraja Testi',
      subtitle: 'CEFR A1 – C2 Diagnostika',
      desc: "Ingliz tili darajangizni xalqaro standartlar asosida 10 daqiqa ichida aniqlang va mos kurs tavsiyasini oling.",
      icon: <FaGraduationCap className="w-6 h-6" />,
      color: 'from-rose-500 to-red-600',
      tag: 'Bepul / Instant',
      link: '/level-test',
      btnText: 'Testni boshlash'
    },
    {
      id: 'cdi-mock',
      title: 'CDI Mock Exam Simulator',
      subtitle: 'Reading & Listening Hub',
      desc: "Rasmiy kompyuterda topshiriladigan IELTS imtihonining 100% aniq interfeysi, audio pleyeri va taymerli matnlari.",
      icon: <FaLaptopCode className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      tag: '6 ta To\'liq Test',
      link: '/reading-tests',
      btnText: 'CDI Mock topshirish'
    },
    {
      id: 'ai-writing',
      title: 'AI IELTS Writing Assessor',
      subtitle: 'Insholarni Sun\'iy Intellektda Baholash',
      desc: "Task 1 va Task 2 insholaringizni yozing va 4 ta rasmiy mezon (TR, CC, LR, GRA) bo'yicha tezkor tahlil oling.",
      icon: <FaRobot className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600',
      tag: 'AI Feedback',
      link: '/ielts-writing',
      btnText: 'Writing tekshirish'
    },
    {
      id: 'games',
      title: 'Interaktiv O\'yinlar',
      subtitle: 'Vocabulary & Sentence Builder',
      desc: "So'z boyligini kengaytirish, sinonimlar topish va grammatik strukturalarni o'yin orqali mustahkamlash tizimi.",
      icon: <FaGamepad className="w-6 h-6" />,
      color: 'from-teal-500 to-emerald-600',
      tag: 'Gamified Learning',
      link: '/games',
      btnText: 'O\'yinlarni o\'ynash'
    }
  ];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden bg-slate-100/50 dark:bg-[#06080f]/60 border-y border-slate-200/80 dark:border-white/[0.06]">
      
      {/* Ambient background light */}
      <div className="pointer-events-none absolute -top-40 left-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="badge-pill mb-3">
            ✦ OptimumELC Digital Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            IELTS va til o'rganish uchun{' '}
            <span className="text-gradient-accent">raqamli amaliyot platformasi.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Biz shunchaki dars o'tmaymiz — har bir o'quvchiga zamonaviy simulyatsiya vositalari, AI tahlillari va professional test platformasini taqdim etamiz.
          </p>
        </div>

        {/* 4 Core Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="premium-surface p-6 sm:p-7 flex flex-col justify-between group hover:-translate-y-1.5 transition-all duration-300 relative bg-white dark:bg-[#0e121e]"
            >
              <div>
                {/* Top Row: Icon and Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                    {tool.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {tool.title}
                </h3>
                <h4 className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-3">
                  {tool.subtitle}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {tool.desc}
                </p>
              </div>

              <Link
                to={tool.link}
                className="inline-flex items-center justify-between w-full pt-4 border-t border-slate-100 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors"
              >
                <span>{tool.btnText}</span>
                <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
