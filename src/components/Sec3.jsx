import React, { useEffect } from 'react'
import StaticMentors from './staticMentors'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Sec3() {
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 100,
    })
  }, [])

  return (
    <div data-aos="fade-up" data-aos-duration="800">
      <StaticMentors />
    </div>
  )
}