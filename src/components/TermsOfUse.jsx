import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaFileContract, FaGraduationCap, FaUserCheck, FaPhoneAlt, FaArrowLeft } from 'react-icons/fa';

export default function TermsOfUse() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <FaArrowLeft className="text-xs" />
            <span>Ortga</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-rose-600 transition-colors">Bosh sahifa</Link>
            <span>/</span>
            <span className="text-rose-600 dark:text-rose-400">Foydalanish shartlari</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative p-8 sm:p-12 rounded-3xl premium-surface bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden space-y-4">
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-rose-600/15 rounded-full blur-3xl" />

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-600/30">
            <FaFileContract />
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('footer.termsModal.title', 'Foydalanish Shartlari')}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t('footer.termsModal.subtitle', "OptimumELC platformasidan foydalanish bo'yicha rasmiy qoidalar.")}
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaGraduationCap />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.termsModal.sec1Title', "1. Xizmatlardan Foydalanish")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.termsModal.sec1Desc', "OptimumELC veb-sayti va IELTS sinov platformasi o'quvchilar darajasini oshirish va bilimlarni sinash uchun taqdim etiladi.")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaFileContract />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.termsModal.sec2Title', "2. Mualliflik Huquqlari")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.termsModal.sec2Desc', "Saytdagi barcha o'quv materiallari, daraja testlari va dizayn elementlari OptimumELC intellektual mulki hisoblanadi.")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaUserCheck />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.termsModal.sec3Title', "3. Foydalanuvchi Majburiyatlari")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.termsModal.sec3Desc', "Foydalanuvchilar o'zlarining haqiqiy aloqa ma'lumotlarini kiritishlari va platformadan halol foydalanishlari shart.")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaPhoneAlt />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.termsModal.sec4Title', "4. Qayta Bog'lanish")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.termsModal.sec4Desc', "Savol va takliflar uchun: +998 90 082 99 79 orqali murojaat qilishingiz mumkin.")}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
