import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FaFileContract, FaGraduationCap, FaUserCheck, FaPhoneAlt, FaArrowLeft, FaHome } from 'react-icons/fa'

export default function TermsOfUse() {
    const { t } = useTranslation()

    useEffect(() => {
        window.scrollTo(0, 0)
        
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
                        <span className="text-red-500">{t('footer.terms', 'Foydalanish shartlari')}</span>
                    </div>
                </div>

                {/* Hero Header */}
                <div className="relative p-8 sm:p-12 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden space-y-4">
                    <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-red-600/15 rounded-full blur-3xl" />
                    
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-red-600/30">
                        <FaFileContract />
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-gray-950 dark:text-white tracking-tight">
                        {t('footer.termsModal.title', 'Foydalanish Shartlari')}
                    </h1>

                    <p className="text-sm sm:text-base font-semibold text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                        {t('footer.termsModal.subtitle', "Optimum School platformasidan foydalanish bo'yicha rasmiy qoidalar.")}
                    </p>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Section 1 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaGraduationCap />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.termsModal.sec1Title', "1. Xizmatlardan Foydalanish")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.termsModal.sec1Desc', "Optimum School veb-sayti va IELTS sinov platformasi o'quvchilar darajasini oshirish va bilimlarni sinash uchun taqdim etiladi.")}
                        </p>
                    </div>

                    {/* Section 2 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaFileContract />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.termsModal.sec2Title', "2. Mualliflik Huquqlari")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.termsModal.sec2Desc', "Saytdagi barcha o'quv materiallari, daraja testlari va dizayn elementlari Optimum School intellektual mulki hisoblanadi.")}
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaUserCheck />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.termsModal.sec3Title', "3. Foydalanuvchi Majburiyatlari")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.termsModal.sec3Desc', "Foydalanuvchilar o'zlarining haqiqiy aloqa ma'lumotlarini kiritishlari va platformadan halol foydalanishlari shart.")}
                        </p>
                    </div>

                    {/* Section 4 */}
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-lg space-y-3 hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-lg font-bold shrink-0">
                                <FaPhoneAlt />
                            </div>
                            <h3 className="text-lg font-extrabold text-gray-950 dark:text-white">
                                {t('footer.termsModal.sec4Title', "4. Qayta Bog'lanish")}
                            </h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                            {t('footer.termsModal.sec4Desc', "Savol va takliflar uchun: +998 90 082 99 79 orqali murojaat qilishingiz mumkin.")}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
