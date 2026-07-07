import React from 'react'

export default function Sec3() {
    return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24 mb-24 select-none font-sans transition-colors duration-200">
            
            {/* Sarlavha qismi */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                    Our Products
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-black mt-4 tracking-tight">
                    Choose the perfect tool for your business
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-sm md:text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid error fugiat, nostrum modi cum in?
                </p>
            </div>

            {/* Narxlar gridi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                
                {/* 1. Lite Analytics */}
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Plugin</span>
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-2">Lite Analytics</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6 leading-relaxed">
                            Basic tracking tool for personal blogs and small landing pages with simple metrics.
                        </p>
                        <div className="flex items-baseline gap-1 mb-6 border-b border-gray-50 dark:border-gray-800/60 pb-6">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">$19</span>
                            <span className="text-gray-400 dark:text-gray-500 text-sm font-semibold">/ month</span>
                        </div>
                        <ul className="space-y-3 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-8">
                            <li className="flex items-center gap-2.5">✅ 1 Website Support</li>
                            <li className="flex items-center gap-2.5">✅ 10,000 Monthly Visits</li>
                            <li className="flex items-center gap-2.5 text-gray-300 dark:text-gray-600 line-through">❌ Real-time Export</li>
                        </ul>
                    </div>
                    <button className="w-full py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200/60 dark:border-gray-800 transition-all duration-200 text-sm">
                        Buy Starter
                    </button>
                </div>

                {/* 2. Pro Dashboard (Most Popular) */}
                <div className="bg-white dark:bg-gray-950 border-2 border-blue-500 p-8 rounded-3xl shadow-2xl flex flex-col justify-between relative transform lg:-translate-y-2 transition-all duration-300">
                    <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                        Most Popular
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400">All-in-one</span>
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-2">Pro Dashboard</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6 leading-relaxed">
                            Full admin dashboard access with advanced tracking, graphs, and export features.
                        </p>
                        <div className="flex items-baseline gap-1 mb-6 border-b border-blue-50 dark:border-gray-800/60 pb-6">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">$49</span>
                            <span className="text-gray-400 dark:text-gray-500 text-sm font-semibold">/ month</span>
                        </div>
                        <ul className="space-y-3 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-8">
                            <li className="flex items-center gap-2.5">✅ Unlimited Websites</li>
                            <li className="flex items-center gap-2.5">✅ 500,000 Monthly Visits</li>
                            <li className="flex items-center gap-2.5">✅ Real-time Export & PDF</li>
                            <li className="flex items-center gap-2.5">✅ Premium 24/7 Support</li>
                        </ul>
                    </div>
                    <button className="w-full py-3 bg-gray-950 dark:bg-white text-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold rounded-xl shadow-md shadow-gray-950/10 transition-all duration-200 text-sm">
                        Get Pro Access
                    </button>
                </div>

                {/* 3. Custom API */}
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-xl flex flex-col justify-between hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Developer</span>
                            <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-2">Custom API</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6 leading-relaxed">
                            Dedicated server infrastructure, raw log access, and custom webhooks for large systems.
                        </p>
                        <div className="flex items-baseline gap-1 mb-6 border-b border-gray-50 dark:border-gray-800/60 pb-6">
                            <span className="text-4xl font-black text-gray-900 dark:text-white">$99</span>
                            <span className="text-gray-400 dark:text-gray-500 text-sm font-semibold">/ month</span>
                        </div>
                        <ul className="space-y-3 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-8">
                            <li className="flex items-center gap-2.5">✅ Custom Database Logs</li>
                            <li className="flex items-center gap-2.5">✅ Unlimited Monthly Visits</li>
                            <li className="flex items-center gap-2.5">✅ Dedicated IP Address</li>
                        </ul>
                    </div>
                    <button className="w-full py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200/60 dark:border-gray-800 transition-all duration-200 text-sm">
                        Contact Sales
                    </button>
                </div>

            </div>
        </div>
    )
}
