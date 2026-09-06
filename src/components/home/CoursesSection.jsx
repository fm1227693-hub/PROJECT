import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheck,
  FaClock,
  FaArrowRight,
  FaGraduationCap,
  FaStar,
  FaLayerGroup,
  FaFire,
  FaAward,
  FaCalendarCheck,
  FaUserCheck,
  FaLaptopCode
} from 'react-icons/fa';
import { COURSES, PRICING_PLANS } from '../../data/coursesData';
import ConsultationModal from '../ui/ConsultationModal';

export default function CoursesSection() {
  const { t } = useTranslation();
  const [activeCourseId, setActiveCourseId] = useState('intermediate');
  const [modalCourse, setModalCourse] = useState(null);

  const activeCourse = COURSES.find((c) => c.id === activeCourseId) || COURSES[0];

  return (
    <section id="courses" className="py-24 sm:py-32 relative select-none">
      
      {/* Background Lighting */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[160px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-[550px] h-[550px] bg-amber-500/10 dark:bg-rose-600/10 rounded-full blur-[160px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-18 gap-6">
          <div className="max-w-2xl text-left">
            <span className="badge-neon mb-3">
              ✦ OPTIMUM COURSE ROADMAP
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              O'quv dasturlari va{' '}
              <span className="text-gradient-accent">darajalar xaritasi.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
              Beginner'dan to IELTS 8.5+ gacha bo'lgan to'liq bosqichma-bosqich tizim. Har bir daraja o'zining aniq CEFR maqsadi va CDI simulyatsiyasiga ega.
            </p>
          </div>

          <Link
            to="/level-test"
            className="inline-flex items-center gap-2 self-start md:self-end px-6 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm font-bold hover:bg-rose-500/20 transition-all shadow-sm"
          >
            <span>Qaysi darajadaligingizni bilmaysizmi?</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* CEFR Level Journey Tracker Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-10">
          {COURSES.map((course, idx) => {
            const isActive = course.id === activeCourseId;
            return (
              <button
                key={course.id}
                onClick={() => setActiveCourseId(course.id)}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer border relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? 'bg-gradient-to-b from-rose-600/15 via-rose-600/5 to-transparent border-rose-500 shadow-xl shadow-rose-600/15 scale-[1.02]'
                    : 'bg-white/80 dark:bg-[#0b0f1b]/80 border-slate-200 dark:border-white/10 hover:border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[11px] font-black uppercase text-slate-400">
                    [0{idx + 1}]
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-black text-white"
                    style={{ backgroundColor: course.accentColor }}
                  >
                    {course.cefr}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-display font-extrabold text-slate-900 dark:text-white mb-0.5">
                    {t(course.titleKey)}
                  </div>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-bold font-mono">
                    IELTS {course.targetIelts}
                  </div>
                </div>

                {isActive && (
                  <div
                    className="absolute bottom-0 inset-x-0 h-1"
                    style={{ backgroundColor: course.accentColor }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Course Detailed Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCourse.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-glow-card p-6 sm:p-10 lg:p-12 rounded-[32px] sm:rounded-[40px] bg-white dark:bg-[#0b0f1b] border border-slate-200/90 dark:border-white/10 relative overflow-hidden"
          >
            {/* Top Accent Gradient Bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{
                background: `linear-gradient(90deg, ${activeCourse.accentColor}, #e11d48, #f59e0b)`
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Details */}
              <div className="lg:col-span-7 space-y-6 text-left">
                
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-black text-white shadow-md"
                    style={{ backgroundColor: activeCourse.accentColor }}
                  >
                    CEFR {activeCourse.cefr}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold font-mono">
                    Target: IELTS {activeCourse.targetIelts}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <FaClock className="text-rose-500" />
                    <span>{activeCourse.duration}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
                    {t(activeCourse.titleKey)} kursi
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed mt-2">
                    {t(activeCourse.descKey)}
                  </p>
                </div>

                {/* Detailed Curriculum Modules */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Ushbu Kurs Doirasidagi Asosiy Modullar:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeCourse.detailedHighlights.map((hl, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111728] border border-slate-200/70 dark:border-white/5"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          <FaCheck className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  <strong className="text-rose-600 dark:text-rose-400 font-bold">Kimlar uchun mos: </strong>
                  {activeCourse.recommendedFor}
                </div>

              </div>

              {/* Right Pricing & Quick Action Box */}
              <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#111728] border border-slate-200 dark:border-white/10 space-y-6">
                
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-mono">
                    Oylik To'lov & Imtiyozlar
                  </span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white">
                      {activeCourse.monthlyPrice}
                    </span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                      so'm / oy
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Haftasiga 3 marta asosiy dars + Yakshanba Speaking Club bepul
                  </p>
                </div>

                <div className="space-y-3 border-t border-slate-200 dark:border-white/10 pt-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <FaLaptopCode className="text-purple-500 text-sm shrink-0" />
                    <span>Optimum CDI Simulatoriga cheksiz kirish</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarCheck className="text-rose-500 text-sm shrink-0" />
                    <span>Haftalik oraliq mock testlar va tahlil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserCheck className="text-emerald-500 text-sm shrink-0" />
                    <span>IELTS 8.0 Senior Mentor nazorati</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setModalCourse(`${t(activeCourse.titleKey)} (${activeCourse.cefr})`)}
                    className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
                  >
                    <span>Ushbu kursga yozilish</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    to="/level-test"
                    className="btn-secondary w-full py-3 text-xs sm:text-sm flex items-center justify-center gap-2 font-bold"
                  >
                    <span>Darajangizni tekshirib ko'ring</span>
                  </Link>
                </div>

              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>

      <ConsultationModal
        isOpen={!!modalCourse}
        onClose={() => setModalCourse(null)}
        defaultCourse={modalCourse || 'General English / IELTS'}
      />
    </section>
  );
}
