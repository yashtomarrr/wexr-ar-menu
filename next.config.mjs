/**
 * Next.js configuration.
 * - `transpilePackages` lets Next compile the three.js ecosystem (three / R3F / drei)
 *   which ship modern ESM.
 * - Remote image domains are left open for demo image hosts; lock these down per client.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
