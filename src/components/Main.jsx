import React from 'react'
import Home from './home'
import BrandTicker from './visual/BrandTicker'
import MobileShowcase from './MobileShowcase'
import IeltsEcosystem from './visual/IeltsEcosystem'
import Sec3 from './Sec3'
import Sec2 from './Sec2'
import Sec4 from './Sec4'
import Sec5 from './Sec5'
import FinalCta from './visual/FinalCta'

export default function Main() {
  return (
    <div className="relative w-full">
      {/* 1. Cinematic Hero Viewport with 3D Centerpiece */}
      <Home />

      {/* 2. Diagonal Editorial Brand Ticker */}
      <BrandTicker />

      {/* 3. Mobile Platform & Ecosystem Showcase */}
      <MobileShowcase />

      {/* 5. IELTS CDI & AI Digital Tools Suite */}
      <IeltsEcosystem />

      {/* 6. Lead Specialist / Mentor Feature */}
      <Sec3 />

      {/* 7. Three-Step Learning Methodology */}
      <Sec2 />

      {/* 8. Mission, Vision & Quality Values */}
      <Sec4 />

      {/* 9. Authentic Student Scores & Certificate Gallery with Lightbox */}
      <Sec5 />

      {/* 10. Striking Final Conversion Section */}
      <FinalCta />
    </div>
  )
}