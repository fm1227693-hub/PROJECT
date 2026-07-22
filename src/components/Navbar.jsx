import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegMoon, FaRegSun, FaBars, FaTimes, FaGlobe, FaEllipsisV, FaCog } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const { t, i18n } = useTranslation()

    const [dark, isDark] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

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

        // Tashqariga bosilganda uch nuqta menyusini yopish
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang)
    }

    const LanguageSelector = () => (
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-full border border-gray-200 dark:border-gray-800">
            <div className="pl-1.5 text-gray-400 dark:text-gray-500 flex items-center">
                <FaGlobe className="w-3.5 h-3.5" />
            </div>
            {['en', 'uz', 'ru'].map((lang) => (
                <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-6 h-6 text-[10px] font-extrabold rounded-full transition-all flex items-center justify-center cursor-pointer ${
                        i18n.language === lang
                            ? 'bg-red-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    )

    return (
        <div className='fixed top-0 left-0 w-full z-50 font-sans select-none'>
            <header className="bg-white/90 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm transition-colors duration-200">
                <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between max-w-7xl">

                    {/* Chap qism: Burger va Logotip */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => { setMenuOpen(!menuOpen); setDropdownOpen(false); }}
                            className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:opacity-85 transition cursor-pointer"
                            title="Menu"
                        >
                            {menuOpen ? <FaTimes className="w-5 h-5 text-red-600" /> : <FaBars className="w-5 h-5" />}
                        </button>

                        <Link to="/" className="flex items-center text-gray-900 dark:text-white cursor-pointer group">
                            <div className="flex items-center gap-2">
                                <img
                                    src="/Снимок экрана 2026-07-13 125121.png"
                                    alt="Optimum Logo"
                                    className="w-8 h-8 rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform"
                                />
                                <span className="text-black dark:text-white font-black text-lg sm:text-xl tracking-tight">Optimum</span>
                            </div>
                        </Link>
                    </div>

                    {/* Kompyuter uchun asosiy menyu */}
                    <nav className="hidden md:flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 gap-7">
                        <Link to="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('Bosh sahifa')}</Link>
                        <Link to="/stats" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('Statistika')}</Link>
                        <Link to="/products" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('Yutuqlar')}</Link>
                        <Link to="/about" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('Biz haqimizda')} </Link>
                        <Link to="/static" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('Mentorlar')} </Link>
                        <Link to="/register" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{t('Ro`yxatdan o`tish')}</Link>
                    </nav>

                    <div className="hidden md:block">
                        <LanguageSelector />
                    </div>

                    {/* O'ng qism: Kompyuterda to'liq, Telefonda 3 ta nuqta */}
                    <div className="flex items-center gap-2">
                        {/* Theme almashtirgich doimiy ko'rinib turadi */}
                        <div onClick={Theme} className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-yellow-400 cursor-pointer hover:scale-105 transition-all shadow-sm">
                            {dark ? <FaRegSun className="w-4 h-4" /> : <FaRegMoon className="w-4 h-4 text-gray-900" />}
                        </div>

                        {/* Kompyuter uchun Boshqaruv tugmasi */}
                        <div className="hidden md:block">
                            <Link to="/enter" className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-red-500/20 transition-all gap-2">
                                <span>{t('Boshqaruv')}</span>
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-4 h-4" viewBox="0 0 24 24">
                                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                                </svg>
                            </Link>
                        </div>

                        {/* Telefon uchun 3 ta nuqta (Dropdown) menyusi */}
                        <div className="relative md:hidden" ref={dropdownRef}>
                            <button
                                onClick={() => { setDropdownOpen(!dropdownOpen); setMenuOpen(false); }}
                                className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:opacity-85 transition cursor-pointer"
                                title="Boshqaruv va sozlamalar"
                            >
                                <FaEllipsisV className="w-4 h-4" />
                            </button>

                            {/* 3 ta nuqta bosilganda ochiladigan kichik oyna */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-3 z-50 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
                                    <Link
                                        to="/enter"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all justify-center"
                                    >
                                        <FaCog className="w-3.5 h-3.5" />
                                        <span>{t('Boshqaruv')}</span>
                                    </Link>

                                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-1.5">
                                        <span className="text-[11px] font-semibold text-gray-400 px-1">{t('Tilni tanlash')}</span>
                                        <div className="flex justify-center">
                                            <LanguageSelector />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Telefonda ochiladigan asosiy sahifalar navigatsiyasi */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-[400px] opacity-100 border-t border-gray-100 dark:border-gray-800' : 'max-h-0 opacity-0'}`}>
                    <nav className="flex flex-col px-4 py-3 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl gap-1.5 font-bold text-sm text-gray-700 dark:text-gray-300">
                        <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition">{t('Bosh sahifa')}</Link>
                        <Link to="/stats" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition">{t('Statistika')}</Link>
                        <Link to="/products" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition">{t('Yutuqlar')}</Link>
                        <Link to="/about" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition">{t('Biz haqimizda')}</Link>
                        <Link to="/static" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition">{t('Mentorlar')}</Link>
                        <Link to="/register" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition">{t('Ro`yxatdan o`tish')}</Link>
                    </nav>
                </div>
            </header>
        </div>
    )
}