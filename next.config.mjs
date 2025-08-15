/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    experimental: {
        turbo: false,
    },
    poweredByHeader: false,

    //added manually
    images: {
        domains: ["api.gadidikhao.com", "localhost"], // 👈 Allow images from localhost.
        // domains: ["localhost"],
    },
};

export default nextConfig;
