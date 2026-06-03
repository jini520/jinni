import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, '../../packages/ui/src/styles')],
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://jejinni.site',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
