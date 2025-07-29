import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  preview: {
    host: '0.0.0.0',                            
    port: Number(process.env.PORT) || 4173,     
    allowedHosts: ['object-identification-3.onrender.com']
  }
});
