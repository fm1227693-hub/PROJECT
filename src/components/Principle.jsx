import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { HiLightningBolt, HiCheckCircle, HiStar, HiArrowLeft, HiOutlineCheck } from 'react-icons/hi';

export default function Principle() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const principleId = parseInt(id, 10) || 1;

  const configs = {
    1: {
      icon: <HiLightningBolt className="w-10 h-10 text-amber-500" />,
      bgGradient: "from-amber-500/20 to-transparent",
      iconBg: "bg-amber-100 dark:bg-amber-500/20",
      title: "Tezkor & O'lchanadigan Natija",
      subtitle: "Asosiy Tamoyil I",
      desc: "Biz o'quv dasturlarimizni shunday qurdikki, har bir hafta aniq o'lchanadigan ko'nikma beradi. Zerikarli va samarasiz oylar o'rniga qisqa fursatda yuqori natijaga chiqasiz.",
      f1_title: "Intensiv Modullar",
      f1_desc: "Har bir dars aniq bitta maqsadga va grammatik-leksik blokga bag'ishlanadi.",
      f2_title: "Haftalik Oraliq Nazorat",
      f2_desc: "Har haftaning oxirida o'rganilgan mavzular bo'yicha progress tekshiriladi.",
      f3_title: "O'sish Ko'rsatkichi",
      f3_desc: "O'quvchi o'z darajasining qanchalik ko'tarilganini real vaqtda ko'rib boradi.",
      extra_title: "Vaqtni qadrlaydiganlar uchun",
      extra_desc: "OptimumELC dasturi talabalarni ortiqcha chalg'itmasdan, to'g'ridan-to'g'ri maqsadli sertifikatlar (IELTS 7.0+, CEFR B2) sari yetaklaydi."
    },
    2: {
      icon: <HiCheckCircle className="w-10 h-10 text-rose-500" />,
      bgGradient: "from-rose-500/20 to-transparent",
      iconBg: "bg-rose-100 dark:bg-rose-500/20",
      title: "Amaliy Yondashuv & Jonli Nutq",
      subtitle: "Asosiy Tamoyil II",
      desc: "Til bu qoidalar to'plami emas, balki muloqot vositasi. Darslarimizning 80% qismi jonli suhbat, munozara va rolli o'yinlarga asoslangan.",
      f1_title: "Til To'sig'ini Sindirish",
      f1_desc: "Xato qilishdan qo'rqish hissiyotini ilk haftalardanoq bartaraf etamiz.",
      f2_title: "Speaking Club & Debatlar",
      f2_desc: "Har yakshanba erkin mavzularda suhbat klublari tashkil etiladi.",
      f3_title: "Real Hayotiy Vaziyatlar",
      f3_desc: "Muzokaralar, sayohat, intervyu va akademik taqdimotlar bo'yicha mashqlar.",
      extra_title: "Muloqot erkinligi",
      extra_desc: "Ingliz tilida fikrlashni va o'z fikringizni hech qanday ikkilanishsiz yetkaza olishni o'rganasiz."
    },
    3: {
      icon: <HiStar className="w-10 h-10 text-purple-500" />,
      bgGradient: "from-purple-500/20 to-transparent",
      iconBg: "bg-purple-100 dark:bg-purple-500/20",
      title: "Mukammallikka Intilish & Mentor Nazorati",
      subtitle: "Asosiy Tamoyil III",
      desc: "Biz har bir o'quvchiga individual yondashamiz. Insho tekshirish, talaffuzdagi kamchiliklarni tuzatish va shaxsiy tavsiyalar orqali yuqori ballarga erishamiz.",
      f1_title: "1-on-1 Xatolar Tahlili",
      f1_desc: "Mentor har bir talabaning zaif tomonlarini alohida tahlil qilib beradi.",
      f2_title: "AI & Mentor Integratsiyasi",
      f2_desc: "Insholarni AI Writing moduli va tajribali ustoz birgalikda baholaydi.",
      f3_title: "Band 8.5+ Strategiyalari",
      f3_desc: "Eng yuqori ball olish sirlari va imtihon psixologiyasi o'rgatiladi.",
      extra_title: "Kafolatlangan yondashuv",
      extra_desc: "OptimumELC jamoasi sizni imtihon zallariga to'liq ishonch bilan kirishingiz uchun tayyorlaydi."
    }
  };

  const config = configs[principleId] || configs[1];

  return (
    <div className="min-h-screen font-sans pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 relative select-none">
      
      {/* Background Lighting */}
      <div className={`pointer-events-none absolute top-10 right-10 w-96 h-96 bg-gradient-to-bl ${config.bgGradient} rounded-full blur-3xl -z-10`} />

      <div className="max-w-4xl mx-auto">
        
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <HiArrowLeft className="text-sm" />
          <span>Ortga qaytish</span>
        </button>

        <div className="premium-surface p-6 sm:p-12 rounded-[28px] sm:rounded-[36px] bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-xl">
          
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8 mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${config.iconBg}`}>
              {config.icon}
            </div>

            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
              {config.subtitle}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white mt-2 mb-4 tracking-tight">
              {config.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {config.desc}
            </p>
          </div>

          {/* 3 Sub-features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs mb-3 font-bold">
                <HiOutlineCheck />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {config.f1_title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {config.f1_desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs mb-3 font-bold">
                <HiOutlineCheck />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {config.f2_title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {config.f2_desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs mb-3 font-bold">
                <HiOutlineCheck />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {config.f3_title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {config.f3_desc}
              </p>
            </div>
          </div>

          {/* Highlight Box */}
          <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 mb-10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {config.extra_title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {config.extra_desc}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/level-test"
              className="btn-primary py-3.5 px-6 text-xs sm:text-sm"
            >
              Darajangizni aniqlang
            </Link>
            <Link
              to="/about"
              className="btn-secondary py-3.5 px-6 text-xs sm:text-sm font-bold"
            >
              Biz haqimizda ko'proq
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
