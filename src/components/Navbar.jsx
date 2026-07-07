import React, { useEffect, useState } from 'react'
import { FaRegMoon, FaRegSun } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Navbar() {


    const [dark, isDark] = useState(true)
    const Theme = function () {
        isDark(prev => !prev)
        localStorage.setItem('theme', dark)
        document.querySelector('body').classList.toggle('dark')
    }

    useEffect(() => {
        console.log(localStorage.getItem('theme'));
        if (localStorage.getItem('theme') == 'true') {
            document.querySelector('body').classList.add('dark')
        } else {
            document.querySelector('body').classList.remove('dark')
        }
    }, [])



    return (
       <div className='fixed top-0 left-0 w-full z-50 font-sans select-none'>
            <header className="bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
                <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between">

                    {/* Logo qismi */}
                    <Link to="/" className="flex title-font font-bold items-center text-gray-900 dark:text-white mb-4 md:mb-0 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-9 h-9 text-white p-2 bg-gray-950 dark:bg-white dark:text-gray-950 rounded-xl" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                        </svg>
                        <span className="ml-3 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">ADMIN<span className="text-blue-500">.</span></span>
                    </Link>

                    {/* Navigatsiya linklari */}
                    <nav className="md:ml-auto flex flex-wrap items-center text-sm font-semibold text-gray-500 dark:text-gray-400 justify-center gap-6 md:mr-8">
                        <Link to="/" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Overview</Link>
                        <Link to="/stats" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Statistics</Link>
                        <Link to="/products" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">Products</Link>
                        <Link to="/about" className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">About us</Link>
                    </nav>

                    {/* Dark / Light rejimi tugmasi (Ikonka) */}
                  

                    {/* Management tugmasi */}
                    <Link to="/enter" className="inline-flex items-center bg-gray-950 dark:bg-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 mt-4 md:mt-0 gap-1.5 border border-transparent">
                        Management
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </Link>
                      <div className="ml-2 my-4 md:my-0 flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-yellow-400 cursor-pointer hover:opacity-85 transition-all shadow-sm">
                        {dark ? (
                            <FaRegSun onClick={Theme} className="w-4 h-4" title="Light mode" />
                        ) : (
                            <FaRegMoon onClick={Theme} className="w-4 h-4 text-gray-900" title="Dark mode" />
                        )}
                    </div>
                </div>
            </header>
        </div>
    )
}