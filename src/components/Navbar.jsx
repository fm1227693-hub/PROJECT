import React, { useEffect, useState } from 'react'
import { FaRegMoon, FaRegSun, FaBars, FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [dark, isDark] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false)

    const Theme = function () {
        const nextState = !dark
        isDark(nextState)
        localStorage.setItem('theme', nextState)
        document.querySelector('body').classList.toggle('dark', nextState)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') === 'true'
        isDark(savedTheme)
        if (savedTheme) {
            document.querySelector('body').classList.add('dark')
        } else {
            document.querySelector('body').classList.remove('dark')
        }
    }, [])

    return (
        <div className='fixed top-0 left-0 w-full z-50 font-sans select-none'>
            <header className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    
                    {/* Chap qism: Burger menyu (Mobil) va Logo */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)} 
                            className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:opacity-85 transition"
                            title="Menu"
                        >
                            {menuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                        </button>

                        <Link to="/" className="flex items-center text-gray-900 dark:text-white cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-8 h-8 md:w-9 md:h-9 text-white p-2 bg-gray-950 dark:bg-white dark:text-gray-950 rounded-xl" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span className="ml-2.5 text-lg md:text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">EDUMARKAZ<span className="text-blue-500">.</span></span>
                        </Link>
                    </div>

                    {/* Navigatsiya linklari (Desktop) */}
                    <nav className="hidden md:flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 gap-6">
                        <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">Bosh sahifa</Link>
                        <Link to="/stats" className="hover:text-gray-900 dark:hover:text-white transition-colors">Statistika</Link>
                        <Link to="/products" className="hover:text-gray-900 dark:hover:text-white transition-colors">Kurslar</Link>
                        <Link to="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">Biz haqimizda</Link>
                    </nav>

                    {/* O'ng tarafdagi tugmalar */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Theme almashtirish */}
                        <div onClick={Theme} className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-yellow-400 cursor-pointer hover:opacity-85 transition-all shadow-sm">
                            {dark ? <FaRegSun className="w-4 h-4" title="Light mode" /> : <FaRegMoon className="w-4 h-4 text-gray-900" title="Dark mode" />}
                        </div>

                        {/* Management tugmasi */}
                        <Link to="/enter" className="inline-flex items-center bg-gray-950 dark:bg-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 text-white text-xs font-bold py-2 px-3 md:py-2.5 md:px-4 rounded-xl shadow-sm transition-all gap-1.5 border border-transparent">
                            <span>Boshqaruv</span>
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </Link>
                    </div>

                </div>

                {/* Mobil menyu (Burger bosilganda pastga ochiladi) */}
                {menuOpen && (
                    <nav className="md:hidden flex flex-col px-4 pt-2 pb-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 gap-3 font-semibold text-sm text-gray-600 dark:text-gray-300">
                        <Link to="/" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">Bosh sahifa</Link>
                        <Link to="/stats" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">Statistika</Link>
                        <Link to="/products" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">Kurslar</Link>
                        <Link to="/about" onClick={() => setMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition">Biz haqimizda</Link>
                    </nav>
                )}
            </header>
        </div>
    )
}