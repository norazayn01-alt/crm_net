import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // @ts-ignore
  allowedDevOrigins: ['10.50.12.71', 'localhost'],
};

export default nextConfig;
