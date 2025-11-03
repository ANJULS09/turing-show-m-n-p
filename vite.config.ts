import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 👇 Base path for GitHub Pages deployment
  base: mode === "production" ? "/turing-show-m-n-p/" : "/",

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    // Enable Lovable tagging only in development mode
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    outDir: "dist", // Default build folder
    sourcemap: true, // Helps debugging in production
  },
}));