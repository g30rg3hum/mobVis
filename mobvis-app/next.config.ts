import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/dmo_extraction",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/dmo_extraction"
            : "/api/dmo_extraction",
      },
    ];
  },
};

export default nextConfig;
