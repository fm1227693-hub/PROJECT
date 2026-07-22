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
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 pt-16">
            <Toaster />
            <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    {t('register.title')}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            {t('register.nameLabel')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('register.namePlaceholder')}
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            {t('register.phoneLabel')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('register.phonePlaceholder')}
                            required
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-red-700 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm cursor-pointer"
                    >
                        {t('register.submitBtn')}
                    </button>
                </form>
            </div>
        </div>
    )
}