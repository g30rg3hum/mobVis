/* eslint-disable @typescript-eslint/no-require-imports */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../../lib/prisma";

const bcrypt = require("bcrypt");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // logic to check against credentials supplied.
        const email = credentials?.email.toLowerCase();
        const password = credentials?.password;

        // try to find a user with the email.
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          // compare password.
          const checkPassword = await bcrypt.compare(password, user.password);

          if (checkPassword) {
            return { id: user.id.toString(), email: user.email }; // allow email information to be circulated.
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
};

export const handler = NextAuth(authOptions);

// handles requests to /api/auth/signIn, signOut etc.
export { handler as GET, handler as POST };
