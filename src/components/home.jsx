import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
    FaArrowRight, 
    FaCompass, 
    FaBookOpen, 
    FaCheckCircle, 
    FaAward, 
    FaLaptopCode, 
    FaChartLine, 
    FaShieldAlt,
    FaBolt
} from 'react-icons/fa';
import CourseFinderModal from './CourseFinderModal';
import DailyPracticeModal from './DailyPracticeModal';
import GatewayVisual from './visual/GatewayVisual';
import './home.css';

export default function Home() {
    const { t } = useTranslation();
    const [isFinderOpen, setIsFinderOpen] = useState(false);
    const [isPracticeOpen, setIsPracticeOpen] = useState(false);

    return (
        <section className="relative w-full pt-[100px] sm:pt-[125px] pb-16 sm:pb-24 overflow-hidden select-none">
            {/* Cinematic Radial Light Leaks (Hardware-optimized zero rasterization cost) */}
            <div 
              className="pointer-events-none absolute -top-16 left-1/4 w-[600px] max-w-full h-[450px] -z-10 opacity-70"
              style={{
                background: "radial-gradient(ellipse at center, rgba(220, 38, 38, 0.14) 0%, transparent 68%)"
              }}
            />
            <div 
              className="pointer-events-none absolute top-40 right-6 w-[450px] h-[450px] -z-10 opacity-60"
              style={{
                background: "radial-gradient(ellipse at center, rgba(14, 165, 233, 0.09) 0%, transparent 68%)"
              }}
            />
            <div 
              className="pointer-events-none absolute top-96 left-1/2 -translate-x-1/2 w-[500px] h-[350px] -z-10 opacity-50"
              style={{
                background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.06) 0%, transparent 68%)"
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Editorial Composition */}
                <div className="relative py-4 sm:py-8 lg:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                        
                        {/* Left Column: Bold Editorial Headline, Mission & Actions */}
                        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-7">
                            
                            {/* Eyebrow & Technical Coordinate Pill */}
                            <div className="flex flex-wrap items-center gap-2.5">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                    </span>
                                    <span className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-red-600 dark:text-red-400 font-heading">
                                        {t('home.badge', 'OPTIMUM ELC // ACADEMY OF EXCELLENCE')}
                                    </span>
                                </div>

                                <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5">
                                    39°46'N 64°25'E • BUKHARA
                                </span>
                            </div>

                            {/* Headline: Sculptural Editorial Scale */}
                            <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black tracking-tight text-slate-900 dark:text-white leading-[1.04] font-heading">
                                Your Potential.{' '}
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-amber-500">
                                    Without Limits.
                                </span>
                            </h1>

                            {/* Concise Supporting Copy */}
                            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                                {t('home.description', "Optimum — xalqaro Cambridge ta'lim standartlari, rasmiy CDI imtihon simulyatori va sun'iy intellekt orqali IELTS 7.5+ natijalarini kafolatlovchi zamonaviy ta'lim ekotizimi.")}
                            </p>

                            {/* Dual Primary Call to Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full pt-1">
                                <Link
                                    to="/form"
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/35 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base cursor-pointer hover:-translate-y-1 active:translate-y-0"
                                >
                                    <span>{t('home.enrollBtn', "O'qishni boshlash")}</span>
                                    <FaArrowRight className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => setIsFinderOpen(true)}
                                    className="w-full sm:w-auto px-6 py-4 bg-white/60 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.08] text-slate-900 dark:text-white font-bold rounded-2xl border border-slate-300/80 dark:border-white/10 transition-all text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2.5 backdrop-blur-xl hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <FaCompass className="text-red-500 w-4 h-4" />
                                    <span>{t('home.findCourseBtn', 'Kurs tanlash')}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsPracticeOpen(true)}
                                    className="w-full sm:w-auto px-5 py-4 bg-red-50/80 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-2xl border border-red-200/80 dark:border-red-900/40 transition-all text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                    title="Kun so'zi va lug'at amaliyoti"
                                >
                                    <FaBookOpen className="w-3.5 h-3.5 text-red-500" />
                                    <span>{t('home.dailyWordBtn', 'Kun so‘zi')}</span>
                                </button>
                            </div>

                            {/* Trust Telemetry Cards */}
                            <div className="grid grid-cols-3 gap-3 w-full max-w-lg pt-3">
                                <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 backdrop-blur-xl flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <span className="text-lg sm:text-xl font-black text-red-600 dark:text-red-500 font-heading">8.0+</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Mentorlar darajasi</span>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 backdrop-blur-xl flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading">100%</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">CDI Simulyatsiyasi</span>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 backdrop-blur-xl flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-heading">Bepul</span>
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Diagnostik test</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: THE GATEWAY Architectural Brand Visual with Telemetry */}
                        <div className="lg:col-span-5 w-full relative flex items-center justify-center">
                            {/* Gateway Architectural Centerpiece */}
                            <div className="relative w-full flex items-center justify-center">
                                <GatewayVisual />

                                {/* Floating Orbit Card 1: CDI Experience */}
                                <div className="hidden sm:flex absolute -top-4 -left-4 items-center gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md border border-black/[0.08] dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-float-slow">
                                    <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
                                        <FaLaptopCode className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white block">
                                            CDI Lab Simulator
                                        </span>
                                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            100% Official Environment
                                        </span>
                                    </div>
                                </div>

                                {/* Floating Orbit Card 2: AI Essay Assessor */}
                                <div className="hidden sm:flex absolute -bottom-4 -right-2 items-center gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md border border-black/[0.08] dark:border-white/10 shadow-xl shadow-black/10 dark:shadow-[0_15px_35px_rgba(0,0,0,0.6)] animate-float-delayed">
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                                        <FaAward className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white block">
                                            AI Essay Feedback
                                        </span>
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                                            4 Criteria Evaluation
                                        </span>
                                    </div>
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