import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import Products from "./components/Products";
import AboutUs from "./components/AboutUs";
import Admin from "./components/Admin";
import Register from "./components/Register";
import Mentorstats from "./components/Mentorstats";
import IeltsPracticeApp from "./components/IeltsPractiseApp";
import LevelTest from "./components/LevelTest";
import Pricing from "./components/Pricing";
import Gamess from "./components/Gamess";
import FAQ from "./components/FAQ";
import ConsultationBooking from "./components/ConsultationBooking";
import Flashcards from "./components/Flashcard";
import LeadForm from "./components/LeadForm";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import SpeakingAssessor from "./components/SpeakingAssessor";

import BackgroundCanvas from "./components/BackgroundCanvas";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 5 soniya (5000ms) qilib belgilandi
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-500 overflow-hidden font-sans">

      {/* Keyframe animatsiyalar */}
      <style>{`
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Premium Loading Ekrani */}
      {isLoading && (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white dark:bg-[#030712] overflow-hidden">

          {/* Qizil tusdagi fon glow effektlari */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-red-500/20 via-rose-500/10 to-transparent rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-orange-500/15 via-red-500/10 to-transparent rounded-full blur-[100px] animate-pulse [animation-delay:0.5s]" />
          </div>

          <div className="relative flex flex-col items-center gap-6 p-8">

            {/* Orbital spinner (Qizil rangda) */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-red-500/20" />
              <div
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-red-600 animate-spin"
                style={{ animationDuration: "1.2s" }}
              />
              <div
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-rose-400 animate-spin"
                style={{ animationDuration: "1.8s", animationDirection: "reverse" }}
              />
              <div className="absolute w-3 h-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-ping" />
              <div className="w-3 h-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
            </div>

            {/* Nom (Muxamedov Feruz) */}
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-red-600 dark:text-red-500">
                OPTIMUM
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase">
                School of English
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full w-1/3 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 rounded-full"
                style={{ animation: "loading-bar 1.2s ease-in-out infinite" }}
              />
            </div>

            {/* Yuklanmoqda matni */}
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase flex items-center gap-1">
              Yuklanmoqda
              <span className="flex gap-0.5">
                <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-red-500 rounded-full animate-bounce" />
              </span>
            </p>
          </div>

        </div>
      )}

      {/* Interactive Particle Mesh & Light Node Canvas */}
      <BackgroundCanvas />

      {/* Master Luxury Ambient Background Layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Base Gradient Canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100/90 to-white dark:from-[#030712] dark:via-[#060a14] dark:to-[#090d1a] transition-colors duration-500" />

        {/* Glow Radial Grid Matrix */}
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(225,29,72,0.35) 1.2px, transparent 1.2px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Dynamic Rotating Aurora Beams */}
        <div className="absolute top-[-20%] left-[-15%] w-[800px] h-[800px] bg-gradient-to-br from-red-600/30 via-rose-500/20 to-transparent rounded-full blur-[170px] animate-aurora-1" />
        <div className="absolute top-[20%] right-[-20%] w-[750px] h-[750px] bg-gradient-to-bl from-rose-600/25 via-amber-500/15 to-transparent rounded-full blur-[180px] animate-aurora-2" />
        <div className="absolute bottom-[-20%] left-[10%] w-[850px] h-[850px] bg-gradient-to-tr from-red-600/25 via-rose-500/15 to-transparent rounded-full blur-[180px] animate-aurora-1 [animation-delay:5s]" />

        {/* Floating Glowing Neon Rings */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] border border-red-500/15 rounded-full blur-sm animate-float-orb" />
        <div className="absolute top-2/3 left-1/3 w-[500px] h-[250px] border border-rose-500/15 rounded-full blur-sm animate-float-orb [animation-delay:3s]" />

        {/* Smooth Edge Fade Overlays */}
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-slate-100/90 dark:from-[#020509] to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/80 dark:from-[#030712]/90 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <ScrollToTop />
        <Routes>
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
          <Route path="/ielts-practice" element={<IeltsPracticeApp />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/form" element={<LeadForm />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/speaking-assessor" element={<SpeakingAssessor />} />
        </Routes>
        {/* <ConsultationBooking/>
        <Flashcards/> */}
        <Footer />
      </div>

      {/* Bottom Floating Quick Action Badges */}

      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <a
          href="tel:+998910829979"
          className="relative w-14 h-14 bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/30 dark:border-slate-800 group"
          title="Qo'ng'iroq qilish">
          
          <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-75" />

          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}