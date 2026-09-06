import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaChartLine, FaArrowRight, FaGraduationCap, FaCheckCircle, FaUsers } from 'react-icons/fa';

export default function Stats() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('1m');

  const dataConfig = {
    '1m': {
      label: '1-Oy Bosqichi',
      speaking: '25 min faol nutq',
      errors: 'Asosiy xatolar kamayishi: 35%',
      trendText: '+45% Progress',
      pathD: 'M 0 130 Q 100 120, 200 100 T 400 70',
      gradD: 'M 0 130 Q 100 120, 200 100 T 400 70 L 400 150 L 0 150 Z',
      circleX: 200,
      circleY: 100
    },
    '3m': {
      label: '3-Oy Bosqichi',
      speaking: '45 min ravon nutq',
      errors: 'Grammatik aniqlik: 75%',
      trendText: '+80% Progress',
      pathD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40',
      gradD: 'M 0 120 Q 80 50, 160 90 T 320 30 T 400 40 L 400 150 L 0 150 Z',
      circleX: 320,
      circleY: 30
    },
    'end': {
      label: 'Kurs Yakuni',
      speaking: '80+ min erkin muloqot',
      errors: 'IELTS Band 7.5+ tayyorgarligi',
      trendText: 'IELTS 7.5+ Band',
      pathD: 'M 0 130 Q 100 90, 220 50 T 400 10',
      gradD: 'M 0 130 Q 100 90, 220 50 T 400 10 L 400 150 L 0 150 Z',
      circleX: 400,
      circleY: 10
    }
  };

  const current = dataConfig[activeTab];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 select-none font-sans text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* Sarlavha qismi */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
        <div className="max-w-xl">
          <span className="badge-pill mb-3">
            ✦ {t('statistic.badge', 'O\'quv Statistikasi')}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {t('statistic.title', 'O\'quvchilar rivojlanish dinamikasi')}
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-normal text-sm sm:text-base max-w-sm md:text-right">
          {t('statistic.description', 'OptimumELC tizimida har bir talabaning nutq tezligi, so\'z boyligi va test ko\'rsatkichlari doimiy monitoring qilinadi.')}
        </p>
      </div>

      {/* Grid kontent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Chart & Dynamics */}
        <div className="relative premium-surface bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between shadow-xl">
          <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl" />

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Nutqiy O'sish
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                  Bosqichma-bosqich natijalar
                </h3>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                {Object.keys(dataConfig).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeTab === key
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {dataConfig[key].label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Visual */}
            <div className="w-full h-52 bg-gradient-to-b from-rose-500/5 to-transparent rounded-2xl p-4 flex items-end relative border border-slate-200 dark:border-slate-800 mb-6 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="largeChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={current.gradD} fill="url(#largeChartGrad)" className="transition-all duration-500" />
                <path d={current.pathD} stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" className="transition-all duration-500" />
                <circle cx={current.circleX} cy={current.circleY} r="6" fill="#e11d48" stroke="#ffffff" strokeWidth="2.5" className="transition-all duration-500 animate-pulse" />
              </svg>

              <div className="absolute top-4 right-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono px-3 py-1.5 rounded-xl shadow-lg">
                {current.trendText}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            {Object.keys(dataConfig).map((key) => {
              const item = dataConfig[key];
              const isActive = activeTab === key;
              return (
                <div
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold block uppercase tracking-wider">{item.label}</span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white block my-0.5">{item.speaking}</span>
                  <span className="text-[10px] opacity-75 block truncate">{item.errors}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Card: Metrics & Practice CTA */}
        <div className="premium-surface bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:col-span-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Umumiy Ko'rsatkichlar
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
                OptimumELC Yutuqlari
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-display">
                  200+
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  IELTS 7.0+ va CEFR B2 Natijalari
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Optimum o'quvchilari xalqaro universitetlar va grantlar sohibi
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
                <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                  100%
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  CDI Simulyatsiyasi & Real Mocklar
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  British Council va Cambridge formatidagi to'liq test tizimi
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <Link
              to="/level-test"
              className="btn-primary w-full py-3.5 text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>O'z darajangizni aniqlang</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
