import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "brotliCompress", // Uses Brotli compression
      ext: ".br",
      threshold: 1024, // Only compress files larger than 1KB
    }),
    compression({
      algorithm: "gzip", // Uses Gzip as a fallback
      ext: ".gz",
      threshold: 1024,
    }),
  ],
});