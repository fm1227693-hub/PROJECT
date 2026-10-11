import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCompass, FaTimes, FaCheck, FaArrowRight, FaGraduationCap, FaClock, FaBullseye } from 'react-icons/fa';

export default function CourseFinderModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [time, setTime] = useState('');

  const resetAndClose = () => {
    setStep(1);
    setGoal('');
    setLevel('');
    setTime('');
    onClose();
  };

  const getRecommendation = () => {
    if (goal === 'ielts' || level === 'advanced') {
      return {
        title: "IELTS Intensive & CDI Mastery",
        band: "Band 7.0 – 8.5+",
        targetPath: "/pricing",
        state: { levelKey: 'advanced', levelLabel: 'Advanced (IELTS 7.5+)' },
        reason: "CDI Mock simulatori va Cambridge metodikasi orqali yuqori ballga tezkor tayyorgarlik.",
        duration: "3 – 5 oy",
        color: "from-red-600 to-rose-600",
      };
    }
    if (goal === 'speaking' || level === 'intermediate') {
      return {
        title: "General English & Fluency",
        band: "CEFR B1 – B2",
        targetPath: "/pricing",
        state: { levelKey: 'intermediate', levelLabel: 'Intermediate (B1-B2)' },
        reason: "Jonli muloqot, to'g'ri talaffuz va erkin ingliz tilida so'zlashish ko'nikmalari.",
        duration: "4 oy",
        color: "from-amber-500 to-red-600",
      };
    }
    return {
      title: "Beginner / Elementary Foundation",
      band: "CEFR A1 – A2",
      targetPath: "/pricing",
      state: { levelKey: 'beginner', levelLabel: 'Beginner (A1-A2)' },
      reason: "Noldan mustahkam poydevor, so'z boyligi va grammatika asoslarini tizimli o'rganish.",
      duration: "3 oy",
      color: "from-emerald-500 to-teal-600",
    };
  };

  const recommendation = getRecommendation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0a0f1d] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
                  <FaCompass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                    {t('courseFinder.title', 'Kurs tanlash yordamchisi')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('courseFinder.stepCount', 'Bosqich')} {step} / 3
                  </p>
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Yopish"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 1: Goal */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FaBullseye className="text-red-500 w-4 h-4" />
                  {t('courseFinder.q1', 'Asosiy maqsadingiz nima?')}
                </h4>
                <div className="space-y-2.5">
                  {[
                    { id: 'ielts', title: 'IELTS 7.0+ yoki CEFR sertifikati olish', desc: 'Universitet yoki xorijiy grantlar uchun' },
                    { id: 'speaking', title: 'Erkin so‘zlashish va muloqot', desc: 'Ish, sayohat va kundalik hayot uchun' },
                    { id: 'foundation', title: 'Noldan boshlab ingliz tilini o‘rganish', desc: 'Mustahkam grammatika va bazaviy bilim' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setGoal(item.id); setStep(2); }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                        goal === item.id
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-600'
                          : 'border-slate-200 dark:border-white/10 hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                      <FaArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-red-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Current Level */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <FaGraduationCap className="text-red-500 w-4 h-4" />
                  {t('courseFinder.q2', 'Hozirgi taxminiy darajangiz qanday?')}
                </h4>
                <div className="space-y-2.5">
                  {[
                    { id: 'beginner', title: "Boshlang'ich (A1 – A2)", desc: 'Harflar, oddiy so‘zlar yoki deyarli bilmayman' },
                    { id: 'intermediate', title: "O'rta daraja (B1 – B2)", desc: 'Matnlarni tushunaman, lekin gapirishda to‘siq bor' },
                    { id: 'advanced', title: "Yuqori daraja (B2+ – C1)", desc: 'Erkin gaplasha olaman, faqat IELTS balli kerak' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setLevel(item.id); setStep(3); }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                        level === item.id
                          ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-600'
                          : 'border-slate-200 dark:border-white/10 hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                      </div>
                      <FaArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-red-500" />
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-red-600 font-bold"
                  >
                    ← {t('common.back', 'Orqaga')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Result & Recommendation */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent border border-red-500/30">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-red-600 dark:text-red-400 bg-red-500/15 px-2.5 py-1 rounded-full inline-block mb-2">
                    {t('courseFinder.recommendedBadge', 'Tavsiya etilgan yo‘nalish')}
                  </span>
                  <h4 className="font-heading font-black text-xl text-slate-900 dark:text-white">
                    {recommendation.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-semibold mt-2">
                    <span className="text-red-600 dark:text-red-400 font-bold">{recommendation.band}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaClock className="w-3 h-3 text-slate-400" />
                      {recommendation.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {recommendation.reason}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      resetAndClose();
                      navigate(recommendation.targetPath, { state: recommendation.state });
                    }}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/30 hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t('courseFinder.viewTariff', 'Tarifni ko‘rish')}</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      resetAndClose();
                      navigate('/level-test');
                    }}
                    className="py-3.5 px-5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-red-500/50 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all text-center"
                  >
                    {t('courseFinder.exactTest', 'Aniq test topshirish')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
