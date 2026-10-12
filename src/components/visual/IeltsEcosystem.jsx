import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  FaHeadphones, 
  FaBookOpen, 
  FaPenNib, 
  FaClipboardCheck, 
  FaArrowRight, 
  FaBolt, 
  FaCheckCircle,
  FaShieldAlt,
  FaRobot
} from 'react-icons/fa';

export default function IeltsEcosystem() {
  const { t } = useTranslation();

  const tools = [
    {
      id: 'listening',
      name: "CDI Listening Hub",
      badge: "REAL AUDIO EXAM",
      tagColor: "border-sky-500/30 text-sky-400 bg-sky-500/10",
      accentGrad: "from-sky-500 via-blue-600 to-indigo-600",
      icon: <FaHeadphones className="w-5 h-5 text-sky-400" />,
      desc: "Xalqaro British Council va IDP formatidagi audio treklar, interaktiv javob varaqasi va soniyali natijalar.",
      stats: "6 ta to'liq test • Real vaqt",
      path: "/listening-tests",
      action: "Listening testni boshlash",
      highlight: "Rasmiy CDI interfeysi"
    },
    {
      id: 'reading',
      name: "CDI Reading Hub",
      badge: "ACADEMIC PASSAGES",
      tagColor: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      accentGrad: "from-emerald-500 via-teal-600 to-cyan-600",
      icon: <FaBookOpen className="w-5 h-5 text-emerald-400" />,
      desc: "Haqiqiy imtihon matnlari, matndan nusxa olish, qulay matn-savol ekrani va avtomatik xatolar diagnostikasi.",
      stats: "6 ta akademik modul • 40 savol",
      path: "/reading-tests",
      action: "Reading testni boshlash",
      highlight: "Ikki oynali split-screen"
    },
    {
      id: 'writing',
      name: "IELTS Writing AI Assessor",
      badge: "AI BAND EVALUATION",
      tagColor: "border-rose-500/30 text-rose-400 bg-rose-500/10",
      accentGrad: "from-red-600 via-rose-600 to-amber-500",
      icon: <FaPenNib className="w-5 h-5 text-rose-400" />,
      desc: "Task 1 va Task 2 insholaringizni sun'iy intellekt orqali 4 ta mezon (TR, CC, LR, GRA) bo'yicha darhol baholang.",
      stats: "Daqiqalik tahlil • Band 5.0 - 9.0",
      path: "/ielts-writing",
      action: "Inshoni tekshirish",
      highlight: "AI xatolar tahlili"
    },
    {
      id: 'level-test',
      name: "Placement Level Test",
      badge: "INSTANT DIAGNOSTIC",
      tagColor: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      accentGrad: "from-amber-500 via-orange-600 to-red-600",
      icon: <FaClipboardCheck className="w-5 h-5 text-amber-400" />,
      desc: "Grammatika va lug'at boyligingizni 20 ta savol orqali 10 daqiqada sinovdan o'tkazing va mos tarifni biling.",
      stats: "20 ta savol • Bepul natija",
      path: "/level-test",
      action: "Darajangizni aniqlash",
      highlight: "10 daqiqada CEFR natija"
    }
  ];

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 select-none overflow-hidden">
      {/* Background Lighting (Hardware-optimized) */}
      <div 
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[380px] pointer-events-none -z-10 opacity-60"
        style={{
          background: "radial-gradient(ellipse at center, rgba(220, 38, 38, 0.1) 0%, transparent 68%)"
        }}
      />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 sm:mb-18 gap-6">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] dark:bg-white/[0.03] border border-red-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(239,68,68,0.15)] w-fit">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500 dark:text-red-400">
              OPTIMUM CDI & AI SUITE // 4 TA AMALIY VOSITA
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08] font-heading">
            IELTS imtihoniga to'liq{' '}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
              raqamli tayyorgarlik
            </span>
          </h2>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-normal max-w-md leading-relaxed md:text-right">
          Optimum platformasida kompyuterda topshiriladigan real CDI formati va sun'iy intellekt tahlillari bitta ekotizimda birlashtirilgan.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group relative p-7 sm:p-9 rounded-3xl bg-white/85 dark:bg-[#070b14]/85 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.08] hover:border-red-500/50 shadow-xl shadow-black/5 dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-2xl hover:shadow-red-500/15 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            {/* Top Glow Highlight Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-13 h-13 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-red-500/40 transition-all duration-300 shadow-sm">
                  {tool.icon}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${tool.tagColor}`}>
                    {tool.badge}
                  </span>
                </div>
              </div>

              {/* Title & Badge */}
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2.5 font-heading tracking-tight group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                {tool.name}
              </h3>

              <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <FaCheckCircle className="w-3 h-3 text-emerald-500" />
                <span>{tool.highlight}</span>
                <span className="opacity-40">•</span>
                <span>{tool.stats}</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed font-normal mb-8">
                {tool.desc}
              </p>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                {tool.action}
              </span>
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-500 group-hover:translate-x-1 transition-all duration-300 shadow-xs">
                <FaArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
