import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
    } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './premium/studioEnv'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
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

const PRIVACY = [
    ['footer.privacyModal.sec1Title', 'footer.privacyModal.sec1Desc'],
    ['footer.privacyModal.sec2Title', 'footer.privacyModal.sec2Desc'],
    ['footer.privacyModal.sec3Title', 'footer.privacyModal.sec3Desc'],
    ['footer.privacyModal.sec4Title', 'footer.privacyModal.sec4Desc'],
]

const TERMS = [
    ['footer.termsModal.sec1Title', 'footer.termsModal.sec1Desc'],
    ['footer.termsModal.sec2Title', 'footer.termsModal.sec2Desc'],
    ['footer.termsModal.sec3Title', 'footer.termsModal.sec3Desc'],
    ['footer.termsModal.sec4Title', 'footer.termsModal.sec4Desc'],
]

export default function Footer() {
    const { t } = useTranslation()
    const [activeModal, setActiveModal] = useState(null)
    const giantRef = useRef(null)

    /* the wordmark rises out of its mask when the footer arrives */
    useEffect(() => {
        const giant = giantRef.current
        if (!giant) return undefined
        const letters = [...giant.querySelectorAll('span')]
        if (!letters.length) return undefined

        if (prefersReducedMotion()) return undefined

        const trigger = ScrollTrigger.create({
            trigger: giant,
            start: 'top 92%',
            once: true,
            onEnter: () =>
                gsap.fromTo(
                    letters,
                    { yPercent: 108, opacity: 0 },
                    { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.055, ease: 'expo.out' }
                ),
        })
        return () => trigger.kill()
    }, [])

    const quickLinks = [
        { label: t('footer.links.home'), to: '/' },
        { label: t('footer.links.about'), to: '/about' },
        { label: t('footer.links.levelTest'), to: '/level-test' },
        { label: t('footer.links.ieltsPractice'), to: '/ielts-writing' },
    ]

    const sections = activeModal === 'privacy' ? PRIVACY : TERMS

    return (
        <footer className="st-footer">
            <div className="st-shell">
                <div className="st-footer-cols">
                    <div className="st-footer-brand-col">
                        <span className="st-footer-brand">Optimum</span>
                        <p className="st-footer-desc">{t('footer.description', 'Kelajagingizni biz bilan birga quring.')}</p>
                        <div className="st-footer-socials">
                            {SOCIALS.map((s) => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h5>{t('footer.quickLinks', 'Tezkor havolalar')}</h5>
                        <div className="st-footer-links">
                            {quickLinks.map((l) => (
                                <Link key={l.to} to={l.to}>
                                    {l.label}
                                </Link>
                            ))}
                            <Link to="/faq">FAQ</Link>
                        </div>
                    </div>

                    <div>
                        <h5>{t('footer.contactTitle', 'Aloqa')}</h5>
                        <div className="st-footer-contact">
                            <a href="mailto:hello@optimum.uz">
                                <FaMapMarkerAlt style={{ display: 'none' }} />
                                hello@optimum.uz
                            </a>
                            <a href="tel:+998900829979">
                                <FaPhoneAlt />
                                +998 90 082 99 79
                            </a>
                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaMapMarkerAlt />
                                {t('footer.address', 'Buxoro sh., Namozgoh ko‘chasi')}
                            </a>
                        </div>
                    </div>

                    <div>
                        <h5>{t('footer.hoursTitle', 'Ish vaqti')}</h5>
                        <div className="st-footer-contact">
                            <span className="st-footer-hours">
                                <FaClock />
                                {t('footer.everyday', 'Har kuni')} · 08:00 – 20:00
                            </span>
                            <Link to="/form" className="st-footer-cta-link">
                                {t('leadForm.formTitle', 'Bepul darsga yozilish')}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="st-footer-giant" ref={giantRef} aria-hidden="true">
                    {'OPTIMUM'.split('').map((ch, i) => (
                        <span key={i}>{ch}</span>
                    ))}
                </div>

                <div className="st-footer-bottom">
                    <span className="st-mono">© {new Date().getFullYear()} Optimum School of English.</span>
                    <span className="st-mono">Real-time learning · CDI · AI assessment</span>
                    <span className="st-mono st-footer-legal">
                        <button type="button" onClick={() => setActiveModal('privacy')}>
                            {t('footer.privacy', 'Maxfiylik siyosati')}
                        </button>
                        <button type="button" onClick={() => setActiveModal('terms')}>
                            {t('footer.terms', 'Foydalanish shartlari')}
                        </button>
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {activeModal && (
                    <div className="st-footer-modal" onClick={() => setActiveModal(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 18 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 18 }}
                            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                            className="st-footer-modal-card"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="st-footer-modal-close" onClick={() => setActiveModal(null)} aria-label="Close">
                                <FaTimes />
                            </button>
                            <span className="st-footer-modal-ic">
                                {activeModal === 'privacy' ? <FaShieldAlt /> : <FaFileContract />}
                            </span>
                            <h3>
                                {activeModal === 'privacy'
                                    ? t('footer.privacyModal.title', 'Maxfiylik Siyosati')
                                    : t('footer.termsModal.title', 'Foydalanish Shartlari')}
                            </h3>
                            <p>
                                {activeModal === 'privacy'
                                    ? t('footer.privacyModal.subtitle', '')
                                    : t('footer.termsModal.subtitle', '')}
                            </p>
                            {sections.map(([titleKey, descKey]) => (
                                <div key={titleKey}>
                                    <h4>{t(titleKey)}</h4>
                                    <p>{t(descKey)}</p>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="st-btn st-btn-fill st-btn-sweep"
                                style={{ marginTop: 26 }}
                                onClick={() => setActiveModal(null)}
                            >
                                {activeModal === 'privacy'
                                    ? t('footer.privacyModal.closeBtn', 'Yopish')
                                    : t('footer.termsModal.closeBtn', 'Tushundim')}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </footer>
    )
}
