import React from 'react'
import Home from './home'
import MobileShowcase from './MobileShowcase'
import Sec3 from './Sec3'
import Sec2 from './Sec2'
import Sec4 from './Sec4'
import Sec5 from './Sec5'

export default function Main() {
  return (
    <div className="overflow-hidden">
      <Home />
      <MobileShowcase />
      <Sec3 />
      <Sec2 />
      <Sec4 />
      <Sec5/>
    </div>
  )
}