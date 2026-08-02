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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 overflow-hidden font-sans">

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

          {/* Fon glow effektlari */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-transparent rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-fuchsia-500/10 to-transparent rounded-full blur-[100px] animate-pulse [animation-delay:0.5s]" />
          </div>

          <div className="relative flex flex-col items-center gap-6 p-8">

            {/* Orbital spinner */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
              <div
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-600 animate-spin"
                style={{ animationDuration: "1.2s" }}
              />
              <div
                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-indigo-400 animate-spin"
                style={{ animationDuration: "1.8s", animationDirection: "reverse" }}
              />
              <div className="absolute w-3 h-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)] animate-ping" />
              <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)]" />
            </div>

            {/* Nom */}
            <div className="flex flex-col items-center gap-2">
              <h1
                className="text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-r from-slate-900 via-purple-700 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent bg-[length:200%_auto]"
                style={{ animation: "shimmer 2.5s linear infinite" }}
              >
                OPTIMUM
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase">
                School of English
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-48 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
              <div
                className="h-full w-1/3 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 rounded-full"
                style={{ animation: "loading-bar 1.2s ease-in-out infinite" }}
              />
            </div>

            {/* Yuklanmoqda matni */}
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-widest uppercase flex items-center gap-1">
              Yuklanmoqda
              <span className="flex gap-0.5">
                <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" />
              </span>
            </p>
          </div>

          {/* Kichkina imzo */}
          <p className="absolute bottom-4 left-5 text-[5px] sm:text-[0.1px] text-slate-300 dark:text-slate-700 tracking-widest select-none">
            Feruz
          </p>
        </div>
      )}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#030712] dark:via-[#050912] dark:to-[#0a0f1c]" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(100,116,139,0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-transparent rounded-full blur-[160px]" />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/20 via-cyan-400/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-gradient-to-l from-fuchsia-500/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-gradient-to-t from-amber-400/10 via-orange-400/5 to-transparent rounded-full blur-[150px]" />
        <div className="absolute bottom-0 inset-x-0 h-72 bg-gradient-to-t from-slate-100 dark:from-[#020509] to-transparent" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/60 dark:from-[#030712]/80 to-transparent" />
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
          <Route path="/static" element={<Mentorstats />} />
          <Route path="/register" element={<Register />} />
          <Route path="/level-test" element={<LevelTest />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gamess" element={<Gamess />} />
          <Route path="/ieltspractiseapp" element={<IeltsPracticeApp />} />
          <Route path="/faqat" element={<FAQ />} />
        </Routes>
        <Footer />
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="tel:+998910829979"
          className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 animate-bounce cursor-pointer border-2 border-white/20 dark:border-slate-800"
          title="Qo'ng'iroq qilish">

          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}