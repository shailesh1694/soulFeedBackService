import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs"
import UserModel from "./model/user.model";
import dbConnet from "./lib/dbConnect";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "identifier", type: 'text' },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any, request): Promise<any> {
        await dbConnet()
        let user = null
        try {
          user = await UserModel.findOne({ $or: [{ email: credentials.identifier }, { username: credentials.identifier }] })
          if (!user) {
            return null
          }
          if (!user.isVerified) {
            return null
          }
          const isPasswordMath = await bcryptjs.compare(credentials.password, user.password)
          if (isPasswordMath) {
            return user;
          } else {
            return null
          }
          return user
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" }
})

