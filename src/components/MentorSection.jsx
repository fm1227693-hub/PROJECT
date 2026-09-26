import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaCheckCircle, FaSpinner, FaTelegramPlane } from 'react-icons/fa'
import axios from 'axios'

const TEACHERS = [
  {
    id: 'ruxillo',
    name: 'Ruhillo Asrorov',
    image:
      'https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/ChatGPT%20Image%20Aug%2029,%202026,%2008_37_57%20PM.png',
    score: '8.0',
    cert: 'IELTS 8.0',
    experience: '4+',
    students: '200+',
    quoteKey: 'ruxillo.description',
    telegram: 'https://t.me/rukhillo',
  },
]

/**
 * MentorSection — the instructor presented as an editorial profile.
 * Lead capture (Firebase + Telegram) is preserved exactly as before.
 */
export default function MentorSection() {
  const { t, i18n } = useTranslation()
  const [activeTeacher] = useState(TEACHERS[0])
  const [displayedText, setDisplayedText] = useState('')
  const [modal, setModal] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState('')
  const [toast, setToast] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1
  const ADMIN_CHAT_IDS = ['6383523156', '334572168']

  const currentTeacher = TEACHERS.find((tch) => tch.id === activeTeacher.id) || TEACHERS[0]

  /* Typewriter — state is only written from the timer callback so the render
     pass stays pure (the reset happens on the first tick). */
  useEffect(() => {
    let index = 0
    const fullText = t(currentTeacher.quoteKey, '') || ''
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.substring(0, index))
        index += 1
      } else {
        clearInterval(typingInterval)
      }
    }, 45)
    return () => clearInterval(typingInterval)
  }, [currentTeacher.id, currentTeacher.quoteKey, i18n.language, t])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const newLead = {
      id: Date.now(),
      name,
      phone,
      type: `Ustoz bilan bog'lanish (${selectedMentor})`,
      status: 'Kutilmoqda',
      date: new Date().toLocaleString('uz-UZ'),
    }

    try {
      const res = await axios.get(import.meta.env.VITE_FIREBASE_DB_URL)
      let currentLeads = []
      if (res.data !== null) {
        currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data)
      }
      await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, [newLead, ...currentLeads])
      localStorage.setItem('admin_leads', JSON.stringify([newLead, ...currentLeads]))
    } catch (err) {
      console.error(err)
    }

    const message = `Ustoz bilan bog'lanish:\n\nUstoz: ${selectedMentor}\nIsm: ${name}\nTel: ${phone}`
    try {
      ADMIN_CHAT_IDS.forEach((chatId) => {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message }),
        }).catch((err) => console.error(err))
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
    <section className="st-mentor">
      <div className="st-shell">
        <div className="st-sec-head">
          <div>
            <span className="st-eyebrow">{t('sec3.badge', 'Professional o’qituvchilar')}</span>
            <h2 className="st-h2" style={{ marginTop: 18 }}>
              {t('sec3.title', 'Bizning mutaxassisimiz bilan tanishing')}
            </h2>
          </div>
          <a href={currentTeacher.telegram} target="_blank" rel="noopener noreferrer" className="st-btn st-btn-line st-btn-sweep" data-cursor="Telegram">
            <FaTelegramPlane />
            {t('sec3.contactBtn', "Bog'lanish")}
          </a>
        </div>

        <div className="st-mentor-card">
          <div className="st-mentor-portrait">
            <img src={currentTeacher.image} alt={currentTeacher.name} loading="lazy" />
            <div className="st-mentor-score">
              <span className="st-mono" style={{ color: 'rgba(242,239,233,0.6)' }}>
                {t('sec3.ieltsScore', 'IELTS score')}
              </span>
              <b>{currentTeacher.score}</b>
            </div>
          </div>

          <div>
            <span className="st-mono" style={{ color: 'var(--accent)' }}>
              {t('sec3.certified', 'Certified')} — {currentTeacher.cert}
            </span>
            <h3 className="st-h2" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', margin: '14px 0 20px' }}>
              {currentTeacher.name}
            </h3>
            <p className="st-mentor-quote">{displayedText}</p>

            <div className="st-mentor-facts">
              <div className="st-mentor-fact">
                <b>{currentTeacher.experience}</b>
                <span>{t('sec3.experience', 'Experience')}</span>
              </div>
              <div className="st-mentor-fact">
                <b>{currentTeacher.students}</b>
                <span>{t('sec3.students', 'Students')}</span>
              </div>
              <div className="st-mentor-fact">
                <b>{currentTeacher.score}</b>
                <span>{t('sec3.ieltsScore', 'IELTS score')}</span>
              </div>
            </div>

            <button
              type="button"
              className="st-btn st-btn-fill st-btn-sweep"
              data-cursor="Contact"
              onClick={() => {
                setSelectedMentor(currentTeacher.name)
                setModal(true)
              }}
            >
              {t('sec3.contactBtn', "Bog'lanish")}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <div className="st-modal" onClick={() => setModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="st-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="st-modal-close" onClick={() => setModal(false)} aria-label="Close">
                <FaTimes />
              </button>
              <h3>{t('sec3.modalTitle', 'O’qituvchi bilan bog’lanish')}</h3>
              <p className="st-mono" style={{ color: 'var(--text-3)', marginBottom: 22 }}>
                {t('sec3.selectedTeacher', 'Tanlangan o’qituvchi')} <span style={{ color: 'var(--accent)' }}>{selectedMentor}</span>
              </p>
              <form onSubmit={handleSubmit}>
                <div className="st-field">
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder=" " />
                  <label>{t('sec3.nameLabel', 'Ismingiz')}</label>
                  <span className="bar" />
                </div>
                <div className="st-field">
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder=" " />
                  <label>{t('sec3.phoneLabel', 'Telefon raqamingiz')}</label>
                  <span className="bar" />
                </div>
                <button type="submit" className="st-btn st-btn-fill st-btn-sweep" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <FaSpinner className="spin" /> : t('sec3.submitBtn', 'Yuborish')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            className="st-toast"
          >
            <FaCheckCircle />
            <span>{t('sec3.successToast', 'So’rovingiz muvaffaqiyatli yuborildi!')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
