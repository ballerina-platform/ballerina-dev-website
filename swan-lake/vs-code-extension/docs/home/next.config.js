/** @type {import('next').NextConfig} */

const redirectBase = process.env.NEXT_PUBLIC_BASE_PATH
  ? `${process.env.NEXT_PUBLIC_BASE_PATH}/`
  : "";

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none';"
  }
]


const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    nextImageExportOptimizer: {
      imageFolderPath: "public/images",
      exportFolderPath: "out",
      quality: 75,
    },
  },
  env: {
    storePicturesInWEBP: true,
    generateAndUseBlurImages: true,
    distServer: "https://dist.ballerina.io",
    gitHubPath:
      "https://github.com/ballerina-platform/ballerina-dev-website/blob/master/",
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  trailingSlash: true,
  resolve: [{ path: false, fs: false }],
  experimental: {
    scrollRestoration: true,
  }
};

module.exports = nextConfig;