import {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaCheckCircle, FaSpinner, FaTelegramPlane, FaArrowRight } from 'react-icons/fa'
import axios from 'axios'
import { observeReveals } from '../hooks/useReveal'

export default function Sec3() {
  const { t } = useTranslation()

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
  const [modal, setModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState('')
  const [toast, setToast] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1;
  const ADMIN_CHAT_IDS = ["6383523156", "334572168"];

  const currentTeacher = teachers.find((tch) => tch.id === activeTeacher.id) || teachers[0]

  // O'qituvchi almashganda yangi .mask-reveal elementlarni kuzatish
  useEffect(() => {
    observeReveals()
  }, [activeTeacher.id])

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
    <section className="section-pad !pt-0 select-none">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Chap — portret */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTeacher.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="img-frame mask-reveal relative aspect-[4/5] max-w-[460px] mx-auto lg:mx-0 w-full shadow-[var(--shadow-lift)]"
              >
                <img
                  src={currentTeacher.image}
                  alt={currentTeacher.name}
                  loading="lazy"
                />
                {/* Kredito'lchov chipi */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md border border-line rounded-[14px] px-4 py-3">
                  <div>
                    <p className="font-display text-[19px] font-semibold text-ink leading-none">
                      {currentTeacher.name}
                    </p>
                    <p className="text-[11px] text-muted mt-1">{t('ruxillo.role', 'Senior English Teacher')}</p>
                  </div>
                  <span className="font-display text-[24px] font-semibold text-accent leading-none shrink-0">
                    {currentTeacher.cert}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* O'qituvchi tanlash paneli */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 mt-6">
              {teachers.map((teacher) => {
                const isActive = currentTeacher.id === teacher.id
                return (
                  <button
                    key={teacher.id}
                    onClick={() => setActiveTeacher(teacher)}
                    aria-pressed={isActive}
                    className={`shrink-0 rounded-full flex items-center gap-2.5 p-1.5 pr-4 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-surface border border-accent shadow-soft'
                        : 'border border-line hover:border-linestrong'
                    }`}
                  >
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      loading="lazy"
                      className={`w-9 h-9 rounded-full object-cover transition-all duration-300 ${isActive ? 'ring-2 ring-[var(--accent)]' : 'opacity-70'}`}
                    />
                    {isActive && (
                      <span className="text-[12.5px] font-semibold text-ink">{teacher.name.split(' ')[0]}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* O'ng — tahririy profil */}
          <div className="lg:col-span-6 lg:col-start-7">
            <span className="eyebrow" data-reveal>{t('sec3.badge', 'Professional o‘qituvchilar')}</span>

            <h2 className="display-2 mt-5 text-ink" data-reveal data-reveal-delay="80">
              {t('sec3.title', 'Bizning mutaxassisimiz bilan tanishing')}
            </h2>

            {/* Iqtibor — katta serif italic */}
            <blockquote className="relative mt-7 pl-6 border-l-2 border-accent" data-reveal data-reveal-delay="160">
              <p className="font-display italic text-[19px] sm:text-[21px] leading-[1.5] text-soft line-clamp-5">
                “{currentTeacher.quote}”
              </p>
            </blockquote>

            {/* Meta statistika */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 mt-9 border-t border-l border-line"
              data-reveal
              data-reveal-delay="220"
            >
              {[
                { value: currentTeacher.score, label: t('sec3.ieltsScore', 'IELTS score') },
                { value: 'IELTS', label: t('sec3.certified', 'Certified') },
                { value: currentTeacher.experience, label: t('sec3.experience', 'Experience') },
                { value: currentTeacher.students, label: t('sec3.students', 'Students') },
              ].map((stat, i) => (
                <div key={i} className="border-b border-r border-line p-4 sm:p-5">
                  <p className="font-display text-[26px] sm:text-[30px] font-semibold text-ink leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-muted mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Harakatlar */}
            <div className="flex flex-col sm:flex-row gap-3.5 mt-8" data-reveal data-reveal-delay="280">
              <motion.a
                whileTap={{ scale: 0.97 }}
                href={currentTeacher.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex-1"
              >
                <FaTelegramPlane className="w-4 h-4" />
                Telegram
              </motion.a>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedMentor(currentTeacher.name)
                  setModal(true)
                }}
                className="btn btn-primary flex-1"
              >
                {t('sec3.contactBtn', 'Bog‘lanish')}
                <FaArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal oyna */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-surface border border-line rounded-[18px] p-6 sm:p-8 w-full max-w-md relative text-ink shadow-[var(--shadow-lift)]"
            >
              <button
                type="button"
                onClick={() => setModal(false)}
                aria-label={t('common.close', 'Yopish')}
                className="absolute top-4 right-4 w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink hover:border-linestrong transition-colors cursor-pointer"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
              <h3 className="font-display text-[26px] font-semibold text-ink">{t('sec3.modalTitle', 'O‘qituvchi bilan bog‘lanish')}</h3>
              <p className="text-muted text-[13px] mt-1.5 mb-6">
                {t('sec3.selectedTeacher', 'Tanlangan o‘qituvchi:')}{' '}
                <span className="text-accent font-semibold">{selectedMentor}</span>
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="mentor-name" className="block text-[12px] font-semibold text-muted mb-1.5">
                    {t('sec3.nameLabel', 'Ismingiz')}
                  </label>
                  <input
                    id="mentor-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('sec3.namePlaceholder', 'Ismingizni kiriting')}
                    className="glass-input w-full px-4 py-3 text-[14px] placeholder:text-muted"
                  />
                </div>
                <div>
                  <label htmlFor="mentor-phone" className="block text-[12px] font-semibold text-muted mb-1.5">
                    {t('sec3.phoneLabel', 'Telefon raqamingiz')}
                  </label>
                  <input
                    id="mentor-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="glass-input w-full px-4 py-3 text-[14px] placeholder:text-muted"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading
                    ? <FaSpinner className="w-4 h-4 animate-spin" />
                    : t('sec3.submitBtn', 'Yuborish')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast xabarnoma */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-ink text-bg px-5 py-3.5 rounded-full shadow-[var(--shadow-lift)] z-[200] text-[13px] font-semibold flex items-center gap-3"
          >
            <FaCheckCircle className="w-4 h-4" style={{ color: 'var(--bg)' }} />
            <span>{t('sec3.successToast', 'So‘rovingiz muvaffaqiyatli yuborildi!')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
