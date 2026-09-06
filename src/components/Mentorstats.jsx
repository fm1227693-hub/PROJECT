import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTelegramPlane,
  FaAward,
  FaCheckCircle,
  FaPhoneAlt,
  FaUser,
  FaPaperPlane,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MENTORS } from '../data/mentorsData';
import ConsultationModal from './ui/ConsultationModal';

export default function Mentorstats() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedMentor, setSelectedMentor] = useState(null);

  return (
    <div className="pt-28 sm:pt-36 pb-20 font-sans px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto select-none">
      
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
      >
        <FaArrowLeft className="text-xs" />
        <span>Ortga</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="badge-pill mb-3">
          ✦ {t('mentors.sectionTitle', 'Optimum Jamoasi')}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tajribali Mentorlarimiz
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
          Ingliz tili va xalqaro imtihonlarda yuqori natijaga erishishingizga ko'maklashuvchi mutaxassislar.
        </p>
      </div>

      {/* Mentors Showcase */}
      <div className="space-y-8">
        {MENTORS.map((mentor) => (
          <div
            key={mentor.id}
            className="premium-surface p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-2 border-rose-500 shadow-lg mb-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-rose-600 text-white text-xs font-bold py-1 font-mono">
                    IELTS {mentor.ieltsScore}
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  {mentor.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {mentor.role}
                </p>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {mentor.experience}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {mentor.studentsPrepared}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {mentor.fullBio || mentor.bio}
                </p>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Asosiy Mutaxassisliklari:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSelectedMentor(mentor.name)}
                    className="btn-primary py-2.5 px-6 text-xs sm:text-sm cursor-pointer"
                  >
                    Darsga yozilish
                  </button>

                  <a
                    href={mentor.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-2.5 px-4 text-xs font-semibold flex items-center gap-2 text-sky-500"
                  >
                    <FaTelegramPlane />
                    <span>Telegramda bog'lanish</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <ConsultationModal
        isOpen={!!selectedMentor}
        onClose={() => setSelectedMentor(null)}
        defaultCourse={selectedMentor ? `Ustoz: ${selectedMentor}` : 'General IELTS'}
      />
    </div>
  );
}
