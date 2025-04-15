import { VitePWA } from 'vite-plugin-pwa';
import { sveltekit } from '@sveltejs/kit/vite';

export default {
  plugins: [
    sveltekit(),
    VitePWA({
      registerType: 'autoUpdate',
	    injectRegister: 'auto',
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
            type: 'image/jpeg'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpeg,webmanifest}']
      },
	  devOptions: {
		enabled: true
	  }
    })
  ],
  build: {
    target: 'es2015',
  }
};
