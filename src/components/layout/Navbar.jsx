import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRegMoon,
  FaRegSun,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaGraduationCap,
  FaBookOpen,
  FaHeadphones,
  FaPenNib,
  FaGamepad,
  FaCheckCircle,
  FaPhoneAlt,
  FaArrowRight
} from 'react-icons/fa';
import ConsultationModal from '../ui/ConsultationModal';

const LANGS = {
  uz: { label: "O'zbekcha", code: 'uz', short: 'UZ' },
  en: { label: 'English', code: 'en', short: 'EN' },
  ru: { label: 'Русский', code: 'ru', short: 'RU' },
};

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === null) return true;
    return saved === 'true' || saved === 'dark';
  });

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const toolsRef = useRef(null);
  const langRef = useRef(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme switcher
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lng', code);
    setLangDropdownOpen(false);
  };

  const scrollToAnchor = (anchorId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentLang = LANGS[i18n.language] ? i18n.language : 'uz';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none ${
          scrolled
            ? 'py-2.5 sm:py-3 bg-white/85 dark:bg-[#080a11]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-sm'
            : 'py-4 sm:py-5 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 p-0.5 shadow-md shadow-rose-600/30 flex items-center justify-center text-white overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/favicon.png"
                alt="OptimumELC"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-extrabold text-sm tracking-tighter">O</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  OPTIMUM<span className="text-rose-600">ELC</span>
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1 tracking-wider uppercase">
                English & IELTS Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => scrollToAnchor('courses')}
              className="px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
            >
              {t('levels.sectionBadge', 'Kurslar & Darajalar')}
            </button>

            <button
              onClick={() => scrollToAnchor('why-us')}
              className="px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
            >
              Nega OptimumELC
            </button>

            {/* Practice Hub Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
              >
                <span>IELTS Practice Suite</span>
                <FaChevronDown
                  className={`w-2.5 h-2.5 transition-transform duration-200 ${
                    toolsDropdownOpen ? 'rotate-180 text-rose-600' : 'opacity-60'
                  }`}
                />
              </button>

              <AnimatePresence>
                {toolsDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#0f1422] rounded-2xl p-2 shadow-2xl border border-slate-200/80 dark:border-white/10 z-50 flex flex-col gap-1"
                  >
                    <Link
                      to="/level-test"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <FaGraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 flex items-center gap-1.5">
                          <span>40-Savolli Daraja Testi</span>
                          <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-extrabold rounded">BEPUL</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          CEFR A1-C2 darajangizni 10 daqiqada aniqlang
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/reading-tests"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <FaBookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                          CDI Reading Simulyatori
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          6 ta to'liq akademik matnlar to'plami
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/listening-tests"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <FaHeadphones className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                          CDI Listening Amaliyoti
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          Haqiqiy audio va ko'p variantli savollar
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/ielts-writing"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <FaPenNib className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                          AI IELTS Writing Assessor
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          Insholarni AI orqali tekshirish va band bahosi
                        </p>
                      </div>
                    </Link>

                    <Link
                      to="/games"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                        <FaGamepad className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                          Ingliz Tili O'yinlari
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          Lug'at boyligi va grammatik mashqlar
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => scrollToAnchor('results')}
              className="px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
            >
              {t('navbar.statistic', 'Natijalar')}
            </button>

            <button
              onClick={() => scrollToAnchor('mentors')}
              className="px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
            >
              {t('navbar.mentors', 'Mentorlar')}
            </button>

            <Link
              to="/about"
              className="px-3.5 py-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
            >
              {t('navbar.about', 'Biz haqimizda')}
            </Link>
          </nav>

          {/* Right Action Controls: Lang, Theme, CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 text-xs font-bold tracking-wider transition-colors cursor-pointer"
                aria-label="Change language"
              >
                <span>{LANGS[currentLang]?.short}</span>
                <FaChevronDown className="w-2 h-2 opacity-60" />
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-[#0e121e] rounded-xl p-1 shadow-xl border border-slate-200 dark:border-white/10 z-50 flex flex-col gap-0.5"
                  >
                    {Object.values(LANGS).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                          currentLang === lang.code
                            ? 'bg-rose-500 text-white font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-[10px] opacity-75">{lang.short}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              title={isDark ? 'Yorug\' rejimga o\'tish' : 'Tungi rejimga o\'tish'}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {isDark ? <FaRegSun className="w-4 h-4 text-amber-400" /> : <FaRegMoon className="w-4 h-4 text-slate-700" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Primary Action Button */}
            <Link
              to="/level-test"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-rose-600/30 hover:shadow-lg hover:shadow-rose-600/40 hover:-translate-y-0.5 transition-all active:translate-y-0"
            >
              <span>{t('navbar.levelTest', 'Daraja Testi')}</span>
              <FaArrowRight className="w-3 h-3" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#0b0e18] shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-200 dark:border-white/10"
            >
              <div className="space-y-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <img src="/favicon.png" alt="Optimum" className="w-8 h-8 rounded-lg" />
                    <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                      OPTIMUM<span className="text-rose-600">ELC</span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Navigation Groups */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400 dark:text-slate-500 px-3">
                    Bosh Sahifalar
                  </span>
                  <button
                    onClick={() => scrollToAnchor('courses')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200 text-left"
                  >
                    <span>{t('levels.sectionBadge', 'Kurslar & Darajalar')}</span>
                    <FaArrowRight className="w-3 h-3 opacity-40" />
                  </button>

                  <button
                    onClick={() => scrollToAnchor('why-us')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200 text-left"
                  >
                    <span>Nega OptimumELC</span>
                    <FaArrowRight className="w-3 h-3 opacity-40" />
                  </button>

                  <button
                    onClick={() => scrollToAnchor('results')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200 text-left"
                  >
                    <span>{t('navbar.statistic', 'O\'quvchilar Natijalari')}</span>
                    <FaArrowRight className="w-3 h-3 opacity-40" />
                  </button>

                  <button
                    onClick={() => scrollToAnchor('mentors')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200 text-left"
                  >
                    <span>{t('navbar.mentors', 'Ustozlar & Jamoa')}</span>
                    <FaArrowRight className="w-3 h-3 opacity-40" />
                  </button>

                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <span>{t('navbar.about', 'Biz haqimizda & Manzil')}</span>
                    <FaArrowRight className="w-3 h-3 opacity-40" />
                  </Link>
                </div>

                {/* IELTS Practice Suite Group */}
                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400 dark:text-slate-500 px-3">
                    IELTS & CEFR Amaliyot
                  </span>
                  
                  <Link
                    to="/level-test"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold"
                  >
                    <FaGraduationCap className="w-4 h-4" />
                    <span>40-Savolli Daraja Testi</span>
                  </Link>

                  <Link
                    to="/reading-tests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <FaBookOpen className="w-4 h-4 text-blue-500" />
                    <span>CDI Reading Testlari (6 ta)</span>
                  </Link>

                  <Link
                    to="/listening-tests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <FaHeadphones className="w-4 h-4 text-purple-500" />
                    <span>CDI Listening Testlari (6 ta)</span>
                  </Link>

                  <Link
                    to="/ielts-writing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <FaPenNib className="w-4 h-4 text-amber-500" />
                    <span>AI Writing Assessor</span>
                  </Link>

                  <Link
                    to="/games"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <FaGamepad className="w-4 h-4 text-teal-500" />
                    <span>Ingliz Tili O'yinlari</span>
                  </Link>
                </div>
              </div>

              {/* Mobile Footer CTAs */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setModalOpen(true);
                  }}
                  className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
                >
                  <span>Bepul darsga yozilish</span>
                  <FaArrowRight className="w-3 h-3" />
                </button>

                <a
                  href="tel:+998900829979"
                  className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <FaPhoneAlt className="text-rose-500 text-xs" />
                  <span>+998 90 082 99 79</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Consultation Modal */}
      <ConsultationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
