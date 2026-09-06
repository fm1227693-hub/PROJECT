import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaTelegramPlane,
  FaAward,
  FaCheckCircle,
  FaUserTie,
  FaCalendarAlt,
  FaArrowRight,
  FaStar,
  FaGraduationCap
} from 'react-icons/fa';
import { MENTORS } from '../../data/mentorsData';
import ConsultationModal from '../ui/ConsultationModal';

export default function MentorsSection() {
  const { t } = useTranslation();
  const [selectedMentor, setSelectedMentor] = useState(null);

  return (
    <section id="mentors" className="py-24 sm:py-32 relative select-none bg-slate-100/50 dark:bg-[#060810]/70 border-t border-slate-200/80 dark:border-white/[0.06]">
      
      {/* Background Lighting */}
      <div className="pointer-events-none absolute top-1/2 right-10 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[160px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="badge-neon mb-3">
            ✦ OPTIMUM FACULTY & MENTORS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
            Natijalarga javobgar{' '}
            <span className="text-gradient-accent">tajribali ustozlar.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
            Har bir o'qituvchimiz xalqaro IELTS 8.0+ sertifikatiga, chuqur metodologiyaga va yuzlab bitiruvchilar natijasiga ega.
          </p>
        </div>

        {/* Mentors Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {MENTORS.map((mentor, idx) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="glass-glow-card p-6 sm:p-9 rounded-[32px] bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-300"
            >
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                  <div className="relative w-22 h-22 sm:w-26 sm:h-26 rounded-2xl overflow-hidden shrink-0 border-2 border-rose-500 shadow-xl">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-[10px] font-black py-0.5 text-center font-mono uppercase tracking-wider">
                      IELTS {mentor.ieltsScore}
                    </div>
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {mentor.experience}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                        <FaCheckCircle className="text-xs" /> Certified
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {mentor.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-left">
                  {mentor.bio}
                </p>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200/60 dark:border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                <a
                  href={mentor.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-sky-500 hover:text-sky-600 transition-colors"
                >
                  <FaTelegramPlane className="text-sm" />
                  <span>Telegram orqali bog'lanish</span>
                </a>

                <button
                  onClick={() => setSelectedMentor(mentor.name)}
                  className="btn-primary py-2.5 px-5 text-xs font-bold cursor-pointer"
                >
                  Darsga yozilish
                </button>
              </div>

            </motion.div>
          ))}
        </div>

      </div>

      <ConsultationModal
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
        defaultCourse={selectedMentor ? `Ustoz: ${selectedMentor}` : 'IELTS Course'}
      />
    </section>
  );
}
