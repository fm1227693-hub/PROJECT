import {useState} from 'react'
import { useTranslation } from 'react-i18next'
import { FaChevronDown } from 'react-icons/fa'
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
        <section id="faq" className="section-pad pt-[130px] !pb-16 relative z-10">
            <div className="container-site">
                <div className="max-w-3xl mx-auto">
                    <div data-reveal className="mb-10 sm:mb-14">
                        <span className="eyebrow">{t('faq.badge', 'Savol-javob')}</span>
                        <h1 className="display-2 mt-5 text-ink">
                            {t('faq.title')}
                        </h1>
                        <p className="lede mt-4">
                            {t('faq.subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-col" data-reveal data-reveal-delay="120">
                        {FAQ_ITEMS.map((item, index) => {
                            const isOpen = activeIndex === index
                            return (
                                <div
                                    key={index}
                                    className="border-t border-line last:border-b"
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        aria-expanded={isOpen}
                                        className="w-full flex items-center justify-between gap-6 py-5 sm:py-6 text-left cursor-pointer group"
                                    >
                                        <span className="flex items-baseline gap-4">
                                            <span className="text-[11px] font-bold text-muted tabular-nums shrink-0">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <span className={`font-display text-[19px] sm:text-[22px] font-semibold leading-snug transition-colors duration-300 ${isOpen ? 'text-accent' : 'text-ink group-hover:text-accent'}`}>
                                                {item.question}
                                            </span>
                                        </span>
                                        <motion.span
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${isOpen ? 'border-accent text-accent' : 'border-line text-muted group-hover:border-linestrong'}`}
                                        >
                                            <FaChevronDown className="w-3 h-3" />
                                        </motion.span>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pl-8 sm:pl-9 pr-4 pb-6 text-[14px] text-soft leading-relaxed max-w-[64ch]">
                                                    {item.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
