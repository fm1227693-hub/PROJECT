import React from 'react'

export default function AdminORG() {
    return (
<div className="p-8 bg-gray-50/50 dark:bg-gray-950 font-sans text-left flex flex-col min-h-screen transition-colors duration-200">
            {/* Orqaga qaytish tugmasi */}
            <div className="">
                <button 
                    
                    className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    back
                </button>
            </div>
            
            {/* Sarlavha */}
            <div className="mb-10 text-5xl md:text-7xl font-black text-center text-gray-800 dark:text-white tracking-tight">
                ADMIN PANEL
            </div>

            {/* Statistika kartochkalari (Visits, Impressions, Conversion, Downloads) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm mb-8 select-none">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white block">32,451</span>
                        <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 block mt-0.5">Visits</span>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 block mt-1">+14.00 (+0.50%)</span>
                    </div>
                    <div className="w-24 h-12">
                        <svg className="w-full h-full" viewBox="0 0 100 40" fill="none">
                            <path d="M0 30 L10 20 L20 35 L30 15 L40 28 L50 18 L60 32 L70 22 L80 28 L90 20 L100 22" stroke="#5c7cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white block">15,236</span>
                        <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 block mt-0.5">Impressions</span>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 block mt-1">+138.97 (+0.54%)</span>
                    </div>
                    <div className="w-24 h-12">
                        <svg className="w-full h-full" viewBox="0 0 100 40" fill="none">
                            <path d="M0 25 L10 32 L20 18 L30 28 L40 22 L50 30 L60 24 L70 26 L80 15 L90 32 L100 20" stroke="#5c7cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white block">7,688</span>
                        <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 block mt-0.5">Conversion</span>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 block mt-1">+57.62 (+0.76%)</span>
                    </div>
                    <div className="w-24 h-12">
                        <svg className="w-full h-full" viewBox="0 0 100 40" fill="none">
                            <path d="M0 28 L10 20 L20 30 L30 18 L40 15 L50 28 L60 18 L70 24 L80 32 L90 26 L100 30" stroke="#5c7cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-3xl font-bold text-gray-800 dark:text-white block">1,553</span>
                        <span className="text-sm font-semibold text-blue-500 dark:text-blue-400 block mt-0.5">Downloads</span>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 block mt-1">+138.97 (+0.54%)</span>
                    </div>
                    <div className="w-24 h-12">
                        <svg className="w-full h-full" viewBox="0 0 100 40" fill="none">
                            <path d="M0 25 L10 22 L20 35 L30 20 L40 28 L50 22 L60 18 L70 26 L80 30 L90 15 L100 28" stroke="#5c7cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Savdo statistikasi grafigi */}
            <div className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm mb-8">
                <div className="flex justify-between items-start mb-4 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Sales Statistics Overview</h2>
                        <p className="text-base text-gray-400 dark:text-gray-500 mt-1">Lorem ipsum is placeholder text commonly used</p>
                    </div>
                    <div className="flex gap-6 text-base font-semibold text-gray-500 dark:text-gray-400">
                        <span className="text-blue-500 dark:text-blue-400 cursor-pointer">1D</span>
                        <span className="hover:text-gray-800 dark:hover:text-white cursor-pointer">5D</span>
                        <span className="hover:text-gray-800 dark:hover:text-white cursor-pointer">1M</span>
                        <span className="hover:text-gray-800 dark:hover:text-white cursor-pointer">1Y</span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4 shrink-0">
                    <div className="flex gap-16">
                        <div>
                            <p className="text-base text-gray-500 dark:text-gray-400 mb-1">Total Cost</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-800 dark:text-white">15,263</span>
                                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                                    <strong className="text-gray-700 dark:text-gray-300 font-bold">89.5%</strong> of 20,000 Total
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-base text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-gray-800 dark:text-white">$753,098</span>
                                <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                                    <strong className="text-gray-700 dark:text-gray-300 font-bold">10.5%</strong> of 20,000 Total
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-8 text-base font-semibold text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-3">
                            <span className="w-4 h-1.5 bg-purple-500 rounded-full"></span>
                            <span>Revenue</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-4 h-1.5 bg-emerald-400 rounded-full"></span>
                            <span>Sales</span>
                        </div>
                    </div>
                </div>
                <div className="relative w-full flex-1 flex items-stretch min-h-[300px]">
                    <div className="flex flex-col justify-between text-sm font-medium text-gray-400 dark:text-gray-500 w-14 select-none text-left pr-2 pb-1">
                        <span>200</span>
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span className="mt-auto">0</span>
                    </div>
                    <div className="relative flex-1 border-b border-gray-100 dark:border-gray-800">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-1">
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
                        </div>
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.12" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>
                            <path d="M 0 70 L 14 62 L 28 67 L 42 35 L 57 35 L 71 27 L 85 45 L 100 27 L 100 100 L 0 100 Z" fill="url(#purpleGrad)" />
                            <path d="M 0 70 L 14 62 L 28 67 L 42 35 L 57 35 L 71 27 L 85 45 L 100 27" fill="none" stroke="#8b5cf6" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                            <path d="M 0 100 L 14 87 L 28 90 L 42 80 L 57 65 L 71 74 L 85 75 L 100 55 L 100 100 L 0 100 Z" fill="url(#emeraldGrad)" />
                            <path d="M 0 100 L 14 87 L 28 90 L 42 80 L 57 65 L 71 74 L 85 75 L 100 55" fill="none" stroke="#34d399" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                        </svg>
                        {/* Nuqtalar uchun dark mode qismi */}
                        <div className="absolute left-[0%] bottom-[30%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[14%] bottom-[38%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[28%] bottom-[33%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[42%] bottom-[65%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[57%] bottom-[65%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[71%] bottom-[73%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[85%] bottom-[55%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[100%] bottom-[73%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-purple-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[0%] bottom-[0%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[14%] bottom-[13%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[28%] bottom-[10%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[42%] bottom-[20%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[57%] bottom-[35%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[71%] bottom-[26%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[85%] bottom-[25%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                        <div className="absolute left-[100%] bottom-[45%] w-2.5 h-2.5 bg-white dark:bg-gray-900 border-2 border-emerald-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </div>
            </div>

            {/* Jadval va quyi bloklar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
                            <span className="text-xs font-semibold text-blue-500 dark:text-blue-400 cursor-pointer hover:underline">View All</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800 text-sm font-semibold text-gray-400">
                                        <th className="pb-3">Customer</th>
                                        <th className="pb-3">Product</th>
                                        <th className="pb-3">Amount</th>
                                        <th className="pb-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-600 dark:text-gray-300">
                                    <tr className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                                        <td className="py-3.5 font-medium text-gray-800 dark:text-white">Anvar Aliyev</td>
                                        <td className="py-3.5">Premium Dashboard UI</td>
                                        <td className="py-3.5 font-semibold text-gray-800 dark:text-white">$49.00</td>
                                        <td className="py-3.5"><span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold">Success</span></td>
                                    </tr>
                                    <tr className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                                        <td className="py-3.5 font-medium text-gray-800 dark:text-white">Zilola Umarova</td>
                                        <td className="py-3.5">React Component Kit</td>
                                        <td className="py-3.5 font-semibold text-gray-800 dark:text-white">$12.50</td>
                                        <td className="py-3.5"><span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-semibold">Pending</span></td>
                                    </tr>
                                    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                                        <td className="py-3.5 font-medium text-gray-800 dark:text-white">Rustam Ivanov</td>
                                        <td className="py-3.5">SaaS Boilerplate</td>
                                        <td className="py-3.5 font-semibold text-gray-800 dark:text-white">$89.00</td>
                                        <td className="py-3.5"><span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold">Canceled</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-6 flex flex-wrap gap-3">
                        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition">
                            + Add New Product
                        </button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold rounded-lg transition">
                            Export Report (CSV)
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Products</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800 dark:text-white">UI/UX Masterclass</p>
                                    <p className="text-xs text-gray-400">142 ta sotildi</p>
                                </div>
                                <span className="font-bold text-sm text-emerald-500">+$6,958</span>
                            </div>
                            <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                <div>
                                    <p className="font-semibold text-sm text-gray-800 dark:text-white">React Node Fullstack</p>
                                    <p className="text-xs text-gray-400">98 ta sotildi</p>
                                </div>
                                <span className="font-bold text-sm text-emerald-500">+$4,802</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Live Alerts</h3>
                        <div className="space-y-3">
                            <div className="flex gap-3 items-start text-xs">
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></span>
                                <p className="text-gray-600 dark:text-gray-400"><strong className="text-gray-800 dark:text-gray-200 font-semibold">New user</strong> registered from Tashkent.</p>
                            </div>
                            <div className="flex gap-3 items-start text-xs">
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                <p className="text-gray-600 dark:text-gray-400">Server load is high <strong className="text-gray-800 dark:text-gray-200 font-semibold">(84%)</strong>.</p>
                            </div>
                            <div className="flex gap-3 items-start text-xs">
                                <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                <p className="text-gray-600 dark:text-gray-400">Payout of <strong className="text-gray-800 dark:text-gray-200 font-semibold">$1,200</strong> processed successfully.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}