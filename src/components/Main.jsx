import Home from './home'
import MobileShowcase from './MobileShowcase'
import LevelsScroll from './LevelsScroll'
import Sec3 from './Sec3'
import Sec2 from './Sec2'
import Sec4 from './Sec4'
import Sec5 from './Sec5'

export default function Main() {
  return (
    <div className="">
      <Home />
      {/* 🎓 Kurslar darajalari: pinned horizontal scroll effekti 🎓 */}
      <LevelsScroll />
      <Sec2 />
      <MobileShowcase />
      <Sec3 />
      <Sec4 />
      <Sec5 />
    </div>
  )
}
