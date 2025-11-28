// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // BASE DINÁMICA: en local usa "/", en producción usa /docagilsw/
  base: process.env.NODE_ENV === 'production' ? '/docagilsw/' : '/',
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})