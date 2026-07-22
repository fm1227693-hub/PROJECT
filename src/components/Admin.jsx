import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminORG from './AdminORG'
import toast, { Toaster } from 'react-hot-toast'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Admin() {
    const { t } = useTranslation()
    const [cod, setCod] = useState('')
    const [kirish, setKirish] = useState(false)

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
        })
    }, [])

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
            <div
                data-aos="zoom-in"
                data-aos-duration="600"
                className="w-full max-w-sm mx-auto"
            >
                <div className="flex flex-col gap-5 p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center tracking-tight">
                        {t('admin.title')}
                    </h2>
                    <input
                        type="password"
                        value={cod}
                        onChange={(e) => setCod(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 rounded-xl focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-colors text-gray-800 dark:text-gray-200 placeholder-gray-400 text-sm sm:text-base"
                        placeholder={t('admin.placeholder')}
                    />
                    <button
                        onClick={alo}
                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-bold cursor-pointer shadow-lg shadow-red-500/20 text-sm sm:text-base"
                    >
                        {t('admin.enterBtn')}
                    </button>
                </div>
            </div>
            <Toaster />
        </div>
    )
}