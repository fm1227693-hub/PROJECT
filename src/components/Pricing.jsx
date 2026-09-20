import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { FaTelegramPlane, FaPhoneAlt, FaCheck } from 'react-icons/fa'

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
        <div className="min-h-screen pt-[120px] pb-20 sm:pb-24 transition-colors duration-300 relative">
            <div className="container-site">

                {/* Sarlavha */}
                <div data-reveal className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                    <span className="eyebrow justify-center">
                        {t('pricing.badge') || 'Natijaga erishish'}
                    </span>
                    <h1 className="display-2 mt-5 text-ink">
                        {t('pricing.title') || "O'zingizga mos kursni tanlang"}
                    </h1>
                    <p className="lede mt-4">
                        {levelLabel
                            ? (t('pricing.descriptionWithLevel') || 'Sizning darajangiz: {{level}}. Quyidagi tarif sizga mos keladi.').replace('{{level}}', levelLabel)
                            : (t('pricing.description') || "Darajangizga mos tarifni tanlab, biz bilan bog'laning.")}
                    </p>

                    {matchedPlan && (
                        <div className="mt-6 inline-flex items-center gap-2.5 bg-accentsoft border border-accent/25 px-4 py-2.5 rounded-full">
                            <FaCheck className="w-3 h-3 text-accent" />
                            <span className="text-[13px] font-semibold text-accent">
                                {(t('pricing.recommendationText') || "Sizga {{price}} so'mlik kurs tavsiya etiladi")
                                    .replace('{{price}}', matchedPlan.price)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Tariflar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
                    {PLANS.map((plan, idx) => {
                        const isMatched = matchedPlan?.id === plan.id
                        return (
                            <div
                                key={plan.id}
                                data-reveal
                                data-reveal-delay={String(idx * 110)}
                                className={`relative card !rounded-[18px] p-7 sm:p-8 flex flex-col transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)] ${
                                    isMatched ? '!border-accent/50 shadow-[var(--shadow-lift)]' : ''
                                }`}
                            >
                                {isMatched && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.14em] bg-accent text-white px-3 py-1.5 rounded-full">
                                            {t('pricing.recommendedBadge') || 'Tavsiya etiladi'}
                                        </span>
                                    </div>
                                )}

                                <p className="meta-label !text-accent">
                                    {plan.levelsLabel}
                                </p>

                                <div className="flex items-baseline gap-2 mt-4 mb-5 pb-5 border-b border-line">
                                    <span className="font-display text-[38px] font-semibold tracking-tight text-ink leading-none">
                                        {plan.price}
                                    </span>
                                    <span className="text-[13px] font-semibold text-muted">
                                        {t('pricing.currency') || "so'm"}
                                    </span>
                                </div>

                                {isMatched && (
                                    <p className="text-[12px] font-semibold text-accent mb-3 -mt-1">
                                        {t('pricing.recommendedInline') || "Sizning darajangiz uchun tavsiya etiladi"}
                                    </p>
                                )}

                                <p className="text-[13.5px] leading-relaxed text-muted mb-7 flex-1">
                                    {t(`pricing.${plan.id}Desc`) ||
                                        (plan.id === 'basic'
                                            ? "Boshlang'ich bosqichdagilar uchun mustahkam fundament kursi."
                                            : plan.id === 'standard'
                                                ? "O'rta darajadagilar uchun erkin muloqot va grammatika kursi."
                                                : "Yuqori darajadagilar uchun professional va ravon muloqot kursi.")}
                                </p>

                                <button
                                    onClick={() => contactTelegram(plan.levelsLabel)}
                                    className={`btn w-full !py-3.5 text-[13px] ${isMatched ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    <FaTelegramPlane className="w-3.5 h-3.5" />
                                    {t('pricing.contactBtn') || "Bog'lanish"}
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Telefon */}
                <div
                    data-reveal
                    className="mt-12 max-w-lg mx-auto text-center border-t border-line pt-8"
                >
                    <p className="text-[13px] font-medium text-muted mb-3">
                        {t('pricing.otherContact') || "Yoki bevosita qo'ng'iroq qiling:"}
                    </p>
                    <button
                        onClick={contactPhone}
                        className="link-line font-display text-[26px] font-semibold text-ink !py-0"
                    >
                        <FaPhoneAlt className="w-4 h-4 text-accent" />
                        {PHONE_NUMBER}
                    </button>
                </div>

            </div>
        </div>
    )
}
