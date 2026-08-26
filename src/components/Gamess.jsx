import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaGamepad, FaArrowLeft, FaPuzzlePiece, FaBrain, FaFont, FaLayerGroup, FaKeyboard, FaShapes, FaBook } from 'react-icons/fa'
import { BsStars } from 'react-icons/bs'
import Games from './Game'
import Game1 from './Game1'
import Game2 from './Game2'
import Game3 from './Game3'
import Game4 from './Game4'
import Game5 from './Game5'
import Game6 from './Game6'
import Game7 from './Game7'

export default function Gamess() {
  const { t } = useTranslation()
  const [activeGame, setActiveGame] = useState(null)

  const gamesList = [
    {
      id: 'game',
      component: <Games />,
      title: t('gamesPage.games.wordScramble.title', 'Word Scramble'),
      description: t('gamesPage.games.wordScramble.desc', "So'zlarni to'g'ri yig'ing"),
      icon: <FaFont />,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'game1',
      component: <Game1 />,
      title: t('gamesPage.games.vocabMatch.title', 'Vocabulary Match'),
      description: t('gamesPage.games.vocabMatch.desc', "So'zlarni va ma'nolarini moslang"),
      icon: <FaPuzzlePiece />,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'game2',
      component: <Game2 />,
      title: t('gamesPage.games.grammarQuiz.title', 'Grammar Quiz'),
      description: t('gamesPage.games.grammarQuiz.desc', "Grammatika bo'yicha testlar"),
      icon: <BsStars />,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'game3',
      component: <Game3 />,
      title: t('gamesPage.games.memoryGame.title', 'Memory Game'),
      description: t('gamesPage.games.memoryGame.desc', "So'zlarni yodda saqlash mashqi"),
      icon: <FaBrain />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'game4',
      component: <Game4 />,
      title: t('gamesPage.games.sentenceBuilder.title', 'Sentence Builder'),
      description: t('gamesPage.games.sentenceBuilder.desc', "So'zlardan to'g'ri gap tuzing"),
      icon: <FaLayerGroup />,
      color: 'from-rose-500 to-red-600'
    },
    {
      id: 'game5',
      component: <Game5 />,
      title: t('gamesPage.games.missingLetters.title', 'Missing Letters'),
      description: t('gamesPage.games.missingLetters.desc', "Tushib qolgan harflarni toping"),
      icon: <FaKeyboard />,
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'game6',
      component: <Game6 />,
      title: t('gamesPage.games.oddOneOut.title', 'Odd One Out'),
      description: t('gamesPage.games.oddOneOut.desc', "Ortiqchasini toping"),
      icon: <FaShapes />,
      color: 'from-violet-500 to-fuchsia-500'
    },
    {
      id: 'game7',
      component: <Game7 />,
      title: t('gamesPage.games.synonymFinder.title', 'Synonym Finder'),
      description: t('gamesPage.games.synonymFinder.desc', "So'zlarning ma'nodoshini toping"),
      icon: <FaBook />,
      color: 'from-amber-500 to-orange-600'
    }
  ]

  return (
    <div className={`px-4 font-['Plus_Jakarta_Sans',sans-serif] bg-transparent transition-all duration-300 ${activeGame ? 'h-[100dvh] pt-[85px] pb-2 flex flex-col overflow-hidden' : 'min-h-screen pt-24 pb-16'}`}>
      <div className={`max-w-7xl mx-auto w-full ${activeGame ? 'flex-1 flex flex-col min-h-0' : ''}`}>
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm tracking-wide border border-red-500/20 shadow-sm">
                  <FaGamepad /> {t('gamesPage.badge', "O'yinlar")}
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
                  {t('gamesPage.title', "Ingliz tilini o'ynab o'rganamiz")}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                  {t('gamesPage.subtitle', "O'zingizga yoqqan o'yinni tanlang va bilimingizni sinab ko'ring")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gamesList.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveGame(game.id)}
                    className="relative group cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none p-6"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${game.color} opacity-10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110`} />
                    
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} text-white flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                      {game.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">
                      {game.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium relative z-10">
                      {game.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col min-h-0 h-full"
            >
              <div className="mb-3 flex justify-start shrink-0">
                <button
                  onClick={() => setActiveGame(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors shadow-sm cursor-pointer"
                >
                  <FaArrowLeft /> {t('gamesPage.backBtn', "Ortga qaytish")}
                </button>
              </div>
              
              <div className="flex-1 bg-white/50 dark:bg-[#0b1120]/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-4 overflow-y-auto relative custom-scrollbar flex flex-col justify-center">
                {gamesList.find(g => g.id === activeGame)?.component}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}