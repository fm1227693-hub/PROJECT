import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AdminORG from './AdminORG'
import toast, { Toaster } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

export default function Admin() {
    const { t } = useTranslation()
    const [cod, setCod] = useState('')
    const [kirish, setKirish] = useState(false)

    

    const alo = () => {
        if (cod === '88888888') {
            setKirish(true)
        } else if (cod === '') {
            toast.error(t('admin.emptyError', "Parolni kiriting!"))
        } else {
            toast.error(t('admin.wrongPassword', "Noto'g'ri parol!"))
        }
    }

    if (kirish) {
        return <AdminORG />
    }

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-200 relative bg-white/50 dark:bg-gray-950/50 backdrop-blur-md overflow-hidden"
        >
            {/* Fon uchun dekorativ blur doira */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-red-500/10 dark:bg-red-500/10 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl" />

            {/* Orqaga qaytish tugmasi (Chap yuqori burchakda) */}
            <div className="absolute top-6 left-6 z-50">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                >
                    <FaArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('Orqaga', 'Orqaga')}</span>
                </Link>
            </div>

            <div
                data-aos="zoom-in"
                data-aos-duration="600"
                className="w-full max-w-sm mx-auto px-2 sm:px-0 relative z-10"
            >
                <div className="flex flex-col gap-6 p-6 sm:p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/80 dark:border-gray-800/80 transition-colors duration-200">
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white text-center tracking-tight">
                        {t('admin.title', "Admin Panel")}
                    </h2>

                    <input
                        type="password"
                        value={cod}
                        onChange={(e) => setCod(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && alo()}
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-2xl focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-xs sm:text-sm font-medium"
                        placeholder={t('admin.placeholder', "Parolni kiriting...")}
                    />

                    <button
                        onClick={alo}
                        className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all font-black cursor-pointer shadow-lg shadow-red-500/25 active:scale-95 text-xs sm:text-sm tracking-wide"
                    >
                        {t('admin.enterBtn', "Kirish")}
                    </button>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    )
}