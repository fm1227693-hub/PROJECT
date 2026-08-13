import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUser, FaPhoneAlt, FaPaperPlane, FaCheckCircle, FaSpinner, FaArrowRight, FaTimes, FaArrowLeft } from 'react-icons/fa'
import axios from 'axios'

export default function LeadForm() {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const BOT_TOKEN = "8722121979:AAFh-CGYP26-mjBW3-iM1lqboGAEeATB1hA"
    
    // Ikkita admin chat ID lari massiv ko'rinishida
    const CHAT_IDS = ["334572168", "6383523156"]

    const handlePhoneChange = (e) => {
        const value = e.target.value
        const digitsOnly = value.replace(/\D/g, '')
        
        if (digitsOnly.length <= 9) {
            setPhone(digitsOnly)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !phone.trim()) {
            setError(t('leadForm.errorAllFields', "Iltimos, barcha maydonlarni to'ldiring!"))
            return
        }

        if (phone.length < 9) {
            setError(t('leadForm.errorPhoneDigits', "Iltimos, 9 ta raqamni to'liq kiriting!"))
            return
        }

        setError('')
        setLoading(true)

        const message = `Yangi murojaat (Optimum):\n\nIsm: ${name}\nTel: +998${phone}`

        try {
            const promises = CHAT_IDS.map(chatId =>
                fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
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
                    phone: `+998 ${phone}`,
                    type: t('leadForm.badge', 'Bepul maslahat'),
                    date: new Date().toLocaleString('uz-UZ'),
                    status: 'Kutilmoqda'
                }

                try {
                    const res = await axios.get('https://jsonblob.com/api/jsonBlob/019fe9ca-e729-761e-a88a-c68b3bd21d71')
                    const currentLeads = Array.isArray(res.data) ? res.data : []
                    const updatedLeads = [newLead, ...currentLeads]
                    await axios.put('https://jsonblob.com/api/jsonBlob/019fe9ca-e729-761e-a88a-c68b3bd21d71', updatedLeads)
                    localStorage.setItem('admin_leads', JSON.stringify(updatedLeads))
                } catch (err) {
                    console.error("API error:", err)
                    const existingLeads = JSON.parse(localStorage.getItem('admin_leads') || '[]')
                    localStorage.setItem('admin_leads', JSON.stringify([newLead, ...existingLeads]))
                }

                setSuccess(true)
                setName('')
                setPhone('')
                setTimeout(() => {
                    setSuccess(false)
                    setIsOpen(false)
                }, 4000)
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
        <>


            {/* Orqaga qaytish tugmasi */}
            <button
                onClick={handleGoBack}
                className="fixed top-28 sm:top-32 left-4 sm:left-8 z-50 inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer hover:-translate-x-1"
            >
                <span className="text-base xs:text-lg leading-none">←</span>
                <span>{t('common.backBtn') || 'Orqaga'}</span>
            </button>

            {/* Asosiy Forma qismi */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 select-none pt-24 sm:pt-28 lg:pt-32">
                <div className="relative glass-card p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden transition-all duration-300">
                    

                    {/* Orqa fon nur effekti */}
                    <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        
                        {/* Chap matn va tugma qismi */}
                        <div className="lg:w-1/2 text-left space-y-4">
                            <div className="inline-block mb-3">
                                <span className="px-3.5 py-1.5 bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500 rounded-xl text-xs font-black tracking-wide border border-red-500/20 dark:border-red-500/30 uppercase">
                                    {t('leadForm.badge', 'Bepul maslahat')}
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                {t('leadForm.titlePrefix', "Ingliz tilini o'rganishni")}{' '}
                                <span className="text-red-600 dark:text-red-500">
                                    {t('leadForm.titleHighlight', 'bugun boshlang!')}
                                </span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium leading-relaxed">
                                {t('leadForm.description', "Ismingiz va telefon raqamingizni qoldiring. Mutaxassislarimiz siz bilan tezda bog'lanib, bepul darsga yozishadi va barcha savollaringizga javob berishadi.")}
                            </p>

                            {!isOpen && (
                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsOpen(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/35 transition-all duration-300 flex items-center gap-3 text-sm cursor-pointer hover:scale-105"
                                    >
                                        <span>{t('leadForm.applyNowBtn', 'Hozirdan yozilish')}</span>
                                        <FaArrowRight className="text-xs" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* O'ng Forma qismi */}
                        <div className={`lg:w-1/2 w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-500 ${isOpen ? 'opacity-100 scale-100 block' : 'hidden'}`}>
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                                    <FaCheckCircle className="text-emerald-500 text-5xl animate-bounce" />
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('leadForm.successTitle', 'Murojaatingiz qabul qilindi!')}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t('leadForm.successDesc', 'Tez orada operatorlarimiz siz bilan bog\'lanishadi.')}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{t('leadForm.formTitle', 'Bepul darsga yozilish')}</h3>
                                        <button 
                                            type="button" 
                                            onClick={() => setIsOpen(false)}
                                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 cursor-pointer"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs rounded-xl font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">{t('leadForm.nameLabel', 'Ismingiz')}</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
                                                <FaUser className="text-sm" />
                                            </span>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder={t('leadForm.namePlaceholder', 'Masalan: Aziz')}
                                                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">{t('leadForm.phoneLabel', 'Telefon raqamingiz')}</label>
                                        <div className="relative flex items-center bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden focus-within:border-red-600 transition-colors">
                                            <span className="pl-4 pr-2 text-gray-600 dark:text-gray-400 text-sm font-bold select-none border-r border-gray-200 dark:border-gray-800/80 py-3 bg-gray-100 dark:bg-gray-900/40">
                                                +998
                                            </span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={phone}
                                                onChange={handlePhoneChange}
                                                placeholder="901234567"
                                                maxLength={9}
                                                className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-2 px-5 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/30 transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50 text-center"
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
            </section>
        </>
    )
}