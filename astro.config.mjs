// sparkable-preview-config: v2
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const previewBase = process.env.PREVIEW_BASE;

const require = createRequire(import.meta.url);
function detectCmsPackage() {
  try {
    require.resolve('@sparkable-cms/cms/runtime/site-settings.ts');
    return true;
  } catch {
    return (
      existsSync(fileURLToPath(new URL('./node_modules/@sparkable-cms/cms', import.meta.url))) ||
      existsSync(fileURLToPath(new URL('../../node_modules/@sparkable-cms/cms', import.meta.url)))
    );
  }
}
const hasCmsPackage = detectCmsPackage();
const cmsAliases = hasCmsPackage
  ? {}
  : {
      '@sparkable-cms/cms/runtime/SparkableHead.astro': fileURLToPath(
        new URL('./src/stubs/SparkableHead.astro', import.meta.url),
      ),
      '@sparkable-cms/cms/runtime/SparkableFooter.astro': fileURLToPath(
        new URL('./src/stubs/SparkableFooter.astro', import.meta.url),
      ),
      '@sparkable-cms/cms/runtime': fileURLToPath(
        new URL('./src/stubs/sparkable-runtime.ts', import.meta.url),
      ),
      '@sparkable-cms/cms/content': fileURLToPath(
        new URL('./src/stubs/sparkable-content.ts', import.meta.url),
      ),
    };

if (!hasCmsPackage) {
  console.warn('\n⚠️  @sparkable-cms/cms is not installed — using no-op stubs.');
}

const integrations = [sitemap()];

if (process.env.SPARKABLE_CMS === 'true' && hasCmsPackage) {
  const { default: sparkableCms } = await import('@sparkable-cms/cms');
  integrations.push(sparkableCms());
}

export default defineConfig({
  site: 'https://www.westenddentalcentre.com',
  base: previewBase || undefined,
  output: 'static',
  integrations,
  devToolbar: {
    enabled: false,
  },
  vite: {
    resolve: {
      alias: cmsAliases,
    },
    plugins: [tailwindcss()],
    server: {
      ...(previewBase && { hmr: false }),
      ...((previewBase || process.env.FLY_APP_NAME) && {
        watch: { usePolling: true, interval: 500 },
      }),
    },
  },
});
