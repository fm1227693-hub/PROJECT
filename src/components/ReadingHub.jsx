import { useState } from "react";
import { motion } from "framer-motion";
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
        <div data-reveal className="text-center mb-12 sm:mb-14">
          <span className="eyebrow justify-center">IELTS</span>
          <h1 className="display-2 mt-5 text-ink mb-4">
            {t("readingHub.title1")} <span className="serif-accent">{t("readingHub.title2")}</span>
          </h1>
          <p className="lede max-w-2xl mx-auto">
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
              className="card !rounded-[18px] p-6 flex flex-col h-full hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] hover:border-linestrong transition-all duration-500 group"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-[12px] bg-accentsoft border border-accent/20 text-accent flex items-center justify-center text-[17px]">
                  <FaBookOpen />
                </div>
                <span className="text-[11px] font-bold px-3 py-1.5 border border-line text-muted rounded-full">
                  {t("readingHub.duration")}
                </span>
              </div>

              <h3 className="font-display text-[22px] font-semibold text-ink mb-2">
                {t(`readingHub.test${test.id}Title`)}
              </h3>
              <p className="text-muted text-[13.5px] leading-relaxed mb-7 flex-1">
                {t(`readingHub.test${test.id}Desc`)}
              </p>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveTest(test);
                }}
                className="btn btn-outline w-full !py-3 !text-[13px] group-hover:border-accent group-hover:bg-accent group-hover:text-white"
              >
                {t("readingHub.startTest")} <FaPlay className="text-[10px]" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
