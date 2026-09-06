import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaExternalLinkAlt,
  FaBuilding,
  FaGraduationCap,
  FaShieldAlt,
  FaCheckCircle
} from 'react-icons/fa';

export default function AboutTrustSection() {
  const { t } = useTranslation();

  const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3071.0124155!2d64.410986!3d39.7647863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f5007c3f9d243a7%3A0x3c52dea5c997b375!2sPremier%20School!5e0!3m2!1suz!2suz!4v1650000000000!5m2!1suz!2suz";
  const MAP_URL = "https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara";

  return (
    <section id="location" className="py-24 sm:py-32 relative select-none">
      
      {/* Background Lighting */}
      <div className="pointer-events-none absolute bottom-10 left-10 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Campus Details */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="badge-neon">
              ✦ {t('aboutUs.locationBadge', 'BIZNING FILIAL & MANZIL')}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              OptimumELC o'quv markaziga{' '}
              <span className="text-gradient-accent">tashrif buyuring.</span>
            </h2>

            <p className="text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Biz Buxoro shahrida, Namozgoh ko'chasi (Premier School majmuasi)da joylashganmiz. Zamonaviy kompyuter sinflari, qulay muhit va shinam kutubxonamiz doim siz uchun ochiq.
            </p>

            <div className="space-y-3.5 pt-2">
              
              {/* Address card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 text-base">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Rasmiy Manzil
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Buxoro shahri, Namozgoh ko'chasi (Premier School)
                  </div>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 text-base">
                  <FaClock />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Ish Vaqti
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Har kuni 08:00 dan 20:00 gacha (Dam olish kunlarisiz)
                  </div>
                </div>
              </div>

              {/* Phone hotline */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-base">
                  <FaPhoneAlt />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    Aloqa Markazi
                  </div>
                  <a
                    href="tel:+998900829979"
                    className="text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline block mt-0.5 font-mono"
                  >
                    +998 90 082 99 79 / +998 91 082 99 79
                  </a>
                </div>
              </div>

            </div>

            <div className="pt-2">
              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs sm:text-sm font-bold inline-flex items-center gap-2"
              >
                <span>Xaritada ochish (Google Maps)</span>
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>

          </div>

          {/* Right Map Embed */}
          <div className="lg:col-span-7">
            <div className="glass-glow-card p-3 rounded-[32px] bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
              <div className="w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden relative">
                <iframe
                  src={MAP_EMBED}
                  title="Optimum Premier School Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[10%] contrast-[105%]"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
