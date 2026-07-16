/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
