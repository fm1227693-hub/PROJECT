import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
    HiLightningBolt, 
    HiCheckCircle, 
    HiSparkles, 
    HiLocationMarker, 
    HiPhone 
} from 'react-icons/hi'

// Rasmda ko'rsatilgan Premier School manzili uchun doimiy (constant) ma'lumotlar
const FIXED_LOCATION = {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3071.0124155!2d64.410986!3d39.7647863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f5007c3f9d243a7%3A0x3c52dea5c997b375!2sPremier%20School!5e0!3m2!1suz!2suz!4v1650000000000!5m2!1suz!2suz",
    addressText: "Namozgoh St, Bukhara"
}

export default function AboutUs() {
    const { t } = useTranslation()

    

    return (
        <div className="pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 mb-16 sm:mb-24 select-none font-sans text-gray-900 dark:text-white transition-colors duration-200">

            {/* 1-Bo'lim: Sarlavha va matnlar */}
            <div
                data-aos="fade-up"
                data-aos-duration="800"
                className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start mb-16 sm:mb-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-200 dark:border-gray-800 p-6 sm:p-12 rounded-3xl shadow-xl overflow-hidden"
            >
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />

                <div className="relative lg:col-span-5">
                    <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-900/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        {t('aboutUs.badge')}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-gray-900 dark:text-white mt-3 sm:mt-4 tracking-tight leading-tight">
                        {t('aboutUs.title')}
                    </h2>
                    <div className="mt-5 sm:mt-6 w-14 h-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-400" />
                </div>
                <div className="relative lg:col-span-7 flex flex-col space-y-3 sm:space-y-4">
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
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-red-900/20 relative overflow-hidden border border-gray-200 dark:border-gray-200 dark:border-gray-800 group hover:-translate-y-1.5 transition-all duration-300"
                >
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors duration-500"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-600/10 to-transparent rounded-bl-[3rem]"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white flex items-center justify-center rounded-2xl mb-6 shadow-sm border border-gray-300 dark:border-gray-300 dark:border-gray-700 group-hover:scale-110 group-hover:border-red-800 transition-all duration-300">
                            <HiLightningBolt className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-red-400 transition-colors duration-300">{t('aboutUs.card1Title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                            {t('aboutUs.card1Desc')}
                        </p>
                    </div>
                    <span className="relative text-[11px] sm:text-xs font-bold text-red-400 mt-6 flex items-center gap-1.5 uppercase tracking-wider">
                        {t('aboutUs.card1Tag')}
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                </div>

                {/* 2-kartochka */}
                <div
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="200"
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-red-900/20 relative overflow-hidden border border-gray-200 dark:border-gray-200 dark:border-gray-800 group hover:-translate-y-1.5 transition-all duration-300"
                >
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors duration-500"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-600/10 to-transparent rounded-bl-[3rem]"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-gray-900 dark:text-white flex items-center justify-center rounded-2xl mb-6 shadow-md shadow-red-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <HiCheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2">{t('aboutUs.card2Title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                            {t('aboutUs.card2Desc')}
                        </p>
                    </div>
                    <span className="relative text-[11px] sm:text-xs font-bold text-red-400 mt-6 flex items-center gap-1.5 uppercase tracking-wider">
                        {t('aboutUs.card2Tag')}
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                </div>

                {/* 3-kartochka */}
                <div
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="300"
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-red-900/20 relative overflow-hidden border border-gray-200 dark:border-gray-200 dark:border-gray-800 group hover:-translate-y-1.5 transition-all duration-300"
                >
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors duration-500"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-600/10 to-transparent rounded-bl-[3rem]"></div>
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-white flex items-center justify-center rounded-2xl mb-6 shadow-sm border border-gray-300 dark:border-gray-300 dark:border-gray-700 group-hover:scale-110 group-hover:border-red-800 transition-all duration-300">
                            <HiSparkles className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-red-400 transition-colors duration-300">{t('aboutUs.card3Title')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                            {t('aboutUs.card3Desc')}
                        </p>
                    </div>
                    <span className="relative text-[11px] sm:text-xs font-bold text-red-400 mt-6 flex items-center gap-1.5 uppercase tracking-wider">
                        {t('aboutUs.card3Tag')}
                        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                </div>

            </div>

            {/* 3-Bo'lim: Manzil va Premier School Xaritasi */}
            <div
                data-aos="fade-up"
                data-aos-duration="900"
                className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-200 dark:border-gray-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm overflow-hidden"
            >
                <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />

                <div className="relative space-y-4 sm:space-y-6">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-900/30 inline-block">
                        {t('aboutUs.locationBadge')}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        {t('aboutUs.locationTitle')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base leading-relaxed">
                        {t('aboutUs.locationDesc')}
                    </p>
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 hover:border-red-900/50 transition-colors duration-300">
                            <div className="w-10 h-10 bg-red-500/10 border border-red-900/30 text-red-400 rounded-full flex items-center justify-center shadow-sm shrink-0">
                                <HiLocationMarker className="w-5 h-5" />
                            </div>
                            <span className="text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">
                                {t('aboutUs.address')}
                            </span>
                        </div>
                        <a
                            href="tel:+998900829979"
                            className="flex items-center gap-3 sm:gap-4 bg-gray-50 dark:bg-gray-950/60 border border-gray-200 dark:border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 hover:border-red-900/50 transition-colors duration-300"
                        >
                            <div className="w-10 h-10 bg-red-500/10 border border-red-900/30 text-red-400 rounded-full flex items-center justify-center shadow-sm shrink-0">
                                <HiPhone className="w-5 h-5" />
                            </div>
                            <span className="text-gray-600 dark:text-gray-300 font-semibold text-xs sm:text-sm">
                                +998 90 082 99 79
                            </span>
                        </a>
                    </div>
                </div>

                {/* Premier School xaritasi (Dark mode filtr bilan) */}
                <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-200 dark:border-gray-800 group">
                    <iframe
                        title="Premier School Map"
                        src={FIXED_LOCATION.embedUrl}
                        className="w-full h-full border-0 dark:filter dark:invert-[90%] dark:hue-rotate-180 dark:contrast-125 dark:saturate-50 opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent pointer-events-none"></div>

                    <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-200 dark:border-gray-800 flex items-center gap-2.5 transition-transform duration-300 group-hover:-translate-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 leading-tight">
                            {FIXED_LOCATION.addressText}
                        </span>
                    </div>
                </div>
            </div>

            {/* 4-Bo'lim: Footer statistika */}
            <div
                data-aos="fade-up"
                data-aos-duration="900"
                className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl overflow-hidden border border-gray-200 dark:border-gray-200 dark:border-gray-800"
            >
                <div className="pointer-events-none absolute -top-16 right-1/4 w-56 h-56 bg-red-500/10 rounded-full blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 left-0 w-56 h-56 bg-red-600/10 rounded-full blur-3xl" />

                <div className="relative space-y-2 max-w-xl text-center md:text-left">
                    <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">{t('aboutUs.footerTitle')}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium leading-relaxed">
                        {t('aboutUs.footerDesc')}
                    </p>
                </div>
                <div className="relative flex flex-wrap items-center justify-center gap-6 sm:gap-8 shrink-0">
                    <div className="text-center">
                        <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white">100%</span>
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('aboutUs.stat1Label')}</span>
                    </div>
                    <div className="w-px h-10 bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                    <div className="text-center">
                        <span className="block text-2xl sm:text-3xl md:text-4xl font-black text-red-400">7/24</span>
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t('aboutUs.stat2Label')}</span>
                    </div>
                </div>
            </div>

        </div>
    )
}   