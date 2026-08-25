import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaPhoneAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaTimes, FaTelegramPlane, FaStar, FaGraduationCap, FaArrowRight, FaClock, FaAward } from "react-icons/fa";
import { HiArrowLeft } from 'react-icons/hi';

const staticMentorsData = [
    {
        id: 1,
        name: "Ruhillo Asrorov",
        role: "English Teacher & IELTS Expert",
        experience: "4+ yil tajriba",
        bio: "Ingliz tili va IELTS imtihoniga tayyorlash bo'yicha yuqori darajadagi malakali mutaxassis.",
        skills: ["IELTS 8.0", "Grammar & Speaking", "Business English"],
        image: "/photo_2026-07-23_23-14-12.jpg",
        telegram: "https://t.me/rukhillo",
        birthYear: 2001,
        age: 25,
        certificates: [
            { title: "IELTS Indicator / General Certificate - 8.0", year: "2024", issuedBy: "British Council" }
        ],
        fullBio: "Ingliz tili va IELTS yo'nalishi bo'yicha 4 yildan ortiq tajribaga ega. Hozirgacha yuzlab o'quvchilarga ingliz tilini mukammal o'rganishda va xalqaro sertifikatlarni qo'lga kiritishda yaqindan ko'maklashgan."
    }
];

export default function Mentorstats() {
    const { t } = useTranslation();
    const [modal, setModal] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [activeMentorDetail, setActiveMentorDetail] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const detailTopRef = useRef(null);

    // Yangi Bot Tokeni (rasmdan olindi)
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_3;

    // Admin Chat ID (rasmdan olindi: 6383523156)
    const ADMIN_CHAT_IDS = ["6383523156", "334572168"];

    

    useEffect(() => {
        window.scrollTo(0, 0);
        if (detailTopRef.current) {
            detailTopRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeMentorDetail]);

    const mentorsData = staticMentorsData;

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const numbers = value.replace(/\D/g, '').slice(0, 9);
            setFormData({ ...formData, phone: numbers });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 9) {
            showToast("Telefon raqami ro'ppa-rosa 9 ta raqamdan iborat bo'lishi kerak!", "error");
            return;
        }

        setLoading(true);

        const message = `
@OPTIMUM_teacher_bot orqali yangi murojaat!

Ustoz: ${selectedMentor}
F.I.O: ${formData.fullName}
Telefon: +998 ${formData.phone}
        `;

        try {
            const promises = ADMIN_CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'Markdown'
                    }),
                })
            );

            const responses = await Promise.all(promises);
            const allSuccess = responses.every(res => res.ok);

            if (allSuccess) {
                showToast(t('sec3.successToast', "Muvaffaqiyatli yuborildi!"), "success");
                setFormData({ fullName: '', phone: '' });
                setModal(false);
            } else {
                showToast(t('addComment.errorOccurred', "Xatolik yuz berdi. Qaytadan urinib ko'ring."), "error");
            }
        } catch (error) {
            console.error("Xatolik:", error);
            showToast(t('addComment.errorOccurred', "Tarmoqda xatolik yuz berdi."), "error");
        } finally {
            setLoading(false);
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 rounded-[28px] p-6 sm:p-8 w-full max-w-md relative text-gray-900 dark:text-white shadow-2xl"
            >
                <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="absolute top-4 right-4 w-9 h-9 bg-gray-100/85 hover:bg-gray-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-gray-600 dark:text-slate-300 rounded-2xl flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 hover:rotate-90"
                    title="Yopish"
                >
                    <FaTimes />
                </button>

                <h3 className="text-xl font-extrabold mb-1 pr-6 tracking-tight">
                    {t('sec3.modalTitle', "Ustoz bilan bog'lanish")}
                </h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
                    {t('sec3.selectedTeacher', "Tanlangan ustoz:")} <span className="text-[#c41e30] font-semibold">{selectedMentor}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                            {t('sec3.nameLabel', "Ismingiz")}
                        </label>
                        <div className="relative flex items-center">
                            <FaUser className="absolute left-4 text-gray-400" />
                            <input
                                type="text"
                                name="fullName"
                                required
                                placeholder={t('sec3.namePlaceholder', "Ismingizni kiriting")}
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c41e30] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                            {t('sec3.phoneLabel', "Telefon raqamingiz")}
                        </label>
                        <div className="relative flex items-center">
                            <FaPhoneAlt className="absolute left-4 text-gray-400 z-10" />
                            <div className="absolute left-11 flex items-center pointer-events-none text-sm font-semibold text-gray-500 dark:text-gray-400">
                                +998
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                maxLength={9}
                                required
                                placeholder="901234567"
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                    setFormData(prev => ({ ...prev, phone: val }));
                                }}
                                className="w-full pl-24 pr-4 py-3.5 rounded-2xl bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#c41e30] transition-all"
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-4 rounded-2xl bg-[#c41e30] hover:bg-[#a51827] text-white font-bold text-sm shadow-lg shadow-[#c41e30]/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 transition-all"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>{t('sec3.submitBtn', "Yuborish")}</span>
                                <FaPaperPlane className="w-3.5 h-3.5" />
                            </>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );

    const renderToast = () => (
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
    );

    if (activeMentorDetail) {
        return (
            <div ref={detailTopRef} className="font-['Plus_Jakarta_Sans',sans-serif] bg-transparent min-h-screen flex flex-col justify-center py-6 pt-[80px] lg:pt-[100px] px-4 md:px-8 text-slate-900 dark:text-white transition-colors">
                <div className="max-w-3xl mx-auto space-y-6">
                    
                    {/* Back button */}
                    <button 
                        onClick={() => setActiveMentorDetail(null)}
                        className="absolute top-[100px] sm:top-[120px] left-4 sm:left-8 md:left-12 lg:left-16 group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-white/40 dark:bg-slate-800/40 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-md rounded-full border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-white shadow-sm hover:shadow-lg hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-300 cursor-pointer z-50"
                    >
                        <HiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1.5 transition-transform" />
                    </button>

                    {/* Main Detail Glass Card */}
                    <div className="relative overflow-hidden bg-white dark:bg-white/[0.03] backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[40px] p-6 sm:p-10 shadow-2xl shadow-slate-200/80 dark:shadow-black/40 space-y-8">
                        
                        {/* Ambient glow lights */}
                        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-red-600/25 via-rose-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

                        {/* Profile Header */}
                        <div className="flex flex-col items-center text-center relative z-10 space-y-4">
                            <div className="relative group/avatar">
                                <div className="absolute -inset-3 bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 rounded-[36px] blur-xl opacity-45 group-hover/avatar:opacity-85 transition duration-700 animate-pulse" />
                                <div className="relative p-1 rounded-[30px] bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 shadow-2xl w-48 h-48 sm:w-56 sm:h-56">
                                    <img
                                        src={activeMentorDetail.image}
                                        alt={activeMentorDetail.name}
                                        className="w-full h-full object-cover rounded-[26px] transition-transform duration-700 group-hover/avatar:scale-105"
                                    />
                                </div>

                                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/95 dark:bg-slate-950/95 border border-red-500/40 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-xl text-[11px] font-black text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                    <FaStar className="text-red-500 text-xs shrink-0 animate-spin-slow" />
                                    <span>{t('mentorsPage.topMentor', "TOP MENTOR")}</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2.5">
                                    <span>{activeMentorDetail.name}</span>
                                    <FaCheckCircle className="text-red-500 text-xl shrink-0" />
                                </h1>
                                <p className="text-sm font-extrabold uppercase tracking-widest text-red-600 dark:text-red-500 mt-1">
                                    {t('mentorsPage.role', activeMentorDetail.role)}
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-2 text-xs font-black px-4 py-1.5 rounded-full bg-red-500/20 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 shadow-inner">
                                <FaClock className="text-red-500 dark:text-red-400 text-xs" />
                                <span>{t('mentorsPage.experience', activeMentorDetail.experience)}</span>
                            </div>

                            <a
                                href={activeMentorDetail.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group/tg overflow-hidden inline-flex items-center gap-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-black px-7 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-red-600/30 active:scale-95 border border-red-400/30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover/tg:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                                <FaTelegramPlane className="text-base group-hover/tg:rotate-12 transition-transform" />
                                <span>{t('mentorsPage.connectBtn', "Telegram orqali bog'lanish")}</span>
                            </a>
                        </div>

                        {/* Birth & Age Info Pill Bar */}
                        <div className="flex justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 p-4 rounded-2xl border border-red-500/20 shadow-inner">
                            <div>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">{t('mentorsPage.birthYear', "Tug'ilgan yil:")}</span>
                                <strong className="text-slate-900 dark:text-white font-extrabold ml-1.5">{activeMentorDetail.birthYear}</strong>
                            </div>
                            <div className="text-red-500">•</div>
                            <div>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">{t('mentorsPage.age', "Yosh:")}</span>
                                <strong className="text-slate-900 dark:text-white font-extrabold ml-1.5">{activeMentorDetail.age} {t('mentorsPage.yearsOld', "yosh")}</strong>
                            </div>
                        </div>

                        {/* Bio / About */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-red-500 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
                                <span>{t('mentorsPage.aboutHeading', "Haqida")}</span>
                            </h4>
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                                <p>{t('mentorsPage.fullBio', activeMentorDetail.fullBio)}</p>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-red-500 dark:text-red-400 uppercase tracking-widest">
                                {t('mentorsPage.specializations', "Mutaxassislik yo'nalishlari")}
                            </h4>
                            <div className="flex flex-wrap gap-2.5">
                                {activeMentorDetail.skills && activeMentorDetail.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 text-xs px-4 py-2 rounded-xl font-extrabold border border-slate-200 dark:border-white/10 shadow-md"
                                    >
                                        <FaGraduationCap className="text-red-500 dark:text-red-400 text-xs shrink-0" />
                                        <span>{skill}</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Certificates */}
                        <div className="space-y-3.5">
                            <h4 className="text-xs font-black text-red-500 dark:text-red-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                <FaAward className="text-rose-500 dark:text-rose-400" />
                                <span>{t('mentorsPage.certificates', "Olingan sertifikatlar")}</span>
                            </h4>
                            <div className="flex justify-center">
                                {activeMentorDetail.certificates.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="w-full max-w-md bg-white dark:bg-slate-950/80 border border-red-500/20 dark:border-red-500/25 p-5 rounded-2xl transition-all duration-300 hover:border-red-500/40 dark:hover:border-red-500/60 hover:shadow-xl shadow-lg relative group/cert"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center text-sm font-bold shrink-0">
                                                <FaAward />
                                            </div>
                                            <span className="px-2.5 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black border border-red-500/20">
                                                {cert.year}
                                            </span>
                                        </div>
                                        <h5 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mb-1 group-hover/cert:text-red-500 dark:group-hover/cert:text-red-400 transition-colors">
                                            {cert.title}
                                        </h5>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{cert.issuedBy}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom CTA Button */}
                        <div className="pt-4 text-center">
                            <button
                                onClick={() => {
                                    setSelectedMentor(activeMentorDetail.name);
                                    setModal(true);
                                }}
                                className="w-full relative group/bcta overflow-hidden py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-sm shadow-2xl shadow-red-600/40 cursor-pointer active:scale-95 transition-all border border-red-400/30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover/bcta:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                                <span>{t('mentors.contactBtn', "Bog'lanish")}</span>
                            </button>
                        </div>

                    </div>
                </div>

                {modal && renderModal()}
                {renderToast()}
            </div>
        );
    }

    return (
        <div className="font-['Plus_Jakarta_Sans',sans-serif] pt-10">
            <section className="bg-transparent py-20 px-4 md:px-8 text-gray-900 dark:text-white transition-colors">
                <div className="max-w-5xl mx-auto" data-aos="fade-up">
                    <div className="text-center mb-14">
                        <span className="text-xs font-extrabold text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-500/10 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-500/20 inline-block mb-3 shadow-sm">
                            {t('mentorsPage.badge', "Mentorlar")}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                            {t('mentorsPage.title', "Bizning Mentor")}
                        </h2>
                        <p className="text-gray-500 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto font-medium">
                            {t('mentorsPage.subtitle', "Tajribali ingliz tili mutaxassisidan xalqaro darajadagi bilimlarni o'rganing.")}
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {mentorsData.map((mentor) => (
                            <div
                                key={mentor.id}
                                data-aos="fade-up"
                                data-aos-duration="700"
                                className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-[#080b12] dark:via-[#05070a] dark:to-black border border-slate-200 dark:border-white/10 hover:border-red-400 dark:hover:border-red-500/50 rounded-[40px] p-6 sm:p-10 shadow-2xl shadow-slate-200/80 dark:shadow-black/70 transition-all duration-500 group"
                            >
                                {/* Background Ambient Lights */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-600/25 via-rose-600/15 to-transparent rounded-full blur-3xl group-hover:from-red-600/40 transition-all duration-700 pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-rose-600/20 via-red-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

                                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative z-10">
                                    
                                    {/* Left Column: Photo Showcase */}
                                    <div className="w-full lg:w-5/12 flex flex-col items-center">
                                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-full lg:h-80 group/photo">
                                            {/* Neon Glow Aura */}
                                            <div className="absolute -inset-3 bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 rounded-[36px] blur-xl opacity-40 group-hover/photo:opacity-85 transition duration-700 animate-pulse" />
                                            
                                            {/* Photo Container */}
                                            <div className="relative w-full h-full p-1.5 rounded-[32px] bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 shadow-2xl">
                                                <img
                                                    src={mentor.image}
                                                    alt={mentor.name}
                                                    className="w-full h-full object-cover rounded-[28px] cursor-pointer transition-transform duration-700 group-hover/photo:scale-105"
                                                    onClick={() => setActiveMentorDetail(mentor)}
                                                />
                                            </div>

                                            {/* Top Floating Badge */}
                                            <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-white/90 dark:bg-slate-950/90 border border-red-500/40 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-xl text-[11px] font-black text-rose-500 dark:text-rose-400">
                                                <FaStar className="text-red-500 text-xs shrink-0 animate-spin-slow" />
                                                <span>{t('mentorsPage.topMentor', "TOP MENTOR")}</span>
                                            </div>

                                            {/* Bottom Floating Experience Badge */}
                                            <div className="absolute -bottom-3 right-4 px-4 py-2 bg-white/95 dark:bg-slate-950/95 border border-red-500/50 backdrop-blur-md rounded-2xl flex items-center gap-2 shadow-2xl text-xs font-black text-slate-900 dark:text-white">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                                                <FaClock className="text-red-400 text-xs" />
                                                <span>{t('mentorsPage.experience', mentor.experience)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Bio, Stats & Actions */}
                                    <div className="w-full lg:w-7/12 flex flex-col text-left space-y-5">
                                        
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-red-500/20 dark:bg-red-500/10 border border-red-500/30 rounded-full text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                                                    {t('mentorsPage.ieltsExpert', "IELTS 8.0 Expert")}
                                                </span>
                                                <span className="px-3 py-1 bg-rose-500/20 dark:bg-rose-500/10 border border-rose-500/30 rounded-full text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                                    <FaAward className="text-xs" /> {t('mentorsPage.officialCertified', "Official Certified")}
                                                </span>
                                            </div>

                                            <h3
                                                onClick={() => setActiveMentorDetail(mentor)}
                                                className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors tracking-tight flex items-center gap-2.5"
                                            >
                                                <span>{mentor.name}</span>
                                                <FaCheckCircle className="text-red-500 text-xl shrink-0" title="Tasdiqlangan mutaxassis" />
                                            </h3>

                                            <p className="text-sm font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-red-600 mt-1">
                                                {t('mentorsPage.role', mentor.role)}
                                            </p>
                                        </div>

                                        {/* Bio Quote Card */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium leading-relaxed relative">
                                            <span className="absolute -top-3 left-4 px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-md text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                                {t('mentorsPage.aboutHeading', "Mutaxassis Haqida")}
                                            </span>
                                            <p className="pt-1">{t('mentorsPage.bio', mentor.bio)}</p>
                                        </div>

                                        {/* Quick Stats Grid */}
                                        <div className="grid grid-cols-3 gap-3 py-1">
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-red-500/30 text-center">
                                                <p className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-500">8.0</p>
                                                <p className="text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">{t('mentorsPage.ieltsLevel', "IELTS Daraja")}</p>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-red-500/20 text-center">
                                                <p className="text-lg sm:text-xl font-black text-red-600 dark:text-red-500">4+ Yil</p>
                                                <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">{t('mentorsPage.experienceLabel', "Tajriba")}</p>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-red-500/20 text-center">
                                                <p className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-500">100%</p>
                                                <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">{t('mentorsPage.guaranteed', "Kafolatlangan")}</p>
                                            </div>
                                        </div>

                                        {/* Skills Chips */}
                                        <div>
                                            <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                                                {t('mentorsPage.specializations', "Mutaxassislik yo'nalishlari:")}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {mentor.skills && mentor.skills.map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs px-3.5 py-1.5 rounded-xl font-extrabold border border-slate-200 dark:border-white/10 hover:border-red-400 dark:hover:border-red-500/50 hover:text-red-600 dark:hover:text-white transition-all duration-300 shadow-md hover:-translate-y-0.5"
                                                    >
                                                        <FaGraduationCap className="text-red-400 text-xs shrink-0" />
                                                        <span>{skill}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                            <button
                                                onClick={() => setActiveMentorDetail(mentor)}
                                                className="flex-1 px-6 py-4 rounded-2xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.14] text-slate-900 dark:text-white text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer active:scale-95 border border-slate-200 dark:border-white/15 hover:border-red-300 dark:hover:border-white/30 flex items-center justify-center gap-2 shadow-lg group/btn"
                                            >
                                                <span>{t('mentorsPage.detailsBtn', "Batafsil ma'lumot")}</span>
                                                <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                            
                                            <button
                                                onClick={() => {
                                                    setSelectedMentor(mentor.name);
                                                    setModal(true);
                                                }}
                                                className="flex-1 relative group/call overflow-hidden px-6 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer active:scale-95 shadow-xl shadow-red-600/35 hover:shadow-2xl hover:shadow-red-600/60 flex items-center justify-center gap-2.5 border border-red-400/30"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover/call:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                                                <FaTelegramPlane className="text-sm group-hover/call:rotate-12 transition-transform" />
                                                <span>{t('mentors.contactBtn', "Bog'lanish")}</span>
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {modal && renderModal()}
                {renderToast()}
            </section>
        </div>
    );
}