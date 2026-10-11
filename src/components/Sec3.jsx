import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import axios from 'axios'

export default function Sec3() {
  const { t, i18n } = useTranslation()

  

  const teachers = [
    {
      id: 'ruxillo',
      name: 'Ruhillo Asrorov',
      image: 'https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/ChatGPT%20Image%20Aug%2029,%202026,%2008_37_57%20PM.png',
      score: '8.0',
      cert: 'IELTS 8.0',
      experience: '4+',
      students: '200+',
      quote: t('ruxillo.description'),
      telegram: 'https://t.me/rukhillo',
    }
  ]

  const [activeTeacher, setActiveTeacher] = useState(teachers[0])
  const [displayedText, setDisplayedText] = useState('')
  const [modal, setModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState('')
  const [toast, setToast] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1;
  const ADMIN_CHAT_IDS = ["6383523156", "334572168"];

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const newLead = {
      id: Date.now(),
      name: name,
      phone: phone,
      type: `Ustoz bilan bog'lanish (${selectedMentor})`,
      status: 'Kutilmoqda',
      date: new Date().toLocaleString('uz-UZ')
    }

    try {
      const res = await axios.get(import.meta.env.VITE_FIREBASE_DB_URL)
      let currentLeads = []
      if (res.data !== null) {
          currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data)
      }
      const updatedLeads = [newLead, ...currentLeads]
      await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedLeads)
      localStorage.setItem('admin_leads', JSON.stringify(updatedLeads))
    } catch (err) {
      console.error(err)
    }

    const message = `Ustoz bilan bog'lanish:\n\nUstoz: ${selectedMentor}\nIsm: ${name}\nTel: ${phone}`

    try {
      ADMIN_CHAT_IDS.forEach(chatId => {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message })
        }).catch(err => console.error(err))
      })
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
    setModal(false)
    setName('')
    setPhone('')
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <section className="relative pt-2 sm:pt-4 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ">
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
      <div className="relative max-w-7xl mx-auto ">
        <div data-aos="fade-up" className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-red-600 dark:text-red-400 text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
            {t('sec3.badge')}
          </span>
        </div>
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center mb-4 sm:mb-6 px-2"
        >
          {t('sec3.title')}
        </h2>

        {/* O'qituvchilar tanlash paneli */}
        <div
          data-aos="fade-up"
          data-aos-delay="150"
          className="flex items-center justify-center gap-2.5 sm:gap-3 overflow-x-auto pb-4 sm:pb-6 mb-6 sm:mb-8 scrollbar-none px-2 pt-1"
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
                    ? 'flex items-center gap-2.5 sm:gap-3 bg-white/60 backdrop-blur-md border border-white/50 dark:bg-slate-900 text-slate-900 dark:text-white p-1 pr-4 sm:pr-5 shadow-xl shadow-slate-900/10 dark:shadow-white/10 ring-2 ring-red-400'
                    : 'p-1 opacity-80 hover:opacity-100 bg-white/30 backdrop-blur-sm border border-white/40 dark:bg-white/5 dark:border-white/10'
                }`}
              >
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-red-400 "
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mt-6">

          {/* Chap qism: Editorial Portrait Frame (5 ustun) */}
          <div className="lg:col-span-5 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTeacher.id}
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -20 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full max-w-sm rounded-[2.2rem] bg-gradient-to-b from-white/10 via-white/[0.03] to-transparent dark:from-white/[0.08] dark:via-white/[0.02] dark:to-transparent border border-black/10 dark:border-white/10 p-3 shadow-2xl backdrop-blur-xl relative group overflow-hidden"
              >
                {/* Asymmetrical Crimson Backlight inside card */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-600/25 rounded-full blur-[60px] pointer-events-none" />

                {/* Portrait Container */}
                <div className="relative h-72 sm:h-80 rounded-[1.8rem] overflow-hidden border border-white/10">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    src={currentTeacher.image}
                    alt={currentTeacher.name}
                    className="w-full h-full object-cover object-top filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070911] via-transparent to-transparent opacity-90" />
                  
                  {/* Floating Certified Badge */}
                  <div className="absolute top-3.5 right-3.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[11px] font-black uppercase tracking-wider">{currentTeacher.cert}</span>
                  </div>

                  {/* Name inside image bottom */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-2xl font-black text-white font-heading tracking-tight drop-shadow-md">
                      {currentTeacher.name}
                    </h3>
                    <p className="text-red-400 text-xs font-bold uppercase tracking-wider">
                      Senior IELTS Expert
                    </p>
                  </div>
                </div>

                {/* Sub-info tags strip */}
                <div className="p-4 pt-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    {t('sec3.students')}: <strong className="text-red-600 dark:text-red-400">{currentTeacher.students}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    {t('sec3.experience')}: <strong className="text-red-600 dark:text-red-400">{currentTeacher.experience}</strong>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* O'ng qism: Metrics & Bio (7 ustun) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* 4 ta Zamonaviy Minimalist Metrika Bloklari */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTeacher.id + '-stats'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
              >
                {[
                  { value: currentTeacher.score, label: t('sec3.ieltsScore'), highlight: true },
                  { value: currentTeacher.cert, label: t('sec3.certified'), highlight: false },
                  { value: currentTeacher.experience, label: t('sec3.experience'), highlight: false },
                  { value: currentTeacher.students, label: t('sec3.students'), highlight: false },
                ].map((stat, sIdx) => (
                  <div
                    key={sIdx}
                    className="relative rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.08] p-4 flex flex-col justify-between transition-all duration-300 hover:border-red-500/30 hover:scale-[1.02] shadow-sm backdrop-blur-md"
                  >
                    <span className={`text-2xl sm:text-3xl font-black font-heading ${stat.highlight ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-500' : 'text-slate-900 dark:text-white'}`}>
                      {stat.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Typewriter Quote / Bio Card */}
            <div className="relative rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.08] p-5 sm:p-6 backdrop-blur-md">
              <div className="absolute top-4 left-4 text-red-500/20 text-4xl font-serif pointer-events-none select-none">“</div>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed pl-6 relative z-10 font-medium min-h-[90px] flex items-center">
                <span>
                  {displayedText}
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-1.5 h-4 ml-1 bg-red-600 align-middle"
                  />
                </span>
              </p>
            </div>

            {/* Direct Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                href={currentTeacher.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-900 dark:text-white border border-black/5 dark:border-white/10 text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Telegram orqali suhbat</span>
              </motion.a>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setSelectedMentor(currentTeacher.name)
                  setModal(true)
                }}
                className="w-full sm:flex-1 py-3.5 px-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('sec3.contactBtn')}</span>
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
                <FaTimes />
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-red-500 transition"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-bold py-3 rounded-xl transition-all duration-300 text-sm shadow-[0_6px_20px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_25px_rgba(220,38,38,0.5)] border border-red-500/30 relative overflow-hidden group disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? <FaSpinner className="animate-spin mx-auto" /> : t('sec3.submitBtn')}
                  </span>
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
            <FaCheckCircle className="text-xl text-white" />
            <span>{t('sec3.successToast')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}