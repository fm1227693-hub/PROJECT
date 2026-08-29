import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeadphones, FaChevronRight, FaPlay } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ListeningTest from "./ListeningTest";
import ListeningTest2 from "./ListeningTest2";
import ListeningTest3 from "./ListeningTest3";
import ListeningTest4 from "./ListeningTest4";
import ListeningTest5 from "./ListeningTest5";
import ListeningTest6 from "./ListeningTest6";

const tests = [
  { id: 1, title: "Practice Test 1", Component: ListeningTest },
  { id: 2, title: "Practice Test 2", Component: ListeningTest2 },
  { id: 3, title: "Practice Test 3", Component: ListeningTest3 },
  { id: 4, title: "Practice Test 4", Component: ListeningTest4 },
  { id: 5, title: "Practice Test 5", Component: ListeningTest5 },
  { id: 6, title: "Practice Test 6", Component: ListeningTest6 },
];

export default function ListeningHub() {
  const { t } = useTranslation();
  const [activeTest, setActiveTest] = useState(null);

  const testDescriptions = [
    t('listeningHub.desc1', "General & Academic Listening practice"),
    t('listeningHub.desc2', "Focus on daily life and social contexts"),
    t('listeningHub.desc3', "Educational and training contexts"),
    t('listeningHub.desc4', "Academic discussions and lectures"),
    t('listeningHub.desc5', "Mixed contexts with varying accents"),
    t('listeningHub.desc6', "Comprehensive full-length exam"),
  ];

  return (
    <div className="min-h-screen pt-28 pb-12 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col gap-6 w-full text-slate-800 dark:text-slate-200">
      
      {!activeTest ? (
        <div className="w-full max-w-5xl mx-auto px-4 lg:px-8">
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
                    {t('listeningHub.title', "Listening Practice Tests")}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                    {t('listeningHub.subtitle', "Choose a test below to start your IELTS Listening practice.")}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test, idx) => (
                    <motion.div
                        key={test.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/80 dark:bg-black/95 glass-card backdrop-blur-2xl rounded-3xl p-6 border border-slate-200 dark:border-red-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(220,38,38,0.15)] hover:shadow-xl dark:hover:shadow-[0_12px_40px_rgba(220,38,38,0.3)] hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 flex items-center justify-center text-xl">
                                <FaHeadphones />
                            </div>
                            <span className="text-xs font-bold px-3 py-1 bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full">
                                60 {t('listeningHub.min', "Мин")}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                            {t(`listeningHub.test${test.id}`, test.title)}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1">
                            {testDescriptions[idx]}
                        </p>

                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setActiveTest(test);
                            }}
                            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors group-hover:shadow-lg group-hover:shadow-red-600/30"
                        >
                            {t('listeningHub.startBtn', "Начать Тест")} <FaPlay className="text-xs" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
      ) : (
        <div className="w-full">
            <div className="flex-1 min-w-0 bg-transparent">
                <AnimatePresence mode="wait">
                <motion.div
                    key={activeTest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    {activeTest.Component && <activeTest.Component onExit={() => setActiveTest(null)} />}
                </motion.div>
                </AnimatePresence>
            </div>
        </div>
      )}

    </div>
  );
}
