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

const sentencesList = [
    { sentence: "My name is John", hint: "O'zini tanishtirish" },
    { sentence: "I love learning English", hint: "Til o'rganishga bo'lgan muhabbat" },
    { sentence: "She is reading a book", hint: "U hozir nima qilyapti?" },
    { sentence: "They went to the park", hint: "O'tgan zamonda qaerga borishdi?" },
    { sentence: "What time is it", hint: "Vaqtni so'rash" },
    { sentence: "Can you help me", hint: "Yordam so'rash" },
    { sentence: "The weather is very nice", hint: "Ob-havo haqida" },
    { sentence: "I will call you tomorrow", hint: "Kelajakdagi harakat" }
];

export default function Game4() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    
    const currentItem = sentencesList[currentIndex];

    // Shuffles an array
    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const [availableWords, setAvailableWords] = useState(() => shuffleArray(currentItem.sentence.split(' ')));
    const [builtWords, setBuiltWords] = useState([]);
    const [message, setMessage] = useState(null);

    const handleWordClick = (word, index, fromAvailable) => {
        if (message?.type === 'success') return; // prevent clicking if already correct

        if (fromAvailable) {
            const newAvailable = [...availableWords];
            newAvailable.splice(index, 1);
            setAvailableWords(newAvailable);
            setBuiltWords([...builtWords, word]);
        } else {
            const newBuilt = [...builtWords];
            newBuilt.splice(index, 1);
            setBuiltWords(newBuilt);
            setAvailableWords([...availableWords, word]);
        }
    };

    const handleCheck = () => {
        if (builtWords.length !== currentItem.sentence.split(' ').length) {
            setMessage({ type: 'error', text: t("gamesPage.games.sentenceBuilder.errorAllWords") });
            setTimeout(() => setMessage(null), 2000);
            return;
        }

        const userSentence = builtWords.join(' ');
        if (userSentence === currentItem.sentence) {
            setMessage({ type: 'success', text: t("gamesPage.games.sentenceBuilder.correct") });
            setScore(prev => prev + 1);
        } else {
            setMessage({ type: 'error', text: t("gamesPage.games.sentenceBuilder.errorOrder") });
            setTimeout(() => setMessage(null), 2000);
        }
    };

    const handleNext = () => {
        if (currentIndex + 1 < sentencesList.length) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            const nextItem = sentencesList[nextIndex];
            setAvailableWords(shuffleArray(nextItem.sentence.split(' ')));
            setBuiltWords([]);
            setMessage(null);
        } else {
            setIsCompleted(true);
        }
    };

    const restartGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setIsCompleted(false);
        const firstItem = sentencesList[0];
        setAvailableWords(shuffleArray(firstItem.sentence.split(' ')));
        setBuiltWords([]);
        setMessage(null);
    };

    return (
        <div 
            style={{ fontFamily: "'Merriweather', serif" }}
            className="w-full py-0 px-3 sm:px-4 max-w-md mx-auto select-none flex flex-col justify-center items-center"
        >
            <div data-aos="fade-down" className="text-center mb-3 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black mb-2 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    Sentence Builder
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    Gap Tuzish
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    {t("gamesPage.games.sentenceBuilder.gameDesc")}
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
                                {currentIndex + 1} / {sentencesList.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800">
                            <FaLightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                            <span className="italic">{currentItem.hint}</span>
                        </div>

                        {/* Built Words Area */}
                        <div className="min-h-[80px] bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-3 mb-4 flex flex-wrap gap-2 items-start border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <AnimatePresence>
                                {builtWords.length === 0 && (
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-400 text-sm mt-1 ml-1"
                                    >
                                        {t("gamesPage.games.sentenceBuilder.placeholder")}
                                    </motion.span>
                                )}
                                {builtWords.map((word, idx) => (
                                    <motion.button
                                        key={`built-${word}-${idx}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => handleWordClick(word, idx, false)}
                                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-red-500 transition-colors"
                                    >
                                        {word}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Available Words Area */}
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                            <AnimatePresence>
                                {availableWords.map((word, idx) => (
                                    <motion.button
                                        key={`avail-${word}-${idx}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        onClick={() => handleWordClick(word, idx, true)}
                                        className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg text-sm font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:border-red-400 hover:text-red-500 transition-colors"
                                    >
                                        {word}
                                    </motion.button>
                                ))}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mb-4 flex items-center justify-center gap-2 text-sm font-bold p-3 rounded-xl ${
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
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm"
                            >
                                {t("gamesPage.common.next")} <FaCheckCircle />
                            </motion.button>
                        ) : (
                            <button
                                onClick={handleCheck}
                                disabled={builtWords.length === 0}
                                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-500/20 text-sm"
                            >
                                Tekshirish
                            </button>
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
                            {t("gamesPage.common.totalScore")} {score}
                        </p>
                        <button
                            onClick={restartGame}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20 text-sm"
                        >
                            <FaRedo /> {t("gamesPage.common.playAgain")}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
