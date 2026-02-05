import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { VitePWA } from 'vite-plugin-pwa';

import path from 'path';

import sharp from 'sharp';
import fs from 'fs';

const brand = process.env.APP_BRAND || 'gramador';
const brandPath = path.resolve(__dirname, `./brands/${brand}`);

function getBrandName(brandKey: string): { name: string; short: string } {
  switch (brandKey) {
    case 'yama':
      return { name: 'Bacania Yama', short: 'Yama' };
    case 'gramador':
    default:
      return { name: 'Gramador Loyalty', short: 'Gramador' };
  }
}

const brandInfo = getBrandName(brand);

function pwaAssetsGenerator() {
  return {
    name: 'generate-pwa-assets',
    async buildStart() {
      const logoPath = path.join(brandPath, 'logo.png');
      const publicDir = path.resolve(__dirname, 'public');

      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
      }

      console.log(`\n🎨 Generating PWA assets for brand: ${brandInfo.name}`);

      if (fs.existsSync(logoPath)) {
        const image = sharp(logoPath);
        
        // Generate icons
        await image.resize(192, 192).toFile(path.join(publicDir, 'pwa-192x192.png'));
        await image.resize(512, 512).toFile(path.join(publicDir, 'pwa-512x512.png'));
        await image.resize(64, 64).toFile(path.join(publicDir, 'favicon.png'));
        
        console.log('✅ PWA assets generated successfully!\n');
      } else {
        console.warn(`⚠️ Brand logo not found at ${logoPath}. Skipping PWA asset generation.`);
      }
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@brand': brandPath,
    },
  },
  plugins: [
    pwaAssetsGenerator(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: brandInfo.name,
        short_name: brandInfo.short,
        description: `Programul de loialitate ${brandInfo.name}`,
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    federation({
      name: 'gramm_loyalty',
      filename: 'remoteEntry.js',
      // Modules to expose as a remote
      exposes: {
        './RegisterForm': './src/components/RegisterForm.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    outDir: `dist/${brand}`,
    emptyOutDir: true,
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
