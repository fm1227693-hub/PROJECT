import {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
    FaPlus,
    FaArrowRight,
    FaBell,
    FaAward,
    FaGraduationCap,
    FaUserCheck,
    FaCommentDots,
    FaChalkboardTeacher,
    FaStar
} from 'react-icons/fa'

export default function MobileShowcase() {
    const { t } = useTranslation()
    const [currentTime, setCurrentTime] = useState('')

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
        const timer = setInterval(updateUzbekTime, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <section className="section-pad select-none">
            <div className="container-site">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Chap — matn */}
                    <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 relative z-10">
                        <span className="eyebrow" data-reveal>
                            {t('mobileShowcase.badge', 'Shaxsiy platforma')}
                        </span>

                        <h2 className="display-2 text-ink max-w-[20ch]" data-reveal data-reveal-delay="80">
                            {t('mobileShowcase.n26Title', 'IELTS tayyorgarlik mutlaqo yangi bosqichda')}
                        </h2>

                        <p className="lede max-w-[52ch]" data-reveal data-reveal-delay="160">
                            {t('mobileShowcase.n26Subtitle', "Shaxsiy platforma orqali Insholarni sun'iy intellektda baholang, real CDI testlarini topshiring va natijalaringizni bir joyda kuzatib boring.")}
                        </p>

                        <div data-reveal data-reveal-delay="240">
                            <Link to="/level-test" className="btn btn-primary">
                                {t('mobileShowcase.n26Btn', 'Bepul daraja testini topshirish')}
                                <FaArrowRight className="w-3.5 h-3.5 btn-arrow" />
                            </Link>
                        </div>
                    </div>

                    {/* O'ng — iPhone maketi */}
                    <div className="lg:col-span-6 flex justify-center items-end relative" data-reveal data-reveal-delay="150">
                        {/* Nozik fon doirasi */}
                        <div
                            aria-hidden="true"
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full pointer-events-none"
                            style={{ background: 'radial-gradient(closest-side, var(--accent-soft), transparent)' }}
                        />

                        <div className="relative w-[280px] sm:w-[350px] max-w-full bg-[#141210] border border-[#2a2522] rounded-t-[40px] sm:rounded-t-[48px] rounded-b-none p-[3px] sm:p-[4px] pb-0 shadow-[0_36px_80px_-24px_rgba(0,0,0,0.6)] select-none translate-y-6 sm:translate-y-10 lg:translate-y-12">

                            {/* Dinamik orol */}
                            <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-10 sm:w-12 h-[2px] bg-[#090807] rounded-full z-50 opacity-90" />

                            {/* Yon tugmalar */}
                            <div className="absolute -left-[4.5px] top-20 w-[3px] h-6 bg-[#3a3430] rounded-l-sm" />
                            <div className="absolute -left-[4.5px] top-32 w-[3px] h-11 bg-[#3a3430] rounded-l-sm" />
                            <div className="absolute -left-[4.5px] top-[188px] w-[3px] h-11 bg-[#3a3430] rounded-l-sm" />
                            <div className="absolute -right-[4.5px] top-36 w-[3px] h-14 bg-[#3a3430] rounded-r-sm" />

                            {/* Ekran */}
                            <div className="w-full h-full bg-black rounded-t-[36px] sm:rounded-t-[44px] rounded-b-none p-[2px] pb-0 relative overflow-hidden flex flex-col justify-between">

                                {/* Dynamic Island */}
                                <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-[82px] sm:w-[94px] h-[27px] sm:h-[32px] bg-black rounded-full z-40 flex items-center justify-between px-2.5 sm:px-3 border border-black shadow-md">
                                    <div className="w-[24px] sm:w-[28px] h-[9px] sm:h-[11px] rounded-full bg-[#050507] flex items-center justify-center">
                                        <div className="w-[6px] sm:w-[7px] h-[6px] sm:h-[7px] rounded-full bg-[#020204]" />
                                    </div>
                                    <div className="w-[12px] sm:w-[14px] h-[12px] sm:h-[14px] rounded-full bg-[#040406] ring-1 ring-white/10 flex items-center justify-center relative">
                                        <div className="w-[7px] sm:w-[8.5px] h-[7px] sm:h-[8.5px] rounded-full bg-[#0f172a] border border-[#1e293b] flex items-center justify-center">
                                            <div className="w-[3px] sm:w-[3.5px] h-[3px] sm:h-[3.5px] rounded-full bg-[#2563eb]" />
                                        </div>
                                    </div>
                                </div>

                                {/* YUQORI KARTA — ilova interfeysi */}
                                <div className="w-full bg-[#fbf9f5] border border-white/60 rounded-t-[34px] sm:rounded-t-[42px] rounded-b-[28px] sm:rounded-b-[36px] pt-2 sm:pt-2.5 px-2.5 sm:px-3.5 pb-2 sm:pb-3 text-[#1c1917] relative">

                                    {/* Status bar ( jonli Toshkent vaqti ) */}
                                    <div className="flex items-center justify-between px-1 sm:px-1.5 pt-0.5 pb-1">
                                        <span className="font-bold text-[11px] sm:text-[13px] tracking-tight pl-0.5 sm:pl-1">
                                            {currentTime || '23:05'}
                                        </span>
                                        <div className="flex items-center gap-1 sm:gap-1.5 pr-0.5 sm:pr-1">
                                            <svg className="w-3.5 sm:w-4 h-2.5 sm:h-3 shrink-0" viewBox="0 0 17 12" fill="currentColor">
                                                <rect x="0" y="7.5" width="3" height="4.5" rx="0.8" />
                                                <rect x="4.5" y="5" width="3" height="7" rx="0.8" />
                                                <rect x="9" y="2.5" width="3" height="9.5" rx="0.8" />
                                                <rect x="13.5" y="0" width="3" height="12" rx="0.8" />
                                            </svg>
                                            <svg className="w-3.5 sm:w-4 h-2.5 sm:h-3 shrink-0" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                                <path d="M1.5 3C5 0.8 11 0.8 14.5 3" />
                                                <path d="M4.5 6C7 4.5 9 4.5 11.5 6" />
                                                <circle cx="8" cy="9.5" r="1.3" fill="currentColor" stroke="none" />
                                            </svg>
                                            <div className="flex items-center shrink-0">
                                                <div className="w-[18px] sm:w-[21px] h-[9.5px] sm:h-[11px] border-[1.2px] sm:border-[1.4px] border-current rounded-[3px] sm:rounded-[4px] p-[1px] sm:p-[1.2px] flex items-center relative">
                                                    <div className="w-full h-full bg-current rounded-[1.5px] sm:rounded-[1.8px]" />
                                                </div>
                                                <div className="w-[1.5px] sm:w-[1.8px] h-[3px] sm:h-[3.5px] bg-current rounded-r-[1px] -ml-[0.5px]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ilova sarlavhasi */}
                                    <div className="flex items-center justify-between py-1.5 sm:py-2 px-0.5 mt-0.5 sm:mt-1">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl bg-[#9e1122] flex items-center justify-center text-white shadow-sm">
                                                <FaChalkboardTeacher className="w-4 sm:w-5 h-4 sm:h-5" />
                                            </div>
                                            <Link
                                                to="/about"
                                                className="w-6 sm:w-7 h-6 sm:h-7 rounded-full border border-[#e2ddd2] bg-white text-[#9e1122] flex items-center justify-center text-[10px] sm:text-[12px] cursor-pointer hover:bg-[#9e1122] hover:text-white hover:border-[#9e1122] transition-colors"
                                                title="Mentor bilan bog'lanish"
                                            >
                                                <FaPlus />
                                            </Link>
                                        </div>

                                        <div className="bg-[#f3efe7] p-1 rounded-full flex items-center gap-1 sm:gap-1.5 border border-[#e2ddd2]">
                                            <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-white flex items-center justify-center text-[#44403a] shadow-sm relative">
                                                <FaBell className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#9e1122] rounded-full" />
                                            </div>
                                            <img
                                                src="https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-23_23-14-12.jpg"
                                                alt="Mentor Ruhillo Asrorov"
                                                loading="lazy"
                                                className="w-[26px] sm:w-[30px] h-[26px] sm:h-[30px] rounded-full object-cover object-top ring-2 ring-[#9e1122]/30"
                                            />
                                        </div>
                                    </div>

                                    {/* Mentor kartasi */}
                                    <div className="mt-1 sm:mt-1.5 bg-white p-2.5 sm:p-3 rounded-[18px] sm:rounded-[22px] border border-[#ece7dc] shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] sm:text-[13px] font-bold text-[#1c1917]">Ruhillo Asrorov</span>
                                        </div>

                                        <div className="mt-0.5 sm:mt-1 flex items-baseline justify-between gap-1">
                                            <div>
                                                <h3 className="font-display text-[26px] sm:text-[34px] font-semibold text-[#1c1917] tracking-tight leading-none">
                                                    IELTS 8.0
                                                </h3>
                                                <p className="text-[9.5px] sm:text-[11px] font-medium text-[#7d756a] mt-0.5 sm:mt-1">
                                                    {t('mobileShowcase.seniorRole', 'Senior Instructor • 6+ yillik tajriba')}
                                                </p>
                                            </div>
                                            <button className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-[#9e1122] hover:bg-[#830d1c] text-white text-[10px] sm:text-[12px] font-bold rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-1.5 transition-colors active:scale-95 shrink-0">
                                                <FaAward className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                                <span>Senior</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 4 ko'rsatkich */}
                                    <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-2 sm:mt-3 mb-0.5 text-center px-0.5">
                                        {[
                                            { icon: <FaAward className="w-4 sm:w-5 h-4 sm:h-5" />, label: 'IELTS 8.0' },
                                            { icon: <FaGraduationCap className="w-4 sm:w-5 h-4 sm:h-5" />, label: t('mobileShowcase.badge1', '6+ Yil') },
                                            { icon: <FaUserCheck className="w-4 sm:w-5 h-4 sm:h-5" />, label: t('mobileShowcase.badge2', '200+ Student') },
                                            { icon: <FaCommentDots className="w-4 sm:w-5 h-4 sm:h-5" />, label: t('mobileShowcase.badge3', 'Speaking') },
                                        ].map((b, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1 sm:gap-1.5 group cursor-pointer">
                                                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-[14px] bg-[#f3efe7] border border-[#e2ddd2] group-hover:bg-[#9e1122] group-hover:border-[#9e1122] group-hover:text-white text-[#9e1122] flex items-center justify-center transition-colors duration-300">
                                                    {b.icon}
                                                </div>
                                                <span className="text-[9.5px] sm:text-[11.5px] font-bold text-[#1c1917] leading-tight">{b.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* OLED ajratgich */}
                                <div className="h-1.5 sm:h-2 bg-black w-full shrink-0" />

                                {/* PASTKI KARTA — o'quvchilar natijalari */}
                                <div className="w-full bg-[#fbf9f5] border border-white/60 border-b-0 rounded-t-[28px] sm:rounded-t-[36px] rounded-b-none p-2.5 sm:p-3 pt-2.5 sm:pt-3 flex flex-col justify-between flex-1 pb-2 sm:pb-3 text-[#1c1917]">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3 px-0.5 sm:px-1">
                                        <h4 className="font-display text-[16px] sm:text-[19px] font-semibold">
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
                                            className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 bg-[#9e1122] hover:bg-[#830d1c] text-white text-[10px] sm:text-[12px] font-bold rounded-full cursor-pointer transition-colors active:scale-95"
                                        >
                                            {t('mobileShowcase.seeAllBtn', 'Barchasi')}
                                        </button>
                                    </div>

                                    {/* 2 o'quvchi natijasi */}
                                    <div className="space-y-1.5 sm:space-y-2 overflow-y-auto max-h-[105px] sm:max-h-[120px] scrollbar-none px-0.5 sm:px-1">
                                        <div className="flex items-center justify-between py-0.5 sm:py-1">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <img
                                                    src="https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-27.jpg"
                                                    alt="Javohir Munirov"
                                                    loading="lazy"
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-2 ring-[#9e1122]/25"
                                                />
                                                <div>
                                                    <span className="text-[11px] sm:text-[13px] font-bold text-[#1c1917] block leading-tight">Javohir Munirov</span>
                                                    <span className="text-[9px] sm:text-[10px] font-medium text-[#7d756a] block mt-0.5">Listening 9.0 • Reading 7.5</span>
                                                </div>
                                            </div>
                                            <span className="text-[11px] sm:text-[13px] font-bold text-[#9e1122] shrink-0 bg-[#9e1122]/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl flex items-center gap-1 border border-[#9e1122]/20">
                                                <FaStar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#b8860b]" />
                                                <span>7.5</span>
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between py-0.5 sm:py-1 border-t border-[#ece7dc]">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <img
                                                    src="https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-14_23-35-01.jpg"
                                                    alt="Jahongir Zayniddinov"
                                                    loading="lazy"
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 ring-2 ring-[#9e1122]/25"
                                                />
                                                <div>
                                                    <span className="text-[11px] sm:text-[13px] font-bold text-[#1c1917] block leading-tight">Jahongir Zayniddinov</span>
                                                    <span className="text-[9px] sm:text-[10px] font-medium text-[#7d756a] block mt-0.5">Listening 8.5 • General 7.0</span>
                                                </div>
                                            </div>
                                            <span className="text-[11px] sm:text-[13px] font-bold text-[#9e1122] shrink-0 bg-[#9e1122]/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl flex items-center gap-1 border border-[#9e1122]/20">
                                                <FaStar className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#b8860b]" />
                                                <span>7.0</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Home indikator */}
                                    <div className="w-20 sm:w-24 h-[3px] sm:h-[3.5px] bg-[#1c1917] rounded-full mx-auto mt-2 sm:mt-3 shrink-0 opacity-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
