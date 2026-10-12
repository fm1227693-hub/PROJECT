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
        badge: 'Boshlang\'ich',
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
        badge: 'O\'rta Bosqich',
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
        badge: 'Yuqori Natija',
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
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-transparent select-none overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none fixed top-1/4 right-0 w-[600px] h-[600px] bg-red-600/[0.08] rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] mb-4">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
                            {t('pricing.badge', 'NATIJAGA YO‘NALTIRILGAN // TRANSPARENT PRICING')}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-heading leading-tight">
                        {t('pricing.title', "O'zingizga mos kurs va")}{' '}
                        <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
                            tarifni tanlang
                        </span>
                    </h1>

                    <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
                        {levelLabel
                            ? `Sizning darajangiz: ${levelLabel}. Quyidagi tarif sizga tavsiya etiladi.`
                            : "Har bir bosqich uchun maxsus ishlab chiqilgan o‘quv rejalari va shaffof narxlar."}
                    </p>

                    {/* Matched Plan Alert */}
                    {matchedPlan && (
                        <div className="mt-5 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 backdrop-blur-xl px-5 py-2.5 rounded-2xl shadow-xs">
                            <span className="text-xs sm:text-sm font-black text-red-600 dark:text-red-400">
                                Sizning darajangiz uchun: {matchedPlan.price} so'mlik kurs tavsiya etiladi
                            </span>
                        </div>
                    )}

                    {/* Liquid Glass Filter buttons */}
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
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    selectedFilter === filter.id
                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30 scale-102'
                                        : 'bg-white/60 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-red-500/40 backdrop-blur-xl'
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
                                className={`group relative rounded-3xl p-7 sm:p-9 flex flex-col justify-between transition-all duration-300 overflow-hidden ${
                                    isMatched
                                        ? 'bg-white/80 dark:bg-[#070b14]/85 backdrop-blur-3xl border-2 border-red-500 shadow-2xl shadow-red-500/10 dark:shadow-[0_25px_60px_rgba(220,38,38,0.2)] md:-translate-y-2'
                                        : 'bg-white/60 dark:bg-[#070b14]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-lg shadow-black/5 dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-red-500/40 hover:-translate-y-1'
                                }`}
                            >
                                {/* Top Glow Accent */}
                                <div className={`absolute top-0 left-0 right-0 h-[2px] ${
                                    isMatched 
                                        ? 'bg-gradient-to-r from-red-600 via-rose-500 to-red-600' 
                                        : 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
                                }`} />

                                {isMatched && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                                        <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-red-600 to-rose-600 text-white px-3.5 py-1 rounded-full shadow-lg shadow-red-600/40 border border-white/20">
                                            {plan.id === 'advanced' ? 'Eng Mashhur // POPULAR' : 'Tavsiya etiladi'}
                                        </span>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 block">
                                            {plan.levelsLabel}
                                        </span>
                                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                                            {plan.badge}
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-heading">
                                            {plan.price}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                            so'm / oy
                                        </span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed mb-6 font-normal">
                                        {plan.id === 'basic' && "Ingliz tilini noldan boshlayotganlar uchun to'liq va mustahkam poydevor."}
                                        {plan.id === 'standard' && "Erkin so'zlashuv, mustahkam akademik grammatika va IELTS ga kuchli tayyorgarlik."}
                                        {plan.id === 'advanced' && "IELTS 7.5+ ga qaratilgan intensiv CDI testlar, AI tahlili va individual mentorlik."}
                                    </p>

                                    {/* Features Checklist */}
                                    <div className="space-y-3 pt-5 border-t border-slate-200/60 dark:border-white/[0.06] mb-8">
                                        {plan.features.map((feat, idx) => (
                                            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                                <FaCheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
                <div className="mt-14 max-w-xl mx-auto text-center bg-white/70 dark:bg-[#070b14]/75 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-xl">
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