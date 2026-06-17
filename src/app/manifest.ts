import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Palpiteiros Copa 2026',
    short_name: 'Palpiteiros',
    description: 'Bolão da Copa do Mundo 2026',
    start_url: '/predictions',
    display: 'standalone',
    background_color: '#0D0F0E',
    theme_color: '#00E676',
    orientation: 'portrait',
    icons: [
      {
        src: '/api/pwa-icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/api/pwa-icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
