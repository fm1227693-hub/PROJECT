import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaPhoneAlt,
  FaUser,
  FaPaperPlane,
  FaCheckCircle,
  FaSpinner,
  FaGraduationCap,
  FaArrowRight,
  FaTelegramPlane,
  FaShieldAlt
} from 'react-icons/fa';
import { IMaskInput } from 'react-imask';
import axios from 'axios';

export default function CTASection() {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState('IELTS 7.0–8.5+ Maqsadi');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1 || 'bot_token';
  const ADMIN_CHAT_IDS = ['6383523156', '334572168'];

  const goals = [
    { id: 'IELTS 7.0–8.5+ Maqsadi', label: 'IELTS 7.0–8.5+ Maqsadi' },
    { id: 'Erkin So\'zlashuv & Fluency', label: 'Erkin So\'zlashuv & Fluency' },
    { id: 'Noldan Boshlash (Beginner)', label: 'Noldan Boshlash (Beginner)' },
    { id: 'Magistratura & Xorijiy Grant', label: 'Magistratura & Grant' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanDigits = phone.replace(/\D/g, '');

    if (!name.trim()) {
      setError("Iltimos, ismingizni kiriting.");
      return;
    }

    if (cleanDigits.length < 9) {
      setError("Telefon raqami 9 ta raqamdan iborat bo'lishi kerak.");
      return;
    }

    setLoading(true);
    setError('');

    const newLead = {
      id: Date.now(),
      name: name.trim(),
      phone: `+998 ${cleanDigits}`,
      course: selectedGoal,
      type: `Bosh Sahifa Terminali (${selectedGoal})`,
      date: new Date().toLocaleString('uz-UZ'),
      status: 'Kutilmoqda'
    };

    const telegramText = `🔔 Yangi Ro'yxatdan O'tish (OptimumELC Conversion Terminal):\n\n👤 Ism: ${name}\n📱 Telefon: +998 ${cleanDigits}\n🎯 Asosiy Maqsad: ${selectedGoal}\n📅 Sana: ${new Date().toLocaleString('uz-UZ')}`;

    try {
      ADMIN_CHAT_IDS.forEach((chatId) => {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: telegramText })
        }).catch((err) => console.error('Telegram notice:', err));
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
          console.warn('Firebase notice:', dbErr.message);
        }
      }

      const existing = JSON.parse(localStorage.getItem('admin_leads') || '[]');
      localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existing]));

      setSuccess(true);
      setName('');
      setPhone('');
    } catch (err) {
      console.error(err);
      setError("Tarmoqda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 sm:py-32 relative select-none">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-[36px] sm:rounded-[48px] overflow-hidden bg-gradient-to-br from-[#070912] via-[#0d1222] to-[#05070d] text-white p-8 sm:p-12 lg:p-16 border border-white/10 shadow-2xl">
          
          {/* Laser Line & Atmospheric glows */}
          <div className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] bg-rose-600/25 rounded-full blur-[140px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[140px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="badge-neon">
                ✦ START YOUR ENGLISH TRANSFORMATION
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight leading-tight">
                Kelajagingiz uchun eng to'g'ri qaror —{' '}
                <span className="text-gradient-accent">professional tayyorgarlik.</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                O'z maqsadingizni tanlang, aloqa ma'lumotlaringizni qoldiring va bepul birinchi sinov darsi hamda individual o'quv rejangizga ega bo'ling.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/level-test"
                  className="btn-secondary py-3.5 px-6 text-xs sm:text-sm font-bold w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border-white/20"
                >
                  <FaGraduationCap />
                  <span>Onlayn Daraja Testini Topshirish</span>
                </Link>

                <a
                  href="tel:+998900829979"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-colors font-mono"
                >
                  <FaPhoneAlt className="text-rose-400" />
                  <span>+998 90 082 99 79</span>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Booking Terminal */}
            <div className="lg:col-span-5 bg-white/5 dark:bg-black/50 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl text-left">
              
              {success ? (
                <div className="py-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl">
                    <FaCheckCircle />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    Murojaatingiz qabul qilindi!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xs">
                    Tez orada mutaxassislarimiz siz bilan bog'lanib, bepul sinov darsingiz vaqtini tasdiqlashadi.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Yangi so'rov yuborish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      Bepul Darsga Yozilish
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      1. Maqsadingizni tanlang va ma'lumot qoldiring:
                    </p>
                  </div>

                  {/* Goal Selector Pills */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {goals.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGoal(g.id)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all cursor-pointer border ${
                          selectedGoal === g.id
                            ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Ism va Familiyangiz
                    </label>
                    <div className="relative flex items-center">
                      <FaUser className="absolute left-3.5 text-slate-400 text-xs" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Masalan: Azizbek"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Telefon raqamingiz
                    </label>
                    <div className="relative flex items-center bg-white/10 border border-white/20 rounded-xl overflow-hidden focus-within:border-rose-500 transition-colors">
                      <span className="pl-3.5 pr-2.5 text-sm font-bold text-slate-300 border-r border-white/20 select-none py-3">
                        +998
                      </span>
                      <IMaskInput
                        mask="(00) 000-00-00"
                        value={phone}
                        onAccept={(val) => setPhone(val)}
                        placeholder="(90) 123-45-67"
                        className="w-full px-3.5 py-3 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 mt-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm shadow-xl shadow-rose-600/40"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" />
                        <span>Yuborilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <span>Joy band qilish</span>
                        <FaPaperPlane className="text-xs" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
