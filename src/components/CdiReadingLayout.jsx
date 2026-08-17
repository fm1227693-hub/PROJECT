import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaClock, FaPause, FaPlay, FaMoon, FaSun, FaSignOutAlt, FaRedo, FaChevronLeft, FaChevronRight, FaHighlighter, FaStickyNote, FaEraser, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function CdiReadingLayout({ 
  testTitle, 
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
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Highlight & Note States
  const [contextMenu, setContextMenu] = useState(null);
  const [notes, setNotes] = useState({});
  const [activeNoteModal, setActiveNoteModal] = useState(null); // { id, x, y, text }
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    const handleClickOutside = (e) => {
      if (contextMenu) setContextMenu(null);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

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

  // Timer logic
  useEffect(() => {
    if (submitted || isPaused || timeLeft <= 0) {
      if (timeLeft === 0 && !submitted) onSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused, submitted, onSubmit]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleExit = () => {
    toast((tToast) => (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-bold text-slate-800">{t("readingTest.confirmExit")}</span>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors" 
            onClick={() => {
              toast.dismiss(tToast.id);
              if (onExit) onExit();
              else navigate('/reading-tests');
            }}
          >
            {t("readingTest.yes")}
          </button>
          <button 
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition-colors" 
            onClick={() => toast.dismiss(tToast.id)}
          >
            {t("readingTest.no")}
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  // HIGHLIGHT & NOTE LOGIC
  const handleContextMenu = (e) => {
    // Only allow context menu on passage or questions
    if (!e.target.closest('.passage-content')) return;
    
    const selection = window.getSelection();
    const hasSelection = selection.toString().trim().length > 0;
    const targetLink = e.target.closest('a[href="highlight"], a[href^="note-"]');

    if (hasSelection || targetLink) {
      e.preventDefault();
      // Save range to restore if needed
      let range = null;
      if (hasSelection) {
        range = selection.getRangeAt(0).cloneRange();
      }
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        hasSelection,
        targetLink,
        savedRange: range
      });
    }
  };

  const applyHighlight = () => {
    if (!contextMenu?.savedRange) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(contextMenu.savedRange);
    
    document.designMode = "on";
    document.execCommand("createLink", false, "highlight");
    document.designMode = "off";
    selection.removeAllRanges();
  };

  const applyNote = () => {
    if (!contextMenu?.savedRange) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(contextMenu.savedRange);
    
    const noteId = `note-${Date.now()}`;
    document.designMode = "on";
    document.execCommand("createLink", false, noteId);
    document.designMode = "off";
    selection.removeAllRanges();
    
    // Open modal to type note immediately
    setActiveNoteModal({ id: noteId, x: contextMenu.x, y: contextMenu.y, text: "" });
    setNoteInput("");
  };

  const clearHighlight = () => {
    if (!contextMenu?.targetLink) return;
    
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(contextMenu.targetLink);
    selection.removeAllRanges();
    selection.addRange(range);
    
    document.designMode = "on";
    document.execCommand("unlink");
    document.designMode = "off";
    selection.removeAllRanges();
    
    // If it was a note, optionally delete from state
    const href = contextMenu.targetLink.getAttribute('href');
    if (href?.startsWith('note-')) {
      setNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[href];
        return newNotes;
      });
    }
  };

  const handleContentClick = (e) => {
    const targetLink = e.target.closest('a[href="highlight"], a[href^="note-"]');
    if (targetLink) {
      e.preventDefault();
      const href = targetLink.getAttribute('href');
      if (href.startsWith('note-')) {
        // Show note modal
        setActiveNoteModal({
          id: href,
          x: e.clientX,
          y: e.clientY,
          text: notes[href] || ""
        });
        setNoteInput(notes[href] || "");
      }
    }
  };

  const saveNote = () => {
    if (activeNoteModal) {
      setNotes(prev => ({ ...prev, [activeNoteModal.id]: noteInput }));
      setActiveNoteModal(null);
    }
  };

  const currentPart = parts[activePart];

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#121212] flex flex-col font-sans overflow-hidden ielts-cdi-layout">
      
      <Toaster position="top-center" />
      
      {/* Global styles for highlights & notes */}
      <style>{`
        .ielts-cdi-layout a[href="highlight"] {
          background-color: #fef08a !important; /* yellow-200 */
          color: inherit !important;
          text-decoration: none !important;
          cursor: text;
        }
        .dark .ielts-cdi-layout a[href="highlight"] {
          background-color: #854d0e !important; /* yellow-800 */
        }
        .ielts-cdi-layout a[href^="note-"] {
          background-color: #fed7aa !important; /* orange-200 */
          color: inherit !important;
          text-decoration: underline !important;
          text-decoration-style: dotted !important;
          text-decoration-color: #ea580c !important;
          cursor: pointer;
        }
        .dark .ielts-cdi-layout a[href^="note-"] {
          background-color: #9a3412 !important; /* orange-800 */
          text-decoration-color: #fb923c !important;
        }
      `}</style>

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[9999] bg-white dark:bg-slate-800 shadow-2xl rounded-lg border border-slate-200 dark:border-slate-700 py-1 min-w-[150px] overflow-hidden"
          style={{ top: Math.min(contextMenu.y, window.innerHeight - 150), left: Math.min(contextMenu.x, window.innerWidth - 150) }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.hasSelection && (
            <>
              <button onClick={() => { applyHighlight(); setContextMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                <FaHighlighter className="text-yellow-500" /> {t("readingTest.highlight")}
              </button>
              <button onClick={() => { applyNote(); setContextMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                <FaStickyNote className="text-orange-500" /> {t("readingTest.notes")}
              </button>
            </>
          )}
          {contextMenu.targetLink && (
            <button onClick={() => { clearHighlight(); setContextMenu(null); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700">
              <FaEraser /> {t("readingTest.clear")}
            </button>
          )}
        </div>
      )}

      {/* Note Modal */}
      {activeNoteModal && (
        <div 
          className="fixed z-[9999] bg-yellow-100 shadow-2xl rounded-xl border border-yellow-300 w-64 flex flex-col"
          style={{ top: Math.min(activeNoteModal.y + 15, window.innerHeight - 200), left: Math.min(activeNoteModal.x + 15, window.innerWidth - 250) }}
        >
          <div className="flex justify-between items-center p-2 bg-yellow-200 rounded-t-xl border-b border-yellow-300">
            <span className="text-xs font-bold text-yellow-800 uppercase flex items-center gap-1"><FaStickyNote/> {t("readingTest.note")}</span>
            <button onClick={() => setActiveNoteModal(null)} className="text-yellow-700 hover:text-yellow-900 p-1"><FaTimes /></button>
          </div>
          <textarea
            autoFocus
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="w-full p-3 bg-transparent resize-none h-32 focus:outline-none text-slate-800 text-sm custom-scrollbar"
            placeholder={t("readingTest.typeNote")}
          />
          <div className="p-2 border-t border-yellow-300 flex justify-end">
            <button onClick={saveNote} className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-sm rounded-lg transition-colors">
              {t("readingTest.save")}
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="h-14 lg:h-16 bg-[#1a1a1a] flex items-center justify-between px-4 lg:px-6 text-white select-none">
        <div className="flex items-center gap-4">
          <h1 className="text-xl lg:text-2xl font-black tracking-wider text-red-500">IELTS</h1>
          <span className="hidden md:inline-block text-sm font-medium text-slate-300 border-l border-slate-600 pl-4">{testTitle}</span>
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
                  <span className="text-sm font-bold text-slate-800">{t("readingTest.confirmRestart")}</span>
                  <div className="flex gap-2 justify-end">
                    <button 
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors" 
                      onClick={() => {
                        toast.dismiss(tToast.id);
                        setTimeLeft(3600); 
                        onClearAll();
                      }}
                    >
                      {t("readingTest.yes")}
                    </button>
                    <button 
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-bold transition-colors" 
                      onClick={() => toast.dismiss(tToast.id)}
                    >
                      {t("readingTest.no")}
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

      {submitted && (
        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-2 px-6 flex justify-between items-center shadow-sm">
          <div className="font-bold text-lg text-slate-800 dark:text-white">
            {t("readingTest.score")}: <span className="text-red-600 dark:text-red-400">{score}</span> / 40
          </div>
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            className="px-4 py-1.5 rounded-lg text-sm font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            {showAnswers ? t("readingTest.hideAnswers") : t("readingTest.showAnswers")}
          </button>
        </div>
      )}

      {/* MAIN CONTENT SPLIT */}
      <div 
        className="flex-1 flex flex-col lg:flex-row overflow-hidden relative passage-content"
        onContextMenu={handleContextMenu}
        onClick={handleContentClick}
      >
        
        {isPaused && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{t("readingTest.testPaused")}</h2>
              <button onClick={() => setIsPaused(false)} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
                {t("readingTest.resume")}
              </button>
            </div>
          </div>
        )}

        {/* Left Pane (Passage) */}
        <div className="w-full lg:w-1/2 h-[45%] lg:h-full border-b lg:border-b-0 lg:border-r border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e1e1e] overflow-y-auto custom-scrollbar p-6 lg:p-8">
          <h2 className="text-2xl font-black mb-6 text-center text-slate-800 dark:text-white">
            {currentPart.title}
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            {currentPart.passage}
          </div>
        </div>

        {/* Right Pane (Questions) */}
        <div className="w-full lg:w-1/2 h-[55%] lg:h-full bg-slate-50 dark:bg-[#121212] overflow-y-auto custom-scrollbar p-6 lg:p-8">
          {currentPart.questions}
          
          {submitted && showAnswers && (
            <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  <tr>
                    <th className="p-3 font-bold border-b border-slate-200 dark:border-slate-700 text-center w-20">{t("readingTest.question")}</th>
                    <th className="p-3 font-bold border-b border-slate-200 dark:border-slate-700">{t("readingTest.correctAnswers")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(answerKey).map((q) => (
                    <tr key={q} className="border-b last:border-0 border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 font-bold text-center border-r border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">{q}</td>
                      <td className="p-3 font-mono text-green-600 dark:text-green-400 font-medium">
                        {answerKey[q].join(' / ')}
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
      <div className="h-16 bg-[#2d2d2d] flex items-center justify-between px-4 lg:px-6 select-none shrink-0 text-white">
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
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => { if (activePart < parts.length - 1) setActivePart(activePart + 1); }}
            disabled={activePart === parts.length - 1}
            className="p-2 rounded hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors mr-4"
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
            {submitted ? "Exit" : t("readingTest.submitTest")}
          </button>
        </div>
      </div>

    </div>
  );
}
