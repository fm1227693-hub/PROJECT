import { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Main from './components/Main'
import Navbar from './components/Navbar'
import Stats from './components/Stats'
import Products from './components/Products'
import AboutUs from './components/AboutUs'
import Admin from './components/Admin'
import Register from './components/Register'
import Mentorstats from './components/Mentorstats'
import LevelTest from './components/LevelTest'
import ListeningHub from './components/ListeningHub'
import ReadingHub from './components/ReadingHub'
import Pricing from './components/Pricing'
import Gamess from './components/Gamess'
import FAQ from './components/FAQ'
import LeadForm from './components/LeadForm'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfUse from './components/TermsOfUse'
import IeltsWritingAssessor from './components/IeltsWritingAssessor'
import Principle from './components/Principle'
import ThemeTransitionLoader from './components/ThemeTransitionLoader'
import PremiumPreloader from './components/premium/PremiumPreloader'
import PageTransition from './components/premium/PageTransition'
import PremiumCursor from './components/premium/PremiumCursor'
import StudioBackdrop from './components/premium/StudioBackdrop'
import { prefersReducedMotion, emitReady } from './components/premium/studioEnv'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [isLoading, setIsLoading] = useState(
    () => sessionStorage.getItem('optimum_booted') !== '1',
  )
  const location = useLocation()

  /* The preloader only ever runs once per session — repeat visits skip it
     and release the entrance choreography immediately. */
  useEffect(() => {
    if (!isLoading) {
      window.__studioReady = true
      emitReady()
      return undefined
    }
    const timer = setTimeout(() => sessionStorage.setItem('optimum_booted', '1'), 1400)
    return () => clearTimeout(timer)
  }, [isLoading])

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 overflow-x-hidden">
      <StudioBackdrop />

      {isLoading && <PremiumPreloader onDone={() => setIsLoading(false)} />}

      <ThemeTransitionLoader />

      <PremiumCursor />

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      <div className="relative z-10">
        {location.pathname !== '/enter' && <Navbar />}
        <ScrollToTop />

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion() ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
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
            {location.pathname !== '/enter' && <Footer />}
          </motion.div>
        </AnimatePresence>
      </div>

      <PageTransition />

      {/* Floating quick action — call the studio */}
      {!location.pathname.startsWith('/enter') &&
        !location.pathname.startsWith('/reading-tests') &&
        !location.pathname.startsWith('/listening-tests') &&
        !location.pathname.startsWith('/ielts-writing') && (
          <div className="fab-button-container fixed bottom-6 right-6 z-50 flex items-center gap-3 transition-all duration-300">
            <a
              href="tel:+998910829979"
              className="st-fab"
              title="Qo'ng'iroq qilish"
              aria-label="Call the studio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 relative z-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </a>
          </div>
        )}
    </div>
  )
}
