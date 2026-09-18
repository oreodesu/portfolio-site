import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 本番ではnginxが1つのオリジンに集約している。開発サーバーでも同じパス構成で
    // 動くよう、このアプリが持たないパスはnginx (ポート80) へ転送する。
    proxy: {
      "/api": "http://localhost:80",
      "/contact": "http://localhost:80",
      "/urlshortener": "http://localhost:80",
      // 前方一致だと /src/... まで巻き込んでしまうため、正規表現で /s/ のみに限定する
      "^/s/": "http://localhost:80",
    },
  },
});
