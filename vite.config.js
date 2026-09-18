import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // The Firebase SDK is an optional dependency used only when
      // USE_MOCK_DATA is disabled. We don't ship it in the hackathon
      // bundle, so mark these bare specifiers as external to avoid
      // "could not resolve" errors at build time.
      external: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    },
  }
});
