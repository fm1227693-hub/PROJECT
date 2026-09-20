import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'

const STEPS = [
    { num: '01', titleKey: 'steps.step1Title', descKey: 'steps.step1Desc', to: '/register' },
    { num: '02', titleKey: 'steps.step2Title', descKey: 'steps.step2Desc', to: '/level-test' },
    { num: '03', titleKey: 'steps.step3Title', descKey: 'steps.step3Desc', to: '/pricing' },
]

export default function Sec2() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <section className="section-pad !pb-0 select-none">
            <div className="container-site">
                <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <span className="eyebrow justify-center" data-reveal>
                        {t('steps.badge', 'Qanday ishlaydi')}
                    </span>
                    <h2 className="display-2 mt-5 text-ink" data-reveal data-reveal-delay="80">
                        {t('steps.title', '3 oddiy qadamda boshlang')}
                    </h2>
                    <p className="lede mt-4" data-reveal data-reveal-delay="160">
                        {t('steps.description', 'Kursimizga yozilish uchun quyidagi qadamlarni bajaring')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
                    {STEPS.map((step, i) => (
                        <button
                            key={step.num}
                            type="button"
                            onClick={() => navigate(step.to)}
                            data-reveal
                            data-reveal-delay={String(i * 120)}
                            className="group text-left bg-transparent border-0 p-0 appearance-none cursor-pointer"
                            aria-label={t(step.titleKey)}
                        >
                            <div className="flex items-start justify-between border-t border-linestrong pt-6 transition-colors duration-500 group-hover:border-accent">
                                <span className="font-display text-[52px] sm:text-[64px] font-medium leading-[0.9] text-transparent [-webkit-text-stroke:1px_var(--muted)] transition-all duration-500 group-hover:text-accent group-hover:[-webkit-text-stroke:0px]">
                                    {step.num}
                                </span>
                                <span className="mt-2 w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted transition-all duration-500 group-hover:bg-accent group-hover:border-accent group-hover:text-white group-hover:translate-x-1">
                                    <FaArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                            <h3 className="font-display text-[24px] sm:text-[26px] font-semibold text-ink mt-5 transition-colors duration-300">
                                {t(step.titleKey)}
                            </h3>
                            <p className="text-[14.5px] leading-relaxed text-muted mt-2.5 max-w-[38ch]">
                                {t(step.descKey)}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}
