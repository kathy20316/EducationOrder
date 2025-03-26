import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

// https://vite.dev/config/
export default defineConfig({
  base: '/EducationOrder/',
  plugins: [react()],
  build:{
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input:{
        main: resolve(root, 'index.html'),
        profile: resolve(root, 'profile', 'index.html'),
      }
    }
  }
})
