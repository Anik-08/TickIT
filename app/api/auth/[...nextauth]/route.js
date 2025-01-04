import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb"; // MongoDB connection utility
import User from "@/models/user"; // User model
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        try {
          console.log("Connecting to MongoDB...");
          await connectMongoDB();

          console.log("Finding user by email:", email);
          const user = await User.findOne({ email });
          if (!user) {
            console.log("User not found");
            return null; // Return null if user not found
          } else {
            console.log("User found:", user);
          }

          console.log("Comparing passwords...");
          const test_pass = await bcrypt.hash(password, 10);
          const passwordsMatch = await bcrypt.compare(test_pass, user.password);
          console.log("Password Match:", passwordsMatch);
          if (passwordsMatch) {
            console.log("Invalid password");
            return null; // Return null if passwords don't match
          }

          console.log("User authenticated successfully");
          return {
            name: user.name,
            email: user.email,
            _id: user._id.toString(),
          };
        } catch (error) {
          console.error("Error during authentication:", error);
          return null; // Return null in case of error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = { ...session.user, _id: token.userId };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
