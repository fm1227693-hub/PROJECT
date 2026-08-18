import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaClock, FaPause, FaPlay, FaMoon, FaSun, FaSignOutAlt, FaRedo, FaBrain, FaTimes, FaAward, FaCheckCircle, FaLightbulb } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function CdiWritingLayout({ 
  prompt, 
  essayText,
  setEssayText,
  wordCount,
  onExit,
  onSubmit,
  isAnalyzing,
  analysisResult,
  onClearResult
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(prompt.timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    // Reset timer when prompt changes
    setTimeLeft(prompt.timeLimit);
    setIsPaused(false);
  }, [prompt]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0 || analysisResult) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, analysisResult]);

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    toast((tToast) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-slate-800">{t("ieltsWriting.confirmExit", "Are you sure you want to exit the exam?")}</span>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors" 
            onClick={() => {
              toast.dismiss(tToast.id);
              if (onExit) onExit();
              else navigate('/');
            }}
          >
            {t("ieltsWriting.yes", "Yes")}
          </button>
          <button 
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition-colors" 
            onClick={() => toast.dismiss(tToast.id)}
          >
            {t("ieltsWriting.no", "No")}
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#121212] flex flex-col font-sans overflow-hidden ielts-cdi-layout">
      
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="h-14 lg:h-16 bg-[#1a1a1a] flex items-center justify-between px-4 lg:px-6 text-white select-none">
        <div className="flex items-center gap-4">
          <h1 className="text-xl lg:text-2xl font-black tracking-wider text-red-500">IELTS</h1>
          <span className="hidden md:inline-block text-sm font-medium text-slate-300 border-l border-slate-600 pl-4">{prompt.title}</span>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="flex items-center gap-2 font-mono text-lg lg:text-xl font-bold">
            <span className={timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            <button onClick={() => setIsPaused(!isPaused)} className="text-slate-300 hover:text-white transition-colors" title={isPaused ? "Play" : "Pause"}>
              {isPaused ? <FaPlay /> : <FaPause />}
            </button>
            <button onClick={() => { 
              toast((tToast) => (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-slate-800">{t("ieltsWriting.confirmRestart", "Are you sure you want to clear your text and restart?")}</span>
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors" 
                      onClick={() => {
                        toast.dismiss(tToast.id);
                        setTimeLeft(prompt.timeLimit); 
                        setEssayText("");
                        onClearResult && onClearResult();
                      }}
                    >
                      {t("ieltsWriting.yes", "Yes")}
                    </button>
                    <button 
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition-colors" 
                      onClick={() => toast.dismiss(tToast.id)}
                    >
                      {t("ieltsWriting.no", "No")}
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
            <button onClick={handleExit} className="text-red-400 hover:text-red-300 transition-colors border-l border-slate-600 pl-3 lg:pl-4" title="Exit Exam">
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {isPaused && !analysisResult && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{t("ieltsWriting.examPaused", "Exam Paused")}</h2>
              <button onClick={() => setIsPaused(false)} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                {t("ieltsWriting.resume", "Resume")}
              </button>
            </div>
          </div>
        )}

        {/* Left Pane (Prompt) */}
        <div className="w-full lg:w-1/2 h-[45%] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e1e1e] overflow-y-auto custom-scrollbar p-6 lg:p-8 flex flex-col select-none">
          {prompt.imageUrl && (
            <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
              <img src={prompt.imageUrl} alt="Prompt visual" className="w-full h-auto object-cover max-h-80" />
            </div>
          )}
          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200">
            <h2 className="text-2xl font-black mb-4">{prompt.title}</h2>
            <div className="p-5 bg-slate-100 dark:bg-slate-800/50 rounded-xl border-l-4 border-red-500 font-medium text-lg leading-relaxed shadow-inner">
              {prompt.promptText}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-2">Instructions:</p>
              <ul className="list-disc pl-5 text-slate-600 dark:text-slate-300 space-y-1">
                {prompt.taskType === 'task1' ? (
                  <>
                    <li>Summarize the information by selecting and reporting the main features.</li>
                    <li>Make comparisons where relevant.</li>
                    <li>Write at least 150 words.</li>
                  </>
                ) : (
                  <>
                    <li>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</li>
                    <li>Write at least 250 words.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane (Textarea) */}
        <div className="w-full lg:w-1/2 h-[55%] lg:h-full bg-slate-50 dark:bg-[#121212] overflow-hidden flex flex-col">
          <textarea
            value={essayText}
            onChange={(e) => setEssayText(e.target.value)}
            disabled={isAnalyzing || analysisResult}
            placeholder={t('ieltsWriting.placeholder', "Write your essay here...")}
            className="flex-1 w-full p-6 lg:p-8 bg-transparent text-slate-800 dark:text-slate-200 resize-none outline-none text-base lg:text-lg leading-relaxed custom-scrollbar placeholder:text-slate-400 dark:placeholder:text-slate-600"
            spellCheck="false"
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-16 bg-[#2d2d2d] flex items-center justify-between px-4 lg:px-6 select-none shrink-0 text-white z-50">
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-4 py-2 rounded-lg font-bold font-mono text-sm shadow-inner border border-slate-700 flex gap-2 items-center">
             <span className="text-slate-400">Word Count:</span>
             <span className={wordCount < prompt.suggestedWords ? "text-amber-400" : "text-emerald-400"}>
               {wordCount}
             </span>
          </div>
          {wordCount < prompt.suggestedWords && (
            <span className="text-xs text-amber-500 hidden sm:inline-block font-bold">
              (Minimum {prompt.suggestedWords} words required)
            </span>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={isAnalyzing || !essayText.trim() || analysisResult}
          className="flex items-center justify-center gap-2 px-6 lg:px-8 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <FaBrain className="animate-spin text-lg" />
          ) : (
            <FaBrain className="text-lg" />
          )}
          <span>{isAnalyzing ? t('ieltsWriting.analyzing', 'Assessing...') : t('ieltsWriting.submit', 'Submit for Assessment')}</span>
        </button>
      </div>

      {/* AI Assessment Result Modal */}
      {analysisResult && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-10 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
            
            <div className="p-6 bg-gradient-to-r from-red-600 to-rose-600 text-white flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black flex items-center gap-3">
                <FaAward className="text-3xl text-amber-300" />
                IELTS Writing Assessment Report
              </h2>
              <button onClick={onClearResult} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-[#121212]">
              {/* Overall Band Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
                  <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">Your Result</h3>
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
                          {analysisResult.wordCount} words | {prompt.type}
                      </p>
                  </div>
                  <div className="text-center sm:text-right">
                      <span className="text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-400 block mb-1">Overall Band</span>
                      <span className="text-5xl font-black text-red-600 dark:text-red-400 font-mono">{analysisResult.overallBand}</span>
                  </div>
              </div>

              {/* Sub Scores */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* TR/TA */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-gray-500 uppercase tracking-wider" title="Task Response / Task Achievement">TR / TA</span>
                          <span className="font-mono text-xl font-black text-red-600 dark:text-red-400">{analysisResult.taskResponse}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-600 h-full rounded-full" style={{ width: `${(analysisResult.taskResponse / 9) * 100}%` }} />
                      </div>
                  </div>
                  {/* CC */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-gray-500 uppercase tracking-wider" title="Coherence and Cohesion">CC</span>
                          <span className="font-mono text-xl font-black text-rose-600 dark:text-rose-400">{analysisResult.coherence}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-rose-600 h-full rounded-full" style={{ width: `${(analysisResult.coherence / 9) * 100}%` }} />
                      </div>
                  </div>
                  {/* LR */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-gray-500 uppercase tracking-wider" title="Lexical Resource">LR</span>
                          <span className="font-mono text-xl font-black text-amber-600 dark:text-amber-400">{analysisResult.lexical}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(analysisResult.lexical / 9) * 100}%` }} />
                      </div>
                  </div>
                  {/* GRA */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-gray-500 uppercase tracking-wider" title="Grammatical Range and Accuracy">GRA</span>
                          <span className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">{analysisResult.grammar}</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(analysisResult.grammar / 9) * 100}%` }} />
                      </div>
                  </div>
              </div>

              {/* Feedback Blocks */}
              <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20">
                      <h4 className="flex items-center gap-2 text-base font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-4"><FaCheckCircle /> Strengths</h4>
                      <ul className="space-y-3">
                          {analysisResult.strengths.map((str, i) => (
                              <li key={i} className="text-sm font-medium text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
                                <span className="text-emerald-500 mt-1"><FaCheckCircle className="text-xs" /></span>
                                <span>{str}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/20">
                      <h4 className="flex items-center gap-2 text-base font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-4"><FaLightbulb /> Areas for Improvement</h4>
                      <ul className="space-y-3">
                          {analysisResult.improvements.map((imp, i) => (
                              <li key={i} className="text-sm font-medium text-amber-900 dark:text-amber-300 flex items-start gap-3">
                                <span className="text-amber-500 mt-1"><FaLightbulb className="text-xs" /></span>
                                <span>{imp}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0 flex justify-end">
              <button 
                onClick={onClearResult}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
