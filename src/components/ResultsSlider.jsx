import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// O'quvchilar ma'lumotlari bazasi
const resultsData = [
    {
        id: 1,
        name: "Muhammadjon Masharipov",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
        certImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        certImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
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
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
        certImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
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
    const [isAnimating, setIsAnimating] = useState(false);

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
            const nextIndex = indexRef.current === resultsData.length - 1 ? 0 : indexRef.current + 1;

            setIsAnimating(true);
            setCurrentIndex(nextIndex);
            setTimeout(() => {
                setIsAnimating(false);
            }, 300);

        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const activeStudent = resultsData[currentIndex];

    return (
        <div className="">
            <div className="w-full max-w-5xl mx-auto p-6 bg-slate-900 dark:bg-[#090623] border border-slate-800 rounded-3xl shadow-2xl text-white my-10 transition-colors duration-200">
                {/* Sarlavha (i18n orqali) */}
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    {t("resultsSlider.title")}
                </h2>

                {/* Yuqoridagi dumaloq o'quvchilar tanlovi (Avatarlar) va Ism */}
                <div className="flex flex-col items-center gap-3 mb-6">
                    <div className="flex items-center justify-center gap-4 overflow-x-auto pb-2 w-full max-w-md [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {resultsData.map((student, index) => {
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
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-900"
                                    />
                                </button>
                            );
                        })}
                    </div>
                    {/* Tanlangan o'quvchining ismi */}
                    <h3 className="text-xl font-semibold text-red-500 transition-all duration-300">
                        {activeStudent.name}
                    </h3>
                </div>

                {/* Progress chiziqchasi */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
                    <div
                        className="bg-red-600 h-full transition-all duration-500"
                        style={{
                            width: `${((currentIndex + 1) / resultsData.length) * 100}%`,
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
                            <span>{t("resultsSlider.listening")}</span>
                            <span className="text-lg">{activeStudent.scores.listening}</span>
                        </div>

                        <div className="bg-purple-700 text-white font-bold py-2.5 px-5 rounded-xl flex justify-between items-center shadow-md text-base">
                            <span>{t("resultsSlider.reading")}</span>
                            <span className="text-lg">{activeStudent.scores.reading}</span>
                        </div>

                        <div className="bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl flex justify-between items-center shadow-md text-base">
                            <span>{t("resultsSlider.writing")}</span>
                            <span className="text-lg">{activeStudent.scores.writing}</span>
                        </div>

                        <div className="bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl flex justify-between items-center shadow-md text-base">
                            <span>{t("resultsSlider.speaking")}</span>
                            <span className="text-lg">{activeStudent.scores.speaking}</span>
                        </div>

                        <div className="bg-red-600 text-white font-bold py-3.5 px-5 rounded-xl flex justify-between items-center shadow-xl text-lg mt-1">
                            <span>{t("resultsSlider.overall")}</span>
                            <span className="text-xl">{activeStudent.scores.overall}</span>
                        </div>
                    </div>

                    {/* Sertifikat rasmi (O'ng tomon) */}
                    <div className="md:col-span-7 flex justify-center">
                        <div className="relative border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-800 w-full max-h-[400px] flex items-center justify-center">
                            <img
                                src={activeStudent.certImage}
                                alt="IELTS Certificate"
                                className="w-full h-full object-contain transition-all duration-500 hover:scale-105"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}