import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaGamepad, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaRedo,
    FaLightbulb, 
    FaTrophy
} from 'react-icons/fa';

const missingLettersList = [
    { word: "beautiful", masked: "b_aut_ful", hint: "Juda chiroyli" },
    { word: "knowledge", masked: "kn_wl_dge", hint: "Bilim" },
    { word: "important", masked: "imp_rt_nt", hint: "Muhim" },
    { word: "tomorrow", masked: "t_m_rr_w", hint: "Ertaga" },
    { word: "language", masked: "l_ng_age", hint: "Til" },
    { word: "dictionary", masked: "d_ct_on_ry", hint: "Lug'at" },
    { word: "successful", masked: "s_cc_ssf_l", hint: "Muvaffaqiyatli" },
    { word: "experience", masked: "exp_r_ence", hint: "Tajriba" }
];

export default function Game5() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const currentItem = missingLettersList[currentIndex];
    
    const [userInput, setUserInput] = useState('');
    const [message, setMessage] = useState(null);

    const handleCheck = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        if (userInput.trim().toLowerCase() === currentItem.word.toLowerCase()) {
            setMessage({ type: 'success', text: t("gamesPage.games.missingLetters.correct") });
            setScore(prev => prev + 1);
        } else {
            setMessage({ type: 'error', text: t("gamesPage.games.missingLetters.incorrect") });
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < missingLettersList.length) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setMessage(null);
        } else {
            setIsCompleted(true);
        }
    };

    const restartGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setIsCompleted(false);
        setUserInput('');
        setMessage(null);
    };

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="w-full py-0 px-3 sm:px-4 max-w-md mx-auto select-none flex flex-col justify-center items-center"
        >
            <div data-aos="fade-down" className="text-center mb-3 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black mb-2 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    Missing Letters
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    Harflarni Topish
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    {t("gamesPage.games.missingLetters.gameDesc")}
                </p>
            </div>

            <div 
                data-aos="fade-up" data-aos-delay="200"
                className="w-full glass-card border border-gray-200/60 dark:border-gray-800/80 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden"
            >
                {!isCompleted ? (
                    <div>
                        <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-400">
                            <span className="bg-red-500/10 text-red-500 dark:text-red-400 px-2.5 py-1 rounded-full">
                                {t("gamesPage.common.score")} {score}
                            </span>
                            <span>
                                {currentIndex + 1} / {missingLettersList.length}
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-4 mb-4 text-center shadow-lg shadow-indigo-500/20 text-white"
                            >
                                <span className="block text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">
                                    {t("gamesPage.games.missingLetters.label")}
                                </span>
                                <span className="text-3xl sm:text-4xl font-mono font-black tracking-[0.3em] drop-md">
                                    {currentItem.masked.toUpperCase()}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <FaLightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="italic">{currentItem.hint}</span>
                        </div>

                        <form onSubmit={handleCheck} className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={t("gamesPage.games.missingLetters.placeholder")}
                                disabled={message?.type === 'success'}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold text-center"
                            />
                            
                            <AnimatePresence>
                                {message && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`flex items-center justify-center gap-2 text-sm font-bold p-3 rounded-xl ${
                                            message.type === 'success' 
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                        }`}
                                    >
                                        {message.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {message?.type === 'success' ? (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={handleNext}
                                    type="button"
                                    className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
                                >
                                    {t("gamesPage.common.next")} <FaCheckCircle />
                                </motion.button>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm"
                                >
                                    Tekshirish
                                </button>
                            )}
                        </form>
                    </div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTrophy className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                            Ajoyib natija!
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                            {t("gamesPage.common.totalScore")} {score}
                        </p>
                        <button
                            onClick={restartGame}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm"
                        >
                            <FaRedo /> {t("gamesPage.common.playAgain")}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
