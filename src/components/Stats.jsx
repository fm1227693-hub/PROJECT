import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function Stats() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('1m');

    const dataConfig = {
        '1m': {
            label: t('statistic.tab1'),
            speaking: t('statistic.tab1Min'),
            errors: t('statistic.tab1Errors'),
            trendText: t('statistic.tab1Trend'),
            pathD: 'M 0 130 Q 100 120, 200 100 T 400 70',
            gradD: 'M 0 130 Q 100 120, 200 100 T 400 70 L 400 150 L 0 150 Z',
            circleX: 200,
            circleY: 100
        },
        '3m': {
            label: t('statistic.tab3'),
            speaking: t('statistic.tab3Min'),
            errors: t('statistic.tab3Errors'),
            trendText: t('statistic.tab3Trend'),
            pathD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40',
            gradD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40 L 400 150 L 0 150 Z',
            circleX: 320,
            circleY: 30
        },
        'end': {
            label: t('statistic.tabEnd'),
            speaking: t('statistic.endMin'),
            errors: t('statistic.endErrors'),
            trendText: t('statistic.endTrend'),
            pathD: 'M 0 130 Q 100 90, 220 50 T 400 10',
            gradD: 'M 0 130 Q 100 90, 220 50 T 400 10 L 400 150 L 0 150 Z',
            circleX: 400,
            circleY: 10
        }
    };

    const current = dataConfig[activeTab];

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200">

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div className="max-w-xl">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                        {t('statistic.badge')}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-4 tracking-tight leading-tight">
                        {t('statistic.title')}
                    </h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base max-w-sm md:text-right">
                    {t('statistic.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* Left Card: Chart & Dynamics */}
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl lg:col-span-7 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('statistic.dynamicsTitle')}</span>
                                <h3 className="text-2xl font-black text-gray-950 dark:text-white mt-1">{t('statistic.analysisTitle')}</h3>
                            </div>
                            <div className="flex gap-1.5 bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={() => setActiveTab('1m')}
                                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${activeTab === '1m' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white scale-105' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    {t('statistic.tab1')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('3m')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${activeTab === '3m' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white scale-105' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    {t('statistic.tab3')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('end')}
                                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer active:scale-95 ${activeTab === 'end' ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white scale-105' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                >
                                    {t('statistic.tabEnd')}
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-56 bg-gradient-to-b from-red-50/20 dark:from-red-500/10 to-transparent rounded-2xl p-4 flex items-end relative border border-dashed border-gray-100/70 dark:border-gray-800 mb-6 overflow-hidden">
                            <svg className="w-full h-full transition-all duration-700 ease-in-out" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="largeChartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path d={current.gradD} fill="url(#largeChartGrad)" className="transition-all duration-700 ease-in-out" />
                                <path d={current.pathD} stroke="#dc2626" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" className="transition-all duration-700 ease-in-out" />
                                <circle cx={current.circleX} cy={current.circleY} r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" className="transition-all duration-700 ease-in-out" />
                            </svg>

                            <div className="absolute top-8 right-16 bg-gray-950 dark:bg-white text-white dark:text-gray-950 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md transition-all duration-300 animate-fade-in">
                                {current.trendText}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-gray-50 dark:border-gray-800/60 pt-6 text-center">
                        <div onClick={() => setActiveTab('1m')} className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-95 hover:border-red-300 ${activeTab === '1m' ? 'bg-red-50/50 dark:bg-red-500/10 border-red-200 dark:border-red-900/50 scale-[1.02]' : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'}`}>
                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block uppercase tracking-wider">{t('statistic.tab1')}</span>
                            <span className="text-sm font-extrabold text-gray-900 dark:text-white block mt-1">25 min</span>
                            <span className="text-[10px] font-semibold text-gray-400 block mt-0.5">{t('statistic.tab1Errors')}</span>
                        </div>
                        <div onClick={() => setActiveTab('3m')} className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-95 hover:border-red-300 ${activeTab === '3m' ? 'bg-red-50/50 dark:bg-red-500/10 border-red-200 dark:border-red-900/50 scale-[1.02]' : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'}`}>
                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block uppercase tracking-wider">{t('statistic.tab3')}</span>
                            <span className="text-sm font-extrabold text-gray-900 dark:text-white block mt-1">45 min</span>
                            <span className="text-[10px] font-semibold text-emerald-500 block mt-0.5">{t('statistic.tab3Errors')}</span>
                        </div>
                        <div onClick={() => setActiveTab('end')} className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer active:scale-95 hover:border-red-300 ${activeTab === 'end' ? 'bg-red-50/50 dark:bg-red-500/10 border-red-200 dark:border-red-900/50 scale-[1.02]' : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800'}`}>
                            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block uppercase tracking-wider">{t('statistic.tabEnd')}</span>
                            <span className="text-sm font-extrabold text-gray-900 dark:text-white block mt-1">80 min</span>
                            <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">{t('statistic.endErrors')}</span>
                        </div>
                    </div>
                </div>

                {/* Right Card: Course Types & Progress Bars */}
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl lg:col-span-5 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
                    <div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('statistic.courseTypeTitle')}</span>
                        <h3 className="text-2xl font-black text-gray-950 dark:text-white mt-1 mb-6">{t('statistic.coursesTitle')}</h3>

                        <div className="space-y-5">
                            <div className="space-y-1.5 group">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">General English</span>
                                    <span className="text-gray-900 dark:text-white">42% {t('statistic.studentsText')}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-red-600 h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110" style={{ width: '42%' }}></div>
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">IELTS Preparation</span>
                                    <span className="text-gray-900 dark:text-white">31% {t('statistic.studentsText')}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-gray-950 dark:bg-white h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80" style={{ width: '31%' }}></div>
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">Speaking Club</span>
                                    <span className="text-gray-900 dark:text-white">18% {t('statistic.studentsText')}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-red-400 h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110" style={{ width: '18%' }}></div>
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-700 dark:text-gray-300">Grammar Intensive</span>
                                    <span className="text-gray-900 dark:text-white">9% {t('statistic.studentsText')}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="bg-gray-200 dark:bg-gray-800 h-full rounded-full transition-all duration-1000 ease-out group-hover:bg-gray-300 dark:group-hover:bg-gray-700" style={{ width: '9%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-8 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-100 dark:border-red-900/30 text-xs flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                        {t('statistic.footerText')}
                    </div>
                </div>

            </div>
        </div>
    )
}