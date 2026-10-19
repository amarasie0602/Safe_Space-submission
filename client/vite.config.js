import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-react', test: /node_modules\/(react|react-dom|react-router-dom|scheduler)\// },
            { name: 'vendor-motion', test: /node_modules\/framer-motion\// },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true,
  },
})
