import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhoneAlt, FaBookOpen, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';
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

    // Yangi bot tokeni (@optimum_kurs_bot)
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_1;

    // Ikkita admin chat ID lari massiv ko'rinishida
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
            showToast(t('register.phoneError'), "error");
            return;
        }

        setLoading(true);

        const message = `🆕 Yangi o'quvchi ro'yxatdan o'tdi:\n👤 Ism: ${formData.fullName}\n📱 Tel: +998${digitsOnly}\n📖 Kurs: ${t('register.courseName')}`;

        try {
            // Har bir chat ID ga alohida so'rov yaratib, ularni bir vaqtning o'zida yuboramiz
            const promises = ADMIN_CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
                    type: t('register.courseName'),
                    date: new Date().toLocaleString('uz-UZ'),
                    status: 'Kutilmoqda'
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
                    console.error("API error:", err)
                    const existingLeads = JSON.parse(localStorage.getItem('admin_leads') || '[]')
                    localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existingLeads]))
                }

                showToast(t('register.successMsg'), "success");
                setFormData({ fullName: '', phone: '', course: t('register.courseName') });
            } else {
                showToast(t('register.errorMsg'), "error");
            }
        } catch (error) {
            console.error("Xatolik:", error);
            showToast(t('register.netErrorMsg'), "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-16 bg-transparent font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">

            {/* Toast Xabarnoma */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-xl shadow-2xl border border-gray-200/80 dark:border-white/10 text-gray-900 dark:text-white"
                    >
                        {toast.type === 'success' ? (
                            <FaCheckCircle className="text-emerald-500 text-xl shrink-0" />
                        ) : (
                            <FaExclamationCircle className="text-red-500 text-xl shrink-0" />
                        )}
                        <p className="text-sm font-semibold">{toast.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="fixed top-24 sm:top-28 left-4 sm:left-8 z-50 inline-flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-full shadow-lg hover:shadow-red-500/20 hover:border-red-500/30 dark:hover:border-red-500/30 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
            >
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-colors">
                    <FaArrowLeft className="text-[10px] sm:text-xs group-hover:-translate-x-1 transition-transform duration-300" />
                </div>
                {t('common.backBtn')}
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-white/10 relative overflow-hidden"
            >


                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                            {t('register.title')}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {t('register.subtitle')}
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">{t('register.fullNameLabel')}</label>
                        <div className="relative flex items-center">
                            <FaUser className="absolute left-4 text-gray-400" />
                            <input
                                type="text"
                                name="fullName"
                                placeholder={t('register.fullNamePlaceholder')}
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c41e30]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">{t('register.phoneLabel')}</label>
                        <div className="relative flex items-center">
                            <FaPhoneAlt className="absolute left-4 text-gray-400 z-10" />
                            <div className="absolute left-11 flex items-center pointer-events-none text-sm font-semibold text-gray-500 dark:text-gray-400">
                                +998
                            </div>
                            <IMaskInput
                                mask="(00) 000-00-00"
                                name="phone"
                                placeholder="(90) 123-45-67"
                                value={formData.phone}
                                onAccept={(value) => handleChange({ target: { name: 'phone', value } })}
                                className="w-full pl-24 pr-4 py-3.5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c41e30]"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">{t('register.courseLabel')}</label>
                        <div className="relative flex items-center">
                            <FaBookOpen className="absolute left-4 text-gray-400" />
                            <input
                                type="text"
                                value={t('register.courseName')}
                                disabled
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-100 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-[#c41e30] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{t('register.submitBtn')}</span>
                                <FaPaperPlane className="w-3.5 h-3.5" />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}