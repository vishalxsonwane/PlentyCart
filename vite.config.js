import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views'),
      '@router': path.resolve(__dirname, './src/router'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store')
    }
  },
  server: {
    host: true,
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