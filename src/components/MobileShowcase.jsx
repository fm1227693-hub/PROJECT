import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import {
    FaPlus,
    FaArrowRight,
    FaBell,
    FaAward,
    FaGraduationCap,
    FaUserCheck,
    FaCommentDots,
    FaChalkboardTeacher,
    FaStar,
    FaTimes,
    FaCheckCircle
} from 'react-icons/fa'

export default function MobileShowcase() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [currentTime, setCurrentTime] = useState('')
    const [activeNotification, setActiveNotification] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [mentorPillModal, setMentorPillModal] = useState(null)

    // Live Uzbekistan Time (Asia/Tashkent UTC+5)
    useEffect(() => {
        const updateUzbekTime = () => {
            const now = new Date()
            const timeString = now.toLocaleTimeString('en-GB', {
                timeZone: 'Asia/Tashkent',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            })
            setCurrentTime(timeString)
        }

        updateUzbekTime()
        const timer = setInterval(updateUzbekTime, 10000)

        return () => clearInterval(timer)
    }, [])

    return (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 select-none overflow-hidden">
            {/* Direct Editorial Composition without enclosing card */}
            <div className="w-full text-slate-900 dark:text-white relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
                {/* Asymmetrical Focal Glow Behind Phone (Hardware-optimized) */}
                <div 
                  className="absolute top-1/2 right-10 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none -z-10 opacity-70"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(220, 38, 38, 0.12) 0%, transparent 68%)"
                  }}
                />
                <div 
                  className="absolute top-10 left-10 w-[350px] h-[350px] pointer-events-none -z-10 opacity-60"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(14, 165, 233, 0.08) 0%, transparent 68%)"
                  }}
                />

                {/* Left Side: Headline, Subtitle, Pill Button */}
                <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 text-center sm:text-left relative z-10 self-center my-auto py-2 sm:py-6 lg:py-8 flex flex-col items-center sm:items-start">

                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-heading">
                        {t('mobileShowcase.n26Title', 'IELTS tayyorgarlik mutlaqo yangi bosqichda')}
                    </h2>

                    <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
                        {t('mobileShowcase.n26Subtitle', 'Shaxsiy platforma orqali Insholarni sun\'iy intellektda baholang, real CDI testlarini topshiring va natijalaringizni bir joyda kuzatib boring.')}
                    </p>

                    <div className="pt-1 sm:pt-2">
                        <Link
                            to="/level-test"
                            className="relative overflow-hidden inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-600/40 border border-white/20 group z-10"
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
                            <span className="relative z-10">{t('mobileShowcase.n26Btn', 'Bepul daraja testini topshirish')}</span>
                            <FaArrowRight className="relative z-10 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Right Side: iPhone Mockup */}
                <div className="w-full lg:w-1/2 flex justify-center items-end relative z-10 self-end pt-0 sm:pt-4 lg:pt-3 overflow-hidden">

                    {/* Thin Sleek iPhone Chassis */}
                    <div className="relative w-[285px] sm:w-[365px] max-w-full bg-[#141a29] border border-slate-700/80 rounded-t-[40px] sm:rounded-t-[48px] rounded-b-none p-[3px] sm:p-[4px] pb-0 shadow-[0_25px_60px_rgba(0,0,0,0.8)] select-none translate-y-5 sm:translate-y-8 lg:translate-y-10">

                        {/* Earpiece Speaker Slit on top frame rim */}
                        <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-10 sm:w-12 h-[2px] bg-[#090d16] rounded-full z-50 opacity-90" />

                        {/* Antenna Lines */}
                        <div className="absolute top-10 -left-[1px] w-[2px] h-3 bg-slate-500/50" />
                        <div className="absolute bottom-10 -left-[1px] w-[2px] h-3 bg-slate-500/50" />
                        <div className="absolute top-10 -right-[1px] w-[2px] h-3 bg-slate-500/50" />
                        <div className="absolute bottom-10 -right-[1px] w-[2px] h-3 bg-slate-500/50" />

                        {/* Metallic Side Buttons */}
                        <div className="absolute -left-[4.5px] top-20 w-[3px] h-6 bg-slate-400 rounded-l-sm" />
                        <div className="absolute -left-[4.5px] top-32 w-[3px] h-11 bg-slate-400 rounded-l-sm" />
                        <div className="absolute -left-[4.5px] top-47 w-[3px] h-11 bg-slate-400 rounded-l-sm" />
                        <div className="absolute -right-[4.5px] top-36 w-[3px] h-15 bg-slate-400 rounded-r-sm" />

                        {/* Black OLED Screen Background */}
                        <div className="w-full h-full bg-black rounded-t-[36px] sm:rounded-t-[44px] rounded-b-none p-[2px] pb-0 relative overflow-hidden flex flex-col justify-between">

                            {/* Authentic Apple Dynamic Island & Front Camera */}
                            <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-[82px] sm:w-[94px] h-[27px] sm:h-[32px] bg-black rounded-full z-40 flex items-center justify-between px-2.5 sm:px-3 border border-black shadow-md">
                                {/* Left: Face ID Sensor */}
                                <div className="w-[24px] sm:w-[28px] h-[9px] sm:h-[11px] rounded-full bg-[#050507] flex items-center justify-center">
                                    <div className="w-[6px] sm:w-[7px] h-[6px] sm:h-[7px] rounded-full bg-[#020204]" />
                                </div>

                                {/* Right: TrueDepth Camera Lens with authentic glass optics */}
                                <div className="w-[12px] sm:w-[14px] h-[12px] sm:h-[14px] rounded-full bg-[#040406] ring-1 ring-white/10 flex items-center justify-center relative">
                                    <div className="w-[7px] sm:w-[8.5px] h-[7px] sm:h-[8.5px] rounded-full bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
                                        <div className="w-[3px] sm:w-[3.5px] h-[3px] sm:h-[3.5px] rounded-full bg-[#2563eb] shadow-[0_0_3px_#3b82f6] relative">
                                            <div className="absolute top-[0.5px] right-[0.5px] w-[1px] h-[1px] bg-white rounded-full opacity-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* UPPER FLOATING WHITE CARD */}
                            <div className="w-full bg-white shadow-md rounded-t-[34px] sm:rounded-t-[42px] rounded-b-[28px] sm:rounded-b-[36px] pt-2 sm:pt-2.5 px-2.5 sm:px-3.5 pb-2 sm:pb-3 font-sans text-slate-900 relative">

                                {/* Status Bar (Live Real-Time Uzbekistan HH:mm, Cellular Signal, Wi-Fi, Battery) */}
                                <div className="flex items-center justify-between px-1 sm:px-1.5 pt-0.5 pb-1 text-slate-900 font-sans">
                                    {/* Left: Live Real-Time Uzbekistan Clock */}
                                    <span className="font-extrabold text-[11px] sm:text-[13px] tracking-tight pl-0.5 sm:pl-1 text-slate-900">
                                        {currentTime || '23:05'}
                                    </span>

                                    {/* Right: Cellular Signal + Wi-Fi + Battery */}
                                    <div className="flex items-center gap-1 sm:gap-1.5 pr-0.5 sm:pr-1 text-slate-900">
                                        {/* 4 Ascending Cellular Signal Bars (Tarmoq belgilari) */}
                                        <svg className="w-3.5 sm:w-4 h-2.5 sm:h-3 text-slate-900 shrink-0" viewBox="0 0 17 12" fill="currentColor">
                                            <rect x="0" y="7.5" width="3" height="4.5" rx="0.8" />
                                            <rect x="4.5" y="5" width="3" height="7" rx="0.8" />
                                            <rect x="9" y="2.5" width="3" height="9.5" rx="0.8" />
                                            <rect x="13.5" y="0" width="3" height="12" rx="0.8" />
                                        </svg>

                                        {/* Authentic Apple 3-Arc Wi-Fi Icon */}
                                        <svg className="w-3.5 sm:w-4 h-2.5 sm:h-3 text-slate-900 shrink-0" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                            <path d="M1.5 3C5 0.8 11 0.8 14.5 3" />
                                            <path d="M4.5 6C7 4.5 9 4.5 11.5 6" />
                                            <circle cx="8" cy="9.5" r="1.3" fill="currentColor" stroke="none" />
                                        </svg>

                                        {/* Authentic Apple Battery */}
                                        <div className="flex items-center shrink-0">
                                            <div className="w-[18px] sm:w-[21px] h-[9.5px] sm:h-[11px] border-[1.2px] sm:border-[1.4px] border-slate-900 rounded-[3px] sm:rounded-[4px] p-[1px] sm:p-[1.2px] flex items-center relative">
                                                <div className="w-full h-full bg-slate-900 rounded-[1.5px] sm:rounded-[1.8px]" />
                                            </div>
                                            <div className="w-[1.5px] sm:w-[1.8px] h-[3px] sm:h-[3.5px] bg-slate-900 rounded-r-[1px] -ml-[0.5px]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Mentor App Header Row */}
                                <div className="flex items-center justify-between py-1.5 sm:py-2 px-0.5 mt-0.5 sm:mt-1">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        {/* Brand Red Chalkboard Icon -> navigates to /about */}
                                        <button
                                            type="button"
                                            onClick={() => navigate('/about')}
                                            className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-r from-red-600/20 to-rose-600/20 border border-red-500/30 flex items-center justify-center text-red-600 font-black shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all"
                                            title="Markaz haqida ma'lumot"
                                        >
                                            <FaChalkboardTeacher className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
                                        </button>
                                        {/* Brand Red Plus Button -> navigates to /form */}
                                        <Link
                                            to="/form"
                                            className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center text-[10px] sm:text-[12px] cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm shadow-red-600/30 border border-white/20"
                                            title="Ro'yxatdan o'tish"
                                        >
                                            <FaPlus />
                                        </Link>
                                    </div>

                                    {/* Bell & Real Mentor Photo Avatar */}
                                    <div className="bg-red-500/10 p-1 rounded-full flex items-center gap-1 sm:gap-1.5 border border-red-500/20">
                                        <button
                                            type="button"
                                            onClick={() => setActiveNotification((prev) => !prev)}
                                            className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white flex items-center justify-center text-slate-800 shadow-sm relative cursor-pointer hover:scale-110 active:scale-95 transition-all"
                                            title="Bildirishnomalar"
                                        >
                                            <FaBell className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-800" />
                                            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/about')}
                                            className="cursor-pointer hover:scale-110 active:scale-95 transition-all"
                                            title="Ruhillo Asrorov profili"
                                        >
                                            <img
                                                src="https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-23_23-14-12.jpg"
                                                alt="Mentor Ruhillo Asrorov"
                                                className="w-6.5 sm:w-7.5 h-6.5 sm:h-7.5 rounded-full object-cover object-top ring-2 ring-red-500 shadow-sm"
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Live Notification Dropdown inside Phone */}
                                {activeNotification && (
                                    <div className="absolute top-16 left-3 right-3 z-50 bg-[#0c0d10] border border-red-500/40 rounded-2xl p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 text-white">
                                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                                            <span className="text-[11px] font-bold text-red-400 flex items-center gap-1.5">
                                                <FaBell className="w-2.5 h-2.5 text-red-500" />
                                                Yangi xabar
                                            </span>
                                            <button 
                                                onClick={() => setActiveNotification(false)}
                                                className="text-white/60 hover:text-white text-xs cursor-pointer"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-white/80 mt-1.5 leading-snug">
                                            IELTS 8.0 guruhiga qabul davom etmoqda. Bepul konsultatsiyaga yoziling!
                                        </p>
                                        <button
                                            onClick={() => { setActiveNotification(false); navigate('/form'); }}
                                            className="mt-2 w-full py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition-all text-center cursor-pointer"
                                        >
                                            Yozilish →
                                        </button>
                                    </div>
                                )}

                                {/* Main Account Card -> Ruhillo Asrorov IELTS Score & Experience */}
                                <div 
                                    onClick={() => navigate('/about')}
                                    className="mt-1 sm:mt-1.5 bg-slate-50 hover:bg-slate-100 p-2.5 sm:p-3 rounded-[20px] sm:rounded-[26px] border border-slate-200 text-slate-900 shadow-xs cursor-pointer transition-all hover:scale-[1.01]"
                                    title="Mentor haqida batafsil"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] sm:text-[13px] font-bold text-red-950">Ruhillo Asrorov</span>
                                    </div>

                                    <div className="mt-0.5 sm:mt-1 flex items-baseline justify-between gap-1">
                                        <div>
                                            <h2 className="text-[26px] sm:text-[36px] font-black text-slate-900 tracking-tight leading-none">
                                                IELTS 8.0
                                            </h2>
                                            <p className="text-[9.5px] sm:text-[11px] font-semibold text-slate-600 mt-0.5 sm:mt-1">
                                                {t('mobileShowcase.seniorRole', 'Senior Instructor • 6+ yillik tajriba')}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMentorPillModal({
                                                    title: "Senior IELTS Instruktor",
                                                    desc: "Ruhillo Asrorov — xalqaro IELTS 8.0 sertifikati egasi va Optimum bosh mentori."
                                                });
                                            }}
                                            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-[10px] sm:text-[12px] font-extrabold rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-1.5 shadow-md shadow-red-600/30 transition-transform active:scale-95 border border-white/20 shrink-0 cursor-pointer"
                                        >
                                            <FaAward className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-300" />
                                            <span>Senior</span>
                                        </button>
                                    </div>
                                </div>

                                {/* 4 Circular Red/Rose Brand Gradient Action Buttons (Now fully clickable) */}
                                <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-2 sm:mt-3 mb-0.5 text-center px-0.5">
                                    <button 
                                        type="button"
                                        onClick={() => setMentorPillModal({
                                            title: "IELTS 8.0 Sertifikati",
                                            desc: "Ruhillo Asrorov: Listening 8.5, Reading 8.5, Writing 7.5, Speaking 8.0 ball to'plagan."
                                        })}
                                        className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer focus:outline-none"
                                    >
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-700 group-hover:scale-110 group-active:scale-95 text-white flex items-center justify-center text-base sm:text-lg shadow-md shadow-red-600/30 transition-all border border-white/20">
                                            <FaAward className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        </div>
                                        <span className="text-[10px] sm:text-[12px] font-bold text-slate-900 leading-tight">IELTS 8.0</span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => setMentorPillModal({
                                            title: "6+ Yillik Professional Tajriba",
                                            desc: "Cambridge metodologiyasi bo'yicha 6 yildan ortiq davom etgan muvaffaqiyatli dars berish tajribasi."
                                        })}
                                        className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer focus:outline-none"
                                    >
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-700 group-hover:scale-110 group-active:scale-95 text-white flex items-center justify-center text-base sm:text-lg shadow-md shadow-red-600/30 transition-all border border-white/20">
                                            <FaGraduationCap className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        </div>
                                        <span className="text-[10px] sm:text-[12px] font-bold text-slate-900 leading-tight">
                                            {t('mobileShowcase.badge1', '6+ Yil')}
                                        </span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => setMentorPillModal({
                                            title: "200+ IELTS Bitiruvchilari",
                                            desc: "200 dan ortiq o'quvchilar IELTS 7.0 va 7.5+ ballik sertifikatlarni qo'lga kiritishgan."
                                        })}
                                        className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer focus:outline-none"
                                    >
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-700 group-hover:scale-110 group-active:scale-95 text-white flex items-center justify-center text-base sm:text-lg shadow-md shadow-red-600/30 transition-all border border-white/20">
                                            <FaUserCheck className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        </div>
                                        <span className="text-[10px] sm:text-[12px] font-bold text-slate-900 leading-tight">
                                            {t('mobileShowcase.badge2', '200+ Student')}
                                        </span>
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={() => setMentorPillModal({
                                            title: "Speaking & Fluency Maxsus Kursi",
                                            desc: "Nutq ravonligi, talaffuz va leksik resurslarni rivojlantirish bo'yicha intensiv darslar."
                                        })}
                                        className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer focus:outline-none"
                                    >
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-700 group-hover:scale-110 group-active:scale-95 text-white flex items-center justify-center text-base sm:text-lg shadow-md shadow-red-600/30 transition-all border border-white/20">
                                            <FaCommentDots className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                                        </div>
                                        <span className="text-[10px] sm:text-[12px] font-bold text-slate-900 leading-tight">
                                            {t('mobileShowcase.badge3', 'Speaking')}
                                        </span>
                                    </button>
                                </div>

                            </div>

                            {/* SEPARATOR GAP */}
                            <div className="h-1.5 sm:h-2 bg-slate-100 w-full shrink-0 border-y border-slate-200/50" />

                            {/* LOWER FLOATING WHITE CARD */}
                            <div className="w-full bg-white border-t border-slate-200/80 shadow-md rounded-t-[28px] sm:rounded-t-[36px] rounded-b-none p-2.5 sm:p-3 pt-2.5 sm:pt-3 flex flex-col justify-between flex-1 pb-2 sm:pb-3">
                                <div className="flex items-center justify-between mb-2 sm:mb-3 px-0.5 sm:px-1">
                                    <h4 className="text-[14px] sm:text-[16px] font-black text-slate-900">
                                        {t('mobileShowcase.studentsTitle', "O'quvchilar Natijalari")}
                                    </h4>
                                    <button
                                        onClick={() => {
                                            const targetElement = document.getElementById('results-section')
                                            if (!targetElement) return
                                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 30
                                            const startPosition = window.pageYOffset
                                            const distance = targetPosition - startPosition
                                            let startTime = null
                                            const duration = 1200

                                            const easeInOutCubic = (t) => {
                                                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
                                            }

                                            const animation = (currentTime) => {
                                                if (startTime === null) startTime = currentTime
                                                const timeElapsed = currentTime - startTime
                                                const progress = Math.min(timeElapsed / duration, 1)
                                                const easeProgress = easeInOutCubic(progress)
                                                window.scrollTo(0, startPosition + distance * easeProgress)
                                                if (timeElapsed < duration) {
                                                    requestAnimationFrame(animation)
                                                }
                                            }
                                            requestAnimationFrame(animation)
                                        }}
                                        className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-[10px] sm:text-[12px] font-extrabold rounded-full cursor-pointer shadow-sm shadow-red-600/30 transition-all active:scale-95 border border-white/20"
                                    >
                                        {t('mobileShowcase.seeAllBtn', 'Barchasi')}
                                    </button>
                                </div>

                                {/* 2 Mentor Students (Clickable to view details) */}
                                <div className="space-y-1.5 sm:space-y-2 overflow-y-auto max-h-[105px] sm:max-h-[120px] scrollbar-none px-0.5 sm:px-1">
                                    {/* Student 1: Javohir Munirov - Band 7.5 */}
                                    <div 
                                        onClick={() => setSelectedStudent({
                                            name: "Javohir Munirov",
                                            score: "7.5",
                                            details: "Listening: 9.0 • Reading: 7.5 • Writing: 7.0 • Speaking: 6.5",
                                            image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg"
                                        })}
                                        className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 cursor-pointer transition-all active:scale-98"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <img
                                                src="https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg"
                                                alt="Javohir Munirov"
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-2 ring-red-500/40 shadow-sm"
                                            />
                                            <div>
                                                <span className="text-[11px] sm:text-[13px] font-extrabold text-slate-900 block leading-tight">Javohir Munirov</span>
                                                <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 block mt-0.5">Listening 9.0 • Reading 7.5</span>
                                            </div>
                                        </div>
                                        <span className="text-[11px] sm:text-[13px] font-black text-red-600 shrink-0 bg-red-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl flex items-center gap-1 border border-red-500/30">
                                            <FaStar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500" />
                                            <span>7.5</span>
                                        </span>
                                    </div>

                                    {/* Student 2: Jahongir Zayniddinov - Band 7.0 */}
                                    <div 
                                        onClick={() => setSelectedStudent({
                                            name: "Jahongir Zayniddinov",
                                            score: "7.0",
                                            details: "Listening: 8.5 • General: 7.0 • Reading: 7.0 • Speaking: 6.5",
                                            image: "https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg"
                                        })}
                                        className="flex items-center justify-between py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 cursor-pointer transition-all active:scale-98"
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <img
                                                src="https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg"
                                                alt="Jahongir Zayniddinov"
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-2 ring-red-500/40 shadow-sm"
                                            />
                                            <div>
                                                <span className="text-[11px] sm:text-[13px] font-extrabold text-slate-900 block leading-tight">Jahongir Zayniddinov</span>
                                                <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 block mt-0.5">Listening 8.5 • General 7.0</span>
                                            </div>
                                        </div>
                                        <span className="text-[11px] sm:text-[13px] font-black text-red-600 shrink-0 bg-red-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl flex items-center gap-1 border border-red-500/30">
                                            <FaStar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-500" />
                                            <span>7.0</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Home Bar Indicator -> scrolls to results */}
                                <div 
                                    onClick={() => {
                                        const el = document.getElementById('results-section')
                                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="w-20 sm:w-24 h-[3px] sm:h-[3.5px] bg-slate-900 hover:bg-red-600 rounded-full mx-auto mt-2 sm:mt-3 shrink-0 opacity-90 cursor-pointer transition-colors" 
                                    title="Natijalarni ko'rish"
                                />
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Interactive Student Modal Popup */}
            {selectedStudent && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setSelectedStudent(null)}
                >
                    <div 
                        className="bg-[#0c0d10] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-4 mb-4">
                            <img 
                                src={selectedStudent.image} 
                                alt={selectedStudent.name} 
                                className="w-14 h-14 rounded-full object-cover ring-2 ring-red-500 shadow-md"
                            />
                            <div>
                                <h3 className="font-extrabold text-lg text-white font-heading">{selectedStudent.name}</h3>
                                <div className="flex items-center gap-1.5 text-red-400 font-black text-sm">
                                    <FaStar className="text-amber-400" />
                                    <span>IELTS Overall: {selectedStudent.score}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-xs text-slate-300 mb-5 leading-relaxed">
                            {selectedStudent.details}
                        </div>
                        <button
                            onClick={() => {
                                setSelectedStudent(null);
                                const el = document.getElementById('results-section');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full font-bold text-xs shadow-lg shadow-red-600/40 transition-all cursor-pointer text-center"
                        >
                            Barcha sertifikatlarni ko'rish →
                        </button>
                    </div>
                </div>
            )}

            {/* Interactive Mentor Pill Feature Modal */}
            {mentorPillModal && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setMentorPillModal(null)}
                >
                    <div 
                        className="bg-[#0c0d10] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setMentorPillModal(null)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white cursor-pointer"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4">
                            <FaCheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-extrabold text-lg text-white font-heading mb-2">{mentorPillModal.title}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed mb-5">
                            {mentorPillModal.desc}
                        </p>
                        <button
                            onClick={() => {
                                setMentorPillModal(null);
                                navigate('/about');
                            }}
                            className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full font-bold text-xs shadow-lg shadow-red-600/40 transition-all cursor-pointer text-center"
                        >
                            Mentor sahifasiga o'tish →
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}
