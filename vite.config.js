import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@react-pdf/renderer', '@emailjs/browser'],
    },
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript',
    },
  },
  optimizeDeps: {
    exclude: ['@react-pdf/renderer']
  }
})