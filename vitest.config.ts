import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    alias: {
        '@/': new URL('./src/', import.meta.url).pathname,
    },
    coverage: {
        provider: 'v8',
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/coverage/**',
          '**/.{next,idea,git,cache,output,temp}/**',
          '**/**.config.*',
          '**/**.d.*',
          './src/lib/**',
        ],
    },
  },
})