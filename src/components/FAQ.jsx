import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaQuestionCircle, FaComments, FaArrowRight } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function FAQ() {
    const { t } = useTranslation()
    const [activeIndex, setActiveIndex] = useState(0)

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const FAQ_ITEMS = Array.from({ length: 10 }, (_, i) => ({
        question: t(`faq.q${i + 1}`),
        answer: t(`faq.a${i + 1}`)
    }))

    return (
        <section id="faq" className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-transparent relative z-10 select-none overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/[0.07] rounded-full blur-[160px] -z-10" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider mb-4 border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>{t('faq.badge', 'KO‘P BERILADIGAN SAVOLLAR // FAQ')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-heading leading-tight">
                        {t('faq.titlePrefix', 'Eng muhim savollarga')}{' '}
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
                            {t('faq.titleHighlight', 'javoblar')}
                        </span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-4 max-w-lg mx-auto font-normal leading-relaxed">
                        {t('faq.subtitle', "Kurslar, to'lovlar, dars jadvali va IELTS tayyorgarligi haqida barcha tafsilotlar.")}
                    </p>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-3.5">
                    {FAQ_ITEMS.map((item, index) => {
                        const isOpen = activeIndex === index
                        return (
                            <div
                                key={index}
                                className={`rounded-2xl sm:rounded-3xl transition-all duration-300 border ${
                                    isOpen
                                        ? 'bg-white/90 dark:bg-[#0a0e19]/95 backdrop-blur-3xl border-red-500/50 shadow-xl shadow-red-500/10'
                                        : 'bg-white/70 dark:bg-[#0a0e19]/75 backdrop-blur-2xl border-black/[0.08] dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
                                } overflow-hidden`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4"
                                >
                                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-heading">
                                        {item.question}
                                    </span>
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white rotate-180 shadow-md shadow-red-600/30'
                                                : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                                        }`}
                                    >
                                        <FaChevronDown className="w-3 h-3" />
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                        >
                                            <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed border-t border-slate-200/60 dark:border-white/[0.06] font-normal">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </div>

                {/* Help CTA Box */}
                <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-[#070b14]/75 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-2xl text-center flex flex-col items-center space-y-4">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-950/40 border border-red-500/30 text-red-500 flex items-center justify-center text-xl shadow-xs">
                        <FaComments />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                        {t('faq.ctaTitle', 'Boshqa savollaringiz bormi?')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md font-normal leading-relaxed">
                        {t('faq.ctaDesc', "Mutaxassislarimiz bilan bog‘laning va o‘zingizni qiziqtirgan har qanday savolga bepul konsultatsiya oling.")}
                    </p>
                    <Link
                        to="/form"
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-600/40 hover:shadow-red-600/60 border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <span>{t('faq.ctaBtn', 'Konsultatsiyaga yozilish')}</span>
                        <FaArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

            </div>
        </section>
    )
}