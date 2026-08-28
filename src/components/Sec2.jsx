import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function Sec2() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    

    return (
        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 mt-16 xs:mt-20 sm:mt-24 mb-16 xs:mb-20 sm:mb-24 select-none font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">

            <div
                data-aos="fade-up"
                data-aos-duration="800"
                className="text-center max-w-2xl mx-auto mb-10 xs:mb-12 sm:mb-16"
            >
                <span className="text-[10px] xs:text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2.5 xs:px-3 py-1 rounded-full inline-block">
                    {t('steps.badge')}
                </span>
                <h2 className="text-2xl xs:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 xs:mt-4 tracking-tight">
                    {t('steps.title')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2.5 xs:mt-3 font-medium text-xs xs:text-sm md:text-base px-2">
                    {t('steps.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xs:gap-8 relative">
                <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-gray-200 dark:border-red-500/30 pointer-events-none z-0"></div>

                {/* 1-qadam */}
                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="800"
                    className="flex flex-col items-center text-center relative z-10 group cursor-pointer bg-transparent border-0 p-0 appearance-none"
                    aria-label={t('steps.step1Title')}
                >
                    <div className="w-14 h-14 xs:w-16 xs:h-16 rounded-xl xs:rounded-2xl flex items-center justify-center font-black text-lg xs:text-xl shadow-md group-hover:border-red-500 group-hover:text-red-400 group-hover:scale-110 group-active:scale-95 transition-all duration-300 mb-4 xs:mb-6 glass-card backdrop-blur-xl border border-red-500/30 bg-[#050505]/60 text-gray-900 dark:text-white">
                        01
                    </div>
                    <h3 className="text-lg xs:text-xl font-bold text-gray-950 dark:text-white mb-1.5 xs:mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                        {t('steps.step1Title')}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs xs:text-sm font-medium leading-relaxed max-w-xs px-2">
                        {t('steps.step1Desc')}
                    </p>
                </button>

                {/* 2-qadam */}
                <button
                    type="button"
                    onClick={() => navigate('/level-test')}
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="800"
                    className="flex flex-col items-center text-center relative z-10 group cursor-pointer bg-transparent border-0 p-0 appearance-none"
                    aria-label={t('steps.step2Title')}
                >
                    <div className="w-14 h-14 xs:w-16 xs:h-16 rounded-xl xs:rounded-2xl flex items-center justify-center font-black text-lg xs:text-xl shadow-md group-hover:border-red-500 group-hover:text-red-400 group-hover:scale-110 group-active:scale-95 transition-all duration-300 mb-4 xs:mb-6 glass-card backdrop-blur-xl border border-red-500/30 bg-[#050505]/60 text-gray-900 dark:text-white">
                        02
                    </div>
                    <h3 className="text-lg xs:text-xl font-bold text-gray-950 dark:text-white mb-1.5 xs:mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                        {t('steps.step2Title')}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs xs:text-sm font-medium leading-relaxed max-w-xs px-2">
                        {t('steps.step2Desc')}
                    </p>
                </button>

                {/* 3-qadam */}
                <button
                    type="button"
                    onClick={() => navigate('/pricing')}
                    data-aos="fade-up"
                    data-aos-delay="300"
                    data-aos-duration="800"
                    className="flex flex-col items-center text-center relative z-10 group cursor-pointer bg-transparent border-0 p-0 appearance-none"
                    aria-label={t('steps.step3Title')}
                >
                    <div className="w-14 h-14 xs:w-16 xs:h-16 rounded-xl xs:rounded-2xl flex items-center justify-center font-black text-lg xs:text-xl shadow-[0_8px_30px_rgba(220,38,38,0.4)] group-hover:bg-red-500 group-hover:text-white group-hover:scale-110 group-active:scale-95 transition-all duration-300 mb-4 xs:mb-6 bg-gradient-to-br from-red-600 to-rose-600 text-white border border-red-400/50">
                        03
                    </div>
                    <h3 className="text-lg xs:text-xl font-bold text-gray-950 dark:text-white mb-1.5 xs:mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                        {t('steps.step3Title')}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs xs:text-sm font-medium leading-relaxed max-w-xs px-2">
                        {t('steps.step3Desc')}
                    </p>
                </button>

            </div>
        </div>
    )
}