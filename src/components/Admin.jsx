import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminORG from './AdminORG'
import toast, { Toaster } from 'react-hot-toast'

export default function Admin() {
    const { t } = useTranslation()
    const [cod, setCod] = useState('')
    const [kirish, setKirish] = useState(false)

    const alo = () => {
        if (cod === '88888888') {
            setKirish(true)
        } else if (cod === '') {
            toast.error(t('admin.emptyError'))
        } else {
            toast.error(t('admin.wrongPassword'))
        }
    }

    if (kirish) {
        return <AdminORG />
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-200">
            <div className="w-full max-w-sm mx-auto">
                <div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white text-center">
                        {t('admin.title')}
                    </h2>
                    <input
                        type="password"
                        value={cod}
                        onChange={(e) => setCod(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl focus:outline-none focus:border-gray-500 dark:focus:border-gray-400 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-800 transition-colors text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder={t('admin.placeholder')}
                    />
                    <button
                        onClick={alo}
                        className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors font-medium cursor-pointer"
                    >
                        {t('admin.enterBtn')}
                    </button>
                </div>
            </div>
            <Toaster />
        </div>
    )
}