import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaPhoneAlt, FaPaperPlane, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { IMaskInput } from 'react-imask';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function ConsultationModal({ isOpen, onClose, defaultCourse = 'General English / IELTS' }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState(defaultCourse);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultCourse) {
      setCourse(defaultCourse);
    }
  }, [defaultCourse]);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError('');
    }
  }, [isOpen]);

  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1 || 'bot_token';
  const ADMIN_CHAT_IDS = ['6383523156', '334572168'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, '');

    if (!name.trim()) {
      setError(t('sec3.namePlaceholder', 'Iltimos, ismingizni kiriting'));
      return;
    }

    if (cleanDigits.length < 9) {
      setError(t('register.phoneError', "Telefon raqamini to'liq kiriting"));
      return;
    }

    setLoading(true);
    setError('');

    const newLead = {
      id: Date.now(),
      name: name.trim(),
      phone: `+998 ${cleanDigits}`,
      course: course,
      type: `Konsultatsiya / Bepul Dars (${course})`,
      date: new Date().toLocaleString('uz-UZ'),
      status: 'Kutilmoqda'
    };

    const telegramText = `🔔 Yangi Ro'yxatdan O'tish (OptimumELC):\n\n👤 Ism: ${name}\n📱 Telefon: +998 ${cleanDigits}\n📚 Kurs / Daraja: ${course}\n📅 Sana: ${new Date().toLocaleString('uz-UZ')}`;

    try {
      // Send Telegram notification
      ADMIN_CHAT_IDS.forEach((chatId) => {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: telegramText })
        }).catch((err) => console.error('Telegram dispatch error:', err));
      });

      // Save to Firebase RTDB if available
      const dbUrl = import.meta.env.VITE_FIREBASE_DB_URL;
      if (dbUrl) {
        try {
          const res = await axios.get(dbUrl);
          let currentLeads = [];
          if (res.data !== null) {
            currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data);
          }
          const updatedLeads = [newLead, ...currentLeads];
          await axios.put(dbUrl, updatedLeads);
        } catch (dbErr) {
          console.warn('Firebase sync notice:', dbErr.message);
        }
      }

      // Save locally
      const existing = JSON.parse(localStorage.getItem('admin_leads') || '[]');
      localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existing]));

      setSuccess(true);
      setName('');
      setPhone('');
    } catch (err) {
      console.error(err);
      setError("Tarmoqda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle Accent Glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>

          {success ? (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-3xl">
                <FaCheckCircle />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('leadForm.successTitle', 'Murojaatingiz qabul qilindi!')}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                {t('leadForm.successDesc', "Tez orada mutaxassislarimiz siz bilan bog'lanib, bepul sinov darsingiz vaqti va tafsilotlarini kelishib olishadi.")}
              </p>
              <button
                onClick={onClose}
                className="btn-primary mt-4 w-full"
              >
                Tushunarli / Got it
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-6 pr-8">
                <span className="badge-pill mb-2">
                  ✦ Bepul Konsultatsiya & Dars
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t('leadForm.formTitle', 'Bepul sinov darsiga yoziling')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  OptimumELC markazida o'zingizga mos kursni tanlang va birinchi darsni bepul sinab ko'ring.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {t('sec3.nameLabel', 'Ism va Familiyangiz')}
                  </label>
                  <div className="relative flex items-center">
                    <FaUser className="absolute left-3.5 text-slate-400 text-xs" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('sec3.namePlaceholder', 'Masalan: Sardor Rahimov')}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    {t('sec3.phoneLabel', 'Telefon raqamingiz')}
                  </label>
                  <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:border-rose-500 transition-colors">
                    <span className="pl-3.5 pr-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 select-none py-3">
                      +998
                    </span>
                    <IMaskInput
                      mask="(00) 000-00-00"
                      value={phone}
                      onAccept={(val) => setPhone(val)}
                      placeholder="(90) 123-45-67"
                      className="w-full px-3.5 py-3 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Tanlangan yo'nalish
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  >
                    <option value="General English / IELTS">General English / IELTS</option>
                    <option value="Beginner (A1-A2)">Beginner (A1 - A2)</option>
                    <option value="Elementary (A2-B1)">Elementary (A2 - B1)</option>
                    <option value="Pre-IELTS / Intermediate (B1-B2)">Pre-IELTS / Intermediate (B1 - B2)</option>
                    <option value="IELTS Intensive (B2-C1)">IELTS Intensive (B2 - C1)</option>
                    <option value="IELTS Mastery 8.5+ (C1-C2)">IELTS Mastery 8.5+ (C1 - C2)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      <span>{t('leadForm.submitting', 'Yuborilmoqda...')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('leadForm.submitBtn', 'Joy band qilish')}</span>
                      <FaPaperPlane className="text-xs" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
