import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGamepad, FaRedo, FaTrophy, FaHandshake } from 'react-icons/fa'

export default function Game1() {
    const { t } = useTranslation()

    const [board, setBoard] = useState(Array(9).fill(null))
    const [isXNext, setIsXNext] = useState(true)

    // G'olibni aniqlash funksiyasi
    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Gorizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikal
            [0, 4, 8], [2, 4, 6]             // Diagonal
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i]
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a]
            }
        }
        return null
    }

    const winner = calculateWinner(board)
    const isDraw = !winner && board.every(square => square !== null)

    const handleClick = (index) => {
        if (board[index] || winner) return

        const newBoard = board.slice()
        newBoard[index] = isXNext ? 'X' : 'O'
        setBoard(newBoard)
        setIsXNext(!isXNext)
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setIsXNext(true)
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-3 sm:px-4 max-w-md mx-auto font-sans select-none flex flex-col justify-center items-center">
            {/* Sarlavha qismi */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-black mb-3 shadow-sm">
                    <FaGamepad className="w-3.5 h-3.5" />
                    {t('games1.title')}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
                    {t('games1.title')}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    {t('games1.subtitle')}
                </p>
            </motion.div>

            {/* O'yin kartasi */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col items-center"
            >
                {/* Holat paneli (Status) */}
                <div className="mb-5 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={winner ? 'win' : isDraw ? 'draw' : isXNext}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="py-3 px-4 rounded-2xl bg-gray-100/80 dark:bg-gray-950/80 text-xs font-bold text-center text-gray-700 dark:text-gray-300 shadow-inner flex items-center justify-center gap-2 border border-gray-200/40 dark:border-gray-800/60"
                        >
                            {winner ? (
                                <span className="text-emerald-500 font-black flex items-center gap-1.5 text-sm">
                                    <FaTrophy className="w-4 h-4 text-amber-500" />
                                    {t('games1.winner')} {winner} 🎉
                                </span>
                            ) : isDraw ? (
                                <span className="text-amber-500 font-black flex items-center gap-1.5 text-sm">
                                    <FaHandshake className="w-4 h-4" />
                                    {t('games1.draw')}
                                </span>
                            ) : (
                                <span>
                                    {t('games1.turn')} <strong className="text-red-600 dark:text-red-400 text-sm px-1.5 py-0.5 rounded-lg bg-red-500/10">{isXNext ? 'X' : 'O'}</strong>
                                </span>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Maydon (Grid 3x3) - Compact telefonlarga mos o'lcham */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-[280px] sm:max-w-[320px] aspect-square mb-6">
                    {board.map((cell, index) => (
                        <motion.button
                            key={index}
                            whileTap={{ scale: 0.90 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleClick(index)}
                            className={`rounded-2xl text-3xl sm:text-4xl font-black flex items-center justify-center transition-colors cursor-pointer shadow-md ${
                                cell === 'X'
                                    ? 'bg-red-500/10 text-red-600 border border-red-500/30'
                                    : cell === 'O'
                                    ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/30'
                                    : 'bg-gray-100/90 dark:bg-gray-950/90 text-gray-400 hover:bg-gray-200/80 dark:hover:bg-gray-800 border border-gray-200/60 dark:border-gray-800/80'
                            }`}
                        >
                            <AnimatePresence>
                                {cell && (
                                    <motion.span
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {cell}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </div>

                {/* Qayta boshlash tugmasi */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="w-full max-w-[280px] sm:max-w-[320px] py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                    <FaRedo className="w-3.5 h-3.5" />
                    {t('games1.reset')}
                </motion.button>
            </motion.div>
        </div>
    )
}