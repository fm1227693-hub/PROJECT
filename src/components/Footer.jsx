import React, { useEffect, useState } from 'react'
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
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

export default function Footer() {
    const { t } = useTranslation()
    const [activeModal, setActiveModal] = useState(null) // 'privacy' | 'terms' | null
    const location = useLocation()

    

    const quickLinks = [
        { label: t('footer.links.home'), to: '/' },
        { label: t('footer.links.about'), to: '/about' },
        { label: t('footer.links.levelTest'), to: '/level-test' },
        { label: t('footer.links.ieltsPractice'), to: '/ielts-practice' },
    ]

    const socials = [
        {
            icon: <FaTelegramPlane />,
            href: 'https://telegram.me/optimumenglishscape',
            label: 'Telegram',
            color: 'hover:text-sky-500',
        },
        {
            icon: <FaInstagram />,
            href: 'https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==',
            label: 'Instagram',
            color: 'hover:text-pink-500',
        },
        {
            icon: <FaYoutube />,
            href: 'https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu',
            label: 'YouTube',
            color: 'hover:text-red-600',
        },
    ]

    const FooterSection = ({ title, children, noBorder }) => (
        <div className={`pb-6 ${noBorder ? '' : 'border-b border-gray-100 dark:border-gray-800'} sm:border-none sm:pb-0`}>
            <h4 className="text-sm font-extrabold text-gray-950 dark:text-white uppercase tracking-wider mb-4 px-1 sm:px-0">
                {title}
            </h4>
            <div className="flex flex-col gap-3 px-1 sm:px-0">
                {children}
            </div>
        </div>
    )

    return (
        <footer
            data-aos="fade-up"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className={`relative text-gray-600 dark:text-gray-400 pt-14 pb-8 px-5 border-t border-slate-200/60 dark:border-white/10 ${location.pathname === '/enter' ? '' : 'mt-16'} transition-colors duration-300 bg-white/75 dark:bg-[#030712]/80 backdrop-blur-2xl overflow-hidden z-10`}
        >
            {/* Ambient Footer Glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />

            <div className="relative max-w-6xl mx-auto flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-10 text-left">

                {/* 1. Brend va tavsif */}
                <div className="flex flex-col items-start gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 sm:border-none sm:pb-0">
                    <span className="text-3xl font-black text-gray-950 dark:text-white tracking-tighter">
                        Optimum
                    </span>
                    <p className="text-sm leading-relaxed max-w-sm text-gray-600 dark:text-gray-400">
                        {t('footer.description')}
                    </p>
                    <div className="flex gap-5 mt-2 text-gray-400 dark:text-gray-500">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className={`text-2xl transition-colors ${s.color} active:scale-95`}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* 2. Tezkor havolalar (4 ta) */}
                <FooterSection title={t('footer.quickLinks')}>
                    {quickLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-sm hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium py-1"
                        >
                            {link.label}
                        </Link>
                    ))}
                </FooterSection>

                {/* 3. Aloqa maʼlumotlari */}
                <FooterSection title={t('footer.contactTitle')}>
                    <div className="flex items-start gap-3 group">
                        <FaMapMarkerAlt className="mt-1 text-red-600 dark:text-red-400 shrink-0 text-sm" />
                        <span className="text-sm leading-snug">
                            {t('footer.address')}
                        </span>
                    </div>
                    <a
                        href="tel:+998900829979"
                        className="flex items-center gap-3 group hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                        <FaPhoneAlt className="text-red-600 dark:text-red-400 shrink-0 text-xs" />
                        <span className="text-sm font-medium tracking-wide">+998 90 082 99 79</span>
                    </a>
                </FooterSection>

                {/* 4. Ish vaqti */}
                <FooterSection title={t('footer.hoursTitle')} noBorder>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 sm:bg-transparent sm:p-0 sm:border-none">
                        <FaClock className="text-red-600 dark:text-red-400 shrink-0 text-sm" />
                        <div className="flex flex-col sm:flex-row sm:gap-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('footer.everyday')}
                            </span>
                            <span className="text-sm font-bold text-gray-950 dark:text-white">
                                08:00 – 20:00
                            </span>
                        </div>
                    </div>
                </FooterSection>

            </div>

            {/* Pastki qism */}
            <div className="relative max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-600 font-medium">
                <span>
                    © {new Date().getFullYear()} Optimum School of English.
                </span>

                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <Link
                        to="/privacy-policy"
                        className="hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs font-medium"
                    >
                        {t('footer.privacy')}
                    </Link>
                    <Link
                        to="/terms-of-use"
                        className="hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs font-medium"
                    >
                        {t('footer.terms')}
                    </Link>
                </div>
            </div>

            {/* Privacy & Terms Modals */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between gap-6"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setActiveModal(null)}
                                className="absolute top-5 right-5 w-9 h-9 rounded-2xl bg-gray-100 dark:bg-gray-900 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center justify-center text-sm font-bold transition-all hover:scale-105 cursor-pointer"
                            >
                                <FaTimes />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-center text-xl shadow-lg shadow-red-600/30 shrink-0">
                                    {activeModal === 'privacy' ? <FaShieldAlt /> : <FaFileContract />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-950 dark:text-white tracking-tight">
                                        {activeModal === 'privacy' ? t('footer.privacyModal.title') : t('footer.termsModal.title')}
                                    </h3>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                                        {activeModal === 'privacy' ? t('footer.privacyModal.subtitle') : t('footer.termsModal.subtitle')}
                                    </p>
                                </div>
                            </div>

                            {/* Body Content */}
                            <div className="space-y-5 text-left text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                {activeModal === 'privacy' ? (
                                    <>
                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.privacyModal.sec1Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.privacyModal.sec1Desc')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.privacyModal.sec2Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.privacyModal.sec2Desc')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.privacyModal.sec3Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.privacyModal.sec3Desc')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.privacyModal.sec4Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.privacyModal.sec4Desc')}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.termsModal.sec1Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.termsModal.sec1Desc')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.termsModal.sec2Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.termsModal.sec2Desc')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.termsModal.sec3Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.termsModal.sec3Desc')}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/60 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/80">
                                            <h4 className="font-extrabold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                                <FaCheckCircle className="text-red-500 text-xs shrink-0" />
                                                {t('footer.termsModal.sec4Title')}
                                            </h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {t('footer.termsModal.sec4Desc')}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Footer Action */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 hover:scale-105 transition cursor-pointer"
                                >
                                    {activeModal === 'privacy' ? t('footer.privacyModal.closeBtn') : t('footer.termsModal.closeBtn')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </footer>
    )
}