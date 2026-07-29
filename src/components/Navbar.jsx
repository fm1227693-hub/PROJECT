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

    // Mobil to'liq ekran menyu ochilganda sahifa skrolini bloklash
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang)
        setLangOpen(false)
    }

    const navItems = [
        { name: t('navbar.home', 'Bosh sahifa'), path: '/' },
        { name: t('navbar.statistic', 'Statistika'), path: '/stats' },
        { name: t('navbar.achievements', 'Yutuqlar'), path: '/products' },
        { name: t('navbar.about', 'Biz haqimizda'), path: '/about' },
        { name: t('navbar.Mentorlar', 'Mentorlar'), path: '/static' },
        { name: t('navbar.register', "Ro'yxatdan o'tish"), path: '/register' },
    ]

    const currentLang = LANGS[i18n.language]?.short ? i18n.language : 'en'

    // Yig'iladigan til tanlagich — bitta tugma, bosilganda pastga ochiladi
    const LanguageSelector = ({ align = 'right', large = false }) => (
        <div className="relative" ref={langRef}>
            <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={() => setLangOpen((v) => !v)}
                className={`flex items-center gap-1.5 rounded-full border transition-colors cursor-pointer ${large
                        ? 'pl-4 pr-3 h-11 border-gray-300/70 dark:border-white/15 text-gray-700 dark:text-gray-200 text-xs font-semibold tracking-wide hover:border-gray-400 dark:hover:border-white/30 hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'
                        : 'pl-3.5 pr-2.5 h-9 border-gray-300/70 dark:border-white/10 text-gray-600 dark:text-gray-300 text-[11px] font-semibold tracking-wide hover:border-gray-400 dark:hover:border-white/25 hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'
                    }`}
            >
                <span>{LANGS[currentLang].short}</span>
                <FaChevronDown className={`w-2 h-2 opacity-60 transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {langOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -6 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${large ? 'bottom-full mb-2.5' : 'top-full mt-2.5'} w-40 bg-white dark:bg-[#0b0b0d] rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.16)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-white/10 p-1.5 z-[60] flex flex-col gap-0.5`}
                    >
                        {Object.entries(LANGS).map(([code, { label, short }]) => (
                            <button
                                key={code}
                                onClick={() => handleLanguageChange(code)}
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${currentLang === code
                                        ? 'bg-gradient-to-r from-[#8a0f1e] to-[#c41e30] text-white'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                                    }`}
                            >
                                <span>{label}</span>
                                <span className="opacity-60 text-[10px] tracking-wider">{short}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    return (
        <div className={`fixed top-0 left-0 w-full z-50 font-sans select-none pointer-events-none transition-all duration-500 ${scrolled ? 'px-3 pt-3' : 'px-0 pt-0'}`}>
            <motion.header
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`mx-auto transition-all duration-500 pointer-events-auto relative ${scrolled
                        ? 'max-w-6xl rounded-2xl bg-white/85 dark:bg-[#08080a]/85 backdrop-blur-2xl border border-gray-200/60 dark:border-white/[0.08] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.75)]'
                        : 'max-w-full rounded-none bg-white/40 dark:bg-[#08080a]/30 backdrop-blur-md border-b border-transparent'
                    }`}
            >
                {/* Nozik yuqori chiziq — shisha effektini "premium" qiladigan detal */}
                <div className={`absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c41e30]/50 to-transparent ${scrolled ? 'rounded-t-2xl' : ''}`} />

                <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-3">

                    {/* Chap qism: Logotip va Mobil Menyu tugmasi */}
                    <div className="flex items-center gap-3 shrink-0">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setMenuOpen(true); setDropdownOpen(false); }}
                            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                        >
                            <FaBars className="w-4 h-4" />
                        </motion.button>

                        <Link to="/" className="flex items-center gap-2.5 group">
                            <motion.div whileHover={{ scale: 1.06, rotate: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }} className="relative shrink-0">
                                <img
                                    src="/Снимок экрана 2026-07-13 125121.png"
                                    alt="Optimum Logo"
                                    className="relative w-9 h-9 rounded-xl object-cover ring-1 ring-black/5 dark:ring-white/10"
                                />
                            </motion.div>
                            <span className="flex items-baseline gap-[3px] text-gray-900 dark:text-white font-bold text-[17px] tracking-[0.14em] uppercase">
                                Optimum
                                <span className="w-1 h-1 rounded-full bg-[#c41e30] translate-y-[-4px]"></span>
                            </span>
                        </Link>
                    </div>

                    {/* Kompyuter uchun markaziy menyu */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`group relative px-3.5 py-2 text-[12.5px] font-medium tracking-wide transition-colors duration-200 whitespace-nowrap rounded-full ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    <span className="absolute inset-0 rounded-full bg-black/[0.04] dark:bg-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10" />
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-[#8a0f1e] to-[#c41e30] shadow-[0_0_8px_rgba(196,30,40,0.65)]"
                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* O'ng qism elementlari */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        {/* Til tanlagich (Kompyuter va planshetlar uchun) */}
                        <div className="hidden md:block">
                            <LanguageSelector />
                        </div>

                        {/* Tema tugmasi */}
                        <motion.button
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                            onClick={Theme}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:text-[#c41e30] dark:hover:text-[#c41e30] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer shrink-0"
                        >
                            {dark ? <FaRegSun className="w-4 h-4" /> : <FaRegMoon className="w-4 h-4" />}
                        </motion.button>

                        {/* Boshqaruv tugmasi (Desktop) */}
                        <div className="hidden md:block">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                <Link
                                    to="/enter"
                                    className="group relative inline-flex items-center gap-2 pl-4 pr-3.5 py-2 rounded-full bg-gradient-to-r from-[#7a0e1a] via-[#a5182a] to-[#d31d31] text-white text-[12.5px] font-semibold tracking-wide overflow-hidden whitespace-nowrap shadow-[0_6px_20px_rgba(196,30,40,0.4)]"
                                >
                                    <span className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[130%] transition-all duration-700 ease-out" />
                                    <span className="relative">{t('navbar.dashboard', 'Boshqaruv')}</span>
                                    <FaArrowRight className="relative w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Mobil uchun Dropdown (3 ta nuqta) */}
                        <div className="relative md:hidden" ref={dropdownRef}>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => { setDropdownOpen(!dropdownOpen); setMenuOpen(false); }}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                            >
                                <FaEllipsisV className="w-4 h-4" />
                            </motion.button>

                            <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#0b0b0d] rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.18)] dark:shadow-[0_18px_45px_rgba(0,0,0,0.6)] border border-gray-100 dark:border-white/10 p-3 z-50 flex flex-col gap-3"
                                    >
                                        <Link
                                            to="/enter"
                                            onClick={() => setDropdownOpen(false)}
                                            className="w-full bg-gradient-to-r from-[#7a0e1a] via-[#a5182a] to-[#d31d31] text-white text-xs font-semibold py-3 rounded-xl text-center shadow-[0_6px_20px_rgba(196,30,40,0.35)]"
                                        >
                                            {t('navbar.dashboard', 'Boshqaruv')}
                                        </Link>
                                        <div className="flex justify-center pt-1 border-t border-gray-100 dark:border-white/10">
                                            <LanguageSelector align="left" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </motion.header>

            {/* Mobil uchun to'liq ekran premium menyu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden fixed inset-0 z-[70] pointer-events-auto flex flex-col overflow-hidden bg-white dark:bg-[#030712]"
                    >
                        {/* ====== App.jsx dagi premium fon qatlami bilan bir xil uslub ====== */}
                        <div className="pointer-events-none absolute inset-0 z-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#030712] dark:via-[#050912] dark:to-[#0a0f1c]" />
                            <div
                                className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle, rgba(100,116,139,0.25) 1px, transparent 1px)',
                                    backgroundSize: '28px 28px',
                                }}
                            />
                            <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-transparent rounded-full blur-[130px]" />
                            <div className="absolute -top-16 right-0 w-[360px] h-[360px] bg-gradient-to-bl from-blue-500/20 via-cyan-400/10 to-transparent rounded-full blur-[120px]" />
                            <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] bg-gradient-to-l from-fuchsia-500/10 to-transparent rounded-full blur-[110px]" />
                            <div className="absolute bottom-0 left-1/4 w-[360px] h-[300px] bg-gradient-to-t from-amber-400/10 via-orange-400/5 to-transparent rounded-full blur-[120px]" />
                            <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-slate-100 dark:from-[#020509] to-transparent" />
                            <div
                                className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
                                style={{
                                    backgroundImage:
                                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                                }}
                            />
                        </div>
                        {/* ====== Fon qatlami tugadi ====== */}

                        <div className="relative z-10 flex items-center justify-between px-6 h-[68px] border-b border-black/[0.06] dark:border-white/[0.07]">
                            <span className="flex items-baseline gap-[3px] text-gray-900 dark:text-white font-bold text-[17px] tracking-[0.14em] uppercase">
                                Optimum
                                <span className="w-1 h-1 rounded-full bg-[#c41e30] translate-y-[-4px]"></span>
                            </span>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setMenuOpen(false)}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                            >
                                <FaTimes className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <nav className="relative z-10 flex-1 flex flex-col justify-center px-6 gap-1 overflow-y-auto">
                            {navItems.map((item, idx) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.35, delay: 0.05 + idx * 0.05, ease: 'easeOut' }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={() => setMenuOpen(false)}
                                            className="group flex items-center gap-4 py-3.5 border-b border-black/[0.05] dark:border-white/[0.06]"
                                        >
                                            <span className={`text-[11px] font-mono tracking-widest ${isActive ? 'text-[#c41e30]' : 'text-gray-400 dark:text-gray-600'}`}>
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <span className={`text-2xl font-semibold tracking-tight transition-all duration-200 group-hover:translate-x-1 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 group-active:text-gray-900 dark:group-active:text-white'
                                                }`}>
                                                {item.name}
                                            </span>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </nav>

                        <div className="relative z-10 px-6 pb-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.07] flex items-center justify-between gap-3">
                            <LanguageSelector align="left" large />
                            <Link
                                to="/enter"
                                onClick={() => setMenuOpen(false)}
                                className="group relative flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-[#7a0e1a] via-[#a5182a] to-[#d31d31] text-white text-sm font-semibold tracking-wide shadow-[0_10px_30px_rgba(196,30,40,0.35)] overflow-hidden"
                            >
                                <span className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-[130%] transition-all duration-700 ease-out" />
                                <span className="relative">{t('navbar.dashboard', 'Boshqaruv')}</span>
                                <FaArrowRight className="relative w-3 h-3" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}