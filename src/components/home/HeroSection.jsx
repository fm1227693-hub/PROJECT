import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight,
  FaCheckCircle,
  FaHeadphones,
  FaBookOpen,
  FaPenNib,
  FaAward,
  FaFire,
  FaLaptopCode,
  FaChartLine,
  FaPlay,
  FaPause,
  FaRobot,
  FaSlidersH,
  FaVolumeUp,
  FaCheck
} from 'react-icons/fa';
import ConsultationModal from '../ui/ConsultationModal';

export default function HeroSection() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'writing' | 'calculator'
  
  // Interactive Simulator States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [calculatorCurrentBand, setCalculatorCurrentBand] = useState(5.5);
  const [calculatorTargetBand, setCalculatorTargetBand] = useState(7.5);
  const [sampleEssayText, setSampleEssayText] = useState(
    'In recent years, artificial intelligence has fundamentally transformed education and language learning across the globe.'
  );

  const cardRef = useRef(null);

  // Mouse 3D perspective tilt
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = null;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetRotateX = (-y / rect.height) * 7;
      targetRotateY = (x / rect.width) * 7;
    };

    const onMouseLeave = () => {
      targetRotateX = 0;
      targetRotateY = 0;
    };

    const animateTilt = () => {
      currentRotateX += (targetRotateX - currentRotateX) * 0.1;
      currentRotateY += (targetRotateY - currentRotateY) * 0.1;
      if (card) {
        card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg)`;
      }
      rafId = requestAnimationFrame(animateTilt);
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(animateTilt);

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Calculate estimated study time for Band Calculator
  const bandDiff = Math.max(0.5, calculatorTargetBand - calculatorCurrentBand);
  const estimatedMonths = Math.round(bandDiff * 2.5);
  const recommendedCourse =
    calculatorTargetBand >= 8.0
      ? 'IELTS Mastery 8.5+'
      : calculatorTargetBand >= 7.0
      ? 'IELTS Intensive (B2-C1)'
      : 'Pre-IELTS (B1-B2)';

  return (
    <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden select-none">
      
      {/* Dynamic Laser & Aurora Glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1000px] h-[550px] bg-gradient-to-tr from-rose-600/15 via-red-600/10 to-amber-500/10 rounded-full blur-[160px] -z-10" />
      <div className="pointer-events-none absolute -top-32 -left-32 w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[140px] -z-10" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[160px] -z-10" />

      {/* Delicate Grid Lines */}
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-60 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Bold Editorial Positioning */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            
            {/* Top Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="badge-neon"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>OPTIMUMELC • PREMIER ENGLISH & IELTS ACADEMY</span>
            </motion.div>

            {/* Dominant Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-5.5xl xl:text-6xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.06]"
            >
              Ingliz tilini noldan{' '}
              <span className="text-gradient-accent">
                IELTS 8.5+ darajagacha
              </span>{' '}
              mukammal egallang.
            </motion.h1>

            {/* Sub-narrative */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl"
            >
              OptimumELC — Cambridge CDI Mock simulyatori, AI yozuv tekshiruvi, 80% jonli nutqqa asoslangan darslar va IELTS 8.0 mentorlar bilan Buxorodagi eng kuchli ta'lim ekotizimi.
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2"
            >
              <Link
                to="/level-test"
                className="btn-primary w-full sm:w-auto text-sm sm:text-base py-4 px-8 shadow-xl shadow-rose-600/35"
              >
                <span>40-Savolli Daraja Testi</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setModalOpen(true)}
                className="btn-secondary w-full sm:w-auto text-sm sm:text-base py-4 px-7 font-bold cursor-pointer"
              >
                <span>1-Darsga Bepul Yozilish</span>
              </button>
            </motion.div>

            {/* Credibility Metric Counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-200/80 dark:border-white/10 w-full max-w-lg text-left"
            >
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white font-mono">
                  200+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-snug mt-1">
                  Band 7.0+ Natijalar
                </div>
              </div>

              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-rose-600 dark:text-rose-400 font-mono">
                  IELTS 8.0
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-snug mt-1">
                  Senior Mentorlar
                </div>
              </div>

              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white font-mono">
                  100% CDI
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium leading-snug mt-1">
                  Imtihon Simulyatsiyasi
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Interactive CDI Exam Studio & AI Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center"
          >
            <div
              ref={cardRef}
              className="relative w-full max-w-xl transition-transform duration-200 ease-out"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Floating Top Left Pill: Real CDI Engine */}
              <div className="absolute -top-4 -left-3 sm:-top-5 sm:-left-5 z-20 bg-white/95 dark:bg-[#0b0f1c]/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-rose-500/30 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-rose-600/30">
                  CDI
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>British Council Exam Engine</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Official Exam Interface Simulator
                  </div>
                </div>
              </div>

              {/* Main Interactive Studio Card */}
              <div className="glass-glow-card p-5 sm:p-7 rounded-[32px] relative overflow-hidden bg-white/90 dark:bg-[#0b0f1b]/95 border border-slate-200/90 dark:border-white/10 shadow-2xl">
                
                {/* Laser Line Header */}
                <div className="laser-line pb-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                  {/* Studio Tabs */}
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#111728] p-1 rounded-xl border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => setActiveTab('simulator')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'simulator'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <FaHeadphones className="text-[11px]" />
                        <span>CDI Mock Lab</span>
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('writing')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'writing'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <FaRobot className="text-[11px]" />
                        <span>AI Writing</span>
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('calculator')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'calculator'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <FaSlidersH className="text-[11px]" />
                        <span>Band Target</span>
                      </span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono font-extrabold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                    LIVE HUD
                  </span>
                </div>

                {/* Tab 1: CDI Mock Lab Simulator */}
                {activeTab === 'simulator' && (
                  <div className="space-y-4 pt-4">
                    
                    {/* Audio Player Strip */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                          <FaVolumeUp className="text-purple-500" />
                          <span>IELTS Listening Part 1: Registration Dialogue</span>
                        </span>
                        <span className="font-mono text-purple-600 dark:text-purple-400 text-[11px]">
                          02:14 / 05:40
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs shrink-0 hover:bg-purple-500 transition-colors cursor-pointer shadow-md shadow-purple-600/30"
                        >
                          {isPlayingAudio ? <FaPause /> : <FaPlay className="ml-0.5" />}
                        </button>

                        {/* Animated Equalizer Waveform */}
                        <div className="flex-1 flex items-center gap-1 h-6 px-2 bg-purple-500/5 dark:bg-purple-950/30 rounded-xl overflow-hidden">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full bg-purple-500 transition-all ${
                                isPlayingAudio ? 'wave-bar' : 'h-1.5 opacity-50'
                              }`}
                              style={{ height: isPlayingAudio ? undefined : `${(i % 5) * 3 + 4}px` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Sample Question */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span>QUESTION 01 OF 40</span>
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <FaCheckCircle /> 1 Mark
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        According to the speaker, what is the required start date for the intensive IELTS course?
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {[
                          { id: 'A', text: 'Monday, 15th of September', correct: true },
                          { id: 'B', text: 'Wednesday, 24th of October', correct: false },
                          { id: 'C', text: 'Friday, 1st of November', correct: false },
                          { id: 'D', text: 'Next academic semester', correct: false }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setSelectedAnswer(opt.id)}
                            className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border cursor-pointer flex items-center justify-between ${
                              selectedAnswer === opt.id
                                ? opt.correct
                                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
                                  : 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-bold'
                                : 'bg-white dark:bg-[#0b0f1b] border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-purple-500/40'
                            }`}
                          >
                            <span><strong>{opt.id}.</strong> {opt.text}</span>
                            {selectedAnswer === opt.id && (
                              opt.correct ? <FaCheck className="text-emerald-500 text-xs" /> : <span className="text-rose-500 text-xs">✕</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Tab 2: AI Writing Evaluator */}
                {activeTab === 'writing' && (
                  <div className="space-y-4 pt-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                        <span>Task 2 Prompt: AI in Education</span>
                        <span className="text-rose-600 dark:text-rose-400 font-mono">
                          Words: {sampleEssayText.trim().split(/\s+/).length}
                        </span>
                      </div>

                      <textarea
                        rows={3}
                        value={sampleEssayText}
                        onChange={(e) => setSampleEssayText(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#0b0f1b] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
                      />
                    </div>

                    {/* AI Scoring Radar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Task Response</div>
                        <div className="text-base font-black text-rose-600 dark:text-rose-400 font-mono">8.5</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Coherence</div>
                        <div className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">8.0</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Lexical</div>
                        <div className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">8.5</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Grammar</div>
                        <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">8.0</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Interactive Band Target Calculator */}
                {activeTab === 'calculator' && (
                  <div className="space-y-4 pt-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111728] border border-slate-200/80 dark:border-white/5 space-y-3">
                      
                      {/* Sliders */}
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Hozirgi Darajangiz:</span>
                          <span className="font-mono text-rose-600 dark:text-rose-400 font-black">IELTS {calculatorCurrentBand.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="3.5"
                          max="7.0"
                          step="0.5"
                          value={calculatorCurrentBand}
                          onChange={(e) => setCalculatorCurrentBand(parseFloat(e.target.value))}
                          className="w-full accent-rose-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Maqsadli Natijangiz:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">IELTS {calculatorTargetBand.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="6.0"
                          max="8.5"
                          step="0.5"
                          value={calculatorTargetBand}
                          onChange={(e) => setCalculatorTargetBand(parseFloat(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>

                    </div>

                    {/* Projected Plan Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-transparent border border-rose-500/20 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tavsiya Kurs & Muddat</div>
                        <div className="text-sm font-black text-slate-900 dark:text-white font-display">{recommendedCourse}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Taxminiy vaqt: ~{estimatedMonths} oy intensiv tayyorgarlik</div>
                      </div>
                      <Link
                        to="/form"
                        className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-500 transition-colors"
                      >
                        Yozilish
                      </Link>
                    </div>
                  </div>
                )}

                {/* Studio Footer */}
                <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="https://szmzkerbxkkxgocvxnhn.supabase.co/storage/v1/object/public/IMAGES/photo_2026-07-23_23-14-12.jpg"
                      alt="Ruhillo Asrorov"
                      className="w-7 h-7 rounded-full object-cover border border-rose-500"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        Ruhillo Asrorov
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Senior Instructor (IELTS 8.0)
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/reading-tests"
                    className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <span>To'liq CDI platformasini ochish</span>
                    <FaArrowRight className="w-2.5 h-2.5" />
                  </Link>
                </div>

              </div>

              {/* Floating Bottom Right Badge: 98% Success */}
              <div className="absolute -bottom-4 -right-3 sm:-bottom-5 sm:-right-5 z-20 bg-white/95 dark:bg-[#0b0f1c]/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-rose-500/30 shadow-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm">
                  <FaCheckCircle />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white font-mono">
                    98% Success Rate
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Target Band Goal Achieved
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>

      <ConsultationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
