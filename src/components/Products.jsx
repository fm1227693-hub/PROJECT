import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
    FaGraduationCap, 
    FaLaptopCode, 
    FaAward, 
    FaClock, 
    FaUsers, 
    FaCheckCircle, 
    FaArrowRight, 
    FaStar,
    FaCompass
} from "react-icons/fa";

const COURSES = [
    {
        id: "general-english",
        category: "General",
        title: "General English Mastery",
        level: "Beginner — Elementary (A1–B1)",
        duration: "3 — 4 oy",
        schedule: "Haftada 3 kun • 1.5 soat",
        badge: "Poydevor Kursi",
        badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
        price: "500 000 so'm / oy",
        desc: "Ingliz tilini noldan mustahkam grammatika, to'g'ri fonetika va faol kundalik so'zlashuv bilan boshlang.",
        features: [
            "Fonetika va harflar to'g'ri talaffuzi",
            "1,200+ eng zarur faol so'z boyligi",
            "Asosiy va murakkab grammatik qoidalar",
            "Har haftalik interaktiv speaking mashg'ulotlari"
        ]
    },
    {
        id: "ielts-foundation",
        category: "IELTS",
        title: "IELTS Foundation & Pre-IELTS",
        level: "Intermediate (B1–B2)",
        duration: "4 oy",
        schedule: "Haftada 3 kun • 2 soat",
        badge: "IELTS Poydevori",
        badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        price: "600 000 so'm / oy",
        desc: "IELTS formatiga kirish: Akademik lug'at, murakkab gap sintaksisi va imtihon strategiyalari poydevori.",
        features: [
            "IELTS 4 ta moduliga to'liq kirish",
            "Akademik lug'at (2,500+ so'z)",
            "Writing Task 1 va Task 2 strukturasi",
            "Muntazam mini-mock sinovlari"
        ]
    },
    {
        id: "ielts-intensive",
        category: "IELTS",
        title: "IELTS Intensive 7.5+ & CDI",
        level: "Upper-Intermediate — Advanced (B2–C1)",
        duration: "5 — 6 oy",
        schedule: "Haftada 3 kun • 2 soat",
        badge: "Eng Mashhur // 7.5+ Target",
        badgeColor: "bg-red-500/15 text-red-500 border-red-500/40",
        price: "700 000 so'm / oy",
        desc: "IELTS 7.5–8.5+ natija uchun intensiv tayyorgarlik. Real kompyuter (CDI) simulyatori va sun'iy intellekt tahlillari.",
        features: [
            "Real CDI kompyuter simulyatori",
            "AI orqali insholarni bir zumda baholash",
            "IELTS 8.0+ darajali instruktorlar mentorligi",
            "Haftalik to'liq rasmiy CDI mock imtihonlari"
        ]
    },
    {
        id: "speaking-club",
        category: "Speaking",
        title: "Executive Speaking Club",
        level: "Barcha darajalar",
        duration: "Davomiy",
        schedule: "Dam olish kunlari • 2 soat",
        badge: "Erkin Nutq",
        badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/30",
        price: "Kurs o'quvchilari uchun bepul",
        desc: "Ingliz tilida gapirishdagi to'siqlarni yengish, xalqaro mavzularda debatlar va ravon nutq rivoji.",
        features: [
            "Native speaker va IELTS 8.5+ moderatorlar",
            "Xalqaro dolzarb mavzularda debatlar",
            "Talaffuz va aksent ustida ishlash",
            "Jonli qiziqarli jamoaviy muhit"
        ]
    }
];

export default function Products() {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState("all");

    const filtered = selectedCategory === "all" 
        ? COURSES 
        : COURSES.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 select-none text-slate-900 dark:text-white overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="pointer-events-none fixed top-1/4 right-0 w-[600px] h-[600px] bg-red-600/[0.08] rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto space-y-14">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
                            KURSLAR KATALOGI // ACADEMIC PROGRAMS
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-heading leading-tight">
                        Optimum ta'lim{' '}
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
                            dasturlari
                        </span>
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
                        Har bir darajadagi o'quvchi uchun individual yondashuv, xalqaro Cambridge standartlari va kafolatlangan natija.
                    </p>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                        {[
                            { id: "all", label: "Barcha kurslar" },
                            { id: "General", label: "General English" },
                            { id: "IELTS", label: "IELTS Dasturlari" },
                            { id: "Speaking", label: "Speaking Club" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedCategory(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedCategory === tab.id
                                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 scale-102"
                                        : "bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-red-500/40 backdrop-blur-xl"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {filtered.map((course) => (
                        <div
                            key={course.id}
                            className="group relative p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-[#070b14]/75 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/40 shadow-xl shadow-black/5 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
                        >
                            {/* Top Ambient Glow */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div>
                                {/* Badges */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${course.badgeColor}`}>
                                        {course.badge}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        {course.duration}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 font-heading tracking-tight group-hover:text-red-500 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-4">
                                    {course.level}
                                </div>

                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed font-normal mb-6">
                                    {course.desc}
                                </p>

                                {/* Features List */}
                                <div className="space-y-2.5 pt-4 border-t border-slate-200/60 dark:border-white/[0.06] mb-6">
                                    {course.features.map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                                            <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Card Footer */}
                            <div className="pt-6 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Narxi</span>
                                    <span className="text-base font-black text-slate-900 dark:text-white font-heading">
                                        {course.price}
                                    </span>
                                </div>

                                <Link
                                    to="/pricing"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-md shadow-red-600/30 hover:shadow-red-600/40 transition-all hover:scale-105"
                                >
                                    <span>Yozilish</span>
                                    <FaArrowRight className="w-2.5 h-2.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}