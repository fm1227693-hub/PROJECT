import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQ() {
    const { t } = useTranslation()
    const [activeIndex, setActiveIndex] = useState(null)

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    const FAQ_ITEMS = Array.from({ length: 10 }, (_, i) => ({
        question: t(`faq.q${i + 1}`),
        answer: t(`faq.a${i + 1}`)
    }));

    return (
        <section id="faq" className="py-20 px-5 sm:px-8 font-['Merriweather',serif] bg-transparent relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c41e30]/15 text-[#c41e30] text-xs font-bold uppercase tracking-wider mb-4 border border-[#c41e30]/20">
                        <FaQuestionCircle className="w-3.5 h-3.5" />
                        <span>{t('faq.badge')}</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {t('faq.title')}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-lg mx-auto">
                        {t('faq.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {FAQ_ITEMS.map((item, index) => {
                        const isOpen = activeIndex === index
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="rounded-2xl bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-sm transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer gap-4"
                                >
                                    <span className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100">
                                        {item.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center shrink-0 text-gray-500 dark:text-gray-400"
                                    >
                                        <FaChevronDown className="w-3 h-3" />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/[0.04] pt-4">
                                                {item.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}