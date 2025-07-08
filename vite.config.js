import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  build: {
    rollupOptions: {
      input: './index.html', // Força o Rollup a usar index.html como ponto de entrada
    },
  },
  base: '/', // Mantemos esta linha
})