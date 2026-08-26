import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGamepad, FaRedo, FaAward, FaFire, FaStar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const WORDS_DATABASE = [
    { en: 'Eloquent', uz: 'So\'zamol, ta\'sirli gapiradigan', options: ['So\'zamol, ta\'sirli gapiradigan', 'Ijtimoiy odobsiz', 'Yolg\'onchi', 'Sokin'] },
    { en: 'Resilient', uz: 'Chidamli, bardoshli', options: ['Chidamli, bardoshli', 'Zaif', 'Qo\'rqoq', 'Tarsaki'] },
    { en: 'Ambiguous', uz: 'Ikki ma\'noli, tushunarsiz', options: ['Aniq', 'Ikki ma\'noli, tushunarsiz', 'Oson', 'To\'g\'ri'] },
    { en: 'Meticulous', uz: 'O\'ta sinchkov, puxta', options: ['O\'ta sinchkov, puxta', 'E’tiborsiz', 'Shoshqaloq', 'Tartibsiz'] },
    { en: 'Pragmatic', uz: 'Amaliy, real hayotga asoslangan', options: ['Amaliy, real hayotga asoslangan', 'Xayoliy', 'Nazariy', 'Absurd'] },
    { en: 'Benevolent', uz: 'Mehribon, xayrixoh', options: ['Mehribon, xayrixoh', 'Bag\'ritosh', 'Xasis', 'Yovvoyi'] },
    { en: 'Candid', uz: 'Ochiqko\'ngil, samimiy', options: ['Ochiqko\'ngil, samimiy', 'Yashirin', 'Xiyonatkor', 'Bexabar'] },
    { en: 'Ephemeral', uz: 'O\'tkinchi, qisqa muddatli', options: ['O\'tkinchi, qisqa muddatli', 'Abadiy', 'Mangu', 'Mustahkam'] },
    { en: 'Innovative', uz: 'Yangi g\'oyalarni qo\'llovchi', options: ['Eskicha', 'Yangi g\'oyalarni qo\'llovchi', 'Oddiy', 'An\'anaviy'] },
    { en: 'Skeptical', uz: 'Shubha bilan qaraydigan', options: ['Ishonuvchan', 'Shubha bilan qaraydigan', 'Qiziqqon', 'Sokin'] }
]

export default function Game3() {
    const { t } = useTranslation()

    const [shuffledList, setShuffledList] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [streak, setStreak] = useState(0)
    const [selectedOption, setSelectedOption] = useState(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    // O'yin boshlanganda yoki qayta boshlanganda savollarni aralashtirish
    const initGame = () => {
        const randomized = [...WORDS_DATABASE].sort(() => Math.random() - 0.5).map(item => ({
            ...item,
            options: [...item.options].sort(() => Math.random() - 0.5)
        }))
        setShuffledList(randomized)
        setCurrentIndex(0)
        setScore(0)
        setStreak(0)
        setSelectedOption(null)
        setIsAnswered(false)
        setIsFinished(false)
    }

    useEffect(() => {
        initGame()
    }, [])

    if (shuffledList.length === 0) return null

    const currentItem = shuffledList[currentIndex]

    const handleAnswer = (option) => {
        if (isAnswered) return
        setSelectedOption(option)
        setIsAnswered(true)

        const isCorrect = option === currentItem.uz

        if (isCorrect) {
            setScore(prev => prev + 1)
            setStreak(prev => prev + 1)
        } else {
            setStreak(0)
        }

        setTimeout(() => {
            if (currentIndex + 1 < shuffledList.length) {
                setCurrentIndex(prev => prev + 1)
                setSelectedOption(null)
                setIsAnswered(false)
            } else {
                setIsFinished(true)
            }
        }, 1000)
    }

    return (
        <div className="w-full py-4 px-3 sm:px-4 max-w-lg mx-auto font-sans select-none flex flex-col justify-center items-center">
            {/* Sarlavha qismi */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-black mb-3 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    {t('game3.title')}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    {t('game3.title')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    {t('game3.subtitle')}
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
                            {/* Statistika paneli */}
                            <div className="flex justify-between items-center mb-5 text-[11px] font-bold">
                                <span className="flex items-center gap-1.5 bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full border border-red-500/20">
                                    <FaFire className="w-3.5 h-3.5" /> {t('game3.streak')} {streak}
                                </span>
                                <span className="text-gray-400">
                                    {t('game3.question')} {currentIndex + 1} {t('game3.of')} {shuffledList.length}
                                </span>
                            </div>

                            {/* Inglizcha So'z Kartasi */}
                            <motion.div 
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-5 text-center mb-5 shadow-lg shadow-red-500/20"
                            >
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">English Word</span>
                                <h2 className="text-2xl sm:text-3xl font-black mt-1 tracking-wide">
                                    {currentItem.en}
                                </h2>
                            </motion.div>

                            {/* Variantlar Grid */}
                            <div className="grid grid-cols-2 gap-2.5">
                                {currentItem.options.map((opt, idx) => {
                                    let btnStyle = "bg-gray-100/90 dark:bg-gray-950/90 text-gray-700 dark:text-gray-200 border-gray-200/60 dark:border-gray-800/80 hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"

                                    if (isAnswered) {
                                        if (opt === currentItem.uz) {
                                            btnStyle = "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-black"
                                        } else if (opt === selectedOption) {
                                            btnStyle = "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40 font-black"
                                        }
                                    }

                                    return (
                                        <motion.button
                                            key={idx}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => handleAnswer(opt)}
                                            className={`py-3.5 px-3 rounded-2xl text-[11px] sm:text-xs font-bold border transition-all text-center cursor-pointer shadow-sm flex items-center justify-between px-4 leading-snug ${btnStyle}`}
                                        >
                                            <span className="text-left">{opt}</span>
                                            {isAnswered && opt === currentItem.uz && (
                                                <FaCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                                            )}
                                            {isAnswered && opt === selectedOption && opt !== currentItem.uz && (
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
                                {t('game3.finishTitle')}
                            </h2>
                            
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                {t('game3.resultText', { score: score })}
                            </p>
                            
                            {/* Nechta to'g'ri topgani aniq ko'rsatiladigan qism */}
                            <div className="text-lg font-black text-red-600 dark:text-red-400 mb-6 py-2 px-4 rounded-2xl bg-red-500/10 inline-flex items-center gap-2 border border-red-500/20">
                                <FaStar className="w-4 h-4 text-amber-500 animate-spin" />
                                {score} / {shuffledList.length} ta to'g'ri javob
                            </div>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={initGame}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <FaRedo className="w-3.5 h-3.5" />
                                {t('game3.restart')}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}