import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Navbar from "./components/Navbar";
import Stats from "./components/Stats";
import Products from "./components/Products";
import AboutUs from "./components/AboutUs";
import Admin from "./components/Admin";
import Register from "./components/Register";
import Mentors from "./components/Mentors";
import { useState } from "react";

export default function App() {
  const [modal, setModal] = useState(false)
  return (
    <div className="dark:bg-[#090623]">
      <Navbar />
      {/* <Mentors/> */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path='/stats' element={<Stats />} />
        <Route path='/products' element={<Products />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/enter' element={<Admin />} />
        <Route path='/register' element={<Register />} />
      </Routes>

      <Footer />

      <button
        onClick={() => setModal(!modal)} className="text-7xl">alo</button>
      {
        modal && (
          <div className="fixed top-50 left-50 text-9xl">Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem omnis necessitatibus architecto deserunt. Magnam voluptate adipisci animi, alias optio pariatur esse perferendis obcaecati est itaque commodi omnis tenetur expedita consequuntur.</div>
        )
      }
    </div>
  )
}


