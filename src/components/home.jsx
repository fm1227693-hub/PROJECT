import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import './home.css';

import { Pagination, Autoplay, EffectCube } from 'swiper/modules';
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Home() {
    const { t } = useTranslation()

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 50,
        })
    }, [])

    return (
        <div className='max-w-7xl pt-24 sm:pt-28 lg:pt-32 mx-auto px-4 sm:px-6 lg:px-8 select-none font-sans transition-colors duration-200'>
            <div
                data-aos="fade-down"
                data-aos-duration="800"
                className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center bg-gray-50 dark:bg-gray-900 p-6 sm:p-10 md:p-14 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative"
            >
                {/* Left Content */}
                <div
                    data-aos="fade-right"
                    data-aos-duration="900"
                    className="flex flex-col justify-center space-y-6 lg:w-1/2 text-left"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold w-fit shadow-md shadow-red-500/20">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                        {t('home.badge')}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
                        {t('home.titlePrefix')} <span className="text-red-600">{t('home.titleHighlight')}</span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        {t('home.description')}
                    </p>
                </div>

                {/* Right Cube Effect Slider */}
                <div
                    data-aos="fade-left"
                    data-aos-duration="900"
                    className="w-full lg:w-1/2 flex justify-center items-center py-6"
                >
                    <Swiper
                        effect={'cube'}
                        grabCursor={true}
                        loop={true}
                        cubeEffect={{
                            shadow: true,
                            slideShadows: true,
                            shadowOffset: 20,
                            shadowScale: 0.94,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay, EffectCube]}
                        className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-2xl shadow-2xl"
                    >
                        <SwiperSlide className="rounded-2xl overflow-hidden bg-white dark:bg-gray-950">
                            <div className='h-full w-full relative group'>
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=800&fit=crop"
                                    alt="Students studying English"
                                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-700'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-6">
                                    <span className="text-white font-bold text-lg bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-700/55">
                                        Modern Atmosphere
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="rounded-2xl overflow-hidden bg-white dark:bg-gray-950">
                            <div className='h-full w-full relative group'>
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=800&fit=crop"
                                    alt="Interactive classroom"
                                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-700'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-6">
                                    <span className="text-white font-bold text-lg bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-700/55">
                                        Interactive Classes
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="rounded-2xl overflow-hidden bg-white dark:bg-gray-950">
                            <div className='h-full w-full relative group'>
                                <img
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=800&fit=crop"
                                    alt="Speaking club discussion"
                                    className='h-full w-full object-cover group-hover:scale-105 transition-transform duration-700'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent flex items-end p-6">
                                    <span className="text-white font-bold text-lg bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-700/55">
                                        Speaking Clubs
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </div>
    );
}