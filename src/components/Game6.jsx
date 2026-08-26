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

const oddOneOutList = [
    { words: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 'Carrot', hint: 'Uchalasi meva, bittasi sabzavot' },
    { words: ['Car', 'Bus', 'Train', 'Apple'], odd: 'Apple', hint: 'Transport vositalari' },
    { words: ['Run', 'Jump', 'Swim', 'Beautiful'], odd: 'Beautiful', hint: 'Harakat nomlari (fe\'llar)' },
    { words: ['Cat', 'Dog', 'Lion', 'Chair'], odd: 'Chair', hint: 'Hayvonlar' },
    { words: ['Red', 'Blue', 'Happy', 'Green'], odd: 'Happy', hint: 'Ranglar' },
    { words: ['Monday', 'Tuesday', 'January', 'Friday'], odd: 'January', hint: 'Hafta kunlari' },
    { words: ['Doctor', 'Teacher', 'Hospital', 'Engineer'], odd: 'Hospital', hint: 'Kasb nomlari' },
    { words: ['Sun', 'Moon', 'Star', 'Tree'], odd: 'Tree', hint: 'Osmon jismlari' }
];

export default function Game6() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const currentItem = oddOneOutList[currentIndex];
    const [message, setMessage] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);

    const handleWordClick = (word) => {
        if (message) return; // Prevent clicking multiple times
        
        setSelectedWord(word);

        if (word === currentItem.odd) {
            setMessage({ type: 'success', text: "To'g'ri! Ortiqcha so'z: " + word });
            setScore(prev => prev + 1);
        } else {
            setMessage({ type: 'error', text: "Xato. Ortiqcha so'z: " + currentItem.odd + " edi." });
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < oddOneOutList.length) {
            setCurrentIndex(currentIndex + 1);
            setMessage(null);
            setSelectedWord(null);
        } else {
            setIsCompleted(true);
        }
    };

    const restartGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setIsCompleted(false);
        setMessage(null);
        setSelectedWord(null);
    };

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="w-full py-0 px-3 sm:px-4 max-w-md mx-auto select-none flex flex-col justify-center items-center"
        >
            <div data-aos="fade-down" className="text-center mb-3 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black mb-2 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    Odd One Out
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    Ortiqchasini Toping
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    Berilgan 4 ta so'zdan mantiqan guruhga kirmaydigan bittasini tanlang.
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
                                Ball: {score}
                            </span>
                            <span>
                                {currentIndex + 1} / {oddOneOutList.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-6 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <FaLightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="italic">{currentItem.hint}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {currentItem.words.map((word, idx) => {
                                const isSelected = selectedWord === word;
                                const isOdd = word === currentItem.odd;
                                
                                let btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-violet-400 hover:shadow-md";
                                
                                if (message) {
                                    if (isOdd) {
                                        // The correct answer should always be highlighted green when checked
                                        btnClass = "bg-emerald-500 text-white border-emerald-500";
                                    } else if (isSelected && !isOdd) {
                                        // If user selected wrong, highlight red
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
                                        onClick={() => handleWordClick(word)}
                                        className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all duration-300 shadow-sm ${btnClass}`}
                                    >
                                        {word}
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
                                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 text-sm"
                            >
                                Keyingisi <FaCheckCircle />
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
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-violet-500/20 text-sm"
                        >
                            <FaRedo /> Qaytadan o'ynash
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
