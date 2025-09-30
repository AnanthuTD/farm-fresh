/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/admin",
        destination: "/admin/analytics",
      },
    ];
  },
};

export default nextConfig;
