import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Main from './components/Main';
import Stats from './components/Stats';
import Products from './components/Products';
import AboutUs from './components/AboutUs';
import Admin from './components/Admin';
import Register from './components/Register';
import Mentorstats from './components/Mentorstats';
import LevelTest from './components/LevelTest';
import ListeningHub from './components/ListeningHub';
import ReadingHub from './components/ReadingHub';
import Pricing from './components/Pricing';
import Gamess from './components/Gamess';
import FAQ from './components/FAQ';
import LeadForm from './components/LeadForm';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfUse from './components/TermsOfUse';
import IeltsWritingAssessor from './components/IeltsWritingAssessor';
import Principle from './components/Principle';
import { FaPhoneAlt } from 'react-icons/fa';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isExcludedView = location.pathname.startsWith('/enter');

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080a11] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-x-hidden selection:bg-rose-600 selection:text-white">
      
      {/* Ambient background noise & subtle grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid-pattern opacity-40 dark:opacity-20" />

      {/* Floating Ambient Atmosphere Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-[-10%] w-[650px] h-[650px] bg-rose-600/10 dark:bg-rose-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] right-[-15%] w-[600px] h-[600px] bg-amber-500/10 dark:bg-rose-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[700px] h-[700px] bg-rose-600/10 dark:bg-rose-600/10 rounded-full blur-[160px]" />
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="relative z-10 flex flex-col min-h-screen">
        {!isExcludedView && <Navbar />}
        <ScrollToTop />

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Main />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/products" element={<Products />} />
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
            </motion.div>
          </AnimatePresence>
        </div>

        {!isExcludedView && <Footer />}
      </div>

      {/* Floating Action Quick Contact Button */}
      {!isExcludedView && 
       !location.pathname.startsWith('/reading-tests') && 
       !location.pathname.startsWith('/listening-tests') && 
       !location.pathname.startsWith('/ielts-writing') && (
        <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <a
            href="tel:+998900829979"
            aria-label="Call OptimumELC: +998 90 082 99 79"
            className="group relative w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-600/35 transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white/40 dark:border-white/20"
            title="Qo'ng'iroq qilish (+998 90 082 99 79)"
          >
            <span className="absolute inset-0 rounded-full border border-rose-400 animate-ping opacity-60 pointer-events-none" />
            <FaPhoneAlt className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
          </a>
        </aside>
      )}

    </div>
  );
}
