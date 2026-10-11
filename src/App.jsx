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
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300 overflow-x-hidden font-sans">
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

      {/* Lightweight, GPU-friendly background for low-end mobile devices */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(200,32,50,0.12) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 dark:bg-rose-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-red-600/5 dark:bg-blue-900/5 rounded-full blur-[100px]" />
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="relative z-10">
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