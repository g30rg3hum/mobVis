/* eslint-disable @typescript-eslint/no-require-imports */
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../lib/prisma";
import { NextAuthOptions } from "next-auth";

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
