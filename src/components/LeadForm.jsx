import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    FaUser, 
    FaPaperPlane, 
    FaCheckCircle, 
    FaSpinner, 
    FaShieldAlt, 
    FaClock, 
    FaStar, 
    FaAward, 
    FaPhoneAlt, 
    FaGraduationCap, 
    FaHeadset,
    FaLock
} from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import axios from 'axios'
import { IMaskInput } from 'react-imask'

export default function LeadForm() {
    const { t, i18n } = useTranslation()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [selectedGoal, setSelectedGoal] = useState('ielts')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_2
    const CHAT_IDS = ["334572168", "6383523156"]

    const currentLang = (i18n.language || 'uz').toLowerCase()

    // Multilingual labels for goals
    const goals = [
        { 
            id: 'ielts', 
            labelUz: 'IELTS 7.0+', 
            labelRu: 'IELTS 7.0+', 
            labelEn: 'IELTS 7.0+',
            descUz: 'Intensiv tayyorgarlik',
            descRu: 'Интенсивная подготовка',
            descEn: 'Intensive preparation'
        },
        { 
            id: 'general', 
            labelUz: 'General English', 
            labelRu: 'General English', 
            labelEn: 'General English',
            descUz: 'Grammatika & muloqot',
            descRu: 'Грамматика и общение',
            descEn: 'Grammar & fluency'
        },
        { 
            id: 'speaking', 
            labelUz: 'Speaking Club', 
            labelRu: 'Разговорный клуб', 
            labelEn: 'Speaking Club',
            descUz: 'Erkin so‘zlashuv',
            descRu: 'Свободная речь',
            descEn: 'Fluent speaking'
        }
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !phone.trim()) {
            setError(t('leadForm.errorAllFields', "Iltimos, barcha maydonlarni to'ldiring!"))
            return
        }

        const digitsOnly = phone.replace(/\D/g, '')
        if (digitsOnly.length < 9) {
            setError(t('leadForm.errorPhoneDigits', "Iltimos, 9 ta raqamni to'liq kiriting!"))
            return
        }

        setError('')
        setLoading(true)

        const chosenGoal = goals.find(g => g.id === selectedGoal)?.labelUz || 'IELTS'
        const message = `⚡ YANGI VIP MUROJAAT (Optimum ELC):\n\n👤 Ism: ${name}\n📱 Tel: +998${digitsOnly}\n🎯 Yo'nalish: ${chosenGoal}\n🌐 Til: ${currentLang.toUpperCase()}`

        try {
            const promises = CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'HTML'
                    }),
                })
            )

            const responses = await Promise.all(promises)
            const allSuccess = responses.every(res => res.ok)

            if (allSuccess) {
                const newLead = {
                    id: Date.now(),
                    isLead: true,
                    name: name,
                    phone: `+998 ${digitsOnly}`,
                    type: `${t('leadForm.badge', 'Bepul maslahat')} (${chosenGoal})`,
                    date: new Date().toLocaleString('uz-UZ'),
                    status: 'Kutilmoqda'
                }

                try {
                    const res = await axios.get(import.meta.env.VITE_FIREBASE_DB_URL)
                    let currentLeads = []
                    if (res.data !== null) {
                        currentLeads = Array.isArray(res.data) ? res.data : Object.values(res.data)
                    }
                    const updatedLeads = [newLead, ...currentLeads]
                    await axios.put(import.meta.env.VITE_FIREBASE_DB_URL, updatedLeads)
                    localStorage.setItem('admin_leads', JSON.stringify(updatedLeads))
                } catch (err) {
                    console.error("API error:", err)
                    const existingLeads = JSON.parse(localStorage.getItem('admin_leads') || '[]')
                    localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existingLeads]))
                }

                setSuccess(true)
                setName('')
                setPhone('')
            } else {
                setError(t('leadForm.errorGeneric', "Xatolik yuz berdi. Qaytadan urinib ko'ring."))
            }
        } catch (err) {
            setError(t('leadForm.errorNetwork', "Internet aloqasini tekshiring."))
        } finally {
            setLoading(false)
        }
    }

    const handleGoBack = () => {
        window.history.back()
    }

    return (
        <div className="min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden flex flex-col justify-center">
            {/* Cinematic Luxury Lighting Rig */}
            <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[450px] sm:h-[600px] bg-gradient-to-tr from-red-600/15 via-rose-600/10 to-transparent rounded-full blur-[160px] -z-10" />
            <div className="pointer-events-none fixed bottom-10 -right-20 w-[450px] h-[450px] bg-red-600/[0.08] rounded-full blur-[140px] -z-10" />
            <div className="pointer-events-none fixed top-10 -left-20 w-[350px] h-[350px] bg-amber-500/[0.04] rounded-full blur-[130px] -z-10" />

            <div className="max-w-6xl w-full mx-auto">
                {/* Back Navigation Bar */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <button 
                        onClick={handleGoBack}
                        className="group inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full bg-white/80 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-xs cursor-pointer backdrop-blur-xl"
                    >
                        <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>{t('leadForm.backBtn', 'Orqaga qaytish')}</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold tracking-wider uppercase">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>QABUL OCHIQ // 2026</span>
                    </div>
                </div>

                {/* Main Pro Editorial Card Frame */}
                <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-b from-white/95 via-white/90 to-slate-50/95 dark:from-[#0f121a]/95 dark:via-[#090b10]/95 dark:to-[#06070a]/98 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_30px_90px_rgba(0,0,0,0.08)] dark:shadow-[0_35px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Architectural hairline highlight accents */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80" />
                    <div className="absolute -top-32 -left-32 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-14 items-stretch">
                        
                        {/* LEFT COLUMN: Editorial Narrative & Social Proof Showcase */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 sm:space-y-8 text-left">
                            <div className="space-y-4 sm:space-y-5">
                                {/* Academic Tag Pill */}
                                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-500/25 text-red-600 dark:text-red-400 text-[10px] sm:text-xs font-black tracking-widest uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                    <span>{t('leadForm.badge', 'BEPUL MASLAHAT & SINOV DARSI')}</span>
                                </div>

                                {/* Main Headline with Architectural Luxury Typo */}
                                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.12] text-slate-900 dark:text-white font-heading">
                                    {t('leadForm.titlePrefix', "Ingliz tilini o'rganishni")}{' '}
                                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-500 to-red-500">
                                        {t('leadForm.titleHighlight', 'bugun boshlang!')}
                                        <svg className="absolute -bottom-1 left-0 w-full h-2 text-red-500/40" viewBox="0 0 100 20" preserveAspectRatio="none">
                                            <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                </h1>

                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
                                    {t('leadForm.description', "Ismingiz va telefon raqamingizni qoldiring. Mutaxassislarimiz siz bilan tezda bog'lanib, bepul darsga yozishadi va barcha savollaringizga javob berishadi.")}
                                </p>
                            </div>

                            {/* Trust Metric Tiles (Pro Dashboard Style) */}
                            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-2">
                                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]">
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                                        8.5<span className="text-red-500 text-sm font-sans">+</span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-tight">
                                        Max IELTS natijasi
                                    </p>
                                </div>

                                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]">
                                    <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                                        15<span className="text-amber-500 text-xs font-mono ml-0.5">daq</span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-tight">
                                        Tezkor aloqa
                                    </p>
                                </div>

                                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06]">
                                    <div className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono leading-none">
                                        0<span className="text-xs font-mono ml-0.5">so'm</span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-tight">
                                        Birinchi sinov darsi
                                    </p>
                                </div>
                            </div>

                            {/* Trust Guarantee Checklist */}
                            <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-white/[0.08]">
                                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs">
                                        <FaCheckCircle className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">
                                        {currentLang === 'ru' ? 'Бесплатное определение вашего уровня (Level Assessment)' : currentLang === 'en' ? 'Free level test & diagnostic review' : 'Darajani bepul aniqlab berish (Diagnostika testi)'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 text-xs">
                                        <FaAward className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="font-medium">
                                        {currentLang === 'ru' ? 'Официальная методика Cambridge и компьютеризированный CDI' : currentLang === 'en' ? 'Official Cambridge methodology & CDI Lab mock' : 'Cambridge metodologiyasi va rasmiy CDI laboratoriyasi'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    <div className="w-5 h-5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 text-xs">
                                        <FaLock className="w-3 h-3" />
                                    </div>
                                    <span className="font-medium">
                                        {currentLang === 'ru' ? '100% конфиденциальность и защита данных' : currentLang === 'en' ? '100% privacy & confidential data security' : "Ma'lumotlaringiz xavfsizligi 100% kafolatlanadi"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: The High-End Pro Conversion Console */}
                        <div className="lg:col-span-5 flex flex-col justify-center w-full">
                            <div className="relative rounded-3xl bg-white/95 dark:bg-[#0f1422]/95 border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                
                                {/* Inner micro highlight hairline */}
                                <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent pointer-events-none" />

                                {success ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-10 text-center space-y-4"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center text-3xl mx-auto shadow-xl shadow-emerald-500/30">
                                            <FaCheckCircle />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                                            {t('leadForm.successTitle', 'Murojaatingiz qabul qilindi!')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                                            {t('leadForm.successDesc', "Tez orada operatorlarimiz siz bilan bog'lanishadi.")}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setSuccess(false)}
                                            className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Yana yuborish
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="text-left pb-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading">
                                                    {t('leadForm.formTitle', 'Bepul darsga yozilish')}
                                                </h3>
                                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">
                                                    BEPUL
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                {currentLang === 'ru' ? 'Заполните форму для бронирования места' : currentLang === 'en' ? 'Fill out the form to reserve your seat' : "Ma'lumotlaringizni kiriting va tugmani bosing"}
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl font-bold">
                                                {error}
                                            </div>
                                        )}

                                        {/* Goal / Direction Selector Pills */}
                                        <div className="text-left">
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                                                {currentLang === 'ru' ? 'Направление обучения' : currentLang === 'en' ? 'Course Target' : "O'quv yo'nalishi"}
                                            </label>
                                            <div className="grid grid-cols-3 gap-1.5">
                                                {goals.map((g) => {
                                                    const isSelected = selectedGoal === g.id
                                                    const label = currentLang === 'ru' ? g.labelRu : currentLang === 'en' ? g.labelEn : g.labelUz
                                                    return (
                                                        <button
                                                            key={g.id}
                                                            type="button"
                                                            onClick={() => setSelectedGoal(g.id)}
                                                            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center border cursor-pointer ${
                                                                isSelected 
                                                                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30' 
                                                                    : 'bg-slate-50 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-red-500/40'
                                                            }`}
                                                        >
                                                            <span className="block truncate">{label}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Name Input */}
                                        <div className="text-left">
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                                {t('leadForm.nameLabel', 'Ismingiz')}
                                            </label>
                                            <div className="relative flex items-center">
                                                <span className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
                                                    <FaUser />
                                                </span>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder={t('leadForm.namePlaceholder', 'Masalan: Aziz')}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone Input with +998 Badge */}
                                        <div className="text-left">
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                                                {t('leadForm.phoneLabel', 'Telefon raqamingiz')}
                                            </label>
                                            <div className="relative flex items-center">
                                                <div className="absolute left-3.5 flex items-center gap-1 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 pointer-events-none pr-2 border-r border-slate-300 dark:border-white/10">
                                                    <span>+998</span>
                                                </div>
                                                <IMaskInput
                                                    mask="(00) 000-00-00"
                                                    value={phone}
                                                    unmask={true}
                                                    onAccept={(val) => setPhone(val)}
                                                    placeholder="(90) 123-45-67"
                                                    className="w-full pl-20 pr-4 py-3.5 bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all shadow-xs font-mono"
                                                />
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="group relative w-full py-4 mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99] overflow-hidden"
                                        >
                                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                                            {loading ? (
                                                <>
                                                    <FaSpinner className="animate-spin text-base" />
                                                    <span>{t('leadForm.submitting', 'Yuborilmoqda...')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{t('leadForm.submitBtn', 'Joy band qilish')}</span>
                                                    <FaPaperPlane className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                                                </>
                                            )}
                                        </button>

                                        {/* Under-button micro guarantee */}
                                        <div className="flex items-center justify-center gap-2 pt-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                                            <FaClock className="w-3 h-3 text-red-500 shrink-0" />
                                            <span>15 daqiqa ichida qo'ng'iroq qilamiz</span>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}