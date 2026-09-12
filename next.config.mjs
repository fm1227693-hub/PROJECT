/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/diagnostic/math', destination: '/math-diagnostic', permanent: true },
      { source: '/diagnostic/english', destination: '/english-diagnostic', permanent: true },
      { source: '/subjects/math', destination: '/math', permanent: true },
      { source: '/subjects/english', destination: '/english', permanent: true },
      { source: '/student/diagnostic/math/test', destination: '/student/diagnostic/math', permanent: true },
      { source: '/student/diagnostic/english/test', destination: '/student/diagnostic/english', permanent: true },
      { source: '/student/diagnostic/math-analysis', destination: '/student/diagnostic/analysis', permanent: true },
      { source: '/student/diagnostic/english-analysis', destination: '/student/diagnostic/analysis', permanent: true },
      { source: '/student/recommended-plan', destination: '/student/recommendations', permanent: true },
      { source: '/teacher/students/:id', destination: '/teacher/students', permanent: true },
    ];
  },
  allowedDevOrigins: ['*.e2b.app', 'localhost', '127.0.0.1'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
