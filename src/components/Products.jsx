import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaAward, FaCheckCircle, FaTimes, FaSearchPlus, FaHeadphones, FaBookOpen, FaPenNib, FaComments } from 'react-icons/fa';
import { IELTS_STUDENTS, CEFR_STUDENTS } from '../data/studentsData';

export default function Products() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ielts');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [certModalImg, setCertModalImg] = useState(null);

  const activeData = activeTab === 'ielts' ? IELTS_STUDENTS : CEFR_STUDENTS;
  const activeStudent = activeData[currentIndex] || activeData[0];

  return (
    <div className="pt-28 sm:pt-36 pb-20 font-sans px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto select-none">
      
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="badge-pill mb-3">
          ✦ {t('products.badge', 'Yutuqlar')}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('resultsSlider.title', "Ba'zi o'quvchilarimizning natijalari")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
          OptimumELC da tayyorlangan o'quvchilarning rasmiy IELTS va CEFR sertifikatlari.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mt-6">
          <div className="bg-slate-100 dark:bg-[#0e121e] p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-white/10 shadow-inner">
            <button
              onClick={() => {
                setActiveTab('ielts');
                setCurrentIndex(0);
              }}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'ielts'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              IELTS Natijalari
            </button>
            <button
              onClick={() => {
                setActiveTab('cefr');
                setCurrentIndex(0);
              }}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'cefr'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              CEFR Natijalari
            </button>
          </div>
        </div>
      </div>

      {/* Avatars */}
      <div className="flex items-center justify-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {activeData.map((student, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={student.id}
              onClick={() => setCurrentIndex(index)}
              className={`relative rounded-full transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'p-1 bg-gradient-to-tr from-rose-600 to-amber-500 scale-110 shadow-lg ring-2 ring-rose-500/50'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={student.image}
                alt={student.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Active Student Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStudent.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="premium-surface p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Scores (Left) */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  {activeStudent.examType}
                </span>
                <h3 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {activeStudent.name}
                </h3>
                <div className="mt-2 inline-flex px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono rounded-full border border-rose-500/20">
                  Overall: {activeStudent.scores.overall}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300 font-bold py-2 px-4 rounded-xl flex justify-between items-center text-xs sm:text-sm border border-purple-200/50 dark:border-purple-900/30">
                  <span className="flex items-center gap-2"><FaHeadphones /> Listening</span>
                  <span className="font-mono text-base font-black">{activeStudent.scores.listening}</span>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-bold py-2 px-4 rounded-xl flex justify-between items-center text-xs sm:text-sm border border-blue-200/50 dark:border-blue-900/30">
                  <span className="flex items-center gap-2"><FaBookOpen /> Reading</span>
                  <span className="font-mono text-base font-black">{activeStudent.scores.reading}</span>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-bold py-2 px-4 rounded-xl flex justify-between items-center text-xs sm:text-sm border border-amber-200/50 dark:border-amber-900/30">
                  <span className="flex items-center gap-2"><FaPenNib /> Writing</span>
                  <span className="font-mono text-base font-black">{activeStudent.scores.writing}</span>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 font-bold py-2 px-4 rounded-xl flex justify-between items-center text-xs sm:text-sm border border-emerald-200/50 dark:border-emerald-900/30">
                  <span className="flex items-center gap-2"><FaComments /> Speaking</span>
                  <span className="font-mono text-base font-black">{activeStudent.scores.speaking}</span>
                </div>
              </div>
            </div>

            {/* Certificate (Right) */}
            <div className="md:col-span-7 flex flex-col items-center">
              <div
                onClick={() => setCertModalImg(activeStudent.certImage)}
                className="relative group w-full max-h-[360px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#131828] border border-slate-200 dark:border-slate-800 shadow-md cursor-pointer flex items-center justify-center p-2"
              >
                <img
                  src={activeStudent.certImage}
                  alt={activeStudent.name}
                  className="max-w-full max-h-[340px] object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                  <FaSearchPlus />
                  <span>Kattalashtirish</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Certificate Modal */}
      <AnimatePresence>
        {certModalImg && (
          <div
            onClick={() => setCertModalImg(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-[#0e121e] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setCertModalImg(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold cursor-pointer"
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

    </div>
  );
}
