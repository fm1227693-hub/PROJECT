import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Register() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ name: '', phone: '' })
    const [loading, setLoading] = useState(false)
    const [focused, setFocused] = useState(null)

    useEffect(() => {
        AOS.init({ once: true, offset: 60, duration: 700 })
    }, [])

    const handlePhoneChange = (e) => {
        const val = e.target.value
        if (/^[0-9+\s()]*$/.test(val)) {
            setFormData({ ...formData, phone: val })
        } else {
            toast.error(t('register.phoneError'), {
                id: 'phone-error',
                position: 'top-right',
                duration: 2000,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Bu yerda API ga yuborish logikasini yozishingiz mumkin
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black px-3 xs:px-4 pt-16 xs:pt-20 pb-8 xs:pb-12 transition-colors duration-200 select-none relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">

            {/* Fon effektlari */}
            <div className="absolute -top-24 -right-24 w-64 h-64 xs:w-80 xs:h-80 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 xs:w-80 xs:h-80 bg-red-600/10 dark:bg-red-600/5 rounded-full blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

            <Toaster position="bottom-right" />

            <button
                onClick={() => navigate(-1)}
                data-aos="fade-right"
                data-aos-duration="600"
                className="fixed top-16 xs:top-20 sm:top-24 left-3 xs:left-4 sm:left-8 inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer z-20 hover:-translate-x-1"
            >
                <span className="text-base xs:text-lg leading-none">←</span>
                {t('common.backBtn') || 'Orqaga'}
            </button>

            <div
                data-aos="zoom-in"
                data-aos-duration="600"
                className="max-w-md w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-5 xs:p-7 sm:p-10 rounded-2xl xs:rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800/80 relative z-10 animate-fade-in-up"
            >
                <div className="text-center mb-6 xs:mb-8">
                    <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 xs:px-3 py-1 rounded-full inline-block animate-bounce-subtle">
                        {t('register.badge') || 'Optimum'}
                    </span>
                    <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3 tracking-tight">
                        {t('register.title')}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 xs:gap-5">
                    <div className="group">
                        <label className={`block text-[10px] xs:text-xs font-bold mb-1.5 uppercase tracking-wider transition-colors duration-200 ${focused === 'name' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'}`}>
                            {t('register.nameLabel')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('register.namePlaceholder')}
                            required
                            value={formData.name}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3.5 xs:px-4 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-200 shadow-sm"
                        />
                    </div>
                    <div className="group">
                        <label className={`block text-[10px] xs:text-xs font-bold mb-1.5 uppercase tracking-wider transition-colors duration-200 ${focused === 'phone' ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300'}`}>
                            {t('register.phoneLabel')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('register.phonePlaceholder')}
                            required
                            value={formData.phone}
                            onFocus={() => setFocused('phone')}
                            onBlur={() => setFocused(null)}
                            onChange={handlePhoneChange}
                            className="w-full px-3.5 xs:px-4 py-2.5 xs:py-3 rounded-xl xs:rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-200 shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-1.5 xs:mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 xs:py-3.5 rounded-xl xs:rounded-2xl transition-all text-sm shadow-lg shadow-red-500/20 cursor-pointer active:scale-95 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5"
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                {t('register.loadingBtn') || 'Yuklanmoqda...'}
                            </span>
                        ) : t('register.submitBtn')}
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-2px); }
                }
                .animate-bounce-subtle { animation: bounce-subtle 2.5s ease-in-out infinite; }
                @media (max-width: 380px) {
                    .xs\\:px-4 { padding-left: 0.75rem; padding-right: 0.75rem; }
                }
            `}</style>
        </div>
    )
}