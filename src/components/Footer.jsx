import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTelegramPlane, FaInstagram } from 'react-icons/fa'

export default function Footer() {
    const [email, setEmail] = useState('')

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (email) {
            alert('Obuna bo\'lganingiz uchun rahmat!')
            setEmail('')
        }
    }

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 font-sans select-none mt-32 border-t border-gray-800 transition-colors duration-200 w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                
                {/* 1-Qism: Asosiy ma'lumot va Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-gray-800">
                    
                    {/* Logo va qisqacha ta'rif */}
                    <div className="lg:col-span-5 flex flex-col space-y-5">
                        <Link to="/" className="flex items-center gap-3">
                            <span className="p-2 bg-blue-600 text-white rounded-xl font-bold text-xl leading-none">EM</span>
                            <span className="text-xl font-black tracking-wider text-white">EDUMARKAZ<span className="text-blue-500">.</span></span>
                        </Link>
                        <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                            Kelajagingizni biz bilan birga quring. Zamonaviy kasblar va sifatli ta'lim olib, o'z yo'lingizni toping.
                        </p>
                      <div className="flex items-center gap-3 pt-2">
    <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm" title="Telegram">
        <FaTelegramPlane />
    </a>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition shadow-sm" title="Instagram">
        <FaInstagram />
    </a>
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition shadow-sm" title="Facebook">
        <FaFacebookF />
    </a>
</div>
                    </div>

                    {/* Tezkor havolalar */}
              

                    {/* Obuna bo'lish qismi (O'zgacha yechim) */}
                
                </div>

                {/* 2-Qism: Copyright va pastki qator */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-10 gap-4 text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} EDUMARKAZ. Barcha huquqlar kafolatlangan.</p>
                    
                </div>

            </div>
        </footer>
    )
}