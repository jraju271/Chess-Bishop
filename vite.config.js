import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@react-pdf/renderer'],
    },
    outDir: 'dist'
  },
  publicDir: 'public',
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})

