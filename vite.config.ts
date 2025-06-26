import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/predict': {
        target: 'https://realestatemodel-production.up.railway.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/predict/, '/predict'),
      },
      '/api/forecast': {
        target: 'https://web-production-c3a7d.up.railway.app',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/forecast/, '/forecast'),
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
