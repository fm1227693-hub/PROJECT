import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Sec3() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    AOS.init({ once: true, offset: 80, duration: 700, easing: 'ease-out-cubic' })
  }, [])

  const teachers = [
    {
      id: 'asilbek',
      name: 'Asilbek Yusupov',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7dWFeDsKR6Jk7w_7kZ1XhSRUxWWF37-LI67gGm_4pcQ&s=10',
      score: '3x9.0',
      cert: 'CELTA',
      experience: '5+',
      students: '3000+',
      quote: t('asilbek.description'),
      telegram: 'https://t.me/asilbek',
    },
    {
      id: 'ruxillo',
      name: 'Ruhillo Asrorov',
      image: '/photo_2026-07-23_23-14-12.jpg',
      score: '8.0',
      cert: 'IELTS 8',
      experience: '6+',
      students: '200+',
      quote: t('ruxillo.description'),
      telegram: 'https://t.me/rukhillo',
    },
    {
      id: 'zarnigor',
      name: 'Zarnigor Okkanyova',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
      score: '8.5',
      cert: 'IELTS 8.5',
      experience: '4+',
      students: '150+',
      quote: t('zarnigor.description'),
      telegram: 'https://t.me/',
    },
    {
      id: 'gulasal',
      name: 'Gulasal Butaeva',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop',
      score: '9.0',
      cert: 'IELTS 9.0',
      experience: '5+',
      students: '600+',
      quote: t('gulasal.description'),
      telegram: 'https://t.me/',
    },
  ]

  const [activeTeacher, setActiveTeacher] = useState(teachers[0])
  const [displayedText, setDisplayedText] = useState('')
  const [modal, setModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState('')
  const [toast, setToast] = useState(false)

  const currentTeacher = teachers.find((tch) => tch.id === activeTeacher.id) || teachers[0]

  // Matnni sekinroq va silliq yozish effekti (45ms)
  useEffect(() => {
    setDisplayedText('')
    let i = 0
    const fullText = currentTeacher.quote || ''
    const typingInterval = setInterval(() => {
      if (i <= fullText.length) {
        setDisplayedText(fullText.substring(0, i))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 45)
    return () => clearInterval(typingInterval)
  }, [currentTeacher.id, i18n.language])

  const handleSubmit = (e) => {
    e.preventDefault()
    setModal(false)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="relative py-12 sm:py-16 px-3 sm:px-6 md:px-8 overflow-hidden transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Orqa fondagi jozibali va sekin pulslanuvchi nurlar */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-5 sm:left-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-red-500/10 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-5 sm:right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/10 rounded-full blur-[120px] sm:blur-[150px] pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto">
        <div data-aos="fade-up" className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-red-600 dark:text-red-400 text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
            {t('sec3.badge')}
          </span>
        </div>
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center mb-8 sm:mb-10 px-2"
        >
          {t('sec3.title')}
        </h2>

        {/* O'qituvchilar tanlash paneli */}
        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="flex items-center justify-start md:justify-center gap-2.5 sm:gap-3 overflow-x-auto pb-8 sm:pb-10 scrollbar-none px-2"
        >
          {teachers.map((teacher) => {
            const isActive = currentTeacher.id === teacher.id
            return (
              <motion.button
                key={teacher.id}
                onClick={() => setActiveTeacher(teacher)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`shrink-0 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'flex items-center gap-2.5 sm:gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 pl-1.5 pr-4 sm:pr-5 py-1.5 shadow-xl shadow-slate-900/10 dark:shadow-white/10 ring-2 ring-red-400'
                    : 'p-0.5 opacity-60 hover:opacity-100 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10'
                }`}
              >
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-red-400"
                />
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-left"
                  >
                    <h4 className="text-xs sm:text-sm font-bold leading-tight">
                      {teacher.name.split(' ')[0]}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-semibold opacity-80">{teacher.cert}</span>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Asosiy kontent grid qismi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-center">

          {/* Chap qism: O'qituvchi kartochkasi */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTeacher.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mx-auto w-full max-w-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl relative group border border-slate-200 dark:border-white/10"
            >
              <div className="relative h-60 sm:h-72 bg-gradient-to-b from-indigo-800 to-purple-900 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={currentTeacher.image}
                  alt={currentTeacher.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-[11px] sm:text-xs font-semibold text-right leading-tight bg-black/40 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10">
                  {currentTeacher.name.split(' ')[0]}
                  <br />
                  {currentTeacher.name.split(' ')[1]}
                </span>
              </div>
              <div className="px-5 pt-4 pb-5 sm:px-6 sm:pt-5 sm:pb-6 bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-950">
                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none mb-3">
                  {currentTeacher.cert}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1 rounded-lg shadow-sm">
                    {t('sec3.students')}: {currentTeacher.students}
                  </span>
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-1 rounded-lg shadow-sm">
                    {t('sec3.experience')}: {currentTeacher.experience}
                  </span>
                </div>

                {/* Kartochka ichidagi matn ham silliq animatsiya bilan chiqadi */}
                <motion.p
                  key={currentTeacher.id + '-desc'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4"
                >
                  {currentTeacher.quote}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* O'ng qism: Statistika va matnlar */}
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTeacher.id + '-stats'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-3 sm:gap-4"
              >
                {[
                  { value: currentTeacher.score, label: t('sec3.ieltsScore') },
                  { value: currentTeacher.cert, label: t('sec3.certified') },
                  { value: currentTeacher.experience, label: t('sec3.experience') },
                  { value: currentTeacher.students, label: t('sec3.students') },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/[0.03] p-4"
                  >
                    <span className="block text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Sekin yoziladigan matn bloki */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-l-2 border-red-500 pl-3 sm:pl-4 min-h-[120px] sm:min-h-[140px] bg-slate-100 dark:bg-white/[0.02] py-3 rounded-r-xl flex items-center"
            >
              <p>
                {displayedText}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1.5 h-4 ml-1 bg-red-500 align-middle"
                />
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                href={currentTeacher.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white text-xs font-semibold py-3.5 rounded-xl transition border border-slate-300 dark:border-white/5 shadow-md"
              >
                Telegram
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedMentor(currentTeacher.name)
                  setModal(true)
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-500/20"
              >
                {t('sec3.contactBtn')}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Oyna */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 dark:bg-[#0f0d24]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md relative text-slate-900 dark:text-white shadow-2xl shadow-purple-950/50"
            >
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-slate-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-sm font-bold"
              >
                ✕
              </motion.button>
              <h3 className="text-lg sm:text-xl font-bold mb-1 pr-6">{t('sec3.modalTitle')}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-5">
                {t('sec3.selectedTeacher')}{' '}
                <span className="text-red-500 font-medium">{selectedMentor}</span>
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('sec3.nameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('sec3.namePlaceholder')}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t('sec3.phoneLabel')}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+998 90 123 45 67"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-red-500/20"
                >
                  {t('sec3.submitBtn')}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Xabarnoma */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-5 right-5 bg-emerald-600 text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-2xl z-50 text-xs sm:text-sm font-medium flex items-center gap-3"
          >
            <span className="animate-bounce">✅</span>
            <span>{t('sec3.successToast')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}