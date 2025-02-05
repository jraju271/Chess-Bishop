import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    // rollupOptions: {
    //   external: ['@react-pdf/renderer'],
    // },
    outDir: 'dist',
    assetsDir: 'assets'
  },
  publicDir: 'public',
});

