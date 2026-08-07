import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
    FaTelegramPlane,
    FaInstagram,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaClock,
} from 'react-icons/fa'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Footer() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 50,
        })
    }, [])

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
            className="relative text-gray-600 dark:text-gray-400 pt-12 pb-6 px-5 border-t border-gray-100 dark:border-gray-800 mt-10 transition-colors duration-200 bg-white dark:bg-gray-950"
        >
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
                    <a href="#privacy" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        {t('footer.privacy')}
                    </a>
                    <a href="#terms" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        {t('footer.terms')}
                    </a>
                </div>
            </div>
        </footer>
    )
}