import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegMoon, FaRegSun, FaBars, FaTimes, FaGlobe, FaEllipsisV, FaArrowRight } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const { t, i18n } = useTranslation()
    const location = useLocation()

    const [dark, isDark] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
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

        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang)
    }

    const navItems = [
        { name: t('Bosh sahifa'), path: '/' },
        { name: t('Statistika'), path: '/stats' },
        { name: t('Yutuqlar'), path: '/products' },
        { name: t('Biz haqimizda'), path: '/about' },
        { name: t('Mentorlar'), path: '/static' },
        { name: t('Ro`yxatdan o`tish'), path: '/register' },
    ]

    const LanguageSelector = () => (
        <div className="flex items-center gap-1 bg-white/40 dark:bg-gray-900/40 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-800/80 backdrop-blur-md">
            <div className="pl-1.5 text-gray-400 dark:text-gray-500 flex items-center">
                <FaGlobe className="w-3.5 h-3.5" />
            </div>
            {['en', 'uz', 'ru'].map((lang) => (
                <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`relative px-2.5 py-1 text-[11px] font-black rounded-xl transition-colors duration-300 ${
                        i18n.language === lang
                            ? 'text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    {i18n.language === lang && (
                        <motion.div
                            layoutId="activeLang"
                            className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl shadow-md shadow-red-500/25 z-[-1]"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    )

    return (
        <div className="fixed top-4 left-0 w-full z-50 font-sans select-none px-4">
            <motion.header 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`max-w-6xl mx-auto transition-all duration-500 rounded-3xl ${
                    scrolled 
                        ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-2xl border border-white/40 dark:border-gray-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] py-2' 
                        : 'bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 shadow-lg py-3'
                }`}
            >
                <div className="px-4 sm:px-6 flex items-center justify-between">

                    {/* Chap qism: Logotip va Mobil Menyu tugmasi */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setMenuOpen(!menuOpen); setDropdownOpen(false); }}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200"
                        >
                            {menuOpen ? <FaTimes className="w-4 h-4 text-red-600" /> : <FaBars className="w-4 h-4" />}
                        </motion.button>

                        <Link to="/" className="flex items-center gap-3 group">
                            <motion.div 
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                className="relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-40 group-hover:opacity-80 transition duration-300"></div>
                                <img
                                    src="/Снимок экрана 2026-07-13 125121.png"
                                    alt="Optimum Logo"
                                    className="relative w-10 h-10 rounded-2xl object-cover shadow-md"
                                />
                            </motion.div>
                            <span className="text-gray-900 dark:text-white font-black text-xl tracking-tight">
                                OPTIMUM<span className="text-red-600">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Kompyuter uchun markaziy menyu */}
                    <nav className="hidden md:flex items-center p-1.5 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-md rounded-full border border-gray-200/40 dark:border-gray-800/60 relative">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-4 py-2 text-xs font-bold transition-colors duration-200 ${
                                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-full shadow-md shadow-gray-200/50 dark:shadow-none z-[-1]"
                                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                        />
                                    )}
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* O'ng qism elementlari */}
                    <div className="flex items-center gap-2.5">
                        <div className="hidden lg:block">
                            <LanguageSelector />
                        </div>

                        {/* Tema tugmasi */}
                        <motion.button 
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            onClick={Theme} 
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-yellow-400 shadow-sm"
                        >
                            {dark ? <FaRegSun className="w-4 h-4" /> : <FaRegMoon className="w-4 h-4 text-gray-800" />}
                        </motion.button>

                        {/* Boshqaruv tugmasi (Desktop) */}
                        <div className="hidden md:block">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/enter" 
                                    className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-lg shadow-red-500/25 overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    <span className="relative">{t('Boshqaruv')}</span>
                                    <FaArrowRight className="relative w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Mobil uchun Dropdown (3 ta nuqta) */}
                        <div className="relative md:hidden" ref={dropdownRef}>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setDropdownOpen(!dropdownOpen); setMenuOpen(false); }}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200"
                            >
                                <FaEllipsisV className="w-4 h-4" />
                            </motion.button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-3 w-52 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-3 z-50 flex flex-col gap-3"
                                    >
                                        <Link
                                            to="/enter"
                                            onClick={() => setDropdownOpen(false)}
                                            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold py-3 rounded-2xl text-center shadow-md shadow-red-500/20"
                                        >
                                            {t('Boshqaruv')}
                                        </Link>
                                        <div className="flex justify-center pt-2 border-t border-gray-100 dark:border-gray-800">
                                            <LanguageSelector />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>

                {/* Mobil uchun ochiladigan animatsion menyu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden border-t border-gray-200/30 dark:border-gray-800/40 mt-2"
                        >
                            <nav className="flex flex-col p-4 gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {navItems.map((item) => (
                                    <Link 
                                        key={item.path}
                                        to={item.path} 
                                        onClick={() => setMenuOpen(false)} 
                                        className={`py-2.5 px-4 rounded-xl transition ${
                                            location.pathname === item.path 
                                                ? 'bg-red-500/10 text-red-600 font-bold' 
                                                : 'hover:bg-red-500/10 hover:text-red-600'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-3 border-t border-gray-200/40 dark:border-gray-800/40 flex justify-center">
                                    <LanguageSelector />
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </div>
    )
}