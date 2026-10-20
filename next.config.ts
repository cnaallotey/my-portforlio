import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the home directory made Next infer ~ as the
  // workspace root, which left the dev server serving stale CSS.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
