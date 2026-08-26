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

const synonymList = [
    { word: 'Happy', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 'Joyful', hint: 'Xursand' },
    { word: 'Big', options: ['Small', 'Tiny', 'Large', 'Thin'], correct: 'Large', hint: 'Katta' },
    { word: 'Fast', options: ['Slow', 'Quick', 'Lazy', 'Heavy'], correct: 'Quick', hint: 'Tez' },
    { word: 'Beautiful', options: ['Ugly', 'Pretty', 'Dirty', 'Bad'], correct: 'Pretty', hint: 'Chiroyli' },
    { word: 'Smart', options: ['Stupid', 'Clever', 'Dull', 'Crazy'], correct: 'Clever', hint: 'Aqlli' },
    { word: 'Begin', options: ['Stop', 'Finish', 'Start', 'End'], correct: 'Start', hint: 'Boshlash' },
    { word: 'Hard', options: ['Soft', 'Easy', 'Difficult', 'Light'], correct: 'Difficult', hint: 'Qiyin' },
    { word: 'Rich', options: ['Poor', 'Wealthy', 'Broke', 'Sad'], correct: 'Wealthy', hint: 'Boy' }
];

export default function Game7() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const currentItem = synonymList[currentIndex];
    const [message, setMessage] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        if (message) return;
        
        setSelectedOption(option);

        if (option === currentItem.correct) {
            setMessage({ type: 'success', text: t("gamesPage.games.synonymFinder.correct") });
            setScore(prev => prev + 1);
        } else {
            setMessage({ type: 'error', text: t("gamesPage.games.synonymFinder.incorrect") + currentItem.correct });
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < synonymList.length) {
            setCurrentIndex(currentIndex + 1);
            setMessage(null);
            setSelectedOption(null);
        } else {
            setIsCompleted(true);
        }
    };

    const restartGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setIsCompleted(false);
        setMessage(null);
        setSelectedOption(null);
    };

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="w-full py-0 px-3 sm:px-4 max-w-md mx-auto select-none flex flex-col justify-center items-center"
        >
            <div data-aos="fade-down" className="text-center mb-3 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black mb-2 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    Synonym Finder
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    Sinonimni Toping
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    {t("gamesPage.games.synonymFinder.gameDesc")}
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
                                {currentIndex + 1} / {synonymList.length}
                            </span>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 mb-4 text-center shadow-lg shadow-amber-500/20 text-white"
                            >
                                <span className="block text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">
                                    {t("gamesPage.games.synonymFinder.label")}
                                </span>
                                <span className="text-3xl sm:text-4xl font-black tracking-widest drop-md">
                                    {currentItem.word.toUpperCase()}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <FaLightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="italic">{currentItem.hint}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {currentItem.options.map((option, idx) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = option === currentItem.correct;
                                
                                let btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-amber-400 hover:shadow-md";
                                
                                if (message) {
                                    if (isCorrect) {
                                        btnClass = "bg-emerald-500 text-white border-emerald-500";
                                    } else if (isSelected && !isCorrect) {
                                        btnClass = "bg-rose-500 text-white border-rose-500";
                                    } else {
                                        btnClass = "bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-400 dark:text-slate-500 opacity-50";
                                    }
                                }

                                return (
                                    <motion.button
                                        key={idx}
                                        whileHover={!message ? { scale: 1.02 } : {}}
                                        whileTap={!message ? { scale: 0.95 } : {}}
                                        onClick={() => handleOptionClick(option)}
                                        className={`p-3 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all duration-300 shadow-sm ${btnClass}`}
                                    >
                                        {option}
                                    </motion.button>
                                );
                            })}
                        </div>
                        
                        <AnimatePresence>
                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={`flex items-center justify-center gap-2 text-sm font-bold p-3 rounded-xl mb-4 ${
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

                        {message && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={handleNext}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 text-sm"
                            >
                                {t("gamesPage.common.next")} <FaCheckCircle />
                            </motion.button>
                        )}
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
                            Jami ball: {score}
                        </p>
                        <button
                            onClick={restartGame}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-sm"
                        >
                            <FaRedo /> {t("gamesPage.common.playAgain")}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
