import React from 'react'
import { FaFacebookF, FaTelegramPlane, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-400 py-12 px-6 border-t border-gray-900 mt-10">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-8">
                
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white tracking-tight">Optimum</span>
                </div>

                <p className="text-sm max-w-sm leading-relaxed">
                    Kelajagingizni biz bilan birga quring. Zamonaviy kasblar va sifatli ta'lim olib, o'z yo'lingizni toping.
                </p>

                <div className="flex gap-4">
                    <a href="https://telegram.me/optimumenglishscape" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 hover:bg-blue-600 hover:text-white transition-all text-xl">
                        <FaTelegramPlane />
                    </a>
                    <a href="https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 hover:bg-pink-600 hover:text-white transition-all text-xl">
                        <FaInstagram />
                    </a>
                    <a href="https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 hover:bg-red-700 hover:text-white transition-all text-xl">
                        <FaYoutube />
                    </a>
                </div>

                <div className="pt-4 border-t border-gray-900 w-full text-xs opacity-60">
                    © {new Date().getFullYear()} Optimum School of English. Barcha huquqlar kafolatlangan.
                </div>
            </div>
        </footer>
    )
}