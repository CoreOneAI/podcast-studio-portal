import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Explicitly set root to current directory
  // This is now where index.html is located
  root: '.', 

  build: {
    outDir: 'dist', // Keep this explicitly set
    rollupOptions: {
      // Explicitly tell Rollup (Vite's bundler) that index.html in the root is the entry point.
      // This should resolve the "Could not resolve entry module 'index.html'" error.
      input: 'index.html', 
    },
  },

  // If you still have static assets in the 'public' folder (like vite.svg),
  // Vite will treat the root as the base, so paths like '/vite.svg' will still work
  // if public is a subdirectory.
});
