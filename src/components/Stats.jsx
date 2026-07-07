import React from 'react'

export default function Stats() {
  return (
<div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200">
            
            {/* Yuqori qism: Sarlavha va Kichik tushuntirish */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div className="max-w-xl">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                        Advanced Insights
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 tracking-tight leading-tight">
                        Get a deeper look into your traffic behavior
                    </h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base max-w-sm md:text-right">
                    Analyze conversions, audience retention, and exact click maps with our automated background AI tracking.
                </p>
            </div>

            {/* Asosiy bloklar: Ikki ustunli chuqur tahlil */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* 1. Chap tomon (7 ta ustun): Katta vizual trend va umumiy tahlil */}
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl lg:col-span-7 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Live Traffic Trend</span>
                                <h3 className="text-2xl font-black text-gray-950 dark:text-white mt-1">Growth Overview</h3>
                            </div>
                            {/* Vaqtni filtrlash tugmalari */}
                            <div className="flex gap-1.5 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800">
                                <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-900 dark:text-white">7D</button>
                                <button className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">30D</button>
                                <button className="px-3 py-1 text-xs font-semibold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">1Y</button>
                            </div>
                        </div>

                        {/* Katta dinamik SVG Grafik simulationi */}
                        <div className="w-full h-56 bg-gradient-to-b from-blue-50/20 dark:from-blue-500/10 to-transparent rounded-2xl p-4 flex items-end relative border border-dashed border-gray-100/70 dark:border-gray-800 mb-6">
                            <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="largeChartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path d="M 0 120 Q 80 50, 160 90 T 320 30 T 400 10 L 400 150 L 0 150 Z" fill="url(#largeChartGrad)" />
                                <path d="M 0 120 Q 80 50, 160 90 T 320 30 T 400 10" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                <circle cx="320" cy="30" r="5" fill="#3b82f6" stroke="#ffffff" dark:stroke="#030712" strokeWidth="2" />
                            </svg>
                            
                            <div className="absolute top-8 right-16 bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md">
                                Peak: +45% Users
                            </div>
                        </div>
                    </div>

                    {/* Pastki qisqacha xulosa matni */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-50 dark:border-gray-800/60 pt-6">
                        <div>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block">Average Session</span>
                            <span className="text-lg font-extrabold text-gray-900 dark:text-white block mt-0.5">4m 32s</span>
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block">Bounce Rate</span>
                            <span className="text-lg font-extrabold text-emerald-500 block mt-0.5">24.8% ↓</span>
                        </div>
                    </div>
                </div>

                {/* 2. O'ng tomon (5 ta ustun): Kanallar bo'yicha chuqur taqsimot */}
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl lg:col-span-5 flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Acquisition Channels</span>
                        <h3 className="text-2xl font-black text-gray-950 dark:text-white mt-1 mb-6">Traffic Sources</h3>
                        
                        {/* Progress-barlar ro'yxati */}
                        <div className="space-y-5">
                            {/* Manba 1: Direct */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">Direct Traffic</span>
                                    <span className="text-gray-900 dark:text-white">42% (13,629)</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '42%' }}></div>
                                </div>
                            </div>

                            {/* Manba 2: Social Media */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">Social Networks</span>
                                    <span className="text-gray-900 dark:text-white">31% (10,059)</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-gray-950 dark:bg-white h-full rounded-full" style={{ width: '31%' }}></div>
                                </div>
                            </div>

                            {/* Manba 3: Organic Search */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">Organic SEO</span>
                                    <span className="text-gray-900 dark:text-white">18% (5,841)</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-blue-400 h-full rounded-full" style={{ width: '18%' }}></div>
                                </div>
                            </div>

                            {/* Manba 4: Referrals */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">Referral Links</span>
                                    <span className="text-gray-900 dark:text-white">9% (2,922)</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-gray-200 dark:bg-gray-800 h-full rounded-full" style={{ width: '9%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pastki o'ng tomon harakat tugmasi */}
                    <button className="w-full mt-8 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-xl border border-gray-200/60 dark:border-gray-800 transition-all duration-200 text-xs flex items-center justify-center gap-2">
                        📂 Export Full Report (PDF / CSV)
                    </button>
                </div>

            </div>
        </div>
  )
}
