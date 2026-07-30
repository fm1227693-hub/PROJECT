import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGamepad, FaCheckCircle, FaTimesCircle, FaRedo, FaAward, FaStar } from 'react-icons/fa'

const QUIZ_QUESTIONS = [
    // --- BEGINNER (1 - 5) ---
    {
        level: "Beginner",
        question: "Choose the correct pronoun: '___ am a student.'",
        options: ["He", "I", "They", "We"],
        correct: 1
    },
    {
        level: "Beginner",
        question: "What is the plural form of 'Apple'?",
        options: ["Apples", "Apple", "Applis", "Applees"],
        correct: 0
    },
    {
        level: "Beginner",
        question: "Which color is the sky on a clear day?",
        options: ["Red", "Green", "Blue", "Yellow"],
        correct: 2
    },
    {
        level: "Beginner",
        question: "Complete the sentence: 'She ___ to school every day.'",
        options: ["go", "goes", "going", "gone"],
        correct: 1
    },
    {
        level: "Beginner",
        question: "What is the opposite of 'Big'?",
        options: ["Tall", "Small", "Fast", "Hot"],
        correct: 1
    },

    // --- ELEMENTARY (6 - 10) ---
    {
        level: "Elementary",
        question: "Choose the correct past tense of 'Go':",
        options: ["Goed", "Gone", "Went", "Going"],
        correct: 2
    },
    {
        level: "Elementary",
        question: "Which word means 'kitobxonlik' in English?",
        options: ["Reading habit", "Writing", "Speaking", "Listening"],
        correct: 0
    },
    {
        level: "Elementary",
        question: "Complete: 'There ___ three books on the table.'",
        options: ["is", "are", "am", "be"],
        correct: 1
    },
    {
        level: "Elementary",
        question: "Choose the correct question word: '___ old are you?'",
        options: ["What", "Where", "How", "Who"],
        correct: 2
    },
    {
        level: "Elementary",
        question: "What is the comparative form of 'Fast'?",
        options: ["Faster", "Fastest", "More fast", "As fast"],
        correct: 0
    },

    // --- INTERMEDIATE (11 - 15) ---
    {
        level: "Intermediate",
        question: "Choose the correct Present Perfect form: 'I ___ already finished my homework.'",
        options: ["has", "have", "am", "did"],
        correct: 1
    },
    {
        level: "Intermediate",
        question: "What does the idiom 'Piece of cake' mean?",
        options: ["Something delicious", "Very easy", "Difficult task", "A birthday party"],
        correct: 1
    },
    {
        level: "Intermediate",
        question: "Choose the correct preposition: 'He is good ___ playing football.'",
        options: ["in", "at", "on", "with"],
        correct: 1
    },
    {
        level: "Intermediate",
        question: "Select the passive voice: 'They build houses.' -> 'Houses ___.'",
        options: ["are built", "were built", "is built", "built"],
        correct: 0
    },
    {
        level: "Intermediate",
        question: "What is the synonym of 'Acknowledge'?",
        options: ["Deny", "Refuse", "Recognize / Admit", "Ignore"],
        correct: 2
    },

    // --- ADVANCED (16 - 20) ---
    {
        level: "Advanced",
        question: "Choose the correct conditional: 'If I had known, I ___ helped you.'",
        options: ["would have", "will have", "would", "had"],
        correct: 0
    },
    {
        level: "Advanced",
        question: "What does the word 'Ubiquitous' mean?",
        options: ["Rare", "Found everywhere", "Dangerous", "Invisible"],
        correct: 1
    },
    {
        level: "Advanced",
        question: "Choose the correct sentence with inversion:",
        options: ["Seldom I have seen such beauty.", "Seldom have I seen such beauty.", "I have seldom seen such beauty.", "Seldom seen I have such beauty."],
        correct: 1
    },
    {
        level: "Advanced",
        question: "What is the meaning of the phrasal verb 'Put up with'?",
        options: ["To construct", "To tolerate / Endure", "To reject", "To postpone"],
        correct: 1
    },
    {
        level: "Advanced",
        question: "Choose the correct word: 'His speech was so ___ that everyone fell asleep.'",
        options: ["Eloquent", "Tedious", "Vibrant", "Captivating"],
        correct: 1
    }
]

export default function Game2() {
    const { t } = useTranslation()

    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [isAnswered, setIsAnswered] = useState(false)

    const handleOptionClick = (index) => {
        if (isAnswered) return
        setSelectedOption(index)
        setIsAnswered(true)

        if (index === QUIZ_QUESTIONS[currentIndex].correct) {
            setScore(prev => prev + 1)
        }

        setTimeout(() => {
            if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
                setCurrentIndex(prev => prev + 1)
                setSelectedOption(null)
                setIsAnswered(false)
            } else {
                setIsFinished(true)
            }
        }, 1200)
    }

    const restartQuiz = () => {
        setCurrentIndex(0)
        setSelectedOption(null)
        setScore(0)
        setIsFinished(false)
        setIsAnswered(false)
    }

    const currentQ = QUIZ_QUESTIONS[currentIndex]

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="min-h-screen pt-24 pb-12 px-3 sm:px-4 max-w-lg mx-auto select-none flex flex-col justify-center items-center"
        >
            {/* Sarlavha qismi */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-black mb-3 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    {t('game2.title')}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    {t('game2.title')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    {t('game2.subtitle')}
                </p>
            </motion.div>

            {/* Asosiy O'yin Kartasi */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/80 rounded-3xl p-5 sm:p-7 shadow-2xl"
            >
                <AnimatePresence mode="wait">
                    {!isFinished ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Progress va Daraja */}
                            <div className="flex justify-between items-center mb-5 text-[11px] font-bold">
                                <span className="bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full border border-red-500/20">
                                    {t('game2.level')} {currentQ.level}
                                </span>
                                <span className="text-gray-400">
                                    {t('game2.question')} {currentIndex + 1} {t('game2.of')} {QUIZ_QUESTIONS.length}
                                </span>
                            </div>

                            {/* Savol matni */}
                            <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-5 leading-relaxed">
                                {currentQ.question}
                            </h2>

                            {/* Variantlar */}
                            <div className="flex flex-col gap-2.5">
                                {currentQ.options.map((option, idx) => {
                                    let btnStyle = "bg-gray-100/90 dark:bg-gray-950/90 text-gray-700 dark:text-gray-200 border-gray-200/60 dark:border-gray-800/80 hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"

                                    if (isAnswered) {
                                        if (idx === currentQ.correct) {
                                            btnStyle = "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-black"
                                        } else if (idx === selectedOption) {
                                            btnStyle = "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40 font-black"
                                        }
                                    }

                                    return (
                                        <motion.button
                                            key={idx}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleOptionClick(idx)}
                                            className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer shadow-sm ${btnStyle}`}
                                        >
                                            <span>{option}</span>
                                            {isAnswered && idx === currentQ.correct && (
                                                <FaCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                            )}
                                            {isAnswered && idx === selectedOption && idx !== currentQ.correct && (
                                                <FaTimesCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        /* Natija ekrani */
                        <motion.div 
                            key="finish"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-3xl mx-auto flex items-center justify-center mb-4 text-2xl shadow-inner">
                                <FaAward className="w-8 h-8 text-red-500 animate-bounce" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">
                                {t('game2.finishTitle')}
                            </h2>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                {t('game2.resultText', { score: score })}
                            </p>
                            
                            {/* Nechta to'g'ri topgani aniq ko'rsatiladigan qism */}
                            <div className="text-lg font-black text-red-600 dark:text-red-400 mb-6 py-2 px-4 rounded-2xl bg-red-500/10 inline-flex items-center gap-2 border border-red-500/20">
                                <FaStar className="w-4 h-4 text-amber-500 animate-spin" />
                                {score} / 20 ta to'g'ri javob
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={restartQuiz}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaRedo className="w-3.5 h-3.5" />
                                {t('game2.restart')}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}