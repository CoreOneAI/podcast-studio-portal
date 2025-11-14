// vite.config.js (ESM)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'public',
  plugins: [react()],
  build: {
    // FINAL FIX: Explicitly set the entry file to ensure the build runs correctly.
    rollupOptions: {
      input: {
        main: './src/index.jsx', // This ensures Vite knows where to start the JS bundling
      },
    },
  },
});