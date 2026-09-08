import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Ruta base: '/' por defecto. Para servir bajo un subdirectorio (p. ej. GitHub
// Pages en /eAIP-CHILE/), exporta BASE_PATH al construir.
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.svg'],
      manifest: {
        name: 'AIP Chile EFB',
        short_name: 'AIP Chile',
        description: 'Publicación de Información Aeronáutica de Chile — EFB (prototipo)',
        lang: 'es-CL',
        theme_color: '#0B0F17',
        background_color: '#0B0F17',
        display: 'standalone',
        orientation: 'any',
        categories: ['navigation', 'utilities', 'travel'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell + datos livianos se precachean.
        globPatterns: ['**/*.{js,css,html,svg,woff2}', 'data/**/*.json', 'charts/**/*.json'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: base + 'index.html',
        runtimeCaching: [
          {
            // Cartas: se cachean bajo demanda (offline tras la primera vista).
            urlPattern: ({ url }) => url.pathname.includes('/charts/') && /\.(?:jpg|jpeg|png|webp)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'aip-charts',
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
})
