const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  // Disable Next.js built-in font optimization to prevent server-side
  // Google Fonts downloads that fail in restricted network environments.
  // Fonts are loaded via browser @import in globals.css instead.
  optimizeFonts: false,
  experimental: {
    optimizeCss: false,
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  // Optimize images
  images: {
    domains: ['images.unsplash.com'],
  },
  // Content Security Policy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' data:",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://*.vercel.app https://clerk.onwa-eight.vercel.app https://challenges.cloudflare.com https://*.turnstile.cloudflare.com https://js.paystack.co https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms",
              "script-src-elem 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://*.clerk.com https://*.vercel.app https://clerk.onwa-eight.vercel.app https://challenges.cloudflare.com https://*.turnstile.cloudflare.com https://js.paystack.co https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms",
              "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              `connect-src 'self' ws: wss: https://*.clerk.accounts.dev https://*.clerk.com https://*.vercel.app https://clerk.onwa-eight.vercel.app https://clerk-telemetry.com https://*.turnstile.cloudflare.com https://api.paystack.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.clarity.ms ${isDev ? 'ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:*' : ''}`.trim(),
              "frame-src 'self' https://challenges.cloudflare.com https://*.turnstile.cloudflare.com https://checkout.paystack.com https://*.clerk.com https://*.clerk.accounts.dev https://*.vercel.app",
              "worker-src 'self' blob:",
            ].join('; ')
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
