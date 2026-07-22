import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AboutUs() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
        })
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 mb-24 select-none font-sans transition-colors duration-200">

            {/* 1-Bo'lim: Sarlavha va matnlar */}
            <div 
                data-aos="fade-up" 
                data-aos-duration="800"
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20"
            >
                <div className="lg:col-span-5">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                        {t('aboutUs.badge')}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-950 dark:text-white mt-4 tracking-tight leading-[1.15]">
                        {t('aboutUs.title')}
                    </h2>
                </div>
                <div className="lg:col-span-7 flex flex-col space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-base md:text-lg leading-relaxed">
                        {t('aboutUs.description1')}
                    </p>
                    <p className="text-gray-400 dark:text-gray-400 font-semibold text-sm leading-relaxed">
                        {t('aboutUs.description2')}
                    </p>
                </div>
            </div>

            {/* 2-Bo'lim: 3 ta kartochka */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">

                {/* 1-kartochka */}
                <div 
                    data-aos="fade-up" 
                    data-aos-duration="800"
                    data-aos-delay="100"
                    className="bg-gray-50/60 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl flex flex-col justify-between hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
                >
                    <div>
                        <div className="w-12 h-12 bg-gray-950 dark:bg-gray-800 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm">
                            ⚡
                        </div>
                        <h3 className="text-xl font-black text-gray-950 dark:text-white mb-2">{t('aboutUs.card1Title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            {t('aboutUs.card1Desc')}
                        </p>
                    </div>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-6 block uppercase tracking-wider">{t('aboutUs.card1Tag')}</span>
                </div>

                {/* 2-kartochka */}
                <div 
                    data-aos="fade-up" 
                    data-aos-duration="800"
                    data-aos-delay="200"
                    className="bg-gray-950 dark:bg-gray-900 text-white p-8 rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden border border-gray-800 dark:border-gray-800"
                >
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                    <div>
                        <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-md shadow-red-500/20">
                            🎯
                        </div>
                        <h3 className="text-xl font-black text-white mb-2">{t('aboutUs.card2Title')}</h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            {t('aboutUs.card2Desc')}
                        </p>
                    </div>
                    <span className="text-xs font-bold text-red-400 mt-6 block uppercase tracking-wider">{t('aboutUs.card2Tag')}</span>
                </div>

                {/* 3-kartochka */}
                <div 
                    data-aos="fade-up" 
                    data-aos-duration="800"
                    data-aos-delay="300"
                    className="bg-gray-50/60 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl flex flex-col justify-between hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300"
                >
                    <div>
                        <div className="w-12 h-12 bg-gray-950 dark:bg-gray-800 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm">
                            ✨
                        </div>
                        <h3 className="text-xl font-black text-gray-950 dark:text-white mb-2">{t('aboutUs.card3Title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                            {t('aboutUs.card3Desc')}
                        </p>
                    </div>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-6 block uppercase tracking-wider">{t('aboutUs.card3Tag')}</span>
                </div>

            </div>

            {/* 3-Bo'lim: Manzil va Rasm */}
            <div 
                data-aos="fade-up" 
                data-aos-duration="900"
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-gray-50/60 dark:bg-gray-950/50 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl"
            >
                <div className="space-y-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full">
                        {t('aboutUs.locationBadge')}
                    </span>
                    <h3 className="text-3xl font-black text-gray-950 dark:text-white tracking-tight">
                        {t('aboutUs.locationTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-base leading-relaxed">
                        {t('aboutUs.locationDesc')}
                    </p>
                    <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                                📍
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                {t('aboutUs.address')}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
                                📞
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                                +998 90 082 99 79
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 group">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                        alt={t('aboutUs.imageAlt')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
            </div>

            {/* 4-Bo'lim: Footer statistika */}
            <div 
                data-aos="fade-up" 
                data-aos-duration="900"
                className="bg-gradient-to-r from-red-50/40 via-gray-50/50 to-red-50/30 dark:from-red-950/20 dark:via-gray-950 dark:to-red-950/20 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
            >
                <div className="space-y-2 max-w-xl text-center md:text-left">
                    <h4 className="text-2xl font-black text-gray-950 dark:text-white">{t('aboutUs.footerTitle')}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed">
                        {t('aboutUs.footerDesc')}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8 shrink-0">
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-gray-950 dark:text-white">100%</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{t('aboutUs.stat1Label')}</span>
                    </div>
                    <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
                    <div className="text-center">
                        <span className="block text-3xl md:text-4xl font-black text-red-600 dark:text-red-400">7/24</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{t('aboutUs.stat2Label')}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}