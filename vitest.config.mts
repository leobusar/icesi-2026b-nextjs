import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/features/**', 'src/shared/**'],
      // .tsx (componentes) y los puntos de ensamblaje no se miden aquí.
      exclude: ['**/*.test.ts', '**/testing/**', '**/*.tsx', '**/index.ts'],
    },    
  },
});
