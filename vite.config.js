import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
    sourcemap: false, // Manter desativado
    // Adicionar estas linhas para garantir compatibilidade com CSP
    cssCodeSplit: true, // Garante que o CSS seja injetado como arquivos separados
    assetsInlineLimit: 0, // Evita que assets pequenos sejam inlined (o que pode gerar eval)
  },
  base: '/',
})
