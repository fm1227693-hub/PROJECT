import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaPause, FaPlay, FaMoon, FaSun, FaSignOutAlt, FaRedo, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AudioPlayer from "./AudioPlayer"; // Reusing existing AudioPlayer component

export default function CdiListeningLayout({ 
  testTitle, 
  audioSrc,
  parts, 
  answers, 
  answerKey, 
  submitted, 
  onClearAll, 
  onSubmit, 
  onExit,
  score,
  showAnswers,
  setShowAnswers
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activePart, setActivePart] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleExit = () => {
    toast((tToast) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-slate-800">{t("listeningTest.confirmExit", "Are you sure you want to exit?")}</span>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors" 
            onClick={() => {
              toast.dismiss(tToast.id);
              if (onExit) onExit();
              else navigate('/listening-hub');
            }}
          >
            {t("listeningTest.yes", "Yes")}
          </button>
          <button 
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition-colors" 
            onClick={() => toast.dismiss(tToast.id)}
          >
            {t("listeningTest.no", "No")}
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const currentPart = parts[activePart];

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#121212] flex flex-col font-sans overflow-hidden ielts-cdi-layout">
      
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="h-14 lg:h-16 bg-[#1a1a1a] flex items-center justify-between px-4 lg:px-6 text-white select-none shrink-0 z-50 relative">
        <div className="flex items-center gap-4">
          <h1 className="text-xl lg:text-2xl font-black tracking-wider text-red-500">IELTS</h1>
          <span className="hidden md:inline-block text-sm font-medium text-slate-300 border-l border-slate-600 pl-4">{testTitle}</span>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <button onClick={() => { 
              toast((tToast) => (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-slate-800">{t("listeningTest.confirmRestart", "Are you sure you want to restart?")}</span>
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors" 
                      onClick={() => {
                        toast.dismiss(tToast.id);
                        onClearAll();
                        setActivePart(0);
                      }}
                    >
                      {t("listeningTest.yes", "Yes")}
                    </button>
                    <button 
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition-colors" 
                      onClick={() => toast.dismiss(tToast.id)}
                    >
                      {t("listeningTest.no", "No")}
                    </button>
                  </div>
                </div>
              ), { duration: Infinity });
            }} className="text-slate-300 hover:text-white transition-colors hidden sm:block" title="Restart">
              <FaRedo />
            </button>
            <button onClick={toggleDarkMode} className="text-slate-300 hover:text-white transition-colors" title="Toggle Theme">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button onClick={handleExit} className="text-red-400 hover:text-red-300 transition-colors border-l border-slate-600 pl-3 lg:pl-4" title="Exit Test">
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* AUDIO PLAYER BAR */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 relative shadow-sm">
        {audioSrc && <AudioPlayer src={audioSrc} title={`${testTitle} Audio`} />}
      </div>

      {submitted && (
        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-2 px-6 flex justify-between items-center shadow-sm shrink-0">
          <div className="font-bold text-lg text-slate-800 dark:text-white">
            {t("listeningTest.score", "Score")}: <span className="text-red-600 dark:text-red-400">{score}</span> / 40
          </div>
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="px-4 py-1.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            {showAnswers ? t("listeningTest.hideAnswers", "Hide Answers") : t("listeningTest.showAnswers", "Show Answers")}
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1e1e1e] p-6 lg:p-10 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto">
          {currentPart.content || currentPart.questions}
          
          {submitted && showAnswers && (
            <div className="mt-12 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  <tr>
                    <th className="p-3 font-bold border-b border-slate-200 dark:border-slate-700 text-center w-20">{t("listeningTest.question", "Question")}</th>
                    <th className="p-3 font-bold border-b border-slate-200 dark:border-slate-700">{t("listeningTest.correctAnswers", "Correct Answers")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(answerKey).map((q) => (
                    <tr key={q} className="border-b last:border-0 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 font-bold text-center border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">{q}</td>
                      <td className="p-3 font-mono text-green-600 dark:text-green-400 font-medium">
                        {Array.isArray(answerKey[q]) ? answerKey[q].join(' / ') : answerKey[q]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-16 bg-[#2d2d2d] flex items-center justify-between px-4 lg:px-6 select-none shrink-0 text-white relative z-50">
        <div className="flex gap-2">
          {parts.map((part, idx) => (
            <button
              key={idx}
              onClick={() => setActivePart(idx)}
              className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors border-b-4 ${
                activePart === idx 
                  ? "bg-slate-700 border-red-500 text-white" 
                  : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {part.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => { if (activePart > 0) setActivePart(activePart - 1); }}
            disabled={activePart === 0}
            className="p-2 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Previous Part"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => { if (activePart < parts.length - 1) setActivePart(activePart + 1); }}
            disabled={activePart === parts.length - 1}
            className="p-2 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors mr-4"
            title="Next Part"
          >
            <FaChevronRight />
          </button>
          
          <button
            onClick={() => {
              if (submitted) handleExit();
              else onSubmit();
            }}
            className={`px-6 lg:px-8 py-2 rounded-xl font-bold transition-all shadow-lg ${
              submitted 
                ? "bg-slate-600 hover:bg-slate-500 text-white" 
                : "bg-red-600 hover:bg-red-500 text-white shadow-red-500/30"
            }`}
          >
            {submitted ? t("listeningTest.exit", "Exit") : t("listeningTest.submitTest", "Submit")}
          </button>
        </div>
      </div>

    </div>
  );
}
