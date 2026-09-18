import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// 本番では nginx が /urlshortener/ 配下でこのアプリを配信するため base を合わせる
export default defineConfig({
  base: "/urlshortener/",
  plugins: [vue()],
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:80",
    },
  },
});
