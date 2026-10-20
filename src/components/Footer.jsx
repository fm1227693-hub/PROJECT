import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import {
    FaTelegramPlane,
    FaInstagram,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaClock,
    FaShieldAlt,
    FaFileContract,
    FaTimes,
    FaCheckCircle,
    FaArrowRight
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer() {
    const { t } = useTranslation()
    const [activeModal, setActiveModal] = useState(null)
    const location = useLocation()

    const quickLinks = [
        { label: t('footer.links.home', 'Bosh sahifa'), to: '/' },
        { label: t('footer.links.about', 'Biz haqimizda'), to: '/about' },
        { label: t('footer.links.levelTest', 'Daraja testi'), to: '/level-test' },
        { label: t('navbar.ieltsWriting', 'IELTS Writing'), to: '/ielts-writing' },
        { label: t('navbar.ieltsReading', 'Reading Tests'), to: '/reading-tests' },
        { label: t('navbar.ieltsListening', 'Listening Tests'), to: '/listening-tests' },
        { label: t('pricing.filterAll', 'Tariflar'), to: '/pricing' },
        { label: t('navbar.faq', 'FAQ'), to: '/faq' },
    ]

    const socials = [
        {
            icon: <FaTelegramPlane />,
            href: 'https://telegram.me/optimumenglishscape',
            label: 'Telegram',
            color: 'hover:text-sky-500 hover:border-sky-500/40',
        },
        {
            icon: <FaInstagram />,
            href: 'https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==',
            label: 'Instagram',
            color: 'hover:text-pink-500 hover:border-pink-500/40',
        },
        {
            icon: <FaYoutube />,
            href: 'https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu',
            label: 'YouTube',
            color: 'hover:text-red-600 hover:border-red-600/40',
        },
    ]

    return (
        <footer
            className={`relative text-slate-600 dark:text-slate-400 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-black/[0.08] dark:border-white/[0.08] ${
                location.pathname === '/enter' ? '' : 'mt-20'
            } transition-colors duration-300 bg-white/80 dark:bg-[#080909]/95 backdrop-blur-2xl z-10`}
        >
            {/* Ambient Brand Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/[0.06] rounded-full blur-3xl -z-10" />

            <div className="max-w-7xl mx-auto">
                
                {/* Top Section: Brand + Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-200 dark:border-white/10">
                    
                    {/* Brand Col */}
                    <div className="lg:col-span-5 flex flex-col space-y-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img
                                src="/favicon.png"
                                alt="Optimum Logo"
                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-black/10 dark:ring-white/20 shadow-xs"
                            />
                            <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wider font-heading">
                                OPTIMUM ELC
                            </span>
                        </Link>

                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm font-normal">
                            {t('footer.description', "Optimum School of English — professional ta'lim, xalqaro tajriba va Cambridge standartlari asosida IELTS 7.5+ ga erishtiruvchi o'quv maskani.")}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-base text-slate-700 dark:text-slate-300 transition-all hover:scale-105 ${s.color}`}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Col */}
                    <div className="lg:col-span-4 flex flex-col space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white font-heading">
                            {t('footer.quickLinks', 'Tezkor havolalar')}
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Contact Col */}
                    <div className="lg:col-span-3 flex flex-col space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white font-heading">
                            {t('footer.contactTitle', 'Bog‘lanish')}
                        </h4>
                        <div className="space-y-3">
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <FaMapMarkerAlt className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                <span>{t('footer.address', 'Buxoro sh., Namozgoh ko‘chasi, Premier School')}</span>
                            </a>

                            <a
                                href="tel:+998900829979"
                                className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <FaPhoneAlt className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                                <span>+998 90 082 99 79</span>
                            </a>

                            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                                <FaClock className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                                <span>{t('footer.everyday', 'Har kuni')}: 08:00 – 20:00</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright & Legal */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
                    <p>© {new Date().getFullYear()} Optimum English Language Center. {t('footer.allRightsReserved', 'Barcha huquqlar himoyalangan.')}</p>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy-policy" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            {t('footer.privacy', 'Maxfiylik siyosati')}
                        </Link>
                        <Link to="/terms-of-use" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            {t('footer.terms', 'Foydalanish shartlari')}
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}