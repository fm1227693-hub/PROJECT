import {useState} from 'react'
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
        },
        {
            icon: <FaInstagram />,
            href: 'https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==',
            label: 'Instagram',
        },
        {
            icon: <FaYoutube />,
            href: 'https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu',
            label: 'YouTube',
        },
    ]

    return (
        <footer className={`relative bg-raised border-t border-line ${location.pathname === '/enter' ? '' : ''} overflow-hidden z-10`}>
            <div className="container-site pt-16 pb-8">
                {/* Yuqori qism */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    {/* 1. Brend */}
                    <div className="lg:col-span-4 flex flex-col items-start gap-5">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img
                                src="/favicon.png"
                                alt="Optimum logo"
                                width={38}
                                height={38}
                                loading="lazy"
                                className="w-[38px] h-[38px] rounded-xl object-cover ring-1 ring-line"
                            />
                            <span className="flex flex-col leading-none">
                                <span className="font-display text-[26px] font-semibold text-ink">Optimum</span>
                                <span className="text-[8.5px] font-bold tracking-[0.3em] uppercase text-muted mt-1">
                                    School of English
                                </span>
                            </span>
                        </Link>
                        <p className="text-[13.5px] leading-relaxed max-w-[36ch] text-muted">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-2.5">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="w-10 h-10 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink hover:border-linestrong hover:-translate-y-0.5 transition-all duration-300 text-[15px]"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 2. Tezkor havolalar */}
                    <div className="lg:col-span-3">
                        <h4 className="meta-label mb-5">{t('footer.quickLinks')}</h4>
                        <div className="flex flex-col gap-3">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="group inline-flex items-center gap-2 text-[13.5px] font-medium text-soft hover:text-accent transition-colors w-fit"
                                >
                                    <FaArrowRight className="w-2 h-2 opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* 3. Aloqa */}
                    <div className="lg:col-span-3">
                        <h4 className="meta-label mb-5">{t('footer.contactTitle')}</h4>
                        <div className="flex flex-col gap-4">
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-3 hover:text-accent transition-colors"
                            >
                                <FaMapMarkerAlt className="mt-0.5 text-accent shrink-0 text-[13px]" />
                                <span className="text-[13.5px] leading-snug text-soft group-hover:text-accent transition-colors">
                                    {t('footer.address')}
                                </span>
                            </a>
                            <a
                                href="tel:+998900829979"
                                className="flex items-center gap-3 group"
                            >
                                <FaPhoneAlt className="text-accent shrink-0 text-[11px]" />
                                <span className="text-[13.5px] font-semibold tracking-wide text-soft group-hover:text-accent transition-colors">
                                    +998 90 082 99 79
                                </span>
                            </a>
                            <div className="flex items-center gap-3">
                                <FaClock className="text-accent shrink-0 text-[12px]" />
                                <div className="flex flex-col">
                                    <span className="text-[12.5px] text-muted">{t('footer.everyday')}</span>
                                    <span className="text-[13.5px] font-semibold text-ink">08:00 – 20:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. CTA */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        <h4 className="meta-label">{t('footer.ctaLabel', 'Boshlash')}</h4>
                        <p className="font-display text-[19px] leading-snug text-ink max-w-[20ch]">
                            {t('footer.ctaText', 'Birinchi dars bepul.')}
                        </p>
                        <Link to="/form" className="btn btn-primary !px-5 !py-[11px] text-[12.5px] w-fit">
                            {t('leadForm.formTitle', 'Bepul darsga yozilish')}
                        </Link>
                    </div>
                </div>

                {/* Pastki qism */}
                <div className="mt-14 pt-6 border-t border-line flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-muted">
                    <span>
                        © {new Date().getFullYear()} Optimum School of English.
                    </span>

                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <Link
                            to="/privacy-policy"
                            className="hover:text-accent transition-colors font-medium"
                        >
                            {t('footer.privacy')}
                        </Link>
                        <Link
                            to="/terms-of-use"
                            className="hover:text-accent transition-colors font-medium"
                        >
                            {t('footer.terms')}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Privacy & Terms Modals */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 24, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 24, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="relative w-full max-w-2xl max-h-[85vh] bg-surface border border-line rounded-[18px] p-6 sm:p-8 shadow-[var(--shadow-lift)] overflow-y-auto flex flex-col justify-between gap-6"
                        >
                            <button
                                onClick={() => setActiveModal(null)}
                                aria-label={t('common.close', 'Yopish')}
                                className="absolute top-5 right-5 w-9 h-9 rounded-full border border-line text-muted hover:text-ink hover:border-linestrong flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <FaTimes className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex items-center gap-4 border-b border-line pb-5">
                                <div className="w-11 h-11 rounded-[14px] bg-accent text-white flex items-center justify-center text-[17px] shrink-0">
                                    {activeModal === 'privacy' ? <FaShieldAlt /> : <FaFileContract />}
                                </div>
                                <div>
                                    <h3 className="font-display text-[24px] font-semibold text-ink">
                                        {activeModal === 'privacy' ? t('footer.privacyModal.title') : t('footer.termsModal.title')}
                                    </h3>
                                    <p className="text-[12px] text-muted mt-1">
                                        {activeModal === 'privacy' ? t('footer.privacyModal.subtitle') : t('footer.termsModal.subtitle')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-left text-[13.5px] leading-relaxed text-soft">
                                {(activeModal === 'privacy'
                                    ? [1, 2, 3, 4].map((n) => ({ title: t(`footer.privacyModal.sec${n}Title`), desc: t(`footer.privacyModal.sec${n}Desc`) }))
                                    : [1, 2, 3, 4].map((n) => ({ title: t(`footer.termsModal.sec${n}Title`), desc: t(`footer.termsModal.sec${n}Desc`) }))
                                ).map((sec, i) => (
                                    <div key={i} className="bg-raised p-4 rounded-[14px] border border-line">
                                        <h4 className="font-bold text-ink mb-1 flex items-center gap-2 text-[13.5px]">
                                            <FaCheckCircle className="text-accent text-[11px] shrink-0" />
                                            {sec.title}
                                        </h4>
                                        <p className="text-[12.5px] text-muted">{sec.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-line flex justify-end">
                                <button
                                    onClick={() => setActiveModal(null)}
                                    className="btn btn-primary !px-6 !py-3 text-[12.5px]"
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
