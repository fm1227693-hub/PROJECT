import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FaUserPlus, FaClipboardCheck, FaRocket, FaArrowRight } from 'react-icons/fa'

export default function Sec2() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const steps = [
        {
            num: '01',
            icon: <FaUserPlus />,
            phase: t('steps.phase1', 'Boshlanish'),
            title: t('steps.step1Title', "Ro'yxatdan o'tish"),
            desc: t('steps.step1Desc', "Shaxsiy ma'lumotlaringizni qoldiring va mutaxassis bilan bepul konsultatsiyaga yoziling."),
            path: '/register',
            actionText: t('steps.action1', "Ro'yxatdan o'tish"),
            highlight: t('steps.h1', '1 daqiqa vaqt'),
        },
        {
            num: '02',
            icon: <FaClipboardCheck />,
            phase: t('steps.phase2', 'Tahlil'),
            title: t('steps.step2Title', 'Darajangizni aniqlash'),
            desc: t('steps.step2Desc', '30 daqiqalik CDI va grammatika testini topshirib, aniq darajangiz va kamchiliklaringizni biling.'),
            path: '/level-test',
            actionText: t('steps.action2', 'Test topshirish'),
            highlight: t('steps.h2', 'Bepul tahlil'),
        },
        {
            num: '03',
            icon: <FaRocket />,
            phase: t('steps.phase3', 'Natija'),
            title: t('steps.step3Title', "O'qishni boshlash"),
            desc: t('steps.step3Desc', "Mos tarifni tanlab, IELTS 8.0+ darajali mentorlar bilan maqsad sari qat'iy intiling."),
            path: '/pricing',
            actionText: t('steps.action3', 'Tariflar bilan tanishish'),
            highlight: t('steps.h3', "Kafolatlangan o'sish"),
        }
    ]

    return (
        <section
            className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8 select-none"
        >
            {/* Architectural top divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.08] to-transparent" />

            {/* Ambient red glow — right side */}
            <div
                className="absolute top-1/2 right-0 -translate-y-1/2 pointer-events-none w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] opacity-70 -z-10"
                style={{
                    background: 'radial-gradient(ellipse at right center, rgba(225,29,72,0.10) 0%, transparent 68%)',
                }}
            />

            <div className="max-w-7xl mx-auto">

                {/* Section header */}
                <div className="max-w-2xl mb-12 sm:mb-16">
                    {/* Label */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-xs mb-4">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                            {t('steps.badge', '3 ODDIY QADAM // THE FAST TRACK')}
                        </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] font-heading">
                        {t('steps.title', "Qanday qilib o'qishni")}{' '}
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">boshlaysiz?</span>
                    </h2>

                    <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                        {t('steps.description', "IELTS orzuingiz sari atigi 3 ta qadam qoldi. Sinovdan o'ting, tahlil oling va guruhga qo'shiling.")}
                    </p>
                </div>

                {/* Steps grid — Responsive 1 column on mobile, 3 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Connecting horizontal rule (desktop) */}
                    <div
                        className="hidden md:block absolute top-[52px] left-[10%] right-[10%] h-[1px] pointer-events-none -z-0"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(225,29,72,0.3) 30%, rgba(225,29,72,0.3) 70%, transparent)',
                        }}
                    />

                    {steps.map((item, index) => (
                        <article
                            key={item.num}
                            onClick={() => navigate(item.path)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
                            aria-label={item.title}
                            className="group relative p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0c0d10]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/50 shadow-xl shadow-black/5 dark:shadow-black/50 hover:shadow-2xl hover:shadow-red-500/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col justify-between"
                        >
                            {/* Top accent line on hover */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div>
                                {/* Step number (huge watermark) */}
                                <span className="absolute top-4 right-5 font-heading text-5xl sm:text-6xl font-black text-black/[0.04] dark:text-white/[0.04] pointer-events-none select-none leading-none">
                                    {item.num}
                                </span>

                                {/* Icon */}
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center text-lg mb-6 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>

                                {/* Phase label */}
                                <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-2.5">
                                    {item.num} // {item.phase}
                                </p>

                                {/* Title */}
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>

                            {/* Bottom footer */}
                            <div className="mt-7 pt-5 border-t border-slate-200 dark:border-white/[0.07] flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                    {item.actionText}
                                </span>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-center text-xs shadow-md shadow-red-600/30 group-hover:scale-110 group-hover:translate-x-1 transition-all shrink-0">
                                    <FaArrowRight />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Architectural bottom divider */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/[0.08] to-transparent" />
        </section>
    )
}