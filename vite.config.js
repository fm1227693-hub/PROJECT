import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Allow the Arena preview proxy host (*.e2b.app) to reach the dev server.
    allowedHosts: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
})
