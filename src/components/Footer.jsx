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
            offset: 100,
        })
    }, [])

    return (
        <footer
            data-aos="fade-up"
            data-aos-duration="600"
            className="bg-gray-950 text-gray-400 py-12 px-6 border-t border-gray-900 mt-10"
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">

                <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white tracking-tight">Optimum</span>
                </div>

                <p className="text-sm max-w-sm leading-relaxed text-gray-400">
                    {t('footer.description')}
                </p>

                <div className="flex gap-4">
                    <a href="https://telegram.me/optimumenglishscape" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 hover:bg-blue-600 hover:text-white transition-all text-xl cursor-pointer shadow-lg">
                        <FaTelegramPlane />
                    </a>
                    <a href="https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 hover:bg-pink-600 hover:text-white transition-all text-xl cursor-pointer shadow-lg">
                        <FaInstagram />
                    </a>
                    <a href="https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-900 hover:bg-red-700 hover:text-white transition-all text-xl cursor-pointer shadow-lg">
                        <FaYoutube />
                    </a>
                </div>

                <div className="pt-6 border-t border-gray-900 w-full text-xs text-gray-500 font-medium">
                    © {new Date().getFullYear()} Optimum School of English. {t('footer.rights')}
                </div>
            </div>
        </footer>
    )
}