import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LUSION — Sensory Digital Experiences / WebGL Fluid Lab',
  description:
    '1:1 fidelity recreation of Lusion.co — organic fluid body Icosahedron(2.4,128), true physical dispersion glass transmission 0.99 ior 1.54 thickness 3.2, 8000 curl-noise particle stream, viscous scroll. Principal Creative Technologist benchmark.',
  keywords: [
    'WebGL',
    'WebGPU',
    'GLSL',
    'Three.js',
    'R3F',
    'Lusion',
    'fluid simulation',
    'dispersion glass',
    'GSAP',
    'Lenis',
    'Awwwards',
  ],
  authors: [{ name: 'Principal Creative Technologist' }],
  openGraph: {
    title: 'LUSION — Sensory Digital Experiences',
    description: 'Organic fluid body with hydrodynamic surface tension, spectral dispersion, GPGPU curl-noise ribbons.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@300..500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050508] text-white antialiased overflow-x-hidden selection:bg-[#7a2bff]">{children}</body>
    </html>
  )
}
