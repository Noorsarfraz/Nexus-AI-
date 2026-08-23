import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom', // Ye line ensure karegi ke browser environment mock ho
    setupFiles: './src/test/setup.js', // Setup file ka path yahan configure karein
  },
});