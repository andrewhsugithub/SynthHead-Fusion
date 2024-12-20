/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    proxyTimeout: 1000 * 60 * 5, // 5 minutes in milliseconds
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.AUTH_SERVICE_BASE_URL}/:path*`,
      },
      {
        source: "/api/upload/:path*",
        destination: `${process.env.BUCKET_SERVICE_BASE_URL}/auth/upload/:path*`,
      },
      {
        source: "/api/poll/:path*",
        destination: `${process.env.BUCKET_SERVICE_BASE_URL}/poll/:path*`,
      },
      {
        source: "/buckets/:path*",
        destination: `${process.env.BUCKET_SERVICE_BASE_URL}/buckets/:path*`,
      },
      {
        source: "/api/add_message",
        destination: `${process.env.GPT_AUDIO_SERVICE_BASE_URL}/GPTAudio`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.USER_SERVICE_BASE_URL}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.GPT_SOVITS_INFERENCE_SERVICE_BASE_URL}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.LIVEPORTRAIT_SERVICE_BASE_URL}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.MUSETALK_SERVICE_BASE_URL}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${process.env.REAL3DPORTRAIT_SERVICE_BASE_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
