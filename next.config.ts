import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  // skipWaiting is not a valid option for this plugin's type definition, removing it.
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
