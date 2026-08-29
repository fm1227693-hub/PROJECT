import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { inView, animate, AnimatePresence, motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import Products from "./components/Products";
import AboutUs from "./components/AboutUs";
import Admin from "./components/Admin";
import Register from "./components/Register";
import Mentorstats from "./components/Mentorstats";
import LevelTest from "./components/LevelTest";
import ListeningHub from "./components/ListeningHub";
import ReadingHub from "./components/ReadingHub";
import Pricing from "./components/Pricing";
import Gamess from "./components/Gamess";
import FAQ from "./components/FAQ";
import ConsultationBooking from "./components/ConsultationBooking";
import Flashcards from "./components/Flashcard";
import LeadForm from "./components/LeadForm";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import IeltsWritingAssessor from "./components/IeltsWritingAssessor";
import BackgroundCanvas from "./components/BackgroundCanvas";
import ThemeTransitionLoader from "./components/ThemeTransitionLoader";
import Principle from "./components/Principle";
import CustomCursor from "./components/CustomCursor";
import PremiumLoader from "./components/PremiumLoader";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    // 3.5 soniya (3500ms) qilib belgilandi, faqat saytga kirganda chiqishi uchun
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Ultra-Smooth Premium Scroll Reveal Observer
  useEffect(() => {
    if (isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delayAttr = el.getAttribute('data-aos-delay');
            if (delayAttr) {
              const delayMs = parseInt(delayAttr, 10);
              el.style.transitionDelay = `${delayMs}ms`;
            }
            el.classList.add('aos-animate');
            observer.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    );

    const observeAll = () => {
      const elements = document.querySelectorAll('[data-aos]');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Ekranda ko'rinib turgan qismini darhol ko'rsatamiz
        if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) - 50) {
          const delayAttr = el.getAttribute('data-aos-delay');
          if (delayAttr) {
            const delayMs = parseInt(delayAttr, 10);
            el.style.transitionDelay = `${delayMs}ms`;
          }
          el.classList.add('aos-animate');
        } else {
          if (!el.classList.contains('aos-animate')) {
            observer.observe(el);
          }
        }
      });
    };

    // Sahifa render bo'lishi va AnimatePresence (0.4s) kutish vaqtlarini hisobga olib bir necha marta chaqiramiz
    const timer1 = setTimeout(observeAll, 50);
    const timer2 = setTimeout(observeAll, 450); // mode="wait" dan keyin yangi sahifa tushganda
    const timer3 = setTimeout(observeAll, 800); // Xavfsizlik uchun

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      observer.disconnect();
    };
  }, [isLoading, location.pathname]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-500 overflow-x-hidden font-sans">
      <CustomCursor />
      
      {/* Synthetic Theme Transition Loading Screen */}
      <ThemeTransitionLoader />

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
        body.mobile-menu-open .fab-button-container {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: scale(0.8);
        }
      `}</style>

      {/* Premium Loading Ekrani */}
      {isLoading && (
        <PremiumLoader 
          loop={false} 
          text={t("premiumLoader.text", "KIRISH")}
          captions={[
            t("premiumLoader.cap1", "Ma'lumotlar tekshirilmoqda"),
            t("premiumLoader.cap2", "Kirish tasdiqlanmoqda"),
            t("premiumLoader.cap3", "Deyarli tayyor"),
            t("premiumLoader.cap4", "Xush kelibsiz")
          ]}
        />
      )}

      {/* Interactive Particle Mesh & Light Node Canvas */}
      <BackgroundCanvas />

      {/* Master Luxury Ambient Background Layers */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Base Gradient Canvas (Disabled in favor of 3D Canvas) */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100/90 to-white dark:from-[#030712] dark:via-[#060a14] dark:to-[#090d1a] transition-colors duration-500" /> */}

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
        <div className="absolute top-[-20%] left-[-15%] w-[800px] h-[800px] bg-gradient-to-br from-red-600/40 via-rose-500/30 dark:from-red-600/30 dark:via-rose-500/20 to-transparent rounded-full blur-[170px] animate-aurora-1 transition-colors duration-500" />
        <div className="absolute top-[20%] right-[-20%] w-[750px] h-[750px] bg-gradient-to-bl from-rose-600/40 via-amber-500/30 dark:from-rose-600/25 dark:via-amber-500/15 to-transparent rounded-full blur-[180px] animate-aurora-2 transition-colors duration-500" />
        <div className="absolute bottom-[-20%] left-[10%] w-[850px] h-[850px] bg-gradient-to-tr from-red-600/40 via-rose-500/30 dark:from-red-600/25 dark:via-rose-500/15 to-transparent rounded-full blur-[180px] animate-aurora-1 [animation-delay:5s] transition-colors duration-500" />

        {/* Floating Glowing Neon Rings */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] border border-red-700/30 dark:border-red-500/15 rounded-full blur-sm animate-float-orb transition-colors duration-500" />
        <div className="absolute top-2/3 left-1/3 w-[500px] h-[250px] border border-rose-700/30 dark:border-rose-500/15 rounded-full blur-sm animate-float-orb [animation-delay:3s] transition-colors duration-500" />

        {/* Smooth Edge Fade Overlays */}
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-slate-100/90 dark:from-[#020509] to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/80 dark:from-[#030712]/90 to-transparent pointer-events-none" />
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="relative z-10">
        {location.pathname !== '/enter' && <Navbar />}
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
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
            {/* <ConsultationBooking/>
            <Flashcards/> */}
            {location.pathname !== '/enter' && <Footer />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Floating Quick Action Badges */}

      {/* Bottom Floating Quick Action Badges */}
      {!location.pathname.startsWith('/enter') && 
       !location.pathname.startsWith('/reading-tests') && 
       !location.pathname.startsWith('/listening-tests') && 
       !location.pathname.startsWith('/ielts-writing') && (
        <div className="fab-button-container fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-300">
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
      )}
    </div>
  );
}