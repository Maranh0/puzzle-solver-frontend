import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Adicione esta linha
    },
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
  base: '/',
})
