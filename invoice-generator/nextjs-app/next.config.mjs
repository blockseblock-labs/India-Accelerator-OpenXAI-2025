/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Optimization for development
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 800,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};


export default nextConfig;
