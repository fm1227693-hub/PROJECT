import React from 'react'

export default function Footer() {
    return (
       <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 font-sans select-none mt-32 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
                
                {/* Yuqori ustunlar qismi */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-50 dark:border-gray-800/60 pb-12">
                    
                    {/* Logotip va tavsif */}
                    <div className="flex flex-col space-y-4 md:col-span-1">
                        <a className="flex title-font font-bold items-center text-gray-900 dark:text-white cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-8 h-8 text-white p-1.5 bg-gray-950 dark:bg-white dark:text-gray-950 rounded-xl" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span className="ml-2.5 text-lg font-extrabold tracking-tight text-gray-900 dark:text-white">ADMIN<span className="text-blue-500 dark:text-blue-400">.</span></span>
                        </a>
                        <p className="text-gray-400 dark:text-gray-400 text-xs font-semibold leading-relaxed">
                            Powerful tools to manage your business analytics and optimize user interaction live.
                        </p>
                    </div>

                    {/* Products */}
                    <div className="flex flex-col space-y-3">
                        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Products</span>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Lite Analytics</a>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Pro Dashboard</a>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Custom API</a>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col space-y-3">
                        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Resources</span>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Documentation</a>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Guides & Tutorials</a>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Help Center</a>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col space-y-3">
                        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Legal</span>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Privacy Policy</a>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Terms of Service</a>
                        <a className="text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors">Cookie Settings</a>
                    </div>

                </div>

                {/* Pastki mualliflik huquqi va ijtimoiy tarmoqlar */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                        © {new Date().getFullYear()} ADMIN. All rights reserved. Created with 🔥
                    </span>
                    <div className="flex items-center gap-5 text-gray-400 dark:text-gray-400">
                        <a className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                            </svg>
                        </a>
                        <a className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </a>
                        <a className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                            <svg fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4" viewBox="0 0 24 24">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </footer>)
}
