import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhoneAlt, FaBookOpen, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { HiArrowLeft } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IMaskInput } from 'react-imask';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    course: 'General English & IELTS Intensive'
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1;
  const ADMIN_CHAT_IDS = ['6383523156', '334572168'];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const digitsOnly = formData.phone.replace(/\D/g, '');

    if (!formData.fullName.trim() || digitsOnly.length < 9) {
      showToast(t('register.phoneError', "Telefon raqamini to'liq kiriting"), 'error');
      return;
    }

    setLoading(true);

    const message = `🆕 Yangi o'quvchi ro'yxatdan o'tdi:\n👤 Ism: ${formData.fullName}\n📱 Tel: +998 ${digitsOnly}\n📖 Kurs: ${formData.course}`;

    try {
      ADMIN_CHAT_IDS.forEach((chatId) => {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: message })
        }).catch((err) => console.error(err));
      });

      const newLead = {
        id: Date.now(),
        isLead: true,
        name: formData.fullName,
        phone: `+998 ${digitsOnly}`,
        type: formData.course,
        date: new Date().toLocaleString('uz-UZ'),
        status: 'Kutilmoqda'
      };

      try {
        const res = await axios.get(import.meta.env.VITE_FIREBASE_DB_URL);
        let currentLeads = [];
        if (res.data !== null) {
          currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data);
        }
        const updatedLeads = [newLead, ...currentLeads];
        await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedLeads);
      } catch (err) {
        console.warn('Sync notice:', err.message);
      }

      const existingLeads = JSON.parse(localStorage.getItem('admin_leads') || '[]');
      localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existingLeads]));

      showToast(t('register.successMsg', "Muvaffaqiyatli ro'yxatdan o'tdingiz! Tez orada bog'lanamiz."), 'success');
      setFormData({ fullName: '', phone: '', course: 'General English & IELTS Intensive' });
    } catch (error) {
      console.error(error);
      showToast("Tarmoqda xatolik yuz berdi. Qaytadan urinib ko'ring.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-28 pb-20 font-sans relative select-none">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#0f1424] shadow-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
          >
            {toast.type === 'success' ? (
              <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />
            ) : (
              <FaExclamationCircle className="text-rose-500 text-lg shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-semibold">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg w-full relative">
        
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <HiArrowLeft className="text-sm" />
          <span>Ortga</span>
        </button>

        <div className="premium-surface p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-2xl">
          
          <div className="text-center space-y-2 mb-8">
            <span className="badge-pill mb-1">✦ OptimumELC Ro'yxatdan O'tish</span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {t('register.title', 'Kursga Ro\'yxatdan O\'tish')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t('register.subtitle', "Ma'lumotlaringizni qoldiring va bepul birinchi sinov darsiga ega bo'ling.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('register.fullNameLabel', 'Ism va Familiyangiz')}
              </label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-3.5 text-slate-400 text-xs" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder={t('register.fullNamePlaceholder', 'Masalan: Alisher Vahobov')}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('register.phoneLabel', 'Telefon raqamingiz')}
              </label>
              <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:border-rose-500 transition-colors">
                <span className="pl-3.5 pr-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 select-none py-3">
                  +998
                </span>
                <IMaskInput
                  mask="(00) 000-00-00"
                  name="phone"
                  placeholder="(90) 123-45-67"
                  value={formData.phone}
                  onAccept={(value) => handleChange({ target: { name: 'phone', value } })}
                  className="w-full px-3.5 py-3 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('register.courseLabel', 'Tanlangan kurs')}
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
              >
                <option value="General English & IELTS Intensive">General English & IELTS Intensive</option>
                <option value="Beginner (A1-A2)">Beginner (A1 - A2)</option>
                <option value="Elementary (A2-B1)">Elementary (A2 - B1)</option>
                <option value="Intermediate / Pre-IELTS (B1-B2)">Intermediate / Pre-IELTS (B1 - B2)</option>
                <option value="IELTS Intensive (B2-C1)">IELTS Intensive (B2 - C1)</option>
                <option value="IELTS Mastery 8.5+ (C1-C2)">IELTS Mastery 8.5+ (C1 - C2)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Yuborilmoqda...</span>
                </>
              ) : (
                <>
                  <span>{t('register.submitBtn', 'Ro\'yxatdan o\'tish')}</span>
                  <FaPaperPlane className="text-xs" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
