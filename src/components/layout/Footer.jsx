import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTelegramPlane,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaShieldAlt,
  FaFileContract,
  FaTimes,
  FaArrowRight,
  FaGraduationCap
} from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  const socials = [
    {
      icon: <FaTelegramPlane />,
      href: 'https://telegram.me/optimumenglishscape',
      label: 'Telegram',
      color: 'hover:text-sky-400 hover:border-sky-400',
    },
    {
      icon: <FaInstagram />,
      href: 'https://www.instagram.com/optimum_english_9/profilecard/?igsh=MTZmc2JvMmhvNHpjdw==',
      label: 'Instagram',
      color: 'hover:text-pink-400 hover:border-pink-400',
    },
    {
      icon: <FaYoutube />,
      href: 'https://youtube.com/@optimumschoolofenglish?si=3swxgqQR7g884fnu',
      label: 'YouTube',
      color: 'hover:text-red-500 hover:border-red-500',
    },
  ];

  return (
    <footer className="relative bg-white/80 dark:bg-[#05070e] border-t border-slate-200 dark:border-white/10 pt-16 pb-12 select-none">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-white/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white font-extrabold shadow-md shadow-rose-600/30">
                O
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                OPTIMUM<span className="text-rose-600">ELC</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Buxoro shahridagi yetakchi ingliz tili va IELTS akademiyasi. Haqiqiy CDI simulyatsiyasi, AI tahlillari va professional ustozlar.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all ${s.color}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
              Navigatsiya
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <a href="#courses" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Kurslar & Darajalar
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Nega OptimumELC
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  O'quvchilar Natijalari
                </a>
              </li>
              <li>
                <a href="#mentors" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Mentorlar & Jamoa
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Biz haqimizda & Filial
                </Link>
              </li>
            </ul>
          </div>

          {/* Practice Hub Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
              IELTS Amaliyot
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/level-test" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  40-Savolli Test
                </Link>
              </li>
              <li>
                <Link to="/reading-tests" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  CDI Reading Hub
                </Link>
              </li>
              <li>
                <Link to="/listening-tests" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  CDI Listening Hub
                </Link>
              </li>
              <li>
                <Link to="/ielts-writing" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  AI Writing Assessor
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                  Lug'at O'yinlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
              Aloqa & Ish Vaqti
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Premier+School,+Namozgoh+St,+Bukhara"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                <FaMapMarkerAlt className="text-rose-500 shrink-0 mt-0.5" />
                <span>Buxoro shahri, Namozgoh ko'chasi (Premier School)</span>
              </a>

              <a
                href="tel:+998900829979"
                className="flex items-center gap-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors font-bold text-slate-800 dark:text-slate-200"
              >
                <FaPhoneAlt className="text-rose-500 shrink-0 text-xs" />
                <span>+998 90 082 99 79</span>
              </a>

              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <FaClock className="text-amber-500 shrink-0" />
                <span>Har kuni: 08:00 – 20:00</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Optimum School of English (OptimumELC). Barcha huquqlar himoyalangan.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              Maxfiylik Siyosati
            </button>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              Foydalanish Shartlari
            </button>
          </div>
        </div>

      </div>

      {/* Privacy & Terms Modals */}
      <AnimatePresence>
        {activeModal && (
          <div
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#0e121e] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                <FaTimes />
              </button>

              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center text-lg">
                  {activeModal === 'privacy' ? <FaShieldAlt /> : <FaFileContract />}
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                  {activeModal === 'privacy' ? 'Maxfiylik Siyosati' : 'Foydalanish Shartlari'}
                </h3>
              </div>

              {activeModal === 'privacy' ? (
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">1. Ma'lumotlarni Yig'ish</h4>
                    <p>Biz faqat sayt orqali yuborilgan ism, telefon raqami va tanlangan kurs ma'lumotlarini qabul qilamiz.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">2. Ma'lumotlardan Foydalanish</h4>
                    <p>Yig'ilgan ma'lumotlar faqat siz bilan bog'lanish, bepul konsultatsiya taqdim etish va dars jarayonini tashkillashtirish uchun ishlatiladi.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">3. Uchinchi Tomonlarga Berilmaslik</h4>
                    <p>Sizning shaxsiy ma'lumotlaringiz hech qachon begona shaxslarga yoki tashkilotlarga sotilmaydi va ijaraga berilmaydi.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">1. Xizmatlardan Foydalanish</h4>
                    <p>OptimumELC platformasi va onlayn IELTS test tizimlari o'quvchilarning bilim va ko'nikmalarini oshirish uchun mo'ljallangan.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">2. Intellektual Mulk</h4>
                    <p>Saytdagi barcha o'quv materiallari, CDI test bazasi va dizayn elementlari OptimumELC intellektual mulki hisoblanadi.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">3. Aloqa</h4>
                    <p>Savol va takliflar bo'yicha +998 90 082 99 79 raqami orqali murojaat qilishingiz mumkin.</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveModal(null)}
                className="btn-primary w-full mt-6 py-2.5 text-xs"
              >
                Tushunarli / Yopish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </footer>
  );
}
