import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
    FaArrowRight, 
    FaChartLine, 
    FaCheckCircle, 
    FaLaptopCode,
    FaLayerGroup,
    FaCompass,
    FaBookOpen,
    FaAward
} from 'react-icons/fa';
import CourseFinderModal from './CourseFinderModal';
import DailyPracticeModal from './DailyPracticeModal';
import './home.css';

export default function Home() {
    const { t } = useTranslation();
    const [isFinderOpen, setIsFinderOpen] = useState(false);
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);

    return (
        <section className="relative w-full pt-[90px] sm:pt-[110px] pb-12 sm:pb-16 overflow-hidden select-none">
            {/* Cinematic architectural lighting background */}
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[850px] max-w-full h-[450px] bg-gradient-to-b from-red-600/12 via-rose-600/8 to-transparent rounded-full blur-[140px] -z-10" />
            <div className="pointer-events-none absolute top-36 right-0 w-[420px] h-[420px] bg-rose-600/6 dark:bg-rose-500/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Editorial Composition - Open to Global Background */}
                <div className="relative py-4 sm:py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        
                        {/* Left Column: Editorial Brand Headline & Conversions */}
                        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                            
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-500/10 dark:bg-red-950/50 border border-red-500/20 dark:border-red-500/30 shadow-xs">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                </span>
                                <span className="text-[11px] sm:text-xs font-black tracking-widest uppercase text-red-600 dark:text-red-400">
                                    {t('home.badge', 'OPTIMUM SCHOOL OF ENGLISH')}
                                </span>
                            </div>

                            {/* Headline with deliberate editorial line breaks */}
                            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-[#151924] dark:text-[#F7F5F0] leading-[1.07] font-heading">
                                {t('home.titlePrefix', 'IELTS natijangizni')}{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-500">
                                    {t('home.titleHighlight', 'CDI Mock & AI')}
                                </span>{' '}
                                orqali kafolatlang
                            </h1>

                            {/* Description */}
                            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                                {t('home.description', 'Optimum o‘quv platformasi barcha darajadagi o‘quvchilar uchun CDI simulatori va AI tahlillari orqali 7.5+ Band natijalarini ta’minlaydi.')}
                            </p>

                            {/* Trust badges */}
                            <div className="grid grid-cols-3 gap-3 w-full max-w-lg pt-1 pb-2">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <span className="text-lg sm:text-xl font-black text-red-600 dark:text-red-500">8.0+</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ustozlar darajasi</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">100%</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">CDI Simulyatsiyasi</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400">Bepul</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Daraja testi</span>
                                </div>
                            </div>

                            {/* Primary Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-1">
                                <Link
                                    to="/form"
                                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <span>{t('home.enrollBtn', 'Bepul sinov darsi')}</span>
                                    <FaArrowRight className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setIsFinderOpen(true)}
                                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700/80 transition-all text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <FaCompass className="text-red-600 dark:text-red-400 w-4 h-4" />
                                    <span>{t('home.findCourseBtn', 'Kurs tanlash')}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsPracticeOpen(true)}
                                    className="w-full sm:w-auto px-5 py-3.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 font-bold rounded-2xl border border-red-200/80 dark:border-red-800/40 transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
                                    title="Kun so'zi va lug'at amaliyoti"
                                >
                                    <FaBookOpen className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                    <span>{t('home.dailyWordBtn', 'Kun so‘zi')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Platform Overview Surface */}
                        <div className="lg:col-span-5 w-full">
                            <div className="relative rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-[#070b14]/75 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] p-5 sm:p-7 shadow-2xl shadow-black/5 dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                                {/* Top ambient highlight glow */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                                
                                {/* Card Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-white/[0.08]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
                                            <FaLayerGroup className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                                                Optimum CDI Platform
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                Official Simulator & AI Assessment
                                            </p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                        LIVE
                                    </span>
                                </div>

                                {/* Feature Metrics */}
                                <div className="space-y-3.5 pt-5">
                                    <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <FaLaptopCode className="text-red-600 dark:text-red-400" />
                                                CDI Exam Experience
                                            </span>
                                            <span className="text-red-600 dark:text-red-400 font-extrabold">100% Real</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full w-[96%]" />
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <FaAward className="text-rose-500 dark:text-rose-400" />
                                                IELTS Writing AI Assessor
                                            </span>
                                            <span className="text-rose-600 dark:text-rose-400 font-extrabold">Instant Bands</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full w-[94%]" />
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-2">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                <FaChartLine className="text-amber-500 dark:text-amber-400" />
                                                Comprehensive Analytics
                                            </span>
                                            <span className="text-amber-600 dark:text-amber-400 font-extrabold">Band 7.5+ Aim</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full w-[92%]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Quick Action Strip */}
                                <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                        <FaCheckCircle className="text-emerald-500" />
                                        <span>Rasmiy Cambridge dasturi</span>
                                    </div>
                                    <Link
                                        to="/level-test"
                                        className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                                    >
                                        Test topshirish →
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modals */}
            <CourseFinderModal isOpen={isFinderOpen} onClose={() => setIsFinderOpen(false)} />
            <DailyPracticeModal isOpen={isPracticeOpen} onClose={() => setIsPracticeOpen(false)} />
        </section>
    );
}