/** @type {import('next').NextConfig} */
const nextConfig = {
  // nginx で /contact に割り当てるため、アセットのパスも揃える
  basePath: "/contact",
  // Dockerイメージを小さくするため、必要な依存だけを同梱した形で出力する
  output: "standalone",
};

export default nextConfig;
