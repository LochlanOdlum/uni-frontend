import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      onwarn: (warning, warn) => {
        return; // Ignore warnings
      }
    }
  },
  logLevel: 'error', // Only show errors, not warnings
})
