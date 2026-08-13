import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaArrowRight, FaFire, FaUser, FaPhoneAlt, FaPaperPlane, FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';

import './home.css';

import { Pagination, Autoplay, EffectCube } from 'swiper/modules';

export default function Home() {
    const { t } = useTranslation()

    // Lead Form uchun state'lar
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const BOT_TOKEN = "8722121979:AAFh-CGYP26-mjBW3-iM1lqboGAEeATB1hA"
    const CHAT_ID = "6383523156"

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim() || !phone.trim()) {
            setError("Iltimos, barcha maydonlarni to'ldiring!")
            return
        }

        setError('')
        setLoading(true)

        const message = `Yangi murojaat (Optimum):\n\nIsm: ${name}\nTel: ${phone}`

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                }),
            })

            const data = await response.json()

            if (data.ok) {
                setSuccess(true)
                setName('')
                setPhone('')
                setTimeout(() => {
                    setSuccess(false)
                    setIsOpen(false)
                }, 4000)
            } else {
                setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
            }
        } catch (err) {
            setError("Internet aloqasini tekshiring.")
        } finally {
            setLoading(false)
        }
    }

    

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="max-w-7xl pt-24 sm:pt-28 lg:pt-32 mx-auto px-3 sm:px-6 lg:px-8 select-none transition-colors duration-200"
        >
            {/* Asosiy Banner Qismi - Ultra-Premium Glassmorphism */}
            <div
                data-aos="fade-down"
                data-aos-duration="800"
                className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center glass-card p-6 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[3rem] relative overflow-hidden group transition-all duration-500"
            >
                {/* Dynamic Lighting Backdrop */}
                <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-gradient-to-br from-red-600/20 via-rose-500/10 to-transparent rounded-full blur-[130px] pointer-events-none animate-pulse-slow"></div>
                <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] bg-gradient-to-tr from-amber-500/15 via-red-500/10 to-transparent rounded-full blur-[130px] pointer-events-none animate-pulse-slow"></div>

                {/* Left Content */}
                <div
                    data-aos="fade-right"
                    data-aos-duration="900"
                    className="flex flex-col justify-center space-y-6 lg:w-1/2 text-left relative z-10 w-full"
                >
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-red-600/90 via-rose-600 to-red-700 text-white rounded-full text-xs font-extrabold w-fit shadow-lg shadow-red-600/30 tracking-wider uppercase border border-white/20">
                        <FaFire className="w-3.5 h-3.5 animate-bounce text-amber-300" />
                        <span>{t('home.badge')}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.12] font-heading">
                        {t('home.titlePrefix')}{' '}
                        <span className="text-red-600 dark:text-red-500">
                            {t('home.titleHighlight')}
                        </span>
                    </h1>

                    <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        {t('home.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
                        <Link
                            to="/form"
                            className="relative group px-5 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-2xl hover:shadow-red-600/50 transition-all duration-300 flex items-center justify-center gap-2.5 text-xs sm:text-sm cursor-pointer hover:-translate-y-0.5 active:scale-95 overflow-hidden text-center"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                            <span className="relative z-10 text-center">{t('home.enrollBtn', 'Bepul darsga yozilish')}</span>
                            <FaArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1.5 transition-transform shrink-0" />
                        </Link>
                        
                        <Link
                            to="/about"
                            className="px-8 py-4 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 text-gray-900 dark:text-white font-extrabold rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 text-sm text-center cursor-pointer hover:-translate-y-0.5 active:scale-95 backdrop-blur-md"
                        >
                            {t('home.moreInfoBtn', "Batafsil ma'lumot")}
                        </Link>
                    </div>
                </div>

                {/* Right Cube Effect Slider */}
                <div
                    data-aos="fade-left"
                    data-aos-duration="900"
                    className="w-full lg:w-1/2 flex justify-center items-center py-2 relative z-10 overflow-hidden"
                >
                    <Swiper
                        effect={'cube'}
                        grabCursor={true}
                        loop={true}
                        cubeEffect={{
                            shadow: false,
                            slideShadows: false,
                            shadowOffset: 20,
                            shadowScale: 0.90,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay, EffectCube]}
                        className="w-[280px] h-[280px] xs:w-[340px] xs:h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] xl:w-[520px] xl:h-[520px] rounded-2xl sm:rounded-[2rem] max-w-full"
                    >
                        <SwiperSlide className="rounded-2xl sm:rounded-[2rem] overflow-hidden bg-transparent">
                            <div className="h-full w-full relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=800&fit=crop"
                                    alt="Students studying English"
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex items-end p-4 sm:p-6">
                                    <span className="text-white font-extrabold text-xs sm:text-base bg-gray-900/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700/50 shadow-lg">
                                        {t('home.modernAtmosphere')}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="rounded-2xl sm:rounded-[2rem] overflow-hidden bg-transparent">
                            <div className="h-full w-full relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=800&fit=crop"
                                    alt="Interactive classroom"
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex items-end p-4 sm:p-6">
                                    <span className="text-white font-extrabold text-xs sm:text-base bg-gray-900/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700/50 shadow-lg">
                                        {t('home.interactiveClasses')}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="rounded-2xl sm:rounded-[2rem] overflow-hidden bg-transparent">
                            <div className="h-full w-full relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=800&fit=crop"
                                    alt="Speaking club discussion"
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex items-end p-4 sm:p-6">
                                    <span className="text-white font-extrabold text-xs sm:text-base bg-gray-900/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700/50 shadow-lg">
                                        {t('home.speakingClubs')}
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

            {/* Lead Form Section (Hozirdan yozilish tugmasi bilan) */}
        
        </div>
    );
}