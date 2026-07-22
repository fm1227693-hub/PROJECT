import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Stats() {
    const { t } = useTranslation()
    // Faqat '1m', '3m', 'end' qiymatlarini qabul qiladigan state
    const [activeTab, setActiveTab] = useState('1m');

    // AOS kutubxonasini ishga tushirish
    useEffect(() => {
        AOS.init({
            once: true, // Animatsiya faqat bir marta o'ynaydi
            offset: 100, // Element ko'ringandan 100px keyin boshlanadi
            duration: 800, // Standart animatsiya davomiyligi
        })
    }, [])

    // Har bir tab uchun ma'lumotlar konfiguratsiyasi
    const dataConfig = {
        '1m': {
            label: t('statistic.tab1'),
            speaking: '25 min',
            errors: t('statistic.tab1Errors'),
            trendText: t('statistic.tab1Trend'),
            pathD: 'M 0 130 Q 100 120, 200 100 T 400 70',
            gradD: 'M 0 130 Q 100 120, 200 100 T 400 70 L 400 150 L 0 150 Z',
            circleX: 200,
            circleY: 100
        },
        '3m': {
            label: t('statistic.tab3'),
            speaking: '45 min',
            errors: t('statistic.tab3Errors'),
            trendText: t('statistic.tab3Trend'),
            pathD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40',
            gradD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40 L 400 150 L 0 150 Z',
            circleX: 320,
            circleY: 30
        },
        'end': {
            label: t('statistic.tabEnd'),
            speaking: '80 min',
            errors: t('statistic.endErrors'),
            trendText: t('statistic.endTrend'),
            pathD: 'M 0 130 Q 100 90, 220 50 T 400 10',
            gradD: 'M 0 130 Q 100 90, 220 50 T 400 10 L 400 150 L 0 150 Z',
            circleX: 400,
            circleY: 10
        }
    };

    // Hozirgi faol tab bo'yicha ma'lumotlarni olish
    const current = dataConfig[activeTab];

    return (
        // Yuqori qismdagi padding pt-24 sm:pt-28 ga o'zgartirildi (fixed navbar uchun joy)
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 mb-16 sm:mb-24 select-none font-sans transition-colors duration-200">

            {/* Sarlavha qismi */}
            <div 
                data-aos="fade-up" 
                className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4"
            >
                <div className="max-w-xl">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full inline-block animate-pulse">
                        {t('statistic.badge')}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 sm:mt-4 tracking-tight leading-tight">
                        {t('statistic.title')}
                    </h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-xs sm:text-sm md:text-base max-w-sm md:text-right">
                    {t('statistic.description')}
                </p>
            </div>

            {/* Asosiy Grid kontent */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

                {/* Left Card: Chart & Dynamics */}
                <div 
                    data-aos="fade-right" 
                    className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 sm:p-8 shadow-xl lg:col-span-7 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 group/card"
                >
                    <div>
                        {/* Dinamik sarlavha va tablar qismi (Mobil uchun moslashtirilgan) */}
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex flex-col">
                                <span className="text-[11px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('statistic.dynamicsTitle')}</span>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-gray-950 dark:text-white mt-0.5 sm:mt-1">{t('statistic.analysisTitle')}</h3>
                            </div>
                            
                            {/* Tab tugmalari - Kichik ekranlarda 3 ta ustunga bo'linadi */}
                            <div className="grid grid-cols-3 gap-1 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800 w-full">
                                {Object.keys(dataConfig).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer active:scale-95 truncate text-center ${activeTab === key ? 'bg-white dark:bg-gray-800 shadow-sm text-red-600 dark:text-red-400 scale-[1.02]' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        {dataConfig[key].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grafik ko'rinishi */}
                        <div className="w-full h-48 sm:h-56 bg-gradient-to-b from-red-50/20 dark:from-red-500/10 to-transparent rounded-2xl p-3 sm:p-4 flex items-end relative border border-dashed border-gray-100/70 dark:border-gray-800 mb-6 overflow-hidden transition-all duration-500 group-hover/card:border-red-200 dark:group-hover/card:border-red-900/40">
                            <svg className="w-full h-full transition-all duration-700 ease-in-out" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="largeChartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path d={current.gradD} fill="url(#largeChartGrad)" className="transition-all duration-700 ease-in-out" />
                                <path d={current.pathD} stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="transition-all duration-700 ease-in-out" />
                                {/* Pulsatsiyalanuvchi nuqta */}
                                <circle cx={current.circleX} cy={current.circleY} r="6" fill="#dc2626" stroke="#ffffff" strokeWidth="2.5" className="transition-all duration-700 ease-in-out animate-pulse" />
                            </svg>

                            {/* Trend haqida yorliq */}
                            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl shadow-lg transition-all duration-500 transform hover:scale-105 border border-white/10 dark:border-gray-900/10">
                                {current.trendText}
                            </div>
                        </div>
                    </div>

                    {/* Pastki 3 ta oy kartochkalari (Statistikani tez almashtirish uchun) */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 border-t border-gray-100 dark:border-gray-800/80 pt-4 sm:pt-5 mt-2 text-center">
                        {Object.keys(dataConfig).map((key) => {
                            const item = dataConfig[key];
                            const isActive = activeTab === key;
                            return (
                                <div 
                                    key={key}
                                    onClick={() => setActiveTab(key)} 
                                    className={`p-2.5 sm:p-3 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-95 hover:border-red-400 hover:-translate-y-1 flex flex-col justify-between ${isActive ? 'bg-red-50/60 dark:bg-red-500/10 border-red-300 dark:border-red-900/60 shadow-md scale-[1.02]' : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'}`}
                                >
                                    <span className="text-[9px] sm:text-xs font-bold text-red-600 dark:text-red-400 block uppercase tracking-wider truncate">{item.label}</span>
                                    <span className="text-xs sm:text-base font-extrabold text-gray-900 dark:text-white block my-1">{item.speaking}</span>
                                    <span className="text-[9px] sm:text-[10px] font-semibold text-gray-500 dark:text-gray-400 block truncate">{item.errors}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Card: Course Types & Progress Bars */}
                <div 
                    data-aos="fade-left" 
                    className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 sm:p-8 shadow-xl lg:col-span-5 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 group/card"
                >
                    <div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('statistic.courseTypeTitle')}</span>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-white mt-1 mb-5 sm:mb-6">{t('statistic.coursesTitle')}</h3>

                        <div className="space-y-4 sm:space-y-6">
                            {/* Kurslar ro'yxati va progress barlar */}
                            {[
                                { name: 'General English', progress: '42%', color: 'bg-red-600' },
                                { name: 'IELTS Preparation', progress: '31%', color: 'bg-gray-950 dark:bg-white' },
                                { name: 'Speaking Club', progress: '18%', color: 'bg-red-400' },
                                { name: 'Grammar Intensive', progress: '9%', color: 'bg-gray-300 dark:bg-gray-700' }
                            ].map((course, index) => (
                                <div key={index} className="space-y-2 group p-2.5 sm:p-3 rounded-2xl transition-all duration-300 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 border border-transparent hover:border-gray-100 dark:hover:border-gray-800">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{course.name}</span>
                                        <span className="text-gray-900 dark:text-white">{course.progress} {t('statistic.studentsText')}</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden p-0.5">
                                        <div className={`${course.color} h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 shadow-sm`} style={{ width: course.progress }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pastki yozuv */}
                    <div className="w-full mt-6 sm:mt-8 py-3.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-100 dark:border-red-900/30 text-xs flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm">
                        {t('statistic.footerText')}
                    </div>
                </div>

            </div>
        </div>
    )
}