import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhoneAlt, FaBookOpen, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
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
        course: t('register.courseName')
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1;
    const ADMIN_CHAT_IDS = ["6383523156", "334572168"];

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
            showToast(t('register.phoneError', "Iltimos, telefon raqamingizni to'liq kiriting"), "error");
            return;
        }

        setLoading(true);

        const message = `🆕 Yangi o'quvchi ro'yxatdan o'tdi (Optimum ELC):\n👤 Ism: ${formData.fullName}\n📱 Tel: +998${digitsOnly}\n📖 Kurs: ${formData.course || t('register.courseName')}`;

        try {
            const promises = ADMIN_CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message
                    }),
                })
            );

            const responses = await Promise.all(promises);
            const allSuccess = responses.every(res => res.ok);

            if (allSuccess) {
                const newLead = {
                    id: Date.now(),
                    isLead: true,
                    name: formData.fullName,
                    phone: `+998 ${digitsOnly}`,
                    type: formData.course || t('register.courseName'),
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
                    localStorage.setItem('admin_leads', JSON.stringify(updatedLeads));
                } catch (err) {
                    console.error("API error:", err);
                    const existingLeads = JSON.parse(localStorage.getItem('admin_leads') || '[]');
                    localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existingLeads]));
                }

                showToast(t('register.successMsg', "Muvaffaqiyatli ro'yxatdan o'tdingiz!"), "success");
                setFormData({ fullName: '', phone: '', course: t('register.courseName') });
            } else {
                showToast(t('register.errorGeneric', "Xatolik yuz berdi. Qayta urinib ko'ring."), "error");
            }
        } catch (err) {
            console.error(err);
            showToast(t('register.errorNetwork', "Internet bilan aloqa uzildi."), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-28 pb-20 bg-transparent relative overflow-hidden select-none">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                    >
                        {toast.type === 'success' ? (
                            <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />
                        ) : (
                            <FaExclamationCircle className="text-red-500 text-lg shrink-0" />
                        )}
                        <p className="text-xs sm:text-sm font-bold">{toast.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="absolute top-24 left-4 sm:left-8 group flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-xs cursor-pointer z-50"
            >
                <HiArrowLeft className="w-4 h-4" />
                <span>Orqaga</span>
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#070d19] border border-slate-200 dark:border-white/10 shadow-2xl relative"
            >
                {/* Form header */}
                <div className="text-center space-y-2 mb-8">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                        OPTIMUM ELC
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
                        {t('register.title', "Ro'yxatdan o'tish")}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {t('register.subtitle', "Ma'lumotlaringizni to'ldiring va guruhga qo'shiling")}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                            {t('register.fullNameLabel', "To'liq ismingiz")}
                        </label>
                        <div className="relative flex items-center">
                            <FaUser className="absolute left-4 text-slate-400 text-sm" />
                            <input
                                type="text"
                                name="fullName"
                                placeholder={t('register.fullNamePlaceholder', 'Familiya Ism')}
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-[#0c1424] border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-600 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                            {t('register.phoneLabel', "Telefon raqamingiz")}
                        </label>
                        <div className="relative flex items-center bg-slate-50 dark:bg-[#0c1424] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-red-600 transition-colors">
                            <span className="pl-4 pr-3 text-slate-700 dark:text-slate-300 text-sm font-bold select-none border-r border-slate-200 dark:border-white/10 py-3 bg-slate-100 dark:bg-slate-800/40">
                                +998
                            </span>
                            <IMaskInput
                                mask="(00) 000-00-00"
                                name="phone"
                                placeholder="(90) 123-45-67"
                                value={formData.phone}
                                onAccept={(value) => handleChange({ target: { name: 'phone', value } })}
                                className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                            {t('register.courseLabel', "Tanlangan yo'nalish")}
                        </label>
                        <div className="relative flex items-center">
                            <FaBookOpen className="absolute left-4 text-slate-400 text-sm" />
                            <input
                                type="text"
                                value={t('register.courseName', "IELTS / General English")}
                                disabled
                                className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed font-medium"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{t('register.submitBtn', "Ro'yxatdan o'tish")}</span>
                                <FaPaperPlane className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}