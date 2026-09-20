import { useState, useEffect, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import ThemeTransitionLoader from "./components/ThemeTransitionLoader";
import CustomCursor from "./components/CustomCursor";
import PremiumLoader from "./components/PremiumLoader";
import useReveal from "./hooks/useReveal";

/* Og'ir sahifalar — kod bo'linishi (code-splitting) orqali faqat kerakda yuklanadi */
const Stats = lazy(() => import("./components/Stats"));
const Products = lazy(() => import("./components/Products"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const Admin = lazy(() => import("./components/Admin"));
const Register = lazy(() => import("./components/Register"));
const Mentorstats = lazy(() => import("./components/Mentorstats"));
const LevelTest = lazy(() => import("./components/LevelTest"));
const ListeningHub = lazy(() => import("./components/ListeningHub"));
const ReadingHub = lazy(() => import("./components/ReadingHub"));
const Pricing = lazy(() => import("./components/Pricing"));
const Gamess = lazy(() => import("./components/Gamess"));
const FAQ = lazy(() => import("./components/FAQ"));
const LeadForm = lazy(() => import("./components/LeadForm"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("./components/TermsOfUse"));
const IeltsWritingAssessor = lazy(() => import("./components/IeltsWritingAssessor"));
const Principle = lazy(() => import("./components/Principle"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const INTRO_DURATION = 1500;

export default function App() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Birlashgan scroll-reveal tizimi (IntersectionObserver asosida)
  useReveal([location.pathname, isLoading]);

  useEffect(() => {
    // Hero kirish animatsiyalari loader tugagandan keyin boshlanishi uchun belgi
    document.documentElement.setAttribute("data-intro", "pending");
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.documentElement.removeAttribute("data-intro");
    }, INTRO_DURATION);

    return () => {
      clearTimeout(timer);
      document.documentElement.removeAttribute("data-intro");
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-ink transition-colors duration-500 overflow-x-hidden font-sans grain">
      {/* Nozik, yengil maxsus kursor — faqat desktop */}
      <CustomCursor />

      {/* Mavzu almashinuvi loading ekrani */}
      <ThemeTransitionLoader />

      {/* Premium kirish ekrani */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="intro-loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <PremiumLoader
              loop={false}
              text={t("premiumLoader.text", "KIRISH")}
              captions={[
                t("premiumLoader.cap1", "Ma'lumotlar tekshirilmoqda"),
                t("premiumLoader.cap2", "Kirish tasdiqlanmoqda"),
                t("premiumLoader.cap3", "Deyarli tayyor"),
                t("premiumLoader.cap4", "Xush kelibsiz"),
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="relative z-10">
        {location.pathname !== '/enter' && <Navbar />}
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<div className="min-h-[60vh]" />}>
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

      {/* Pastki suzuvchi tezkor qo'ng'iroq tugmasi */}
      {!location.pathname.startsWith('/enter') &&
       !location.pathname.startsWith('/reading-tests') &&
       !location.pathname.startsWith('/listening-tests') &&
       !location.pathname.startsWith('/ielts-writing') && (
        <div className="fab-button-container fixed bottom-5 right-5 z-50 flex items-center gap-3">
          <a
            href="tel:+998910829979"
            className="group relative w-12 h-12 bg-accent hover:bg-[var(--accent-hover)] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_-8px_var(--accent-ring)] transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer"
            title="Qo'ng'iroq qilish"
            aria-label="Qo'ng'iroq qilish"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
