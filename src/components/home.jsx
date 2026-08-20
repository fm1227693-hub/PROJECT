import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
    FaArrowRight, 
    FaFire, 
    FaRobot, 
    FaHeadphones, 
    FaChartLine, 
    FaCheckCircle, 
    FaStar, 
    FaGraduationCap,
    FaLaptopCode,
    FaLayerGroup,
    FaUsers
} from 'react-icons/fa';

import './home.css';

export default function Home() {
    const { t } = useTranslation()

    // 3D Deck Tilt state for interactive mouse hover
    const [transformStyle, setTransformStyle] = useState('rotateX(0deg) rotateY(0deg)')

    const handleMouseMove = (e) => {
        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2
        
        // Subtle 3D tilt calculation
        const rotX = (-y / rect.height) * 14
        const rotY = (x / rect.width) * 14
        setTransformStyle(`rotateX(${rotX}deg) rotateY(${rotY}deg)`)
    }

    const handleMouseLeave = () => {
        setTransformStyle('rotateX(0deg) rotateY(0deg)')
    }

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="w-full mx-auto px-4 sm:px-6 lg:px-8 select-none transition-colors duration-200 pt-[105px] pb-8 min-h-screen flex items-center justify-center relative overflow-visible"
        >
            {/* Ambient Background Glows - Crimson Red Theme */}
            <div className="absolute  top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-gradient-to-tr from-red-600/25 via-rose-500/20 to-amber-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-gradient-to-br from-rose-600/20 via-red-700/15 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Resend-style Glass Container */}
            <div
                data-aos="fade-down"
                data-aos-duration="800"
                className="w-full min-h-[80vh] flex flex-col lg:flex-row gap-6 lg:gap-14 items-center justify-between glass-card px-5 py-7 sm:p-9 lg:px-11 lg:py-12 rounded-2xl sm:rounded-[2.8rem] relative overflow-visible transition-all duration-500 border border-red-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            >
                {/* Left Resend-style Editorial Hero Content */}
                <div
                    data-aos="fade-right"
                    data-aos-duration="900"
                    className="flex flex-col items-center lg:items-start justify-center space-y-4 lg:space-y-5 lg:w-1/2 text-center lg:text-left relative z-10 w-full"
                >
                    {/* Top Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-600/90 via-rose-600 to-red-700 text-white rounded-full text-[10px] sm:text-xs font-extrabold w-fit shadow-md shadow-red-600/35 tracking-wider uppercase border border-red-400/30">
                        <FaFire className="w-3 h-3 animate-bounce text-amber-300" />
                        <span>{t('home.badge', 'OPTIMUM SCHOOL OF ENGLISH')}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black tracking-tight text-gray-900 dark:text-white leading-[1.1] font-heading">
                        {t('home.titlePrefix', 'IELTS natijangizni')}{' '}
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(239,68,68,0.35)]">
                            {t('home.titleHighlight', 'CDI Mock & AI')}
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-2xl">
                        {t('home.description', 'Optimum o‘quv platformasi barcha darajadagi o‘quvchilar uchun CDI simulatori va AI tahlillari orqali 7.5+ Band natijalarini ta’minlaydi.')}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 pb-2 w-full">
                        <Link
                            to="/form"
                            className="relative group w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold rounded-2xl shadow-[0_8px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.6)] transition-all duration-300 flex items-center justify-center gap-2.5 text-[15px] cursor-pointer hover:-translate-y-1 active:scale-95 overflow-hidden border border-red-400/40"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                            <span className="relative z-10 whitespace-nowrap">{t('home.enrollBtn', 'Bepul sinov darsi')}</span>
                            <FaArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform shrink-0" />
                        </Link>
                        
                        <Link
                            to="/about"
                            className="w-full sm:w-auto px-10 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-white font-bold rounded-2xl border border-gray-700 hover:border-red-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 text-[15px] text-center cursor-pointer hover:-translate-y-1 active:scale-95 backdrop-blur-md flex items-center justify-center whitespace-nowrap"
                        >
                            {t('home.moreInfoBtn', "Batafsil ma'lumot")}
                        </Link>
                    </div>


                </div>

                {/* Right — Desktop only */}
                <div
                    data-aos="fade-left"
                    data-aos-duration="900"
                    className="hidden lg:flex w-full lg:w-1/2 justify-center items-center py-2 relative z-10 cyber-deck-scene"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="transform scale-[1.05] xl:scale-110 2xl:scale-[1.15] w-full flex justify-center" style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}>
                        <div 
                            className="relative w-full max-w-[410px] lg:max-w-[440px] cyber-deck-wrapper transition-transform duration-200 ease-out py-3"
                            style={{ transform: transformStyle }}
                        >
                        {/* Main General Optimum IELTS Platform Card */}
                        <div className="neon-glass-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl relative overflow-hidden">
                            {/* Glowing Red Top Border Highlight */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"></div>

                            {/* Card Header: General Platform Info */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-800/80">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-600/40">
                                        <FaLayerGroup className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                                            Optimum IELTS Hub
                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded-full border border-red-500/30">ALL LEVELS</span>
                                        </h3>
                                        <p className="text-gray-400 text-xs">Full Exam Practice Suite</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">TARGET 8.5</span>
                                    <p className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                                        <FaCheckCircle className="text-emerald-400 text-[10px]" /> Universal System
                                    </p>
                                </div>
                            </div>

                            {/* General IELTS Module Performance Breakdown */}
                            <div className="space-y-4 pt-4">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className="text-gray-300 flex items-center gap-1.5"><FaLayerGroup className="text-red-400" /> Extensive Practice Library</span>
                                        <span className="text-red-400 font-black">100+ Mock Tests</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
                                        <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full w-[96%] shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className="text-gray-300 flex items-center gap-1.5"><FaLaptopCode className="text-rose-400" /> Full CDI Simulation</span>
                                        <span className="text-rose-400 font-bold">Authentic Exam UI</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
                                        <div className="h-full bg-gradient-to-r from-rose-500 to-red-500 rounded-full w-[98%] shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-1.5">
                                        <span className="text-gray-300 flex items-center gap-1.5"><FaChartLine className="text-amber-400" /> Detailed Analytics</span>
                                        <span className="text-amber-400 font-bold">Track Your Progress</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden p-0.5 border border-gray-800">
                                        <div className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full w-[94%] shadow-[0_0_10px_rgba(245,158,11,0.8)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Top Right Floating Badge: Real CDI Exam Engine */}
                        <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 bg-slate-900/95 backdrop-blur-xl border border-red-500/40 p-3.5 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.8)] flex items-center gap-3 z-20">
                            <div className="w-8.5 h-8.5 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
                                <FaLaptopCode className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-gray-300">CDI Mock Engine</p>
                                <div className="flex items-center gap-1 text-[10px] text-red-400 font-semibold pt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                                    <span>Real Exam Simulator</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Left Floating Badge: Universal Success Rate */}
                        <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-slate-900/95 backdrop-blur-xl border border-red-500/40 px-4 py-3 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.8)] flex items-center gap-3 z-20">
                            <div className="w-7.5 h-7.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <FaChartLine className="w-3.5 h-3.5" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-extrabold tracking-wider text-gray-400">Success Rate</p>
                                <p className="text-xs font-black text-white flex items-center gap-1">
                                    10,000+ Learners <span className="text-emerald-400">Band 7.5+</span>
                                </p>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}