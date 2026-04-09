// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compressor from 'astro-compressor';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

// https://astro.build/config
export default defineConfig({
  site: 'https://rest-countries.seanbuckle.com',
  base: '/',
  output: 'static',
  prefetch: true,
  integrations: [sitemap(), compressor({ brotli: true })],
  image: {
    domains: ['flagcdn.net', 'upload.wikimedia.org', 'flagcdn.com'],
  },
  vite: {
    optimizeDeps: {
      include: [
        'astro/toolbar',
        'astro/runtime/client/dev-toolbar/entrypoint.js'
      ]
    },
    css: {
      transformer: "lightningcss",
      lightningcss: {
        targets: browserslistToTargets(browserslist())
      }
    },
    build: {
      cssMinify: 'lightningcss'
    }
  },
  experimental: {
    rustCompiler: true,
    queuedRendering: {
      enabled: true
    }
  }
});