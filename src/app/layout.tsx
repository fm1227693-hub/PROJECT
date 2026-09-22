import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LUSION — Bold Ideas, Brought to Life',
  description:
    'Exact Lusion.co homepage — light #f6f6f8, cinematic preloader 000→100 L glyph, elastic showreel ribbon Plane(16,7,80,40) pos.z += sin(pos.x*0.4+uTime*2.0)*uScrollVelocity*0.35, blue organic spline #2563eb glossy royal-blue tube, PLAY REEL magnetic pill, portfolio grid.',
  keywords: ['Lusion', 'elastic ribbon', 'showreel', 'preloader', 'blue spline', 'WebGL', 'R3F', 'GSAP', 'Lenis'],
  authors: [{ name: 'Principal Creative Technologist' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@300..500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f6f6f8] text-[#0b0b0d] antialiased overflow-x-hidden selection:bg-[#0b0b0d] selection:text-white">
        {children}
      </body>
    </html>
  )
}
