import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";

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

      {/* Full-Page Cinematic Background System with Continuous Fluid Waves (BEHIND ALL CONTENT) */}
      <div className="site-background pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
        {/* Layer 1: Base Layer - Midnight-Black (#070911) / Warm Ivory (#F7F5F0) */}
        <div className="absolute inset-0 bg-[#F7F5F0] dark:bg-[#070911] transition-colors duration-500" />

        {/* Layer 2: Continuous Flowing Fluid Wave Ribbons (Dark Mode) */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500 overflow-hidden">
          {/* Base Cinematic Gradient Bed */}
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(155deg, #0e111d 0%, #070911 50%, #090c16 100%)"
            }}
          />

          {/* Primary Wave Ribbon: Flowing Crimson & Burgundy Silk Wave */}
          <div 
            className="wave-layer-1 absolute -inset-[20%] opacity-90 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 65% 35% at 20% 20%, rgba(242, 13, 50, 0.24) 0%, rgba(242, 13, 50, 0.12) 35%, transparent 70%),
                radial-gradient(ellipse 70% 38% at 75% 65%, rgba(160, 20, 52, 0.20) 0%, rgba(160, 20, 52, 0.08) 35%, transparent 72%),
                radial-gradient(ellipse 55% 45% at 50% 45%, rgba(215, 25, 55, 0.16) 0%, rgba(215, 25, 55, 0.06) 35%, transparent 68%)
              `,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Secondary Wave Ribbon: Cool Midnight-Blue & Indigo Counter-Wave */}
          <div 
            className="wave-layer-2 absolute -inset-[20%] opacity-85 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 85% 20%, rgba(45, 70, 145, 0.24) 0%, rgba(45, 70, 145, 0.10) 35%, transparent 70%),
                radial-gradient(ellipse 65% 35% at 15% 75%, rgba(30, 55, 120, 0.20) 0%, rgba(30, 55, 120, 0.08) 35%, transparent 72%),
                radial-gradient(ellipse 50% 30% at 65% 85%, rgba(55, 35, 100, 0.16) 0%, rgba(55, 35, 100, 0.06) 35%, transparent 65%)
              `,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Tertiary Wave Ribbon: Ethereal Velvet Violet & Rose Highlight Swell */}
          <div 
            className="wave-layer-3 absolute -inset-[20%] opacity-75 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 75% 32% at 45% 15%, rgba(220, 30, 75, 0.18) 0%, rgba(220, 30, 75, 0.08) 35%, transparent 72%),
                radial-gradient(ellipse 60% 40% at 55% 80%, rgba(40, 75, 145, 0.18) 0%, rgba(40, 75, 145, 0.08) 35%, transparent 68%)
              `,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Quaternary Wave Ribbon: Diagonal Silk Stream Across All Sections */}
          <div 
            className="wave-layer-4 absolute -inset-[20%] opacity-70 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 80% 30% at 70% 40%, rgba(190, 18, 48, 0.16) 0%, rgba(190, 18, 48, 0.06) 35%, transparent 68%),
                radial-gradient(ellipse 50% 45% at 30% 60%, rgba(35, 50, 110, 0.18) 0%, rgba(35, 50, 110, 0.07) 35%, transparent 68%)
              `,
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        {/* Light Mode Fluid Waves */}
        <div className="absolute inset-0 opacity-100 dark:opacity-0 transition-opacity duration-500 overflow-hidden">
          <div 
            className="wave-layer-1 absolute -inset-[20%] opacity-70 transform-gpu"
            style={{
              background: `
                radial-gradient(ellipse 65% 35% at 25% 25%, rgba(242, 13, 50, 0.08) 0%, transparent 70%),
                radial-gradient(ellipse 70% 38% at 75% 65%, rgba(70, 90, 150, 0.07) 0%, transparent 70%)
              `,
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        {/* Layer 3: Delicate Architectural Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Layer 4: Delicate Grain Texture (Subtle & Tactile) */}
        <div 
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.045] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Layer 5: Restrained Edge Vignette */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-60 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(7, 9, 17, 0.5) 100%)"
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
              </Routes>
            </Suspense>
            {location.pathname !== '/enter' && <Footer />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Quick Call Action */}
      {!location.pathname.startsWith('/enter') && 
       !location.pathname.startsWith('/reading-tests') && 
       !location.pathname.startsWith('/listening-tests') && 
       !location.pathname.startsWith('/ielts-writing') && (
        <div className="fab-button-container fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-300">
          <a
            href="tel:+998910829979"
            className="relative w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-600/35 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/40 dark:border-slate-800 group"
            title="Qo'ng'iroq qilish"
            aria-label="Telefon orqali bog'lanish"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}