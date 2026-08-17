import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaPlay } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ReadingTest1 from "./ReadingTest1";
import ReadingTest2 from "./ReadingTest2";
import ReadingTest3 from "./ReadingTest3";
import ReadingTest4 from "./ReadingTest4";
import ReadingTest5 from "./ReadingTest5";
import ReadingTest6 from "./ReadingTest6";

const tests = [
  { id: 1, title: "Practice Test 1", description: "General Training & Academic mix", Component: ReadingTest1 },
  { id: 2, title: "Practice Test 2", description: "Science and History focus", Component: ReadingTest2 },
  { id: 3, title: "Practice Test 3", description: "Nature and Technology", Component: ReadingTest3 },
  { id: 4, title: "Practice Test 4", description: "Arts and Culture", Component: ReadingTest4 },
  { id: 5, title: "Practice Test 5", description: "Advanced Academic Reading", Component: ReadingTest5 },
  { id: 6, title: "Practice Test 6", description: "Comprehensive Exam", Component: ReadingTest6 },
];

export default function ReadingHub() {
  const [activeTest, setActiveTest] = useState(null);
  const { t } = useTranslation();

  if (activeTest) {
    const TestComponent = activeTest.Component;
    return (
      <div className="bg-transparent">
        <TestComponent onExit={() => setActiveTest(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 font-sans bg-transparent transition-colors flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">
            {t("readingHub.title1")} <span className="text-red-600">{t("readingHub.title2")}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("readingHub.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-transparent rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full backdrop-blur-sm hover:bg-white/30 dark:hover:bg-slate-800/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-500/20 text-red-600 flex items-center justify-center text-xl">
                  <FaBookOpen />
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-200/50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full">
                  {t("readingHub.duration")}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                {t(`readingHub.test${test.id}Title`)}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1">
                {t(`readingHub.test${test.id}Desc`)}
              </p>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveTest(test);
                }}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors group-hover:shadow-lg group-hover:shadow-red-600/30"
              >
                {t("readingHub.startTest")} <FaPlay className="text-xs" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
