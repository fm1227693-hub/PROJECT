import React, { Suspense, lazy, useState, useRef, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from 'react-hot-toast';
import { FaAndroid, FaPhone, FaTimes, FaHeadset } from 'react-icons/fa';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";

import { AuthProvider } from "./utils/AuthContext";

// Lazy-loaded routes for performance & low initial JS payload
const Stats = lazy(() => import("./components/Stats"));
const Products = lazy(() => import("./components/Products"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const Admin = lazy(() => import("./components/Admin"));
const Mentorstats = lazy(() => import("./components/Mentorstats"));
const Register = lazy(() => import("./components/Register"));
const LevelTest = lazy(() => import("./components/LevelTest"));
const Pricing = lazy(() => import("./components/Pricing"));
const Gamess = lazy(() => import("./components/Gamess"));
const ReadingHub = lazy(() => import("./components/ReadingHub"));
const ListeningHub = lazy(() => import("./components/ListeningHub"));
const FAQ = lazy(() => import("./components/FAQ"));
const LeadForm = lazy(() => import("./components/LeadForm"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./components/TermsOfUse"));
const IeltsWritingAssessor = lazy(() => import("./components/IeltsWritingAssessor"));
const Principle = lazy(() => import("./components/Principle"));
const Login = lazy(() => import("./components/Login"));
const StudentRegister = lazy(() => import("./components/StudentRegister"));
const AccessRequest = lazy(() => import("./components/AccessRequest"));
const StudentDashboard = lazy(() => import("./components/StudentDashboard"));

function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Lightweight route fallback indicator
function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 rounded-full border-2 border-red-500/20 border-t-red-600 animate-spin" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const [fabOpen, setFabOpen] = useState(false);
  const fabRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fabRef.current && !fabRef.current.contains(e.target)) {
        setFabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F7F5F0] dark:bg-[#080B12] transition-colors duration-300 overflow-x-hidden font-sans">
      <style>{`
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-100%); }
        }
        body.mobile-menu-open .fab-button-container {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.8);
        }
      `}</style>

      {/* Editorial Background System: Exact Obsidian (#080909), Crimson Illuminations & 80px Fine Grid Lines */}
      <div className="site-background pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
        {/* Layer 1: Base Dark Obsidian (#080909) / Ivory Surface (#F8F7F4) */}
        <div className="absolute inset-0 bg-[#F8F7F4] dark:bg-[#080909] transition-colors duration-500" />

        {/* Layer 2: Subtle Editorial Illumination Waves (Dark Mode) */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 overflow-hidden">
          {/* Base Atmospheric Bed */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(160deg, #090a0c 0%, #080909 50%, #0a0b0e 100%)"
            }}
          />

          {/* Primary Flowing Optimum Crimson Silk Glow */}
          <div 
            className="wave-layer-1 absolute -inset-[15%] opacity-70 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 65% 35% at 20% 20%, rgba(225, 29, 72, 0.12) 0%, rgba(159, 18, 57, 0.04) 40%, transparent 70%),
                radial-gradient(ellipse 70% 38% at 80% 65%, rgba(190, 18, 60, 0.08) 0%, transparent 65%)
              `,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Secondary Deep Crimson Counter-Wave */}
          <div 
            className="wave-layer-2 absolute -inset-[15%] opacity-65 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 85% 25%, rgba(225, 29, 72, 0.09) 0%, transparent 65%),
                radial-gradient(ellipse 55% 45% at 25% 75%, rgba(251, 146, 60, 0.04) 0%, transparent 60%)
              `,
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        {/* Light Mode Subtle Red Aura */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500 overflow-hidden">
          <div 
            className="wave-layer-1 absolute -inset-[15%] opacity-50 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 60% 35% at 25% 25%, rgba(225, 29, 72, 0.04) 0%, transparent 70%),
                radial-gradient(ellipse 65% 40% at 75% 65%, rgba(40, 55, 95, 0.03) 0%, transparent 70%)
              `,
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        {/* Layer 3: Architectural Grid Lines (Exact 80px x 80px matching home) */}
        <div 
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.065) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.065) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            backgroundPosition: "center top",
          }}
        />

        {/* Layer 4: Restrained Vignette */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-40 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 60%, rgba(8, 9, 9, 0.75) 100%)"
          }}
        />
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="site-content relative z-10">
        {location.pathname !== '/enter' && <Navbar />}
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Suspense fallback={<RouteFallback />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Main />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/products" element={<Products />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/enter" element={<Admin />} />
                <Route path="/mentor-stats" element={<Mentorstats />} />
                <Route path="/register" element={<Register />} />
                <Route path="/level-test" element={<LevelTest />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/games" element={<Gamess />} />
                <Route path="/reading-tests" element={<ReadingHub />} />
                <Route path="/listening-tests" element={<ListeningHub />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/form" element={<LeadForm />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/ielts-writing" element={<IeltsWritingAssessor />} />
                <Route path="/principle/:id" element={<Principle />} />
                <Route path="/login" element={<Login />} />
                <Route path="/student/register" element={<StudentRegister />} />
                <Route path="/access-request" element={<AccessRequest />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
              </Routes>
            </Suspense>
            {location.pathname !== '/enter' && <Footer />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Expandable Floating Quick Actions (Speed Dial Menu) */}
      {!location.pathname.startsWith('/enter') && 
       !location.pathname.startsWith('/reading-tests') && 
       !location.pathname.startsWith('/listening-tests') && 
       !location.pathname.startsWith('/ielts-writing') && (
        <div 
          ref={fabRef}
          className="fab-button-container fixed bottom-6 right-5 sm:right-6 z-50 flex flex-col items-end gap-2.5 select-none"
        >
          {/* Pop-out Expanded Action Buttons */}
          <AnimatePresence>
            {fabOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.85 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex flex-col items-end gap-2.5 mb-1"
              >
                {/* 1. Download App (APK) Action */}
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold tracking-wide shadow-xl border border-white/10 dark:border-slate-800 whitespace-nowrap animate-in fade-in">
                    Ilovani yuklab olish (.apk)
                  </span>
                  <a
                    href="/Optimum.apk"
                    download="Optimum.apk"
                    onClick={() => {
                      toast.success("Optimum ilovasi yuklanmoqda! (1.7 MB)", {
                        icon: '📲',
                        duration: 4000
                      });
                      setFabOpen(false);
                    }}
                    className="relative w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 border-2 border-white/80 dark:border-slate-800 transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                    title="Optimum APK ilovasini yuklab olish"
                  >
                    <span className="absolute -top-1 -right-1 px-1 py-0.2 rounded-full text-[8px] font-mono font-black bg-white text-emerald-700 shadow-xs border border-emerald-500/30">
                      APK
                    </span>
                    <FaAndroid className="w-5 h-5" />
                  </a>
                </div>

                {/* 2. Direct Call Action */}
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold tracking-wide shadow-xl border border-white/10 dark:border-slate-800 whitespace-nowrap animate-in fade-in">
                    Qo'ng'iroq qilish (+998 91 082 99 79)
                  </span>
                  <a
                    href="tel:+998910829979"
                    onClick={() => setFabOpen(false)}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-600/35 border-2 border-white/80 dark:border-slate-800 transition-transform active:scale-95 hover:scale-105 cursor-pointer"
                    title="Bog'lanish uchun qo'ng'iroq qiling"
                  >
                    <FaPhone className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Single Main FAB Trigger Button */}
          <button
            type="button"
            onClick={() => setFabOpen(prev => !prev)}
            className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/80 dark:border-slate-800 ${
              fabOpen 
                ? 'bg-slate-900 dark:bg-white dark:text-slate-900 shadow-slate-900/40' 
                : 'bg-gradient-to-br from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 shadow-red-600/40'
            }`}
            title={fabOpen ? "Yopish" : "Bog'lanish va Ilova"}
            aria-label="Tezkor menyu"
          >
            <AnimatePresence mode="wait">
              {fabOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FaTimes className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-25 pointer-events-none" />
                  <FaHeadset className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      )}
    </div>
  );
}