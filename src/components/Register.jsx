import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export default function Register() {
    const { t } = useTranslation()
    const [formData, setFormData] = useState({ name: '', phone: '' })
    const [loading, setLoading] = useState(false)

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
        // Misol uchun:
        // try {
        //     await axios.post('...', formData)
        //     toast.success(t('register.successMessage'))
        // } catch (error) {
        //     toast.error(t('register.errorMessage'))
        // } finally {
        //     setLoading(false)
        // }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 pt-16 transition-colors duration-200 select-none">
            <Toaster position="bottom-right" />
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800/80">
                <div className="text-center mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                        {t('register.badge') || 'Optimum'}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-3 tracking-tight">
                        {t('register.title')}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                            {t('register.nameLabel')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('register.namePlaceholder')}
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600 transition-colors shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                            {t('register.phoneLabel')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('register.phonePlaceholder')}
                            required
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600 transition-colors shadow-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl transition-all text-sm shadow-lg shadow-red-500/20 cursor-pointer"
                    >
                        {loading ? t('register.loadingBtn') || 'Yuklanmoqda...' : t('register.submitBtn')}
                    </button>
                </form>
            </div>
        </div>
    )
}