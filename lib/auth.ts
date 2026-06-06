import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        provider: { label: "Provider", type: "text" },
      },
      async authorize(credentials) {
        const email =
          (credentials?.provider === "google"
            ? "demo+google@lca-compass.dk"
            : credentials?.provider === "microsoft"
              ? "demo+microsoft@lca-compass.dk"
              : (credentials?.email as string)) ?? "demo@lca-compass.dk"

        const name =
          credentials?.provider === "google"
            ? "Google Demo Bruger"
            : credentials?.provider === "microsoft"
              ? "Microsoft Demo Bruger"
              : "Demo Bruger"

        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name,
            role: "USER",
            locale: "da",
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})
