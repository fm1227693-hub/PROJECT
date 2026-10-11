import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaBullseye, FaChalkboardTeacher, FaCheckCircle, FaAward, FaUserGraduate } from 'react-icons/fa'

export default function Sec4() {
    const { t } = useTranslation()

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 select-none">
            {/* Background Glow */}
            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

                {/* Left Column: Mission, Vision and Quality */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full text-xs font-black uppercase tracking-wider w-fit border border-red-200 dark:border-red-900/40">
                        <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
                        {t('about.badge', 'BIZNING MISSYAMIZ')}
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] font-heading">
                        {t('about.titleStart', 'Har bir o‘quvchiga')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                            {t('about.titleHighlight', 'individual yondashuv')}
                        </span>{' '}
                        {t('about.titleEnd', 'va kafolatlangan natija')}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
                        {t('about.description', "Optimum English Learning Center — zamonaviy metodikalar, Cambridge standartlari va sun'iy intellekt texnologiyalarini o'zida birlashtirgan yetakchi til markazidir.")}
                    </p>

                    {/* Value Proposition Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Goal Block */}
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-white/10 shadow-sm hover:border-red-500/30 transition-all flex flex-col space-y-3">
                            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-bold border border-red-200 dark:border-red-800/40">
                                <FaBullseye className="text-base" />
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
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-white/10 shadow-sm hover:border-red-500/30 transition-all flex flex-col space-y-3">
                            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center font-bold border border-red-200 dark:border-red-800/40">
                                <FaChalkboardTeacher className="text-base" />
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
                    <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-slate-900 h-[420px] sm:h-[480px]">
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=60&w=800&auto=format&fit=crop"
                            alt="Students studying English at Optimum"
                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                        {/* Floating Experience Badge */}
                        <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg flex items-center justify-between">
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