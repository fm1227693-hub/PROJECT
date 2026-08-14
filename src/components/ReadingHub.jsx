import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookOpen } from "react-icons/fa";
import ReadingTest1 from "./ReadingTest1";
import ReadingTest2 from "./ReadingTest2";
import ReadingTest3 from "./ReadingTest3";
import ReadingTest4 from "./ReadingTest4";
import ReadingTest5 from "./ReadingTest5";
import ReadingTest6 from "./ReadingTest6";

const tests = [
  { id: 1, title: "Practice Test 1", component: <ReadingTest1 /> },
  { id: 2, title: "Practice Test 2", component: <ReadingTest2 /> },
  { id: 3, title: "Practice Test 3", component: <ReadingTest3 /> },
  { id: 4, title: "Practice Test 4", component: <ReadingTest4 /> },
  { id: 5, title: "Practice Test 5", component: <ReadingTest5 /> },
  { id: 6, title: "Practice Test 6", component: <ReadingTest6 /> },
  // Future reading tests can be added here
];

export default function ReadingHub() {
  const [activeTest, setActiveTest] = useState(tests[0]);

  return (
    <div className="min-h-screen pt-28 pb-12 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col gap-6 w-full text-slate-800 dark:text-slate-200">
      
      {/* Top Navigation Tabs */}
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-[1000px] flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto hide-scrollbar">
          {tests.map((test) => (
            <button
              key={test.id}
              onClick={() => {
                  setActiveTest(test);
                  window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex-1 flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-sm min-w-[140px] ${
                activeTest.id === test.id
                  ? "bg-red-600 text-white shadow-md shadow-red-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              }`}
            >
              <FaBookOpen className={activeTest.id === test.id ? "text-white" : "text-red-500"} />
              <span className="whitespace-nowrap">{test.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 bg-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTest.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {activeTest.component}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
