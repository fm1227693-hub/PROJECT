import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaTelegramPlane, FaInstagram, FaYoutube } from 'react-icons/fa'
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

    return (
        <footer
            data-aos="fade-up"
            data-aos-duration="600"
            className="bg-gray-400 dark:bg-gray-950 text-gray-900 dark:text-gray-400 py-10 sm:py-12 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-800 mt-10 transition-colors duration-200"
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">

                <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">Optimum</span>
                </div>

                <p className="text-xs sm:text-sm max-w-sm leading-relaxed text-gray-900 dark:text-gray-400 px-2 sm:px-0">
                    {t('footer.description')}
                </p>

                <div className="flex gap-3 sm:gap-4">
                    <a href="https://telegram.me/optimumenglishscape" target="_blank" rel="noopener noreferrer" className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all text-lg sm:text-xl cursor-pointer shadow-lg active:scale-95">
                        <FaTelegramPlane />
                    </a>
                    <a href="https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==" target="_blank" rel="noopener noreferrer" className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white transition-all text-lg sm:text-xl cursor-pointer shadow-lg active:scale-95">
                        <FaInstagram />
                    </a>
                    <a href="https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu" target="_blank" rel="noopener noreferrer" className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:text-white transition-all text-lg sm:text-xl cursor-pointer shadow-lg active:scale-95">
                        <FaYoutube />
                    </a>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-900/80 w-full text-[11px] sm:text-xs text-gray-400 dark:text-gray-500 font-medium">
                    © {new Date().getFullYear()} Optimum School of English. {t('footer.rights')}
                </div>
            </div>
        </footer>
    )
}