import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['react-map-gl', '@vis.gl/react-mapbox', 'mapbox-gl'],
};

export default nextConfig;
