import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCheck, FaPhoneAlt, FaTelegramPlane, FaArrowRight, FaGraduationCap } from 'react-icons/fa';
import { PRICING_PLANS } from '../data/coursesData';
import ConsultationModal from './ui/ConsultationModal';

const PHONE_NUMBER = '+998 90 082 99 79';

export default function Pricing() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const levelKey = location.state?.levelKey || null;
  const levelLabel = location.state?.levelLabel || null;
  const [selectedPlan, setSelectedPlan] = useState(null);

  const contactTelegram = (planName) => {
    const text = encodeURIComponent(
      `Salom! Men ${levelLabel ? `"${levelLabel}"` : ''} darajasi bo'yicha "${planName}" tarifiga yozilmoqchiman.`
    );
    window.open(`https://t.me/rukhillo?text=${text}`, '_blank');
  };

  const contactPhone = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 relative select-none font-sans">
      
      {/* Background Lighting */}
      <div className="pointer-events-none absolute top-1/4 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-pill mb-3">
            ✦ {t('pricing.badge', 'Shaffof Narxlar')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('pricing.title', "O'zingizga mos tarifni tanlang")}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-3 font-normal text-sm sm:text-base">
            {levelLabel
              ? `Sizning darajangiz: "${levelLabel}". Quyidagi tavsiya etilgan tarif orqali tezda boshlang.`
              : t('pricing.description', 'Barcha darsliklar, materiallar va Speaking Club mashg\'ulotlari oylik to\'lov ichiga kiritilgan.')}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PRICING_PLANS.map((plan) => {
            const isPopular = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                  isPopular
                    ? 'bg-white dark:bg-[#0e121e] border-2 border-rose-500 shadow-xl shadow-rose-600/15 scale-[1.02]'
                    : 'bg-white/80 dark:bg-[#0e121e]/80 border border-slate-200 dark:border-slate-800 shadow-md'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-600 text-white shadow-md shadow-rose-600/30">
                      Tavsiya etiladi
                    </span>
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2">
                    {plan.levels}
                  </div>
                  <h3 className="text-xl font-display font-extrabold text-slate-900 dark:text-white mb-4">
                    {plan.name}
                  </h3>

                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-3xl sm:text-4xl font-display font-black text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {plan.currency}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/10 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <FaCheck className="text-emerald-500 shrink-0 mt-0.5 text-[10px]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`w-full py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isPopular
                        ? 'btn-primary'
                        : 'btn-secondary'
                    }`}
                  >
                    Ushbu tarifga yozilish
                  </button>

                  <button
                    onClick={() => contactTelegram(plan.name)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-sky-500 hover:text-sky-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FaTelegramPlane />
                    <span>Telegramda so'rash</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Phone Assistance */}
        <div className="mt-14 max-w-md mx-auto text-center premium-surface p-6 rounded-3xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">
            Savollaringiz bormi yoki yordam kerakmi?
          </p>
          <a
            href="tel:+998900829979"
            className="text-rose-600 dark:text-rose-400 font-display font-bold text-lg hover:underline inline-block"
          >
            {PHONE_NUMBER}
          </a>
        </div>

      </div>

      <ConsultationModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        defaultCourse={selectedPlan ? `Tarif: ${selectedPlan}` : 'General Course'}
      />
    </div>
  );
}
