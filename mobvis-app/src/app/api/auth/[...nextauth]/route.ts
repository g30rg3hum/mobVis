import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

// handles requests to /api/auth/signIn, signOut etc.
export { handler as GET, handler as POST };
