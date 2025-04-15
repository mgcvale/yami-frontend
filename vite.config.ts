import { VitePWA } from 'vite-plugin-pwa';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default {
  plugins: [
    sveltekit(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: {
        name: 'Yami',
        short_name: 'Yami',
        start_url: '/',
        display: 'standalone',
        background_color: '#f4dfc6',
        theme_color: '#151311',
        icons: [
          {
            src: '/icon/icon-192.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpeg,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
                cacheName: 'pages',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
            },
          },
        ],
      },
      includeAssets: ['yami/yami-logo.svg'],
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  build: {
    target: 'es2015',
  },
};