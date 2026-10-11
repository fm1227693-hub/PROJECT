import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaTimes, FaCheck, FaTimesCircle, FaVolumeUp, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const DAILY_WORDS = [
  {
    word: "Resilient",
    phonetic: "/rɪˈzɪl.jənt/",
    meaningUz: "Chidamli, taslim bo'lmaydigan, qiyinchiliklarni oson yenguvchi",
    example: "Optimum students stay resilient throughout their intensive IELTS journey.",
    collocations: ["resilient economy", "highly resilient", "remain resilient"],
  },
  {
    word: "Meticulous",
    phonetic: "/məˈtɪk.jə.ləs/",
    meaningUz: "O'ta sinchkov, mayda detallargacha e'tibor beruvchi, pishiq",
    example: "The teacher gave meticulous feedback on each IELTS Writing Task.",
    collocations: ["meticulous research", "meticulous attention", "meticulously planned"],
  },
  {
    word: "Comprehensive",
    phonetic: "/ˌkɒm.prɪˈhen.sɪv/",
    meaningUz: "Har tomonlama, to'liq, mukammal qamrab oluvchi",
    example: "We offer a comprehensive curriculum covering all four IELTS modules.",
    collocations: ["comprehensive study", "comprehensive guide", "comprehensive approach"],
  },
  {
    word: "Articulate",
    phonetic: "/ɑːˈtɪk.jə.lət/",
    meaningUz: "Fikrini ravon, aniq va tushunarli ifodalovchi",
    example: "She gave an articulate response in IELTS Speaking Part 3.",
    collocations: ["articulate speaker", "highly articulate", "articulate arguments"],
  },
  {
    word: "Inevitably",
    phonetic: "/ɪnˈev.ɪ.tə.bli/",
    meaningUz: "Muqarrar ravishda, o'z-o'zidan kutilganidek",
    example: "Daily deliberate practice inevitably leads to a 7.5+ band score.",
    collocations: ["inevitably result in", "inevitably lead to", "inevitable outcome"],
  }
];

export default function DailyPracticeModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  
  // Pick today's word based on day of month
  const todayIndex = new Date().getDate() % DAILY_WORDS.length;
  const wordData = DAILY_WORDS[todayIndex];

  // Saved words storage in localStorage
  const [savedWords, setSavedWords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('optimum_vocab_saved') || '[]');
    } catch {
      return [];
    }
  });

  const isSaved = savedWords.includes(wordData.word);

  const toggleSave = () => {
    let next;
    if (isSaved) {
      next = savedWords.filter(w => w !== wordData.word);
    } else {
      next = [...savedWords, wordData.word];
    }
    setSavedWords(next);
    localStorage.setItem('optimum_vocab_saved', JSON.stringify(next));
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(wordData.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Mini quiz state
  const [quizAnswered, setQuizAnswered] = useState(null);
  const quizOptions = [
    { label: wordData.meaningUz, correct: true },
    { label: "Vaqtinchalik to'xtatilgan, kechiktirilgan", correct: false },
    { label: "Ortiqcha, keraksiz xarajat", correct: false }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-500/30">
                  <FaFire className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                    {t('dailyVocab.title', "Kun so'zi & Tezkor mashq")}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('dailyVocab.subtitle', 'Har kuni 1 ta akademik so‘z bilan lug‘at boyligini oshiring')}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
                aria-label="Yopish"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Word Card */}
            <div className="bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent border border-red-500/25 rounded-2xl p-5 mb-5 relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 dark:text-red-400">
                    Academic Vocabulary
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                      {wordData.word}
                    </h2>
                    <button
                      onClick={speakWord}
                      className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                      title="Talaffuzni tinglash"
                    >
                      <FaVolumeUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {wordData.phonetic}
                  </div>
                </div>

                <button
                  onClick={toggleSave}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isSaved
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/30'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-white/10 hover:text-red-600'
                  }`}
                  title={isSaved ? "Saqlanganlardan o'chirish" : "Lug'atga saqlash"}
                >
                  {isSaved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-red-500/15">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Ma'nosi:</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                  {wordData.meaningUz}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Misol:</div>
                <div className="text-xs italic text-slate-700 dark:text-slate-300 mt-0.5">
                  "{wordData.example}"
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {wordData.collocations.map((col, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-red-500/15 text-slate-700 dark:text-slate-300"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Practice Test */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tezkor sinov: to'g'ri ma'noni belgilang
              </div>
              {quizOptions.map((opt, i) => (
                <button
                  key={i}
                  disabled={quizAnswered !== null}
                  onClick={() => setQuizAnswered(opt.correct)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    quizAnswered === null
                      ? 'border-slate-200 dark:border-white/10 hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-slate-800 dark:text-slate-200'
                      : opt.correct
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600'
                      : 'border-slate-200 dark:border-white/5 opacity-50 text-slate-400'
                  }`}
                >
                  <span>{opt.label}</span>
                  {quizAnswered !== null && opt.correct && (
                    <FaCheck className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </button>
              ))}

              {quizAnswered !== null && (
                <div className={`text-xs font-bold text-center pt-1 ${quizAnswered ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {quizAnswered ? "Ajoyib! To'g'ri javob topildi 🎉" : "Xato, lekin keyingi safar albatta o'rganib olasiz!"}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
