const path = await import('node:path').then((m) => m.default);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.dirname(new URL(import.meta.url).pathname),
  images: {
    // Explicit allow-list keeps next/image from being abused with arbitrary
    // qualities (required from Next 16 on).
    qualities: [70, 72, 78, 82],
  },
};

export default nextConfig;
