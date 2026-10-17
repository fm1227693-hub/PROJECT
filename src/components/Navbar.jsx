import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    FaSun, FaMoon, FaArrowRight, FaChevronDown, FaHome, FaInfoCircle, FaGamepad,
    FaClipboardList, FaChalkboardTeacher, FaChartBar, FaQuestionCircle, FaGraduationCap,
    FaUserShield, FaHeadphones, FaBookOpen, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaTags,
} from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEventEmitter } from '../utils/eventEmitter'
import { useAuth } from '../utils/AuthContext'

/* ───────────────────────── Liquid glass styles ─────────────────────────
   Light + dark tokens live on :root / html.dark, so every glass surface
   (bar, dropdowns, buttons, mobile drawer) follows the theme automatically.
   The glass layer is a SIBLING of the content (not its parent) so that the
   dropdown panels can run their own backdrop-filter and still blur the page. */

const GLASS_CSS = `
:root {
  --lg-a: rgba(255,255,255,.62);
  --lg-b: rgba(255,255,255,.34);
  --lg-tint: rgba(255,255,255,.38);
  --lg-hi: rgba(255,255,255,.95);
  --lg-lo: rgba(0,0,0,.06);
  --lg-edge: rgba(255,255,255,.7);
  --lg-ring: rgba(15,15,30,.08);
  --lg-shadow: rgba(30,30,60,.28);
  --lg-sheen: .55;
  --lg-sheen2: .45;
  --lg-btn: rgba(0,0,0,.05);
  --lg-btn-hover: rgba(0,0,0,.09);
  --lg-btn-edge: rgba(0,0,0,.07);
  --lg-panel: rgba(255,255,255,.76);
  --lg-drawer: rgba(255,255,255,.74);
  --lg-blur: 22px;
  --lg-solid: #fbfbfd;
  --lg-gloss: rgba(255,255,255,.9);
}
html.dark {
  --lg-a: rgba(40,40,50,.5);
  --lg-b: rgba(14,14,20,.32);
  --lg-tint: rgba(0,0,0,.3);
  --lg-hi: rgba(255,255,255,.3);
  --lg-lo: rgba(0,0,0,.4);
  --lg-edge: rgba(255,255,255,.13);
  --lg-ring: rgba(0,0,0,.35);
  --lg-shadow: rgba(0,0,0,.75);
  --lg-sheen: .16;
  --lg-sheen2: .12;
  --lg-btn: rgba(255,255,255,.08);
  --lg-btn-hover: rgba(255,255,255,.16);
  --lg-btn-edge: rgba(255,255,255,.1);
  --lg-panel: rgba(22,22,30,.72);
  --lg-drawer: rgba(10,12,18,.76);
  --lg-solid: #000;
  --lg-gloss: rgba(255,255,255,.1);
}

/* Main bar glass */
.lg-glass {
  z-index: 0;
  background: linear-gradient(135deg, var(--lg-a), var(--lg-b));
  box-shadow:
    inset 0 1px 0 var(--lg-hi),
    inset 0 -1px 0 var(--lg-lo),
    inset 0 0 0 1px var(--lg-edge),
    0 0 0 1px var(--lg-ring),
    0 18px 40px -14px var(--lg-shadow);
}
.lg-glass[data-scrolled='false'] { box-shadow: none; }
.lg-glass[data-scrolled='false']::before, .lg-glass[data-scrolled='false']::after { opacity: 0; }
.lg-glass[data-scrolled='true'] {
  -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(190%);
  backdrop-filter: blur(var(--lg-blur)) saturate(190%);
}
.lg-radius { transition: border-radius .5s cubic-bezier(.16,1,.3,1); }
/* extra tint when the page is scrolled (keeps text readable over content) */
.lg-glass::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  background: var(--lg-tint); opacity: 0; transition: opacity .5s ease; pointer-events: none;
}
.lg-glass[data-scrolled='true']::after { opacity: 1; }
/* water sheen: soft highlight + a light band that glides across on hover */
.lg-glass::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 1;
  background:
    radial-gradient(120% 160% at 10% -20%, rgba(255,255,255,var(--lg-sheen)) 0%, transparent 52%),
    linear-gradient(112deg, transparent 32%, rgba(255,255,255,var(--lg-sheen2)) 50%, transparent 66%);
  background-size: 100% 100%, 240% 100%;
  background-position: 0 0, 100% 0;
  transition: background-position 1.6s cubic-bezier(.16,1,.3,1);
}
@media (hover: hover) { .lg-bar:hover > .lg-glass::before { background-position: 0 0, 0% 0; } }

/* iPhone "island" state: solid, attached to the top edge. Fades into glass on scroll. */
.lg-solid {
  z-index: 1;
  background: var(--lg-solid);
  box-shadow: 0 16px 34px -18px var(--lg-shadow);
  opacity: 1; transition: opacity .45s ease;
}
.lg-solid[data-scrolled='true'] { opacity: 0; }
/* concave ears: melt the bar into the top edge like a notch */
.lg-ear {
  z-index: 1; position: absolute; top: 0; width: 26px; height: 26px; pointer-events: none;
  opacity: 1; transition: opacity .3s ease;
}
.lg-ear[data-scrolled='true'] { opacity: 0; }

/* Dropdown panels */
.lg-panel {
  background: var(--lg-panel);
  -webkit-backdrop-filter: blur(28px) saturate(190%);
  backdrop-filter: blur(28px) saturate(190%);
  box-shadow:
    inset 0 1px 0 var(--lg-hi),
    inset 0 0 0 1px var(--lg-edge),
    0 0 0 1px var(--lg-ring),
    0 28px 60px -16px var(--lg-shadow);
}

/* Round / pill glass buttons */
.lg-btn {
  background: var(--lg-btn);
  box-shadow: inset 0 1px 0 var(--lg-hi), inset 0 0 0 1px var(--lg-btn-edge);
  transition: background-color .2s ease, transform .2s ease, color .2s ease;
}
.lg-btn:hover { background: var(--lg-btn-hover); }

/* Active / hover pills inside the bar */
.lg-pill {
  background: var(--lg-btn);
  box-shadow: inset 0 1px 0 var(--lg-hi), inset 0 0 0 1px var(--lg-btn-edge);
}

/* Red Primary CTA — Matching .ox-cta-primary */
.lg-cta {
  position: relative;
  overflow: hidden;
  color: #ffffff;
  background: linear-gradient(90deg, #E11D48 0%, #F43F5E 50%, #E11D48 100%);
  background-size: 200% auto;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px -4px rgba(225, 29, 72, 0.55), 0 0 14px 0 rgba(244, 63, 94, 0.35);
  transition: all 0.25s ease;
}
.lg-cta::before {
  display: none;
}
.lg-cta:hover {
  background-position: right center;
  box-shadow: 0 12px 28px -2px rgba(225, 29, 72, 0.7), 0 0 20px 2px rgba(244, 63, 94, 0.5);
  transform: translateY(-1px) scale(1.02);
}
.lg-cta:active {
  transform: translateY(0) scale(0.97);
}

/* Mobile drawer */
.lg-drawer {
  background: var(--lg-drawer);
  -webkit-backdrop-filter: blur(30px) saturate(190%);
  backdrop-filter: blur(30px) saturate(190%);
  box-shadow: inset 1px 0 0 var(--lg-edge), -24px 0 60px -20px var(--lg-shadow);
}
.lg-tile {
  background: var(--lg-btn);
  box-shadow: inset 0 1px 0 var(--lg-hi), inset 0 0 0 1px var(--lg-btn-edge);
}

/* Phones: no live blur (it is re-computed every scroll frame on weak GPUs).
   Same glass look, but with denser tint instead of blur. */
@media (max-width: 1023px) {
  .lg-glass, .lg-glass[data-scrolled='true'] {
    -webkit-backdrop-filter: none; backdrop-filter: none;
    background: linear-gradient(135deg, rgba(255,255,255,.9), rgba(246,246,250,.82));
  }
  html.dark .lg-glass, html.dark .lg-glass[data-scrolled='true'] {
    background: linear-gradient(135deg, rgba(36,36,46,.94), rgba(14,14,20,.9));
  }
  .lg-drawer {
    -webkit-backdrop-filter: none; backdrop-filter: none;
    background: rgba(255,255,255,.97);
  }
  html.dark .lg-drawer { background: rgba(10,12,18,.97); }
  .lg-radius { transition: none; }
  .lg-glass::before, .lg-glass::after, .lg-solid, .lg-ear { transition: none; }
  .lg-glass[data-scrolled='true'] {
    box-shadow: inset 0 1px 0 var(--lg-hi), inset 0 0 0 1px var(--lg-edge), 0 6px 16px -8px var(--lg-shadow);
  }
  .lg-solid { box-shadow: 0 6px 16px -8px var(--lg-shadow); }
  .lg-drawer { box-shadow: -10px 0 30px -16px var(--lg-shadow); }
}
/* No backdrop-filter support: use more opaque surfaces */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  :root { --lg-a: rgba(255,255,255,.92); --lg-b: rgba(255,255,255,.86); --lg-panel: rgba(255,255,255,.97); --lg-drawer: rgba(255,255,255,.98); }
  html.dark { --lg-a: rgba(24,24,30,.94); --lg-b: rgba(14,14,20,.9); --lg-panel: rgba(20,20,26,.98); --lg-drawer: rgba(8,10,16,.98); }
}
@media (prefers-reduced-motion: reduce) {
  .lg-glass::before, .lg-glass::after, .lg-btn, .lg-cta { transition: none; }
}
`

/* ───────────────────────── Data ───────────────────────── */

const LANGS = {
    uz: { label: "O'zbekcha", short: 'UZ' },
    ru: { label: 'Русский', short: 'RU' },
    en: { label: 'English', short: 'EN' },
}

const GROUPS = {
    about: {
        key: 'navbar.about', def: 'Biz haqimizda',
        items: [
            { to: '/about', key: 'navbar.aboutUs', def: 'Biz haqimizda', descKey: 'navbar.aboutUsDesc', desc: 'Markazimiz va yondashuvimiz', Icon: FaInfoCircle },
            { to: '/mentor-stats', key: 'navbar.mentors', def: 'Mentorlar', descKey: 'navbar.mentorsDesc', desc: 'Tajribali ustozlar jamoasi', Icon: FaChalkboardTeacher },
            { to: '/stats', key: 'navbar.statistic', def: 'Statistika', descKey: 'navbar.statisticDesc', desc: "O'quvchilar natijalari", Icon: FaChartBar },
        ],
    },
    tests: {
        key: 'navbar.testAndGames', def: "Mock Testlar va O'yinlar",
        items: [
            { to: '/ielts-writing', key: 'navbar.ieltsWriting', def: 'IELTS Writing', descKey: 'navbar.ieltsWritingDesc', desc: 'Insho yozing va baho oling', Icon: FaGraduationCap },
            { to: '/reading-tests', key: 'navbar.ieltsReading', def: 'IELTS Reading', descKey: 'navbar.ieltsReadingDesc', desc: 'Real imtihon formatida', Icon: FaBookOpen },
            { to: '/listening-tests', key: 'navbar.ieltsListening', def: 'IELTS Listening', descKey: 'navbar.ieltsListeningDesc', desc: 'Audio mashqlar va testlar', Icon: FaHeadphones },
            { to: '/games', key: 'navbar.games', def: "O'yinlar", descKey: 'navbar.gamesDesc', desc: "O'ynab o'rganing", Icon: FaGamepad },
        ],
    },
}

const isActivePath = (pathname, to) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/'))
const groupActive = (pathname, group) => group.items.some((i) => isActivePath(pathname, i.to))

const BRAND = 'text-[#c41e30]'
const RED_GRADIENT = 'bg-gradient-to-r from-[#a3182a] via-[#c41e30] to-[#e0314a]'

/* ───────────────────────── Small pieces ───────────────────────── */

function Logo({ onClick }) {
    return (
        <Link to="/" onClick={onClick} className="flex items-center gap-3 shrink-0" aria-label="Optimum">
            <img
                src="/favicon.png"
                alt="Optimum Logo"
                className="w-9 h-9 rounded-[11px] object-cover ring-1 ring-black/10 dark:ring-white/20 shadow-sm"
            />
            <span className="font-extrabold text-[16px] tracking-[0.16em] uppercase font-heading text-gray-900 dark:text-white">
                Optimum
            </span>
        </Link>
    )
}

function ThemeButton({ dark, onToggle, className = '' }) {
    return (
        <button
            onClick={onToggle}
            aria-label="Toggle Dark / Light Theme"
            className={`lg-btn w-10 h-10 grid place-items-center rounded-full active:scale-90 cursor-pointer text-gray-700 dark:text-white/80 ${className}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={dark ? 'sun' : 'moon'}
                    initial={{ rotate: -50, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 50, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.16 }}
                    className="grid place-items-center"
                >
                    {dark ? <FaSun className="w-[15px] h-[15px]" /> : <FaMoon className="w-[14px] h-[14px]" />}
                </motion.span>
            </AnimatePresence>
        </button>
    )
}

const panelMotion = {
    initial: { opacity: 0, y: -8, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.97 },
    transition: { duration: 0.18, ease: 'easeOut' },
}
const PANEL = 'lg-panel absolute top-full mt-3 origin-top rounded-[26px] p-2 z-[110]'

/* ───────────────────────── Desktop navigation ───────────────────────── */

function DesktopNav({ t, pathname, popover, setPopover }) {
    const [hovered, setHovered] = useState(null)

    const base = 'relative z-10 px-3 xl:px-4 py-2 text-[13px] xl:text-[13.5px] font-medium rounded-full whitespace-nowrap transition-colors duration-200 inline-flex items-center gap-1.5 cursor-pointer'
    const tone = (active) =>
        active
            ? 'text-gray-900 dark:text-white font-semibold'
            : 'text-gray-600 hover:text-gray-900 dark:text-white/60 dark:hover:text-white'

    const hoverPill = (id) =>
        hovered === id ? (
            <motion.span
                layoutId="nav-hover"
                className="absolute inset-0 rounded-full bg-black/[0.05] dark:bg-white/10"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
            />
        ) : null

    const activePill = (active) => (active ? <span className="lg-pill absolute inset-0 rounded-full" /> : null)

    const simple = (id, to, label) => {
        const active = isActivePath(pathname, to)
        return (
            <div className="relative" onMouseEnter={() => setHovered(id)}>
                {activePill(active)}
                {hoverPill(id)}
                <Link to={to} className={`${base} ${tone(active)}`}>{label}</Link>
            </div>
        )
    }

    const dropdown = (id) => {
        const group = GROUPS[id]
        const active = groupActive(pathname, group)
        const open = popover === id
        return (
            <div className="relative" data-popover onMouseEnter={() => setHovered(id)}>
                {activePill(active && !open)}
                {hoverPill(id)}
                <button
                    onClick={() => setPopover(open ? null : id)}
                    aria-expanded={open}
                    className={`${base} ${tone(active || open)}`}
                >
                    <span>{t(group.key, group.def)}</span>
                    <FaChevronDown className={`w-2 h-2 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div {...panelMotion} className={`${PANEL} left-0 w-[20rem]`}>
                            {group.items.map(({ to, key, def, descKey, desc, Icon }) => {
                                const itemActive = isActivePath(pathname, to)
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`group flex items-center gap-3 p-2.5 rounded-2xl transition-colors duration-150 ${itemActive ? 'bg-black/[0.06] dark:bg-white/[0.09]' : 'hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'}`}
                                    >
                                        <span className={`w-10 h-10 shrink-0 grid place-items-center rounded-xl transition-colors duration-200 ${itemActive ? 'bg-[#c41e30] text-white' : 'bg-black/[0.06] dark:bg-white/[0.08] text-gray-700 dark:text-white/80 group-hover:bg-[#c41e30] group-hover:text-white'}`}>
                                            <Icon className="w-3.5 h-3.5" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-[13.5px] font-semibold text-gray-900 dark:text-white leading-tight">{t(key, def)}</span>
                                            <span className="block text-[12px] text-gray-500 dark:text-white/50 mt-0.5 truncate">{t(descKey, desc)}</span>
                                        </span>
                                    </Link>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
            {simple('home', '/', t('navbar.home', 'Bosh sahifa'))}
            {dropdown('about')}
            {dropdown('tests')}
            {simple('pricing', '/pricing', t('navbar.pricing', 'Kurslar & Tariflar'))}
            {simple('faq', '/faq', t('navbar.faq', 'FAQ'))}
        </nav>
    )
}

/* ───────────────────────── Main component ───────────────────────── */

export default function Navbar() {
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const { currentUser, logout } = useAuth()
    const pathname = location.pathname

    const [dark, setDark] = useState(() => {
        try {
            const saved = localStorage.getItem('theme')
            return saved === null ? true : saved === 'true'
        } catch {
            return true
        }
    })
    const [menuOpen, setMenuOpen] = useState(false)
    const [popover, setPopover] = useState(null) // 'about' | 'tests' | 'lang' | 'user' | null
    const [scrolled, setScrolled] = useState(false)
    const [navHidden, setNavHidden] = useState(false)

    useEventEmitter('toggle-nav', (payload) => setNavHidden(payload))

    // Theme
    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark)
    }, [dark])

    const toggleTheme = useCallback(() => {
        const next = !dark
        setDark(next)
        try { localStorage.setItem('theme', String(next)) } catch { /* ignore */ }
    }, [dark])

    // Scroll state (only used to deepen the glass tint)
    useEffect(() => {
        let last = window.scrollY > 8
        setScrolled(last)
        const onScroll = () => {
            const now = window.scrollY > 8
            if (now !== last) {
                last = now
                setScrolled(now)
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Click-outside + Escape
    useEffect(() => {
        const onDown = (e) => {
            if (!e.target.closest('[data-popover]')) setPopover(null)
        }
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setPopover(null)
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', onDown)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('mousedown', onDown)
            document.removeEventListener('keydown', onKey)
        }
    }, [])

    // Close everything on navigation
    useEffect(() => {
        setPopover(null)
        setMenuOpen(false)
    }, [pathname])

    // Lock scroll while the mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        document.body.classList.toggle('mobile-menu-open', menuOpen)
        return () => {
            document.body.style.overflow = ''
            document.body.classList.remove('mobile-menu-open')
        }
    }, [menuOpen])

    const currentLang = LANGS[i18n.language] ? i18n.language : LANGS[i18n.language?.split('-')[0]] ? i18n.language.split('-')[0] : 'en'
    const changeLang = (code) => {
        i18n.changeLanguage(code)
        setPopover(null)
    }
    const handleLogout = () => {
        logout()
        setPopover(null)
        setMenuOpen(false)
        navigate('/')
    }
    const closeMenu = () => setMenuOpen(false)

    /* ─── Mobile drawer ─── */
    const list = { hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } } }
    const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } } }

    const mobileLink = (to, label, Icon) => {
        const active = isActivePath(pathname, to)
        return (
            <motion.div variants={item} key={to}>
                <Link
                    to={to}
                    onClick={closeMenu}
                    className={`flex items-center gap-3.5 py-2.5 text-[22px] font-bold tracking-tight transition-colors ${active ? BRAND : 'text-gray-900 dark:text-white active:text-[#c41e30]'}`}
                >
                    <span className={`w-11 h-11 grid place-items-center rounded-2xl ${active ? 'bg-[#c41e30] text-white shadow-[0_8px_18px_-6px_rgba(196,30,48,0.7)]' : 'lg-tile text-gray-600 dark:text-gray-300'}`}>
                        <Icon className="w-4 h-4" />
                    </span>
                    {label}
                </Link>
            </motion.div>
        )
    }

    const mobileGroup = (id) => {
        const group = GROUPS[id]
        return (
            <motion.div variants={item} key={id} className="flex flex-col gap-3">
                <span className="text-[12px] font-semibold text-gray-500 dark:text-gray-400">{t(group.key, group.def)}</span>
                <div className="grid grid-cols-2 gap-2.5">
                    {group.items.map(({ to, key, def, Icon }, i) => {
                        const active = isActivePath(pathname, to)
                        const wide = group.items.length % 2 === 1 && i === group.items.length - 1
                        return (
                            <Link
                                key={to}
                                to={to}
                                onClick={closeMenu}
                                className={`${wide ? 'col-span-2' : ''} flex items-center gap-3 p-3.5 rounded-[20px] transition-transform active:scale-[0.98] ${active ? 'bg-[#c41e30]/[0.12] ring-1 ring-[#c41e30]/35' : 'lg-tile'}`}
                            >
                                <span className={`w-10 h-10 shrink-0 grid place-items-center rounded-xl ${active ? 'bg-[#c41e30] text-white' : 'bg-[#c41e30]/10 text-[#c41e30]'}`}>
                                    <Icon className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-[13.5px] font-semibold text-gray-900 dark:text-white leading-tight">{t(key, def)}</span>
                            </Link>
                        )
                    })}
                </div>
            </motion.div>
        )
    }

    return (
        <>
            <style>{GLASS_CSS}</style>

            {/* ───────────── Liquid glass bar ───────────── */}
            <div
                data-navbar-root
                className={`fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none select-none transition-[transform,opacity] duration-500 ease-out ${navHidden ? '-translate-y-[150%] opacity-0' : 'translate-y-0 opacity-100'}`}
            >
                {/* Moves the bar down when it detaches from the top edge (transform only = cheap) */}
                <div
                    className={`w-full flex justify-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? 'translate-y-3' : 'translate-y-0'}`}
                    style={{ paddingTop: scrolled ? 'env(safe-area-inset-top)' : 0 }}
                >
                <motion.header
                    initial={{ y: -24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    style={{ borderRadius: scrolled ? '32px 32px 32px 32px' : '0px 0px 28px 28px' }}
                    className="lg-bar pointer-events-auto relative h-16 lg:h-[62px] w-[calc(100%-4rem)] lg:w-max lg:max-w-[calc(100vw-4rem)] transform-gpu will-change-transform lg-radius"
                >
                    {/* The glass itself: a sibling layer, so dropdowns can blur the page on their own */}
                    <span aria-hidden data-scrolled={scrolled} className="lg-glass pointer-events-none absolute inset-0" style={{ borderRadius: 'inherit' }} />
                    <span aria-hidden data-scrolled={scrolled} className="lg-solid pointer-events-none absolute inset-0" style={{ borderRadius: 'inherit' }} />
                    <span aria-hidden data-scrolled={scrolled} className="lg-ear -left-[26px]" style={{ background: 'radial-gradient(circle at 0% 100%, transparent 25px, var(--lg-solid) 25.5px)' }} />
                    <span aria-hidden data-scrolled={scrolled} className="lg-ear -right-[26px]" style={{ background: 'radial-gradient(circle at 100% 100%, transparent 25px, var(--lg-solid) 25.5px)' }} />

                    <div className="relative z-10 h-full pl-5 pr-3.5 lg:pl-8 lg:pr-4 flex items-center justify-between lg:justify-start gap-3 lg:gap-5 xl:gap-9">
                        <Logo />

                        <DesktopNav t={t} pathname={pathname} popover={popover} setPopover={setPopover} />

                        <div className="flex items-center gap-1.5 shrink-0">
                            {/* Language (desktop) */}
                            <div className="hidden lg:block relative" data-popover>
                                <button
                                    onClick={() => setPopover(popover === 'lang' ? null : 'lang')}
                                    aria-expanded={popover === 'lang'}
                                    className="lg-btn h-10 pl-3 pr-2.5 inline-flex items-center gap-1.5 rounded-full text-[12px] font-semibold tracking-wider text-gray-700 dark:text-white/80 cursor-pointer"
                                >
                                    {LANGS[currentLang].short}
                                    <FaChevronDown className={`w-2 h-2 opacity-60 transition-transform duration-200 ${popover === 'lang' ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {popover === 'lang' && (
                                        <motion.div {...panelMotion} className={`${PANEL} right-0 w-48`}>
                                            {Object.entries(LANGS).map(([code, { label, short }]) => (
                                                <button
                                                    key={code}
                                                    onClick={() => changeLang(code)}
                                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${currentLang === code ? `${RED_GRADIENT} text-white` : 'text-gray-700 dark:text-white/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-gray-900 dark:hover:text-white'}`}
                                                >
                                                    <span>{label}</span>
                                                    <span className="text-[10px] tracking-wider opacity-70 font-mono">{short}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <ThemeButton dark={dark} onToggle={toggleTheme} className="hidden lg:grid" />

                            {/* User / Login (desktop) */}
                            {currentUser ? (
                                <div className="hidden lg:block relative" data-popover>
                                    <button
                                        onClick={() => setPopover(popover === 'user' ? null : 'user')}
                                        aria-expanded={popover === 'user'}
                                        className="lg-btn h-10 pl-1.5 pr-3 inline-flex items-center gap-2 rounded-full text-[13px] font-semibold text-gray-900 dark:text-white cursor-pointer"
                                    >
                                        <span className={`w-7 h-7 grid place-items-center rounded-full ${RED_GRADIENT} text-white text-[11px]`}>
                                            <FaUser />
                                        </span>
                                        <span className="max-w-[90px] truncate">{currentUser.name?.split(' ')[0]}</span>
                                        <FaChevronDown className={`w-2 h-2 opacity-60 transition-transform duration-200 ${popover === 'user' ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {popover === 'user' && (
                                            <motion.div {...panelMotion} className={`${PANEL} right-0 w-64`}>
                                                <div className="px-3 pt-2 pb-3 mb-1 border-b border-black/[0.08] dark:border-white/[0.08]">
                                                    <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{currentUser.name}</p>
                                                    <p className="text-[11px] text-gray-500 dark:text-white/40 font-mono">@{currentUser.username}</p>
                                                </div>
                                                {currentUser.role === 'admin' ? (
                                                    <Link to="/enter" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[#c41e30] dark:text-[#ff5a6a] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors">
                                                        <FaUserShield className="w-3.5 h-3.5" />
                                                        <span>Admin Panel</span>
                                                    </Link>
                                                ) : (
                                                    <Link to="/student/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-gray-800 dark:text-white/90 hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors">
                                                        <FaGraduationCap className="w-3.5 h-3.5 text-[#c41e30] dark:text-[#ff5a6a]" />
                                                        <span>Mening kabinetim</span>
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                                                >
                                                    <FaSignOutAlt className="w-3.5 h-3.5" />
                                                    <span>Chiqish</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="lg-btn hidden lg:inline-flex h-10 px-3.5 xl:px-4 items-center gap-2 rounded-full text-[13px] font-medium text-gray-700 dark:text-white/80"
                                >
                                    <FaSignInAlt className="w-3 h-3" />
                                    <span className="hidden xl:inline">{t('auth.loginBtn', 'Kirish')}</span>
                                </Link>
                            )}

                            {/* Primary CTA: red liquid-glass button */}
                            <Link
                                to="/access-request"
                                className="lg-cta hidden sm:inline-flex h-10 ml-1 px-5 items-center gap-2 rounded-full text-[13px] font-bold tracking-wide active:scale-95"
                            >
                                <span className="relative">{t('navbar.signUp', 'Sign Up')}</span>
                                <FaArrowRight className="relative w-2.5 h-2.5" />
                            </Link>

                            {/* Hamburger (mobile / tablet) */}
                            <button
                                onClick={() => { setMenuOpen((v) => !v); setPopover(null) }}
                                aria-label="Toggle Navigation Menu"
                                aria-expanded={menuOpen}
                                className="lg-btn lg:hidden w-11 h-11 grid place-items-center rounded-full active:scale-90 cursor-pointer"
                            >
                                <span className="flex flex-col gap-[5px]">
                                    <span className={`block h-[2px] w-[18px] rounded-full bg-gray-900 dark:bg-white transition-transform duration-300 ${menuOpen ? 'translate-y-[3.5px] rotate-45' : ''}`} />
                                    <span className={`block h-[2px] w-[18px] rounded-full bg-gray-900 dark:bg-white transition-transform duration-300 ${menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.header>
                </div>
            </div>

            {/* ───────────── Mobile drawer ───────────── */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={closeMenu}
                            className="lg:hidden fixed inset-0 z-[95] bg-black/40"
                        />

                        <motion.aside
                            key="drawer"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
                            style={{ willChange: 'transform' }}
                            className="lg-drawer lg:hidden fixed inset-y-0 right-0 z-[100] w-full sm:w-[420px] h-dvh flex flex-col select-none overflow-hidden"
                        >
                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(65%_38%_at_100%_0%,rgba(196,30,48,0.18),transparent_70%)] dark:bg-[radial-gradient(65%_38%_at_100%_0%,rgba(196,30,48,0.26),transparent_70%)]" />

                            {/* Top row */}
                            <div className="relative flex items-center justify-between px-5 pb-3 shrink-0" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
                                <Logo onClick={closeMenu} />
                                <div className="flex items-center gap-1.5">
                                    <ThemeButton dark={dark} onToggle={toggleTheme} className="!w-11 !h-11" />
                                    <button
                                        onClick={closeMenu}
                                        aria-label="Close menu"
                                        className="lg-btn w-11 h-11 grid place-items-center rounded-full active:scale-90 cursor-pointer"
                                    >
                                        <span className="relative block w-[18px] h-[18px]">
                                            <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 rounded-full bg-gray-800 dark:bg-white" />
                                            <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 rounded-full bg-gray-800 dark:bg-white" />
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Scrollable content */}
                            <motion.nav
                                variants={list}
                                initial="hidden"
                                animate="show"
                                className="relative flex-1 overflow-y-auto overscroll-contain px-5 pt-3 pb-6 flex flex-col gap-7"
                            >
                                <div className="flex flex-col">
                                    {mobileLink('/', t('navbar.home', 'Bosh sahifa'), FaHome)}
                                    {mobileLink('/pricing', t('navbar.pricing', 'Kurslar & Tariflar'), FaTags)}
                                    {mobileLink('/faq', t('navbar.faq', 'FAQ'), FaQuestionCircle)}
                                </div>

                                {mobileGroup('tests')}
                                {mobileGroup('about')}

                                <motion.div variants={item} className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                                    <Link to="/privacy-policy" onClick={closeMenu} className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 active:text-[#c41e30]">
                                        <FaUserShield className="w-3 h-3 opacity-70" />
                                        {t('footer.privacy', 'Maxfiylik siyosati')}
                                    </Link>
                                    <Link to="/terms-of-use" onClick={closeMenu} className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 dark:text-gray-400 active:text-[#c41e30]">
                                        <FaClipboardList className="w-3 h-3 opacity-70" />
                                        {t('footer.terms', 'Foydalanish shartlari')}
                                    </Link>
                                </motion.div>
                            </motion.nav>

                            {/* Bottom actions */}
                            <div
                                className="relative px-5 pt-4 flex flex-col gap-3 shrink-0 border-t border-black/[0.06] dark:border-white/[0.08]"
                                style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                            >
                                <div className="lg-tile grid grid-cols-3 p-1 rounded-2xl">
                                    {Object.entries(LANGS).map(([code, { short }]) => (
                                        <button
                                            key={code}
                                            onClick={() => i18n.changeLanguage(code)}
                                            className={`h-10 rounded-xl text-[12px] font-bold tracking-wider transition-colors duration-200 cursor-pointer ${currentLang === code ? `${RED_GRADIENT} text-white shadow-md shadow-[#c41e30]/30` : 'text-gray-600 dark:text-gray-300'}`}
                                        >
                                            {short}
                                        </button>
                                    ))}
                                </div>

                                {currentUser ? (
                                    <div className="flex gap-2">
                                        <Link
                                            to={currentUser.role === 'admin' ? '/enter' : '/student/dashboard'}
                                            onClick={closeMenu}
                                            className="lg-tile flex-1 min-w-0 h-[52px] px-3.5 rounded-2xl flex items-center gap-2.5 text-gray-900 dark:text-white"
                                        >
                                            <span className={`w-8 h-8 shrink-0 grid place-items-center rounded-full ${RED_GRADIENT} text-white text-[11px]`}>
                                                <FaUser />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-[13px] font-bold leading-tight truncate">{currentUser.role === 'admin' ? 'Admin Panel' : 'Mening kabinetim'}</span>
                                                <span className="block text-[10px] font-mono text-gray-500 dark:text-gray-400 truncate">@{currentUser.username}</span>
                                            </span>
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            aria-label="Chiqish"
                                            className="w-[52px] h-[52px] shrink-0 grid place-items-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20 text-rose-600 dark:text-rose-400 active:scale-95 transition-transform cursor-pointer"
                                        >
                                            <FaSignOutAlt className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            to="/login"
                                            onClick={closeMenu}
                                            className="lg-tile h-[52px] rounded-2xl flex items-center justify-center gap-2 text-[13px] font-bold text-gray-900 dark:text-white active:scale-[0.98] transition-transform"
                                        >
                                            <FaSignInAlt className="w-3 h-3" />
                                            <span>{t('auth.loginBtn', 'Kirish')}</span>
                                        </Link>
                                        <Link
                                            to="/access-request"
                                            onClick={closeMenu}
                                            className="h-[52px] rounded-2xl bg-[#c41e30]/10 ring-1 ring-[#c41e30]/25 flex items-center justify-center gap-2 text-[13px] font-bold text-[#c41e30] dark:text-red-400 active:scale-[0.98] transition-transform"
                                        >
                                            <FaUserPlus className="w-3 h-3" />
                                            <span>{t('navbar.signUp', 'Sign Up')}</span>
                                        </Link>
                                    </div>
                                )}

                                <Link
                                    to="/form"
                                    onClick={closeMenu}
                                    className="lg-cta h-14 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2.5 active:scale-[0.98]"
                                >
                                    <span className="relative">{t('leadForm.formTitle', 'Bepul darsga yozilish')}</span>
                                    <FaArrowRight className="relative w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}