import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string | null
      kycStatus: string | null
      handle: string | null
    } & DefaultSession["user"]
  }
}
