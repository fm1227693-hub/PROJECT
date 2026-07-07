import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import './home.css';

import { Pagination, Autoplay } from 'swiper/modules';

export default function Home() {
    return (
        <div className='max-w-7xl pt-28 mx-auto px-6 lg:px-8 select-none font-sans transition-colors duration-200'>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white dark:bg-gray-950 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100/80 dark:border-gray-800 overflow-hidden">

                {/* Matnlar qismi */}
                <div className="flex flex-col justify-center space-y-6 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-semibold w-fit">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                        New Dashboard Features Live
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                        Lorem ipsum dolor sit, amet consectetur <span className="text-blue-500">adipisicing elit</span>.
                    </h1>

                    <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        Aliquid error fugiat, nostrum modi cum in? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt voluptate rerum error distinctio.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <button className="px-6 py-3 bg-gray-950 dark:bg-white dark:text-gray-950 hover:bg-gray-800 dark:hover:bg-gray-100 text-white font-bold rounded-xl shadow-md transition-all duration-200 text-sm">
                            Get Started
                        </button>
                        <button className="px-6 py-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200/60 dark:border-gray-800 transition-all duration-200 text-sm">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Swiper Slayder qismi */}
                <div className="w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden shadow-md border border-gray-100/50 dark:border-gray-800">
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
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                                    alt="Dashboard Analytics"
                                    className='h-full w-full object-cover'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="h-full w-full">
                            <div className='h-full w-full relative'>
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop"
                                    alt="Data Charts"
                                    className='h-full w-full object-cover'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="h-full w-full">
                            <div className='h-full w-full relative'>
                                <img
                                    src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2340&auto=format&fit=crop"
                                    alt="Design and Setup"
                                    className='h-full w-full object-cover'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

            </div>
        </div>
    );
}