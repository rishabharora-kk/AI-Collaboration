import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

// Mock user database - in a real app, this would be your database
const mockUsers = [
  {
    id: "1",
    email: "demo@example.com",
    password: "demo123",
    name: "Demo User",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    email: "test@example.com",
    password: "test123",
    name: "Test User",
    image: "/placeholder.svg?height=40&width=40",
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@example.com" },
        password: { label: "Password", type: "password", placeholder: "demo123" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = mockUsers.find(
          (user) => user.email === credentials.email && user.password === credentials.password,
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID || "529259179445-n22h2h2ufgb2oa5lo9ppvv4kc08qqo93.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "Ov23liBnNeWikyJnVCao",
      clientSecret: process.env.GITHUB_SECRET || "14d0a42be77a0509a0034682fb8713ffa057f4fb",
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
}
