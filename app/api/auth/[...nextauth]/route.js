import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";  // Import MongoDB connection utility
import User from "@/models/user"; // Import your User model
import bcrypt from "bcryptjs";

// NextAuth Configuration
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
          await connectMongoDB();  // Connect to MongoDB

          // Find user by email
          const user = await User.findOne({ email });

          if (!user) {
            console.log("User not found");
            return null;  // Return null if user not found
          }

          // Compare password with hash
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) {
            console.log("Invalid password");
            return null;  // Return null if passwords don't match
          }

          // Return user object if authentication is successful
          return {
            name: user.name,
            email: user.email,
            _id: user._id, // Include _id here
          };
        } catch (error) {
          console.error("Error during authentication: ", error);
          return null;  // Return null in case of error
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",  // Use JWT for session
  },
  callbacks: {
    async jwt({ token, user }) {
      // Store user information in JWT token
      if (user) {
        token.userId = user._id;  // Add userId to token
      }
      return token;
    },
    async session({ session, token }) {
      // Add user information to session
      if (token) {
        session.user._id = token.userId;  // Add userId to session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,  // Secure the session with a secret key
  pages: {
    signIn: "/login",  // Redirect to login page on sign-in failure
    error: "/auth/error",  // Optional: Custom error page
  },
};

const handler = NextAuth(authOptions);

// Export handler for GET and POST methods
export { handler as GET, handler as POST };
