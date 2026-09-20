import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
    FaRegMoon, FaRegSun, FaTimes, FaArrowRight, FaChevronDown,
    FaHome, FaInfoCircle, FaGamepad, FaClipboardList, FaChalkboardTeacher,
    FaChartBar, FaQuestionCircle, FaGraduationCap, FaHeadphones, FaBookOpen,
    FaUserShield
} from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEventEmitter } from '../utils/eventEmitter'

const LANGS = {
    uz: { label: "O'zbekcha", short: 'UZ' },
    ru: { label: 'Русский', short: 'RU' },
    en: { label: 'English', short: 'EN' },
}

function LanguageSelector({
    langOpen,
    setLangOpen,
    currentLang,
    onSelect,
    align = 'right',
    large = false,
}) {
    const { t } = useTranslation()
    const langRef = useRef(null)

    return (
        <div className="relative w-full" ref={langRef}>
            <button
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t('navbar.language', 'Tilni tanlash')}
                className={`flex items-center justify-between gap-2 rounded-full border border-linestrong text-soft hover:text-ink hover:border-ink transition-all duration-300 cursor-pointer ${
                    large ? 'w-full h-11 px-4 text-[13px] font-semibold' : 'h-9 px-3.5 text-[12px] font-semibold tracking-wide'
                }`}
            >
                <span>{LANGS[currentLang].label}</span>
                <motion.span animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <FaChevronDown className="w-2.5 h-2.5 opacity-60" />
                </motion.span>
            </button>

            <AnimatePresence>
                {langOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} ${
                            large ? 'bottom-full mb-2 w-full' : 'top-full mt-2 w-44'
                        } bg-surface border border-line rounded-2xl shadow-soft p-1.5 z-[110] flex flex-col gap-0.5`}
                    >
                        {Object.entries(LANGS).map(([code, { label, short }]) => (
                            <button
                                key={code}
                                onClick={() => onSelect(code)}
                                className={`relative flex items-center justify-between px-4 py-2.5 rounded-[10px] text-[13px] font-semibold transition-colors duration-200 cursor-pointer ${
                                    currentLang === code
                                        ? 'bg-[var(--accent-soft)] text-accent'
                                        : 'text-soft hover:text-ink hover:bg-[var(--surface-2)]'
                                }`}
                            >
                                <span>{label}</span>
                                <span className="text-[10px] tracking-[0.14em] opacity-50">{short}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default function Navbar() {
    const { t, i18n } = useTranslation()
    const location = useLocation()

    const [dark, isDark] = useState(() => {
        const saved = localStorage.getItem('theme')
        if (saved === null) return true
        return saved === 'true'
    })
    const [menuOpen, setMenuOpen] = useState(false)
    const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
    const [testsDropdownOpen, setTestsDropdownOpen] = useState(false)
    const [langOpen, setLangOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [navHidden, setNavHidden] = useState(false)

    const aboutRef = useRef(null)
    const testsRef = useRef(null)
    const langRef = useRef(null)

    // LevelsScroll pinned bo'lganda navni yashirish
    useEventEmitter('toggle-nav', (payload) => {
        setNavHidden(payload)
    })

    const Theme = () => {
        window.dispatchEvent(new CustomEvent('trigger-theme-transition'))
        setTimeout(() => {
            const nextState = !dark
            isDark(nextState)
            localStorage.setItem('theme', nextState)
            if (nextState) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }, 180)
    }

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        const shouldBeDark = saved === null ? true : saved === 'true'
        if (shouldBeDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        let ticking = false
        const handleScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(() => {
                setScrolled(window.scrollY > 24)
                ticking = false
            })
        }

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

        window.addEventListener('scroll', handleScroll, { passive: true })
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

    // Route o'zgarganda dropdownlarni yopish
    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect */
        setAboutDropdownOpen(false)
        setTestsDropdownOpen(false)
        setLangOpen(false)
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [location.pathname])

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang)
        setLangOpen(false)
    }

    const currentLang = LANGS[i18n.language]?.short ? i18n.language : 'en'

    const isActive = (paths) =>
        paths.includes(location.pathname) && !(location.pathname === '/' && location.hash)

    const navLinkClass = (active) =>
        `relative px-3 py-2 text-[13px] font-medium tracking-[0.01em] whitespace-nowrap transition-colors duration-300 cursor-pointer ${
            active ? 'text-ink' : 'text-soft hover:text-ink'
        }`

    const underline = (active) => (
        <span
            aria-hidden="true"
            className={`absolute left-3 right-3 bottom-0.5 h-px bg-accent origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${active ? 'scale-x-100' : 'scale-x-0'}`}
        />
    )

    const dropdownItem = 'flex items-center gap-3 px-4 py-2.5 rounded-[10px] text-[13px] font-medium text-soft hover:text-ink hover:bg-[var(--accent-soft)] transition-colors duration-200 cursor-pointer'

    const renderLanguageSelector = (align = 'right', large = false) => (
        <LanguageSelector
            langOpen={langOpen}
            setLangOpen={setLangOpen}
            currentLang={currentLang}
            onSelect={handleLanguageChange}
            align={align}
            large={large}
        />
    )

    return (
        <>
            <div
                data-navbar-root
                className={`fixed top-0 left-0 w-full z-50 select-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    scrolled
                        ? 'bg-[color-mix(in_srgb,var(--bg)_86%,transparent)] backdrop-blur-xl border-b border-line'
                        : 'bg-transparent border-b border-transparent'
                } ${navHidden ? '-translate-y-[120%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}
            >
                <div className="container-site">
                    <div className="h-[72px] flex items-center justify-between gap-3">
                        {/* Brend */}
                        <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Optimum — Bosh sahifa">
                            <img
                                src="/favicon.png"
                                alt="Optimum logo"
                                width={34}
                                height={34}
                                className="w-[34px] h-[34px] rounded-[10px] object-cover ring-1 ring-line"
                            />
                            <span className="flex flex-col leading-none">
                                <span className="font-display text-[21px] font-semibold tracking-[-0.01em] text-ink">
                                    Optimum
                                </span>
                                <span className="hidden sm:block text-[8.5px] font-bold tracking-[0.3em] uppercase text-muted mt-1">
                                    School of English
                                </span>
                            </span>
                        </Link>

                        {/* Desktop navigatsiya */}
                        <nav className="hidden lg:flex items-center gap-1" aria-label="Asosiy navigatsiya">
                            <Link to="/" className={navLinkClass(isActive(['/']))}>
                                {t('navbar.home', 'Bosh sahifa')}
                                {underline(isActive(['/']))}
                            </Link>

                            {/* Biz haqimizda */}
                            <div className="relative" ref={aboutRef}>
                                <button
                                    onClick={() => { setAboutDropdownOpen((v) => !v); setTestsDropdownOpen(false) }}
                                    aria-expanded={aboutDropdownOpen}
                                    aria-haspopup="menu"
                                    className={`${navLinkClass(isActive(['/about', '/mentor-stats', '/stats']))} inline-flex items-center gap-1.5`}
                                >
                                    {t('navbar.about', 'Biz haqimizda')}
                                    <motion.span animate={{ rotate: aboutDropdownOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                                        <FaChevronDown className="w-2.5 h-2.5 opacity-60" />
                                    </motion.span>
                                    {underline(isActive(['/about', '/mentor-stats', '/stats']))}
                                </button>

                                <AnimatePresence>
                                    {aboutDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                            role="menu"
                                            className="absolute left-0 top-full pt-3 w-52 z-[110]"
                                        >
                                            <div className="bg-surface border border-line rounded-2xl shadow-soft p-1.5 flex flex-col gap-0.5">
                                                <Link to="/about" onClick={() => setAboutDropdownOpen(false)} className={dropdownItem}>
                                                    <FaInfoCircle className="w-3.5 h-3.5 text-accent shrink-0" />
                                                    {t('navbar.aboutUs', 'Biz haqimizda')}
                                                </Link>
                                                <Link to="/mentor-stats" onClick={() => setAboutDropdownOpen(false)} className={dropdownItem}>
                                                    <FaChalkboardTeacher className="w-3.5 h-3.5 text-accent shrink-0" />
                                                    {t('navbar.mentors', 'Mentorlar')}
                                                </Link>
                                                <Link to="/stats" onClick={() => setAboutDropdownOpen(false)} className={dropdownItem}>
                                                    <FaChartBar className="w-3.5 h-3.5 text-accent shrink-0" />
                                                    {t('navbar.statistic', 'Statistika')}
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Testlar va o'yinlar */}
                            <div className="relative" ref={testsRef}>
                                <button
                                    onClick={() => { setTestsDropdownOpen((v) => !v); setAboutDropdownOpen(false) }}
                                    aria-expanded={testsDropdownOpen}
                                    aria-haspopup="menu"
                                    className={`${navLinkClass(isActive(['/level-test', '/ielts-practice', '/games', '/ielts-writing', '/reading-tests', '/listening-tests']))} inline-flex items-center gap-1.5`}
                                >
                                    {t('navbar.testAndGames', "Mock Testlar va O'yinlar")}
                                    <motion.span animate={{ rotate: testsDropdownOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                                        <FaChevronDown className="w-2.5 h-2.5 opacity-60" />
                                    </motion.span>
                                    {underline(isActive(['/level-test', '/ielts-practice', '/games', '/ielts-writing', '/reading-tests', '/listening-tests']))}
                                </button>

                                <AnimatePresence>
                                    {testsDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                            role="menu"
                                            className="absolute left-0 top-full pt-3 w-56 z-[110]"
                                        >
                                            <div className="bg-surface border border-line rounded-2xl shadow-soft p-1.5 flex flex-col gap-0.5">
                                                <Link to="/ielts-writing" onClick={() => setTestsDropdownOpen(false)} className={dropdownItem}>
                                                    <FaGraduationCap className="w-3.5 h-3.5 text-accent shrink-0" />
                                                    {t('navbar.ieltsWriting', 'IELTS Writing')}
                                                </Link>
                                                <Link to="/reading-tests" onClick={() => setTestsDropdownOpen(false)} className={dropdownItem}>
                                                    <FaBookOpen className="w-3.5 h-3.5 text-accent shrink-0" />
                                                    <span>IELTS Reading Tests</span>
                                                </Link>
                                                <Link to="/listening-tests" onClick={() => setTestsDropdownOpen(false)} className={dropdownItem}>
                                                    <FaHeadphones className="w-3.5 h-3.5 text-accent shrink-0" />
                                                    <span>IELTS Listening Tests</span>
                                                </Link>
                                                <Link to="/games" onClick={() => setTestsDropdownOpen(false)} className={dropdownItem}>
                                                    <FaGamepad className="w-3.5 h-3.5 text-accent shrink-0" />
                                                    {t('navbar.games', "O'yinlar")}
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <Link to="/faq" className={navLinkClass(isActive(['/faq']))}>
                                {t('navbar.faq', 'FAQ')}
                                {underline(isActive(['/faq']))}
                            </Link>
                        </nav>

                        {/* O'ng klaster */}
                        <div className="flex items-center gap-2.5 shrink-0">
                            <div className="hidden md:block">
                                {renderLanguageSelector()}
                            </div>

                            {/* Tema tugmasi */}
                            <button
                                onClick={Theme}
                                aria-label={dark ? t('navbar.lightMode', 'Yorug\' rejim') : t('navbar.darkMode', 'Tungi rejim')}
                                className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full border border-linestrong text-soft hover:text-ink hover:border-ink transition-all duration-300 cursor-pointer"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={dark ? 'sun' : 'moon'}
                                        initial={{ y: -8, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 8, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex"
                                    >
                                        {dark ? <FaRegSun className="w-[15px] h-[15px]" /> : <FaRegMoon className="w-[15px] h-[15px]" />}
                                    </motion.span>
                                </AnimatePresence>
                            </button>

                            {/* Desktop CTA */}
                            <Link
                                to="/form"
                                className="btn btn-primary hidden xl:inline-flex !py-[10px] !px-5 text-[13px]"
                            >
                                {t('leadForm.formTitle', 'Bepul darsga yozilish')}
                                <FaArrowRight className="w-3 h-3 btn-arrow" />
                            </Link>

                            {/* Hamburger (mobil) */}
                            <button
                                onClick={() => { setMenuOpen((v) => !v); setAboutDropdownOpen(false); setTestsDropdownOpen(false) }}
                                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full border border-linestrong text-soft hover:text-ink hover:border-ink transition-all duration-300 cursor-pointer relative z-[110]"
                                aria-label="Toggle Navigation Menu"
                                aria-expanded={menuOpen}
                            >
                                <motion.span
                                    animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="w-[18px] h-[2px] bg-current rounded-full origin-center"
                                />
                                <motion.span
                                    animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    className="w-[18px] h-[2px] bg-current rounded-full origin-center"
                                />
                                <motion.span
                                    animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="w-[18px] h-[2px] bg-current rounded-full origin-center"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobil menyular */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => setMenuOpen(false)}
                            className="lg:hidden fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
                            style={{ willChange: 'transform' }}
                            role="dialog"
                            aria-modal="true"
                            className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-[400px] max-w-full z-[100] flex flex-col bg-bg border-l border-line overflow-hidden"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-line shrink-0">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/favicon.png"
                                        alt="Optimum logo"
                                        width={34}
                                        height={34}
                                        className="w-[34px] h-[34px] rounded-[10px] object-cover ring-1 ring-line"
                                    />
                                    <span className="font-display text-[21px] font-semibold text-ink">Optimum</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={Theme}
                                        aria-label="Toggle theme"
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-linestrong text-soft hover:text-ink hover:border-ink transition-colors cursor-pointer"
                                    >
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.span
                                                key={dark ? 'sun' : 'moon'}
                                                initial={{ y: -8, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 8, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex"
                                            >
                                                {dark ? <FaRegSun className="w-4 h-4" /> : <FaRegMoon className="w-4 h-4" />}
                                            </motion.span>
                                        </AnimatePresence>
                                    </button>
                                    <button
                                        onClick={() => setMenuOpen(false)}
                                        aria-label="Menyuni yopish"
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-linestrong text-soft hover:text-ink hover:border-ink transition-colors cursor-pointer"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Drawer content */}
                            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-9">
                                <div className="flex flex-col gap-1">
                                    <span className="meta-label mb-2">{t('navbar.main', 'Asosiy')}</span>
                                    <Link to="/" onClick={() => setMenuOpen(false)} className="group flex items-center justify-between py-2.5 font-display text-[22px] text-soft hover:text-ink transition-colors">
                                        <span className="flex items-center gap-3.5"><FaHome className="w-4 h-4 opacity-40" />{t('navbar.home', 'Bosh sahifa')}</span>
                                        <FaArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="meta-label mb-2">{t('navbar.about', 'Biz haqimizda')}</span>
                                    {[
                                        { to: '/about', icon: <FaInfoCircle className="w-4 h-4 opacity-40" />, label: t('navbar.aboutUs', 'Biz haqimizda') },
                                        { to: '/mentor-stats', icon: <FaChalkboardTeacher className="w-4 h-4 opacity-40" />, label: t('navbar.mentors', 'Mentorlar') },
                                        { to: '/stats', icon: <FaChartBar className="w-4 h-4 opacity-40" />, label: t('navbar.statistic', 'Statistika') },
                                    ].map((l) => (
                                        <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="group flex items-center justify-between py-2.5 font-display text-[22px] text-soft hover:text-ink transition-colors">
                                            <span className="flex items-center gap-3.5">{l.icon}{l.label}</span>
                                            <FaArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="meta-label mb-2">{t('navbar.testAndGames', "Mock Testlar va O'yinlar")}</span>
                                    {[
                                        { to: '/ielts-writing', icon: <FaGraduationCap className="w-4 h-4 opacity-40" />, label: t('navbar.ieltsWriting', 'IELTS Writing') },
                                        { to: '/reading-tests', icon: <FaBookOpen className="w-4 h-4 opacity-40" />, label: 'IELTS Reading Tests' },
                                        { to: '/listening-tests', icon: <FaHeadphones className="w-4 h-4 opacity-40" />, label: 'IELTS Listening Tests' },
                                        { to: '/games', icon: <FaGamepad className="w-4 h-4 opacity-40" />, label: t('navbar.games', "O'yinlar") },
                                    ].map((l) => (
                                        <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="group flex items-center justify-between py-2.5 font-display text-[22px] text-soft hover:text-ink transition-colors">
                                            <span className="flex items-center gap-3.5">{l.icon}{l.label}</span>
                                            <FaArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <span className="meta-label mb-2">{t('navbar.support', 'Yordam')}</span>
                                    {[
                                        { to: '/faq', icon: <FaQuestionCircle className="w-4 h-4 opacity-40" />, label: t('navbar.faq', 'FAQ') },
                                        { to: '/privacy-policy', icon: <FaUserShield className="w-4 h-4 opacity-40" />, label: t('footer.privacy', 'Maxfiylik siyosati') },
                                        { to: '/terms-of-use', icon: <FaClipboardList className="w-4 h-4 opacity-40" />, label: t('footer.terms', 'Foydalanish shartlari') },
                                    ].map((l) => (
                                        <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="group flex items-center justify-between py-2.5 font-display text-[22px] text-soft hover:text-ink transition-colors">
                                            <span className="flex items-center gap-3.5">{l.icon}{l.label}</span>
                                            <FaArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Drawer footer */}
                            <div className="px-6 py-6 border-t border-line flex flex-col gap-3.5 bg-raised">
                                {renderLanguageSelector("left", true)}
                                <Link
                                    to="/form"
                                    onClick={() => setMenuOpen(false)}
                                    className="btn btn-primary w-full"
                                >
                                    {t('leadForm.formTitle', 'Bepul darsga yozilish')}
                                    <FaArrowRight className="w-3.5 h-3.5 btn-arrow" />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
