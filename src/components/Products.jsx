import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// O'quvchilar ma'lumotlari bazasi
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

export default function Products() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('ielts');
    const [currentIndex, setCurrentIndex] = useState(0);
    const activeData = activeTab === 'ielts' ? ieltsData : cefrData;
    const [isAnimating, setIsAnimating] = useState(false);

    // Index qiymatini xatosiz saqlab turish uchun ref
    const indexRef = useRef(currentIndex);
    indexRef.current = currentIndex;

    const triggerAnimation = (newIndex) => {
        if (newIndex === indexRef.current) return;
        setIsAnimating(true);
        setCurrentIndex(newIndex);
        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    };

    // Har 3 sekundda avtomatik o'tish logikasi
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = indexRef.current === activeData.length - 1 ? 0 : indexRef.current + 1;

            setIsAnimating(true);
            setCurrentIndex(nextIndex);
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);

        }, 3000);

        return () => clearInterval(interval);
    }, [activeData.length]);

    const activeStudent = activeData[currentIndex];

    return (
        <div className="pt-28 pb-12 font-['Plus_Jakarta_Sans',sans-serif] px-4">
            <div className="w-full max-w-5xl mx-auto p-6 sm:p-10 glass-card rounded-[2.5rem] shadow-2xl border border-slate-200/80 dark:border-white/10 mt-0 mb-10 transition-all duration-300 relative overflow-hidden">
                {/* Sarlavha */}
                <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
                    {t('resultsSlider.title', "Ba'zi o'quvchilarimizning natijalari")}
                </h2>

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
                <div className="flex flex-col items-center gap-3 mb-6 w-full">
                    <div className="w-full flex justify-center">
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 max-w-full px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {activeData.map((student, index) => {
                            const isActive = index === currentIndex;
                            return (
                                <button
                                    key={student.id}
                                    onClick={() => triggerAnimation(index)}
                                    className={`relative rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer ${isActive
                                            ? "p-1 bg-red-600 scale-110 shadow-lg shadow-red-500/50"
                                            : "opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={student.image}
                                        alt={student.name}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover object-top border-2 border-slate-900"
                                    />
                                </button>
                            );
                        })}
                    </div>
                    </div>
                    {/* Tanlangan o'quvchining ismi va bahosi */}
                    <div className="flex flex-col items-center gap-1.5 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-red-500">
                            {activeStudent.name}
                        </h3>
                        <span className="text-sm font-bold px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-full border border-red-200 dark:border-red-500/30">
                            Overall: {activeStudent.scores.overall}
                        </span>
                    </div>
                </div>

                {/* Progress chiziqchasi */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
                    <div
                        className="bg-red-600 h-full transition-all duration-500"
                        style={{
                            width: `${((currentIndex + 1) / activeData.length) * 100}%`,
                        }}
                    ></div>
                </div>

                {/* Pastki qism: Ballar va Sertifikat rasmi animatsiya bilan */}
                <div
                    className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-6 md:p-8 rounded-2xl shadow-inner transition-all duration-300 transform ${isAnimating
                            ? "opacity-0 -translate-y-4"
                            : "opacity-100 translate-y-0"
                        }`}
                >
                    {/* Ballar qismi (Chap tomon) */}
                    <div className="md:col-span-5 flex flex-col gap-3">
                        <div className="bg-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl flex justify-between items-center shadow-md text-base">
                            <span>Listening</span>
                            <span className="text-lg">{activeStudent.scores.listening}</span>
                        </div>

                        <div className="bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl flex justify-between items-center shadow-md text-base">
                            <span>Reading</span>
                            <span className="text-lg">{activeStudent.scores.reading}</span>
                        </div>

                        <div className="bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl flex justify-between items-center shadow-md text-base">
                            <span>Writing</span>
                            <span className="text-lg">{activeStudent.scores.writing}</span>
                        </div>

                        <div className="bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl flex justify-between items-center shadow-md text-base">
                            <span>Speaking</span>
                            <span className="text-lg">{activeStudent.scores.speaking}</span>
                        </div>

                    </div>

                    {/* Sertifikat rasmi (O'ng tomon) */}
                    <div className="md:col-span-7 flex justify-center">
                        <div className="relative w-full max-h-[400px] flex items-center justify-center">
                            <img
                                src={activeStudent.certImage}
                                alt={activeTab === 'ielts' ? "IELTS Certificate" : "CEFR Certificate"}
                                className="max-w-full h-full max-h-[400px] object-contain rounded-xl shadow-lg border-2 border-slate-200 dark:border-slate-700 transition-all duration-500 hover:scale-105"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}