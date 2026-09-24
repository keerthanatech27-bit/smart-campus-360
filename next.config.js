/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel handles Next.js natively — no special output needed.
  // Silence the Firebase prerender errors by opting all pages into dynamic rendering.
  experimental: {},
};

module.exports = nextConfig;
