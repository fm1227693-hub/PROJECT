import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsStars } from 'react-icons/bs'
import { FaChartLine, FaUserGraduate, FaAward, FaLaptopCode } from 'react-icons/fa'

export default function Stats() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('1m');

    const dataConfig = {
        '1m': {
            label: t('statistic.tab1', '1-oylik natija'),
            speaking: '25 min',
            errors: t('statistic.tab1Errors', "Xatolar kamayishi: -30%"),
            trendText: t('statistic.tab1Trend', "Dastlabki o'sish: +1.0 Band"),
            pathD: 'M 0 130 Q 100 120, 200 100 T 400 70',
            gradD: 'M 0 130 Q 100 120, 200 100 T 400 70 L 400 150 L 0 150 Z',
            circleX: 200,
            circleY: 100
        },
        '3m': {
            label: t('statistic.tab3', '3-oylik natija'),
            speaking: '45 min',
            errors: t('statistic.tab3Errors', "Xatolar kamayishi: -60%"),
            trendText: t('statistic.tab3Trend', "O'rta bosqich: +1.5 Band"),
            pathD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40',
            gradD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40 L 400 150 L 0 150 Z',
            circleX: 320,
            circleY: 30
        },
        'end': {
            label: t('statistic.tabEnd', 'Yakuniy natija'),
            speaking: '80 min',
            errors: t('statistic.endErrors', "Xatolar kamayishi: -85%"),
            trendText: t('statistic.endTrend', "Maqsadga erishildi: 7.5+ Band"),
            pathD: 'M 0 130 Q 100 90, 220 50 T 400 10',
            gradD: 'M 0 130 Q 100 90, 220 50 T 400 10 L 400 150 L 0 150 Z',
            circleX: 400,
            circleY: 10
        }
    };

    const current = dataConfig[activeTab];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 select-none text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
                <div className="max-w-xl space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400 animate-pulse" />
                        {t('statistic.badge', "O'QUVCHILAR DINAMIKASI")}
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-heading">
                        {t('statistic.title', "Haqiqiy tahlil va o'sish grafigi")}
                    </h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-xs sm:text-sm md:text-base max-w-md md:text-right">
                    {t('statistic.description', "Har bir o'quvchining nutq ravonligi, so'z boyligi va IELTS ballarining oylik dinamikasi.")}
                </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* Left Card: Progress Chart */}
                <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/85 dark:bg-[#0a0e19]/90 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    {t('statistic.dynamicsTitle', "BOSQICHMA-BOSQICH TAHLIL")}
                                </span>
                                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-heading">
                                    {t('statistic.analysisTitle', "Speaking va Fluency rivoji")}
                                </h3>
                            </div>

                            <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                                {Object.keys(dataConfig).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`py-2 px-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                            activeTab === key
                                                ? 'bg-white dark:bg-[#0c1424] text-red-600 dark:text-red-400 shadow-xs'
                                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {dataConfig[key].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chart Preview Canvas */}
                        <div className="w-full h-48 sm:h-56 bg-slate-50 dark:bg-[#0a1122] rounded-2xl p-4 flex items-end relative border border-slate-200/80 dark:border-white/5 overflow-hidden mb-6">
                            <svg className="w-full h-full transition-all duration-700 ease-in-out" viewBox="0 0 400 150" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C82032" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#C82032" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path d={current.gradD} fill="url(#chartGrad)" className="transition-all duration-700 ease-in-out" />
                                <path d={current.pathD} stroke="#C82032" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" className="transition-all duration-700 ease-in-out" />
                                <circle cx={current.circleX} cy={current.circleY} r="6" fill="#C82032" stroke="#ffffff" strokeWidth="2.5" className="transition-all duration-700 ease-in-out" />
                            </svg>

                            <div className="absolute top-4 right-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black px-3 py-1.5 rounded-xl shadow-md">
                                {current.trendText}
                            </div>
                        </div>
                    </div>

                    {/* Stage Metrics Tabs */}
                    <div className="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-white/5 pt-5 text-center">
                        {Object.keys(dataConfig).map((key) => {
                            const item = dataConfig[key];
                            const isActive = activeTab === key;
                            return (
                                <div
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                                        isActive 
                                            ? 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 shadow-xs' 
                                            : 'bg-slate-50 dark:bg-[#0c1424] border-slate-200/80 dark:border-white/5'
                                    }`}
                                >
                                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400 block uppercase tracking-wider truncate">{item.label}</span>
                                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block my-1">{item.speaking}</span>
                                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block truncate">{item.errors}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Card: Modules Distribution */}
                <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#070d19] border border-slate-200 dark:border-white/10 shadow-xl flex flex-col justify-between">
                    <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {t('statistic.courseTypeTitle', "DARS TAQSIMOTI")}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 mb-6 font-heading">
                            {t('statistic.coursesTitle', "Kurslar samaradorligi")}
                        </h3>

                        <div className="space-y-4">
                            {[
                                { name: 'General English & Foundations', progress: '88%', students: '320+' },
                                { name: 'IELTS Intensive & CDI Mock', progress: '94%', students: '450+' },
                                { name: 'Speaking Club with Native Mentors', progress: '91%', students: '280+' },
                                { name: 'IELTS Writing AI Feedback', progress: '96%', students: '500+' }
                            ].map((course, index) => (
                                <div key={index} className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1424] border border-slate-200/80 dark:border-white/5">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-800 dark:text-slate-200">{course.name}</span>
                                        <span className="text-red-600 dark:text-red-400 font-black">{course.progress}</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-red-600 to-rose-500 h-full rounded-full" style={{ width: course.progress }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/40 text-xs flex items-center justify-center gap-2">
                        <BsStars className="text-amber-500 text-sm" />
                        <span>Har oy o‘quvchilar CDI testlari orqali natijalarini yaxshilamoqda</span>
                    </div>
                </div>

            </div>
        </div>
    )
}