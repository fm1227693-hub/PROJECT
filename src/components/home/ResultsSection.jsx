import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaAward,
  FaCheckCircle,
  FaTimes,
  FaSearchPlus,
  FaHeadphones,
  FaBookOpen,
  FaPenNib,
  FaComments,
  FaShieldAlt
} from 'react-icons/fa';
import { IELTS_STUDENTS, CEFR_STUDENTS } from '../../data/studentsData';

export default function ResultsSection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ielts');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [certModalImg, setCertModalImg] = useState(null);

  const activeStudents = activeTab === 'ielts' ? IELTS_STUDENTS : CEFR_STUDENTS;
  const currentStudent = activeStudents[currentIndex] || activeStudents[0];

  return (
    <section id="results" className="py-24 sm:py-32 relative select-none">
      
      {/* Background Lighting */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-rose-500/10 rounded-full blur-[160px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <span className="badge-neon mb-3">
            ✦ OPTIMUM HALL OF FAME
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            OptimumELC talabalarining{' '}
            <span className="text-gradient-accent">haqiqiy natijalari.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Biz soxta da'volarga emas, xalqaro imtihonlarda tasdiqlangan rasmiy sertifikatlar va yuqori ballarga tayanamiz.
          </p>

          {/* IELTS / CEFR Switcher */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 shadow-inner">
              <button
                onClick={() => {
                  setActiveTab('ielts');
                  setCurrentIndex(0);
                }}
                className={`px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'ielts'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/35'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                IELTS Natijalari (6.5 – 7.5+)
              </button>
              <button
                onClick={() => {
                  setActiveTab('cefr');
                  setCurrentIndex(0);
                }}
                className={`px-8 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === 'cefr'
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/35'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                CEFR Multi-Level (B1 – B2)
              </button>
            </div>
          </div>
        </div>

        {/* Student Avatars Selector */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 overflow-x-auto pb-4 mb-10 sm:mb-12 no-scrollbar px-4">
          {activeStudents.map((student, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={student.id}
                onClick={() => setCurrentIndex(idx)}
                className={`flex flex-col items-center gap-2 p-1.5 rounded-2xl transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'scale-110'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-rose-600 to-amber-500 shadow-xl shadow-rose-600/50 ring-2 ring-rose-500'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className={`text-[11px] sm:text-xs font-bold max-w-[85px] truncate text-center ${
                  isSelected ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {student.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Student Detailed Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStudent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="glass-glow-card p-6 sm:p-10 lg:p-12 rounded-[32px] sm:rounded-[40px] bg-white dark:bg-[#0b0f1b] border border-slate-200/90 dark:border-white/10 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Details & Scores */}
              <div className="lg:col-span-6 space-y-6 text-left">
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {currentStudent.examType}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                      <FaCheckCircle className="text-xs" /> VERIFIED CERTIFICATE
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 dark:text-white">
                    {currentStudent.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 mt-1">
                    ✦ {currentStudent.highlight}
                  </p>
                </div>

                {/* Overall Score Badge */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#111728] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
                      Umumiy Natija (Overall)
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                      {currentStudent.scores.overall}
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-rose-600/30">
                    <FaAward />
                  </div>
                </div>

                {/* Subscores Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/30">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                      <span className="flex items-center gap-1.5"><FaHeadphones className="text-xs" /> Listening</span>
                      <span className="font-mono text-base font-black">{currentStudent.scores.listening}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/30">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
                      <span className="flex items-center gap-1.5"><FaBookOpen className="text-xs" /> Reading</span>
                      <span className="font-mono text-base font-black">{currentStudent.scores.reading}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                      <span className="flex items-center gap-1.5"><FaPenNib className="text-xs" /> Writing</span>
                      <span className="font-mono text-base font-black">{currentStudent.scores.writing}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                      <span className="flex items-center gap-1.5"><FaComments className="text-xs" /> Speaking</span>
                      <span className="font-mono text-base font-black">{currentStudent.scores.speaking}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Certificate Image Viewer */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div
                  onClick={() => setCertModalImg(currentStudent.certImage)}
                  className="relative group w-full max-w-md h-[280px] sm:h-[350px] rounded-3xl overflow-hidden bg-slate-100 dark:bg-[#111728] border border-slate-200 dark:border-white/10 shadow-xl cursor-pointer"
                >
                  <img
                    src={currentStudent.certImage}
                    alt={`${currentStudent.name} Certificate`}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                    <FaSearchPlus className="text-base" />
                    <span>Sertifikatni to'liq ko'rish</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-mono">
                  ✦ Kattalashtirish uchun rasm ustiga bosing
                </span>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Certificate Modal Lightbox */}
      <AnimatePresence>
        {certModalImg && (
          <div
            onClick={() => setCertModalImg(null)}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-[#0b0f1b] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10"
            >
              <button
                onClick={() => setCertModalImg(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold cursor-pointer hover:bg-rose-600 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
              <img
                src={certModalImg}
                alt="Full Certificate"
                className="max-w-full max-h-[80vh] object-contain rounded-xl mx-auto"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
