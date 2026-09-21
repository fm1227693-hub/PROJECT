import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Allow the sandboxed preview host (and any other host) to reach the dev server.
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Keep the animation runtime in its own long-cached chunk; three.js stays
        // in the lazily loaded chunk created by the dynamic import.
        manualChunks(id) {
          if (id.includes('node_modules/gsap/')) return 'gsap'
          if (id.includes('node_modules/three/')) return 'three'
          if (id.includes('node_modules/react')) return 'react'
        },
      },
    },
  },
})
