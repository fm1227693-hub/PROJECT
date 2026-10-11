import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCheckCircle, FaStar, FaTelegramPlane, FaPhoneAlt, FaShieldAlt } from 'react-icons/fa'

const PHONE_NUMBER = '+998 90 082 99 79'

const PLANS = [
    { 
        id: 'basic', 
        price: '500 000', 
        levelKeys: ['starter', 'beginner', 'elementary'], 
        levelsLabel: 'Starter — Elementary',
        features: [
            "Ingliz tili alifbosi va asosiy fonetika",
            "1,000+ eng ko'p ishlatiladigan so'zlar",
            "Boshlang'ich grammatika qoidalari",
            "Haftasiga 3 marta jonli darslar",
            "Shaxsiy mentor tekshiruvi"
        ]
    },
    { 
        id: 'standard', 
        price: '600 000', 
        levelKeys: ['intermediate', 'upperIntermediate'], 
        levelsLabel: 'Elementary — Intermediate',
        features: [
            "Erkin jonli muloqot va Speaking klub",
            "IELTS Foundation va Academic Vocabulary",
            "Barcha grammatik konstruksiyalar",
            "Mini-mock testlar va muntazam tahlil",
            "CDI simulatoriga to'liq kirish"
        ]
    },
    { 
        id: 'advanced', 
        price: '700 000', 
        levelKeys: ['advanced'], 
        levelsLabel: 'IELTS Intensive & Advanced',
        features: [
            "IELTS 7.5+ va 8.0 maqsadli strategiya",
            "AI asosidagi Writing va Speaking tahlili",
            "Real CDI Mock Testlar (barcha 4 modul)",
            "Tajribali IELTS 8.0+ instruktor bilan darslar",
            "Kafolatlangan natija monitoringi"
        ]
    },
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

    const [selectedFilter, setSelectedFilter] = useState('all')
    const filteredPlans = selectedFilter === 'all' ? PLANS : PLANS.filter(p => p.id === selectedFilter)

    const contactTelegram = (planTitle) => {
        const text = encodeURIComponent(
            `Salom! Men ${levelLabel ? `"${levelLabel}"` : ''} darajasi bo'yicha "${planTitle}" kursiga yozilmoqchiman.`
        )
        window.open(`https://t.me/rukhillo?text=${text}`, '_blank')
    }

    const contactPhone = () => {
        window.location.href = `tel:${PHONE_NUMBER}`
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-transparent select-none">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none fixed top-1/4 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                        {t('pricing.badge', 'NATIJAGA YO‘NALTIRILGAN')}
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mt-4 tracking-tight font-heading">
                        {t('pricing.title', "O'zingizga mos kurs va tarifni tanlang")}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-3 text-sm sm:text-base font-normal max-w-2xl mx-auto">
                        {levelLabel
                            ? `Sizning darajangiz: ${levelLabel}. Quyidagi tarif sizga tavsiya etiladi.`
                            : "Har bir bosqich uchun maxsus ishlab chiqilgan o‘quv rejalari va shaffof narxlar."}
                    </p>

                    {/* Matched Plan Alert */}
                    {matchedPlan && (
                        <div className="mt-5 inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 px-5 py-2.5 rounded-2xl shadow-xs">
                            <span className="text-xs sm:text-sm font-black text-red-600 dark:text-red-400">
                                Sizning darajangiz uchun: {matchedPlan.price} so'mlik kurs tavsiya etiladi
                            </span>
                        </div>
                    )}

                    {/* Filter buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                        {[
                            { id: 'all', label: 'Barcha tariflar' },
                            { id: 'basic', label: 'Starter (500k)' },
                            { id: 'standard', label: 'Standard (600k)' },
                            { id: 'advanced', label: 'Advanced (700k)' }
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setSelectedFilter(filter.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedFilter === filter.id
                                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-red-500/40'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    {filteredPlans.map((plan) => {
                        const isMatched = matchedPlan?.id === plan.id || plan.id === 'advanced'

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                                    isMatched
                                        ? 'bg-white dark:bg-[#0c1424] border-2 border-red-600 dark:border-red-500 shadow-xl shadow-red-600/10 dark:shadow-[0_20px_50px_-10px_rgba(200,32,50,0.3)] md:-translate-y-2'
                                        : 'bg-white dark:bg-[#080d19] border border-slate-200 dark:border-white/10 shadow-md hover:border-red-500/30'
                                }`}
                            >
                                {isMatched && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                                        <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 rounded-full shadow-md shadow-red-600/30">
                                            {plan.id === 'advanced' ? 'Eng Mashhur' : 'Tavsiya etiladi'}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 block mb-2">
                                        {plan.levelsLabel}
                                    </span>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
                                            {plan.price}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            so'm / oy
                                        </span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                                        {plan.id === 'basic' && "Ingliz tilini noldan boshlayotganlar uchun to'liq va mustahkam baza."}
                                        {plan.id === 'standard' && "Erkin so'zlashuv, mustahkam grammatika va IELTS ga tayyorgarlik."}
                                        {plan.id === 'advanced' && "IELTS 7.5+ ga qaratilgan intensiv CDI testlar va AI tahlillari."}
                                    </p>

                                    {/* Features Checklist */}
                                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5 mb-8">
                                        {plan.features.map((feat, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                                <FaCheckCircle className="w-4 h-4 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => contactTelegram(plan.levelsLabel)}
                                        className={`w-full py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                            isMatched
                                                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-600/30'
                                                : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900'
                                        }`}
                                    >
                                        <FaTelegramPlane className="w-4 h-4" />
                                        <span>Kursga yozilish</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Direct Phone Call Support Box */}
                <div className="mt-12 max-w-xl mx-auto text-center bg-white dark:bg-[#090e1a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                        Savollaringiz bormi? Bevosita operator bilan bog‘laning:
                    </p>
                    <button
                        onClick={contactPhone}
                        className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 font-black text-lg sm:text-xl tracking-tight cursor-pointer hover:underline"
                    >
                        <FaPhoneAlt className="w-4 h-4" />
                        <span>{PHONE_NUMBER}</span>
                    </button>
                </div>

            </div>
        </div>
    )
}