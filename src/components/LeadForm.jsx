import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUser, FaPaperPlane, FaCheckCircle, FaSpinner, FaArrowRight, FaShieldAlt, FaClock } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import axios from 'axios'
import { IMaskInput } from 'react-imask'

export default function LeadForm() {
    const { t } = useTranslation()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN_2
    const CHAT_IDS = ["334572168", "6383523156"]

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

        const message = `Yangi murojaat (Optimum ELC):\n\nIsm: ${name}\nTel: +998${digitsOnly}`

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
                    type: t('leadForm.badge', 'Bepul maslahat'),
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
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/[0.08] rounded-full blur-[160px] -z-10" />

            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-2 mb-8 px-5 py-2.5 rounded-full bg-white/60 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/40 transition-all shadow-xs cursor-pointer backdrop-blur-xl"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    <span>Orqaga</span>
                </button>

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl sm:rounded-[2.5rem] bg-white/80 dark:bg-[#0a0e19]/90 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-2xl shadow-black/5 dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 sm:p-10 lg:p-12 overflow-hidden">
                    {/* Top ambient highlight line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                    {/* Left Column: Information & Trust */}
                    <div className="lg:col-span-6 space-y-5 text-left">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] dark:bg-white/[0.03] text-red-600 dark:text-red-400 rounded-full text-xs font-black tracking-wider uppercase border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span>{t('leadForm.badge', 'BEPUL MASLAHAT & SINOV DARSI')}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] font-heading">
                            {t('leadForm.titlePrefix', "Ingliz tilini o'rganishni")}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-red-400">
                                {t('leadForm.titleHighlight', 'bugun boshlang!')}
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                            {t('leadForm.description', "Ismingiz va telefon raqamingizni qoldiring. Mutaxassislarimiz siz bilan tezda bog'lanib, bepul darsga yozishadi va barcha savollaringizga javob berishadi.")}
                        </p>

                        <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-white/[0.06]">
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                <FaCheckCircle className="text-emerald-500 w-4 h-4 shrink-0" />
                                <span>Darajani bepul aniqlab berish</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                <FaShieldAlt className="text-red-600 dark:text-red-400 w-4 h-4 shrink-0" />
                                <span>Ma'lumotlaringiz xavfsizligi kafolatlanadi</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                <FaClock className="text-amber-500 w-4 h-4 shrink-0" />
                                <span>15 daqiqa ichida qo'ng'iroq</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Direct Lead Submission Form */}
                    <div className="lg:col-span-6 w-full">
                        <div className="rounded-3xl bg-slate-50/80 dark:bg-white/[0.03] backdrop-blur-2xl border border-slate-200/60 dark:border-white/[0.06] p-6 sm:p-8 shadow-sm">
                            {success ? (
                                <div className="py-10 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-3xl mx-auto border border-emerald-500/30">
                                        <FaCheckCircle />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading">
                                        {t('leadForm.successTitle', 'Murojaatingiz qabul qilindi!')}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                                        {t('leadForm.successDesc', "Tez orada operatorlarimiz siz bilan bog'lanishadi.")}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSuccess(false)}
                                        className="mt-4 px-7 py-3 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-extrabold shadow-lg shadow-red-600/40 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Yana yuborish
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white font-heading mb-1">
                                        {t('leadForm.formTitle', 'Bepul darsga yozilish')}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                        Ma'lumotlaringizni kiriting va tugmani bosing:
                                    </p>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl font-bold">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('leadForm.nameLabel', 'Ismingiz')}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                                <FaUser className="text-sm" />
                                            </span>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder={t('leadForm.namePlaceholder', 'Masalan: Aziz')}
                                                className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-[#070b14]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('leadForm.phoneLabel', 'Telefon raqamingiz')}
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-xs font-extrabold text-slate-600 dark:text-slate-400">
                                                +998
                                            </span>
                                            <IMaskInput
                                                mask="(00) 000-00-00"
                                                value={phone}
                                                unmask={true}
                                                onAccept={(val) => setPhone(val)}
                                                placeholder="(90) 123-45-67"
                                                className="w-full pl-16 pr-4 py-3 bg-white/80 dark:bg-[#070b14]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-hidden focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 mt-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm rounded-full shadow-xl shadow-red-600/40 hover:shadow-red-600/60 border border-white/20 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin text-base" />
                                                <span>Yuborilmoqda...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('leadForm.submitBtn', 'Darsga yozilish')}</span>
                                                <FaPaperPlane className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}