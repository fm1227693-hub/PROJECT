import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaCheckCircle, 
    FaChevronLeft, 
    FaChevronRight, 
    FaExpand, 
    FaTimes, 
    FaAward, 
    FaHeadphones, 
    FaBookOpen, 
    FaPenNib, 
    FaMicrophone 
} from "react-icons/fa";
import CommentsORG from "./TikTokComments";

const ieltsData = [
    {
        id: 1,
        name: "Javohir Munirov",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg",
        levelLabel: "C1 Advanced",
        scores: {
            listening: "9.0",
            reading: "7.5",
            writing: "6.5",
            speaking: "6.5",
            overall: "7.5",
        },
    },
    {
        id: 2,
        name: "Jahongir Zayniddinov",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg",
        levelLabel: "C1 Level",
        scores: {
            listening: "8.5",
            reading: "6.5",
            writing: "6.0",
            speaking: "6.0",
            overall: "7.0",
        },
    },
    {
        id: 3,
        name: "Mehrangiz Umedova",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-06.jpg",
        levelLabel: "C1 Level",
        scores: {
            listening: "7.0",
            reading: "7.0",
            writing: "6.5",
            speaking: "7.0",
            overall: "7.0",
        },
    },
    {
        id: 4,
        name: "Nozigul G'aybilloyeva",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-09.jpg",
        levelLabel: "C1 Level",
        scores: {
            listening: "7.5",
            reading: "7.5",
            writing: "6.5",
            speaking: "6.5",
            overall: "7.0",
        },
    },
    {
        id: 5,
        name: "Laziza Djamolova",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-11.jpg",
        levelLabel: "B2 Upper-Intermediate",
        scores: {
            listening: "6.5",
            reading: "6.5",
            writing: "6.0",
            speaking: "6.0",
            overall: "6.5",
        },
    },
];

const cefrData = [
    {
        id: 1,
        name: "In'omjon Izomov",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-19.jpg",
        levelLabel: "B2 Certified",
        scores: {
            listening: "60",
            reading: "61",
            writing: "42",
            speaking: "50",
            overall: "B2 (53)",
        },
    },
    {
        id: 2,
        name: "Sohibjon Sa'dullayev",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-21.jpg",
        levelLabel: "B2 Certified",
        scores: {
            listening: "55",
            reading: "65",
            writing: "55",
            speaking: "49",
            overall: "B2 (56)",
        },
    },
    {
        id: 3,
        name: "Gulnoza Mirxonova",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-25.jpg",
        levelLabel: "B1 Intermediate",
        scores: {
            listening: "47",
            reading: "46",
            writing: "43",
            speaking: "38",
            overall: "B1 (44)",
        },
    },
    {
        id: 4,
        name: "Zarnigor Muxiddinova",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-23.jpg",
        levelLabel: "B2 Certified",
        scores: {
            listening: "61",
            reading: "58",
            writing: "48",
            speaking: "42",
            overall: "B2 (52)",
        },
    },
    {
        id: 5,
        name: "Rayxon Ashurova",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/CEFR68.jpg",
        levelLabel: "B2 Certified",
        scores: {
            listening: "66",
            reading: "61",
            writing: "51",
            speaking: "54",
            overall: "B2 (58)",
        },
    },
];

export default function ResultsSlider() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('ielts');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const activeData = activeTab === 'ielts' ? ieltsData : cefrData;
    const indexRef = useRef(currentIndex);

    useEffect(() => {
        indexRef.current = currentIndex;
    }, [currentIndex]);

    // Avtomatik o'tish logikasi (agar foydalanuvchi to'xtatmasa)
    useEffect(() => {
        if (isPaused || isLightboxOpen) return;
        const interval = setInterval(() => {
            const nextIndex = indexRef.current === activeData.length - 1 ? 0 : indexRef.current + 1;
            setCurrentIndex(nextIndex);
        }, 4000);

        return () => clearInterval(interval);
    }, [activeData.length, isPaused, isLightboxOpen]);

    const activeStudent = activeData[currentIndex] || activeData[0];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? activeData.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === activeData.length - 1 ? 0 : prev + 1));
    };

    // Calculate percentage for module scores (for IELTS 9.0 scale or CEFR 75 scale)
    const getPercentage = (scoreStr) => {
        const num = parseFloat(scoreStr);
        if (isNaN(num)) return 70;
        if (activeTab === 'ielts') {
            return Math.min(100, (num / 9.0) * 100);
        } else {
            return Math.min(100, (num / 75.0) * 100);
        }
    };

    return (
        <section 
            id="results-section" 
            className="w-full relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 select-none overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Ambient Background Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-red-600/[0.08] rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-rose-600/[0.05] rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] mb-4">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
                            {t("resultsSlider.badge", "ISBOTLANGAN NATIJALAR // PROVEN EXCELLENCE")}
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-heading leading-tight">
                        {t("resultsSlider.title", "Ba'zi o'quvchilarimizning")}{' '}
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
                            natijalari
                        </span>
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
                        {t("resultsSlider.subtitle", "Optimum ELC talabalarining xalqaro imtihonlarda qayd etgan rasmiy tasdiqlangan sertifikatlari.")}
                    </p>

                    {/* IELTS / CEFR Modern Segmented Pill Switcher */}
                    <div className="mt-8 flex justify-center">
                        <div className="p-1.5 rounded-full bg-slate-200/80 dark:bg-[#070b14]/90 border border-slate-300/80 dark:border-white/10 backdrop-blur-2xl shadow-lg flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('ielts');
                                    setCurrentIndex(0);
                                }}
                                className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                    activeTab === 'ielts'
                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-102'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                IELTS (7.0 - 8.5)
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveTab('cefr');
                                    setCurrentIndex(0);
                                }}
                                className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                    activeTab === 'cefr'
                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-102'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                CEFR (B1 - B2)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Horizontal Student Navigation Carousel Pills */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 max-w-4xl mx-auto px-2">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-300 shrink-0 cursor-pointer shadow-sm"
                        aria-label="Previous student"
                    >
                        <FaChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {activeData.map((student, idx) => {
                            const isActive = idx === currentIndex;
                            return (
                                <button
                                    key={student.id}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 shrink-0 cursor-pointer border ${
                                        isActive
                                            ? 'bg-red-600/15 dark:bg-red-500/20 border-red-500 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(239,68,68,0.25)] scale-102'
                                            : 'bg-white/60 dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/20'
                                    }`}
                                >
                                    {/* Initials badge */}
                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black transition-colors ${
                                        isActive
                                            ? 'bg-red-600 text-white shadow-sm'
                                            : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 group-hover:bg-red-500/30'
                                    }`}>
                                        {student.name.split(' ').map(n => n[0]).join('')}
                                    </div>

                                    {/* Student Name */}
                                    <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
                                        {student.name}
                                    </span>

                                    {/* Band Score Pill */}
                                    <span className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                        isActive
                                            ? 'bg-red-600 text-white'
                                            : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {student.scores.overall}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleNext}
                        className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-500 transition-all duration-300 shrink-0 cursor-pointer shadow-sm"
                        aria-label="Next student"
                    >
                        <FaChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Main Showcase Stage (Single Unified Luxury Card) */}
                <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 bg-white/80 dark:bg-[#0a0e19]/90 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-2xl shadow-black/5 dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden">
                    {/* Top ambient highlight gradient */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    
                    {/* Background subtle watermark */}
                    <div className="absolute -bottom-10 -right-10 text-[180px] font-black text-black/[0.02] dark:text-white/[0.02] font-heading pointer-events-none select-none">
                        {activeTab.toUpperCase()}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                        {/* Left: Student Dossier & Master Band Score */}
                        <div className="lg:col-span-5 flex flex-col justify-between">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStudent.id + activeTab}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.35 }}
                                    className="flex flex-col"
                                >
                                    {/* Verification Header */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                            <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                                            {t("resultsSlider.verified", "Rasmiy TRF Tasdiqlangan")}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            {activeStudent.levelLabel}
                                        </span>
                                    </div>

                                    {/* Student Name */}
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight mb-6">
                                        {activeStudent.name}
                                    </h3>

                                    {/* Giant Score Card */}
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-red-600/10 via-rose-600/5 to-transparent border border-red-500/20 backdrop-blur-xl mb-6 relative overflow-hidden">
                                        <div className="flex items-baseline justify-between">
                                            <div>
                                                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400 mb-1">
                                                    OVERALL BAND SCORE
                                                </div>
                                                <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white font-heading tracking-tighter">
                                                    {activeStudent.scores.overall}
                                                </div>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
                                                <FaAward className="w-7 h-7" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub-scores 4 Modules Grid */}
                                    <div className="mb-6">
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                                            {t("resultsSlider.moduleScores", "Modullar bo'yicha ballar")}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Listening */}
                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between">
                                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FaHeadphones className="w-3 h-3 text-emerald-500" />
                                                        Listening
                                                    </span>
                                                    <span className="text-sm font-black text-emerald-500">{activeStudent.scores.listening}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercentage(activeStudent.scores.listening)}%` }} />
                                                </div>
                                            </div>

                                            {/* Reading */}
                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between">
                                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FaBookOpen className="w-3 h-3 text-sky-500" />
                                                        Reading
                                                    </span>
                                                    <span className="text-sm font-black text-sky-500">{activeStudent.scores.reading}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercentage(activeStudent.scores.reading)}%` }} />
                                                </div>
                                            </div>

                                            {/* Writing */}
                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between">
                                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FaPenNib className="w-3 h-3 text-amber-500" />
                                                        Writing
                                                    </span>
                                                    <span className="text-sm font-black text-amber-500">{activeStudent.scores.writing}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercentage(activeStudent.scores.writing)}%` }} />
                                                </div>
                                            </div>

                                            {/* Speaking */}
                                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] flex flex-col justify-between">
                                                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FaMicrophone className="w-3 h-3 text-purple-500" />
                                                        Speaking
                                                    </span>
                                                    <span className="text-sm font-black text-purple-500">{activeStudent.scores.speaking}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${getPercentage(activeStudent.scores.speaking)}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guarantee Footer Note */}
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span>Rasmiy xalqaro test markazi ma'lumotlar bazasida ro'yxatga olingan.</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right: High-End Certificate Gallery Showcase */}
                        <div className="lg:col-span-7 flex flex-col items-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStudent.id + '-cert-container'}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="relative w-full max-w-lg lg:max-w-none group cursor-pointer"
                                    onClick={() => setIsLightboxOpen(true)}
                                >
                                    {/* Certificate Ambient Backlight Halo */}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-rose-500/15 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 -z-10" />

                                    {/* Gallery Bezel Frame */}
                                    <div className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-slate-100/90 dark:bg-black/60 border border-slate-300 dark:border-white/10 shadow-2xl overflow-hidden">
                                        {/* Certificate Image */}
                                        <div className="relative h-[280px] sm:h-[360px] md:h-[440px] w-full rounded-xl overflow-hidden bg-slate-200 dark:bg-[#03060c] flex items-center justify-center">
                                            <img
                                                src={activeStudent.certImage}
                                                alt={`${activeStudent.name} Certificate`}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-500"
                                            />

                                            {/* Hover overlay hint */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-xs">
                                                <div className="px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white text-xs font-bold flex items-center gap-2 shadow-xl">
                                                    <FaExpand className="w-3.5 h-3.5 text-red-400" />
                                                    <span>Kattalashtirib ko'rish</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Caption Pill */}
                                        <div className="mt-3 flex items-center justify-between px-2 text-xs">
                                            <span className="font-semibold text-slate-600 dark:text-slate-400">
                                                {activeTab === 'ielts' ? 'IELTS Test Report Form' : 'CEFR Davlat Guvohnomasi'}
                                            </span>
                                            <span className="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                                                <FaCheckCircle className="w-2.5 h-2.5" />
                                                Tasdiqlangan
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* TikTok-Style Community Comments */}
                <div className="mt-14 sm:mt-16">
                    <CommentsORG isAdmin={false} />
                </div>
            </div>

            {/* Certificate Lightbox Modal for Full View */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setIsLightboxOpen(false)}
                                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>

                            <img
                                src={activeStudent.certImage}
                                alt={`${activeStudent.name} Certificate`}
                                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
                            />

                            <div className="mt-4 text-center text-white text-sm font-semibold">
                                {activeStudent.name} — {activeStudent.scores.overall} ({activeTab.toUpperCase()})
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}