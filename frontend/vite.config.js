import { sync } from "glob";
import { defineConfig } from 'vite';

// const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: 'EducationOrder',
  root: './src',
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "./src/index.html",
        orders: "./src/orders.html",
      },
      rollupOptions: {
        input: sync("./src/**/*.html".replace(/\\/g, "/")),
      },
    },
  },
})