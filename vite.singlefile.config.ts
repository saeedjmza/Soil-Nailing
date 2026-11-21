import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

const stubPwaVirtualPlugin = {
  name: 'stub-virtual-pwa-register',
  resolveId(id: string) {
    if (id === 'virtual:pwa-register') return '\0virtual:pwa-register-stub';
    return null;
  },
  load(id: string) {
    if (id === '\0virtual:pwa-register-stub') {
      return 'export function registerSW() { return () => Promise.resolve(); }';
    }
    return null;
  },
};

export default defineConfig({
  plugins: [
    stubPwaVirtualPlugin,
    react(),
    tailwindcss(),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000,
    cssCodeSplit: false,
    outDir: 'dist-singlefile',
    emptyOutDir: true,
  },
});
