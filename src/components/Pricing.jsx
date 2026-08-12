import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

const TELEGRAM_USERNAME = 'optimum_school'
const PHONE_NUMBER = '+998 90 082 99 79'

const PLANS = [
    { id: 'basic', price: '500 000', levelKeys: ['starter', 'beginner', 'elementary'], levelsLabel: 'Starter — Elementary' },
    { id: 'standard', price: '600 000', levelKeys: ['intermediate', 'upperIntermediate'], levelsLabel: 'Elementary — Advanced' },
    { id: 'advanced', price: '700 000', levelKeys: ['advanced'], levelsLabel: 'Advanced' },
]

function getPlanForLevel(levelKey) {
    return PLANS.find((p) => p.levelKeys.includes(levelKey)) || null
}

export default function Pricing() {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const levelKey = location.state?.levelKey || null
    const levelLabel = location.state?.levelLabel || null
    const matchedPlan = levelKey ? getPlanForLevel(levelKey) : null

    

    const contactTelegram = (planId) => {
        const text = encodeURIComponent(
            `Salom! Men ${levelLabel ? `"${levelLabel}"` : ''} darajasi bo'yicha "${planId}" tarifiga yozilmoqchiman.`
        )
        window.open(`https://t.me/rukhillo?text=${text}`, '_blank')
    }

    const contactPhone = () => {
        window.location.href = `tel:${PHONE_NUMBER}`
    }

    return (
        <div className="min-h-screen bg-transparent px-3 xs:px-4 pt-24 xs:pt-28 pb-16 xs:pb-20 transition-colors duration-300 relative font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">

                <button
                    onClick={() => navigate(-1)}
                    data-aos="fade-right"
                    data-aos-duration="600"
                    className="inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer mb-6 xs:mb-8 hover:-translate-x-1"
                >
                    <span className="text-base xs:text-lg leading-none">←</span>
                    {t('common.backBtn') || 'Orqaga'}
                </button>

                <div data-aos="fade-up" data-aos-duration="700" className="text-center max-w-2xl mx-auto mb-10 xs:mb-14">
                    <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-500/10 px-3 py-1 rounded-full inline-block border border-red-500/20 shadow-sm">
                        {t('pricing.badge') || 'Natijaga erishish'}
                    </span>
                    <h2 className="text-2xl xs:text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-3 xs:mt-4 tracking-tight">
                        {t('pricing.title') || "O'zingizga mos kursni tanlang"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2.5 xs:mt-3 font-medium text-xs xs:text-sm md:text-base px-2">
                        {levelLabel
                            ? (t('pricing.descriptionWithLevel') || 'Sizning darajangiz: {{level}}. Quyidagi tarif sizga mos keladi.').replace('{{level}}', levelLabel)
                            : t('pricing.description') || 'Darajangizga mos tarifni tanlab, biz bilan bog\'laning.'}
                    </p>

                    {matchedPlan && (
                        <div
                            data-aos="fade-up"
                            data-aos-delay="100"
                            className="mt-4 xs:mt-5 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-2.5 rounded-2xl animate-pulse-slow"
                        >
                            <span className="text-xs xs:text-sm font-bold text-red-600 dark:text-red-400">
                                {(t('pricing.recommendationText') || "Sizga {{price}} so'mlik kurs tavsiya etiladi")
                                    .replace('{{price}}', matchedPlan.price)}
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-6">
                    {PLANS.map((plan, idx) => {
                        const isMatched = matchedPlan?.id === plan.id
                        return (
                            <div
                                key={plan.id}
                                data-aos="fade-up"
                                data-aos-delay={idx * 100}
                                data-aos-duration="700"
                                className={`relative rounded-2xl xs:rounded-3xl p-6 xs:p-8 transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl ${isMatched
                                    ? 'bg-gradient-to-b from-red-950/90 to-slate-900/90 border-2 border-red-500/60 shadow-2xl shadow-red-600/20 text-white scale-[1.02] xs:scale-[1.03]'
                                    : 'glass-card border border-slate-200/80 dark:border-white/10 hover:border-red-500/40 shadow-lg'
                                    }`}
                            >
                                {isMatched && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] xs:text-[11px] font-bold uppercase tracking-widest bg-red-600 text-white px-2.5 xs:px-3 py-1 rounded-full shadow-lg shadow-red-500/30 whitespace-nowrap animate-bounce-subtle">
                                        {t('pricing.recommendedBadge') || 'Tavsiya etiladi'}
                                    </span>
                                )}

                                <p className={`text-[10px] xs:text-xs font-bold uppercase tracking-widest mb-2.5 xs:mb-3 ${isMatched ? 'text-red-500' : 'text-red-600 dark:text-red-400'}`}>
                                    {plan.levelsLabel}
                                </p>

                                <div className="flex items-baseline gap-1.5 mb-4 xs:mb-6">
                                    <span className={`text-2xl xs:text-3xl font-black tracking-tight ${isMatched ? 'text-white dark:text-gray-950' : 'text-gray-900 dark:text-white'}`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-xs xs:text-sm font-bold ${isMatched ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
                                        {t('pricing.currency') || "so'm"}
                                    </span>
                                </div>

                                {isMatched && (
                                    <p className="text-[11px] xs:text-xs font-bold text-red-400 mb-3 xs:mb-4 -mt-2 xs:-mt-4">
                                        {t('pricing.recommendedInline') || "Sizning darajangiz uchun tavsiya etiladi"}
                                    </p>
                                )}

                                <p className={`text-xs xs:text-sm font-medium leading-relaxed mb-6 xs:mb-8 ${isMatched ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {t(`pricing.${plan.id}Desc`) ||
                                        (plan.id === 'basic'
                                            ? "Boshlang'ich bosqichdagilar uchun mustahkam fundament kursi."
                                            : plan.id === 'standard'
                                                ? "O'rta darajadagilar uchun erkin muloqot va grammatika kursi."
                                                : "Yuqori darajadagilar uchun professional va ravon muloqot kursi.")}
                                </p>

                                <button
                                    onClick={() => contactTelegram(plan.levelsLabel)}
                                    className={`w-full py-3 xs:py-3.5 rounded-xl xs:rounded-2xl font-bold text-xs xs:text-sm transition-all cursor-pointer active:scale-95 ${isMatched
                                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 hover:shadow-xl'
                                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90'
                                        }`}
                                >
                                    {t('pricing.contactBtn') || 'Bog\'lanish'}
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div
                    data-aos="fade-up"
                    data-aos-duration="700"
                    className="mt-8 xs:mt-12 max-w-lg mx-auto text-center bg-white dark:bg-gray-900 rounded-2xl xs:rounded-3xl p-5 xs:p-6 border border-gray-100 dark:border-gray-800/80 shadow-sm"
                >
                    <p className="text-xs xs:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 xs:mb-4">
                        {t('pricing.otherContact') || 'Yoki bevosita qo\'ng\'iroq qiling:'}
                    </p>
                    <button
                        onClick={contactPhone}
                        className="text-red-600 dark:text-red-400 font-black text-base xs:text-lg tracking-tight cursor-pointer hover:underline transition-transform hover:scale-105 inline-block"
                    >
                        {PHONE_NUMBER}
                    </button>
                </div>

            </div>

            <style>{`
                @keyframes pulse-soft {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(-2px); }
                }
                .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
            `}</style>
        </div>
    )
}