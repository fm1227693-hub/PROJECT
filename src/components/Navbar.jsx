import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaRegMoon, FaRegSun, FaBars, FaTimes, FaArrowRight, FaChevronDown, FaHome, FaInfoCircle, FaGamepad, FaClipboardList, FaChalkboardTeacher, FaChartBar, FaQuestionCircle, FaGraduationCap, FaUserShield, FaHeadphones, FaBookOpen } from 'react-icons/fa'
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

    const [dark, isDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        // Agar localStorage da qiymat bo'lmasa, default dark mode
        if (saved === null) return true
        return saved === 'true'
    })
    const [menuOpen, setMenuOpen] = useState(false)
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
    const [testsDropdownOpen, setTestsDropdownOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const aboutRef = useRef(null)
    const testsRef = useRef(null)
    const langRef = useRef(null)

    const Theme = () => {
        // Trigger synthetic theme transition loading screen
        window.dispatchEvent(new CustomEvent('trigger-theme-transition'));

        // Flip theme mode cleanly behind the loading overlay
        setTimeout(() => {
            const nextState = !dark;
            isDark(nextState);
            localStorage.setItem('theme', nextState);
            if (nextState) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }, 180);
    }

    useEffect(() => {
        // useState lazy initializer allaqachon state ni o'rnatdi,
        // faqat DOM ga dark class ni qo'llashimiz kerak
        const saved = localStorage.getItem('theme')
        const shouldBeDark = saved === null ? true : saved === 'true'
        isDark(shouldBeDark)
        if (shouldBeDark) {
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
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
            document.body.classList.add('mobile-menu-open')
        } else {
            document.body.style.overflow = ''
            document.body.classList.remove('mobile-menu-open')
        }
        return () => { 
            document.body.style.overflow = ''
            document.body.classList.remove('mobile-menu-open')
        }
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
                            <motion.button
                                key={code}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleLanguageChange(code)}
                                className={`relative group overflow-hidden flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${currentLang === code
                                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-[0_6px_20px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_25px_rgba(220,38,38,0.5)] border border-red-500/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-red-600 dark:hover:text-red-400'
                                }`}
                            >
                                {currentLang === code && (
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
                                )}
                                <span className="relative z-10">{label}</span>
                                <span className="relative z-10 opacity-70 text-[10px] tracking-wider font-mono">{short}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div className={`fixed top-0 left-0 w-full z-50 font-['Merriweather',serif] select-none pointer-events-none transition-all duration-500 ${scrolled ? 'px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4' : 'px-0 pt-0'}`}>
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`mx-auto transition-all duration-500 pointer-events-auto relative ${scrolled
                    ? 'max-w-[1216px] rounded-2xl bg-white/80 dark:bg-[#030712]/80 backdrop-blur-2xl border border-gray-200/70 dark:border-white/[0.09] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                    : 'max-w-full rounded-none bg-white/40 dark:bg-[#030712]/30 backdrop-blur-md border-b border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 shrink-0">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <motion.div whileHover={{ scale: 1.12, rotate: -5 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="relative shrink-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#c41e30] to-rose-600 rounded-xl blur-[8px] opacity-50 group-hover:opacity-90 transition duration-300" />
                                <img
                                    src="/Снимок экрана 2026-07-13 125121.png"
                                    alt="Optimum Logo"
                                    className="relative w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/20 shadow-sm"
                                />
                            </motion.div>
                            <span className="text-gray-900 dark:text-white font-extrabold text-[17px] tracking-[0.14em] uppercase font-heading">
                                Optimum
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden lg:flex items-center gap-1">
                        {/* 1. Bosh sahifa */}
                        <Link
                            to="/"
                            className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full ${location.pathname === '/' && !location.hash ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                            {t('navbar.home', 'Bosh sahifa')}
                            {location.pathname === '/' && !location.hash && (
                                <motion.div layoutId="activeTab" className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#8a0f1e] to-[#c41e30]" />
                            )}
                        </Link>

                        {/* 2. Biz haqimizda */}
                        <div className="relative" ref={aboutRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setAboutDropdownOpen((v) => !v); setTestsDropdownOpen(false); }}
                                className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full inline-flex items-center gap-1.5 cursor-pointer ${['/about', '/static', '/stats'].includes(location.pathname) ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
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
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-red-600 dark:hover:text-white transition-colors"
                                        >
                                            <FaInfoCircle className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.aboutUs', 'Biz haqimizda')}</span>
                                        </Link>
                                        <Link
                                            to="/mentor-stats"
                                            onClick={() => setAboutDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-red-600 dark:hover:text-white transition-colors"
                                        >
                                            <FaChalkboardTeacher className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.mentors', 'Mentorlar')}</span>
                                        </Link>
                                        <Link
                                            to="/stats"
                                            onClick={() => setAboutDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-red-600 dark:hover:text-white transition-colors"
                                        >
                                            <FaChartBar className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.statistic', 'Statistika')}</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 3. Test va O'yinlar */}
                        <div className="relative" ref={testsRef}>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setTestsDropdownOpen((v) => !v); setAboutDropdownOpen(false); }}
                                className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full inline-flex items-center gap-1.5 cursor-pointer ${['/level-test', '/ielts-practice', '/games'].includes(location.pathname) ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                                <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                                <span>{t('navbar.testAndGames', "Mock Testlar va O'yinlar")}</span>
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
                                            to="/ielts-writing"
                                            onClick={() => setTestsDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-red-600 dark:hover:text-white transition-colors"
                                        >
                                            <FaGraduationCap className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.ieltsWriting', 'IELTS Writing')}</span>
                                        </Link>

                                        <Link
                                            to="/reading-tests"
                                            onClick={() => setTestsDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-red-600 dark:hover:text-white transition-colors"
                                        >
                                            <FaBookOpen className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>IELTS Reading Tests</span>
                                        </Link>
                                        <Link
                                            to="/listening-tests"
                                            onClick={() => setTestsDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-red-600 dark:hover:text-white transition-colors"
                                        >
                                            <FaHeadphones className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>IELTS Listening Tests</span>
                                        </Link>
                                        <Link
                                            to="/games"
                                            onClick={() => setTestsDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.1] hover:text-red-600 dark:hover:text-white transition-colors"
                                        >
                                            <FaGamepad className="w-3.5 h-3.5 text-[#c41e30]" />
                                            <span>{t('navbar.games', "O'yinlar")}</span>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 4. FAQ */}
                        <Link
                            to="/faq"
                            className={`group relative px-3 py-2 text-[12px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full ${location.pathname === '/faq' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                            {t('navbar.faq', 'FAQ')}
                        </Link>

                    </nav>

                    <div className="flex items-center gap-2.5 shrink-0">
                        <div className="hidden md:block">
                            <LanguageSelector />
                        </div>

                        {/* Theme Toggle (Hidden on Mobile, visible on Desktop) */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.85, rotate: -180 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            onClick={Theme}
                            className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-[#c41e30] dark:hover:text-[#c41e30] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
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

                        {/* Hamburger Button (Visible on Mobile) */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setMenuOpen((v) => !v); setAboutDropdownOpen(false); setTestsDropdownOpen(false); }}
                            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white/80 dark:bg-white/[0.06] border border-gray-200/80 dark:border-white/10 shadow-sm cursor-pointer relative z-[110]"
                            aria-label="Toggle Navigation Menu"
                        >
                            <motion.span
                                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="w-5 h-[2.5px] bg-slate-700 dark:bg-white rounded-full origin-center"
                            />
                            <motion.span
                                animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="w-5 h-[2.5px] bg-slate-700 dark:bg-white rounded-full origin-center"
                            />
                            <motion.span
                                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className="w-5 h-[2.5px] bg-slate-700 dark:bg-white rounded-full origin-center"
                            />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Drawer Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Backdrop Blur Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMenuOpen(false)}
                            className="lg:hidden fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm"
                        />

                        {/* Premium Slide-in Drawer */}
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                            style={{ willChange: "transform, opacity" }}
                            className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-[400px] max-w-full z-[100] pointer-events-auto flex flex-col bg-white dark:bg-[#070b14] shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.5)] border-l border-gray-200/50 dark:border-white/10 overflow-hidden"
                        >
                            {/* Header inside drawer */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.05] dark:border-white/[0.08] shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#c41e30] to-rose-600 rounded-xl blur-[8px] opacity-60" />
                                        <img
                                            src="/Снимок экрана 2026-07-13 125121.png"
                                            alt="Optimum Logo"
                                            className="relative w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/20 shadow-sm"
                                        />
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-extrabold text-lg tracking-[0.16em] uppercase font-heading">
                                        Optimum
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Mobile Theme Toggle */}
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 15 }}
                                        whileTap={{ scale: 0.85, rotate: -180 }}
                                        onClick={Theme}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-[#c41e30] hover:text-white dark:hover:bg-[#c41e30] transition-colors cursor-pointer"
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

                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMenuOpen(false)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-[#c41e30] hover:text-white dark:hover:bg-[#c41e30] transition-colors cursor-pointer"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Scrollable Nav Content */}
                            <div className="relative z-10 flex-1 overflow-y-auto px-7 py-8 flex flex-col gap-10">
                                
                                {/* Main Links */}
                                <div className="flex flex-col gap-5">
                                    <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('navbar.main', 'Asosiy')}</span>
                                    <Link to="/" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaHome className="w-4 h-4 opacity-50" />
                                        {t('navbar.home', 'Bosh sahifa')}
                                    </Link>
                                </div>

                                {/* About Us */}
                                <div className="flex flex-col gap-5">
                                    <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('navbar.about', 'Biz haqimizda')}</span>
                                    <Link to="/about" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaInfoCircle className="w-4 h-4 opacity-50" />
                                        {t('navbar.aboutUs', 'Biz haqimizda')}
                                    </Link>
                                    <Link to="/mentor-stats" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaChalkboardTeacher className="w-4 h-4 opacity-50" />
                                        {t('navbar.mentors', 'Mentorlar')}
                                    </Link>
                                    <Link to="/stats" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaChartBar className="w-4 h-4 opacity-50" />
                                        {t('navbar.statistic', 'Statistika')}
                                    </Link>
                                </div>

                                {/* Tests & Games */}
                                <div className="flex flex-col gap-5">
                                    <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('navbar.testAndGames', "Mock Testlar va O'yinlar")}</span>
                                    <Link to="/ielts-writing" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaGraduationCap className="w-4 h-4 opacity-50" />
                                        {t('navbar.ieltsWriting', 'IELTS Writing')}
                                    </Link>
                                    <Link to="/reading-tests" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaBookOpen className="w-4 h-4 opacity-50" />
                                        IELTS Reading Tests
                                    </Link>
                                    <Link to="/listening-tests" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaHeadphones className="w-4 h-4 opacity-50" />
                                        IELTS Listening Tests
                                    </Link>
                                    <Link to="/games" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaGamepad className="w-4 h-4 opacity-50" />
                                        {t('navbar.games', "O'yinlar")}
                                    </Link>
                                </div>

                                {/* FAQ */}
                                <div className="flex flex-col gap-5">
                                    <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t('navbar.support', 'Yordam')}</span>
                                    <Link to="/faq" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaQuestionCircle className="w-4 h-4 opacity-50" />
                                        {t('navbar.faq', 'FAQ')}
                                    </Link>
                                    <Link to="/privacy-policy" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaUserShield className="w-4 h-4 opacity-50" />
                                        {t('footer.privacy', 'Maxfiylik siyosati')}
                                    </Link>
                                    <Link to="/terms-of-use" onClick={() => setMenuOpen(false)} className="text-[17px] font-semibold text-gray-600 dark:text-gray-300 hover:text-[#c41e30] dark:hover:text-red-400 transition-colors flex items-center gap-3">
                                        <FaClipboardList className="w-4 h-4 opacity-50" />
                                        {t('footer.terms', 'Foydalanish shartlari')}
                                    </Link>
                                </div>
                            </div>

                            {/* Bottom Actions */}
                            <div className="px-6 py-6 border-t border-black/[0.05] dark:border-white/[0.08] flex flex-col gap-4 bg-gray-50/50 dark:bg-white/[0.02]">
                                <LanguageSelector align="left" large />
                                <Link
                                    to="/form"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full py-3.5 bg-gradient-to-r from-[#8a0f1e] to-[#c41e30] hover:from-[#7a0d1a] hover:to-[#a81a29] text-white font-bold rounded-2xl shadow-lg shadow-[#c41e30]/30 flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all active:scale-[0.98]"
                                >
                                    <span>{t('leadForm.formTitle', 'Bepul darsga yozilish')}</span>
                                    <FaArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}