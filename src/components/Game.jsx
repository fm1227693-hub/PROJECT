import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaGamepad, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaRedo, 
    FaArrowRight, 
    FaLightbulb, 
    FaTrophy
} from 'react-icons/fa';

const wordsList = [
    { word: 'achieve', hint: 'To successfully bring about or reach something' },
    { word: 'brilliant', hint: 'Very bright or clever' },
    { word: 'curriculum', hint: 'Subjects comprising a course of study' },
    { word: 'determined', hint: 'Having made a firm decision' },
    { word: 'environment', hint: 'The surroundings or conditions' },
    { word: 'foundation', hint: 'The lowest load-bearing part of a building' },
    { word: 'knowledge', hint: 'Facts, information, and skills acquired' },
    { word: 'opportunity', hint: 'A set of circumstances that makes it possible to do something' }
];

export default function Games() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [message, setMessage] = useState(null);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const currentItem = wordsList[currentIndex];

    // So'z harflarini aralashtiruvchi funksiya
    const scrambleWord = (str) => {
        return str
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');
    };

    const [scrambled, setScrambled] = useState(() => scrambleWord(currentItem.word));

    const handleCheck = (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        if (userInput.trim().toLowerCase() === currentItem.word.toLowerCase()) {
            setMessage({ type: 'success', text: t('games.wordScramble.correct') });
            setScore(prev => prev + 1);
        } else {
            setMessage({ type: 'error', text: t('games.wordScramble.incorrect') });
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < wordsList.length) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setScrambled(scrambleWord(wordsList[nextIndex].word));
            setUserInput('');
            setMessage(null);
        } else {
            setIsCompleted(true);
        }
    };

    const restartGame = () => {
        setCurrentIndex(0);
        setScrambled(scrambleWord(wordsList[0].word));
        setUserInput('');
        setMessage(null);
        setScore(0);
        setIsCompleted(false);
    };

    return (
        <div 
            style={{ fontFamily: "'Merriweather', serif" }}
            className="w-full py-0 px-3 sm:px-4 max-w-md mx-auto select-none flex flex-col justify-center items-center"
        >
            {/* Sarlavha qismi */}
            <div 
                data-aos="fade-down" 
                className="text-center mb-3 sm:mb-4"
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black mb-2 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    {t('games.title')}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    {t('games.wordScramble.title')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    {t('games.wordScramble.description')}
                </p>
            </div>

            {/* Asosiy O'yin Kartasi */}
            <div 
                data-aos="fade-up" data-aos-delay="200"
                className="w-full glass-card border border-gray-200/60 dark:border-gray-800/80 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden"
            >
                {!isCompleted ? (
                    <div>
                        {/* Progress */}
                        <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-400">
                            <span className="bg-red-500/10 text-red-500 dark:text-red-400 px-2.5 py-1 rounded-full">
                                Ball: {score}
                            </span>
                            <span>
                                {currentIndex + 1} / {wordsList.length}
                            </span>
                        </div>

                        {/* Aralashgan so'z bloki */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl p-4 mb-4 text-center shadow-lg shadow-red-500/20 text-white"
                            >
                                <span className="block text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">
                                    {t('games.wordScramble.scrambledLabel')}
                                </span>
                                <span className="text-2xl sm:text-3xl font-black tracking-widest drop-md">
                                    {scrambled.toUpperCase()}
                                </span>
                            </motion.div>
                        </AnimatePresence>

                        {/* Hint (Maslahat) */}
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <FaLightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="italic">{currentItem.hint}</span>
                        </div>

                        {/* Input va Form */}
                        <form onSubmit={handleCheck} className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder={t('games.wordScramble.placeholder')}
                                disabled={message?.type === 'success'}
                                required
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all text-xs sm:text-sm font-medium"
                            />

                            {message?.type !== 'success' && (
                                <motion.button
                                    whileTap={{ scale: 0.96 }}
                                    type="submit"
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer shadow-red-600/20"
                                >
                                    {t('games.wordScramble.check')}
                                </motion.button>
                            )}
                        </form>

                        {/* Xabar va Keyingi tugma animatsiyasi */}
                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 overflow-hidden"
                                >
                                    <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2.5 mb-3 ${
                                        message.type === 'success' 
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                    }`}>
                                        {message.type === 'success' ? <FaCheckCircle className="w-4 h-4 shrink-0" /> : <FaTimesCircle className="w-4 h-4 shrink-0" />}
                                        <span>{message.text}</span>
                                    </div>

                                    {message.type === 'success' && (
                                        <motion.button
                                            whileTap={{ scale: 0.96 }}
                                            onClick={handleNext}
                                            className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                                        >
                                            {t('games.wordScramble.next')} <FaArrowRight className="w-3 h-3" />
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    /* O'yin tugaganda natija ekrani */
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-16 h-16 bg-red-500/10 text-red-600 dark:text-red-400 rounded-3xl mx-auto flex items-center justify-center mb-4 text-2xl shadow-inner">
                            <FaTrophy className="w-7 h-7 text-red-500 animate-bounce" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2">
                            Ajoyib natija!
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Siz barcha so'zlarni muvaffaqiyatli topdingiz. Umumiy ball: <span className="font-bold text-red-600 dark:text-red-400">{score} / {wordsList.length}</span>
                        </p>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={restartGame}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaRedo className="w-3.5 h-3.5" />
                            Qaytadan boshlash
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}