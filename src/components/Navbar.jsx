import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegMoon, FaRegSun, FaBars, FaTimes, FaGlobe } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const { t, i18n } = useTranslation()

    const [dark, isDark] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)

    const Theme = function () {
        const nextState = !dark
        isDark(nextState)
        localStorage.setItem('theme', nextState)
        document.querySelector('body').classList.toggle('dark', nextState)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') === 'true'
        isDark(savedTheme)
        if (savedTheme) {
            document.querySelector('body').classList.add('dark')
        } else {
            document.querySelector('body').classList.remove('dark')
        }
    }, [])

    // Tilni o'zgartiruvchi takrorlanuvchi qism (Kod qisqaroq bo'lishi uchun)
    const LanguageSelector = () => (
        <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm p-1.5 rounded-full border border-gray-200/60 dark:border-gray-800 shadow-inner">
            <div className="pl-2 pr-1 text-gray-400 dark:text-gray-500 flex items-center">
                <FaGlobe className="w-3.5 h-3.5" />
            </div>
            <button 
                onClick={() => { i18n.changeLanguage('en') }} 
                className={`w-7 h-7 text-[11px] font-extrabold rounded-full transition-all flex items-center justify-center ${
                    i18n.language === 'en' 
                        ? 'bg-red-600 text-white shadow-md scale-105' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
            >
                EN
            </button>
            <button 
                onClick={() => { i18n.changeLanguage('uz') }} 
                className={`w-7 h-7 text-[11px] font-extrabold rounded-full transition-all flex items-center justify-center ${
                    i18n.language === 'uz' 
                        ? 'bg-red-600 text-white shadow-md scale-105' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
            >
                UZ
            </button>
            <button 
                onClick={() => { i18n.changeLanguage('ru') }} 
                className={`w-7 h-7 text-[11px] font-extrabold rounded-full transition-all flex items-center justify-center ${
                    i18n.language === 'ru' 
                        ? 'bg-red-600 text-white shadow-md scale-105' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
            >
                RU
            </button>
        </div>
    )

    return (
        <div className='fixed top-0 left-0 w-full z-50 font-sans select-none'>
            <header className="bg-white/90 dark:bg-gray-950/30 backdrop-blur-md border-b border-gray-300/10 dark:border-gray-800 shadow-sm transition-colors duration-200">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:opacity-85 transition"
                            title="Menu"
                        >
                            {menuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                        </button>

                        <Link to="/" className="flex items-center text-gray-900 dark:text-white cursor-pointer">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/Снимок экрана 2026-07-13 125121.png"
                                    alt="Optimum Logo"
                                    className="w-8 h-8 md:w-9 md:h-9 rounded-xl object-contain"
                                />
                                <span className="text-black dark:text-white font-bold text-xl">Optimum</span>
                            </div>
                        </Link>
                    </div>

                    {/* Kompyuter uchun menyu */}
                    <nav className="hidden md:flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 gap-6">
                        <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('Bosh sahifa')}</Link>
                        <Link to="/stats" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('Statistika')}</Link>
                        <Link to="/products" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('Yutuqlar')}</Link>
                        <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('Biz haqimizda')} </Link>
                        <Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">{t('Ro`yxatdan o`tish')}</Link>
                    </nav>

                    {/* Kompyuter uchun zamonaviy til tanlagich */}
                    <div className="hidden md:block">
                        <LanguageSelector />
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div onClick={Theme} className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-yellow-400 cursor-pointer hover:opacity-85 transition-all shadow-sm">
                            {dark ? <FaRegSun className="w-4 h-4" title="Light mode" /> : <FaRegMoon className="w-4 h-4 text-gray-900" title="Dark mode" />}
                        </div>

                        <Link to="/enter" className="inline-flex items-center bg-gray-950 dark:bg-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 text-white text-xs font-bold py-2 px-3 md:py-2.5 md:px-4 rounded-xl shadow-sm transition-all gap-1.5 border border-transparent">
                            <span>Boshqaruv</span>
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </Link>
                    </div>

                </div>

                {/* Telefonda ochiladigan menyu va uning ichidagi til tanlagich */}
                <div className={`md:hidden grid transition-discrete duration-300 ease-in-out ${menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                        <nav className="flex flex-col px-4 pt-2 pb-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 gap-3 font-semibold text-sm text-gray-600 dark:text-gray-300">
                            <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">{t('Bosh sahifa')}</Link>
                            <Link to="/stats" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">{t('Statistika')}</Link>
                            <Link to="/products" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">{t('Yutuqlar')}</Link>
                            <Link to="/about" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">{t('Biz haqimizda')}</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">{t('Ro`yxatdan o`tish')}</Link>
                            
                            {/* Telefonda menyu ochilganda pastki qismda chiqadigan til tanlash qismi */}
                            <div className="pt-2 mt-1 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
                                <span className="text-xs text-gray-400">Tilni tanlang:</span>
                                <LanguageSelector />
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    )
}