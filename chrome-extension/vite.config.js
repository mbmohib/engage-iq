import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel/index.html'),
        popup: resolve(__dirname, 'popup/index.html'),
        'service-worker': resolve(__dirname, 'background/service-worker.js'),
        scraper: resolve(__dirname, 'content/scraper.js'),
        'dom-injector': resolve(__dirname, 'content/dom-injector.js')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes('service-worker')) {
            return 'background/[name].js';
          }
          if (chunkInfo.name === 'scraper' || chunkInfo.name === 'dom-injector') {
            return 'content/[name].js';
          }
          return '[name]/[name].js';
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'content/[name][extname]';
          }
          return '[name][extname]';
        }
      }
    }
  }
});
