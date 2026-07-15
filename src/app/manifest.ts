import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EliteHub',
    short_name: 'EliteHub',
    description: 'India ke creators, seedha apne fans se kamayein',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#F5C518',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
  };
}
