import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen, FaPlay, FaClock, FaCheckCircle, FaAward } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import ReadingTest1 from "./ReadingTest1";
import ReadingTest2 from "./ReadingTest2";
import ReadingTest3 from "./ReadingTest3";
import ReadingTest4 from "./ReadingTest4";
import ReadingTest5 from "./ReadingTest5";
import ReadingTest6 from "./ReadingTest6";

const tests = [
  { id: 1, title: "Practice Test 1", description: "General Training & Academic mix", Component: ReadingTest1, level: "Band 6.0 - 7.0" },
  { id: 2, title: "Practice Test 2", description: "Science and History focus", Component: ReadingTest2, level: "Band 6.5 - 7.5" },
  { id: 3, title: "Practice Test 3", description: "Nature and Technology", Component: ReadingTest3, level: "Band 7.0 - 8.0" },
  { id: 4, title: "Practice Test 4", description: "Arts and Culture", Component: ReadingTest4, level: "Band 7.0 - 8.0" },
  { id: 5, title: "Practice Test 5", description: "Advanced Academic Reading", Component: ReadingTest5, level: "Band 7.5 - 8.5" },
  { id: 6, title: "Practice Test 6", description: "Comprehensive Exam Simulator", Component: ReadingTest6, level: "Band 8.0 - 9.0" },
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
    <div className="min-h-screen pt-28 pb-20 font-sans bg-transparent transition-colors flex flex-col items-center select-none">
      {/* Ambient Glow */}
      <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 mb-3">
            CDI READING MODULE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight font-heading">
            {t("readingHub.title1", "IELTS Academic")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">{t("readingHub.title2", "Reading Hub")}</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">
            {t("readingHub.subtitle", "Cambridge standartidagi 6 ta to'liq Reading imtihon simulyatori. Haqiqiy vaqt hisobi va javoblar tahlili.")}
          </p>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {tests.map((test, idx) => (
            <div
              key={test.id}
              className="rounded-3xl p-6 sm:p-7 bg-white/85 dark:bg-[#0a0e19]/90 border border-slate-200 dark:border-white/10 hover:border-red-500/40 dark:hover:border-red-500/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/40 flex items-center justify-center text-xl shadow-xs group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <FaBookOpen />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <FaClock className="text-red-500 text-[10px]" />
                      60 daqiqa
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                    {test.level}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5 font-heading group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {t(`readingHub.test${test.id}Title`, test.title)}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">
                  {t(`readingHub.test${test.id}Desc`, test.description)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveTest(test);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-all cursor-pointer text-xs sm:text-sm active:scale-95"
              >
                <span>{t("readingHub.startTest", "Testni boshlash")}</span>
                <FaPlay className="text-[10px]" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
