import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LUSION — Bold Ideas, Brought to Life / Elastic Showreel Ribbon',
  description:
    'Exact real-world Lusion.co homepage — light theme #f9f9fb, interactive elastic showreel ribbon PlaneGeometry(16,6,64,32), PLAY REEL magnetic pill, crosshair markers, editorial portfolio. Awwwards SOTY benchmark.',
  keywords: ['Lusion', 'elastic ribbon', 'showreel', 'WebGL', 'R3F', 'GSAP', 'Lenis', 'Awwwards'],
  authors: [{ name: 'Principal Creative Technologist' }],
  openGraph: {
    title: 'LUSION — Bold Ideas, Brought to Life',
    description: 'Light theme, elastic showreel ribbon, editorial portfolio.',
    type: 'website',
  },
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
      <body className="bg-[#f9f9fb] text-[#0b0b0d] antialiased overflow-x-hidden selection:bg-[#0b0b0d] selection:text-white">
        {children}
      </body>
    </html>
  )
}
