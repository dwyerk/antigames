import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Use relative base path for GitHub Pages compatibility
  build: {
    outDir: 'dist',
  },
});
