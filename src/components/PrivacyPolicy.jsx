import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaUserCheck, FaServer, FaHome, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

export default function PrivacyPolicy() {
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
            <span className="text-rose-600 dark:text-rose-400">Maxfiylik siyosati</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative p-8 sm:p-12 rounded-3xl premium-surface bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden space-y-4">
          <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 bg-rose-600/15 rounded-full blur-3xl" />

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-red-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-rose-600/30">
            <FaShieldAlt />
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('footer.privacyModal.title', 'Maxfiylik Siyosati')}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t('footer.privacyModal.subtitle', "Sizning shaxsiy ma'lumotlaringiz xavfsizligi biz uchun ustuvor ahamiyatga ega.")}
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaUserCheck />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.privacyModal.sec1Title', "1. Ma'lumotlarni Yig'ish")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.privacyModal.sec1Desc', "Biz veb-sayt orqali faqat siz taqdim etgan ism, telefon raqami va tanlangan kurs ma'lumotlarini yig'amiz.")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaLock />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.privacyModal.sec2Title', "2. Ma'lumotlardan Foydalanish")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.privacyModal.sec2Desc', "Yig'ilgan ma'lumotlar faqat siz bilan bog'lanish, bepul konsultatsiya taqdim etish va ta'lim xizmatlarini tashkillashtirish uchun ishlatiladi.")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaCheckCircle />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.privacyModal.sec3Title', "3. Uchinchi Shaxslarga Berilmaslik")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.privacyModal.sec3Desc', "Shaxsiy ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi, ijaraga berilmaydi yoki tarqatilmaydi.")}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
                <FaServer />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t('footer.privacyModal.sec4Title', "4. Xavfsizlik va Himoya")}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
              {t('footer.privacyModal.sec4Desc', "Barcha ma'lumotlar shifrlangan xavfsiz serverlarda saqlanadi va ruxsatsiz kirishdan to'liq himoyalangan.")}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
