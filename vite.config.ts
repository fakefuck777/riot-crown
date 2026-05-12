import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    remix({ presets: [hydrogen.preset()] }),
    tsconfigPaths(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    noExternal: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'gsap',
    ],
    // Use browser-compatible conditions for SSR — MiniOxygen is a Web Worker,
    // not a Node process. This routes react-dom to its browser SSR build.
    resolve: {
      conditions: ['worker', 'browser', 'module', 'import', 'default'],
    },
    optimizeDeps: {
      include: ['gsap'],
    },
  },
  optimizeDeps: {
    include: ['gsap', 'three'],
    exclude: ['@shopify/hydrogen'],
  },
});
