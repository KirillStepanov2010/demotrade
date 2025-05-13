// next.config.js
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
        pathname: "/coins/images/**",
      },
      // Можно добавить другие шаблоны:
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/**",
      },
    ],
    // Дополнительные настройки изображений (опционально)
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60, // 60 секунд
  },
  // Другие настройки Next.js...
}

export default nextConfig
