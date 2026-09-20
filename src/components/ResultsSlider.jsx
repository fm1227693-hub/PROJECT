import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CommentsORG from "./TikTokComments";

const ieltsData = [
    {
        id: 1,
        name: "Javohir Munirov",
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-06.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-06.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-09.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-09.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-11.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-11.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-19.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-19.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-21.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-21.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-25.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-25.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-23.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-23.jpg",
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
        image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/CEFR68.jpg",
        certImage: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/CEFR68.jpg",
        scores: {
            listening: "66",
            reading: "61",
            writing: "51",
            speaking: "54",
            overall: "B2 (58)",
        },
    },
];

const MODULE_KEYS = ["listening", "reading", "writing", "speaking"];

export default function ResultsSlider() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('ielts');
    const [currentIndex, setCurrentIndex] = useState(0);
    const activeData = activeTab === 'ielts' ? ieltsData : cefrData;
    const scoreMax = activeTab === 'ielts' ? 9 : 70;

    const indexRef = useRef(currentIndex);

    useEffect(() => {
        indexRef.current = currentIndex;
    }, [currentIndex]);

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
        <div id="results-section" className="section-pad !pt-0 w-full">
            <div className="container-site">
                {/* Sarlavha + tablar */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                    <div data-reveal>
                        <span className="eyebrow">{t('resultsSlider.badge', 'Natijalar')}</span>
                        <h2 className="display-2 mt-5 text-ink max-w-[24ch]">
                            {t("resultsSlider.title", "Ba'zi o'quvchilarimizning natijalari")}
                        </h2>
                    </div>

                    {/* IELTS / CEFR tablari */}
                    <div data-reveal data-reveal-delay="120" className="shrink-0">
                        <div className="inline-flex p-1 rounded-full border border-line bg-surface">
                            {['ielts', 'cefr'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setCurrentIndex(0);
                                    }}
                                    className={`relative px-6 sm:px-8 py-2.5 rounded-full text-[13px] font-bold tracking-wide transition-colors duration-300 cursor-pointer ${
                                        activeTab === tab ? 'text-white' : 'text-muted hover:text-ink'
                                    }`}
                                >
                                    {activeTab === tab && (
                                        <motion.span
                                            layoutId="results-tab"
                                            className="absolute inset-0 bg-accent rounded-full"
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        />
                                    )}
                                    <span className="relative z-10">{tab.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Avatarlar */}
                <div data-reveal data-reveal-delay="150" className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 mb-8 scrollbar-none max-w-full">
                    {activeData.map((student, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <button
                                key={student.id}
                                onClick={() => triggerAnimation(index)}
                                aria-label={student.name}
                                aria-pressed={isActive}
                                className={`relative rounded-full shrink-0 cursor-pointer transition-all duration-400 ${
                                    isActive
                                        ? "p-[3px] bg-accent shadow-[0_8px_24px_-8px_var(--accent-ring)]"
                                        : "p-[3px] border border-line hover:border-linestrong opacity-75 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={student.image}
                                    alt={student.name}
                                    loading="lazy"
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover object-[center_30%] block ${isActive ? '' : 'grayscale-[0.4]'}`}
                                />
                            </button>
                        );
                    })}
                </div>

                {/* Asosiy grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    {/* Ballar paneli */}
                    <div className="lg:col-span-5 flex flex-col order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStudent.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col flex-1"
                            >
                                <p className="font-display text-[26px] sm:text-[30px] font-semibold text-ink leading-tight">
                                    {activeStudent.name}
                                </p>

                                {/* Modul qatorlari */}
                                <div className="mt-6 flex flex-col">
                                    {MODULE_KEYS.map((key, i) => {
                                        const value = parseFloat(activeStudent.scores[key]) || 0;
                                        const pct = Math.max(0.06, Math.min(1, value / scoreMax));
                                        return (
                                            <div key={key} className={`flex items-center gap-4 py-3.5 ${i > 0 ? 'border-t border-line' : ''}`}>
                                                <span className="w-[92px] shrink-0 text-[12.5px] font-semibold text-muted">
                                                    {t(`resultsSlider.${key}`)}
                                                </span>
                                                <div className="flex-1 h-[3px] rounded-full bg-surface2 overflow-hidden">
                                                    <motion.div
                                                        className="h-full rounded-full bg-accent origin-left"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: pct }}
                                                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.07 }}
                                                    />
                                                </div>
                                                <span className="font-display text-[21px] font-semibold text-ink w-[42px] text-right leading-none">
                                                    {activeStudent.scores[key]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Overall */}
                                <div className="mt-auto pt-6 flex items-end justify-between border-t border-linestrong">
                                    <span className="meta-label mb-1.5">{t('resultsSlider.overall', 'Overall')}</span>
                                    <span className="font-display text-[52px] sm:text-[64px] font-semibold text-accent leading-[0.9]">
                                        {activeStudent.scores.overall}
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sertifikat */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStudent.id + '-cert'}
                                initial={{ opacity: 0, scale: 0.985 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.985 }}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className="img-frame relative aspect-[4/3] sm:aspect-[16/10] w-full shadow-[var(--shadow-soft)] bg-surface2"
                            >
                                <img
                                    src={activeStudent.certImage}
                                    alt={activeTab === 'ielts' ? `${activeStudent.name} — IELTS certificate` : `${activeStudent.name} — CEFR certificate`}
                                    loading="lazy"
                                    className="!object-cover"
                                />
                                <span className="absolute top-4 left-4 chip !bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-md !text-[10px] !font-bold tracking-[0.1em] uppercase">
                                    {activeTab === 'ielts' ? 'IELTS Result' : 'CEFR Result'}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Progress indikator */}
                <div className="mt-10 flex items-center gap-4">
                    <span className="text-[11px] font-bold text-muted tabular-nums">
                        {String(currentIndex + 1).padStart(2, '0')} / {String(activeData.length).padStart(2, '0')}
                    </span>
                    <div className="relative flex-1 h-px bg-line overflow-hidden rounded-full">
                        <motion.div
                            className="absolute inset-y-0 left-0 w-full bg-accent origin-left"
                            animate={{ scaleX: (currentIndex + 1) / activeData.length }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                    </div>
                </div>

                {/* Izohlar bo'limi */}
                <div className="mt-16">
                    <CommentsORG isAdmin={false} />
                </div>
            </div>
        </div>
    );
}
