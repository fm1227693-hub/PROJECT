import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Sec1() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
        })
    }, [])

    const items = [
        {
            value: '32,451',
            label: t('stats.studentsTitle'),
            change: '+14.00 (+0.50%)',
            path: 'M 0 30 L 10 20 L 20 35 L 30 15 L 40 28 L 50 18 L 60 32 L 70 22 L 80 28 L 90 20 L 100 22',
        },
        {
            value: '15,236',
            label: t('stats.lessonsTitle'),
            change: '+138.97 (+0.54%)',
            path: 'M 0 25 L 10 32 L 20 18 L 30 28 L 40 22 L 50 30 L 60 24 L 70 26 L 80 15 L 90 32 L 100 20',
        },
        {
            value: '7,688',
            label: t('stats.speakingTitle'),
            change: '+57.62 (+0.76%)',
            path: 'M 0 28 L 10 20 L 20 30 L 30 18 L 40 15 L 50 28 L 60 18 L 70 24 L 80 32 L 90 26 L 100 30',
        },
        {
            value: '1,553',
            label: t('stats.certificatesTitle'),
            change: '+138.97 (+0.54%)',
            path: 'M 0 25 L 10 22 L 20 35 L 30 20 L 40 28 L 50 22 L 60 18 L 70 26 L 80 30 L 90 15 L 100 28',
        },
    ]

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 mb-12 select-none font-sans transition-colors duration-200">
            <div
                data-aos="fade-up"
                data-aos-duration="800"
                className="relative bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-gray-100/80 dark:border-gray-800 rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center overflow-hidden"
            >
                {/* Dekorativ nur */}
                <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />

                {items.map((item, index) => (
                    <div
                        key={item.label}
                        className={`relative flex items-center justify-between ${index < items.length - 1 ? 'lg:border-r lg:border-gray-100 dark:lg:border-gray-800' : ''} lg:pr-6 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-50/80 dark:hover:bg-gray-900/50 group`}
                    >
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight block group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">{item.value}</span>
                            <span className="text-sm font-bold text-red-500 dark:text-red-400 block mt-0.5">{item.label}</span>
                            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 block mt-1">{item.change}</span>
                        </div>
                        <div className="w-24 h-12 flex items-center transform group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-full h-full" viewBox="0 0 100 40" fill="none">
                                <defs>
                                    <linearGradient id={`sparklineGradRed${index}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                                    </linearGradient>
                                </defs>
                                <path d={`${item.path} L 100 40 L 0 40 Z`} fill={`url(#sparklineGradRed${index})`} />
                                <path d={item.path} stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}