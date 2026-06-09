import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@jinni/ui', '@jinni/common', '@jinni/types'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, '../../packages/ui/src/styles')],
  },
};

export default nextConfig;
