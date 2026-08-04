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
import AOS from 'aos'
import 'aos/dist/aos.css'

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

        const message = `🎯 Yangi murojaat (Optimum):\n\n👤 Ism: ${name}\n📞 Tel: ${phone}`

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

    useEffect(() => {
        AOS.init({
            once: true,
            offset: 50,
        })
    }, [])

    return (
        <div 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="max-w-7xl pt-24 sm:pt-28 lg:pt-32 mx-auto px-3 sm:px-6 lg:px-8 select-none transition-colors duration-200"
        >
            {/* Asosiy Banner Qismi */}
            <div
                data-aos="fade-down"
                data-aos-duration="800"
                className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 p-5 sm:p-10 md:p-14 rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-gray-200/80 dark:border-gray-800/80 overflow-hidden relative"
            >
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Left Content */}
                <div
                    data-aos="fade-right"
                    data-aos-duration="900"
                    className="flex flex-col justify-center space-y-5 lg:w-1/2 text-left relative z-10 w-full"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-xs font-black w-fit shadow-lg shadow-red-600/25 tracking-wide">
                        <FaFire className="w-3.5 h-3.5 animate-pulse" />
                        {t('home.badge')}
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                        {t('home.titlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">{t('home.titleHighlight')}</span>
                    </h1>

                    <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        {t('home.description')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                        <Link
                            to="/form"
                            className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-2xl shadow-xl shadow-red-600/25 transition-all duration-300 flex items-center justify-center gap-3 text-sm group cursor-pointer"
                        >
                            <span>Bepul kursimizga hozir yoziling</span>
                            <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link
                            to="/about"
                            className="px-6 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 text-sm text-center cursor-pointer"
                        >
                            Batafsil ma'lumot
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
                            shadow: true,
                            slideShadows: true,
                            shadowOffset: 20,
                            shadowScale: 0.90,
                        }}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay, EffectCube]}
                        className="w-[260px] h-[260px] xs:w-[290px] xs:h-[290px] sm:w-[360px] sm:h-[360px] rounded-2xl sm:rounded-[2rem] shadow-2xl max-w-full"
                    >
                        <SwiperSlide className="rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white dark:bg-gray-950">
                            <div className="h-full w-full relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=800&fit=crop"
                                    alt="Students studying English"
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex items-end p-4 sm:p-6">
                                    <span className="text-white font-extrabold text-xs sm:text-base bg-gray-900/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700/50 shadow-lg">
                                        Modern Atmosphere
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white dark:bg-gray-950">
                            <div className="h-full w-full relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=800&fit=crop"
                                    alt="Interactive classroom"
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex items-end p-4 sm:p-6">
                                    <span className="text-white font-extrabold text-xs sm:text-base bg-gray-900/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700/50 shadow-lg">
                                        Interactive Classes
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className="rounded-2xl sm:rounded-[2rem] overflow-hidden bg-white dark:bg-gray-950">
                            <div className="h-full w-full relative group">
                                <img
                                    src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=800&fit=crop"
                                    alt="Speaking club discussion"
                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/20 to-transparent flex items-end p-4 sm:p-6">
                                    <span className="text-white font-extrabold text-xs sm:text-base bg-gray-900/70 backdrop-blur-md px-3.5 py-2 rounded-xl border border-gray-700/50 shadow-lg">
                                        Speaking Clubs
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>

            {/* Lead Form Section (Hozirdan yozilish tugmasi bilan) */}
            <div 
                data-aos="fade-up"
                data-aos-duration="800"
                className="my-12 sm:my-16"
            >
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-gray-800 overflow-hidden">
                    
                    {/* Orqa fon nur effekti */}
                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        
                        {/* Chap matn va tugma qismi */}
                        <div className="lg:w-1/2 text-left space-y-4">
                            <div className="inline-block mb-1">
                                <span className="px-3.5 py-1.5 bg-red-600/20 text-red-500 rounded-xl text-xs font-black tracking-wide border border-red-500/30 uppercase">
                                    Bepul maslahat
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                Ingliz tilini o'rganishni <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">bugun boshlang!</span>
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed">
                                Ismingiz va telefon raqamingizni qoldiring. Mutaxassislarimiz siz bilan tezda bog'lanib, bepul darsga yozishadi va barcha savollaringizga javob berishadi.
                            </p>

                            {!isOpen && (
                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsOpen(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/35 transition-all duration-300 flex items-center gap-3 text-sm cursor-pointer hover:scale-105"
                                    >
                                        <span>Hozirdan yozilish</span>
                                        <FaArrowRight className="text-xs" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* O'ng Forma qismi */}
                        <div className={`lg:w-1/2 w-full max-w-md bg-white/5 dark:bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl transition-all duration-500 ${isOpen ? 'opacity-100 scale-100' : 'hidden lg:block'}`}>
                            {success ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                                    <FaCheckCircle className="text-emerald-500 text-5xl animate-bounce" />
                                    <h3 className="text-xl font-bold text-white">Murojaatingiz qabul qilindi!</h3>
                                    <p className="text-gray-400 text-sm">Tez orada operatorlarimiz siz bilan bog'lanishadi.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-black text-white">Bepul darsga yozilish</h3>
                                        {isOpen && (
                                            <button 
                                                type="button" 
                                                onClick={() => setIsOpen(false)}
                                                className="lg:hidden text-gray-400 hover:text-white p-1 cursor-pointer"
                                            >
                                                <FaTimes />
                                            </button>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-400 text-xs rounded-xl font-medium">
                                            {error}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1.5">Ismingiz</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                                <FaUser className="text-sm" />
                                            </span>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Masalan: Aziz"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-950/60 border border-gray-800 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 mb-1.5">Telefon raqamingiz</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                                                <FaPhoneAlt className="text-sm" />
                                            </span>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+998 90 123 45 67"
                                                className="w-full pl-11 pr-4 py-3 bg-gray-950/60 border border-gray-800 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-600 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-2 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black rounded-2xl shadow-lg shadow-red-600/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <FaSpinner className="animate-spin text-base" />
                                                <span>Yuborilmoqda...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Joy band qilish</span>
                                                <FaPaperPlane className="text-xs" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}