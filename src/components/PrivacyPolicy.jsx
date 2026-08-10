import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaLock, FaUserCheck, FaServer, FaArrowLeft, FaHome, FaCheckCircle } from 'react-icons/fa'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function PrivacyPolicy() {
    const { t } = useTranslation()

    useEffect(() => {
        window.scrollTo(0, 0)
        AOS.init({ once: true, offset: 50 })
    }, [])

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Back button & Breadcrumb */}
                <div className="flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-extrabold text-xs hover:border-red-500/50 transition-all shadow-sm active:scale-95"
                    >
                        <FaArrowLeft className="text-red-500" />
                        <span>{t('footer.links.home', 'Bosh sahifa')}</span>
                    </Link>

                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        <FaHome className="text-gray-400" />
                        <span>/</span>
                        <span className="text-red-500">{t('footer.privacy', 'Maxfiylik siyosati')}</span>
                    </div>
                </div>

                {/* Hero Header */}
                <div className="relative p-8 sm:p-12 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden space-y-4">
                    <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-red-600/15 rounded-full blur-3xl" />
                    
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-red-600/30">
                        <FaShieldAlt />
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
                        {t('footer.privacyModal.title', 'Maxfiylik Siyosati')}
                    </h1>

                    <p className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                        {t('footer.privacyModal.subtitle', "Sizning shaxsiy ma'lumotlaringiz xavfsizligi biz uchun ustuvor ahamiyatga ega.")}
                    </p>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Section 1 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaUserCheck />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.privacyModal.sec1Title', "1. Ma'lumotlarni Yig'ish")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.privacyModal.sec1Desc', "Biz veb-sayt orqali faqat siz taqdim etgan ism, telefon raqami va tanlangan kurs ma'lumotlarini yig'amiz.")}
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaLock />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.privacyModal.sec2Title', "2. Ma'lumotlardan Foydalanish")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.privacyModal.sec2Desc', "Yig'ilgan ma'lumotlar faqat siz bilan bog'lanish, bepul konsultatsiya taqdim etish va ta'lim xizmatlarini tashkillashtirish uchun ishlatiladi.")}
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaCheckCircle />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.privacyModal.sec3Title', "3. Uchinchi Shaxslarga Berilmaslik")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.privacyModal.sec3Desc', "Shaxsiy ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi, ijaraga berilmaydi yoki tarqatilmaydi.")}
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaServer />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.privacyModal.sec4Title', "4. Xavfsizlik va Himoya")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.privacyModal.sec4Desc', "Barcha ma'lumotlar shifrlangan xavfsiz serverlarda saqlanadi va ruxsatsiz kirishdan to'liq himoyalangan.")}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
