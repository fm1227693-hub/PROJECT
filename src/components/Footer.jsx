import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
            offset: 50, // Kamroq ofset mobil uchun
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

    // Yordamchi komponent takrorlanmasligi uchun
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
            {/* Asosiy kontent: Mobil uchun flex-col, Desktop uchun grid */}
            <div className="relative max-w-6xl mx-auto flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-10 text-left">

                {/* 1. Brend va tavsif (Mobil: chapda) */}
                <div className="flex flex-col items-start gap-3 pb-6 border-b border-gray-100 dark:border-gray-800 sm:border-none sm:pb-0">
                    <span className="text-3xl font-black text-gray-950 dark:text-white tracking-tighter">
                        Optimum
                    </span>
                    <p className="text-sm leading-relaxed max-w-sm text-gray-600 dark:text-gray-400">
                        {t(
                            'footer.description',
                            'Kelajagingizni biz bilan birga quring. Zamonaviy kasblarni egallang va sifatli taʼlim oling.'
                        )}
                    </p>
                    {/* Ikonkalar (kichikroq va rangli) */}
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

                {/* 2. Tezkor havolalar */}
                <FooterSection title={t('footer.quickLinks', 'Tezkor havolalar')}>
                    {quickLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-1"
                        >
                            {link.label}
                        </a>
                    ))}
                </FooterSection>

                {/* 3. Aloqa maʼlumotlari (Yangi, ixcham dizayn) */}
                <FooterSection title={t('footer.contactTitle', 'Aloqa')}>
                    <div className="flex items-start gap-3 group">
                        <FaMapMarkerAlt className="mt-1 text-blue-600 dark:text-blue-400 shrink-0 text-sm" />
                        <span className="text-sm leading-snug">
                            {t('footer.address', 'Buxoro shahar, Buxoro viloyati')}
                        </span>
                    </div>
                    <a
                        href="tel:+998900000000"
                        className="flex items-center gap-3 group hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <FaPhoneAlt className="text-blue-600 dark:text-blue-400 shrink-0 text-xs" />
                        <span className="text-sm font-medium tracking-wide">+998 90 000 00 00</span>
                    </a>
                </FooterSection>

                {/* 4. Ish vaqti */}
                <FooterSection title={t('footer.hoursTitle', 'Ish vaqti')} noBorder>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 sm:bg-transparent sm:p-0 sm:border-none">
                        <FaClock className="text-blue-600 dark:text-blue-400 shrink-0 text-sm" />
                        <div className="flex flex-col sm:flex-row sm:gap-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('footer.everyday', 'Har kuni')}
                            </span>
                            <span className="text-sm font-bold text-gray-950 dark:text-white">
                                08:00 – 20:00
                            </span>
                        </div>
                    </div>
                </FooterSection>

            </div>

            {/* Pastki qism (Divider bilan) */}
            <div className="relative max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-600 font-medium">
                
                <span>
                    © {new Date().getFullYear()} Optimum School of English.
                </span>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2">
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