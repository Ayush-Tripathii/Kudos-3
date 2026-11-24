import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ayush-tripathii.github.io',
  base: '/Kudos-3',
  compressHTML: true,
  build: { inlineStylesheets: 'always', assets: '_kudos' },
  vite: { build: { cssMinify: true } },
});
