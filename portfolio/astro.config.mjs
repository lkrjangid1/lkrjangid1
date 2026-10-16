import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://lkrjangid-portfolio.web.app',
  trailingSlash: 'never',
  // Inline CSS so first paint needs no extra requests (CSP already allows inline styles).
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/404') })],
  image: {
    domains: ['raw.githubusercontent.com'],
  },
  // Keep scripts as external files so the CSP in firebase.json can use script-src 'self'.
  // Also let the dev server read screen_shots/ one level up in the profile repo.
  vite: { build: { assetsInlineLimit: 0 }, server: { fs: { allow: ['..'] } } },
});
