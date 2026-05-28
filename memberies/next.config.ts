import "dotenv/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.AUTH_IP ? JSON.parse(process.env.AUTH_IP) : [],
};

export default nextConfig;
