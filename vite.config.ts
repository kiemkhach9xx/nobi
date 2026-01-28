import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for the application
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ccs.whiteneuron.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Set headers to match the CURL request
            proxyReq.setHeader('Accept', 'application/json, text/plain, */*');
            proxyReq.setHeader('Referer', 'https://icd.kcb.vn/');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36');
            proxyReq.setHeader('sec-ch-ua', '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"');
            proxyReq.setHeader('sec-ch-ua-mobile', '?0');
            proxyReq.setHeader('sec-ch-ua-platform', '"Windows"');
            
            // Add X-Client-IP header for chapter data requests
            if (req.url?.includes('/ICD10/data/chapter')) {
              proxyReq.setHeader('X-Client-IP', '42.114.35.89');
            }
          });
        },
      },
    },
  },
});
