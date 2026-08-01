import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegMoon, FaRegSun, FaBars, FaTimes, FaArrowRight, FaChevronDown, FaHome, FaInfoCircle, FaUserPlus, FaGamepad, FaClipboardList, FaChalkboardTeacher, FaChartBar, FaTrophy, FaCompass, FaGraduationCap } from 'react-icons/fa'
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
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
    const [testsDropdownOpen, setTestsDropdownOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    
    const aboutRef = useRef(null)
    const testsRef = useRef(null)
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
            if (aboutRef.current && !aboutRef.current.contains(event.target)) {
                setAboutDropdownOpen(false)
            }
            if (testsRef.current && !testsRef.current.contains(event.target)) {
                setTestsDropdownOpen(false)
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
                            onClick={() => { setMenuOpen(true); setAboutDropdownOpen(false); setTestsDropdownOpen(false); }}
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

                    <nav className="hidden lg:flex items-center gap-1">
                        {/* 1. Bosh sahifa */}
                        <Link
                            to="/"
                            className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full ${location.pathname === '/' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                            {t('navbar.home', 'Bosh sahifa')}
                            {location.pathname === '/' && (
                                <motion.div layoutId="activeTab" className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#8a0f1e] to-[#c41e30]" />
                            )}
                        </Link>

                        {/* 2. Biz haqimizda */}
                        <div className="relative" ref={aboutRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setAboutDropdownOpen((v) => !v); setTestsDropdownOpen(false); }}
                                className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full inline-flex items-center gap-1.5 cursor-pointer ${['/about', '/static', '/stats', '/products'].includes(location.pathname) ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                                <span>{t('navbar.about', 'Biz haqimizda')}</span>
                                <motion.div animate={{ rotate: aboutDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <FaChevronDown className="w-2.5 h-2.5 opacity-60" />
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {aboutDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full mt-2 w-48 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 p-1.5 z-[110] flex flex-col gap-1"
                                    >
                                        <Link
                                            to="/about"
                                            onClick={() => setAboutDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <FaInfoCircle className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.aboutUs', 'Biz haqimizda')}</span>
                                        </Link>
                                        <Link
                                            to="/static"
                                            onClick={() => setAboutDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <FaChalkboardTeacher className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.mentors', 'Mentorlar')}</span>
                                        </Link>
                                        <Link
                                            to="/stats"
                                            onClick={() => setAboutDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <FaChartBar className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.statistic', 'Statistika')}</span>
                                        </Link>
                                        <Link
                                            to="/products"
                                            onClick={() => setAboutDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <FaTrophy className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.achievements', 'Yutuqlar')}</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 3. Test va O'yinlar (Daraja testi, IELTS Practice, O'yinlar) */}
                        <div className="relative" ref={testsRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setTestsDropdownOpen((v) => !v); setAboutDropdownOpen(false); }}
                                className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full inline-flex items-center gap-1.5 cursor-pointer ${['/level-test', '/ieltspractiseapp', '/gamess'].includes(location.pathname) ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                                <span>{t('navbar.testAndGames', 'Test va o\'yinlar')}</span>
                                <motion.div animate={{ rotate: testsDropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <FaChevronDown className="w-2.5 h-2.5 opacity-60" />
                                </motion.div>
                            </motion.button>

                            <AnimatePresence>
                                {testsDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute left-0 top-full mt-2 w-52 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-white/10 p-1.5 z-[110] flex flex-col gap-1"
                                    >
                                        <Link
                                            to="/level-test"
                                            onClick={() => setTestsDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <FaClipboardList className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.levelTest', 'Daraja testi')}</span>
                                        </Link>
                                        <Link
                                            to="/ieltspractiseapp"
                                            onClick={() => setTestsDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <FaGraduationCap className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.ieltsPractice', 'IELTS Practice')}</span>
                                        </Link>
                                        <Link
                                            to="/gamess"
                                            onClick={() => setTestsDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
                                        >
                                            <FaGamepad className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.games', "O'yinlar")}</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 4. Ro'yxatdan o'tish */}
                        <Link
                            to="/register"
                            className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full ${location.pathname === '/register' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                            {t('navbar.register', "Ro'yxatdan o'tish")}
                            {location.pathname === '/register' && (
                                <motion.div layoutId="activeTab" className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#8a0f1e] to-[#c41e30]" />
                            )}
                        </Link>
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

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden fixed inset-0 z-[100] pointer-events-auto flex flex-col bg-white/95 dark:bg-[#030712]/98 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="relative z-20 flex items-center justify-between px-5 h-16 border-b border-black/[0.05] dark:border-white/[0.08] shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8a0f1e] to-[#c41e30] flex items-center justify-center text-white shadow-md">
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
                                className="w-9 h-9 flex items-center justify-center rounded-xl bg-black/[0.04] dark:bg-white/[0.08] text-gray-700 dark:text-gray-200 cursor-pointer"
                            >
                                <FaTimes className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2.5">
                            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <FaHome className="text-[#c41e30]" />
                                    <span className="text-sm font-bold">{t('navbar.home', 'Bosh sahifa')}</span>
                                </div>
                                <FaArrowRight className="w-3 h-3 text-gray-400" />
                            </Link>

                            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/[0.03] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06]">
                                <span className="text-xs font-bold text-[#c41e30] px-2">{t('navbar.about', 'Biz haqimizda')}</span>
                                <Link to="/about" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('navbar.aboutUs', 'Biz haqimizda')}</Link>
                                <Link to="/static" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('navbar.mentors', 'Mentorlar')}</Link>
                                <Link to="/stats" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('navbar.statistic', 'Statistika')}</Link>
                                <Link to="/products" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('navbar.achievements', 'Yutuqlar')}</Link>
                            </div>

                            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/[0.03] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06]">
                                <span className="text-xs font-bold text-[#c41e30] px-2">{t('navbar.testAndGames', 'Test va o\'yinlar')}</span>
                                <Link to="/level-test" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('navbar.levelTest', 'Daraja testi')}</Link>
                                <Link to="/ieltspractiseapp" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('navbar.ieltsPractice', 'IELTS Practice')}</Link>
                                <Link to="/gamess" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300">{t('navbar.games', "O'yinlar")}</Link>
                            </div>

                            <Link to="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <FaUserPlus className="text-[#c41e30]" />
                                    <span className="text-sm font-bold">{t('navbar.register', "Ro'yxatdan o'tish")}</span>
                                </div>
                                <FaArrowRight className="w-3 h-3 text-gray-400" />
                            </Link>
                        </div>

                        <div className="relative z-20 px-5 pt-3 pb-6 border-t border-black/[0.05] dark:border-white/[0.08] flex flex-col gap-2.5 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-2xl shrink-0">
                            <LanguageSelector align="left" large />
                            <Link
                                to="/enter"
                                onClick={() => setMenuOpen(false)}
                                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-[#7a0e1a] via-[#a5182a] to-[#d31d31] text-white text-xs font-bold tracking-wider shadow-lg"
                            >
                                <span>{t('navbar.dashboard', 'Boshqaruv')}</span>
                                <FaArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}