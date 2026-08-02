import { useEffect } from "react";
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
  return (
    <div className="relative min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 overflow-hidden font-sans">

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
          title="Qo'ng'iroq qilish"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>
    </div>
  );
}