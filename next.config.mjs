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
        domains: ["localhost"], // 👈 Allow images from localhost
    },
};

export default nextConfig;
