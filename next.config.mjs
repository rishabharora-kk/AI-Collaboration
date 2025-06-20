/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://v0-next-js-community-starter-y1-sigma.vercel.app',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '529259179445-n22h2h2ufgb2oa5lo9ppvv4kc08qqo93.apps.googleusercontent.com',
    GITHUB_ID: process.env.GITHUB_ID || 'Ov23liBnNeWikyJnVCao',
    NEXT_PUBLIC_GOOGLE_ENABLED: process.env.GOOGLE_CLIENT_SECRET ? 'true' : 'false',
    NEXT_PUBLIC_GITHUB_ENABLED: process.env.GITHUB_SECRET ? 'true' : 'false',
  },
}

export default nextConfig
