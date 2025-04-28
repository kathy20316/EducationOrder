import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/EducationOrder/', // Your existing base path
  plugins: [react()],
  test: { // <--- Add this test configuration object
    globals: true, // Use Vitest global APIs (describe, test, expect, etc.) like Jest
    environment: 'jsdom', // Simulate the DOM environment
    setupFiles: './src/setupTests.js', // Optional: File for global test setup (see step 3)
    
  },
})