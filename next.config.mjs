/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // Product photos from Shopify's CDN (shop pages, once the Storefront API is connected)
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;
