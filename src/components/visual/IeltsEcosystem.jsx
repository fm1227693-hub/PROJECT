import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  FaHeadphones, 
  FaBookOpen, 
  FaPenNib, 
  FaClipboardCheck, 
  FaArrowRight, 
  FaCheckCircle,
  FaShieldAlt,
  FaRobot,
  FaPlay,
  FaVolumeUp,
  FaClock
} from 'react-icons/fa';

export default function IeltsEcosystem() {
  const { t } = useTranslation();

  return (
    <section 
      aria-label="IELTS CDI and AI Digital Ecosystem"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 select-none overflow-hidden"
    >
      {/* Background Lighting Aura (Hardware-optimized, 0 rasterization cost) */}
      <div 
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] pointer-events-none -z-10 opacity-60"
        style={{
          background: "radial-gradient(ellipse at center, rgba(220, 38, 38, 0.12) 0%, transparent 68%)"
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 translate-x-1/3 w-[500px] h-[350px] pointer-events-none -z-10 opacity-50"
        style={{
          background: "radial-gradient(ellipse at center, rgba(14, 165, 233, 0.08) 0%, transparent 68%)"
        }}
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-18 gap-6">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] w-fit">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
              {t('ieltsEcosystem.badge', 'OPTIMUM CDI & AI SUITE // 4 TA AMALIY VOSITA')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] font-heading">
            {t('ieltsEcosystem.titlePrefix', "IELTS imtihoniga to'liq")}{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              {t('ieltsEcosystem.titleHighlight', 'raqamli tayyorgarlik')}
            </span>
          </h2>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-normal max-w-md leading-relaxed md:text-right">
          {t('ieltsEcosystem.description', "Optimum platformasida kompyuterda topshiriladigan rasmiy CDI formati va sun'iy intellekt tahlillari bitta yagona ekotizimda mujassamlashgan.")}
        </p>
      </div>

      {/* Asymmetric Master Digital Tools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

        {/* ═══════════════════════════════════════════════
            TOOL 1: CDI LAB SIMULATOR (Listening & Reading)
            Takes 7 columns on Desktop for true command-center prominence
        ═══════════════════════════════════════════════ */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* CDI Listening Hub Card */}
          <Link
            to="/listening-tests"
            className="group relative p-4 sm:p-7 lg:p-8 rounded-3xl bg-white/90 dark:bg-[#0c0d10]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] hover:border-sky-500/50 shadow-xl shadow-black/5 dark:shadow-black/50 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform shrink-0">
                    <FaHeadphones className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors leading-tight">
                      {t('ieltsEcosystem.listening.title', 'CDI Listening Simulator')}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium block">
                      {t('ieltsEcosystem.listening.subtitle', 'British Council & IDP rasmiy formati')}
                    </span>
                  </div>
                </div>

                <span className="self-start sm:self-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10 shrink-0">
                  {t('ieltsEcosystem.listening.badge', 'REAL AUDIO EXAM')}
                </span>
              </div>

              {/* Interactive Telemetry Mockup: Audio Waveform & Timer HUD */}
              <div className="my-3 sm:my-4 p-3 sm:p-4 rounded-2xl bg-slate-100/80 dark:bg-black/40 border border-slate-200 dark:border-white/5 flex flex-col gap-2.5 sm:gap-3">
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] sm:text-xs font-mono text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <FaPlay className="w-2 h-2 sm:w-2.5 sm:h-2.5 ml-0.5" />
                    </div>
                    <span className="text-slate-900 dark:text-slate-200 font-bold truncate">
                      {t('ieltsEcosystem.listening.part', 'Part 1 — Section 1')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <FaClock className="w-3 h-3 text-sky-500 dark:text-sky-400" />
                    <span className="text-sky-600 dark:text-sky-400 font-bold">28:15 / 30:00</span>
                  </div>
                </div>

                {/* Simulated Audio Waveform Bars */}
                <div className="flex items-center gap-0.5 sm:gap-1 h-6 sm:h-7 px-1.5 sm:px-2 bg-slate-200/50 dark:bg-white/[0.02] rounded-xl overflow-hidden">
                  {[40, 65, 30, 85, 95, 45, 60, 75, 90, 50, 70, 35, 80, 100, 60, 45, 85, 70, 55, 90, 65, 40, 80, 95, 50, 70, 30, 85, 60, 40, 75, 90, 55, 35, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-sky-600 to-sky-400 opacity-70 group-hover:opacity-100 transition-opacity min-w-[2px]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                  <span>{t('ieltsEcosystem.listening.meta', '40 savol • Quloqchin sinovi')}</span>
                  <span className="text-sky-600 dark:text-sky-400 font-bold">
                    {t('ieltsEcosystem.listening.autoCalc', 'Avtomatik natija hisoblash')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {t('ieltsEcosystem.listening.btn', 'Listening testni boshlash')}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0">
                <FaArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* CDI Reading Hub Card */}
          <Link
            to="/reading-tests"
            className="group relative p-4 sm:p-7 lg:p-8 rounded-3xl bg-white/90 dark:bg-[#0c0d10]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] hover:border-emerald-500/50 shadow-xl shadow-black/5 dark:shadow-black/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                    <FaBookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                      {t('ieltsEcosystem.reading.title', 'CDI Reading Hub')}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium block">
                      {t('ieltsEcosystem.reading.subtitle', 'Haqiqiy imtihon matnlari va split-screen')}
                    </span>
                  </div>
                </div>

                <span className="self-start sm:self-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0">
                  {t('ieltsEcosystem.reading.badge', 'ACADEMIC PASSAGES')}
                </span>
              </div>

              {/* Split Screen Telemetry Diagram */}
              <div className="my-3 sm:my-4 p-3 sm:p-4 rounded-2xl bg-slate-100/80 dark:bg-black/40 border border-slate-200 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{t('ieltsEcosystem.reading.passage', 'PASSAGE 1')}</span>
                    <span className="text-slate-500 dark:text-slate-400">{t('ieltsEcosystem.reading.analysis', 'Matn tahlili')}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {t('ieltsEcosystem.reading.sample', '"The Architecture of Ancient Irrigation Systems in Central Asia..."')}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-mono font-bold">
                    {t('ieltsEcosystem.reading.highlighter', 'Highlighter faol')}
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-1.5 shadow-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>{t('ieltsEcosystem.reading.questions', 'QUESTIONS 1-13')}</span>
                    <span className="text-slate-500 dark:text-slate-400">True / False</span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((q) => (
                      <span key={q} className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${q <= 3 ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40' : 'bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400'}`}>
                        {q}
                      </span>
                    ))}
                    <span className="text-slate-500 text-[10px] self-center">... 40</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block pt-0.5">
                    {t('ieltsEcosystem.reading.autoKeys', 'Avtomatik kalitlar tahlili')}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t('ieltsEcosystem.reading.btn', 'Reading testni boshlash')}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0">
                <FaArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════
            TOOL 2 & 3: AI ESSAY FEEDBACK & LEVEL TEST
            Takes 5 columns on Desktop — Showcases the 4 Criteria Visually!
        ═══════════════════════════════════════════════ */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* AI ESSAY FEEDBACK — Dedicated 4 Criteria Treatment */}
          <Link
            to="/ielts-writing"
            className="group relative p-4 sm:p-7 lg:p-8 rounded-3xl bg-white/90 dark:bg-[#0c0d10]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/50 shadow-xl shadow-black/5 dark:shadow-black/50 hover:shadow-2xl hover:shadow-red-500/15 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer flex-1"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform shrink-0">
                    <FaPenNib className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors leading-tight">
                      {t('ieltsEcosystem.writing.title', 'AI Essay Feedback')}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium block">
                      {t('ieltsEcosystem.writing.subtitle', 'Writing Task 1 & 2 Baholovchi AI')}
                    </span>
                  </div>
                </div>

                <span className="self-start sm:self-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10 shrink-0">
                  {t('ieltsEcosystem.writing.badge', '4 MEZON BAHOSI')}
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300/90 leading-relaxed mb-3 sm:mb-4">
                {t('ieltsEcosystem.writing.desc', "Insho matnini joylashtiring va rasmiy Cambridge rubrikasi bo'yicha darhol 4 ta mezonli tahlilga ega bo'ling:")}
              </p>

              {/* The 4 Assessment Criteria Visual Telemetry Bars */}
              <div className="space-y-2 p-3 sm:p-4 rounded-2xl bg-slate-100/80 dark:bg-black/40 border border-slate-200 dark:border-white/5 mb-3 sm:mb-4">
                {/* 1. TR */}
                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Task Response (TR)</span>
                    <span className="text-red-600 dark:text-red-400 font-bold">Band 8.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                {/* 2. CC */}
                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Coherence & Cohesion (CC)</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Band 7.5</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full" style={{ width: '83%' }} />
                  </div>
                </div>

                {/* 3. LR */}
                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Lexical Resource (LR)</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Band 8.0</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                {/* 4. GRA */}
                <div>
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-mono mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-bold">Grammatical Range (GRA)</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold">Band 7.5</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full" style={{ width: '83%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                {t('ieltsEcosystem.writing.btn', 'Inshoni tekshirish')}
              </span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/40 group-hover:scale-110 group-hover:translate-x-1 transition-all shrink-0">
                <FaArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* DIAGNOSTIC LEVEL TEST CARD */}
          <Link
            to="/level-test"
            className="group relative p-4 sm:p-7 rounded-3xl bg-white/90 dark:bg-[#0c0d10]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] hover:border-amber-500/50 shadow-xl shadow-black/5 dark:shadow-black/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                    <FaClipboardCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white font-heading tracking-tight group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-tight">
                      {t('ieltsEcosystem.levelTest.title', 'Placement Level Test')}
                    </h3>
                    <span className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium block">
                      {t('ieltsEcosystem.levelTest.subtitle', '10 daqiqada CEFR va IELTS start ballingiz')}
                    </span>
                  </div>
                </div>

                <span className="self-start sm:self-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 shrink-0">
                  {t('ieltsEcosystem.levelTest.badge', '20 SAVOL')}
                </span>
              </div>

              {/* CEFR Level Gauge */}
              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-100/80 dark:bg-black/40 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-mono mb-3 sm:mb-4 overflow-x-auto gap-1">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                  <span
                    key={lvl}
                    className={`px-2 py-1 rounded-lg text-center font-bold text-[11px] sm:text-xs ${
                      lvl === 'B2' || lvl === 'C1'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 shadow-xs'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-3.5 border-t border-slate-200 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {t('ieltsEcosystem.levelTest.btn', 'Darajani aniqlash')}
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0">
                <FaArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
