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
        domains: ["api.gadidikhao.com", "82.112.234.206", "localhost"], // 👈 Allow images from localhost.
        // domains: ["localhost"],
    },
};

export default nextConfig;
