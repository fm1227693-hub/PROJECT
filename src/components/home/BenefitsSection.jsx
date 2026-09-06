import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaBolt,
  FaComments,
  FaAward,
  FaArrowRight,
  FaCheck,
  FaTimes,
  FaShieldAlt,
  FaChartLine,
  FaUserGraduate,
  FaLightbulb
} from 'react-icons/fa';

export default function BenefitsSection() {
  const { t } = useTranslation();

  const principles = [
    {
      id: 1,
      code: 'CORE_01',
      tag: 'Asosiy Tamoyil I',
      title: 'Tezkor & O\'lchanadigan Natija',
      desc: "Maxsus ishlab chiqilgan intensiv modullar va har haftalik oraliq nazoratlar orqali qisqa fursatda sezilarli til o'sishini ta'minlaymiz.",
      icon: <FaBolt className="w-7 h-7" />,
      color: 'from-amber-500 to-orange-600',
      badge: 'Fast Results',
      metric: '3–4 Oyda +1.5 Band'
    },
    {
      id: 2,
      code: 'CORE_02',
      tag: 'Asosiy Tamoyil II',
      title: 'Amaliy Yondashuv & Jonli Nutq',
      desc: "Darslarning 80% qismi faol suhbat va real muloqotga asoslangan. Zerikarli qoidalar o'rniga jonli nutq orqali til to'sig'ini ilk haftadanoq sindiramiz.",
      icon: <FaComments className="w-7 h-7" />,
      color: 'from-rose-500 to-red-600',
      badge: 'Practical Speaking',
      metric: '80% Dars Nutqda'
    },
    {
      id: 3,
      code: 'CORE_03',
      tag: 'Asosiy Tamoyil III',
      title: 'Mukammallikka Intilish & Mentor Nazorati',
      desc: "Har bir o'quvchining insholari va xatolari ustida individual ishlanadi. Zaif nuqtalar aniqlanib, IELTS 7.5+ darajagacha maqsadli yo'naltiriladi.",
      icon: <FaAward className="w-7 h-7" />,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Individual Diagnostics',
      metric: '1-on-1 Xatolar Tahlili'
    }
  ];

  const comparison = [
    {
      feature: 'Dars Formati & Muhit',
      traditional: 'Faqat kitobdan passiv o\'qish va qoida yodlash',
      optimum: 'Interaktiv CDI simulyatori, jonli munozaralar va AI tahlil'
    },
    {
      feature: 'Speaking & Muloqot Amaliyoti',
      traditional: 'Haftada bir necha daqiqa navbat bilan gapirish',
      optimum: 'Har bir darsda 80% faol muloqot + Yakshanba Speaking Club'
    },
    {
      feature: 'Insho (Writing) Baholash',
      traditional: 'Umumiy qizil ruchka bilan tuzatish, mezonlar noaniq',
      optimum: 'IELTS Band Deskriptorlari bo\'yicha 4 mezonli batafsil audit'
    },
    {
      feature: 'Imtihon Tayyorgarligi',
      traditional: 'Faqat qog\'ozdagi eskirgan testlar',
      optimum: 'Real kompyuterda topshiriladigan CDI Mock platformasi'
    }
  ];

  return (
    <section id="why-us" className="py-24 sm:py-32 relative overflow-hidden bg-slate-100/50 dark:bg-[#070912]/80 border-t border-slate-200/80 dark:border-white/[0.06] select-none">
      
      {/* Ambient Lighting */}
      <div className="pointer-events-none absolute top-10 left-10 w-[550px] h-[550px] bg-rose-500/10 rounded-full blur-[150px] -z-10" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[550px] h-[550px] bg-purple-500/10 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="badge-neon mb-3">
            ✦ OPTIMUM METODIKASI & 3 ASOSIY USTUN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Nega talabalarimiz aynan{' '}
            <span className="text-gradient-accent">OptimumELC ni tanlaydi?</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Biz ta'lim jarayonini zerikarli yodlashdan ozod qilib, xalqaro metodika va zamonaviy raqamli amaliyotga tayanamiz.
          </p>
        </div>

        {/* 3 Core Principles Cards with Spatial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          {principles.map((principle, idx) => (
            <motion.div
              key={principle.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="glass-glow-card p-7 sm:p-9 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300 relative bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${principle.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {principle.icon}
                  </div>
                  <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    {principle.code}
                  </span>
                </div>

                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                    {principle.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {principle.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                  {principle.desc}
                </p>

                <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Ko'rsatkich:</span>
                  <span className="font-mono text-xs font-black text-rose-600 dark:text-rose-400">{principle.metric}</span>
                </div>
              </div>

              <Link
                to={`/principle/${principle.id}`}
                className="mt-8 pt-4 border-t border-slate-100 dark:border-white/10 inline-flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 transition-colors"
              >
                <span>Batafsil tamoyil haqida</span>
                <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Futuristic Comparative Matrix */}
        <div className="glass-glow-card p-6 sm:p-10 rounded-[32px] bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 shadow-2xl">
          <div className="max-w-2xl mb-8 text-left">
            <span className="badge-pill mb-2">
              ✦ SHAFFAF TAQQOSLASH
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              An'anaviy O'qitish vs OptimumELC Tizimi
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4 font-bold">Mezon & Xususiyat</th>
                  <th className="py-4 px-4 font-bold text-slate-500">Oddiy Kurslar</th>
                  <th className="py-4 px-4 font-bold text-rose-600 dark:text-rose-400 bg-rose-500/5 dark:bg-rose-500/10 rounded-t-2xl">
                    OptimumELC Yondashuvi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs sm:text-sm">
                {comparison.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-start gap-2">
                        <FaTimes className="text-rose-500 shrink-0 mt-0.5 text-xs" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white bg-rose-500/5 dark:bg-rose-500/10">
                      <div className="flex items-start gap-2 text-rose-600 dark:text-rose-300">
                        <FaCheck className="text-emerald-500 shrink-0 mt-0.5 text-xs" />
                        <span>{row.optimum}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
