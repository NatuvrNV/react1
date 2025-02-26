import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: "brotliCompress", ext: ".br" }), // Compress JS with Brotli
    compression({ algorithm: "gzip", ext: ".gz" }), // Gzip fallback
  ],
  build: {
    sourcemap: false, // Disable source maps in production
    minify: "terser", // Use Terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        drop_debugger: true, // Remove debugger statements
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Moves third-party libraries to a separate chunk
          }
        },
      },
    },
  },
});
