import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import Products from "./components/Products";
import AboutUs from "./components/AboutUs";
import Admin from "./components/Admin";
import Register from "./components/Register";

export default function App() {
  return (
    <div className="dark:bg-[#090623]">
      <Navbar />
      <Register/>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path='/stats' element={<Stats />} />
        <Route path='/products' element={<Products />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/enter' element={<Admin />} />
      </Routes>
      
      <Footer />
    </div>
  )
}