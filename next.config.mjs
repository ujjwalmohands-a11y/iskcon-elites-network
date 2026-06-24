/** @type {import('next').NextConfig} */
const ContentSecurityPolicy = `
 default-src 'self';
 script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev;
 style-src 'self' 'unsafe-inline';
 img-src 'self' blob: data: https://img.clerk.com https://*.cloudflarestorage.com https://*.s3.amazonaws.com;
 media-src 'self' https://*.cloudflarestorage.com https://*.s3.amazonaws.com https://www.youtube.com;
 frame-src 'self' https://www.youtube.com https://clerk.com;
 connect-src 'self' https://api.clerk.com https://api.formspree.io;
 font-src 'self' data:;
 object-src 'none';
 base-uri 'self';
 form-action 'self' https://formspree.io;
 frame-ancestors 'none';
 block-all-mixed-content;
 upgrade-insecure-requests;
`;

const securityHeaders = [
 { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim() },
 { key: 'X-Frame-Options', value: 'DENY' },
 { key: 'X-Content-Type-Options', value: 'nosniff' },
 { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
 { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
 { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' }
];

const nextConfig = {
 reactStrictMode: true,
 images: {
 formats: ['image/avif', 'image/webp'],
 remotePatterns: [
 { protocol: 'https', hostname: 'img.clerk.com' },
 { protocol: 'https', hostname: '**.cloudflarestorage.com' },
 ],
 },
 async headers() {
 return [{ source: '/(.*)', headers: securityHeaders }];
 },
};

export default nextConfig;
