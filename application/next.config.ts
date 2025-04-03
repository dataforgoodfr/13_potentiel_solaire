import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	serverExternalPackages: ['@duckdb/node-api'],
};

export default nextConfig;
