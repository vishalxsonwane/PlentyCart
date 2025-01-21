// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3030,
    proxy: {
      '/api': {
        target: 'http://localhost:4040',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})