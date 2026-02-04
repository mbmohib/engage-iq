import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function copyManifestAndIcons() {
  return {
    name: 'copy-manifest-and-icons',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');
      const iconsDir = resolve(distDir, 'icons');
      
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }
      
      copyFileSync(
        resolve(__dirname, 'chrome-extension/manifest.json'),
        resolve(distDir, 'manifest.json')
      );
    }
  };
}

export default defineConfig({
  plugins: [react(), copyManifestAndIcons()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'background/service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'background/llm-service': resolve(__dirname, 'src/background/llm-service.ts'),
        'content/scraper': resolve(__dirname, 'src/content/scraper.ts'),
        'content/dom-injector': resolve(__dirname, 'src/content/dom-injector.ts'),
        'sidepanel/index': resolve(__dirname, 'src/sidepanel/index.html'),
        'popup/index': resolve(__dirname, 'src/popup/index.html'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.html')) {
            return assetInfo.name.replace('src/', '');
          }
          return 'assets/[name].[ext]';
        }
      }
    }
  }
});
