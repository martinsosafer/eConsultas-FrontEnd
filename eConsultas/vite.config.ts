import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import svgo from "vite-plugin-svgo";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://vps-4110266-x.dattaweb.com:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      webp: { quality: 80 },
    }),
    svgo({
      multipass: true,
      plugins: [{
        name: "preset-default",
        params: { overrides: { removeViewBox: false } }
      }]
    }),
    visualizer({
      open: true,
      filename: "bundle-analysis.html",
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('recharts')) return 'vendor-recharts';
            if (id.includes('framer-motion')) return 'vendor-framer';
            if (id.includes('react-router-dom')) return 'vendor-router';
            if (id.includes('axios')) return 'vendor-axios';
            return 'vendor';
          }
        }
      }
    }
  }
});