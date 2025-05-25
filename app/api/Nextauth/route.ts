import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // Add other providers like GitHub, Facebook, etc.
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "database",
    },
    pages: {
        signIn: '/auth/signin',
    },
})

export { handler as GET, handler as POST }
