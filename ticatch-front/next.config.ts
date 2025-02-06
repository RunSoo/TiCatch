import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  runtime: 'edge',
  // experimental: {
  //   reactCompiler: true,
  //   ppr: 'incremental'
  // }
};

export default nextConfig;
