import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CommentsORG from "./TikTokComments";

const resultsData = [
    {
        id: 1,
        name: "Muhammadjon Masharipov",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=60",
        certImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=60",
        scores: {
            listening: "9.0",
            reading: "9.0",
            writing: "7.0",
            speaking: "7.5",
            overall: "8.0",
        },
    },
    {
        id: 2,
        name: "Alisher Valiyev",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=60",
        certImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=60",
        scores: {
            listening: "8.5",
            reading: "8.0",
            writing: "7.5",
            speaking: "8.0",
            overall: "8.0",
        },
    },
    {
        id: 3,
        name: "Madina Karimova",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=60",
        certImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=60",
        scores: {
            listening: "8.0",
            reading: "8.5",
            writing: "7.0",
            speaking: "8.5",
            overall: "8.0",
        },
    },
];

export default function ResultsSlider() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const indexRef = useRef(currentIndex);
    indexRef.current = currentIndex;

    const triggerAnimation = (newIndex) => {
        if (newIndex === indexRef.current) return;
        setCurrentIndex(newIndex);
    };

    // Har 3 sekundda avtomatik o'tish logikasi
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = indexRef.current === resultsData.length - 1 ? 0 : indexRef.current + 1;
            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const activeStudent = resultsData[currentIndex];

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
                    className="relative text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 px-2"
                >
                    {t("resultsSlider.title")}
                </motion.h2>

                {/* Yuqoridagi dumaloq o'quvchilar tanlovi (Avatarlar) va Ism */}
                <div className="relative flex flex-col items-center gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 overflow-x-auto pb-1 w-full max-w-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4">
                        {resultsData.map((student, index) => {
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
                                        className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white dark:border-slate-900"
                                    />
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Tanlangan o'quvchining ismi */}
                    <AnimatePresence mode="wait">
                        <motion.h3
                            key={activeStudent.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="text-base sm:text-lg md:text-xl font-semibold text-red-600 dark:text-red-500 text-center px-2"
                        >
                            {activeStudent.name}
                        </motion.h3>
                    </AnimatePresence>
                </div>

                {/* Progress chiziqchasi */}
                <div className="relative w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mb-3 sm:mb-5 overflow-hidden">
                    <motion.div
                        className="bg-red-600 h-full"
                        animate={{
                            width: `${((currentIndex + 1) / resultsData.length) * 100}%`,
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

                                <div className="bg-red-600 text-white font-bold py-2 sm:py-2.5 px-4 sm:px-5 rounded-xl flex justify-between items-center shadow-md sm:shadow-xl text-base mt-0.5">
                                    <span>{t("resultsSlider.overall")}</span>
                                    <span className="text-lg sm:text-xl">{activeStudent.scores.overall}</span>
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
                                className="relative border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-md sm:shadow-lg bg-white dark:bg-slate-800 w-full h-[180px] sm:h-[220px] md:h-[280px] flex items-center justify-center group"
                            >
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    src={activeStudent.certImage}
                                    alt="IELTS Certificate"
                                    className="w-full h-full object-contain p-2"
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