import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    FaTelegramPlane,
    FaInstagram,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhoneAlt,
} from 'react-icons/fa'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Footer() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 80,
        })
    }, [])

    const quickLinks = [
        { label: t('footer.links.home', 'Bosh sahifa'), href: '#home' },
        { label: t('footer.links.courses', 'Kurslar'), href: '#courses' },
        { label: t('footer.links.about', 'Biz haqimizda'), href: '#about' },
        { label: t('footer.links.contact', 'Aloqa'), href: '#contact' },
    ]

    const socials = [
        {
            icon: <FaTelegramPlane />,
            href: 'https://telegram.me/optimumenglishscape',
            label: 'Telegram',
            hover: 'hover:bg-blue-600 dark:hover:bg-blue-600',
        },
        {
            icon: <FaInstagram />,
            href: 'https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==',
            label: 'Instagram',
            hover: 'hover:bg-pink-600 dark:hover:bg-pink-600',
        },
        {
            icon: <FaYoutube />,
            href: 'https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu',
            label: 'YouTube',
            hover: 'hover:bg-red-700 dark:hover:bg-red-700',
        },
    ]

    return (
        <footer
            data-aos="fade-up"
            data-aos-duration="600"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="relative text-gray-700 dark:text-gray-400 pt-14 sm:pt-16 pb-8 px-4 sm:px-6 border-t border-gray-200/80 dark:border-gray-800/80 mt-10 transition-colors duration-200 overflow-hidden bg-white/50 dark:bg-gray-950/50 backdrop-blur-md"
        >
            {/* Fon uchun dekorativ blur doira */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-pink-500/10 dark:bg-pink-500/10 rounded-full blur-3xl" />

            <div className="relative max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 text-center sm:text-left">

                {/* Brend va tavsif */}
                <div className="flex flex-col items-center sm:items-start gap-4">
                    <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                        Optimum
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-gray-500 dark:text-gray-400">
                        {t(
                            'footer.description',
                            'Optimum — ingliz tilini chuqur va samarali oʻrgatuvchi zamonaviy til markazi. Bilim, tajriba va natija — bizning ustuvorligimiz.'
                        )}
                    </p>
                    <div className="flex gap-3">
                        {socials.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.label}
                                className={`w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 ${s.hover} hover:text-white hover:border-transparent transition-all text-lg shadow-sm hover:shadow-lg active:scale-95`}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Tezkor havolalar */}
                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                        {t('footer.quickLinks', 'Tezkor havolalar')}
                    </h4>
                    {quickLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-gray-500 dark:text-gray-400"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Aloqa maʼlumotlari */}
                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                        {t('footer.contactTitle', 'Aloqa')}
                    </h4>
                    <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="mt-0.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{t('footer.address', 'Qarshi shahar, Qashqadaryo viloyati')}</span>
                    </div>
                    <a
                        href="tel:+998900000000"
                        className="flex items-center gap-2 text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <FaPhoneAlt className="text-blue-600 dark:text-blue-400 shrink-0" />
                        +998 90 000 00 00
                    </a>
                </div>

                {/* Ish vaqti */}
                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">
                        {t('footer.hoursTitle', 'Ish vaqti')}
                    </h4>
                    <div className="text-xs sm:text-sm space-y-1.5 w-full text-gray-500 dark:text-gray-400">
                        <div className="flex justify-between sm:justify-start sm:gap-6 w-full">
                            <span>{t('footer.weekdays', 'Dushanba – Shanba')}</span>
                            <span className="font-bold text-gray-900 dark:text-white">08:00 – 20:00</span>
                        </div>
                        <div className="flex justify-between sm:justify-start sm:gap-6 w-full">
                            <span>{t('footer.sunday', 'Yakshanba')}</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {t('footer.closed', 'Dam olish kuni')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pastki qism */}
            <div className="relative max-w-6xl mx-auto mt-10 pt-6 border-t border-gray-200 dark:border-gray-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium">
                <span>
                    © {new Date().getFullYear()} Optimum School of English. {t('footer.rights', 'Barcha huquqlar himoyalangan.')}
                </span>
                <div className="flex gap-4">
                    <a href="#privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {t('footer.privacy', 'Maxfiylik siyosati')}
                    </a>
                    <a href="#terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {t('footer.terms', 'Foydalanish shartlari')}
                    </a>
                </div>
            </div>
        </footer>
    )
}