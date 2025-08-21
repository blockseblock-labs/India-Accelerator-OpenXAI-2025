/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    webpackBuildWorker: true,
  },
};

export default nextConfig; 