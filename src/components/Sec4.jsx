import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaBullseye, FaChalkboardTeacher, FaAward, FaUserGraduate, FaCertificate, FaShieldAlt, FaStar, FaGlobeAmericas } from 'react-icons/fa'

export default function Sec4() {
    const { t } = useTranslation()

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 select-none overflow-hidden">
            {/* Background Glow (Hardware-optimized) */}
            <div 
              className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 w-[450px] h-[450px] -z-10 opacity-70"
              style={{
                background: "radial-gradient(ellipse at center, rgba(220, 38, 38, 0.1) 0%, transparent 68%)"
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                {/* Left Column: Mission, Vision and Quality */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] w-fit">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
                            {t('about.badge', 'BIZNING MISSIYAMIZ')}
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] font-heading">
                        {t('about.titleStart', 'Har bir o‘quvchiga')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-500">
                            {t('about.titleHighlight', 'individual yondashuv')}
                        </span>{' '}
                        {t('about.titleEnd', 'va kafolatlangan natija')}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
                        {t('about.description', "Optimum English Learning Center — zamonaviy metodikalar, Cambridge standartlari va sun'iy intellekt texnologiyalarini o'zida birlashtirgan yetakchi til markazidir.")}
                    </p>

                    {/* Value Proposition Liquid Glass Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Goal Block */}
                        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0c0d10]/90 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.07] hover:border-red-500/50 shadow-xl shadow-black/5 dark:shadow-black/40 hover:shadow-2xl hover:shadow-red-500/15 transition-all duration-300 flex flex-col space-y-3">
                            <div className="w-11 h-11 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center font-bold shadow-xs">
                                <FaBullseye className="text-lg" />
                            </div>
                            <div>
                                <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                                    {t('about.goalTitle', 'Aniq maqsad')}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                                    {t('about.goalDesc', "O'quvchi darajasini aniq belgilab, eng qisqa muddatda kerakli natijaga erishtirish.")}
                                </p>
                            </div>
                        </div>

                        {/* Teacher Block */}
                        <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-[#0c0d10]/90 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.07] hover:border-red-500/50 shadow-xl shadow-black/5 dark:shadow-black/40 hover:shadow-2xl hover:shadow-red-500/15 transition-all duration-300 flex flex-col space-y-3">
                            <div className="w-11 h-11 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center font-bold shadow-xs">
                                <FaChalkboardTeacher className="text-lg" />
                            </div>
                            <div>
                                <h4 className="text-base font-black text-slate-900 dark:text-white font-heading">
                                    {t('about.teacherTitle', 'Kuchli mentorlar')}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                                    {t('about.teacherDesc', "IELTS 8.0+ sertifikatiga ega va xalqaro tajribali ustozlar dars o'tadi.")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Premium Static Editorial Academic Showcase */}
                <div className="lg:col-span-5 relative w-full">
                    <div className="relative rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-white/95 dark:bg-gradient-to-b dark:from-[#10141d] dark:to-[#080a10] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-7 lg:p-8 flex flex-col justify-between">
                        
                        {/* Top Header Row: Certificate Emblem & Live Badge */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-200 dark:border-white/[0.07]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
                                    <FaAward className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-red-600 dark:text-red-400 block">
                                        ACCREDITED STANDARD
                                    </span>
                                    <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white font-heading tracking-tight leading-tight">
                                        Optimum Academic Hub
                                    </h3>
                                </div>
                            </div>
                            <span className="self-start sm:self-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shrink-0">
                                5+ YIL TAJRIBA
                            </span>
                        </div>

                        {/* Middle Editorial Statistics & Core Pillars */}
                        <div className="py-4 sm:py-6 space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
                                    <div className="flex items-center gap-1 sm:gap-1.5 text-red-600 dark:text-red-400 text-[10px] sm:text-xs font-bold mb-0.5 sm:mb-1">
                                        <FaStar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 dark:text-amber-400 shrink-0" />
                                        <span className="truncate">7.5 - 8.5 BAND</span>
                                    </div>
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
                                        85%
                                    </div>
                                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                        Yuqori ball bilan bitiradi
                                    </p>
                                </div>

                                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
                                    <div className="flex items-center gap-1 sm:gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-bold mb-0.5 sm:mb-1">
                                        <FaShieldAlt className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <span className="truncate">100% RASMIY</span>
                                    </div>
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono truncate">
                                        CDI & CEFR
                                    </div>
                                    <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                        Rasmiy test formati
                                    </p>
                                </div>
                            </div>

                            {/* Trust Bullet List */}
                            <div className="space-y-2 pt-1 sm:pt-2">
                                <div className="flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-snug">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 text-[9px] sm:text-[10px] font-bold mt-0.5">
                                        ✓
                                    </div>
                                    <span>Cambridge Universiteti metodologiyasiga asoslangan darsliklar</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-snug">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 text-[9px] sm:text-[10px] font-bold mt-0.5">
                                        ✓
                                    </div>
                                    <span>Sun'iy intellekt orqali har haftalik Task 1 va 2 insholar tahlili</span>
                                </div>
                                <div className="flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300 leading-snug">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 text-[9px] sm:text-[10px] font-bold mt-0.5">
                                        ✓
                                    </div>
                                    <span>Individual kurator va har oy rasmiy Mock Exam imtihoni</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Pill Card: Location & Certification stamp */}
                        <div className="pt-3.5 sm:pt-5 border-t border-slate-200 dark:border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-[11px] sm:text-xs">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <FaGlobeAmericas className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
                                <span className="leading-snug">Buxoro shahri · Rasmiy litsenziyalangan markaz</span>
                            </div>
                            <span className="font-mono text-[10px] sm:text-[11px] text-red-600 dark:text-red-400 font-bold self-start sm:self-auto">
                                #OPTIMUM_ELC
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}