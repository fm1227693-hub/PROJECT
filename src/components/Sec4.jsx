import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaBullseye, FaChalkboardTeacher, FaCheckCircle, FaAward, FaUserGraduate } from 'react-icons/fa'

export default function Sec4() {
    const { t } = useTranslation()

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 select-none overflow-hidden">
            {/* Background Glow */}
            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/[0.08] rounded-full blur-[140px] -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

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
                        <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#070b14]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/40 shadow-lg shadow-black/5 dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col space-y-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center font-bold shadow-xs">
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
                        <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#070b14]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/40 shadow-lg shadow-black/5 dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col space-y-3">
                            <div className="w-11 h-11 bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center font-bold shadow-xs">
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

                {/* Right Column: Visual Feature Showcase */}
                <div className="lg:col-span-5 relative">
                    <div className="relative rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shadow-2xl bg-slate-900 h-[420px] sm:h-[480px]">
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=60&w=800&auto=format&fit=crop"
                            alt="Students studying English at Optimum"
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                        {/* Floating Experience Badge */}
                        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/80 dark:bg-[#070b14]/85 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-600/30">
                                    5+
                                </div>
                                <div>
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white block">
                                        Muvaffaqiyatli Tajriba
                                    </span>
                                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                                        Minglab sertifikatlangan o‘quvchilar
                                    </span>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                                Optimum ELC
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}