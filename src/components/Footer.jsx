import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTelegramPlane, FaInstagram } from 'react-icons/fa'

export default function Footer() {

   

    return (
        <footer className="bg-slate-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300 font-sans select-none mt-32 border-t border-slate-200/85 dark:border-gray-800/80 transition-colors duration-200 w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">

                {/* Asosiy qism */}
                <div className="flex justify-center md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-gray-800/80">

                    {/* Logo va qisqacha ta'rif */}
                    <div className="lg:col-span-5 flex flex-col space-y-4">
                        <Link to="/" className="flex justify-center items-center gap-3">
                       
                            <span className="text-xl font-black tracking-wider text-gray-900 dark:text-white">Optimum</span>
                        </Link>
                        <p className="text-xs text-center sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                            Kelajagingizni biz bilan birga quring. Zamonaviy kasblar va sifatli ta'lim olib, o'z yo'lingizni toping.
                        </p>

                        {/* Rasmiy havolalar bilan ijtimoiy tarmoqlar */}
                        <div className="flex justify-center items-center gap-3 pt-3">
                            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition shadow-sm" title="Telegram">
                                <FaTelegramPlane />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-pink-600 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white transition shadow-sm" title="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-700 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white transition shadow-sm" title="Facebook">
                                <FaFacebookF />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-1"></div>

                    {/* Obuna bo'lish qismi */}


                </div>

                {/* Pastki qism */}
                <div className="flex justify-center text-center flex-col sm:flex-row items-center  pt-8 gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Optimum School of English. Barcha huquqlar kafolatlangan.</p>

                </div>

            </div>
        </footer>
    )
}   