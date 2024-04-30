import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      credentials: {},
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
        });

        if (!user) {
          throw new Error("User doesn't exist");
        }

        const cmpPass = user && bcrypt.compareSync(password, user.password);

        if (cmpPass) {
          return user;
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async session(session, user, token) {
      if (user !== null) {
        session.user = user;
      }
      return await session;
    },

    async jwt({ token, user }) {
      return await token;
    },
  },
});

export { handler as GET, handler as POST };
