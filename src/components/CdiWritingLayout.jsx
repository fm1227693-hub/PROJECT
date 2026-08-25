import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaClock, FaPause, FaPlay, FaMoon, FaSun, FaSignOutAlt, FaRedo, FaBrain, FaTimes, FaAward, FaCheckCircle, FaLightbulb, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function CdiWritingLayout({ 
  prompt, 
  essayText1,
  setEssayText1,
  essayText2,
  setEssayText2,
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
  const [activeTask, setActiveTask] = useState('task1'); // 'task1' or 'task2'

  const activePrompt = prompt[activeTask];
  const activeEssayText = activeTask === 'task1' ? essayText1 : essayText2;
  const setActiveEssayText = activeTask === 'task1' ? setEssayText1 : setEssayText2;
  const wordCount = activeEssayText.trim().split(/\s+/).filter(Boolean).length;

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
    <div className="fixed inset-0 z-[100] bg-[#141518] flex flex-col font-sans overflow-hidden ielts-cdi-layout">
      
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="h-14 lg:h-16 bg-[#181920] flex items-center justify-between px-4 lg:px-6 text-white select-none shrink-0 border-b border-[#262c36]">
        <div className="flex items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-black tracking-wider text-[#ed1b24]">IELTS</h1>
          <span className="text-slate-500">|</span>
          <span className="text-sm font-medium text-slate-200">{prompt.title}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-lg lg:text-xl font-bold">
            <span className={timeLeft < 300 ? "text-red-500 animate-pulse" : "text-white"}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-5 text-slate-300">
            <button onClick={() => setIsPaused(!isPaused)} className="hover:text-white transition-colors" title={isPaused ? "Play" : "Pause"}>
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
                        setEssayText1("");
                        setEssayText2("");
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
            }} className="hover:text-white transition-colors hidden sm:block" title="Restart">
              <FaRedo />
            </button>
            <button onClick={toggleDarkMode} className="hover:text-white transition-colors" title="Toggle Theme">
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button onClick={handleExit} className="text-[#ed1b24] hover:text-red-400 transition-colors ml-2" title="Exit Exam">
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {isPaused && !analysisResult && !isAnalyzing && (
          <div className="absolute inset-0 z-50 bg-[#141518]/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-[#1f212a] p-8 rounded-2xl text-center shadow-2xl border border-[#262c36]">
              <h2 className="text-2xl font-bold mb-4 text-white">{t("ieltsWriting.examPaused", "Exam Paused")}</h2>
              <button onClick={() => setIsPaused(false)} className="px-8 py-3 bg-[#ed1b24] text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                {t("ieltsWriting.resume", "Resume")}
              </button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 z-50 bg-[#141518]/80 backdrop-blur-sm flex items-center justify-center">
             <div className="bg-[#1f212a] p-8 rounded-2xl text-center border border-[#353846]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ed1b24] mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-white">{t("ieltsWriting.analyzing", "AI tahlil qilmoqda...")}</h2>
             </div>
          </div>
        )}

        {analysisResult && (
          <div className="absolute inset-0 z-[60] bg-[#141518]/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 overflow-y-auto">
             <div className="bg-[#1f212a] border border-[#353846] rounded-2xl w-full max-w-4xl p-6 lg:p-10 shadow-2xl my-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-white flex items-center gap-3">
                        <FaAward className="text-[#ed1b24]" /> {t("ieltsWriting.resultTitle", "IELTS Baholash Natijasi")}
                    </h2>
                    <button onClick={onClearResult} className="text-slate-400 hover:text-white p-2">
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-[#141518] border border-[#ed1b24]/50 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(237,27,36,0.1)]">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("ieltsWriting.overallBand", "Overall")}</div>
                        <div className="text-4xl font-black text-[#ed1b24]">{analysisResult.overallBand}</div>
                    </div>
                    <div className="bg-[#141518] border border-[#353846] rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("ieltsWriting.taskResp", "Task Resp.")}</div>
                        <div className="text-2xl font-bold text-white">{analysisResult.taskResponse}</div>
                    </div>
                    <div className="bg-[#141518] border border-[#353846] rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("ieltsWriting.coherence", "Coherence")}</div>
                        <div className="text-2xl font-bold text-white">{analysisResult.coherence}</div>
                    </div>
                    <div className="bg-[#141518] border border-[#353846] rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("ieltsWriting.lexical", "Lexical")}</div>
                        <div className="text-2xl font-bold text-white">{analysisResult.lexical}</div>
                    </div>
                    <div className="bg-[#141518] border border-[#353846] rounded-xl p-4 text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t("ieltsWriting.grammar", "Grammar")}</div>
                        <div className="text-2xl font-bold text-white">{analysisResult.grammar}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#141518] border border-green-900/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-green-500 mb-4 flex items-center gap-2">
                            <FaCheckCircle /> {t("ieltsWriting.strengths", "Kuchli taraflari")}
                        </h3>
                        <ul className="list-disc pl-5 text-slate-300 space-y-2 text-sm">
                            {analysisResult.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                    <div className="bg-[#141518] border border-amber-900/30 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2">
                            <FaLightbulb /> {t("ieltsWriting.improvements", "Maslahatlar")}
                        </h3>
                        <ul className="list-disc pl-5 text-slate-300 space-y-2 text-sm">
                            {analysisResult.improvements?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                </div>
             </div>
          </div>
        )}

        {/* Left Pane (Prompt) */}
        <div className="w-full lg:w-1/2 h-[45%] lg:h-full border-b lg:border-b-0 lg:border-r border-[#262c36] bg-[#1f212a] overflow-y-auto custom-scrollbar p-6 lg:p-10 flex flex-col select-none text-slate-200">
          
          <h2 className="text-3xl font-black mb-8 text-center text-white">{activeTask === 'task1' ? 'Task 1' : 'Task 2'}</h2>
          
          {activePrompt.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden shadow-lg bg-white p-4 md:p-6 w-full shrink-0">
              {activePrompt.imageUrl.startsWith('https://quickchart.io') ? (
                  <img src={activePrompt.imageUrl + (activePrompt.imageUrl.includes('?') ? '&' : '?') + 'w=1000&h=600&devicePixelRatio=2.0'} alt="Prompt visual" className="w-full h-auto object-contain" />
              ) : (
                  <img src={activePrompt.imageUrl} alt="Prompt visual" className="w-full h-auto object-contain" />
              )}
            </div>
          )}
          
          <div className="prose prose-invert max-w-none text-[#d1d5db]">
            <p className="font-medium text-lg leading-relaxed whitespace-pre-line mb-6">
              {activePrompt.promptText}
            </p>
            
            <div className="mt-8 pt-6 border-t border-[#353846]">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-3">{t("ieltsWriting.instructionsTitle", "Instructions:")}</p>
              <ul className="list-disc pl-5 text-slate-300 space-y-2">
                {activeTask === 'task1' ? (
                  <>
                    <li>{t("ieltsWriting.t1Instruction1", "Summarize the information by selecting and reporting the main features.")}</li>
                    <li>{t("ieltsWriting.t1Instruction2", "Make comparisons where relevant.")}</li>
                    <li>{t("ieltsWriting.t1Instruction3", "Write at least 150 words.")}</li>
                  </>
                ) : (
                  <>
                    <li>{t("ieltsWriting.t2Instruction1", "Give reasons for your answer and include any relevant examples from your own knowledge or experience.")}</li>
                    <li>{t("ieltsWriting.t2Instruction2", "Write at least 250 words.")}</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Pane (Textarea) */}
        <div className="w-full lg:w-1/2 h-[55%] lg:h-full bg-[#141518] overflow-hidden flex flex-col p-4 lg:p-8">
           <div className="flex-1 bg-[#181d26] rounded-2xl border border-[#262c36] shadow-inner flex flex-col overflow-hidden">
               <textarea
                 value={activeEssayText}
                 onChange={(e) => setActiveEssayText(e.target.value)}
                 disabled={isAnalyzing || analysisResult}
                 placeholder={t('ieltsWriting.placeholder', "Write your essay here...")}
                 className="flex-1 w-full p-6 bg-transparent text-slate-200 resize-none outline-none text-base lg:text-lg leading-relaxed custom-scrollbar placeholder:text-slate-600"
                 spellCheck="false"
               />
           </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="h-16 bg-[#2a2c35] flex items-center justify-between px-4 lg:px-6 select-none shrink-0 text-white">
        <div className="flex gap-4 h-full items-end">
          <button 
             onClick={() => setActiveTask('task1')} 
             className={`px-6 py-3 text-sm font-bold transition-colors border-b-4 ${activeTask === 'task1' ? 'bg-[#353846] border-[#ed1b24] text-white' : 'border-transparent text-slate-400 hover:text-white hover:bg-[#353846]/50'}`}
          >
             Part 1
          </button>
          <button 
             onClick={() => setActiveTask('task2')} 
             className={`px-6 py-3 text-sm font-bold transition-colors border-b-4 ${activeTask === 'task2' ? 'bg-[#353846] border-[#ed1b24] text-white' : 'border-transparent text-slate-400 hover:text-white hover:bg-[#353846]/50'}`}
          >
             Part 2
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-[#181d26] px-4 py-2 rounded-lg font-bold font-mono text-sm border border-[#262c36] flex gap-2 items-center mr-2">
             <span className="text-slate-400">Words:</span>
             <span className={wordCount < activePrompt.suggestedWords ? "text-amber-500" : "text-emerald-500"}>
               {wordCount}
             </span>
          </div>

          <button
            onClick={() => setActiveTask('task1')}
            disabled={activeTask === 'task1'}
            className="p-2 rounded hover:bg-[#353846] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => setActiveTask('task2')}
            disabled={activeTask === 'task2'}
            className="p-2 rounded hover:bg-[#353846] disabled:opacity-30 disabled:cursor-not-allowed transition-colors mr-2 lg:mr-4"
          >
            <FaChevronRight />
          </button>

          <button
            onClick={onSubmit}
            disabled={isAnalyzing || analysisResult}
            className="px-6 lg:px-8 py-2.5 rounded-xl bg-[#ed1b24] hover:bg-red-600 text-white font-bold transition-all shadow-[0_4px_15px_rgba(237,27,36,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("ieltsWriting.submitTest", "Submit Test")}
          </button>
        </div>
      </div>

    </div>
  );
}
