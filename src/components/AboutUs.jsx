import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AboutUs() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 80,
            duration: 800,
        })
    }, [])

    return (
        <div className="pb-10 rounded-2xl  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 mb-16 sm:mb-24 select-none font-sans bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-200">

            {/* 1-Bo'lim: Sarlavha va matnlar */}
            <div
                data-aos="fade-up"
                data-aos-duration="800"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-16 sm:mb-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-12 rounded-3xl shadow-sm dark:shadow-xl transition-colors duration-200"
            >
                <div className="lg:col-span-5">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">
                        {t('aboutUs.badge')}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-3 sm:mt-4 tracking-tight leading-tight">
                        {t('aboutUs.title')}
                    </h2>
                </div>
                <div className="lg:col-span-7 flex flex-col space-y-3 sm:space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base md:text-lg leading-relaxed">
                        {t('aboutUs.description1')}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 font-semibold text-xs sm:text-sm leading-relaxed">
                        {t('aboutUs.description2')}
                    </p>
                </div>
            </div>

            {/* 2-Bo'lim: 3 ta kartochka */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">

                {/* 1-kartochka */}
                <div
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="100"
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 group"
                >
                    <div>
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm group-hover:scale-105 transition-transform">
                            ⚡
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2">{t('aboutUs.card1Title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                            {t('aboutUs.card1Desc')}
                        </p>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 mt-6 block uppercase tracking-wider">{t('aboutUs.card1Tag')}</span>
                </div>

                {/* 2-kartochka */}
                <div
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="200"
                    className="bg-gray-900 text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xl relative overflow-hidden border border-gray-800 group"
                >
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                    <div>
                        <div className="w-12 h-12 bg-red-600 text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                            🎯
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-white mb-2">{t('aboutUs.card2Title')}</h3>
                        <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                            {t('aboutUs.card2Desc')}
                        </p>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-red-400 mt-6 block uppercase tracking-wider">{t('aboutUs.card2Tag')}</span>
                </div>

                {/* 3-kartochka */}
                <div
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="300"
                    className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between hover:shadow-xl dark:hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 group"
                >
                    <div>
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white flex items-center justify-center rounded-2xl text-lg font-bold mb-6 shadow-sm group-hover:scale-105 transition-transform">
                            ✨
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2">{t('aboutUs.card3Title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                            {t('aboutUs.card3Desc')}
                        </p>
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-red-600 dark:text-red-400 mt-6 block uppercase tracking-wider">{t('aboutUs.card3Tag')}</span>
                </div>

            </div>

            {/* 3-Bo'lim: Manzil va Rasm */}
            <div
                data-aos="fade-up"
                data-aos-duration="900"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm"
            >
                <div className="space-y-4 sm:space-y-6">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">
                        {t('aboutUs.locationBadge')}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        {t('aboutUs.locationTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base leading-relaxed">
                        {t('aboutUs.locationDesc')}
                    </p>
                    <div className="space-y-3 sm:space-y-4 pt-2">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm shrink-0">
                                📍
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs sm:text-sm">
                                {t('aboutUs.address')}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm shrink-0">
                                📞
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs sm:text-sm">
                                +998 90 082 99 79
                            </span>
                        </div>
                    </div>
                </div>
                <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 group">
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                        alt={t('aboutUs.imageAlt')}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
            </div>

            {/* 4-Bo'lim: Footer statistika */}
            <div
                data-aos="fade-up"
                data-aos-duration="900"
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-sm"
            >
                <div className="space-y-2 max-w-xl text-center md:text-left">
                    <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{t('aboutUs.footerTitle')}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                        {t('aboutUs.footerDesc')}
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 shrink-0 ">
                    <div className="text-center">
                        <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white">100%</span>
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500">{t('aboutUs.stat1Label')}</span>
                    </div>
                    <div className="w-px h-10 bg-gray-300 dark:bg-gray-800 hidden sm:block"></div>
                    <div className="text-center">
                        <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-red-600 dark:text-red-400">7/24</span>
                        <span className=" text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500">{t('aboutUs.stat2Label')}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}