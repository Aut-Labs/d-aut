import { defineConfig, Plugin } from 'vite';
import path, { resolve } from 'path';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';
import handlebars from 'vite-plugin-handlebars';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    eslint({
      cache: false,
      include: ['./src/**/*.ts', './src/**/*.tsx'],
      exclude: [],
    }),
    viteTsconfigPaths(),
    svgrPlugin(),
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }) as Plugin,
  ],
  build: {
    outDir: 'build',
    lib: {
      formats: ['es', 'umd'],
      name: 'index',
      fileName: (format) => `index.${format}.js`,
      entry: path.resolve('src', 'index.tsx'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api-server/': '...',
      '/authorization/': '...',
    },
  },
});
