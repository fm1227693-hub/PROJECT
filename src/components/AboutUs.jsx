import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  HiLightningBolt, 
  HiCheckCircle, 
  HiSparkles, 
  HiLocationMarker, 
  HiPhone,
  HiExternalLink
} from 'react-icons/hi';
import { FaGraduationCap, FaAward, FaShieldAlt } from 'react-icons/fa';

const FIXED_LOCATION = {
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3071.0124155!2d64.410986!3d39.7647863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f5007c3f9d243a7%3A0x3c52dea5c997b375!2sPremier%20School!5e0!3m2!1suz!2suz!4v1650000000000!5m2!1suz!2suz",
  addressText: "Namozgoh St, Bukhara (Premier School)",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
};

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 select-none font-sans text-slate-900 dark:text-white transition-colors duration-200">

      {/* 1-Bo'lim: Sarlavha va matnlar */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center mb-16 sm:mb-20 premium-surface p-6 sm:p-12 rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl" />

        <div className="relative lg:col-span-5">
          <span className="badge-pill mb-3">
            ✦ {t('aboutUs.badge', 'Biz Haqimizda')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('aboutUs.title', 'Kelajak ta\'lim platformasini birga quramiz.')}
          </h1>
          <div className="mt-5 sm:mt-6 w-14 h-1.5 rounded-full bg-gradient-to-r from-rose-600 to-red-500" />
        </div>
        
        <div className="relative lg:col-span-7 flex flex-col space-y-4">
          <p className="text-slate-700 dark:text-slate-200 font-medium text-base sm:text-lg leading-relaxed">
            {t('aboutUs.description1', 'Biz bitta oddiy kuzatuvdan boshladik: aksariyat til markazlari faqat qoidalar yodlatish bilan cheklanib, o\'quvchilarga jonli gapirish amaliyotini juda kam beradi. Biz aynan shu bo\'shliqni yopish uchun markazimizni tashkil qildik.')}
          </p>
          <p className="text-slate-600 dark:text-slate-400 font-normal text-sm sm:text-base leading-relaxed">
            {t('aboutUs.description2', 'Bizning yondashuvimiz ilg\'or o\'qitish metodikasi va talaba ehtiyojiga yo\'naltirilgan qulay muhitni birlashtirib, zerikarli yodlash o\'rniga real vaqtda ravon muloqot qilish imkonini beradi.')}
          </p>
        </div>
      </div>

      {/* 2-Bo'lim: 3 ta kartochka */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">

        {/* 1-kartochka */}
        <Link
          to="/principle/1"
          className="premium-surface p-7 sm:p-9 flex flex-col justify-between bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 rounded-3xl group hover:-translate-y-2 transition-all duration-300 block"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 text-xl shadow-sm border border-amber-500/20 group-hover:scale-110 transition-transform">
              <HiLightningBolt />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {t('aboutUs.card1Title', 'Tezkor Natija')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {t('aboutUs.card1Desc', 'Maxsus ishlab chiqilgan intensiv dasturlar qisqa fursatda sezilarli til o\'sishini ta\'minlaydi.')}
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-6 flex items-center gap-1.5 uppercase tracking-wider">
            {t('aboutUs.card1Tag', 'Asosiy Tamoyil I')}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </Link>

        {/* 2-kartochka */}
        <Link
          to="/principle/2"
          className="premium-surface p-7 sm:p-9 flex flex-col justify-between bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 rounded-3xl group hover:-translate-y-2 transition-all duration-300 block"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-6 text-xl shadow-sm border border-rose-500/20 group-hover:scale-110 transition-transform">
              <HiCheckCircle />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {t('aboutUs.card2Title', 'Amaliy Yondashuv')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {t('aboutUs.card2Desc', 'Darslarning asosiy urg\'usi jonli muloqot va nutqqa qaratilgan bo\'lib, til to\'sig\'ini qisqa vaqtda yengishga yordam beradi.')}
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-6 flex items-center gap-1.5 uppercase tracking-wider">
            {t('aboutUs.card2Tag', 'Asosiy Tamoyil II')}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </Link>

        {/* 3-kartochka */}
        <Link
          to="/principle/3"
          className="premium-surface p-7 sm:p-9 flex flex-col justify-between bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 rounded-3xl group hover:-translate-y-2 transition-all duration-300 block"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 text-xl shadow-sm border border-purple-500/20 group-hover:scale-110 transition-transform">
              <HiSparkles />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {t('aboutUs.card3Title', 'Mukammallikka Intilish')}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
              {t('aboutUs.card3Desc', 'Har bir o\'quvchining xatolari va zaif nuqtalari ustida individual ish olib borilib, yuqori natijalar sari yetaklanadi.')}
            </p>
          </div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-6 flex items-center gap-1.5 uppercase tracking-wider">
            {t('aboutUs.card3Tag', 'Asosiy Tamoyil III')}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </Link>

      </div>

      {/* 3-Bo'lim: Manzil va Premier School Xaritasi */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16 sm:mb-20 premium-surface p-6 sm:p-10 rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="space-y-5">
          <span className="badge-pill">
            ✦ {t('aboutUs.locationBadge', 'Filialimiz Manzili')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('aboutUs.locationTitle', 'Bizni shu yerdan topishingiz mumkin')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('aboutUs.locationDesc', 'Biz O\'zbekiston, Buxoro shahri, "Buxoro Davlat Tibbiyot Kolleji" yaqinida (Premier School) joylashganmiz. Zamonaviy va shinam o\'quv markazimiz doim siz uchun ochiq.')}
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3">
              <div className="w-9 h-9 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                <HiLocationMarker className="w-5 h-5" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm">
                Buxoro shahri, Namozgoh ko'chasi (Premier School)
              </span>
            </div>

            <a
              href="tel:+998900829979"
              className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 hover:border-rose-500/40 transition-colors"
            >
              <div className="w-9 h-9 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
                <HiPhone className="w-5 h-5" />
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm">
                +998 90 082 99 79 / +998 91 082 99 79
              </span>
            </a>
          </div>

          <div className="pt-2">
            <a
              href={FIXED_LOCATION.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-2"
            >
              <span>{t('aboutUs.openInMaps', 'Xaritada ochish (Google Maps)')}</span>
              <HiExternalLink className="text-sm" />
            </a>
          </div>
        </div>

        {/* Map iframe */}
        <div className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
          <iframe
            src={FIXED_LOCATION.embedUrl}
            title="Location Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* 4-Bo'lim: Footer statistika */}
      <div className="premium-surface text-slate-900 dark:text-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h4 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
            {t('aboutUs.footerTitle', 'Maqsad sari, birgalikda, ishonch bilan.')}
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            {t('aboutUs.footerDesc', 'Tajribali ustozlar jamoamiz o\'quvchilarga doimiy yordam ko\'rsatib, ularning yuqori xalqaro sertifikatlar va ravon muloqot darajasiga erishishini ta\'minlaydi.')}
          </p>
        </div>
        <div className="flex items-center gap-8 shrink-0">
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white">100%</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('aboutUs.stat1Label', 'Sifat Kafolati')}
            </span>
          </div>
          <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl font-display font-black text-rose-600 dark:text-rose-400">7/24</span>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('aboutUs.stat2Label', 'Qo\'llab-quvvatlash')}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
