import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegMoon, FaRegSun, FaBars, FaTimes, FaEllipsisV, FaArrowRight, FaChevronDown } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const LANGS = {
    uz: { label: "O'zbekcha", short: 'UZ' },
    ru: { label: 'Русский', short: 'RU' },
    en: { label: 'English', short: 'EN' },
}

export default function Navbar() {
    const { t, i18n } = useTranslation()
    const location = useLocation()

    const [dark, isDark] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dropdownRef = useRef(null)
    const langRef = useRef(null)

    const Theme = () => {
        const nextState = !dark
        isDark(nextState)
        localStorage.setItem('theme', nextState)
        if (nextState) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') === 'true'
        isDark(savedTheme)
        if (savedTheme) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
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
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangOpen(false)
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
        setLangOpen(false)
    }

    const navItems = [
        { name: t('navbar.home', 'Bosh sahifa'), path: '/' },
        { name: t('navbar.stats', 'Statistika'), path: '/stats' },
        { name: t('navbar.achievements', 'Yutuqlar'), path: '/products' },
        { name: t('navbar.about', 'Biz haqimizda'), path: '/about' },
        { name: t('navbar.mentors', 'Mentorlar'), path: '/static' },
        { name: t('navbar.register', 'Ro`yxatdan o`tish'), path: '/register' },
    ]

    const currentLang = LANGS[i18n.language]?.short ? i18n.language : 'en'

    // Yig'iladigan til tanlagich: bitta tugma, bosilganda pastga ochiladi
    const LanguageSelector = ({ align = 'right' }) => (
        <div className="relative" ref={langRef}>
            <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 pl-3 pr-2 h-10 rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-800/80 text-gray-700 dark:text-gray-200 text-xs font-black cursor-pointer shadow-sm"
            >
                <span className="tracking-wide">{LANGS[currentLang].short}</span>
                <FaChevronDown className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {langOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 w-36 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-1.5 z-[60] flex flex-col gap-0.5`}
                    >
                        {Object.entries(LANGS).map(([code, { label, short }]) => (
                            <button
                                key={code}
                                onClick={() => handleLanguageChange(code)}
                                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                    currentLang === code
                                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-red-500/10 hover:text-red-600'
                                }`}
                            >
                                <span>{label}</span>
                                <span className="opacity-70 text-[10px]">{short}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div className="fixed top-4 left-0 w-full z-50 font-sans select-none px-4 pointer-events-none">
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`max-w-6xl mx-auto transition-all duration-500 rounded-3xl pointer-events-auto ${
                    scrolled
                        ? 'bg-white/85 dark:bg-gray-950/85 backdrop-blur-2xl border border-white/40 dark:border-gray-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] py-2'
                        : 'bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 shadow-lg py-3'
                }`}
            >
                <div className="px-3 sm:px-6 flex items-center justify-between gap-2">

                    {/* Chap qism: Logotip va Mobil Menyu tugmasi */}
                    <div className="flex items-center gap-3 shrink-0">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setMenuOpen(!menuOpen); setDropdownOpen(false); }}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 cursor-pointer shadow-sm"
                        >
                            {menuOpen ? <FaTimes className="w-4 h-4 text-red-600" /> : <FaBars className="w-4 h-4" />}
                        </motion.button>

                        <Link to="/" className="flex items-center gap-2.5 group">
                            <motion.div
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                className="relative shrink-0"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-40 group-hover:opacity-80 transition duration-300"></div>
                                <img
                                    src="/Снимок экрана 2026-07-13 125121.png"
                                    alt="Optimum Logo"
                                    className="relative w-10 h-10 rounded-2xl object-cover shadow-md"
                                />
                            </motion.div>
                            <span className="text-gray-900 dark:text-white font-black text-lg sm:text-xl tracking-tight">
                                OPTIMUM<span className="text-red-600">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Kompyuter uchun markaziy menyu */}
                    <nav className="hidden md:flex items-center p-1 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-md rounded-full border border-gray-200/40 dark:border-gray-800/60 relative">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative px-3.5 py-2 text-[11px] lg:text-xs font-bold transition-colors duration-200 text-center whitespace-nowrap ${
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
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Til tanlagich (Kompyuter va planshetlar uchun) */}
                        <div className="hidden md:block">
                            <LanguageSelector />
                        </div>

                        {/* Tema tugmasi */}
                        <motion.button
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            onClick={Theme}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-yellow-400 shadow-sm cursor-pointer shrink-0"
                        >
                            {dark ? <FaRegSun className="w-4 h-4" /> : <FaRegMoon className="w-4 h-4 text-gray-800" />}
                        </motion.button>

                        {/* Boshqaruv tugmasi (Desktop) */}
                        <div className="hidden md:block">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/enter"
                                    className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-lg shadow-red-500/25 overflow-hidden whitespace-nowrap"
                                >
                                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                    <span className="relative">{t('navbar.control', 'Boshqaruv')}</span>
                                    <FaArrowRight className="relative w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Mobil uchun Dropdown (3 ta nuqta) */}
                        <div className="relative md:hidden" ref={dropdownRef}>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setDropdownOpen(!dropdownOpen); setMenuOpen(false); }}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-200 cursor-pointer shadow-sm"
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
                                            {t('navbar.control', 'Boshqaruv')}
                                        </Link>
                                        <div className="flex justify-center pt-1 border-t border-gray-100 dark:border-gray-800">
                                            <LanguageSelector align="left" />
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
                                    <LanguageSelector align="left" />
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </div>
    )
}