import NextAuth from "next-auth/next";
import type { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  fetchUser,
  signInFunc,
  validateCredentials,
} from "@/lib/auth-utilis/actions";

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "Email" },
        password: { label: "email", type: "text", placeholder: "Password" },
      },
      async authorize(credentials, req) {
        const isValid = await validateCredentials(req);
        if (isValid) {
          const user = await fetchUser(req);
          return user;
        } else {
          return false;
        }
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24,
  },

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const result = await signInFunc(profile, credentials);
      return result || false;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      token.accessToken = account?.access_token;
      return token;
    },
  },
};

export default NextAuth(authOptions);
