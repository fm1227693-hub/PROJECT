import localFont from "next/font/local";

import "./globals.css";
import { AppProvider } from "@/lib/store/AppProvider";
import Toaster from "@/components/ui/Toast";
import AppearanceSync from "@/components/layout/AppearanceSync";
import ScrollManager from "@/components/layout/ScrollManager";
import { BRAND } from "@/lib/data/brand";

const fraunces = localFont({
  src: [
    { path: "../assets/fonts/fraunces-latin-wght-normal.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
  fallback: ["ui-serif", "Iowan Old Style", "Palatino Linotype", "Palatino", "Georgia", "serif"],
});

const instrument = localFont({
  src: [
    { path: "../assets/fonts/instrument-sans-latin-wght-normal.woff2", weight: "400 700", style: "normal" },
    { path: "../assets/fonts/instrument-sans-latin-wght-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

const jetbrains = localFont({
  src: [{ path: "../assets/fonts/jetbrains-mono-latin-wght-normal.woff2", weight: "100 800", style: "normal" }],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const metadata = {
  metadataBase: new URL("https://prisma.education"),
  title: {
    default: `${BRAND.name} — ${BRAND.product}`,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.summary,
  applicationName: BRAND.name,
  keywords: [
    "diagnostic assessment",
    "mathematics diagnostic",
    "english diagnostic",
    "personalized learning path",
    "student progress tracking",
    "teacher analytics",
    "edtech",
  ],
  authors: [{ name: BRAND.legalName }],
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.summary,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.summary,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fbfaf7",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${jetbrains.variable}`}
      data-appearance="default"
      data-density="comfortable"
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        <AppProvider>
          <AppearanceSync />
          <ScrollManager />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:font-medium focus:text-canvas"
          >
            Skip to content
          </a>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
