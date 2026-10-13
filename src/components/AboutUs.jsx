import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { 
    HiLightningBolt, 
    HiCheckCircle, 
    HiSparkles, 
    HiLocationMarker, 
    HiPhone,
    HiExternalLink
} from 'react-icons/hi'
import { FaGraduationCap, FaShieldAlt, FaAward, FaUsers, FaArrowRight } from 'react-icons/fa'

const FIXED_LOCATION = {
    addressText: "Buxoro sh., Namozgoh ko‘chasi, Premier School binosi",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
}

export default function AboutUs() {
    const { t } = useTranslation()

    const principles = [
        {
            id: 1,
            icon: <HiLightningBolt className="w-6 h-6 text-red-500" />,
            title: t('aboutUs.card1Title', "Intensiv va Aniq Metodika"),
            desc: t('aboutUs.card1Desc', "Har bir dars amaliy ko'nikmaga yo'naltirilgan. Ortiqcha nazariyasiz, to'g'ridan-to'g'ri natijaga eltuvchi Cambridge tizimi."),
            tag: t('aboutUs.card1Tag', "METODIKA")
        },
        {
            id: 2,
            icon: <HiCheckCircle className="w-6 h-6 text-emerald-500" />,
            title: t('aboutUs.card2Title', "CDI Mock va Tizimli Nazorat"),
            desc: t('aboutUs.card2Desc', "Real kompyuter imtihoni muhiti, muntazam diagnostika va o'quvchining har bir xatosini individual tahlil qilish."),
            tag: t('aboutUs.card2Tag', "CDI TIZIMI")
        },
        {
            id: 3,
            icon: <HiSparkles className="w-6 h-6 text-amber-500" />,
            title: t('aboutUs.card3Title', "AI Integratsiyasi va Tahlil"),
            desc: t('aboutUs.card3Desc', "IELTS Writing insholarini sun'iy intellekt orqali soniyalar ichida tekshirish, lug'at va grammatik tavsiyalar olish."),
            tag: t('aboutUs.card3Tag', "AI TAHLIL")
        }
    ]

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 select-none text-slate-900 dark:text-white overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-600/[0.07] rounded-full blur-[160px] -z-10" />

            <div className="max-w-7xl mx-auto space-y-16">

                {/* Section 1: Hero Banner */}
                <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-white/70 dark:bg-[#070b14]/75 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] p-8 sm:p-12 lg:p-16 shadow-2xl shadow-black/5 dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                    {/* Top ambient line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                    <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 bg-red-600/15 rounded-full blur-3xl -z-10" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-5 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
                                    {t('aboutUs.badge', 'BIZ HAQIMIZDA // EXCELLENCE')}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-heading">
                                {t('aboutUs.title', 'Optimum School of English')}
                            </h1>
                            <div className="w-16 h-1.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-400" />
                        </div>

                        <div className="lg:col-span-7 space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            <p>
                                {t('aboutUs.description1', "Bizning markaz ingliz tilini professional darajada o'rgatish, xalqaro IELTS va CEFR imtihonlariga sifatli tayyorlash bo'yicha ko'p yillik tajribaga ega.")}
                            </p>
                            <p className="font-medium text-slate-900 dark:text-slate-200">
                                {t('aboutUs.description2', "Optimum — bu faqat til o'rganish emas, balki xalqaro ta'lim va martaba eshiklarini ochuvchi ishonchli hamkoringizdir.")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Core Principles Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {principles.map((card) => (
                        <Link
                            key={card.id}
                            to={`/principle/${card.id}`}
                            className="group p-8 rounded-3xl bg-white/80 dark:bg-[#0a0e19]/90 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/40 shadow-lg shadow-black/5 dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div>
                                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-red-500/15 to-red-950/30 border border-red-500/25 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xs">
                                    {card.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 block mb-2">
                                    {card.tag}
                                </span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 font-heading group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                                    {card.desc}
                                </p>
                            </div>
                            <div className="pt-6 mt-4 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                                <span>Batafsil ma'lumot</span>
                                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center group-hover:bg-red-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                                    <FaArrowRight className="w-2.5 h-2.5" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Section 3: Location and Map */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl bg-white/70 dark:bg-[#070b14]/75 backdrop-blur-3xl border border-black/[0.08] dark:border-white/[0.08] p-8 sm:p-12 shadow-2xl shadow-black/5 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

                    <div className="lg:col-span-6 space-y-6 text-left">
                        <span className="inline-block text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-500/10 px-3.5 py-1.5 rounded-full border border-red-500/30">
                            {t('aboutUs.locationBadge', 'LOKATSIYA // CAMPUS')}
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                            {t('aboutUs.locationTitle', 'Bizning markazga tashrif buyuring')}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {t('aboutUs.locationDesc', "Buxoro shahrining markazida, qulay transport bog'lamasiga ega shinam va zamonaviy o'quv xonalari.")}
                        </p>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
                                    <HiLocationMarker className="w-5 h-5" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {FIXED_LOCATION.addressText}
                                </span>
                            </div>

                            <a
                                href="tel:+998900829979"
                                className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50/80 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] hover:border-red-500/40 transition-colors cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0">
                                    <HiPhone className="w-5 h-5" />
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    +998 90 082 99 79
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=60&w=800&auto=format&fit=crop"
                            alt="Optimum Campus Location"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-6 text-center">
                            <a
                                href={FIXED_LOCATION.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-7 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            >
                                <span>Xaritada ochish (Google Maps)</span>
                                <HiExternalLink className="text-base" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Section 4: Highlights Metrics Bar */}
                <div className="p-8 sm:p-12 rounded-3xl bg-white/60 dark:bg-[#070b14]/70 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-lg">
                    <div className="space-y-1">
                        <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
                            {t('aboutUs.footerTitle', "IELTS 7.5+ ga erishish yo'li shu yerdan boshlanadi")}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal">
                            {t('aboutUs.footerDesc', "Professional instruktorlar va zamonaviy o'quv vositalari sizni kutmoqda.")}
                        </p>
                    </div>

                    <div className="flex items-center gap-8 shrink-0">
                        <div>
                            <span className="block text-3xl sm:text-4xl font-black text-red-600 dark:text-red-500 font-heading">100%</span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Kafolatlangan dastur</span>
                        </div>
                        <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                        <div>
                            <span className="block text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading">7/24</span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Onlayn qo'llab-quvvatlash</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}