/**
 * @format
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    poweredByHeader: false, //add header
    experimental: {
        turbo: false,
    },

    //added manually
    images: {
        domains: ["82.112.234.206"], // 👈 Allow images from localhost
        // domains: ["localhost"],
    },
};

export default nextConfig;
