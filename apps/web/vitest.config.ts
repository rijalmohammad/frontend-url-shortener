import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/app/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'vitest.setup.ts',
        '**/__tests__/**',
      ],
      include: [
        'src/components/**/*.{ts,tsx}',
        'src/context/**/*.{ts,tsx}',
        'src/hooks/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});