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
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 select-none relative">
            {/* Background Atmosphere */}
            <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] -z-10" />

            <div className="max-w-5xl mx-auto">
                {/* Back Button */}
                <button 
                    onClick={handleGoBack}
                    className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors shadow-xs cursor-pointer"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    <span>Orqaga</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl sm:rounded-[2.5rem] bg-white dark:bg-[#070d19] border border-slate-200 dark:border-white/10 shadow-xl p-6 sm:p-10 lg:p-12">
                    
                    {/* Left Column: Information & Trust */}
                    <div className="lg:col-span-6 space-y-5 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full text-xs font-black tracking-wider uppercase border border-red-200 dark:border-red-900/40">
                            {t('leadForm.badge', 'BEPUL MASLAHAT & SINOV DARSI')}
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] font-heading">
                            {t('leadForm.titlePrefix', "Ingliz tilini o'rganishni")}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                                {t('leadForm.titleHighlight', 'bugun boshlang!')}
                            </span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                            {t('leadForm.description', "Ismingiz va telefon raqamingizni qoldiring. Mutaxassislarimiz siz bilan tezda bog'lanib, bepul darsga yozishadi va barcha savollaringizga javob berishadi.")}
                        </p>

                        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
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
                        <div className="rounded-3xl bg-slate-50 dark:bg-[#0c1424] border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm">
                            {success ? (
                                <div className="py-10 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto border border-emerald-300 dark:border-emerald-800/60">
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
                                        className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
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
                                        <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs rounded-xl font-bold">
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
                                                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-red-600 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('leadForm.phoneLabel', 'Telefon raqamingiz')}
                                        </label>
                                        <div className="relative flex items-center bg-white dark:bg-[#070b14] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden focus-within:border-red-600 transition-colors">
                                            <span className="pl-4 pr-3 text-slate-700 dark:text-slate-300 text-sm font-bold select-none border-r border-slate-200 dark:border-white/10 py-3 bg-slate-100 dark:bg-slate-800/50">
                                                +998
                                            </span>
                                            <IMaskInput
                                                mask="(00) 000-00-00"
                                                value={phone}
                                                onAccept={(value) => setPhone(value)}
                                                placeholder="(90) 123-45-67"
                                                className="w-full px-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-2 px-5 py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold rounded-2xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin text-base" />
                                                <span>{t('leadForm.submitting', 'Yuborilmoqda...')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('leadForm.submitBtn', 'Joy band qilish')}</span>
                                                <FaPaperPlane className="text-xs" />
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