import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegMoon, FaRegSun, FaBars, FaTimes, FaEllipsisV, FaArrowRight, FaChevronDown, FaHome, FaChartBar, FaTrophy, FaInfoCircle, FaChalkboardTeacher, FaUserPlus, FaCompass } from 'react-icons/fa'
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
            setScrolled(window.scrollY > 20)
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

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang)
        setLangOpen(false)
    }

    const navItems = [
        { name: t('navbar.home', 'Bosh sahifa'), path: '/', icon: FaHome },
        { name: t('navbar.statistic', 'Statistika'), path: '/stats', icon: FaChartBar },
        { name: t('navbar.achievements', 'Yutuqlar'), path: '/products', icon: FaTrophy },
        { name: t('navbar.about', 'Biz haqimizda'), path: '/about', icon: FaInfoCircle },
        { name: t('navbar.Mentorlar', 'Mentorlar'), path: '/static', icon: FaChalkboardTeacher },
        { name: t('navbar.register', "Ro'yxatdan o'tish"), path: '/register', icon: FaUserPlus },
    ]

    const currentLang = LANGS[i18n.language]?.short ? i18n.language : 'en'

    const LanguageSelector = ({ align = 'right', large = false }) => (
        <div className="relative w-full" ref={langRef}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setLangOpen((v) => !v)}
                className={`flex items-center justify-between px-4 rounded-2xl border transition-all cursor-pointer ${large
                    ? 'w-full h-12 bg-white/70 dark:bg-white/[0.04] border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-gray-100 text-xs font-bold tracking-wider hover:border-[#c41e30]/50 shadow-sm'
                    : 'pl-3.5 pr-2.5 h-9 border-gray-300/70 dark:border-white/10 text-gray-600 dark:text-gray-300 text-[11px] font-semibold tracking-wide hover:border-[#c41e30]/50'
                }`}
            >
                <span className="font-mono">{LANGS[currentLang].label}</span>
                <motion.div animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
                    <FaChevronDown className="w-2.5 h-2.5 opacity-60" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {langOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${large ? 'bottom-full mb-2 w-full' : 'top-full mt-2 w-40'} bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 p-1.5 z-[110] flex flex-col gap-1`}
                    >
                        {Object.entries(LANGS).map(([code, { label, short }]) => (
                            <button
                                key={code}
                                onClick={() => handleLanguageChange(code)}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${currentLang === code
                                    ? 'bg-gradient-to-r from-[#8a0f1e] to-[#c41e30] text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                                }`}
                            >
                                <span>{label}</span>
                                <span className="opacity-70 text-[10px] tracking-wider font-mono">{short}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div className={`fixed top-0 left-0 w-full z-50 font-['Plus_Jakarta_Sans',sans-serif] select-none pointer-events-none transition-all duration-500 ${scrolled ? 'px-3 sm:px-6 pt-3 sm:pt-4' : 'px-0 pt-0'}`}>
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`mx-auto transition-all duration-500 pointer-events-auto relative ${scrolled
                    ? 'max-w-6xl rounded-2xl bg-white/80 dark:bg-[#030712]/80 backdrop-blur-2xl border border-gray-200/70 dark:border-white/[0.09] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                    : 'max-w-full rounded-none bg-white/40 dark:bg-[#030712]/30 backdrop-blur-md border-b border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 shrink-0">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.85 }}
                            onClick={() => { setMenuOpen(true); setDropdownOpen(false); }}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                        >
                            <FaBars className="w-4 h-4" />
                        </motion.button>

                        <Link to="/" className="flex items-center gap-2.5 group">
                            <motion.div whileHover={{ scale: 1.12, rotate: -5 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="relative shrink-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#c41e30] to-rose-600 rounded-xl blur-[8px] opacity-50 group-hover:opacity-90 transition duration-300" />
                                <img
                                    src="/Снимок экрана 2026-07-13 125121.png"
                                    alt="Optimum Logo"
                                    className="relative w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/20 shadow-sm"
                                />
                            </motion.div>
                            <span className="text-gray-900 dark:text-white font-extrabold text-[17px] tracking-[0.14em] uppercase">
                                Optimum
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`group relative px-4 py-2 text-[12.5px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full ${isActive ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-4 right-4 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#8a0f1e] to-[#c41e30] shadow-[0_0_10px_rgba(196,30,40,0.8)]"
                                            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="hidden md:block">
                            <LanguageSelector />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.85, rotate: -180 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            onClick={Theme}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-[#c41e30] dark:hover:text-[#c41e30] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={dark ? 'sun' : 'moon'}
                                    initial={{ y: -10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 10, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {dark ? <FaRegSun className="w-4 h-4" /> : <FaRegMoon className="w-4 h-4" />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        <div className="hidden md:block">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    to="/enter"
                                    className="group relative inline-flex items-center gap-2 pl-4 pr-3.5 py-2 rounded-full bg-gradient-to-r from-[#7a0e1a] via-[#a5182a] to-[#d31d31] text-white text-[12.5px] font-semibold tracking-wide overflow-hidden whitespace-nowrap shadow-[0_6px_20px_rgba(196,30,40,0.4)]"
                                >
                                    <span className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[130%] transition-all duration-700 ease-out" />
                                    <span className="relative">{t('navbar.dashboard', 'Boshqaruv')}</span>
                                    <FaArrowRight className="relative w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden fixed inset-0 z-[100] pointer-events-auto flex flex-col bg-white/95 dark:bg-[#030712]/98 backdrop-blur-3xl overflow-hidden"
                    >
                        {/* Ko'kishroq va chuqur fon yorug'lik elementlari (2-rasmga mos) */}
                        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                            <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent rounded-full blur-[120px]" />
                            <div className="absolute top-1/2 -right-32 w-96 h-96 bg-gradient-to-bl from-purple-600/15 via-blue-500/10 to-transparent rounded-full blur-[120px]" />
                            <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-gradient-to-t from-[#c41e30]/15 to-transparent rounded-full blur-[120px]" />
                        </div>

                        {/* Yuqori qism (Header) */}
                        <div className="relative z-20 flex items-center justify-between px-5 h-16 border-b border-black/[0.05] dark:border-white/[0.08] shrink-0 bg-white/50 dark:bg-[#030712]/60 backdrop-blur-md">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8a0f1e] to-[#c41e30] flex items-center justify-center text-white shadow-md shadow-[#c41e30]/30">
                                    <FaCompass className="w-4 h-4" />
                                </div>
                                <span className="text-gray-900 dark:text-white font-extrabold text-base tracking-[0.16em] uppercase">
                                    Optimum
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => setMenuOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/[0.04] dark:bg-white/[0.08] text-gray-700 dark:text-gray-200 border border-black/5 dark:border-white/10 shadow-sm cursor-pointer"
                            >
                                <FaTimes className="w-4 h-4" />
                            </motion.button>
                        </div>

                        {/* O'rta qism: Menyular */}
                        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5">
                            {navItems.map((item, idx) => {
                                const isActive = location.pathname === item.path
                                const IconComponent = item.icon
                                return (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.03 * idx }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setMenuOpen(false)}
                                            className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 ${isActive
                                                ? 'bg-gradient-to-r from-[#8a0f1e]/15 to-[#c41e30]/20 border-[#c41e30]/50 shadow-md backdrop-blur-xl'
                                                : 'bg-white/[0.03] dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.06] hover:bg-white/[0.06] dark:hover:bg-white/[0.05]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform ${isActive 
                                                    ? 'bg-gradient-to-tr from-[#8a0f1e] to-[#c41e30] text-white shadow-md shadow-[#c41e30]/40' 
                                                    : 'bg-black/[0.04] dark:bg-white/[0.06] text-gray-500 dark:text-gray-400 group-hover:text-[#c41e30]'}`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className={`text-[9px] font-mono tracking-widest block uppercase mb-0.5 ${isActive ? 'text-[#c41e30] font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                                                        {String(idx + 1).padStart(2, '0')} — Bo'lim
                                                    </span>
                                                    <span className={`text-sm font-bold tracking-tight transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:translate-x-1 ${isActive ? 'text-[#c41e30] bg-[#c41e30]/10' : 'text-gray-400'}`}>
                                                <FaArrowRight className="w-3 h-3" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Pastki qism */}
                        <div className="relative z-20 px-5 pt-3 pb-6 border-t border-black/[0.05] dark:border-white/[0.08] flex flex-col gap-2.5 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-2xl shrink-0">
                            <LanguageSelector align="left" large />
                            <Link
                                to="/enter"
                                onClick={() => setMenuOpen(false)}
                                className="group relative w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-[#7a0e1a] via-[#a5182a] to-[#d31d31] text-white text-xs font-bold tracking-wider shadow-[0_10px_30px_rgba(196,30,40,0.4)] overflow-hidden"
                            >
                                <span className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[130%] transition-all duration-700 ease-out" />
                                <span className="relative">{t('navbar.dashboard', 'Boshqaruv')}</span>
                                <FaArrowRight className="relative w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}