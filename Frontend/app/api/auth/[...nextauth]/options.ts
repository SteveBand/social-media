import NextAuth from "next-auth/next";
import type { AuthOptions, CookiesOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  fetchUser,
  signInFunc,
  validateCredentials,
} from "@/lib/auth-utilis/actions";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials, req) {
        if (!req.body) return null;
        const isValid = await validateCredentials(req);
        if (!isValid) return null;
        const { email, password } = req.body;
        const user = await fetchUser(email);
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) return null;
        const userObj = {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          id: user.id,
        };
        return userObj;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24,
  },

  pages: {
    signIn: "localhost:3000/login",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const result = await signInFunc(profile, credentials);
      return result || false;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }: any) {
      const encodedToken = jwt.sign(token, process.env.JWT_SECRET as string);
      cookies().set("access_token", encodedToken);
      session.token = encodedToken;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

export default NextAuth(authOptions);
