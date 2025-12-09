import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 1. SETTING: Update silently in the background
      registerType: 'autoUpdate', 
      
      // 2. SETTING: Cache these specific files instantly
      includeAssets: ['icon.svg', 'rain.mp3', 'fire.mp3', 'forest.ogg'], 
      
      // 3. SETTING: The Manifest (Moved from public folder to here)
      manifest: {
        name: 'Nudge',
        short_name: 'Nudge',
        description: 'A gentle companion for low energy days.',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      
      // 4. SETTING: Workbox (The Caching Engine) configuration
      workbox: {
        // Increase the limit for files to 5MB (so sounds don't get rejected)
        maximumFileSizeToCacheInBytes: 5000000,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,ogg}']
      }
    })
  ],
})