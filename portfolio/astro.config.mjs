import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lkrjangid-portfolio.web.app',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/404') })],
  image: {
    domains: ['raw.githubusercontent.com'],
  },
  // Keep scripts as external files so the CSP in firebase.json can use script-src 'self'.
  vite: { build: { assetsInlineLimit: 0 } },
});
