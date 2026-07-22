import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import './home.css';

import { Pagination, Autoplay } from 'swiper/modules';
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Home() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 100,
        })
    }, [])

    return (
        <div className='max-w-7xl pt-20 sm:pt-24 lg:pt-28 mx-auto px-4 sm:px-6 lg:px-8 select-none font-sans transition-colors duration-200'>
            <div
                data-aos="fade-up"
                data-aos-duration="600"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white dark:bg-gray-950 p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl border border-red-100/80 dark:border-gray-800 overflow-hidden"
            >

                <div
                    data-aos="fade-right"
                    data-aos-duration="800"
                    className="flex flex-col justify-center space-y-4 sm:space-y-6 max-w-xl text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-bold w-fit shadow-sm">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {t('home.badge')}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                        {t('home.titlePrefix')} <span className="text-red-600">{t('home.titleHighlight')}</span>.
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        {t('home.description')}
                    </p>
                </div>

                <div
                    data-aos="fade-left"
                    data-aos-duration="800"
                    className="w-full h-[320px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-lg border border-gray-100/50 dark:border-gray-800 relative group"
                >
                    <Swiper
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className="mySwiper h-full w-full"
                    >
                        <SwiperSlide className="h-full w-full">
                            <div className='h-full w-full relative'>
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2340&auto=format&fit=crop"
                                    alt="Students studying English"
                                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-700'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="h-full w-full">
                            <div className='h-full w-full relative'>
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2340&auto=format&fit=crop"
                                    alt="Interactive classroom"
                                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-700'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="h-full w-full">
                            <div className='h-full w-full relative'>
                                <img
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2340&auto=format&fit=crop"
                                    alt="Speaking club discussion"
                                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-700'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

            </div>
        </div>
    );
}