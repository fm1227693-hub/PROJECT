import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPhoneAlt, FaTelegramPlane, FaCheckCircle, FaStar } from 'react-icons/fa';

export default function FinalCta() {
  const { t } = useTranslation();

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 select-none overflow-hidden">
      {/* Background Lighting Aura (Hardware-optimized) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none -z-10 opacity-70"
        style={{
          background: "radial-gradient(ellipse at center, rgba(220, 38, 38, 0.12) 0%, transparent 68%)"
        }}
      />

      {/* Main Luxury Glass Showcase Card */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-white/90 via-white/85 to-white/80 dark:from-[#0d1222]/95 dark:via-[#090d18]/95 dark:to-[#07090e]/95 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.08] p-8 sm:p-14 lg:p-20 shadow-2xl shadow-black/10 dark:shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden text-center">
        {/* Top Glow Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
        
        {/* Subtle Watermark */}
        <div className="absolute -bottom-10 right-10 text-[180px] font-black text-black/[0.02] dark:text-white/[0.02] font-heading pointer-events-none select-none">
          OPTIMUM
        </div>

        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] mx-auto">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
              {t('finalCta.badge', 'OPTIMUM ELC // QABUL OCHIQ')}
            </span>
          </div>

          {/* Grand Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] font-heading">
            {t('finalCta.titleStart', 'Kelajagingizni bugun')}{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              Optimum
            </span>{' '}
            {t('finalCta.titleEnd', 'bilan quring')}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg font-normal max-w-xl mx-auto leading-relaxed">
            {t('finalCta.description', "IELTS 7.5+ orzuingizni orqaga surmang. Bepul konsultatsiya va daraja testiga yoziling, natijani mutaxassis bilan tahlil qiling.")}
          </p>

          {/* Action CTAs — Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/form"
              className="w-full sm:w-auto px-9 py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-full shadow-xl shadow-red-600/40 hover:shadow-red-600/60 border border-white/20 transition-all duration-300 flex items-center justify-center gap-3 text-sm sm:text-base hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{t('finalCta.trialBtn', 'Bepul sinov darsi olish')}</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/level-test"
              className="w-full sm:w-auto px-8 py-4 bg-white/60 dark:bg-white/[0.04] hover:bg-white/80 dark:hover:bg-white/[0.08] text-slate-900 dark:text-white font-bold rounded-full border border-slate-300/80 dark:border-white/15 hover:border-red-500/50 backdrop-blur-xl transition-all duration-300 flex items-center justify-center gap-2.5 text-sm sm:text-base hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{t('finalCta.levelBtn', 'Darajani aniqlash')}</span>
              <FaArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-8 border-t border-slate-200/60 dark:border-white/[0.06] flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" />
              <span>{t('finalCta.guarantee1', "Kafolatlangan ta'lim dasturi")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-amber-500" />
              <span>{t('finalCta.guarantee2', 'IELTS 8.0+ darajali instruktorlar')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-red-500" />
              <span>+998 90 082 99 79</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
