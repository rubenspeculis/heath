import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FMPApiClient',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: ['axios', 'zod'],
      output: {
        globals: {
          axios: 'axios',
          zod: 'zod',
        },
      },
    },
    outDir: 'dist',
    sourcemap: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});