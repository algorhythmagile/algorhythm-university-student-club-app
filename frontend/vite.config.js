import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // istersen 5173 de kalabilir; önemli olan proxy
    proxy: {
      // /system-message isteklerini 3000'e ilet
      '/system-message': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // backend'te /system-message var; rewrite GEREK YOK
      },
    },
  },
})
