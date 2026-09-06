import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPaperPlane, FaCheckCircle, FaSpinner, FaArrowLeft, FaPhoneAlt } from 'react-icons/fa';
import { IMaskInput } from 'react-imask';
import axios from 'axios';

export default function LeadForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [course, setCourse] = useState('General English / IELTS');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1 || 'bot_token';
  const ADMIN_CHAT_IDS = ['6383523156', '334572168'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, '');

    if (!name.trim()) {
      setError(t('sec3.namePlaceholder', 'Ismingizni kiriting'));
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
      type: `Bepul Dars Forma (${course})`,
      date: new Date().toLocaleString('uz-UZ'),
      status: 'Kutilmoqda'
    };

    const telegramText = `🔔 Yangi Ro'yxatdan O'tish:\n\n👤 Ism: ${name}\n📱 Tel: +998 ${cleanDigits}\n📚 Kurs: ${course}\n📅 Sana: ${new Date().toLocaleString('uz-UZ')}`;

    try {
      ADMIN_CHAT_IDS.forEach((chatId) => {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: telegramText })
        }).catch((err) => console.error(err));
      });

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

  return (
    <div className="min-h-screen font-sans pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
      
      {/* Back button */}
      <div className="max-w-2xl mx-auto mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <FaArrowLeft className="text-xs" />
          <span>Ortga qaytish</span>
        </button>
      </div>

      <div className="max-w-2xl mx-auto premium-surface p-6 sm:p-12 rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-2xl">
        
        {success ? (
          <div className="py-12 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 text-3xl">
              <FaCheckCircle />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
              {t('leadForm.successTitle', 'Murojaatingiz qabul qilindi!')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              {t('leadForm.successDesc', "Tez orada operatorlarimiz siz bilan bog'lanib, bepul sinov darsingiz vaqtini tasdiqlashadi.")}
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="btn-primary mt-4"
            >
              Yangi so'rov qoldirish
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="badge-pill mb-2">
                ✦ {t('leadForm.badge', 'Bepul Sinov Darsi')}
              </span>
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('leadForm.titlePrefix', 'Ingliz tilini o\'rganishni')}{' '}
                <span className="text-gradient-accent">
                  {t('leadForm.titleHighlight', 'bugun boshlang!')}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {t('leadForm.description', "Ismingiz va telefon raqamingizni qoldiring. Mutaxassislarimiz siz bilan bog'lanib, barcha savollaringizga javob berishadi.")}
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
                  {t('leadForm.nameLabel', 'Ism va Familiyangiz')}
                </label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-3.5 text-slate-400 text-xs" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('leadForm.namePlaceholder', 'Masalan: Sardor')}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  {t('leadForm.phoneLabel', 'Telefon raqamingiz')}
                </label>
                <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden focus-within:border-rose-500 transition-colors">
                  <span className="pl-3.5 pr-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 select-none py-3.5">
                    +998
                  </span>
                  <IMaskInput
                    mask="(00) 000-00-00"
                    value={phone}
                    onAccept={(val) => setPhone(val)}
                    placeholder="(90) 123-45-67"
                    className="w-full px-3.5 py-3.5 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Qiziqqan yo'nalishingiz
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3.5 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-rose-500 transition-colors"
                >
                  <option value="General English / IELTS">General English / IELTS</option>
                  <option value="Beginner (A1-A2)">Beginner (A1 - A2)</option>
                  <option value="Elementary (A2-B1)">Elementary (A2 - B1)</option>
                  <option value="Pre-IELTS (B1-B2)">Pre-IELTS / Intermediate (B1 - B2)</option>
                  <option value="IELTS Intensive (B2-C1)">IELTS Intensive (B2 - C1)</option>
                  <option value="IELTS Mastery 8.5+ (C1-C2)">IELTS Mastery 8.5+ (C1 - C2)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
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

      </div>
    </div>
  );
}
