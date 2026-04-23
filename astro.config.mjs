// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import AstroPWA from '@vite-pwa/astro';
import fs from 'node:fs';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

const hasLocalHttpsCerts = fs.existsSync('./localhost-key.pem') && fs.existsSync('./localhost.pem');

const localHttpsConfig = hasLocalHttpsCerts
  ? {
    key: fs.readFileSync('./localhost-key.pem'),
    cert: fs.readFileSync('./localhost.pem'),
  }
  : undefined;

// https://astro.build/config
export default defineConfig({
  site: 'https://rest-countries.seanbuckle.com',
  base: '/',
  output: 'static',
  prefetch: false,
  integrations: [
    sitemap(),
    compressor({ brotli: true }),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Countries',
        short_name: 'Countries',
        description: 'A simple app to display information about countries',
        theme_color: 'oklch(0.31 0.024 258.01)',
        background_color: 'oklch(0.2 0.024 258.01)',
        display: 'standalone',
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
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Keep external image caches bounded to avoid storage quota issues.
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/flagcdn\.com\/.*\.svg$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'svg-images-cache',
              expiration: {
                maxEntries: 250,
                maxAgeSeconds: 60 * 60 * 24 * 14, // 14 Days
                purgeOnQuotaError: true,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Nunito Sans',
      cssVariable: '--font-family',
      fallbacks: ['sans-serif'],
      weights: ['300', '400', '600', '800'],
      styles: ['normal'],
      formats: ['woff2'],
      display: 'swap',
    },
    {
      provider: fontProviders.googleicons(),
      name: 'Material Icons',
      cssVariable: '--font-family-icons',
      display: 'swap',
    }
  ],
  image: {
    domains: ['flagcdn.com'],
  },
  server: {
    port: 4321,
    host: 'localhost',
  },
  vite: {
    server: {
      https: localHttpsConfig,
      hmr: {
        protocol: hasLocalHttpsCerts ? 'wss' : 'ws',
        host: 'localhost',
        clientPort: 4321,
        timeout: 0,
      },
      fs: {
        allow: ['..'],
      },
    },
    css: {
      transformer: 'lightningcss',
      lightningcss: {
        targets: browserslistToTargets(browserslist()),
      },
    },
    build: {
      cssMinify: 'lightningcss',
    },
  },
  experimental: {
    //rustCompiler: true,
    //queuedRendering: { enabled: true },
    //clientPrerender: true,
    //chromeDevtoolsWorkspace: true,
  },
});