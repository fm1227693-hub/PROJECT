import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaQuestionCircle, FaComments } from 'react-icons/fa'
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
        <section id="faq" className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-transparent relative z-10 select-none">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider mb-4 border border-red-200 dark:border-red-900/40">
                        <FaQuestionCircle className="w-3.5 h-3.5" />
                        <span>{t('faq.badge', 'KO‘P BERILADIGAN SAVOLLAR')}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
                        {t('faq.title', 'Eng muhim savollarga javoblar')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 max-w-lg mx-auto font-normal">
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
                                className={`rounded-2xl transition-all duration-300 border ${
                                    isOpen
                                        ? 'bg-white dark:bg-[#0c1424] border-red-500/40 dark:border-red-500/40 shadow-lg shadow-red-500/5'
                                        : 'bg-white dark:bg-[#080d19] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                                } overflow-hidden`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer gap-4"
                                >
                                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                                        {item.question}
                                    </span>
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? 'bg-red-600 text-white rotate-180'
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
                                            <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5">
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
                <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#090e1a] border border-slate-200 dark:border-white/10 text-center flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center text-xl">
                        <FaComments />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading">
                        Boshqa savollaringiz bormi?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
                        Mutaxassislarimiz bilan bog‘laning va o‘zingizni qiziqtirgan har qanday savolga batafsil javob oling.
                    </p>
                    <Link
                        to="/form"
                        className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-red-600/30 transition-all hover:scale-105"
                    >
                        Savol berish / Murojaat qoldirish
                    </Link>
                </div>
            </div>
        </section>
    )
}