import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // experimental: {
  //   reactCompiler: true,
  //   ppr: 'incremental'
  // }
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
