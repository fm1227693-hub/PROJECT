import React, { useEffect } from 'react'
import Home from './home'
import Sec1 from './Sec1'
import Sec2 from './Sec2'
import Sec3 from './Sec3'
import Sec4 from './Sec4'
import Mentors from './Mentors'
import Sec5 from './Sec5'

export default function Main() {
  

  return (
    <div className="overflow-hidden">
      <Home />
      <Sec1 />
      <Sec3 />
      <Sec2 />
      <Sec4 />
      <Sec5/>
    </div>
  )
}