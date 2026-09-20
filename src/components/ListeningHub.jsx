import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeadphones, FaPlay } from "react-icons/fa";
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
    <div className="min-h-screen pt-28 pb-12 flex flex-col gap-6 w-full text-slate-800 dark:text-slate-200">
      
      {!activeTest ? (
        <div className="w-full max-w-5xl mx-auto px-4 lg:px-8">
            <div data-reveal className="text-center mb-12 sm:mb-14">
                <span className="eyebrow justify-center">IELTS</span>
                <h1 className="display-2 mt-5 text-ink mb-4">
                    {t('listeningHub.title', "Listening Practice Tests")}
                </h1>
                <p className="lede max-w-2xl mx-auto">
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
                        className="card !rounded-[18px] p-6 flex flex-col h-full hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] hover:border-linestrong transition-all duration-500 group"
                    >
                        <div className="flex items-start justify-between mb-5">
                            <div className="w-11 h-11 rounded-[12px] bg-accentsoft border border-accent/20 text-accent flex items-center justify-center text-[17px]">
                                <FaHeadphones />
                            </div>
                            <span className="text-[11px] font-bold px-3 py-1.5 border border-line text-muted rounded-full">
                                60 {t('listeningHub.min', "Мин")}
                            </span>
                        </div>
                        <h3 className="font-display text-[22px] font-semibold text-ink mb-2">
                            {t(`listeningHub.test${test.id}`, test.title)}
                        </h3>
                        <p className="text-muted text-[13.5px] leading-relaxed mb-7 flex-1">
                            {testDescriptions[idx]}
                        </p>

                        <button
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                setActiveTest(test);
                            }}
                            className="btn btn-outline w-full !py-3 !text-[13px] group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                        >
                            {t('listeningHub.startBtn', "Начать Тест")} <FaPlay className="text-[10px]" />
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
