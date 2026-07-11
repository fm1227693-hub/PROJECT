import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import './home.css';

import { Pagination, Autoplay } from 'swiper/modules';

export default function Home() {
    return (
        <div className='max-w-7xl pt-20 sm:pt-24 lg:pt-28 mx-auto px-4 sm:px-6 lg:px-8 select-none font-sans transition-colors duration-200'>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center bg-white dark:bg-gray-950 p-6 sm:p-8 md:p-12 rounded-3xl shadow-xl border border-red-100/80 dark:border-gray-800 overflow-hidden">

                <div className="flex flex-col justify-center space-y-4 sm:space-y-6 max-w-xl text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold w-fit">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                        Optimum School of English
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                        Ingliz tilini noldan boshlab <span className="text-red-600">mukammal o'rganing</span>.
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        Professional o'qituvchilar, jonli speaking klublar va xalqaro standartlarga asoslangan intensiv kurslarimizga hoziroq qo'shiling.
                    </p>

                 
                </div>

                <div className="w-full h-[320px] sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-md border border-gray-100/50 dark:border-gray-800 relative">
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
                                    className='h-full w-full object-cover'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="h-full w-full">
                            <div className='h-full w-full relative'>
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2340&auto=format&fit=crop"
                                    alt="Interactive classroom"
                                    className='h-full w-full object-cover'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="h-full w-full">
                            <div className='h-full w-full relative'>
                                <img
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2340&auto=format&fit=crop"
                                    alt="Speaking club discussion"
                                    className='h-full w-full object-cover'
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>

            </div>
        </div>
    );
}