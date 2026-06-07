import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@mediapipe/tasks-vision"],
  },
  resolve: {
    alias: {
      "@mediapipe/tasks-vision": "/src/mocks/mediapipe.js",
    },
  },
  build: {
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          fiber: ["@react-three/fiber", "@react-three/drei"],
          rapier: ["@react-three/rapier"],
          gsap: ["gsap"],
        },
      },
    },
  },
});
