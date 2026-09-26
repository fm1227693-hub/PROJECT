import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    FaRegMoon,
    FaRegSun,
    FaArrowRight,
    FaChevronDown,
      FaInfoCircle,
    FaGamepad,
    FaClipboardList,
    FaChalkboardTeacher,
    FaChartBar,
      FaGraduationCap,
    FaUserShield,
    FaHeadphones,
    FaBookOpen,
} from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useEventEmitter } from '../utils/eventEmitter'
import MagneticButton from './premium/MagneticButton'
import { isCoarsePointer, prefersReducedMotion } from './premium/studioEnv'

const LANGS = {
    uz: { label: "O'zbekcha", short: 'UZ' },
    ru: { label: 'Русский', short: 'RU' },
    en: { label: 'English', short: 'EN' },
}

/* Language selector — hoisted out of Navbar so it is not re-created each render. */
function LanguageSelector({ currentLang, langOpen, onToggle, onSelect, align = 'right', large = false }) {
    return (
        <div className="relative w-full">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onToggle}
                className={large ? 'st-menu-lang' : 'st-nav-lang'}
                aria-expanded={langOpen}
            >
                <span>{LANGS[currentLang].label}</span>
                <motion.span animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ display: 'inline-flex' }}>
                    <FaChevronDown className="w-2.5 h-2.5 opacity-60" />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {langOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className={`st-nav-dd ${align === 'right' ? 'right-0 left-auto' : 'left-0'} ${large ? 'bottom-full mb-2' : 'top-full mt-2'}`}
                        style={{ minWidth: large ? '100%' : 200 }}
                    >
                        {Object.entries(LANGS).map(([code, { label, short }]) => (
                            <motion.button
                                key={code}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onSelect(code)}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                                    currentLang === code
                                        ? 'bg-[var(--accent-soft)] text-[var(--text)]'
                                        : 'text-[var(--text-2)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)]'
                                }`}
                            >
                                <span>{label}</span>
                                <span className="font-mono text-[10px] tracking-wider opacity-60">{short}</span>
                            </motion.button>
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

    const navRef = useRef(null)
    const pillRef = useRef(null)
    const gliderRef = useRef(null)
    const progRef = useRef(null)
    const hoveredRef = useRef(null)

    const aboutRef = useRef(null)
    const testsRef = useRef(null)
    const langRef = useRef(null)

    useEventEmitter('toggle-nav', (payload) => setNavHidden(payload))

    /* ---------------- theme ---------------- */
    const Theme = () => {
        window.dispatchEvent(new CustomEvent('trigger-theme-transition'))
        setTimeout(() => {
            const nextState = !dark
            isDark(nextState)
            localStorage.setItem('theme', nextState)
            if (nextState) document.documentElement.classList.add('dark')
            else document.documentElement.classList.remove('dark')
        }, 180)
    }


    /* ---------------- scroll state + progress line ---------------- */
    useEffect(() => {
        let last = window.scrollY
        let frame = 0
        const onScroll = () => {
            const y = window.scrollY
            setScrolled(y > 24)
            setNavHidden(y > last && y > 260 && !document.body.classList.contains('st-menu-open'))
            last = y
            if (frame) return
            frame = requestAnimationFrame(() => {
                frame = 0
                const bar = progRef.current
                if (!bar) return
                const max = document.documentElement.scrollHeight - window.innerHeight
                bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
            })
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            window.removeEventListener('scroll', onScroll)
            if (frame) cancelAnimationFrame(frame)
        }
    }, [])

    /* ---------------- outside click ---------------- */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (aboutRef.current && !aboutRef.current.contains(event.target)) setAboutDropdownOpen(false)
            if (testsRef.current && !testsRef.current.contains(event.target)) setTestsDropdownOpen(false)
            if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    /* ---------------- body lock for the fullscreen menu ---------------- */
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden'
            document.body.classList.add('st-menu-open', 'mobile-menu-open')
            window.__lenis?.stop?.()
        } else {
            document.body.style.overflow = ''
            document.body.classList.remove('st-menu-open', 'mobile-menu-open')
            window.__lenis?.start?.()
        }
        return () => {
            document.body.style.overflow = ''
            document.body.classList.remove('st-menu-open', 'mobile-menu-open')
        }
    }, [menuOpen])

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang)
        setLangOpen(false)
    }

    const currentLang = LANGS[i18n.language]?.short ? i18n.language : 'en'

    /* ---------------- gliding active indicator ---------------- */
    const moveGlider = (el, duration = 0.6, ease = 'power3.out') => {
        const glider = gliderRef.current
        if (!glider || !el) return
        gsap.to(glider, {
            x: el.offsetLeft,
            width: el.offsetWidth,
            duration,
            ease,
            overwrite: 'auto',
        })
    }

    const isActiveRoute = (routes) => routes.some((r) => location.pathname === r)

    useEffect(() => {
        const pill = pillRef.current
        if (!pill) return
        const active = pill.querySelector('a.is-active, button.is-active')
        if (active) moveGlider(active, 0.7)
    }, [location.pathname])

    useEffect(() => {
        const pill = pillRef.current
        if (!pill || prefersReducedMotion() || isCoarsePointer()) return undefined

        const links = [...pill.querySelectorAll('a, button.st-nav-trigger')]

        const onEnter = (e) => {
            const link = e.target.closest('a, button.st-nav-trigger')
            if (!link) return
            hoveredRef.current = link
            pill.classList.add('is-hovering')
            links.forEach((l) => l.classList.toggle('is-hovered', l === link))
            moveGlider(link, 0.6)
        }
        const onMove = (e) => {
            if (!e.target.closest('a, button.st-nav-trigger')) {
                for (const l of links) {
                    const r = l.getBoundingClientRect()
                    if (e.clientX >= r.left - 8 && e.clientX <= r.right + 8) {
                        if (hoveredRef.current !== l) onEnter({ target: l })
                        return
                    }
                }
            }
        }
        const onLeave = () => {
            hoveredRef.current = null
            pill.classList.remove('is-hovering')
            links.forEach((l) => l.classList.remove('is-hovered'))
            const active = pill.querySelector('a.is-active, button.is-active')
            if (active) moveGlider(active, 0.75)
        }

        pill.addEventListener('mouseenter', onEnter, true)
        pill.addEventListener('mousemove', onMove)
        pill.addEventListener('mouseleave', onLeave)
        return () => {
            pill.removeEventListener('mouseenter', onEnter, true)
            pill.removeEventListener('mousemove', onMove)
            pill.removeEventListener('mouseleave', onLeave)
        }
    }, [])

    /* ---------------- staggered menu entrance ---------------- */
    useEffect(() => {
        if (!menuOpen) return undefined
        if (prefersReducedMotion()) return undefined
        const items = document.querySelectorAll('.st-menu-list a, .st-menu-foot')
        gsap.fromTo(
            items,
            { y: 34, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, stagger: 0.06, ease: 'expo.out', delay: 0.22, clearProps: 'transform' }
        )
        return undefined
    }, [menuOpen])

    const closeMenu = () => setMenuOpen(false)

    return (
        <>
            <div
                data-navbar-root
                ref={navRef}
                className={`st-nav ${scrolled ? 'is-compact' : ''} ${navHidden ? 'is-hidden' : ''}`}
            >
                <span className="st-nav-prog" aria-hidden="true">
                    <i ref={progRef} />
                </span>
                <Link to="/" className="st-nav-brand" aria-label="Optimum">
                    <span className="st-nav-mark" aria-hidden="true" />
                    <b>Optimum</b>
                    <i>School of English</i>
                </Link>

                <nav className="st-nav-pill" ref={pillRef} aria-label="Primary">
                    <span className="st-nav-glider" ref={gliderRef} aria-hidden="true" />

                    <Link to="/" className={isActiveRoute(['/']) ? 'is-active' : ''}>
                        {t('navbar.home', 'Bosh sahifa')}
                    </Link>

                    <div className="relative" ref={aboutRef}>
                        <button
                            type="button"
                            className={`st-nav-trigger ${isActiveRoute(['/about', '/static', '/stats', '/mentor-stats']) ? 'is-active' : ''}`}
                            aria-expanded={aboutDropdownOpen}
                            onClick={() => {
                                setAboutDropdownOpen((v) => !v)
                                setTestsDropdownOpen(false)
                            }}
                        >
                            {t('navbar.about', 'Biz haqimizda')}
                            <FaChevronDown className="st-nav-caret" />
                        </button>

                        <AnimatePresence>
                            {aboutDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96, y: -8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="st-nav-dd"
                                >
                                    <Link to="/about" onClick={() => setAboutDropdownOpen(false)}>
                                        <FaInfoCircle />
                                        <span>{t('navbar.aboutUs', 'Biz haqimizda')}</span>
                                    </Link>
                                    <Link to="/mentor-stats" onClick={() => setAboutDropdownOpen(false)}>
                                        <FaChalkboardTeacher />
                                        <span>{t('navbar.mentors', 'Mentorlar')}</span>
                                    </Link>
                                    <Link to="/stats" onClick={() => setAboutDropdownOpen(false)}>
                                        <FaChartBar />
                                        <span>{t('navbar.statistic', 'Statistika')}</span>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative" ref={testsRef}>
                        <button
                            type="button"
                            className={`st-nav-trigger ${isActiveRoute(['/level-test', '/ielts-writing', '/reading-tests', '/listening-tests', '/games']) ? 'is-active' : ''}`}
                            aria-expanded={testsDropdownOpen}
                            onClick={() => {
                                setTestsDropdownOpen((v) => !v)
                                setAboutDropdownOpen(false)
                            }}
                        >
                            {t('navbar.testAndGames', 'Mock Testlar va O‘yinlar')}
                            <FaChevronDown className="st-nav-caret" />
                        </button>

                        <AnimatePresence>
                            {testsDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.96, y: -8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="st-nav-dd"
                                >
                                    <Link to="/ielts-writing" onClick={() => setTestsDropdownOpen(false)}>
                                        <FaGraduationCap />
                                        <span>{t('navbar.ieltsWriting', 'IELTS Writing')}</span>
                                    </Link>
                                    <Link to="/reading-tests" onClick={() => setTestsDropdownOpen(false)}>
                                        <FaBookOpen />
                                        <span>IELTS Reading</span>
                                    </Link>
                                    <Link to="/listening-tests" onClick={() => setTestsDropdownOpen(false)}>
                                        <FaHeadphones />
                                        <span>IELTS Listening</span>
                                    </Link>
                                    <Link to="/level-test" onClick={() => setTestsDropdownOpen(false)}>
                                        <FaClipboardList />
                                        <span>{t('navbar.levelTest', 'Daraja testi')}</span>
                                    </Link>
                                    <Link to="/games" onClick={() => setTestsDropdownOpen(false)}>
                                        <FaGamepad />
                                        <span>{t('navbar.games', "O'yinlar")}</span>
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link to="/faq" className={isActiveRoute(['/faq']) ? 'is-active' : ''}>
                        {t('navbar.faq', 'FAQ')}
                    </Link>
                </nav>

                <div className="st-nav-right">
                    <div className="hidden md:block">
                        <LanguageSelector currentLang={currentLang} langOpen={langOpen} onToggle={() => setLangOpen((v) => !v)} onSelect={handleLanguageChange} />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.08, rotate: 12 }}
                        whileTap={{ scale: 0.88, rotate: -180 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        onClick={Theme}
                        className="st-nav-icon hidden lg:inline-flex"
                        aria-label="Toggle theme"
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

                    <MagneticButton to="/form" className="st-nav-cta" cursor="Enroll">
                        {t('leadForm.formTitle', 'Bepul dars')}
                        <span className="st-btn-arrow" aria-hidden="true">
                            <FaArrowRight style={{ width: '55%', height: '55%' }} />
                        </span>
                    </MagneticButton>

                    <button
                        type="button"
                        className="st-menu-btn"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={menuOpen}
                    >
                        <i />
                        <i />
                    </button>
                </div>
            </div>

            {/* ---------------- fullscreen menu ---------------- */}
            <div className="st-menu" role="dialog" aria-modal="true" aria-hidden={!menuOpen}>
                <ul className="st-menu-list">
                    {[
                        { to: '/', label: t('navbar.home', 'Bosh sahifa'), n: '01' },
                        { to: '/about', label: t('navbar.about', 'Biz haqimizda'), n: '02' },
                        { to: '/ielts-writing', label: t('navbar.ieltsWriting', 'IELTS Writing'), n: '03' },
                        { to: '/reading-tests', label: 'IELTS Reading', n: '04' },
                        { to: '/listening-tests', label: 'IELTS Listening', n: '05' },
                        { to: '/level-test', label: t('navbar.levelTest', 'Daraja testi'), n: '06' },
                        { to: '/games', label: t('navbar.games', "O'yinlar"), n: '07' },
                        { to: '/faq', label: t('navbar.faq', 'FAQ'), n: '08' },
                    ].map((item) => (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                onClick={closeMenu}
                                className={location.pathname === item.to ? 'is-active' : ''}
                            >
                                <small>{item.n}</small>
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="st-menu-foot">
                    <div className="st-menu-foot-row">
                        <span className="st-mono">{t('footer.contactTitle', 'Aloqa')}</span>
                        <a href="mailto:hello@optimum.uz" className="st-menu-mail">
                            hello@optimum.uz
                        </a>
                    </div>
                    <div className="st-menu-foot-row">
                        <span className="st-mono">Buxoro · O‘zbekiston</span>
                        <div className="st-menu-socials">
                            <a href="https://telegram.me/optimumenglishscape" target="_blank" rel="noopener noreferrer">
                                Telegram
                            </a>
                            <a
                                href="https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw=="
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </a>
                            <a href="https://youtube.com/@optimumschoolofenglish" target="_blank" rel="noopener noreferrer">
                                YouTube
                            </a>
                        </div>
                    </div>
                    <div className="st-menu-foot-row">
                        <LanguageSelector currentLang={currentLang} langOpen={langOpen} onToggle={() => setLangOpen((v) => !v)} onSelect={handleLanguageChange} align="left" large />
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={Theme}
                            className="st-nav-icon"
                            aria-label="Toggle theme"
                        >
                            {dark ? <FaRegSun className="w-4 h-4" /> : <FaRegMoon className="w-4 h-4" />}
                        </motion.button>
                    </div>
                    <Link to="/form" onClick={closeMenu} className="st-btn st-btn-fill" style={{ justifyContent: 'center' }}>
                        {t('leadForm.formTitle', 'Bepul darsga yozilish')}
                        <span className="st-btn-arrow" aria-hidden="true">
                            <FaArrowRight style={{ width: '55%', height: '55%' }} />
                        </span>
                    </Link>
                    <div className="st-menu-foot-row">
                        <Link to="/privacy-policy" onClick={closeMenu} className="st-mono" style={{ color: 'rgba(242,239,233,0.42)' }}>
                            <FaUserShield style={{ verticalAlign: '-2px', marginRight: 6 }} />
                            {t('footer.privacy', 'Maxfiylik')}
                        </Link>
                        <Link to="/terms-of-use" onClick={closeMenu} className="st-mono" style={{ color: 'rgba(242,239,233,0.42)' }}>
                            {t('footer.terms', 'Shartlar')}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
