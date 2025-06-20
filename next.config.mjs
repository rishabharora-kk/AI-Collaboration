/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "529259179445-n22h2h2ufgb2oa5lo9ppvv4kc08qqo93.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GITHUB_ID: process.env.GITHUB_ID || "Ov23liBnNeWikyJnVCao",
    GITHUB_SECRET: process.env.GITHUB_SECRET || "",
    GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY || "",
    NEXT_PUBLIC_GOOGLE_ENABLED: process.env.NEXT_PUBLIC_GOOGLE_ENABLED || "true",
    NEXT_PUBLIC_GITHUB_ENABLED: process.env.NEXT_PUBLIC_GITHUB_ENABLED || "true",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    unoptimized: true,
  },
}

export default nextConfig
