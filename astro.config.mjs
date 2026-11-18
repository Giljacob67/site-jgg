import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jgggroup.com.br',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  compressHTML: true,
});
