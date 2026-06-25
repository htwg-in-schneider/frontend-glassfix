import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// ADAPTADO: El nombre exacto de tu repositorio de frontend en GitHub
const repoName = '/frontend-glassfix/';

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? repoName : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
