// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// The project root is set to 'public' to find index.html,
// and we enable the react plugin to transform JSX.
export default defineConfig({
  root: 'public',
  plugins: [react()],
});