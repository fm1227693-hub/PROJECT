import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminORG from './AdminORG'
import toast, { Toaster } from 'react-hot-toast'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

export default function Admin() {
    const { t } = useTranslation()
    const [cod, setCod] = useState('')
    const [kirish, setKirish] = useState(false)

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 80,
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
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors duration-200 relative">
            
            {/* Orqaga qaytish tugmasi (Chap yuqori burchakda) */}
            <div className="absolute top-6 left-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                >
                    <FaArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('Orqaga')}</span>
                </Link>
            </div>

            <div
                data-aos="zoom-in"
                data-aos-duration="600"
                className="w-full max-w-sm mx-auto px-2 sm:px-0"
            >
                <div className="flex flex-col gap-6 p-6 sm:p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 backdrop-blur-sm transition-colors duration-200">
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white text-center tracking-tight">
                        {t('admin.title')}
                    </h2>

                    <input
                        type="password"
                        value={cod}
                        onChange={(e) => setCod(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && alo()}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-xs sm:text-base"
                        placeholder={t('admin.placeholder')}
                    />

                    <button
                        onClick={alo}
                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors font-bold cursor-pointer shadow-lg shadow-red-500/25 active:scale-95 text-xs sm:text-base"
                    >
                        {t('admin.enterBtn')}
                    </button>
                </div>
            </div>
            <Toaster />
        </div>
    )
}