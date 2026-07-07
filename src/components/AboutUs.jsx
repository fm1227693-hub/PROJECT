import React from 'react'

export default function AboutUs() {
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200">

            {/* Yuqori qism: Sarlavha va missiya bayonoti */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
                <div className="lg:col-span-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                        Deep Company Profile
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-950 dark:text-white mt-4 tracking-tight leading-[1.15]">
                        Engineering the next generation of data tools.
                    </h2>
                </div>
                <div className="lg:col-span-7 flex flex-col space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-base md:text-lg leading-relaxed">
                        We started with a simple observation: most business analytics platforms are either too complicated for small teams or too limited for growing enterprises. We built ADMIN to bridge that gap completely.
                    </p>
                    <p className="text-gray-400 dark:text-gray-400 font-semibold text-sm leading-relaxed">
                        Our architecture combines automated background tracking with human-centered design, ensuring that you spend less time configuring systems and more time interpreting meaningful real-time insights.
                    </p>
                </div>
            </div>

            {/* O'rta qism: 3 ta asosiy qadriyat (Core Values Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

                {/* Qadriyat 1 */}
                <div className="bg-gray-50/60 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl flex flex-col justify-between hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                    <div>
                        <div className="w-12 h-12 bg-gray-950 dark:bg-gray-800 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm">
                            ⚡
                        </div>
                        <h3 className="text-xl font-black text-gray-950 dark:text-white mb-2">Unmatched Speed</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            Optimized pipelines deliver real-time data metrics with zero noticeable lag, even under heavy multi-tenant loads.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 mt-6 block uppercase tracking-wider">Core Principle I</span>
                </div>

                {/* Qadriyat 2 (Markaziy - biroz ajralib turadi) */}
                <div className="bg-gray-950 dark:bg-gray-900 text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden border border-gray-800 dark:border-gray-800">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <div>
                        <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-md shadow-blue-500/20">
                            🛡️
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">Absolute Security</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Enterprise-grade encryption and isolated data logs ensure your business metrics remain completely private and secure.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-blue-400 mt-6 block uppercase tracking-wider">Core Principle II</span>
                </div>

                {/* Qadriyat 3 */}
                <div className="bg-gray-50/60 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl flex flex-col justify-between hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                    <div>
                        <div className="w-12 h-12 bg-gray-950 dark:bg-gray-800 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm">
                            🎯
                        </div>
                        <h3 className="text-xl font-black text-gray-950 dark:text-white mb-2">Radical Simplicity</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            Complex tables and charts translated into clean, actionable insights that anyone on your team can understand immediately.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 mt-6 block uppercase tracking-wider">Core Principle III</span>
                </div>

            </div>

            {/* Pastki qism: Jamoa va ko'rsatkichlar banneri */}
            <div className="bg-gradient-to-r from-blue-50/40 via-gray-50/50 to-blue-50/30 dark:from-blue-950/20 dark:via-gray-950 dark:to-blue-950/20 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2 max-w-xl text-center md:text-left">
                    <h4 className="text-2xl font-black text-gray-950 dark:text-white">Backed by data, driven by people.</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                        Our distributed engineering team works around the clock to maintain 99.9% uptime and deliver continuous feature updates.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 shrink-0">
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-gray-950 dark:text-white">99.9%</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Uptime SLA</span>
                    </div>
                    <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400">24/7</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Support</span>
                    </div>
                </div>
            </div>

        </div>)
}
