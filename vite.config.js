import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'vendor-react'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n'
            }
            if (id.includes('react-icons') || id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            if (id.includes('three') || id.includes('canvas')) {
              return 'vendor-three'
            }
            if (id.includes('react-big-calendar') || id.includes('moment')) {
              return 'vendor-calendar'
            }
          }
        },
      },
    },
  },
})


