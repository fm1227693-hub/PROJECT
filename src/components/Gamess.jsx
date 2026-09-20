import {useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FaArrowRight, FaPuzzlePiece, FaBrain, FaFont, FaLayerGroup, FaKeyboard, FaShapes, FaBook } from 'react-icons/fa'
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
    <div className={`px-4 bg-transparent transition-all duration-300 ${activeGame ? 'h-[100dvh] pt-[85px] pb-2 flex flex-col overflow-hidden' : 'min-h-screen pt-24 pb-16'}`}>
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
              <div className="text-center space-y-5">
                <span className="eyebrow justify-center">
                  {t('gamesPage.badge', "O'yinlar")}
                </span>
                <h1 className="display-2 text-ink">
                  {t('gamesPage.title', "Ingliz tilini o'ynab o'rganamiz")}
                </h1>
                <p className="lede max-w-2xl mx-auto">
                  {t('gamesPage.subtitle', "O'zingizga yoqqan o'yinni tanlang va bilimingizni sinab ko'ring")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {gamesList.map((game) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveGame(game.id)}
                    className="group card !rounded-[18px] cursor-pointer p-6 hover:shadow-[var(--shadow-lift)] hover:border-linestrong"
                  >
                    <div className="w-12 h-12 rounded-[12px] bg-accentsoft border border-accent/20 text-accent flex items-center justify-center text-[19px] mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-400">
                      {game.icon}
                    </div>

                    <h3 className="font-display text-[21px] font-semibold text-ink mb-2">
                      {game.title}
                    </h3>
                    <p className="text-[13.5px] text-muted font-medium leading-relaxed">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-linestrong text-soft hover:text-ink hover:border-ink font-semibold text-[13px] transition-colors cursor-pointer"
                >
                  <FaArrowRight className="w-3 h-3 rotate-180" /> {t('gamesPage.backBtn', "Ortga qaytish")}
                </button>
              </div>
              
              <div className="flex-1 card !rounded-[18px] p-2 sm:p-4 overflow-y-auto relative custom-scrollbar flex flex-col justify-center">
                {gamesList.find(g => g.id === activeGame)?.component}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}