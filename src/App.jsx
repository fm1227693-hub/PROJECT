import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import Products from "./components/Products";
import AboutUs from "./components/AboutUs";
import Admin from "./components/Admin";
import Register from "./components/Register";
import Mentorstats from "./components/Mentorstats";

export default function App() {
  return (
    <div className="dark:bg-[#090623] bg-white min-h-screen relative transition-colors duration-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/enter" element={<Admin />} />
        <Route path="/static" element={<Mentorstats />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />

      {/* Sayt dizayniga moslashtirilgan, animatsiyali va telefon qilish funksiyali tugma */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="tel:+998901234567"
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