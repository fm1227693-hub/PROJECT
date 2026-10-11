import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FaUserPlus, FaClipboardCheck, FaRocket, FaArrowRight, FaCheckCircle } from 'react-icons/fa'

export default function Sec2() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const steps = [
        {
            num: '01',
            icon: <FaUserPlus className="w-5 h-5" />,
            badge: 'Boshlanish',
            phase: '01 // QADAM',
            title: t('steps.step1Title', "Ro'yxatdan o'tish"),
            desc: t('steps.step1Desc', "Shaxsiy ma'lumotlaringizni qoldiring va mutaxassis bilan bepul konsultatsiyaga yoziling."),
            path: '/register',
            actionText: "Ro'yxatdan o'tish",
            highlight: "1 daqiqa vaqt"
        },
        {
            num: '02',
            icon: <FaClipboardCheck className="w-5 h-5" />,
            badge: 'Tahlil',
            phase: '02 // QADAM',
            title: t('steps.step2Title', "Darajangizni aniqlash"),
            desc: t('steps.step2Desc', "30 daqiqalik CDI va grammatika testini topshirib, aniq darajangiz va kamchiliklaringizni biling."),
            path: '/level-test',
            actionText: "Test topshirish",
            highlight: "Bepul tahlil"
        },
        {
            num: '03',
            icon: <FaRocket className="w-5 h-5" />,
            badge: 'Natija',
            phase: '03 // QADAM',
            title: t('steps.step3Title', "O'qishni boshlash"),
            desc: t('steps.step3Desc', "Mos tarifni tanlab, IELTS 8.0+ darajali mentorlar bilan maqsad sari qat'iy intiling."),
            path: '/pricing',
            actionText: "Tariflar bilan tanishish",
            highlight: "Kafolatlangan o'sish"
        }
    ]

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 select-none overflow-hidden">
            {/* Ambient Background Glow for the Section */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/[0.07] rounded-full blur-[140px] pointer-events-none -z-10" />

            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 relative">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] mb-4">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
                        {t('steps.badge', '3 ODDIY QADAM // THE FAST TRACK')}
                    </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-heading leading-tight">
                    {t('steps.title', "Qanday qilib o'qishni")}{' '}
                    <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
                        boshlaysiz?
                    </span>
                </h2>

                <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
                    {t('steps.description', "IELTS orzuingiz sari atigi 3 ta qadam qoldi. Sinovdan o'ting, tahlil oling va guruhga qo'shiling.")}
                </p>
            </div>

            {/* Steps Container with connecting flow */}
            <div className="relative">
                {/* Horizontal Flow Line on Desktop */}
                <div className="hidden lg:block absolute top-[72px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/60 to-transparent blur-[1px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
                    {steps.map((item, index) => (
                        <div
                            key={item.num}
                            onClick={() => navigate(item.path)}
                            className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-white/[0.6] dark:bg-[#070b14]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/50 shadow-lg shadow-black/5 dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                        >
                            {/* Ambient Top Glow Line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Inner ambient card backlight */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/[0.08] rounded-full blur-3xl pointer-events-none group-hover:bg-red-600/[0.18] transition-all duration-500" />

                            <div>
                                {/* Step Top Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <span className="font-heading text-4xl sm:text-5xl font-black text-slate-300/70 dark:text-white/10 group-hover:text-red-500/30 transition-colors tracking-tighter">
                                        {item.num}
                                    </span>
                                </div>

                                {/* Step Phase & Highlight badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/40">
                                        {item.phase}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        <FaCheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                                        {item.highlight}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors font-heading tracking-tight">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed font-normal">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Bottom Action Footer */}
                            <div className="pt-6 mt-6 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                                    {item.actionText}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 group-hover:translate-x-1 transition-all duration-300">
                                    <FaArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}