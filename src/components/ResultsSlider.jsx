import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CommentsORG from "./TikTokComments";

const ieltsData = [
    {
        id: 1,
        name: "Javohir Munirov",
        image: "/photo_2026-07-14_23-35-27.jpg",
        certImage: "/photo_2026-07-14_23-35-27.jpg",
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
        image: "/photo_2026-07-14_23-35-01.jpg",
        certImage: "/photo_2026-07-14_23-35-01.jpg",
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
        image: "/photo_2026-07-14_23-35-06.jpg",
        certImage: "/photo_2026-07-14_23-35-06.jpg",
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
        image: "/photo_2026-07-14_23-35-09.jpg",
        certImage: "/photo_2026-07-14_23-35-09.jpg",
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
        image: "/photo_2026-07-14_23-35-11.jpg",
        certImage: "/photo_2026-07-14_23-35-11.jpg",
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
        image: "/photo_2026-07-14_23-35-19.jpg",
        certImage: "/photo_2026-07-14_23-35-19.jpg",
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
        image: "/photo_2026-07-14_23-35-21.jpg",
        certImage: "/photo_2026-07-14_23-35-21.jpg",
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
        image: "/photo_2026-07-14_23-35-25.jpg",
        certImage: "/photo_2026-07-14_23-35-25.jpg",
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
        image: "/photo_2026-07-14_23-35-23.jpg",
        certImage: "/photo_2026-07-14_23-35-23.jpg",
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
        image: "/CEFR68.jpg",
        certImage: "/CEFR68.jpg",
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
    const activeData = activeTab === 'ielts' ? ieltsData : cefrData;

    const indexRef = useRef(currentIndex);
    indexRef.current = currentIndex;

    const triggerAnimation = (newIndex) => {
        if (newIndex === indexRef.current) return;
        setCurrentIndex(newIndex);
    };

    // Har 3 sekundda avtomatik o'tish logikasi
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = indexRef.current === activeData.length - 1 ? 0 : indexRef.current + 1;
            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeData.length]);

    const activeStudent = activeData[currentIndex];

    return (
        <div className="w-full px-2 sm:px-4 font-['Plus_Jakarta_Sans',sans-serif] min-h-screen flex flex-col items-center justify-center pt-[70px] lg:pt-[80px]">
            <div className="relative w-full max-w-5xl mx-auto p-3 sm:p-4 md:p-6 bg-white/90 dark:bg-[#090623]/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl text-slate-900 dark:text-white my-2 sm:my-4 transition-colors duration-300 overflow-hidden">

                {/* Dekorativ fon nuri */}
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />

                {/* Sarlavha */}
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 px-2"
                >
                    {t("resultsSlider.title", "Ba'zi o'quvchilarimizning natijalari")}
                </motion.h2>

                {/* Sarlavha o'rniga Switcher (IELTS / CEFR) */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="bg-slate-200 dark:bg-slate-800/80 p-1 rounded-[2rem] flex gap-2 shadow-inner relative z-10 border border-slate-300 dark:border-slate-700">
                        <button
                            onClick={() => {
                                setActiveTab('ielts');
                                setCurrentIndex(0);
                            }}
                            className={`px-6 sm:px-10 py-2.5 sm:py-3 rounded-[1.5rem] font-bold text-sm sm:text-lg transition-all duration-300 ${activeTab === 'ielts' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            IELTS
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('cefr');
                                setCurrentIndex(0);
                            }}
                            className={`px-6 sm:px-10 py-2.5 sm:py-3 rounded-[1.5rem] font-bold text-sm sm:text-lg transition-all duration-300 ${activeTab === 'cefr' ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            CEFR
                        </button>
                    </div>
                </div>

                {/* Yuqoridagi dumaloq o'quvchilar tanlovi (Avatarlar) va Ism */}
                <div className="relative flex flex-col items-center gap-2 mb-3 sm:mb-4 w-full">
                    <div className="w-full flex justify-center">
                        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-1 max-w-full px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {activeData.map((student, index) => {
                            const isActive = index === currentIndex;
                            return (
                                <motion.button
                                    key={student.id}
                                    onClick={() => triggerAnimation(index)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer ${isActive
                                        ? "p-0.5 sm:p-1 bg-red-600 shadow-md sm:shadow-lg shadow-red-500/50 scale-105"
                                        : "opacity-60 hover:opacity-100 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10"
                                        }`}
                                >
                                    <img
                                        src={student.image}
                                        alt={student.name}
                                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover object-[center_30%] border-2 border-white dark:border-slate-900"
                                    />
                                </motion.button>
                            );
                        })}
                    </div>
                    </div>

                    {/* Tanlangan o'quvchining ismi va bahosi */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeStudent.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col items-center gap-1.5 text-center px-2"
                        >
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-red-600 dark:text-red-500">
                                {activeStudent.name}
                            </h3>
                            <span className="text-xs sm:text-sm font-bold px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full border border-red-200 dark:border-red-500/30">
                                Overall: {activeStudent.scores.overall}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress chiziqchasi */}
                <div className="relative w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-3 sm:mb-5 overflow-hidden">
                    <motion.div
                        className="bg-red-600 h-full"
                        animate={{
                            width: `${((currentIndex + 1) / activeData.length) * 100}%`,
                        }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                </div>

                {/* Pastki qism: Ballar va Sertifikat rasmi */}
                <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-slate-900 dark:text-white p-3 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl shadow-inner">

                    {/* Ballar qismi (Chap tomon) */}
                    <div className="md:col-span-5 flex flex-col gap-1.5 sm:gap-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStudent.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-1.5 sm:gap-2 w-full"
                            >
                                <div className="bg-emerald-600 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl flex justify-between items-center shadow-sm sm:shadow-md text-sm sm:text-base">
                                    <span>{t("resultsSlider.listening")}</span>
                                    <span className="text-base sm:text-lg">{activeStudent.scores.listening}</span>
                                </div>

                                <div className="bg-purple-700 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl flex justify-between items-center shadow-sm sm:shadow-md text-sm sm:text-base">
                                    <span>{t("resultsSlider.reading")}</span>
                                    <span className="text-base sm:text-lg">{activeStudent.scores.reading}</span>
                                </div>

                                <div className="bg-amber-600 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl flex justify-between items-center shadow-sm sm:shadow-md text-sm sm:text-base">
                                    <span>{t("resultsSlider.writing")}</span>
                                    <span className="text-base sm:text-lg">{activeStudent.scores.writing}</span>
                                </div>

                                <div className="bg-blue-600 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl flex justify-between items-center shadow-sm sm:shadow-md text-sm sm:text-base">
                                    <span>{t("resultsSlider.speaking")}</span>
                                    <span className="text-base sm:text-lg">{activeStudent.scores.speaking}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sertifikat rasmi (O'ng tomon) - Kichik telefonlar uchun o'lchami moslashtirildi */}
                    <div className="md:col-span-7 flex justify-center overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStudent.id + '-cert'}
                                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="relative w-full h-[250px] sm:h-[300px] md:h-[380px] flex items-center justify-center group"
                            >
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    src={activeStudent.certImage}
                                    alt={activeTab === 'ielts' ? "IELTS Certificate" : "CEFR Certificate"}
                                    className="max-w-full h-full object-contain rounded-xl shadow-md sm:shadow-lg border border-slate-300 dark:border-slate-700"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>

                {/* TikTok-Style CommentsORG Section under IELTS Results */}
                <div className="mt-8">
                    <CommentsORG isAdmin={false} />
                </div>
            </div>
        </div>
    );
}