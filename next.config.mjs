/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    experimental: {
        turbo: false,
    },

    //added manually
    images: {
        domains: ["cardikhao-production.up.railway.app"], // 👈 Allow images from localhost
    },
};

export default nextConfig;
